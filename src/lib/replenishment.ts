import { createHmac, timingSafeEqual } from "crypto";
import { getCustomerById, updateCustomer } from "@/lib/bigcommerce";
import { fetchProductsBySkus } from "@/lib/products-api";
import { BUSINESS } from "@/lib/business";
import type { ReplenishmentEmailData, ReplenishmentItem } from "@/lib/email";

/* ─────────────────────────────────────────────────────────────
   Replenishment ("Ready for a refill?") engine.

   Who gets an email: account customers with 2+ completed orders whose
   typical reorder gap (median days between orders) is 14–120 days, and
   who are now at 90%+ of that gap since their last order. One email per
   order cycle; state is kept in the BigCommerce customer notes:
     [REPLENISH_SENT:2026-10-07]   last send date
     [REPLENISH_OPTOUT]            unsubscribed
   ───────────────────────────────────────────────────────────── */

export const RULES = {
  minOrders: 2,
  minGapDays: 14,
  maxGapDays: 120,
  dueAtShareOfGap: 0.9,     // send once they're 90% of the way through their usual cycle
  stopAfterShareOfGap: 2.0, // stop nagging once they're way past (dormant)
  minDaysBetweenSends: 21,
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

export interface DueCustomer {
  customerId: number;
  lastOrderId: number;
  lastOrderDate: Date;
  daysSince: number;
  medianGapDays: number;
  orderCount: number;
}

const DAY = 86400000;

export function median(nums: number[]): number {
  const s = [...nums].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

// Pure: which customers are due, from a list of orders
export function findDueCustomers(orders: BCOrderSummary[], now = new Date()): DueCustomer[] {
  const byCustomer = new Map<number, BCOrderSummary[]>();
  for (const o of orders) {
    if (!o.customer_id || SKIP_STATUS.has(o.status_id) || o.items_total < 1) continue;
    (byCustomer.get(o.customer_id) || byCustomer.set(o.customer_id, []).get(o.customer_id)!).push(o);
  }

  const due: DueCustomer[] = [];
  for (const [customerId, list] of byCustomer) {
    if (list.length < RULES.minOrders) continue;
    const dates = list.map(o => new Date(o.date_created).getTime()).sort((a, b) => a - b);
    // Orders on the same day count once for cadence purposes
    const days = [...new Set(dates.map(t => Math.floor(t / DAY)))];
    if (days.length < RULES.minOrders) continue;
    const gaps = days.slice(1).map((d, i) => d - days[i]);
    const gap = median(gaps);
    if (gap < RULES.minGapDays || gap > RULES.maxGapDays) continue;

    const last = list.reduce((a, b) => (new Date(a.date_created) > new Date(b.date_created) ? a : b));
    const daysSince = Math.floor((now.getTime() - new Date(last.date_created).getTime()) / DAY);
    if (daysSince < Math.max(RULES.minGapDays, Math.round(gap * RULES.dueAtShareOfGap))) continue;
    if (daysSince > gap * RULES.stopAfterShareOfGap) continue;

    due.push({ customerId, lastOrderId: last.id, lastOrderDate: new Date(last.date_created), daysSince, medianGapDays: Math.round(gap), orderCount: list.length });
  }
  return due.sort((a, b) => b.daysSince / b.medianGapDays - a.daysSince / a.medianGapDays);
}

/* ── State in customer notes ── */
export function parseState(notes: string): { optedOut: boolean; lastSent: Date | null } {
  const optedOut = /\[REPLENISH_OPTOUT\]/.test(notes || "");
  const m = (notes || "").match(/\[REPLENISH_SENT:(\d{4}-\d{2}-\d{2})\]/);
  return { optedOut, lastSent: m ? new Date(m[1] + "T12:00:00Z") : null };
}

export function shouldSkip(notes: string, c: DueCustomer, now = new Date()): string | null {
  const { optedOut, lastSent } = parseState(notes);
  if (optedOut) return "opted out";
  if (lastSent) {
    if (lastSent > c.lastOrderDate) return "already emailed this cycle";
    if ((now.getTime() - lastSent.getTime()) / DAY < RULES.minDaysBetweenSends) return "emailed recently";
  }
  return null;
}

export async function markSent(customerId: number, notes: string, now = new Date()) {
  const stamp = `[REPLENISH_SENT:${now.toISOString().slice(0, 10)}]`;
  const cleaned = (notes || "").replace(/\s*\[REPLENISH_SENT:[^\]]*\]/g, "").trim();
  await updateCustomer(customerId, { notes: `${cleaned} ${stamp}`.trim() });
}

export async function markOptOut(customerId: number) {
  const c = await getCustomerById(customerId);
  if (!c) return false;
  if (/\[REPLENISH_OPTOUT\]/.test(c.notes || "")) return true;
  await updateCustomer(customerId, { notes: `${c.notes || ""} [REPLENISH_OPTOUT]`.trim() });
  return true;
}

/* ── Signed unsubscribe links ── */
function secret() {
  return process.env.REPLENISH_SECRET || process.env.CRON_SECRET || process.env.BIGCOMMERCE_CLIENT_SECRET || "";
}
export function unsubscribeSig(customerId: number) {
  return createHmac("sha256", secret()).update(`replenish-unsub:${customerId}`).digest("hex");
}
export function verifyUnsubscribeSig(customerId: number, sig: string) {
  const a = Buffer.from(unsubscribeSig(customerId)), b = Buffer.from(sig || "");
  return a.length === b.length && timingSafeEqual(a, b);
}

/* ── Build the email data for one due customer ── */
interface BCOrderProduct { sku: string; name: string; quantity: number }

export async function buildEmail(
  c: DueCustomer,
  customer: { first_name: string; email: string },
  orderProducts: BCOrderProduct[]
): Promise<ReplenishmentEmailData | null> {
  const lines = orderProducts.filter(p => p.sku).slice(0, 8);
  if (lines.length === 0) return null;
  const products = await fetchProductsBySkus(lines.map(l => l.sku));
  const bySku = new Map(products.map(p => [p.sku.toUpperCase(), p]));

  const items: ReplenishmentItem[] = [];
  for (const l of lines) {
    const p = bySku.get(l.sku.toUpperCase());
    if (!p || !p.images?.[0] || p.images[0].includes("placeholder")) continue;
    const pack = (p.pack || "").trim();
    const packIsSku = pack.toUpperCase() === p.sku.toUpperCase();
    const isLiner = /liner|trash bag|can liner/i.test(p.name) || p.category === "Trash Liners";
    const unit =
      /\/\s*(case|cs|carton|ct)\b|\b(case|carton)\b/i.test(pack) || isLiner ? "case"
      : /\bgal/i.test(pack) ? "gallon"
      : /\b(box|bx)\b/i.test(pack) ? "box"
      : /\bbag/i.test(pack) ? "bag"
      : /\broll/i.test(pack) ? "roll"
      : /\bpail\b/i.test(pack) ? "pail"
      : /\bdrum\b/i.test(pack) ? "drum"
      : "each";
    // Full product name, minus the trailing "(SKU)" and ® marks — no card truncation
    const cleanName = p.name.replace(/\s*\([A-Z0-9-]+\)\s*$/i, "").replace(/[®™]/g, "").trim();
    items.push({
      sku: p.sku,
      name: cleanName,
      detail: packIsSku || /^each$/i.test(pack) ? "" : pack,
      qty: l.quantity,
      unit,
      image: p.images[0],
      slug: p.slug,
    });
  }
  if (items.length === 0) return null;

  const site = BUSINESS.siteUrl;
  const cartItems = (list: ReplenishmentItem[]) => list.map(i => `${i.sku}:${i.qty}`).join(",");
  const sig = unsubscribeSig(c.customerId);
  return {
    to: customer.email,
    firstName: customer.first_name || "there",
    daysSince: c.daysSince,
    lastOrderDate: c.lastOrderDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    items,
    reorderUrl: `${site}/cart/add?items=${encodeURIComponent(cartItems(items))}&src=replenish`,
    itemUrl: (it) => `${site}/cart/add?items=${encodeURIComponent(cartItems([it]))}&src=replenish`,
    unsubscribeUrl: `${site}/api/replenishment/unsubscribe?customerId=${c.customerId}&sig=${sig}`,
    preferencesUrl: `${site}/api/replenishment/unsubscribe?customerId=${c.customerId}&sig=${sig}`,
  };
}
