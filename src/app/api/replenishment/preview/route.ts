import { NextRequest, NextResponse } from "next/server";
import { getCustomerById, getOrderProducts } from "@/lib/bigcommerce";
import { buildEmail, findDueCustomers, type BCOrderSummary } from "@/lib/replenishment";
import { renderReplenishmentEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

/**
 * GET /api/replenishment/preview?customerId=4171&secret=…
 * Renders the replenishment email for one customer using their real last order (no send).
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.nextUrl.searchParams.get("secret") !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const customerId = Number(req.nextUrl.searchParams.get("customerId"));
  if (!customerId) return NextResponse.json({ error: "customerId required" }, { status: 400 });

  const storeHash = process.env.BIGCOMMERCE_STORE_HASH!;
  const H = { "X-Auth-Token": process.env.BIGCOMMERCE_ACCESS_TOKEN!, Accept: "application/json" };
  const r = await fetch(`https://api.bigcommerce.com/stores/${storeHash}/v2/orders?customer_id=${customerId}&limit=50&sort=date_created:desc`, { headers: H });
  const orders = (r.status === 204 ? [] : await r.json()) as BCOrderSummary[];
  if (orders.length === 0) return NextResponse.json({ error: "No orders for this customer" }, { status: 404 });

  // Use the real cadence if they qualify, otherwise just show their latest order
  const due = findDueCustomers(orders).find(d => d.customerId === customerId);
  const last = orders.find(o => o.items_total >= 1) || orders[0];
  const lastDate = new Date(last.date_created);
  const c = due || { customerId, lastOrderId: last.id, lastOrderDate: lastDate, daysSince: Math.floor((Date.now() - lastDate.getTime()) / 86400000), medianGapDays: 0, orderCount: orders.length };
  c.daysSince = Math.floor((Date.now() - c.lastOrderDate.getTime()) / 86400000);

  const customer = await getCustomerById(customerId);
  if (!customer) return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  const products = await getOrderProducts(c.lastOrderId);
  const data = await buildEmail(c, customer, products.map(p => ({ sku: p.sku, name: p.name, quantity: p.quantity })));
  if (!data) return NextResponse.json({ error: "No displayable items on the last order" }, { status: 404 });

  const { html } = renderReplenishmentEmail(data);
  return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
