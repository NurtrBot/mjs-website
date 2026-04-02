import { NextRequest, NextResponse } from "next/server";
import { getProducts, type BCProduct } from "@/lib/bigcommerce";
import { transformProduct } from "@/lib/products-api";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug") || "";

  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  try {
    // Build keyword search attempts from slug — try progressively shorter queries
    const noise = new Set(["for", "the", "per", "and", "with", "each", "carton", "case",
      "box", "pack", "roll", "rolls", "bundle", "wrap", "gauge", "clear", "white",
      "black", "blue", "green", "red", "yellow", "natural", "inch", "gallon", "item"]);
    const allWords = slug.split("-");
    const meaningfulWords = allWords
      .filter(w => w.length > 2 && !/^\d+$/.test(w) && !noise.has(w));

    // Build search attempts: 4 words, 3 words, 2 words, first 2 raw words
    const attempts = [
      meaningfulWords.slice(0, 4).join(" "),
      meaningfulWords.slice(0, 3).join(" "),
      meaningfulWords.slice(0, 2).join(" "),
      allWords.slice(0, 2).join(" "),
    ].filter(Boolean);

    // Deduplicate
    const seen = new Set<string>();
    const uniqueAttempts = attempts.filter(a => { if (seen.has(a)) return false; seen.add(a); return true; });

    let res = { data: [] as BCProduct[], meta: { pagination: { total: 0, total_pages: 0, current_page: 0 } } };
    for (const keyword of uniqueAttempts) {
      res = await getProducts({ keyword, limit: 20, is_visible: true });
      if (res.data.length > 0) break;
    }

    // Find best match by comparing slugs
    let bestMatch: BCProduct | null = null;

    // Pass 1: exact slug match
    for (const p of res.data) {
      const pSlug = p.custom_url?.url?.replace(/^\/|\/$/g, "") || "";
      if (pSlug === slug) {
        bestMatch = p;
        break;
      }
    }

    // Pass 2: slug contains match (BC slug might be a substring or superset)
    if (!bestMatch) {
      for (const p of res.data) {
        const pSlug = p.custom_url?.url?.replace(/^\/|\/$/g, "") || "";
        if (pSlug && (slug.includes(pSlug) || pSlug.includes(slug))) {
          bestMatch = p;
          break;
        }
      }
    }

    // Pass 3: try searching by SKU if the slug looks like it ends with one
    if (!bestMatch) {
      // Extract possible SKU from slug (often appears as last segment)
      const parts = slug.split("-");
      const possibleSku = parts[parts.length - 1].toUpperCase();
      if (possibleSku.length >= 3) {
        for (const p of res.data) {
          if (p.sku && p.sku.toUpperCase() === possibleSku) {
            bestMatch = p;
            break;
          }
        }
      }
    }

    // Pass 4: use first result with images as fallback
    if (!bestMatch) {
      for (const p of res.data) {
        if (p.images && p.images.length > 0 && p.price > 0) {
          bestMatch = p;
          break;
        }
      }
    }

    if (bestMatch && bestMatch.price > 0) {
      return NextResponse.json({ product: transformProduct(bestMatch) });
    }

    return NextResponse.json({ product: null }, { status: 404 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
