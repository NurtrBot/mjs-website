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
