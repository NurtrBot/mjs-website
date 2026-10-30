/**
 * Get the correct unit price for a product based on quantity.
 * Finds the highest tier the quantity qualifies for.
 *
 * Example: quickBuy = [{qty:1, unitPrice:12.95}, {qty:4, unitPrice:10.95}, {qty:24, unitPrice:9.55}]
 *   getTierPrice(product, 1)  → 12.95  (1 gallon tier)
 *   getTierPrice(product, 4)  → 10.95  (4+ tier)
 *   getTierPrice(product, 6)  → 10.95  (still 4+ tier)
 *   getTierPrice(product, 24) → 9.55   (24+ tier)
 *   getTierPrice(product, 70) → 9.55   (still 24+ tier — highest they qualify for)
 *
 * Works with any object that has `price` and optionally `quickBuy`.
 */
export function getTierPrice(
  product: { price: number; quickBuy?: { qty: number; unitPrice?: number }[] },
  qty: number
): number {
  if (!product.quickBuy || product.quickBuy.length === 0) return product.price;

  // Find the highest tier the quantity qualifies for
  const qualifyingTier = [...product.quickBuy]
    .filter((opt) => opt.unitPrice && qty >= opt.qty)
    .sort((a, b) => b.qty - a.qty)[0];

  return qualifyingTier?.unitPrice || product.price;
}

/**
 * Relabel Quick Select tiers for items sold individually:
 * "1 Case" → "Each", "12+ Cases" → "12+ Each", "Save $2.00/case" → "Save $2.00/each".
 */
export function relabelTiersAsEach<T extends { label: string; qty: number; savings?: string }>(tiers: T[]): T[] {
  return tiers.map((t) => ({
    ...t,
    label: t.qty <= 1 ? "Each" : `${t.qty}+ Each`,
    ...(t.savings ? { savings: t.savings.replace(/\/[a-z]+$/i, "/each") } : {}),
  }));
}

/**
 * Selling unit for products whose names trip the generic unit guess
 * (which keys off words like "quart", "gallon", "32 oz"). Returns null when
 * the generic guess should stand.
 *   "40 CARTONS/PALLET", "84 Cases/pallet"   → Pallet (copy paper, bottled water)
 *   cup carrier trays ("8 Oz To 32 Oz")      → Case
 *   food storage bags ("Quart Size")         → Box when sold as one box ("50 CT"), else Case
 */
export function unitOverride(name: string, description = ""): string | null {
  if (/\b\d+\s*(?:cartons?|cases?)\s*\/\s*pallet\b/i.test(name)) return "Pallet";
  if (/cup carrier|carrier tray/i.test(name)) return "Case";
  if (/storage bags?/i.test(name)) return /\b\d+\s*ct\b/i.test(description) ? "Box" : "Case";
  return null;
}

/** Rewrite tier labels and savings for a different unit: "1 Quart" → "1 Box", "5+ Quarts" → "5+ Boxes". */
export function relabelTiers<T extends { label: string; qty: number; savings?: string }>(tiers: T[], unit: string): T[] {
  const plural = /(x|s|ch|sh)$/i.test(unit) ? `${unit}es` : `${unit}s`;
  return tiers.map((t) => ({
    ...t,
    label: t.qty <= 1 ? `1 ${unit}` : `${t.qty}+ ${plural}`,
    ...(t.savings ? { savings: t.savings.replace(/\/[a-z]+$/i, `/${unit.toLowerCase()}`) } : {}),
  }));
}
