import { NextRequest, NextResponse } from "next/server";
import { getOrdersSince, getOrder, getOrderProducts, getOrderShippingAddresses, updateOrderStaffNotes, getOrdersByCustomerId, getCustomerMetafield, setCustomerMetafield } from "@/lib/bigcommerce";
import { fetchProductsBySkus } from "@/lib/products-api";
import { findSds, isChemical, buildingFromAddress, SITE } from "@/lib/sds";
import { renderSdsEmail, sendSdsEmail, type SdsEmailData } from "@/lib/email";

/*
 * GET /api/sds/run                       — cron every 5 min (Authorization: Bearer CRON_SECRET)
 * GET /api/sds/run?orderId=10482&secret=… — preview the email for one order (HTML, no send)
 * GET /api/sds/run?dryRun=1              — list what would be sent
 * GET /api/sds/run?sendTest=you@x.com&skus=3158EA,40112EA&secret=… — send a sample to one address
 *
 * One email per qualifying order (any order with a chemical on it), sent once
 * the order is at least 5 minutes old, retried on later runs until it is
 * 2 hours old. Cancelled / incomplete orders are skipped. A marker in the
 * order's staff notes stops duplicates.
 *
 * Each chemical is emailed to a customer ONCE. The SKUs already sent live in
 * the customer metafield mjs/sds_emailed_skus; a reorder of the same chemicals
 * sends nothing, and an order that mixes old and new chemicals only lists the
 * new ones. The first time a customer is seen, the list is seeded from any
 * earlier orders that already carry the sent marker, so customers emailed
 * before this rule existed are not emailed again for the same sheets.
 */

export const dynamic = "force-dynamic";
const SKIP_STATUS = new Set([0, 1, 4, 5, 6, 13]);
const MARK = "[sds-email sent]";
const MARK_SKIP = "[sds-email skipped: sheets already sent]";
const SENT_KEY = "sds_emailed_skus";
const MIN_AGE_MS = 5 * 60 * 1000;
const WINDOW_MS = 2 * 60 * 60 * 1000;

type BCOrder = { id: number; date_created: string; status_id: number; items_total: number; staff_notes?: string; customer_id?: number; shipping_address_count?: number; billing_address?: { first_name?: string; email?: string } };

/* Chemicals this customer has already received a sheet email for */
async function getSentSkus(customerId: number): Promise<{ skus: Set<string>; seeded: boolean }> {
  const mf = await getCustomerMetafield(customerId, SENT_KEY);
  if (mf) {
    try { return { skus: new Set((JSON.parse(mf.value) as string[]).map(s => s.toUpperCase())), seeded: false }; } catch { /* fall through and rebuild */ }
  }
  // First time we see this customer: rebuild from orders that were emailed before the per-chemical rule
  const skus = new Set<string>();
  const past = (await getOrdersByCustomerId(customerId, 50)) as BCOrder[];
  for (const o of past) {
    if (!(o.staff_notes || "").includes(MARK)) continue;
    const lines = (await getOrderProducts(o.id)) as { sku?: string; name?: string }[];
    for (const l of lines) { const sku = (l.sku || "").toUpperCase(); if (sku && (findSds(sku) || isChemical({ name: l.name || "" }))) skus.add(sku); }
  }
  return { skus, seeded: true };
}

async function rememberSentSkus(customerId: number, prior: Set<string>, sent: string[]) {
  const all = [...new Set([...prior, ...sent.map(s => s.toUpperCase())])].sort();
  await setCustomerMetafield(customerId, SENT_KEY, JSON.stringify(all));
}

async function buildEmailData(order: BCOrder): Promise<SdsEmailData | null> {
  const [lines, ships] = await Promise.all([getOrderProducts(order.id), order.shipping_address_count === 0 ? Promise.resolve([]) : getOrderShippingAddresses(order.id)]);
  const building = buildingFromAddress(ships[0]);
  const skus = [...new Set((lines as { sku?: string }[]).map(l => (l.sku || "").toUpperCase()).filter(Boolean))];
  if (skus.length === 0) return null;
  const products = await fetchProductsBySkus(skus);
  const by = new Map(products.map(p => [p.sku.toUpperCase(), p]));
  const items: SdsEmailData["items"] = [];
  for (const l of lines as { sku?: string; name?: string; quantity?: number }[]) {
    const sku = (l.sku || "").toUpperCase();
    const p = by.get(sku);
    const sds = findSds(sku);
    if (!sds && !isChemical({ name: p?.name || l.name || "", category: p?.category, subcategory: p?.subcategory })) continue;
    if (items.some(i => i.sku === sku)) continue;
    items.push({ sku, name: p?.cardTitle || p?.name || l.name || sku, image: p?.images?.[0] || `${SITE}/images/placeholder-product.svg`, slug: p?.slug || null, qty: Number(l.quantity) || 1, sdsUrl: sds?.url || null, revised: sds?.revised || null });
  }
  if (items.length === 0) return null;
  const email = order.billing_address?.email || "";
  if (!email) return null;
  const d = new Date(order.date_created);
  return {
    to: email,
    firstName: order.billing_address?.first_name || "there",
    orderId: order.id,
    orderDate: d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    building,
    items,
    binderUrl: `${SITE}/account?tab=sds`,
    requestUrl: (sku: string) => `${SITE}/account?tab=sds&request=${encodeURIComponent(sku)}`,
  };
}

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization") || "";
  const qsSecret = req.nextUrl.searchParams.get("secret");
  if (!secret || (auth !== `Bearer ${secret}` && qsSecret !== secret)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Send a sample to one address, built from real products (no order needed)
  const sendTest = req.nextUrl.searchParams.get("sendTest");
  if (sendTest) {
    const skus = (req.nextUrl.searchParams.get("skus") || "3158EA,40112EA,41212EA").split(",").map(s => s.trim().toUpperCase()).filter(Boolean).slice(0, 10);
    const products = await fetchProductsBySkus(skus);
    const by = new Map(products.map(p => [p.sku.toUpperCase(), p]));
    const items: SdsEmailData["items"] = skus.map((sku, i) => {
      const p = by.get(sku); const sds = findSds(sku);
      return { sku, name: p?.cardTitle || p?.name || sku, image: p?.images?.[0] || `${SITE}/images/placeholder-product.svg`, slug: p?.slug || null, qty: [2, 1, 4][i % 3], sdsUrl: sds?.url || null, revised: sds?.revised || null };
    });
    const data: SdsEmailData = {
      to: sendTest, firstName: req.nextUrl.searchParams.get("firstName") || "Zack", orderId: 10482,
      orderDate: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      building: req.nextUrl.searchParams.get("building") || "Anaheim Warehouse", items,
      binderUrl: `${SITE}/account?tab=sds`, requestUrl: (sku: string) => `${SITE}/account?tab=sds&request=${encodeURIComponent(sku)}`,
    };
    if (req.nextUrl.searchParams.get("preview") === "1") return new NextResponse(renderSdsEmail(data).html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
    const sent = await sendSdsEmail(data);
    return NextResponse.json({ sent, to: sendTest, items: items.map(i => ({ sku: i.sku, name: i.name, sheet: !!i.sdsUrl })) });
  }

  // Which chemicals a customer has already been sent (read only)
  const sentFor = Number(req.nextUrl.searchParams.get("sentFor"));
  if (sentFor) {
    const got = await getSentSkus(sentFor);
    return NextResponse.json({ customerId: sentFor, source: got.seeded ? "rebuilt from past orders" : "metafield", skus: [...got.skus].sort() });
  }

  // Preview one order
  const previewId = Number(req.nextUrl.searchParams.get("orderId"));
  if (previewId) {
    const order = (await getOrder(previewId)) as BCOrder | null;
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    const data = await buildEmailData(order);
    if (!data) return NextResponse.json({ error: "No chemicals on this order" }, { status: 404 });
    return new NextResponse(renderSdsEmail(data).html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
  }

  const dryRun = req.nextUrl.searchParams.get("dryRun") === "1";
  const now = Date.now();
  const since = new Date(now - WINDOW_MS).toISOString();
  const orders = (await getOrdersSince(since, 50)) as BCOrder[];
  const results: { orderId: number; action: string }[] = [];

  for (const o of orders) {
    const age = now - new Date(o.date_created).getTime();
    if (SKIP_STATUS.has(o.status_id) || o.items_total < 1) { results.push({ orderId: o.id, action: "skip:status" }); continue; }
    if (age < MIN_AGE_MS) { results.push({ orderId: o.id, action: "wait" }); continue; }
    if ((o.staff_notes || "").includes("[sds-email")) { results.push({ orderId: o.id, action: "skip:sent" }); continue; }
    // Re-read the order so a cancellation in the last few minutes is respected
    const fresh = (await getOrder(o.id)) as BCOrder | null;
    if (!fresh || SKIP_STATUS.has(fresh.status_id)) { results.push({ orderId: o.id, action: "skip:cancelled" }); continue; }
    const data = await buildEmailData(fresh);
    if (!data) { results.push({ orderId: o.id, action: "skip:no-chemicals" }); continue; }

    // Once per chemical per customer: drop anything this customer has already been sent
    const customerId = Number(fresh.customer_id) || 0;
    let prior = new Set<string>();
    if (customerId) {
      const got = await getSentSkus(customerId);
      prior = got.skus;
      const before = data.items.length;
      data.items = data.items.filter(i => !prior.has(i.sku.toUpperCase()));
      if (data.items.length === 0) {
        if (!dryRun) { try { await updateOrderStaffNotes(o.id, `${fresh.staff_notes || ""}${fresh.staff_notes ? "\n" : ""}${MARK_SKIP} ${new Date().toISOString()}`); } catch {} }
        if (got.seeded && !dryRun) await rememberSentSkus(customerId, prior, []);
        results.push({ orderId: o.id, action: `skip:already-sent (${before} chemical${before === 1 ? "" : "s"} on file)` });
        continue;
      }
      if (before !== data.items.length) results.push({ orderId: o.id, action: `trimmed:${before - data.items.length} already sent` });
    }

    if (dryRun) { results.push({ orderId: o.id, action: `would-send:${data.items.length} items → ${data.to}` }); continue; }
    const sent = await sendSdsEmail(data);
    if (sent) {
      try { await updateOrderStaffNotes(o.id, `${fresh.staff_notes || ""}${fresh.staff_notes ? "\n" : ""}${MARK} ${new Date().toISOString()}`); } catch {}
      if (customerId) await rememberSentSkus(customerId, prior, data.items.map(i => i.sku));
      results.push({ orderId: o.id, action: `sent:${data.items.length} items` });
    } else {
      results.push({ orderId: o.id, action: "failed (will retry)" });
    }
  }
  return NextResponse.json({ checked: orders.length, results });
}
