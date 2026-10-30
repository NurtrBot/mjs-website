import { getRollsPerCase } from "./per-roll";
import { getBagsPerCase } from "./per-bag";

/**
 * What one case breaks down into, for the green price-per-unit pill:
 *   rolls (toilet tissue, roll towels), bags (trash liners), or for other paper
 *   the inner pack — e.g. multifold "16 Packs/250 Sheets" → 16 packs × 250.
 * Items with no inner pack (napkins, tampons, 4525 seat covers) fall back to
 * the single piece, e.g. "250 Individually Boxed Napkins/Carton" → 250 napkins.
 */
export interface CaseBreakdown {
  /** Units in one case (or pallet), e.g. 16 packs */
  count: number;
  /** Singular unit name, e.g. "pack" */
  unit: string;
  /** Pieces in each unit, e.g. 250 towels per pack (shown as "16 packs × 250") */
  each?: number;
}

const UNIT_WORDS: Record<string, string> = {
  pk: "pack", pack: "pack", packs: "pack",
  sleeve: "sleeve", sleeves: "sleeve",
  bundle: "bundle", bundles: "bundle",
  bx: "box", box: "box", boxes: "box",
  ream: "ream", reams: "ream",
};
const UNIT = "(pk|packs?|sleeves?|bundles?|bx|box(?:es)?|reams?)";
const CASE = "(?:cs|case|carton|ctn|ct|cart)";

// Case packs that only appear in the full BigCommerce description (the site keeps a shortened one)
const KNOWN_PACKS: Record<string, CaseBreakdown> = {
  "5402": { count: 12, unit: "pack", each: 334 },        // "12 packs per case, 334 sheets per pack"
  "202310": { count: 10, unit: "ream", each: 500 },      // "500 Sheets per Pack, 10 Packs per Carton"
  "202310PLT": { count: 400, unit: "ream", each: 500 },  // same, "40 Cartons Per Pallet"
};

const PAPER_NAME = /multi-?fold|single-?fold|c-?fold|center-?pull|facial tissue|seat covers?|copy paper|sanitary napkins?|tampons?/i;

export function getCaseBreakdown(product: {
  sku?: string; category: string; name: string; pack?: string; description?: string;
}): CaseBreakdown | null {
  const rolls = getRollsPerCase(product);
  if (rolls) return { count: rolls, unit: "roll" };
  const bags = getBagsPerCase(product);
  if (bags) return { count: bags, unit: "bag" };

  if (product.sku && KNOWN_PACKS[product.sku]) return KNOWN_PACKS[product.sku];

  const isPaper = product.category === "Paper Products" || product.category === "Paper & Restroom" || PAPER_NAME.test(product.name);
  // The synced catalog files gloves under Paper & Restroom
  if (!isPaper || /dispenser|receptacle|glove/i.test(product.name)) return null;

  const clean = (s: string) => s.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/(\d),(\d)/g, "$1$2").replace(/\s+/g, " ");
  const name = clean(product.name);
  const desc = clean(product.description || "");
  const isCopyPaper = /copy paper/i.test(name);

  // Inner units per case: "16 PK/CT", "20 Packs Per Carton", "36 Boxes/Carton", "16 Packs/250 Sheets"
  const inner = (s: string) =>
    s.match(new RegExp(`\\b(\\d+)\\s*${UNIT}\\s*(?:\\/|per)\\s*${CASE}\\b`, "i")) ||
    s.match(new RegExp(`\\b(\\d+)\\s*${UNIT}\\s*\\/\\s*(\\d+)\\s*(?:sheets|towels)\\b`, "i"));
  // Pieces per inner unit: "250/PK", "250 sheets Per Pack", "100 Sheets/Box", "250 Quantity Per Bundle"
  const each = (s: string) =>
    s.match(new RegExp(`\\b(\\d+)\\s*(?:sheets|towels|covers|quantity|qty)?\\s*(?:\\/|per)\\s*${UNIT}\\b`, "i"));
  const caseTotal = name.match(new RegExp(`\\b(\\d+)\\s*\\/\\s*${CASE}\\b`, "i"));

  let count: number | null = null;
  let unitWord: string | null = null;
  let eachCount: number | undefined;
  const m = inner(name) || inner(desc);
  const e = each(name) || each(desc);
  if (m) {
    count = parseInt(m[1], 10);
    unitWord = UNIT_WORDS[m[2].toLowerCase()];
    if (m[3]) eachCount = parseInt(m[3], 10); // "16 Packs/250 Sheets"
  } else if (e && caseTotal && parseInt(caseTotal[1], 10) % parseInt(e[1], 10) === 0) {
    // "250 Quantity Per Bundle - 4000 / Carton" → 16 bundles
    count = parseInt(caseTotal[1], 10) / parseInt(e[1], 10);
    unitWord = UNIT_WORDS[e[2].toLowerCase()];
  } else {
    // Bare case count when the name says what the inner unit is: "200/PACK, 12/CARTON", "Pop-Up Box, 36/Carton", "100 Sheets/Box 30/Cs"
    const bare = caseTotal;
    const named = name.match(new RegExp(`\\b${UNIT}\\b`, "i"));
    if (bare && named) {
      count = parseInt(bare[1], 10);
      unitWord = UNIT_WORDS[named[1].toLowerCase()];
    }
  }

  if (count && unitWord) {
    if (!eachCount && e) eachCount = parseInt(e[1], 10);
    // Copy paper is sold by the case or pallet; its 500-sheet packs are reams
    if (isCopyPaper) unitWord = "ream";
    const pallet = name.match(/\b(\d+)\s*cartons?\s*\/\s*pallet\b/i);
    if (pallet) count *= parseInt(pallet[1], 10);
    return count >= 2 && count <= 1000 ? { count, unit: unitWord, ...(eachCount && eachCount !== count ? { each: eachCount } : {}) } : null;
  }

  // No inner pack: price per piece for countable items
  const piece = /napkin/i.test(name) ? "napkin" : /tampon/i.test(name) ? "tampon" : /seat cover/i.test(name) ? "cover" : null;
  if (piece) {
    const pm = name.match(new RegExp(`\\b(\\d+)\\s*(?:[a-z ]{0,30})?\\/\\s*${CASE}\\b`, "i")) ||
      desc.match(new RegExp(`\\b(\\d+)\\s*\\/\\s*${CASE}\\b`, "i"));
    const n = pm ? parseInt(pm[1], 10) : NaN;
    if (n >= 10 && n <= 20000) return { count: n, unit: piece };
  }
  return null;
}
