import { NextRequest, NextResponse } from "next/server";
import { allProducts, categoryMap } from "@/data/products";
import type { ProductData } from "@/data/product-types";

/**
 * Serves category products from synced local data (instant, no BC API call).
 * All product data is synced via `npm run sync-bc` which pulls pricing,
 * images, stock, and descriptions from BigCommerce into local files.
 *
 * Falls back to the BC API only if local data returns zero products.
 */

// Category name mapping (slug → internal category name)
const SITE_CATEGORY_NAMES: Record<string, string> = {
  ...categoryMap,
  // Additional slug aliases
  "paper-restroom": "Paper & Restroom",
};

// Sorting helpers
const SIZE_ORDER: Record<string, number> = {
  small: 1, s: 1, medium: 2, m: 2, med: 2,
  large: 3, l: 3, lg: 3,
  "x-large": 4, xl: 4, "x large": 4, xlarge: 4,
  "xx-large": 5, xxl: 5, "2xl": 5, "2x": 5,
};

function getSizeOrder(name: string): number {
  const lower = name.toLowerCase();
  if (/\bxx?-?large\b|\bx-?lg\b|\bxxl\b|\b2xl\b/.test(lower)) return 5;
  if (/\bx-?large\b|\bxl\b/.test(lower)) return 4;
  if (/\blarge\b|\blg\b/.test(lower) && !/x-?large/.test(lower)) return 3;
  if (/\bmedium\b|\bmed\b/.test(lower)) return 2;
  if (/\bsmall\b/.test(lower)) return 1;
  return 3;
}

function getGallonSize(name: string): number {
  const m = name.match(/(\d+)(?:-(\d+))?\s*gal/i);
  if (m) return parseInt(m[1]);
  return 999;
}

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug") || "";

  try {
    const categoryName = SITE_CATEGORY_NAMES[slug];

    if (categoryName) {
      // Serve from synced local data — instant, no API call
      let products = allProducts.filter((p) => p.category === categoryName && p.price > 0);

      // Sort: Janitors Finest brand first, then by subcategory, then by size/gallon
      products.sort((a, b) => {
        const aJF = a.brand?.toLowerCase().includes("janitors finest") ? 0 : 1;
        const bJF = b.brand?.toLowerCase().includes("janitors finest") ? 0 : 1;
        if (aJF !== bJF) return aJF - bJF;

        const aSub = a.subcategory || "";
        const bSub = b.subcategory || "";
        if (aSub !== bSub) return aSub.localeCompare(bSub);

        // Size sorting (gloves, liners)
        const aSize = getSizeOrder(a.name);
        const bSize = getSizeOrder(b.name);
        if (aSize !== bSize) return aSize - bSize;

        // Gallon sorting (liners)
        const aGal = getGallonSize(a.name);
        const bGal = getGallonSize(b.name);
        if (aGal !== bGal) return aGal - bGal;

        return a.name.localeCompare(b.name);
      });

      if (products.length > 0) {
        return NextResponse.json({ products }, {
          headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
        });
      }
    }

    // Fallback: if no local products found, hit BC API
    const { fetchProductsByCategory } = await import("@/lib/products-api");
    const result = await fetchProductsByCategory(slug, 1, 250);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
