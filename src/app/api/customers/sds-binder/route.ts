import { NextRequest, NextResponse } from "next/server";
import { getOrdersByCustomerId, getOrderProducts, getOrderShippingAddresses } from "@/lib/bigcommerce";
import { fetchProductsBySkus } from "@/lib/products-api";
import { buildBinder, buildingFromAddress, type OrderForBinder } from "@/lib/sds";
import type { ProductData } from "@/data/products";

/*
 * GET /api/customers/sds-binder?customerId=4171
 * Every chemical this customer has ever ordered, grouped one row per product,
 * with the matched SDS (or null → Request SDS), every purchase, and the
 * building (ship-to) each purchase went to.
 */

export const dynamic = "force-dynamic";
const SKIP_STATUS = new Set([0, 1, 4, 5, 6, 13]);

async function mapPool<T, R>(list: T[], size: number, fn: (t: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(list.length); let i = 0;
  await Promise.all(Array.from({ length: Math.min(size, list.length) }, async () => { while (i < list.length) { const idx = i++; out[idx] = await fn(list[idx]); } }));
  return out;
}

export async function GET(req: NextRequest) {
  const customerId = Number(req.nextUrl.searchParams.get("customerId"));
  if (!customerId) return NextResponse.json({ chemicals: [], buildings: [] });
  try {
    const raw = (await getOrdersByCustomerId(customerId, 50)) as { id: number; date_created: string; status_id: number; items_total: number; shipping_address_count?: number }[];
    const orders = raw.filter(o => !SKIP_STATUS.has(o.status_id) && o.items_total >= 1).slice(0, 40);

    const enriched = await mapPool(orders, 6, async (o): Promise<OrderForBinder> => {
      const [lines, ships] = await Promise.all([
        getOrderProducts(o.id),
        o.shipping_address_count === 0 ? Promise.resolve([]) : getOrderShippingAddresses(o.id),
      ]);
      return { id: o.id, date: o.date_created, building: buildingFromAddress(ships[0]), lines };
    });

    const skus = [...new Set(enriched.flatMap(o => o.lines.map(l => (l.sku || "").toUpperCase()).filter(Boolean)))];
    const products = await fetchProductsBySkus(skus);
    const map = new Map<string, ProductData>(products.map(p => [p.sku.toUpperCase(), p]));
    const binder = buildBinder(enriched, map);
    return NextResponse.json(binder, { headers: { "Cache-Control": "private, max-age=300" } });
  } catch (error: unknown) {
    return NextResponse.json({ chemicals: [], buildings: [], error: error instanceof Error ? error.message : "Unknown error" });
  }
}
