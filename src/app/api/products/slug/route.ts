import { NextRequest, NextResponse } from "next/server";
import { getProducts, getProductBySku, type BCProduct } from "@/lib/bigcommerce";
import { transformProduct } from "@/lib/products-api";

const normalizeSlug = (s: string) => s
  .replace(/^\/|\/$/g, "")
  .replace(/\//g, "-")
  .replace(/-{2,}/g, "-")
  .replace(/^-|-$/g, "");

function findBestMatch(candidates: BCProduct[], slug: string): BCProduct | null {
  const normalizedInput = normalizeSlug(slug);

  // Pass 1: exact slug match
  for (const p of candidates) {
    const pSlug = normalizeSlug(p.custom_url?.url?.replace(/^\/|\/$/g, "") || "");
    if (pSlug === normalizedInput) return p;
  }

  // Pass 2: slug contains match
  for (const p of candidates) {
    const pSlug = normalizeSlug(p.custom_url?.url?.replace(/^\/|\/$/g, "") || "");
    if (pSlug && (normalizedInput.includes(pSlug) || pSlug.includes(normalizedInput))) return p;
  }

  // Pass 3: SKU match from last segment
  const parts = slug.split("-");
  const possibleSku = parts[parts.length - 1].toUpperCase();
  if (possibleSku.length >= 3) {
    for (const p of candidates) {
      if (p.sku?.toUpperCase() === possibleSku) return p;
    }
  }

  // Pass 4: first result with images
  for (const p of candidates) {
    if (p.images && p.images.length > 0 && p.price > 0) return p;
  }

  return null;
}

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug") || "";

  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  try {
    const noise = new Set(["for", "the", "per", "and", "with", "each", "carton", "case",
      "box", "pack", "roll", "rolls", "bundle", "wrap", "gauge", "inch", "gallon", "item"]);
    const allWords = slug.split("-").filter(Boolean);
    const meaningfulWords = allWords
      .filter(w => w.length > 2 && !/^\d+$/.test(w) && !noise.has(w));

    // Build search attempts: multi-word (progressively shorter) + single important words
    const attempts = [
      meaningfulWords.slice(0, 5).join(" "),
      meaningfulWords.slice(0, 4).join(" "),
      meaningfulWords.slice(0, 3).join(" "),
      meaningfulWords.slice(0, 2).join(" "),
      allWords.slice(0, 3).join(" "),
      // Single-word fallbacks — try each meaningful word alone
      ...meaningfulWords.slice(0, 3),
    ].filter(Boolean);

    // Deduplicate
    const seen = new Set<string>();
    const uniqueAttempts = attempts.filter(a => { if (seen.has(a)) return false; seen.add(a); return true; });

    // Try each search attempt until we find a slug match
    let bestMatch: BCProduct | null = null;
    for (const keyword of uniqueAttempts) {
      const res = await getProducts({ keyword, limit: 50, is_visible: true });
      if (res.data.length > 0) {
        bestMatch = findBestMatch(res.data, slug);
        if (bestMatch) break;
      }
    }

    // Fallback: try SKU-based lookup (last segment or common patterns)
    if (!bestMatch) {
      const parts = slug.split("-");
      // Try last segment as SKU
      const skuAttempts = [
        parts[parts.length - 1],
        parts.slice(-2).join(""),
        // Common pattern: brand-product-SKU
        parts[parts.length - 1].toUpperCase(),
      ].filter(Boolean);

      for (const sku of skuAttempts) {
        const product = await getProductBySku(sku);
        if (product && product.price > 0) {
          bestMatch = product;
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
