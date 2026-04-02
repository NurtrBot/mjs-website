import { getProducts, type BCProduct } from "./bigcommerce";
import { getSiteCategory, getSiteCategoryName, BC_CATEGORY_MAP } from "./category-map";
import type { ProductData } from "@/data/products";

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
    category: siteCategoryName,
    subcategory,
    cardTitle,
    pack,
    imageFit: "contain",
    quickBuy: [],
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
  if (name.includes("towel") && name.includes("roll")) return "Roll Towels";
  if (name.includes("multifold") || name.includes("multi-fold") || name.includes("c-fold")) return "Multifolds";
  if (name.includes("toilet") || name.includes("bath tissue")) return "Toilet Tissue";
  if (name.includes("facial")) return "Facial Tissue";
  if (name.includes("napkin")) return "Napkins";
  if (name.includes("seat cover")) return "Seat Covers";
  if (name.includes("nitrile")) return "Nitrile Gloves";
  if (name.includes("latex")) return "Latex Gloves";
  if (name.includes("vinyl")) return "Vinyl Gloves";
  if (name.includes("liner") || name.includes("trash")) return "Can Liners";
  if (name.includes("degreaser")) return "Degreasers";
  if (name.includes("disinfect")) return "Disinfectants";
  if (name.includes("soap") || name.includes("sanitiz")) return "Hand Soap & Sanitizer";
  if (name.includes("freshener") || name.includes("odor") || name.includes("deodoriz")) return "Air Fresheners";
  if (name.includes("wipe")) return "Wipes";
  if (name.includes("bleach")) return "Bleach";
  if (name.includes("glass clean")) return "Glass Cleaners";
  if (name.includes("floor")) return "Floor Care";
  if (name.includes("carpet")) return "Carpet Care";
  if (name.includes("dispenser")) return "Dispensers";
  if (name.includes("mop")) return "Mops & Handles";
  if (name.includes("broom")) return "Brooms & Dustpans";
  if (name.includes("bucket")) return "Buckets & Wringers";
  if (name.includes("vacuum")) return "Vacuums";
  if (name.includes("stretch") || name.includes("film")) return "Stretch Film";
  if (name.includes("tape")) return "Tape";
  if (name.includes("cup") || name.includes("lid")) return "Cups & Lids";
  if (name.includes("plate") || name.includes("bowl")) return "Plates & Bowls";
  if (name.includes("fork") || name.includes("spoon") || name.includes("knife")) return "Cutlery";
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
  page = 1,
  limit = 50
): Promise<{ products: ProductData[]; total: number; totalPages: number }> {
  // Find all BC category IDs that map to this site slug
  const bcCategoryIds = Object.entries(BC_CATEGORY_MAP)
    .filter(([, slug]) => slug === siteSlug)
    .map(([id]) => Number(id));

  if (bcCategoryIds.length === 0) {
    return { products: [], total: 0, totalPages: 0 };
  }

  // Fetch from the first matching top-level category
  // BigCommerce only supports one category filter at a time,
  // so we fetch from each and combine
  const allProducts: ProductData[] = [];
  const seen = new Set<number>();

  for (const catId of bcCategoryIds.slice(0, 5)) {
    try {
      const res = await getProducts({ category_id: catId, page, limit, is_visible: true });
      for (const p of res.data) {
        if (!seen.has(p.id) && p.price > 0) {
          seen.add(p.id);
          allProducts.push(transformProduct(p));
        }
      }
    } catch {
      // Skip failed categories
    }
  }

  return {
    products: allProducts,
    total: allProducts.length,
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

export async function searchProducts(keyword: string, limit = 20): Promise<ProductData[]> {
  const res = await getProducts({ keyword, limit, is_visible: true });
  return res.data.filter((p) => p.price > 0).map(transformProduct);
}

export { transformProduct };
