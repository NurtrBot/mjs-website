/**
 * Work out how many bags are in a case for trash liners, so the product page
 * can show a price-per-bag breakdown.
 *
 * Trash bags are identified by name ("can liner", "trash bag/liner") because
 * the synced local catalog files them under several categories. The count is
 * read from the name ("500/CS", "250/BX", "100/ Case", "250/ CAse") and then
 * the pack text (which is usually just the gallon size).
 *
 * Returns null for anything that isn't a trash bag or has no bag count.
 */
export function getBagsPerCase(product: { pack?: string; name: string }): number | null {
  if (!/can liner|trash (?:bag|liner)|garbage bag/i.test(product.name)) return null;
  // Receptacle/dispenser liners aren't trash bags
  if (/receptacle|dispenser/i.test(product.name)) return null;

  const text = `${product.name} | ${product.pack || ""}`.replace(/(\d),(\d)/g, "$1$2");
  const m = text.match(/\b(\d+)\s*\/\s*(?:cs|case|carton|ctn|ct|bx|box)\b/i);

  const bags = m ? parseInt(m[1], 10) : NaN;
  return bags >= 10 && bags <= 5000 ? bags : null;
}
