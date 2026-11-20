import { NextRequest, NextResponse } from "next/server";
import { getCustomerMetafield, setCustomerMetafield } from "@/lib/bigcommerce";
import { fetchProductsBySkus } from "@/lib/products-api";

/*
 * Supply Lists — named reorder lists ("Monday Route") tied to a building.
 *   GET /api/customers/lists?customerId=…        → { lists }
 *   PUT /api/customers/lists?customerId=…  body { lists } → saves, returns { lists }
 * Stored as JSON in the customer's BigCommerce metafield mjs/supply_lists.
 */

export const dynamic = "force-dynamic";
const KEY = "supply_lists";

export interface SupplyListItem { sku: string; qty: number; name?: string; image?: string | null; slug?: string | null; price?: number; pack?: string }
export interface SupplyList { id: string; name: string; building: string; items: SupplyListItem[]; updatedAt: string }

async function hydrate(lists: SupplyList[]): Promise<SupplyList[]> {
  const skus = [...new Set(lists.flatMap(l => l.items.map(i => i.sku.toUpperCase())))];
  if (skus.length === 0) return lists;
  const products = await fetchProductsBySkus(skus);
  const by = new Map(products.map(p => [p.sku.toUpperCase(), p]));
  return lists.map(l => ({
    ...l,
    items: l.items.map(i => {
      const p = by.get(i.sku.toUpperCase());
      return p ? { sku: p.sku, qty: i.qty, name: p.cardTitle || p.name, image: p.images?.[0] || null, slug: p.slug, price: p.price, pack: p.pack } : { ...i, name: i.name || i.sku };
    }),
  }));
}

function sanitize(input: unknown): SupplyList[] {
  if (!Array.isArray(input)) return [];
  return input.slice(0, 30).map((l: Record<string, unknown>) => ({
    id: String(l.id || "").slice(0, 40) || Math.random().toString(36).slice(2, 10),
    name: String(l.name || "Untitled list").slice(0, 60),
    building: String(l.building || "").slice(0, 80),
    items: (Array.isArray(l.items) ? l.items : []).slice(0, 100)
      .map((i: Record<string, unknown>) => ({ sku: String(i.sku || "").toUpperCase().slice(0, 40), qty: Math.min(9999, Math.max(1, Math.round(Number(i.qty) || 1))) }))
      .filter((i: { sku: string }) => i.sku),
    updatedAt: new Date().toISOString(),
  }));
}

export async function GET(req: NextRequest) {
  const customerId = Number(req.nextUrl.searchParams.get("customerId"));
  if (!customerId) return NextResponse.json({ lists: [] });
  const mf = await getCustomerMetafield(customerId, KEY);
  let lists: SupplyList[] = [];
  try { lists = mf ? sanitize(JSON.parse(mf.value)) : []; } catch { lists = []; }
  return NextResponse.json({ lists: await hydrate(lists) });
}

export async function PUT(req: NextRequest) {
  const customerId = Number(req.nextUrl.searchParams.get("customerId"));
  if (!customerId) return NextResponse.json({ error: "customerId required" }, { status: 400 });
  const body = await req.json().catch(() => ({}));
  const lists = sanitize(body.lists);
  const ok = await setCustomerMetafield(customerId, KEY, JSON.stringify(lists));
  if (!ok) return NextResponse.json({ error: "Could not save lists" }, { status: 500 });
  return NextResponse.json({ lists: await hydrate(lists) });
}
