import { NextRequest, NextResponse } from "next/server";
import { getCustomerById } from "@/lib/bigcommerce";
import { findDueOrders, shouldSkip, markSent, buildEmail, RULES, type BCOrderSummary } from "@/lib/review-request";
import { sendReviewRequestEmail } from "@/lib/email";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

/**
 * GET /api/reviews/run           — hourly cron (Authorization: Bearer CRON_SECRET)
 * GET /api/reviews/run?dryRun=1  — list who would be emailed, send nothing
 *
 * Picks up orders that crossed the 72-hour mark since the previous run.
 */
export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization") || "";
  const secret = process.env.CRON_SECRET;
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const dryRun = req.nextUrl.searchParams.get("dryRun") === "1";

  const storeHash = process.env.BIGCOMMERCE_STORE_HASH!;
  const H = { "X-Auth-Token": process.env.BIGCOMMERCE_ACCESS_TOKEN!, Accept: "application/json" };

  // Everything that could still be inside the send window, plus slack for a late
  // status change. findDueOrders() does the actual 72-hour filtering.
  const since = new Date(Date.now() - (RULES.delayHours + RULES.windowHours + 12) * 3600000);
  const orders: BCOrderSummary[] = [];
  for (let page = 1; page <= 10; page++) {
    const r = await fetch(
      `https://api.bigcommerce.com/stores/${storeHash}/v2/orders?limit=250&page=${page}&min_date_created=${since.toISOString()}&sort=date_created:desc`,
      { headers: H }
    );
    if (r.status === 204) break;
    if (!r.ok) return NextResponse.json({ error: `BigCommerce ${r.status}` }, { status: 502 });
    const batch = (await r.json()) as BCOrderSummary[];
    orders.push(...batch);
    if (batch.length < 250) break;
  }

  const due = findDueOrders(orders);
  const results: Record<string, unknown>[] = [];
  let sent = 0;

  for (const o of due) {
    if (sent >= RULES.maxSendsPerRun) break;
    const customer = await getCustomerById(o.customerId);
    if (!customer?.email) { results.push({ orderId: o.orderId, skipped: "no email" }); continue; }
    const skip = shouldSkip(customer.notes || "", o);
    if (skip) { results.push({ orderId: o.orderId, email: customer.email, skipped: skip }); continue; }

    const data = buildEmail(o, customer);
    if (!data) { results.push({ orderId: o.orderId, skipped: "no email address" }); continue; }

    const row = {
      orderId: o.orderId,
      customerId: o.customerId,
      email: customer.email,
      company: customer.company,
      hoursSince: Math.round(o.hoursSince * 10) / 10,
    };
    if (dryRun) { results.push({ ...row, wouldSend: true }); continue; }

    const ok = await sendReviewRequestEmail(data);
    if (ok) { await markSent(o.customerId, customer.notes || "", o.orderId); sent++; }
    results.push({ ...row, sent: ok });
  }

  return NextResponse.json({
    ordersScanned: orders.length,
    dueOrders: due.length,
    sent,
    dryRun,
    results,
  });
}
