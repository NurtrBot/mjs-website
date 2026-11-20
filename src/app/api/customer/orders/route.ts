import { NextRequest, NextResponse } from "next/server";
import { getOrdersByCustomerId, getOrderProducts, getOrderShippingAddresses } from "@/lib/bigcommerce";
import { findSds, buildingFromAddress } from "@/lib/sds";

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
        const [products, ships] = await Promise.all([
          getOrderProducts(order.id as number),
          order.shipping_address_count === 0 ? Promise.resolve([]) : getOrderShippingAddresses(order.id as number),
        ]);
        return {
          id: order.id,
          building: buildingFromAddress(ships[0]),
          date: order.date_created,
          status: order.status,
          subtotal: order.subtotal_inc_tax,
          subtotalExTax: order.subtotal_ex_tax,
          discount: order.discount_amount,
          tax: order.total_tax,
          shipping: order.shipping_cost_inc_tax,
          total: order.total_inc_tax,
          itemCount: order.items_total,
          lineItems: (products || []).map((p: Record<string, unknown>) => ({
            name: (p.name as string)?.slice(0, 80),
            sku: p.sku,
            qty: p.quantity,
            price: Number(p.base_price) || Number(p.price_inc_tax) || 0,
            lineTotal: Number(p.total_inc_tax) || 0,
            sds: findSds(String(p.sku || ""))?.url || null,
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
