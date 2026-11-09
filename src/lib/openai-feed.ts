/* ─────────────────────────────────────────────────────────────
   ChatGPT (OpenAI Commerce) product feed
   Spec: https://developers.openai.com/commerce/specs/file-upload/products

   Built from the LIVE BigCommerce catalog through the same transformProduct()
   the product pages use, so price / stock / brand / URL always match the site
   and the product page's JSON-LD.

   Discovery only: is_eligible_checkout stays false. ChatGPT checkout is a
   separate integration that OpenAI has to enable.
   ───────────────────────────────────────────────────────────── */

import { getProducts, type BCProduct } from "@/lib/bigcommerce";
import { transformProduct, loadBrandMap } from "@/lib/products-api";
import { BUSINESS, RETURNS } from "@/lib/business";

const SITE = BUSINESS.siteUrl;

export interface OpenAIFeedRow {
  item_id: string;
  title: string;
  description: string;
  url: string;
  brand: string;
  seller_name: string;
  seller_url: string;
  image_url: string;
  additional_image_urls?: string[];
  availability: "in_stock" | "out_of_stock";
  price: string;
  condition: "new";
  product_category?: string;
  gtin?: string;
  mpn?: string;
  weight?: string;
  item_weight_unit?: "lb";
  review_count?: number;
  star_rating?: string;
  accepts_returns: boolean;
  return_deadline_in_days: number;
  return_policy: string;
  seller_privacy_policy: string;
  seller_tos: string;
  is_eligible_search: boolean;
  is_eligible_checkout: boolean;
}

export interface FeedSkip {
  sku: string;
  name: string;
  reason: string;
}

const ENTITIES: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
  rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", ndash: "–", mdash: "—",
  hellip: "…", bull: "•", plusmn: "±", middot: "·", eacute: "é", frasl: "/", prime: "′", Prime: "″", deg: "°", reg: "®", trade: "™", copy: "©", frac12: "½", frac14: "¼", frac34: "¾", times: "×",
};

/** HTML → plain text: drop tags, decode entities, collapse whitespace */
export function toPlainText(html: string): string {
  return (html || "")
    .replace(/<\s*(br|\/p|\/li|\/div|\/h\d)\s*\/?>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z0-9]+);/gi, (m, n) => ENTITIES[n] ?? ENTITIES[n.toLowerCase()] ?? m)
    .replace(/\s+/g, " ")
    .trim();
}

function clip(s: string, max: number): string {
  if (s.length <= max) return s;
  const cut = s.slice(0, max - 1);
  return cut.slice(0, Math.max(cut.lastIndexOf(" "), max - 20)).trimEnd() + "…";
}

/** GTIN-8/12/13/14 with a valid check digit; anything else is dropped (never guessed) */
export function validGtin(raw?: string): string | undefined {
  let d = (raw || "").replace(/[\s-]/g, "");
  // UPC-A often gets saved without its leading zero (11 digits)
  if (d.length === 11) d = "0" + d;
  if (!/^\d+$/.test(d) || ![8, 12, 13, 14].includes(d.length)) return undefined;
  const digits = d.split("").map(Number);
  const check = digits.pop()!;
  const sum = digits.reverse().reduce((s, n, i) => s + n * (i % 2 === 0 ? 3 : 1), 0);
  return (10 - (sum % 10)) % 10 === check ? d : undefined;
}

/* Brands BigCommerce doesn't have set but the product name states plainly.
   Feed-only: the website and BigCommerce are not changed. */
const NAME_BRANDS: [RegExp, string][] = [
  [/janitor[’']?s finest|janitors finest/i, "Janitors Finest"],
  [/johnny[’']?s choice/i, "Johnny's Choice"],
  [/\btechnichem\b/i, "Technichem"],
  [/\bsmartrags\b/i, "Smartrags"],
  [/\bajax\b/i, "Ajax"],
  [/\bchase (champion|products)\b|\bchampion sprayon\b/i, "Chase Products"],
  [/\bsanitaire\b|^tradition upright vacuum/i, "Sanitaire"],
  [/\bfabuloso\b/i, "Fabuloso"],
  [/\bpine-?sol\b/i, "Pine-Sol"],
  [/\bla[’']?s totally awesome\b/i, "LA's Totally Awesome"],
  [/^freshprod\b|\bfresh products\b/i, "Fresh Products"],
  [/^dribble\b/i, "Dribble"],
  [/^georgiapac\b|\bgeorgia[- ]pacific\b/i, "Georgia-Pacific"],
  [/^scott\b/i, "Scott"],
  [/^7th genpro\b|\bseventh generation\b/i, "Seventh Generation"],
  [/^sierra soft\b/i, "Sierra Soft"],
  [/\b(gofit|proguard|super coach pro)\b/i, "ProTeam"],
  [/^alpine (alp-|industries)/i, "Alpine Industries"],
  [/\bpurell\b/i, "Purell"],
  [/\bgojo\b/i, "GOJO"],
];

/** Generic, unbranded stock (stretch film, rags, boxes…) is listed under the store's name */
const FALLBACK_BRAND = BUSINESS.name;

function feedBrand(siteBrand: string, name: string): string {
  if (siteBrand) return siteBrand;
  const plain = toPlainText(name);
  return NAME_BRANDS.find(([re]) => re.test(plain))?.[1] || FALLBACK_BRAND;
}

type BCWithCodes = BCProduct & { upc?: string; gtin?: string; mpn?: string };

function toRow(bc: BCWithCodes): { row?: OpenAIFeedRow; skip?: string } {
  const p = transformProduct(bc);
  if (!p) return { skip: "could not map product" };
  const images = (p.images || []).filter((u) => /^https?:\/\//.test(u));
  if (!images.length) return { skip: "no image" };
  if (!(p.price > 0)) return { skip: "no price" };

  // Full BigCommerce text (the site trims its copy to 500 chars for display)
  const description = toPlainText(bc.description) || toPlainText(p.description) || toPlainText(p.name);
  const title = toPlainText(p.name);
  // Add the pack size only when the name doesn't already state it ("96 Rolls Per Case" ≈ "96 Rolls/Case")
  const packNumber = p.pack?.match(/\d[\d,]*/)?.[0];
  const packInTitle =
    !!p.pack && p.pack !== "Each" &&
    !title.toLowerCase().includes(p.pack.toLowerCase()) &&
    !(packNumber && new RegExp(`\\b${packNumber}\\b`).test(title)) &&
    !/\b(case|carton|cs|ctn|pack|pk|box|bx)\b/i.test(title);

  const gtin = validGtin(bc.gtin) || validGtin(bc.upc);
  const mpn = bc.mpn?.trim() || undefined;

  return {
    row: {
      item_id: p.sku,
      title: clip(packInTitle ? `${title} (${p.pack})` : title, 150),
      description: clip(description, 5000),
      url: `${SITE}/product/${p.slug}`,
      brand: feedBrand(p.brand, p.name),
      seller_name: BUSINESS.name,
      seller_url: SITE,
      image_url: images[0],
      ...(images.length > 1 ? { additional_image_urls: images.slice(1, 10) } : {}),
      availability: p.inStock ? "in_stock" : "out_of_stock",
      price: `${p.price.toFixed(2)} USD`,
      condition: "new",
      ...(p.category ? { product_category: p.subcategory ? `${p.category} > ${p.subcategory}` : p.category } : {}),
      ...(gtin ? { gtin } : {}),
      ...(mpn ? { mpn } : {}),
      ...(bc.weight > 0 ? { weight: String(bc.weight), item_weight_unit: "lb" as const } : {}),
      ...(p.reviewCount > 0 && p.rating > 0
        ? { review_count: p.reviewCount, star_rating: p.rating.toFixed(2) }
        : {}),
      accepts_returns: true,
      return_deadline_in_days: RETURNS.windowDays,
      return_policy: `${SITE}/return-policy`,
      seller_privacy_policy: `${SITE}/privacy-policy`,
      seller_tos: `${SITE}/terms`,
      is_eligible_search: true,
      is_eligible_checkout: false,
    },
  };
}

/** Full snapshot of every visible, priced BigCommerce product */
export async function buildOpenAIFeed(): Promise<{ rows: OpenAIFeedRow[]; skipped: FeedSkip[] }> {
  await loadBrandMap();
  const rows: OpenAIFeedRow[] = [];
  const skipped: FeedSkip[] = [];
  const seen = new Set<string>();

  for (let page = 1; page <= 40; page++) {
    const res = await getProducts({ page, limit: 250, is_visible: true });
    for (const bc of res.data as BCWithCodes[]) {
      const { row, skip } = toRow(bc);
      if (!row) {
        skipped.push({ sku: bc.sku, name: bc.name, reason: skip || "unknown" });
        continue;
      }
      if (seen.has(row.item_id)) {
        skipped.push({ sku: bc.sku, name: bc.name, reason: "duplicate SKU" });
        continue;
      }
      seen.add(row.item_id);
      rows.push(row);
    }
    if (page >= res.meta.pagination.total_pages) break;
  }
  return { rows, skipped };
}
