import { NextRequest, NextResponse } from "next/server";
import { getCustomerById, getOrderProducts } from "@/lib/bigcommerce";
import { findDueCustomers, shouldSkip, markSent, buildEmail, RULES, type BCOrderSummary } from "@/lib/replenishment";
import { sendReplenishmentEmail } from "@/lib/email";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

/**
 * GET /api/replenishment/run           — daily cron (Authorization: Bearer CRON_SECRET)
 * GET /api/replenishment/run?dryRun=1  — list who would be emailed, send nothing
 */
export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization") || "";
  const secret = process.env.CRON_SECRET;
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const dryRun = req.nextUrl.searchParams.get("dryRun") === "1";

  const storeHash = process.env.BIGCOMMERCE_STORE_HASH!;
  const token = process.env.BIGCOMMERCE_ACCESS_TOKEN!;
  const H = { "X-Auth-Token": token, Accept: "application/json" };

  // Orders from the last 12 months — enough to measure cadence
  const since = new Date(); since.setMonth(since.getMonth() - 12);
  const orders: BCOrderSummary[] = [];
  for (let page = 1; page <= 20; page++) {
    const r = await fetch(`https://api.bigcommerce.com/stores/${storeHash}/v2/orders?limit=250&page=${page}&min_date_created=${since.toISOString()}&sort=date_created:desc`, { headers: H });
    if (r.status === 204) break;
    if (!r.ok) return NextResponse.json({ error: `BigCommerce ${r.status}` }, { status: 502 });
    const batch = (await r.json()) as BCOrderSummary[];
    orders.push(...batch);
    if (batch.length < 250) break;
  }

  const due = findDueCustomers(orders);
  const results: Record<string, unknown>[] = [];
  let sent = 0;

  for (const c of due) {
    if (sent >= RULES.maxSendsPerRun) break;
    const customer = await getCustomerById(c.customerId);
    if (!customer?.email) { results.push({ customerId: c.customerId, skipped: "no email" }); continue; }
    const skip = shouldSkip(customer.notes || "", c);
    if (skip) { results.push({ customerId: c.customerId, email: customer.email, skipped: skip }); continue; }

    const products = await getOrderProducts(c.lastOrderId);
    const data = await buildEmail(c, customer, products.map(p => ({ sku: p.sku, name: p.name, quantity: p.quantity })));
    if (!data) { results.push({ customerId: c.customerId, email: customer.email, skipped: "no displayable items" }); continue; }

    const row = {
      customerId: c.customerId,
      email: customer.email,
      company: customer.company,
      daysSince: c.daysSince,
      typicalGap: c.medianGapDays,
      orders: c.orderCount,
      items: data.items.map(i => `${i.sku} ×${i.qty}`),
    };
    if (dryRun) { results.push({ ...row, wouldSend: true }); continue; }

    const ok = await sendReplenishmentEmail(data);
    if (ok) { await markSent(c.customerId, customer.notes || ""); sent++; }
    results.push({ ...row, sent: ok });
  }

  return NextResponse.json({
    ordersScanned: orders.length,
    dueCustomers: due.length,
    sent,
    dryRun,
    results,
  });
}
