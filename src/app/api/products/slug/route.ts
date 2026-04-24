import { NextRequest, NextResponse } from "next/server";
import { getProducts, getProductBySku, getBulkPricingRules, type BCProduct } from "@/lib/bigcommerce";
import { transformProduct } from "@/lib/products-api";

const normalizeSlug = (s: string) => s
  .replace(/^\/|\/$/g, "")
  .replace(/\//g, "-")
  .replace(/-{2,}/g, "-")
  .replace(/^-|-$/g, "");

function findBestMatch(candidates: BCProduct[], slug: string): BCProduct | null {
  const normalizedInput = normalizeSlug(slug);

  // Pass 1: exact slug match (strongest)
  for (const p of candidates) {
    const pSlug = normalizeSlug(p.custom_url?.url?.replace(/^\/|\/$/g, "") || "");
    if (pSlug === normalizedInput) return p;
  }

  // Pass 2: slug starts-with or ends-with match (catches truncated slugs)
  // Score by how close the match is — prefer the longest overlap
  let bestCandidate: BCProduct | null = null;
  let bestScore = 0;
  for (const p of candidates) {
    const pSlug = normalizeSlug(p.custom_url?.url?.replace(/^\/|\/$/g, "") || "");
    if (!pSlug) continue;
    // Calculate overlap score
    let score = 0;
    if (pSlug === normalizedInput) { score = 10000; }
    else if (pSlug.startsWith(normalizedInput) || normalizedInput.startsWith(pSlug)) {
      score = Math.min(pSlug.length, normalizedInput.length);
      // Penalize if lengths are very different (means it's a partial match)
      const lenDiff = Math.abs(pSlug.length - normalizedInput.length);
      if (lenDiff > 10) score -= lenDiff;
    }
    else if (pSlug.includes(normalizedInput) || normalizedInput.includes(pSlug)) {
      score = Math.min(pSlug.length, normalizedInput.length) - 20;
    }
    if (score > bestScore) {
      bestScore = score;
      bestCandidate = p;
    }
  }
  if (bestCandidate && bestScore > 20) return bestCandidate;

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

    // FIRST: Try exact slug match via BC custom_url search
    let bestMatch: BCProduct | null = null;
    const slugParts = slug.split("-");

    // Try compound segments as SKUs (e.g. "LPF-56SEA" from slug parts "lpf" + "56sea")
    for (let i = 0; i < slugParts.length - 1 && !bestMatch; i++) {
      // Try pairs: seg[i]-seg[i+1]
      const pair = `${slugParts[i]}-${slugParts[i + 1]}`.toUpperCase();
      if (pair.length >= 4 && pair.length <= 20) {
        const found = await getProductBySku(pair);
        if (found && found.price > 0) {
          const foundSlug = normalizeSlug(found.custom_url?.url || "");
          if (foundSlug === normalizeSlug(slug) || normalizeSlug(slug).includes(foundSlug) || foundSlug.includes(normalizeSlug(slug))) {
            bestMatch = found;
            break;
          }
        }
      }
      // Try triples: seg[i]-seg[i+1]-seg[i+2]
      if (i < slugParts.length - 2) {
        const triple = `${slugParts[i]}-${slugParts[i + 1]}-${slugParts[i + 2]}`.toUpperCase();
        if (triple.length >= 5 && triple.length <= 20) {
          const found = await getProductBySku(triple);
          if (found && found.price > 0) {
            const foundSlug = normalizeSlug(found.custom_url?.url || "");
            if (foundSlug === normalizeSlug(slug) || normalizeSlug(slug).includes(foundSlug) || foundSlug.includes(normalizeSlug(slug))) {
              bestMatch = found;
              break;
            }
          }
        }
      }
    }

    // Try single segments as SKUs
    if (!bestMatch) {
      for (const seg of slugParts) {
        if (seg.length >= 3 && seg.length <= 15) {
          const found = await getProductBySku(seg);
          if (found && found.price > 0) {
            const foundSlug = normalizeSlug(found.custom_url?.url || "");
            if (foundSlug === normalizeSlug(slug) || normalizeSlug(slug).includes(foundSlug) || foundSlug.includes(normalizeSlug(slug))) {
              bestMatch = found;
              break;
            }
          }
        }
      }
    }

    // Try last segment as fallback
    if (!bestMatch) {
      const lastSeg = slugParts[slugParts.length - 1];
      if (lastSeg.length >= 3) {
        const found = await getProductBySku(lastSeg);
        if (found && found.price > 0) bestMatch = found;
      }
    }

    // SECOND: Keyword search with slug words
    if (!bestMatch) {
      const attempts = [
        meaningfulWords.slice(0, 5).join(" "),
        meaningfulWords.slice(0, 4).join(" "),
        meaningfulWords.slice(0, 3).join(" "),
        meaningfulWords.slice(0, 2).join(" "),
        // Skip first word (often a brand name BC doesn't index)
        meaningfulWords.slice(1, 5).join(" "),
        meaningfulWords.slice(1, 4).join(" "),
        meaningfulWords.slice(2, 5).join(" "),
        allWords.slice(0, 3).join(" "),
        ...meaningfulWords.slice(0, 3),
      ].filter(Boolean);

      const seen = new Set<string>();
      const uniqueAttempts = attempts.filter(a => { if (seen.has(a)) return false; seen.add(a); return true; });

      for (const keyword of uniqueAttempts) {
        const res = await getProducts({ keyword, limit: 50, is_visible: true });
        if (res.data.length > 0) {
          bestMatch = findBestMatch(res.data, slug);
          if (bestMatch) break;
        }
      }
    }

    // THIRD: Last resort SKU fallback
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
      const product = transformProduct(bestMatch);

      // Fetch live bulk pricing from BC and override default tiers
      try {
        const rules = await getBulkPricingRules(bestMatch.id);
        if (rules.length > 0) {
          const basePrice = bestMatch.calculated_price || bestMatch.price;
          const liveTiers: { label: string; qty: number; unitPrice: number; savings?: string }[] = [
            { label: "1 Case", qty: 1, unitPrice: Math.round(basePrice * 100) / 100 },
          ];
          const sorted = [...rules].sort((a, b) => a.quantity_min - b.quantity_min);
          for (const rule of sorted) {
            let tierPrice = basePrice;
            if (rule.type === "percent") {
              tierPrice = basePrice * (1 - rule.amount / 100);
            } else if (rule.type === "price") {
              tierPrice = basePrice - rule.amount;
            } else if (rule.type === "fixed") {
              tierPrice = rule.amount;
            }
            tierPrice = Math.round(tierPrice * 100) / 100;
            const savings = Math.round((basePrice - tierPrice) * 100) / 100;
            liveTiers.push({
              label: `${rule.quantity_min}+ Cases`,
              qty: rule.quantity_min,
              unitPrice: tierPrice,
              ...(savings > 0 ? { savings: `Save $${savings.toFixed(2)}/case` } : {}),
            });
          }
          product.quickBuy = liveTiers;
        }
      } catch {}

      return NextResponse.json({ product, bcProductId: bestMatch.id });
    }

    return NextResponse.json({ product: null }, { status: 404 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
