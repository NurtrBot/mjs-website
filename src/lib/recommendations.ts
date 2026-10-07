import copurchase from "@/data/copurchase.json";
import type { ProductData } from "@/data/products";

/* ─────────────────────────────────────────────────────────────
   Frequently-bought-together recommendations.

   Source: src/data/copurchase.json, built from real orders by
   scripts/build-copurchase.mjs. For each cart SKU we know which other
   SKUs were in the same orders, how often (conf) and how much more
   often than chance (lift).

   Ranking: score = conf × ln(1 + lift), summed over every cart item.
   Then: never suggest what's in the cart or its subcategory, one pick
   per subcategory, prefer items that close the free-delivery gap, and
   break ties toward Janitors Finest.
   ───────────────────────────────────────────────────────────── */

interface PairRow { sku: string; orders: number; conf: number; lift: number }
const PAIRS = (copurchase as { pairs: Record<string, PairRow[]> }).pairs;

export const COPURCHASE_META = {
  generatedAt: (copurchase as { generatedAt: string }).generatedAt,
  orders: (copurchase as { orders: number }).orders,
  skusWithPairs: (copurchase as { skusWithPairs: number }).skusWithPairs,
};

const pairScore = (r: PairRow) => r.conf * Math.log(1 + r.lift);

// Candidate SKUs for a cart, strongest first, with the aggregated score
export function candidateSkus(cartSkus: string[], limit = 20): { sku: string; score: number }[] {
  const inCart = new Set(cartSkus.map(s => s.toUpperCase()));
  const scores = new Map<string, number>();
  for (const sku of cartSkus) {
    const rows = PAIRS[sku] || PAIRS[sku.toUpperCase()] || [];
    for (const r of rows) {
      if (inCart.has(r.sku.toUpperCase())) continue;
      scores.set(r.sku, (scores.get(r.sku) || 0) + pairScore(r));
    }
  }
  return [...scores.entries()]
    .map(([sku, score]) => ({ sku, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function hasPairings(sku: string): boolean {
  return (PAIRS[sku]?.length || 0) > 0;
}

export interface RankOptions {
  // Subtotal still needed for free delivery; items that help close it get a boost
  freeDeliveryGap?: number;
  // Subcategories already represented in the cart — never recommend more of the same
  cartSubcategories?: string[];
  limit?: number;
}

// Turn scored candidates + their product data into the final picks
export function rankProducts(
  candidates: { sku: string; score: number }[],
  products: ProductData[],
  opts: RankOptions = {}
): ProductData[] {
  const limit = opts.limit ?? 3;
  const gap = opts.freeDeliveryGap ?? 0;
  const cartSubs = new Set((opts.cartSubcategories || []).map(s => s.toLowerCase()));
  const bySku = new Map(products.map(p => [p.sku.toUpperCase(), p]));

  const scored = candidates
    .map(c => ({ product: bySku.get(c.sku.toUpperCase()), base: c.score }))
    .filter((x): x is { product: ProductData; base: number } => !!x.product)
    .filter(x => x.product.inStock !== false && x.product.price > 0)
    .filter(x => x.product.images?.[0] && !x.product.images[0].includes("placeholder"))
    .filter(x => !cartSubs.has((x.product.subcategory || "").toLowerCase()))
    .map(x => {
      let score = x.base;
      // Free-delivery gap: favour items priced between half the gap and a little over it
      if (gap > 0 && gap <= 150) {
        const p = x.product.price;
        if (p >= gap * 0.5 && p <= gap * 1.1) score *= 1.6;
        else if (p >= gap * 0.3) score *= 1.2;
      }
      // House brand tie-break
      if (/janitors finest/i.test(x.product.brand || "") || /janitors finest/i.test(x.product.name)) score *= 1.1;
      return { product: x.product, score };
    })
    .sort((a, b) => b.score - a.score);

  // One per subcategory for variety
  const picks: ProductData[] = [];
  const usedSubs = new Set<string>();
  for (const s of scored) {
    const sub = (s.product.subcategory || s.product.name).toLowerCase();
    if (usedSubs.has(sub)) continue;
    usedSubs.add(sub);
    picks.push(s.product);
    if (picks.length >= limit) break;
  }
  // If variety left slots empty, fill with the next best regardless of subcategory
  if (picks.length < limit) {
    for (const s of scored) {
      if (picks.includes(s.product)) continue;
      picks.push(s.product);
      if (picks.length >= limit) break;
    }
  }
  return picks;
}
