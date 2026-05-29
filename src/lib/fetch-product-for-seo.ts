/**
 * Server-side product fetcher for SEO metadata.
 *
 * Used by generateMetadata and ProductJsonLd in the product page route.
 * Tries multiple strategies to find a product by slug in BigCommerce:
 *   1. SKU extraction from slug segments
 *   2. Keyword search with best-match scoring
 *
 * Returns a ProductData object or null. This is the ONLY file that makes
 * BC API calls for product metadata — keeping the logic centralized.
 */
import { getProducts, getProductBySku, type BCProduct } from "@/lib/bigcommerce";
import { transformProduct } from "@/lib/products-api";
import type { ProductData } from "@/data/product-types";

const normalizeSlug = (s: string) =>
  s.replace(/^\/|\/$/g, "").replace(/\//g, "-").replace(/-{2,}/g, "-").replace(/^-|-$/g, "");

function findBestMatch(candidates: BCProduct[], slug: string): BCProduct | null {
  const normalized = normalizeSlug(slug);

  // Exact slug match
  for (const p of candidates) {
    const pSlug = normalizeSlug(p.custom_url?.url?.replace(/^\/|\/$/g, "") || "");
    if (pSlug === normalized) return p;
  }

  // Partial slug match with scoring
  let best: BCProduct | null = null;
  let bestScore = 0;
  for (const p of candidates) {
    const pSlug = normalizeSlug(p.custom_url?.url?.replace(/^\/|\/$/g, "") || "");
    if (!pSlug) continue;
    let score = 0;
    if (pSlug.startsWith(normalized) || normalized.startsWith(pSlug)) {
      score = Math.min(pSlug.length, normalized.length);
      const lenDiff = Math.abs(pSlug.length - normalized.length);
      if (lenDiff > 10) score -= lenDiff;
    } else if (pSlug.includes(normalized) || normalized.includes(pSlug)) {
      score = Math.min(pSlug.length, normalized.length) - 20;
    }
    if (score > bestScore) { bestScore = score; best = p; }
  }
  if (best && bestScore > 20) return best;

  return null;
}

export async function fetchProductForSeo(slug: string): Promise<ProductData | null> {
  try {
    const slugParts = slug.split("-");
    let match: BCProduct | null = null;

    // Strategy 1: Try slug segments as SKUs (compound and single)
    for (let i = 0; i < slugParts.length - 1 && !match; i++) {
      const pair = `${slugParts[i]}-${slugParts[i + 1]}`.toUpperCase();
      if (pair.length >= 4 && pair.length <= 20) {
        const found = await getProductBySku(pair);
        if (found && found.price > 0) {
          const foundSlug = normalizeSlug(found.custom_url?.url || "");
          if (foundSlug === normalizeSlug(slug) || normalizeSlug(slug).includes(foundSlug) || foundSlug.includes(normalizeSlug(slug))) {
            match = found;
          }
        }
      }
    }

    if (!match) {
      for (const seg of slugParts) {
        if (seg.length >= 3 && seg.length <= 15) {
          const found = await getProductBySku(seg);
          if (found && found.price > 0) {
            const foundSlug = normalizeSlug(found.custom_url?.url || "");
            if (foundSlug === normalizeSlug(slug) || normalizeSlug(slug).includes(foundSlug) || foundSlug.includes(normalizeSlug(slug))) {
              match = found;
              break;
            }
          }
        }
      }
    }

    // Strategy 2: Keyword search
    if (!match) {
      const noise = new Set(["for", "the", "per", "and", "with", "each", "carton", "case",
        "box", "pack", "roll", "rolls", "bundle", "wrap", "gauge", "inch", "gallon", "item"]);
      const meaningful = slugParts.filter(w => w.length > 2 && !/^\d+$/.test(w) && !noise.has(w));

      const attempts = [
        meaningful.slice(0, 5).join(" "),
        meaningful.slice(0, 3).join(" "),
        meaningful.slice(1, 4).join(" "),
      ].filter(Boolean);

      const seen = new Set<string>();
      for (const keyword of attempts) {
        if (seen.has(keyword)) continue;
        seen.add(keyword);
        const res = await getProducts({ keyword, limit: 20, is_visible: true });
        if (res.data.length > 0) {
          match = findBestMatch(res.data, slug);
          if (match) break;
        }
      }
    }

    // Strategy 3: Last segment as SKU fallback
    if (!match) {
      const lastSeg = slugParts[slugParts.length - 1];
      if (lastSeg.length >= 3) {
        const found = await getProductBySku(lastSeg);
        if (found && found.price > 0) match = found;
      }
    }

    if (match && match.price > 0) {
      return transformProduct(match);
    }

    return null;
  } catch {
    return null;
  }
}
