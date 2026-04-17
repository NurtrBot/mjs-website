import { NextRequest, NextResponse } from "next/server";
import { getOrdersByCustomerId, getOrderProducts } from "@/lib/bigcommerce";

export async function GET(req: NextRequest) {
  const customerId = Number(req.nextUrl.searchParams.get("customerId"));

  if (!customerId) {
    return NextResponse.json({ purchases: {} });
  }

  try {
    const orders = await getOrdersByCustomerId(customerId);

    // Map SKU → most recent purchase date
    const purchases: Record<string, string> = {};

    // Process orders (already sorted by date desc)
    const orderFetches = await Promise.all(
      orders.slice(0, 20).map(async (order: { id: number; date_created: string }) => {
        const products = await getOrderProducts(order.id);
        return { date: order.date_created, products };
      })
    );

    for (const { date, products } of orderFetches) {
      for (const p of products) {
        const sku = (p.sku || "").toUpperCase();
        if (sku && !purchases[sku]) {
          purchases[sku] = date;
        }
      }
    }

    return NextResponse.json({ purchases });
  } catch {
    return NextResponse.json({ purchases: {} });
  }
}
