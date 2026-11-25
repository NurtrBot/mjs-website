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

const SIZE_NAMES: Record<string, string> = { S: "Small", M: "Medium", L: "Large", XL: "X-Large" };

/** `{ S: "8601EA", M: "8602EA", ... }` in the order the strip shows them */
const sized = (bySize: Record<string, string>): FamilyVariant[] =>
  Object.entries(bySize).map(([label, sku]) => ({ sku, label, name: SIZE_NAMES[label] ?? label }));

export const PRODUCT_FAMILIES: ProductFamily[] = [
  {
    id: "blue-nitrile-100",
    name: "Blue Nitrile Gloves, Powder-Free, 100/Box",
    option: "Size",
    canonicalSku: "8603EA",
    variants: sized({ S: "8601EA", M: "8602EA", L: "8603EA", XL: "8604EA" }),
  },
  {
    id: "black-nitrile-100",
    name: "Black Nitrile Exam Gloves, Powder-Free, 100/Box",
    option: "Size",
    canonicalSku: "8903EA",
    variants: sized({ S: "8901EA", M: "8902EA", L: "8903EA", XL: "8904EA" }),
  },
  {
    id: "orange-diamond-nitrile-8mil",
    name: "Orange Diamond-Textured Nitrile Gloves, 8 Mil, 100/Box",
    option: "Size",
    canonicalSku: "8303EA",
    variants: sized({ M: "8302EA", L: "8303EA", XL: "8304EA" }),
  },
  {
    id: "black-diamond-nitrile-8mil",
    name: "Black Diamond-Textured Nitrile Gloves, 8 Mil, 100/Box",
    option: "Size",
    canonicalSku: "8403EA",
    variants: sized({ M: "8402EA", L: "8403EA", XL: "8404EA" }),
  },
  {
    id: "vinyl-general-purpose-100",
    name: "Vinyl Powder-Free General Purpose Gloves, 100/Box",
    option: "Size",
    canonicalSku: "VCPF-48LEA",
    variants: sized({ S: "VCPF-48SEA", M: "VCPF-48MEA", L: "VCPF-48LEA", XL: "VCPF-48XLEA" }),
  },
  {
    id: "latex-industrial-100",
    name: "Latex Powder-Free Industrial Grade Gloves, 100/Box",
    option: "Size",
    canonicalSku: "LPF-56LEA",
    variants: sized({ S: "LPF-56SEA", M: "LPF-56MEA", L: "LPF-56LEA", XL: "LPF-56XLEA" }),
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

/** "X-Large" for a family SKU, null for everything else. Cart and order lines use it to say which size was bought. */
export function sizeNameForSku(sku?: string | null): string | null {
  return variantForSku(sku)?.name ?? null;
}

/** A family member that is not the canonical SKU: left out of listings, search and the sitemap. */
export function isHiddenVariant(sku?: string | null): boolean {
  const f = familyForSku(sku);
  return !!f && f.canonicalSku.toUpperCase() !== sku!.toUpperCase();
}

export function hideVariants<T extends { sku: string }>(list: T[]): T[] {
  return list.filter((p) => !isHiddenVariant(p.sku));
}
