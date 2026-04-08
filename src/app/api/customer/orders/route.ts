import { NextRequest, NextResponse } from "next/server";
import { getOrdersByCustomerId, getOrderProducts } from "@/lib/bigcommerce";

export async function GET(req: NextRequest) {
  const customerId = Number(req.nextUrl.searchParams.get("customerId"));
  if (!customerId) {
    return NextResponse.json({ error: "Missing customerId" }, { status: 400 });
  }

  try {
    const orders = await getOrdersByCustomerId(customerId);

    // Fetch line items for each order
    const enriched = await Promise.all(
      (orders || []).slice(0, 20).map(async (order: Record<string, unknown>) => {
        const products = await getOrderProducts(order.id as number);
        return {
          id: order.id,
          date: order.date_created,
          status: order.status,
          subtotal: order.subtotal_inc_tax,
          tax: order.total_tax,
          shipping: order.shipping_cost_inc_tax,
          total: order.total_inc_tax,
          itemCount: order.items_total,
          lineItems: (products || []).map((p: Record<string, unknown>) => ({
            name: (p.name as string)?.slice(0, 80),
            sku: p.sku,
            qty: p.quantity,
            price: p.total_inc_tax,
          })),
        };
      })
    );

    return NextResponse.json({ orders: enriched });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
