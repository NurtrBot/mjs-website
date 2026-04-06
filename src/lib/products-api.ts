import { getProducts, type BCProduct } from "./bigcommerce";
import { getSiteCategory, getSiteCategoryName, BC_CATEGORY_MAP, SITE_CATEGORY_NAMES } from "./category-map";
import type { ProductData } from "@/data/products";
import { sdsIndex } from "@/data/sds-index";

/* ── SDS lookup by SKU (case-insensitive) ── */
const sdsMap = new Map<string, string>();
for (const entry of sdsIndex) {
  sdsMap.set(entry.sku.toUpperCase(), entry.file);
  // Also try without trailing "EA" suffix (common variant)
  if (entry.sku.toUpperCase().endsWith("EA")) {
    sdsMap.set(entry.sku.toUpperCase().slice(0, -2), entry.file);
  }
}

function findSdsSheet(sku: string): string | undefined {
  return sdsMap.get(sku.toUpperCase());
}

/* ── Transform a BigCommerce product into our ProductData format ── */
function transformProduct(bc: BCProduct): ProductData {
  const siteCategory = getSiteCategory(bc.categories);
  const siteCategoryName = getSiteCategoryName(siteCategory);

  // Get the best image
  const images = (bc.images || [])
    .sort((a, b) => (a.is_thumbnail ? -1 : 1) - (b.is_thumbnail ? -1 : 1))
    .map((img) => img.url_standard);
  if (images.length === 0) images.push("/images/placeholder-product.svg");

  // Build a clean card title (short version of name)
  const cardTitle = makeCardTitle(bc.name);

  // Extract pack from name
  const pack = extractPack(bc.name);

  // Extract brand from name
  const brand = extractBrand(bc.name);

  // Strip HTML from description
  const description = bc.description
    ? bc.description.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 500)
    : `${bc.name}. Professional-grade product for commercial and industrial use.`;

  // Determine subcategory from BC categories
  const subcategory = getSubcategory(bc);

  // Category overrides — move misplaced products to correct category
  const nameLower = bc.name.toLowerCase();
  let finalCategory = siteCategoryName;
  if (nameLower.includes("spot off") || nameLower.includes("spot remover") ||
      (subcategory === "Specialty Cleaners" && siteCategory === "equipment") ||
      (subcategory === "All Purpose Cleaners" && siteCategory === "equipment") ||
      (subcategory === "Hand Soap & Sanitizer" && siteCategory === "equipment") ||
      (subcategory === "Floor Care" && siteCategory === "equipment") ||
      (subcategory === "Carpet Care" && siteCategory === "equipment") ||
      (subcategory === "Floor Finishes" && siteCategory === "equipment")) {
    finalCategory = "Cleaning Chemicals";
  }

  const slug = bc.custom_url?.url
    ? bc.custom_url.url.replace(/^\/|\/$/g, "")
    : `product-${bc.id}`;

  return {
    slug,
    sku: bc.sku || `BC-${bc.id}`,
    name: bc.name,
    brand,
    price: bc.calculated_price || bc.price,
    originalPrice: bc.retail_price > bc.price ? bc.retail_price : undefined,
    rating: 4.5,
    reviewCount: bc.total_sold > 0 ? Math.min(bc.total_sold, 500) : 0,
    images,
    inStock: bc.availability === "available" && (bc.inventory_tracking === "none" || bc.inventory_level > 0),
    stockQty: bc.inventory_level || 100,
    description,
    highlights: generateHighlights(bc),
    specs: {
      SKU: bc.sku || "",
      Brand: brand,
      Condition: bc.condition || "New",
      ...(bc.weight > 0 ? { Weight: `${bc.weight} lbs` } : {}),
    },
    category: finalCategory,
    subcategory,
    cardTitle,
    pack,
    imageFit: "contain",
    quickBuy: [],
    sdsSheet: findSdsSheet(bc.sku || ""),
  };
}

function makeCardTitle(name: string): string {
  let title = name
    .replace(/\([\w-]+\)\s*$/, "")
    .replace(/^(JANITORS FINEST|GENUINE JOE|SUNNYCARE|ALPINE INDUSTRIES|CHEMCOR|CHASE PRODUCTS|PLATINUM KNIGHT|SOFT TOUCH)[®™,\s]*/i, "")
    .replace(/^(IPC Eagle|Simple Green|Sandia|Mercury|Ettore|Rubbermaid|Durable Packaging|Procell|Stone Pro|Formula 409|Clorox|Wave|Gold|Clean-Up)[®™,\s]*/i, "")
    .replace(/\(IMPACT\)\s*/i, "")
    .trim();

  const parts = title.split(",").map((p) => p.trim());
  title = parts[0];
  title = title
    .replace(/\d+\s*fl\s*oz/i, "")
    .replace(/\d+\s*oz/i, "")
    .replace(/\d+\s*ml/i, "")
    .replace(/\d+\s*gal(lon)?/i, "")
    .replace(/\d+\s*[""x×]\s*\d+/g, "")
    .replace(/\d+\/\w+/g, "")
    .replace(/\d+\s*(rolls?|sheets?|packs?|count|ct|pk|bx|cs)\b/gi, "")
    .replace(/\s+-\s*$/, "")
    .replace(/\s+/g, " ")
    .trim();

  if (title.length > 40) title = title.slice(0, 37) + "...";
  return title || name.slice(0, 37);
}

function extractPack(name: string): string {
  const patterns = [
    /(\d+)\s*\/\s*(case|carton|ct|cs|bx|pk|box)/i,
    /(\d+)\s*(rolls?|sheets?|packs?|bags?|count|ct|pk|bx|per case)\b/i,
    /(\d+)\s*per\s+(case|carton|box)/i,
    /\b(gallon|each|pair)\b/i,
  ];
  for (const p of patterns) {
    const m = name.match(p);
    if (m) return m[0];
  }
  return "Each";
}

function extractBrand(name: string): string {
  const brands: Record<string, string> = {
    "JANITORS FINEST": "Janitors Finest",
    "GENUINE JOE": "Genuine Joe",
    "SUNNYCARE": "SunnyCare",
    "ALPINE INDUSTRIES": "Alpine Industries",
    "CHASE PRODUCTS": "Chase Products",
    "PLATINUM KNIGHT": "Platinum Knight",
    "SOFT TOUCH": "Soft Touch",
    "CLOROX": "Clorox",
    "FORMULA 409": "Formula 409",
    "SIMPLE GREEN": "Simple Green",
    "RUBBERMAID": "Rubbermaid",
    "SANI PROFESSIONAL": "Sani Professional",
    "IPC EAGLE": "IPC Eagle",
    "SANDIA": "Sandia",
    "MERCURY": "Mercury",
    "ETTORE": "Ettore",
    "PROCELL": "Procell",
    "STONE PRO": "Stone Pro",
    "WAVE": "Wave",
    "DURABLE PACKAGING": "Durable Packaging",
  };
  const upper = name.toUpperCase();
  for (const [key, val] of Object.entries(brands)) {
    if (upper.includes(key)) return val;
  }
  const first = name.split(/[,\s]/)[0].replace(/[®™©"]/g, "");
  if (first && /^[A-Z]/.test(first) && first.length > 1) return first;
  return "MJS";
}

function getSubcategory(bc: BCProduct): string {
  const name = bc.name.toLowerCase();
  const siteSlug = getSiteCategory(bc.categories);

  // ── Paper Products ──
  if (name.includes("center-pull") || name.includes("center pull")) return "Center-Pull Towels";
  if (name.includes("singlefold") || name.includes("single-fold")) return "Multifolds";
  if (name.includes("multifold") || name.includes("multi-fold") || name.includes("c-fold")) return "Multifolds";
  if ((name.includes("towel") && (name.includes("roll") || name.includes("jrt"))) || name.includes("jrt")) return "Roll Towels";
  if (name.includes("bathroom tissue") || name.includes("bath tissue") || name.includes("toilet")) return "Toilet Tissue";
  if (name.includes("facial")) return "Facial Tissue";
  if (name.includes("seat cover")) return "Seat Covers";
  if (name.includes("tampon") || name.includes("feminine") || name.includes("hygiene product")) return "Feminine Products";
  if (name.includes("copy paper") || name.includes("copier paper")) return "Copy Paper";

  // ── Gloves & Safety — context-aware ──
  if (name.includes("nitrile")) return "Nitrile Gloves";
  if (name.includes("latex")) return "Latex Gloves";
  if (name.includes("vinyl") && siteSlug === "gloves-safety") return "Vinyl Gloves";
  if (name.includes("apron")) return "Aprons";
  if (name.includes("bouffant") || name.includes("hair net")) return "Hair Protection";
  if (name.includes("beard cover")) return "Beard Covers";
  if (name.includes("shoe cover")) return "Shoe Covers";
  if (name.includes("lab coat")) return "Lab Coats";
  if (name.includes("face mask") || name.includes("ear loop") || name.includes("respirator") || name.includes("dust mask") || name.includes("n95")) return "Face Masks";
  if (name.includes("poly sleeve") || name.includes("arm sleeve") || name.includes("disposable sleeve")) return "Arm Sleeves";
  if (name.includes("ear plug")) return "Ear Plugs";
  if (name.includes("eye wear") || name.includes("safety glass")) return "Eye Protection";
  if (name.includes("rain wear") || name.includes("rain coat")) return "Rain Wear";
  if (name.includes("back support")) return "Back Support";
  if (name.includes("first aid")) return "First Aid";

  // ── Trash ──
  if (name.includes("liner") || (name.includes("trash") && !name.includes("trash can"))) return "Can Liners";

  // ── Chemicals ──
  if (name.includes("degreaser")) return "Degreasers";
  if (name.includes("disinfect")) return "Disinfectants";
  if (name.includes("urinal screen") || name.includes("urinal mat") || name.includes("bowl clip")) return "Restroom Deodorizers";
  if (name.includes("metered spray") || name.includes("air freshener") || name.includes("freshener") || name.includes("odor") || name.includes("deodoriz")) return "Air Fresheners";
  if (name.includes("hand soap") || name.includes("hand sanitiz") || name.includes("sanitiz")) return "Hand Soap & Sanitizer";
  if (name.includes("soap") && siteSlug === "cleaning-chemicals") return "Hand Soap & Sanitizer";
  if (name.includes("wipe")) return "Wipes";
  if (name.includes("bleach")) return "Bleach";
  if (name.includes("glass clean")) return "Glass Cleaners";
  if (name.includes("oven clean")) return "Oven Cleaners";
  if (name.includes("dish wash") || name.includes("dish soap") || name.includes("dishwash")) return "Dish Soap";
  if (name.includes("laundry")) return "Laundry";
  if (name.includes("shower") || name.includes("tub clean") || name.includes("bathroom clean")) return "Bathroom Cleaners";
  if (name.includes("all purpose") || name.includes("all-purpose")) return "All Purpose Cleaners";
  if (name.includes("stripper")) return "Floor Strippers";
  if (name.includes("floor finish") || name.includes("floor seal")) return "Floor Finishes";
  if (name.includes("floor clean") || name.includes("floor")) return "Floor Care";
  if (name.includes("carpet")) return "Carpet Care";
  if (name.includes("polish")) return "Polishes";
  if (name.includes("drain")) return "Drain Cleaners";
  if (name.includes("descaler") || name.includes("lime") || name.includes("scale remover")) return "Specialty Cleaners";
  if (name.includes("grout") || name.includes("tile") || name.includes("stone pro")) return "Specialty Cleaners";
  if (name.includes("vandal") || name.includes("gum remover") || name.includes("wax remover") || name.includes("remover")) return "Specialty Cleaners";
  if (name.includes("spray buff") || name.includes("neutralizer") || name.includes("rinse")) return "Floor Finishes";
  if (name.includes("shampoo") && siteSlug === "cleaning-chemicals") return "Carpet Care";
  if (name.includes("dust") && name.includes("spray")) return "Specialty Cleaners";
  if (name.includes("seal") && name.includes("urinal")) return "Restroom Deodorizers";
  if (name.includes("foam wash") || name.includes("body wash")) return "Hand Soap & Sanitizer";
  if (name.includes("aerosol") && siteSlug === "cleaning-chemicals") return "Specialty Cleaners";
  if (name.includes("cleaner") && siteSlug === "cleaning-chemicals") return "All Purpose Cleaners";

  // ── Packaging — more specific first ──
  if (name.includes("bubble")) return "Bubble Wrap";
  if (name.includes("peanut") || name.includes("spacepak")) return "Packing Peanuts";
  if (name.includes("tape gun") || name.includes("tape dispenser")) return "Tape Dispensers";
  if (name.includes("tape")) return "Tape";
  if (name.includes("zip tie") || name.includes("cable tie") || name.includes("cable zip")) return "Cable Ties";
  if (name.includes("strapping") || name.includes("metal seal")) return "Steel Strapping";
  if (name.includes("poly bag") || name.includes("reclosable") || name.includes("gusseted")) return "Poly Bags";
  if (name.includes("label") || name.includes("packing slip") || name.includes("envelope")) return "Labels";
  if (name.includes("stretch") || name.includes("film") || name.includes("wrap")) return "Stretch Film";

  // ── Equipment ──
  if (name.includes("microfiber") || name.includes("smart rag") || name.includes("smartrag")) return "Microfiber";
  if (name.includes("rag") || name.includes("surgical towel") || name.includes("knit rag") || name.includes("teri towel")) return "Rags & Wipers";
  if (name.includes("absorbent") || name.includes("spill")) return "Absorbents";
  if (name.includes("sweeping compound")) return "Sweeping Compounds";
  if (name.includes("dispenser")) return "Dispensers";
  if (name.includes("dust mop")) return "Dust Mops";
  if (name.includes("mop head") || name.includes("mop handle") || name.includes("mop bucket") || name.includes("mop")) return "Mops & Handles";
  if (name.includes("broom") || name.includes("dust pan") || name.includes("dustpan")) return "Brooms & Dustpans";
  if (name.includes("bucket") || name.includes("wringer")) return "Buckets & Wringers";
  if (name.includes("vacuum")) return "Vacuums";
  if (name.includes("squeeg") || name.includes("scraper") || name.includes("window") || name.includes("ettore") || name.includes("rubber refill") || name.includes("channel replacement") || name.includes("washer sleeve") || name.includes("extension pole")) return "Window Equipment";
  if (name.includes("sprayer") || name.includes("spray bottle") || name.includes("trigger")) return "Sprayers & Bottles";
  if (name.includes("janitor cart") || name.includes("dolly") || name.includes("dump truck")) return "Carts & Dollies";
  if (/\bcart\b/.test(name) && !name.includes("carton")) return "Carts & Dollies";
  if (name.includes("trash can") || name.includes("waste") || name.includes("receptacle")) return "Trash Cans";
  if (name.includes("nabber") || name.includes("grabber") || name.includes("pick-up") || name.includes("pick up")) return "Grabbers";
  if (name.includes("caddy")) return "Caddies";
  if (name.includes("sponge")) return "Sponges";
  if (name.includes("pole") && !name.includes("polish")) return "Poles & Handles";
  if (name.includes("duster") || name.includes("feather")) return "Dusters";

  // ── Floor Care pads — MUST come before generic brush/pad checks ──
  if (name.includes("bonnet")) return "Bonnets";
  if (name.includes("stripping pad") || name.includes("super stripping")) return "Floor Pads";
  if (name.includes("buffing pad") || name.includes("red buffing")) return "Floor Pads";
  if (name.includes("polishing pad") || name.includes("white polishing")) return "Floor Pads";
  if (name.includes("scrubbing pad") || name.includes("green scrubbing")) return "Floor Pads";
  if (name.includes("natural blend") && name.includes("pad")) return "Floor Pads";
  if (name.includes("pad") && siteSlug === "floor-care") return "Floor Pads";

  if (name.includes("brush") || (name.includes("pad") && !name.includes("pad driver"))) return "Brushes & Pads";
  if (name.includes("pad driver") || name.includes("clutch plate")) return "Pad Drivers";
  if (name.includes("sign") || name.includes("wet floor")) return "Signs";
  if (name.includes("air mover") || name.includes("blower") || name.includes("fan")) return "Air Movers";
  if (name.includes("extractor") || name.includes("floor machine") || name.includes("buffer") || name.includes("burnisher")) return "Floor Machines";
  if (name.includes("mat") && siteSlug === "equipment") return "Matting";

  // ── Breakroom ──
  if (name.includes("napkin")) return "Napkins";
  if (name.includes("battery") || name.includes("batteries") || name.includes("procell")) return "Batteries";
  if (name.includes("water") && (name.includes("bottle") || name.includes("spring") || name.includes("gallon"))) return "Beverages";
  if (name.includes("food storage") || name.includes("food bag")) return "Food Storage";
  if (name.includes("cup") || name.includes("lid")) return "Cups & Lids";
  if (name.includes("plate") || name.includes("bowl")) return "Plates & Bowls";
  if (name.includes("fork") || name.includes("spoon") || name.includes("knife") || name.includes("cutlery") || name.includes("utensil")) return "Cutlery";
  if (name.includes("coffee") || name.includes("creamer") || name.includes("sugar") || name.includes("stir")) return "Coffee & Supplies";

  return "General";
}

function generateHighlights(bc: BCProduct): string[] {
  const h: string[] = [];
  if (bc.sku) h.push(`SKU: ${bc.sku}`);
  if (bc.weight > 0) h.push(`Weight: ${bc.weight} lbs`);
  if (bc.condition) h.push(`Condition: ${bc.condition}`);
  h.push("Professional grade quality");
  return h.slice(0, 4);
}

/* ── Public API ── */

export async function fetchProductsByCategory(
  siteSlug: string,
  _page = 1,
  _limit = 50
): Promise<{ products: ProductData[]; total: number; totalPages: number }> {
  // Get ALL BC category IDs mapped to this site slug (parents + children)
  const bcCategoryIds = Object.entries(BC_CATEGORY_MAP)
    .filter(([, slug]) => slug === siteSlug)
    .map(([id]) => Number(id));

  if (bcCategoryIds.length === 0) {
    return { products: [], total: 0, totalPages: 0 };
  }

  const allFetched: ProductData[] = [];
  const seen = new Set<number>();

  // Fetch from all mapped categories in parallel batches of 6
  for (let i = 0; i < bcCategoryIds.length; i += 6) {
    const batch = bcCategoryIds.slice(i, i + 6);
    const results = await Promise.allSettled(
      batch.map((catId) =>
        getProducts({ category_id: catId, page: 1, limit: 250, is_visible: true })
      )
    );
    for (const result of results) {
      if (result.status !== "fulfilled") continue;
      for (const p of result.value.data) {
        if (!seen.has(p.id) && p.price > 0) {
          seen.add(p.id);
          allFetched.push(transformProduct(p));
        }
      }
    }
  }

  // Filter out products that were reassigned to a different category
  const expectedCategoryName = SITE_CATEGORY_NAMES[siteSlug] || siteSlug;
  const filtered = allFetched.filter(p => p.category === expectedCategoryName);

  // Sort: Janitors Finest first, then machines first for equipment, then by popularity
  const machineSubs = new Set(["Vacuums", "Floor Machines", "Air Movers"]);
  filtered.sort((a, b) => {
    const aJF = a.brand.toLowerCase().includes("janitors finest") ? 1 : 0;
    const bJF = b.brand.toLowerCase().includes("janitors finest") ? 1 : 0;
    if (aJF !== bJF) return bJF - aJF; // JF first

    // For equipment: machines float to top
    if (siteSlug === "equipment") {
      const aMachine = machineSubs.has(a.subcategory) ? 1 : 0;
      const bMachine = machineSubs.has(b.subcategory) ? 1 : 0;
      if (aMachine !== bMachine) return bMachine - aMachine;
    }

    return b.reviewCount - a.reviewCount; // then by popularity
  });

  return {
    products: filtered,
    total: filtered.length,
    totalPages: 1,
  };
}

export async function fetchProductBySlug(slug: string): Promise<ProductData | null> {
  // The slug in BC is stored in custom_url
  try {
    const res = await getProducts({ limit: 1, keyword: slug.replace(/-/g, " ") });
    if (res.data.length > 0) {
      return transformProduct(res.data[0]);
    }
  } catch {
    // Fallback
  }
  return null;
}

export async function fetchAllProducts(page = 1, limit = 50): Promise<{ products: ProductData[]; total: number; totalPages: number }> {
  const res = await getProducts({ page, limit, is_visible: true });
  const products = res.data.filter((p) => p.price > 0).map(transformProduct);
  return {
    products,
    total: res.meta.pagination.total,
    totalPages: res.meta.pagination.total_pages,
  };
}

export async function searchProducts(keyword: string, limit = 250): Promise<ProductData[]> {
  const allResults: ProductData[] = [];
  const seen = new Set<number>();
  let page = 1;
  const maxPages = 4; // up to 1000 products

  while (page <= maxPages) {
    const res = await getProducts({ keyword, limit: 250, page, is_visible: true });
    for (const p of res.data) {
      if (!seen.has(p.id) && p.price > 0) {
        seen.add(p.id);
        allResults.push(transformProduct(p));
      }
    }
    if (page >= res.meta.pagination.total_pages) break;
    page++;
  }

  return allResults;
}

export { transformProduct };
