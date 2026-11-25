/*
 * Product families: one listing for a product that BigCommerce stores as several
 * size SKUs. The storefront shows the canonical SKU in category pages, search and
 * the sitemap; the product page adds a size strip that swaps in the sibling SKU's
 * live price, tiers, stock and item number, so the cart and the BigCommerce order
 * always carry the exact size the customer picked.
 *
 * Every sibling's own URL keeps working (it renders the family page with that size
 * selected) and canonicalises to the canonical SKU's URL.
 */

export interface FamilyVariant {
  sku: string;
  /** Short label on the size strip ("L") */
  label: string;
  /** Full name ("Large") */
  name: string;
}

export interface ProductFamily {
  id: string;
  /** Family name shown as the page title instead of the size-specific BigCommerce name */
  name: string;
  /** What the strip chooses ("Size") */
  option: string;
  /** The SKU that represents the family in listings and the sitemap */
  canonicalSku: string;
  variants: FamilyVariant[];
}

const SIZES: [string, string][] = [["S", "Small"], ["M", "Medium"], ["L", "Large"], ["XL", "X-Large"]];

const sized = (skus: string[]): FamilyVariant[] => skus.map((sku, i) => ({ sku, label: SIZES[i][0], name: SIZES[i][1] }));

export const PRODUCT_FAMILIES: ProductFamily[] = [
  {
    id: "blue-nitrile-100",
    name: "Blue Nitrile Gloves, Powder-Free, 100/Box",
    option: "Size",
    canonicalSku: "8603EA",
    variants: sized(["8601EA", "8602EA", "8603EA", "8604EA"]),
  },
  {
    id: "black-nitrile-100",
    name: "Black Nitrile Exam Gloves, Powder-Free, 100/Box",
    option: "Size",
    canonicalSku: "8903EA",
    variants: sized(["8901EA", "8902EA", "8903EA", "8904EA"]),
  },
];

const BY_SKU = new Map<string, ProductFamily>();
for (const f of PRODUCT_FAMILIES) for (const v of f.variants) BY_SKU.set(v.sku.toUpperCase(), f);

export function familyForSku(sku?: string | null): ProductFamily | null {
  return sku ? BY_SKU.get(sku.toUpperCase()) ?? null : null;
}

export function variantForSku(sku?: string | null): FamilyVariant | null {
  const f = familyForSku(sku);
  return f ? f.variants.find((v) => v.sku.toUpperCase() === sku!.toUpperCase()) ?? null : null;
}

/** A family member that is not the canonical SKU: left out of listings, search and the sitemap. */
export function isHiddenVariant(sku?: string | null): boolean {
  const f = familyForSku(sku);
  return !!f && f.canonicalSku.toUpperCase() !== sku!.toUpperCase();
}

export function hideVariants<T extends { sku: string }>(list: T[]): T[] {
  return list.filter((p) => !isHiddenVariant(p.sku));
}
