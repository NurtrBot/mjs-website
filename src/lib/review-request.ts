import { createHmac, timingSafeEqual } from "crypto";
import { getCustomerById, updateCustomer } from "@/lib/bigcommerce";
import { BUSINESS, GOOGLE_REVIEWS } from "@/lib/business";
import type { ReviewRequestEmailData } from "@/lib/email";

/* ─────────────────────────────────────────────────────────────
   Review request ("How did we do?") engine.

   One email per order, sent 72 hours after the order was placed.
   The cron runs hourly and picks up orders that crossed the 72-hour
   mark since the last run, so a customer is asked once, three days
   out, and never twice for the same order. State lives in the
   BigCommerce customer notes:
     [REVIEW_SENT:2026-10-07:27107]   last send date + order
     [REVIEW_OPTOUT]                  unsubscribed
   ───────────────────────────────────────────────────────────── */

export const RULES = {
  delayHours: 72,
  // How late an order can still be picked up. The hourly cron normally catches an
  // order in the first run past 72h, so this is pure catch-up: it keeps a skipped
  // run (deploy, outage) from dropping a day of orders on the floor, and stops the
  // first deploy from backfilling ancient ones. Repeat sends are prevented by the
  // notes state below, not by this window.
  windowHours: 24,
  // Frequent reorderers shouldn't be asked every three days.
  minDaysBetweenSends: 60,
  maxSendsPerRun: 40,
} as const;

// incomplete, pending, refunded, cancelled, declined, disputed
const SKIP_STATUS = new Set([0, 1, 4, 5, 6, 13]);

export interface BCOrderSummary {
  id: number;
  customer_id: number;
  status_id: number;
  date_created: string;
  items_total: number;
}

export interface DueOrder {
  orderId: number;
  customerId: number;
  orderDate: Date;
  hoursSince: number;
}

const HOUR = 3600000;
const DAY = 86400000;

/** Pure: which orders crossed the 72-hour mark in this run's window. */
export function findDueOrders(orders: BCOrderSummary[], now = new Date()): DueOrder[] {
  const due: DueOrder[] = [];
  for (const o of orders) {
    if (!o.customer_id || SKIP_STATUS.has(o.status_id) || o.items_total < 1) continue;
    const placed = new Date(o.date_created);
    const hoursSince = (now.getTime() - placed.getTime()) / HOUR;
    if (hoursSince < RULES.delayHours) continue;
    if (hoursSince >= RULES.delayHours + RULES.windowHours) continue;
    due.push({ orderId: o.id, customerId: o.customer_id, orderDate: placed, hoursSince });
  }
  // Oldest first, so the longest-waiting orders go out if a run hits the send cap
  return due.sort((a, b) => b.hoursSince - a.hoursSince);
}

/* ── State in customer notes ── */
export function parseState(notes: string): { optedOut: boolean; lastSent: Date | null; lastOrderId: number | null } {
  const text = notes || "";
  const m = text.match(/\[REVIEW_SENT:(\d{4}-\d{2}-\d{2}):(\d+)\]/);
  return {
    optedOut: /\[REVIEW_OPTOUT\]/.test(text),
    lastSent: m ? new Date(m[1] + "T12:00:00Z") : null,
    lastOrderId: m ? Number(m[2]) : null,
  };
}

export function shouldSkip(notes: string, o: DueOrder, now = new Date()): string | null {
  const { optedOut, lastSent, lastOrderId } = parseState(notes);
  if (optedOut) return "opted out";
  if (lastOrderId === o.orderId) return "already emailed for this order";
  if (lastSent && (now.getTime() - lastSent.getTime()) / DAY < RULES.minDaysBetweenSends) return "emailed recently";
  return null;
}

export async function markSent(customerId: number, notes: string, orderId: number, now = new Date()) {
  const stamp = `[REVIEW_SENT:${now.toISOString().slice(0, 10)}:${orderId}]`;
  const cleaned = (notes || "").replace(/\s*\[REVIEW_SENT:[^\]]*\]/g, "").trim();
  await updateCustomer(customerId, { notes: `${cleaned} ${stamp}`.trim() });
}

export async function markOptOut(customerId: number) {
  const c = await getCustomerById(customerId);
  if (!c) return false;
  if (/\[REVIEW_OPTOUT\]/.test(c.notes || "")) return true;
  await updateCustomer(customerId, { notes: `${c.notes || ""} [REVIEW_OPTOUT]`.trim() });
  return true;
}

/* ── Signed unsubscribe links ── */
function secret() {
  return process.env.REVIEW_SECRET || process.env.CRON_SECRET || process.env.BIGCOMMERCE_CLIENT_SECRET || "";
}
export function unsubscribeSig(customerId: number) {
  return createHmac("sha256", secret()).update(`review-unsub:${customerId}`).digest("hex");
}
export function verifyUnsubscribeSig(customerId: number, sig: string) {
  const a = Buffer.from(unsubscribeSig(customerId)), b = Buffer.from(sig || "");
  return a.length === b.length && timingSafeEqual(a, b);
}

/* ── Build the email data for one due order ── */
export function buildEmail(
  o: DueOrder,
  customer: { first_name: string; email: string }
): ReviewRequestEmailData | null {
  if (!customer.email) return null;
  const site = BUSINESS.siteUrl;
  const sig = unsubscribeSig(o.customerId);
  const unsubscribeUrl = `${site}/api/reviews/unsubscribe?customerId=${o.customerId}&sig=${sig}`;
  return {
    to: customer.email,
    firstName: customer.first_name || "there",
    reviewUrl: GOOGLE_REVIEWS.writeUrl,
    unsubscribeUrl,
    preferencesUrl: unsubscribeUrl,
  };
}
