/* ─────────────────────────────────────────────────────────────
   Product cards for the buying guides (server side).

   Guides list products by SKU. This resolves each SKU to a small, serialisable
   card (photo, name, price, pack, slug) so the client guide components can
   show real product tiles with "Add to cart".

   Lookup order: curated src/data/products.ts → catalog snapshot
   (src/data/imported-products.ts) → live BigCommerce for anything still
   missing. Pages that use this set `revalidate` so prices stay fresh.
   ───────────────────────────────────────────────────────────── */

import type { ProductData } from "@/data/product-types";
import { products as curated } from "@/data/products";
import { importedProducts } from "@/data/imported-products";

export interface GuideProduct {
  sku: string;
  slug: string;
  name: string;
  cardTitle: string;
  brand: string;
  price: number;
  image: string;
  pack: string;
  category: string;
  inStock: boolean;
  imageFit?: "contain" | "cover";
}

/** "CAN LINERS CLEAR, 40 X 48, 12 MICRON, 40-45 GALLON, 250/CS (CL404812)" → readable title case */
function niceTitle(raw: string): string {
  let s = raw.replace(/\s*\([A-Z0-9-]{3,}\)\s*$/i, "").trim(); // drop trailing "(SKU)"
  const letters = s.replace(/[^A-Za-z]/g, "");
  const upper = letters.replace(/[^A-Z]/g, "").length;
  if (letters.length && upper / letters.length > 0.8) {
    s = s.toLowerCase().replace(/(^|[\s(\/-])([a-z])/g, (m, pre, ch) => pre + ch.toUpperCase());
    s = s.replace(/\b(\d+)\s*X\s*(\d+)/gi, "$1 × $2").replace(/\bMic\b/g, "Micron").replace(/\b(\d+)\/cs\b/gi, "$1/Case").replace(/\bGal\b/g, "Gallon");
  }
  return s;
}

/** Prefer a case/box count over a "45 GALLON" capacity label */
function nicePack(name: string, pack: string): string {
  const m = name.match(/(\d{2,5})\s*[\/-]?\s*(cs|case|ct|carton|bx|box|pk|pack)\b/i);
  if (m) {
    const unit = /bx|box/i.test(m[2]) ? "Box" : /pk|pack/i.test(m[2]) ? "Pack" : "Case";
    return `${m[1]}/${unit}`;
  }
  return pack.replace(/\bGALLON\b/, "gallon");
}

function toCard(p: ProductData): GuideProduct {
  return {
    sku: p.sku,
    slug: p.slug,
    name: p.name,
    cardTitle: niceTitle(p.cardTitle && p.cardTitle.length < p.name.length && !p.cardTitle.endsWith("...") ? p.cardTitle : p.name),
    brand: p.brand,
    price: p.price,
    image: p.images?.[0] || "",
    pack: nicePack(p.name, p.pack),
    category: p.category,
    inStock: p.inStock,
    imageFit: p.imageFit,
  };
}

const norm = (s: string) => s.trim().toUpperCase();

export async function getGuideProducts(skus: string[]): Promise<Record<string, GuideProduct>> {
  const want = Array.from(new Set(skus.map(norm)));
  const out: Record<string, GuideProduct> = {};

  const local: ProductData[] = [...curated, ...importedProducts];
  // Many chemicals are catalogued as the "each" variant: 3158 → 3158EA
  const variants = (sku: string) => [sku, `${sku}EA`, sku.replace(/EA$/, "")];
  for (const sku of want) {
    const hit = variants(sku).map((v) => local.find((p) => norm(p.sku) === v)).find((p) => p && p.price > 0);
    if (hit) out[sku] = toCard(hit);
  }

  const missing = want.filter((s) => !out[s]);
  if (missing.length) {
    try {
      const { fetchProductsBySkus } = await import("@/lib/products-api");
      const live = await fetchProductsBySkus(missing.flatMap((m) => [m, `${m}EA`]));
      for (const p of live) {
        const k = norm(p.sku);
        for (const m of missing) if (!out[m] && (k === m || k === `${m}EA`)) out[m] = toCard(p);
      }
    } catch (err) {
      console.error("[guide-products] live lookup failed:", err);
    }
  }
  return out;
}

/** Convenience for components: look a SKU up in the map regardless of case */
export function pick(map: Record<string, GuideProduct>, sku: string): GuideProduct | undefined {
  return map[norm(sku)];
}
