import { NextRequest, NextResponse } from "next/server";
import { fetchProductsBySkus, searchProducts } from "@/lib/products-api";
import { candidateSkus, rankProducts } from "@/lib/recommendations";
import type { ProductData } from "@/data/products";

export const revalidate = 0;

// Keyword fallback for carts whose SKUs have no order history yet
const FALLBACK_TERMS: { match: RegExp; terms: string[] }[] = [
  { match: /tissue|toilet/i, terms: ["multifold towels", "seat covers", "can liners"] },
  { match: /towel/i, terms: ["toilet tissue", "hand soap", "can liners"] },
  { match: /liner|trash bag/i, terms: ["multifold towels", "seat covers", "degreaser"] },
  { match: /degreaser|cleaner|disinfect/i, terms: ["spray bottle", "microfiber", "nitrile gloves"] },
  { match: /glove/i, terms: ["face mask", "hand sanitizer", "disinfecting wipes"] },
  { match: /mop/i, terms: ["mop bucket", "floor cleaner", "mop handle"] },
  { match: /stretch|tape|bubble/i, terms: ["tape gun", "stretch film", "bubble wrap"] },
  { match: /cup|plate|fork|napkin|cutlery/i, terms: ["napkins", "paper cups", "cutlery"] },
];
const UNIVERSAL_TERMS = ["multifold towels", "toilet tissue", "can liners", "hand soap"];

/**
 * GET /api/products/recommend?skus=5602,3180EA&gap=105&limit=3
 * Frequently-bought-together picks for a cart (or a single product page).
 */
export async function GET(req: NextRequest) {
  const skus = (req.nextUrl.searchParams.get("skus") || "").split(",").map(s => s.trim()).filter(Boolean).slice(0, 30);
  const gap = Number(req.nextUrl.searchParams.get("gap")) || 0;
  const limit = Math.min(Number(req.nextUrl.searchParams.get("limit")) || 3, 8);
  if (skus.length === 0) return NextResponse.json({ products: [], source: "none" });

  try {
    // Cart items themselves, for subcategory exclusion
    const cartProducts = await fetchProductsBySkus(skus);
    const cartSubcategories = cartProducts.map(p => p.subcategory).filter(Boolean);
    const cartSkuSet = new Set(skus.map(s => s.toUpperCase()));

    // 1. Data-driven candidates
    const candidates = candidateSkus(skus, 24);
    let picks: ProductData[] = [];
    if (candidates.length > 0) {
      const products = await fetchProductsBySkus(candidates.map(c => c.sku));
      picks = rankProducts(candidates, products, { freeDeliveryGap: gap, cartSubcategories, limit });
    }

    // 2. Keyword fallback to fill remaining slots
    if (picks.length < limit) {
      const names = cartProducts.map(p => p.name).join(" | ");
      const terms = new Set<string>();
      for (const rule of FALLBACK_TERMS) if (rule.match.test(names)) rule.terms.forEach(t => terms.add(t));
      if (terms.size === 0) UNIVERSAL_TERMS.forEach(t => terms.add(t));
      const results = await Promise.all([...terms].slice(0, 6).map(t => searchProducts(t, 8).catch(() => [] as ProductData[])));
      const seen = new Set(picks.map(p => p.sku.toUpperCase()));
      const cartSubs = new Set(cartSubcategories.map(s => s.toLowerCase()));
      const usedSubs = new Set(picks.map(p => (p.subcategory || "").toLowerCase()));
      // Round-robin across terms so one term can't fill every slot
      const queues = results.map(r => [...r]);
      while (picks.length < limit && queues.some(q => q.length)) {
        for (const q of queues) {
          const p = q.shift();
          if (!p) continue;
          const sub = (p.subcategory || "").toLowerCase();
          if (seen.has(p.sku.toUpperCase()) || cartSkuSet.has(p.sku.toUpperCase()) || cartSubs.has(sub) || usedSubs.has(sub)) continue;
          if (!p.images?.[0] || p.images[0].includes("placeholder")) continue;
          seen.add(p.sku.toUpperCase()); usedSubs.add(sub); picks.push(p);
          if (picks.length >= limit) break;
        }
      }
    }

    return NextResponse.json({ products: picks, source: candidates.length > 0 ? "orders" : "rules" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message, products: [] }, { status: 500 });
  }
}
