/**
 * Work out how many rolls are in a case for paper products, so the product
 * page can show a price-per-roll breakdown.
 *
 * Reads the pack text first (hand-curated, e.g. "96 Rolls/Case"), then the
 * product name. Handles the ways roll counts appear in our catalog:
 *   "96 Rolls Per Case", "12 Rolls/Carton", "36 Rls/", "30 RLS/CT"
 *   "500 SHEETS/ROLL, 96/CARTON"   → 96 (roll product with a bare case count)
 * and ignores per-roll figures like "500 Sheets Per Roll" or "320/roll".
 *
 * Returns null when the product isn't a paper product or no roll count is found,
 * so non-roll paper (multifold towels, facial tissue) gets no tag.
 */
export function getRollsPerCase(product: { category: string; pack?: string; name: string }): number | null {
  // Live BigCommerce data says "Paper Products"; the synced local catalog says "Paper & Restroom"
  if (product.category !== "Paper Products" && product.category !== "Paper & Restroom") return null;
  // Dispensers hold rolls but aren't sold by the roll (TD500's synced pack is "500 Roll")
  if (/dispenser/i.test(product.name)) return null;

  const text = `${product.pack || ""} | ${product.name}`.replace(/(\d),(\d)/g, "$1$2");

  // A number directly followed by "rolls"/"rls"/"rl" is the roll count
  let m = text.match(/\b(\d+)\s*(?:rolls?|rls?)\b/i);

  // Otherwise, a roll product with a bare case count ("48 /Carton", "12 Per case")
  const isRollProduct = /(?:\/\s*|per\s+)roll\b|(?:toilet|bath|bathroom)\s+tissue|\bjrt\b|roll towel/i.test(text);
  if (!m && isRollProduct) {
    m = text.match(/\b(\d+)\s*(?:\/|per)\s*(?:case|carton|ctn|ct|cs)\b/i);
  }

  const rolls = m ? parseInt(m[1], 10) : NaN;
  return rolls >= 1 && rolls <= 500 ? rolls : null;
}
