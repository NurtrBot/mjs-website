import { NextRequest, NextResponse } from "next/server";
import { getOrdersByCustomerId, getOrderProducts } from "@/lib/bigcommerce";
import { fetchProductsBySkus } from "@/lib/products-api";
import { candidateSkus, rankProducts } from "@/lib/recommendations";
import { median } from "@/lib/replenishment";
import type { ProductData } from "@/data/products";

/*
 * GET /api/customers/history?customerId=4171
 *
 * Powers the signed-in homepage strips:
 *   items   — "Buy it again": every product this customer has ordered, ranked by
 *             how often and how recently, with their usual quantity and cadence
 *   due     — "Due for a restock": the subset whose reorder cadence says they're
 *             running low (same spirit as the replenishment email, but per SKU)
 *   alsoBuy — "Customers like you also buy": co-purchase picks seeded from their
 *             history, excluding anything they already buy
 */

export const dynamic = "force-dynamic";

const SKIP_STATUS = new Set([0, 1, 4, 5, 6, 13]); // incomplete, pending, refunded, cancelled, declined, disputed
const MAX_ORDERS = 40;
const DAY = 86400000;

export interface HistoryItem {
  product: ProductData;
  orders: number;        // how many orders included this SKU
  lastDate: string;      // ISO
  daysSince: number;
  lastQty: number;
  usualQty: number;      // median quantity per order
  gapDays: number | null; // typical days between orders of this SKU (or the customer's overall cadence)
  due: "due" | "overdue" | null;
}

type OrderSummary = { id: number; date_created: string; status_id: number; items_total: number };
type OrderLine = { sku?: string; quantity?: number };

async function mapPool<T, R>(list: T[], size: number, fn: (t: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(list.length);
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(size, list.length) }, async () => {
    while (i < list.length) { const idx = i++; out[idx] = await fn(list[idx]); }
  }));
  return out;
}

export async function GET(req: NextRequest) {
  const customerId = Number(req.nextUrl.searchParams.get("customerId"));
  if (!customerId) return NextResponse.json({ items: [], due: [], alsoBuy: [], orderCount: 0 });

  try {
    const all = (await getOrdersByCustomerId(customerId, 50)) as OrderSummary[];
    const orders = all
      .filter(o => !SKIP_STATUS.has(o.status_id) && o.items_total >= 1)
      .sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime())
      .slice(0, MAX_ORDERS);
    if (orders.length === 0) return NextResponse.json({ items: [], due: [], alsoBuy: [], orderCount: 0 });

    const lines = await mapPool(orders, 6, async o => ({ date: new Date(o.date_created), products: (await getOrderProducts(o.id)) as OrderLine[] }));

    // Per-SKU stats
    const stats = new Map<string, { dates: Date[]; qtys: number[] }>();
    for (const { date, products } of lines) {
      const seen = new Set<string>();
      for (const p of products) {
        const sku = (p.sku || "").toUpperCase();
        if (!sku || seen.has(sku)) continue;
        seen.add(sku);
        const s = stats.get(sku) || { dates: [], qtys: [] };
        s.dates.push(date); s.qtys.push(Math.max(1, Number(p.quantity) || 1));
        stats.set(sku, s);
      }
    }

    // Customer-level cadence (median gap between orders), as a fallback for SKUs seen once
    const orderDays = orders.map(o => new Date(o.date_created).getTime() / DAY).sort((a, b) => a - b);
    const customerGap = orderDays.length >= 2 ? median(orderDays.slice(1).map((d, i) => d - orderDays[i])) : null;
    const now = Date.now();

    const ranked = [...stats.entries()].map(([sku, s]) => {
      const days = s.dates.map(d => d.getTime() / DAY).sort((a, b) => a - b);
      const last = days[days.length - 1];
      const daysSince = Math.max(0, Math.floor(now / DAY - last));
      const skuGap = days.length >= 2 ? median(days.slice(1).map((d, i) => d - days[i])) : null;
      const gapRaw = skuGap && skuGap >= 7 ? skuGap : customerGap && customerGap >= 7 ? customerGap : null;
      const gapDays = gapRaw ? Math.round(Math.min(gapRaw, 180)) : null;
      // Due from 80% of the usual gap; stop calling it due once they're so far past
      // it they've probably moved on (3× the gap, or 60 days past it, whichever is later)
      let due: HistoryItem["due"] = null;
      if (gapDays && s.dates.length >= 2 && daysSince <= Math.max(gapDays * 3, gapDays + 60)) {
        if (daysSince >= gapDays * 1.15) due = "overdue";
        else if (daysSince >= gapDays * 0.8) due = "due";
      }
      // Often × recently: each order counts, recent ones count more
      const score = s.dates.length * (1 / (1 + daysSince / 90)) + (due ? 0.5 : 0);
      return {
        // orders were processed newest-first, so index 0 is the most recent purchase
        sku, score, orders: s.dates.length, lastDate: s.dates[0].toISOString(), daysSince,
        lastQty: s.qtys[0], usualQty: Math.max(1, Math.round(median(s.qtys))), gapDays, due,
      };
    }).sort((a, b) => b.score - a.score);

    const top = ranked.slice(0, 24);
    const purchasedSet = new Set(stats.keys());

    // Co-purchase picks seeded from what they buy most, excluding everything they already buy
    const seeds = top.slice(0, 8).map(t => t.sku);
    const candidates = candidateSkus(seeds, 40).filter(c => !purchasedSet.has(c.sku.toUpperCase())).slice(0, 20);

    const products = await fetchProductsBySkus([...new Set([...top.map(t => t.sku), ...candidates.map(c => c.sku)])]);
    const bySku = new Map(products.map(p => [p.sku.toUpperCase(), p]));

    const items: HistoryItem[] = top
      .map(t => ({ ...t, product: bySku.get(t.sku) }))
      .filter((t): t is typeof t & { product: ProductData } => !!t.product && t.product.price > 0 && !!t.product.images?.[0] && !t.product.images[0].includes("placeholder"))
      .map(({ sku: _sku, score: _score, ...rest }) => rest);

    const due = items.filter(i => i.due).sort((a, b) => (b.daysSince / (b.gapDays || 1)) - (a.daysSince / (a.gapDays || 1)));
    const alsoBuy = rankProducts(candidates, products, { limit: 10 });

    return NextResponse.json(
      { items, due, alsoBuy, orderCount: orders.length },
      { headers: { "Cache-Control": "private, max-age=300" } },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ items: [], due: [], alsoBuy: [], orderCount: 0, error: message }, { status: 200 });
  }
}
