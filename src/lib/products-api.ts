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

/* ── Custom bulk pricing by SKU ── */
const CUSTOM_PRICING: Record<string, { label: string; qty: number; unitPrice?: number; savings?: string }[]> = {
  "5602": [
    { label: "1 Case", qty: 1, unitPrice: 48.99 },
    { label: "5 Cases", qty: 5, unitPrice: 46.99, savings: "Save $2/case" },
    { label: "15 Cases", qty: 15, unitPrice: 43.99, savings: "Save $5/case" },
    { label: "25 Cases", qty: 25, unitPrice: 39.99, savings: "Save $9/case" },
  ],
  "5200": [
    { label: "1 Case", qty: 1, unitPrice: 36.99 },
    { label: "24 Cases", qty: 24, unitPrice: 33.99, savings: "Save $3/case" },
    { label: "48 Cases", qty: 48, unitPrice: 28.99, savings: "Save $8/case" },
    { label: "54 Cases", qty: 54, unitPrice: 26.99, savings: "Save $10/case" },
  ],
  "5109": [
    { label: "1 Case", qty: 1, unitPrice: 43.99 },
    { label: "10 Cases", qty: 10, unitPrice: 39.99, savings: "Save $4/case" },
    { label: "25 Cases", qty: 25, unitPrice: 36.99, savings: "Save $7/case" },
    { label: "50 Cases", qty: 50, unitPrice: 33.99, savings: "Save $10/case" },
  ],
  "5800": [
    { label: "1 Case", qty: 1, unitPrice: 37.99 },
    { label: "12 Cases", qty: 12, unitPrice: 34.99, savings: "Save $3/case" },
    { label: "30 Cases", qty: 30, unitPrice: 31.99, savings: "Save $6/case" },
    { label: "60 Cases", qty: 60, unitPrice: 29.99, savings: "Save $8/case" },
  ],
  "5300": [
    { label: "1 Case", qty: 1, unitPrice: 30.99 },
    { label: "24 Cases", qty: 24, unitPrice: 27.99, savings: "Save $3/case" },
    { label: "48 Cases", qty: 48, unitPrice: 24.99, savings: "Save $6/case" },
    { label: "72 Cases", qty: 72, unitPrice: 22.99, savings: "Save $8/case" },
  ],
  "FLM8018": [
    { label: "1 Case", qty: 1, unitPrice: 53.99 },
    { label: "32 Cases", qty: 32, unitPrice: 49.99, savings: "Save $4/case" },
    { label: "48 Cases", qty: 48, unitPrice: 45.99, savings: "Save $8/case" },
    { label: "64 Cases", qty: 64, unitPrice: 42.99, savings: "Save $11/case" },
  ],
  "FLM140180": [
    { label: "1 Case", qty: 1, unitPrice: 49.99 },
    { label: "32 Cases", qty: 32, unitPrice: 46.99, savings: "Save $3/case" },
    { label: "48 Cases", qty: 48, unitPrice: 42.99, savings: "Save $7/case" },
    { label: "64 Cases", qty: 64, unitPrice: 39.99, savings: "Save $10/case" },
  ],
  "5108": [
    { label: "1 Case", qty: 1, unitPrice: 53.99 },
    { label: "7 Cases", qty: 7, unitPrice: 50.99, savings: "Save $3/case" },
    { label: "21 Cases", qty: 21, unitPrice: 47.99, savings: "Save $6/case" },
    { label: "35 Cases", qty: 35, unitPrice: 44.99, savings: "Save $9/case" },
  ],
  "5505": [
    { label: "1 Case", qty: 1, unitPrice: 40.99 },
    { label: "15 Cases", qty: 15, unitPrice: 37.99, savings: "Save $3/case" },
    { label: "25 Cases", qty: 25, unitPrice: 34.99, savings: "Save $6/case" },
    { label: "50 Cases", qty: 50, unitPrice: 31.99, savings: "Save $9/case" },
  ],
  "GJO21100": [
    { label: "1 Case", qty: 1, unitPrice: 39.99 },
    { label: "24 Cases", qty: 24, unitPrice: 32.99, savings: "Save $7/case" },
    { label: "48 Cases", qty: 48, unitPrice: 30.99, savings: "Save $9/case" },
    { label: "60 Cases", qty: 60, unitPrice: 27.99, savings: "Save $12/case" },
  ],
};

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

  // Skip known duplicate/bad products
  const SKIP_SKUS = new Set(["10712", "143133", "143136", "1426410", "166778", "4385163EA", "1672", "9290", "315855", "83201"]);
  if (SKIP_SKUS.has(bc.sku)) return null as unknown as ProductData;

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
  // Disinfectants from any non-chemical category → Cleaning Chemicals
  if (subcategory === "Disinfectants" && finalCategory !== "Cleaning Chemicals") {
    finalCategory = "Cleaning Chemicals";
  }
  // Chemical subcategories from non-chemical categories → Cleaning Chemicals
  // BUT keep car-detailing products in car-detailing
  if ((subcategory === "Air Fresheners" || subcategory === "Urinal Screens" || subcategory === "Dish & Laundry") && finalCategory !== "Cleaning Chemicals" && siteCategory !== "car-detailing") {
    finalCategory = "Cleaning Chemicals";
  }
  // Equipment items from non-equipment categories → Equipment
  if ((subcategory === "Dispensers" || subcategory === "Rags & Wipers" || subcategory === "Vacuums") && finalCategory !== "Equipment") {
    finalCategory = "Equipment";
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
    rating: bc.reviews_count && bc.reviews_count > 0 && bc.reviews_rating_sum
      ? Math.round((bc.reviews_rating_sum / bc.reviews_count) * 10) / 10
      : 0,
    reviewCount: bc.reviews_count || 0,
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
    cardTitle: buildLinerTitle(bc.name, subcategory) || buildGloveTitle(bc.name, subcategory) || buildCupTitle(bc.name, subcategory) || cardTitle,
    pack,
    imageFit: "contain",
    quickBuy: CUSTOM_PRICING[bc.sku] || [
      { label: "1 Unit", qty: 1 },
      { label: "3 Units", qty: 3, savings: "Save 5%" },
      { label: "5 Units", qty: 5, savings: "Save 10%" },
      { label: "10 Units", qty: 10, savings: "Save 15%" },
    ],
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

function buildLinerTitle(name: string, subcategory: string): string | null {
  if (!subcategory.includes("Liner") && !subcategory.includes("Can")) return null;

  const n = name.toUpperCase();

  // Extract dimensions (e.g., "40 X 46")
  const dimMatch = n.match(/(\d+)\s*X\s*(\d+)/);
  const dim = dimMatch ? `${dimMatch[1]}x${dimMatch[2]}` : "";

  // Extract mil or micron
  const milMatch = n.match(/([\d.]+)\s*MIL\b/);
  const micMatch = n.match(/(\d+)\s*MICRON/);
  const thickness = milMatch ? `${milMatch[1]} Mil` : micMatch ? `${micMatch[1]} Mic` : "";

  // Extract gallon
  const galMatch = n.match(/(\d+(?:-\d+)?)\s*GALLON/);
  const gallon = galMatch ? `${galMatch[1]} Gal` : "";

  // Extract count
  const countMatch = n.match(/(\d+)\s*\/\s*(?:CS|CASE|BX|BOX)/i) || n.match(/(\d+)\s*(?:PER\s+)?(?:CS|CASE)/i);
  const count = countMatch ? `${countMatch[1]}/CS` : "";

  // Determine color label
  let color = "";
  if (n.includes("CLEAR")) color = "Clear";
  else if (n.includes("BLACK")) color = "Black";
  else if (n.includes("COMPOSTABLE")) color = "Compostable";
  else if (n.includes("DRAWSTRING")) color = "Drawstring";
  else if (n.includes("WHITE")) color = "White";

  if (!dim && !gallon) return null;

  // Build: "24x24 6 Mic 7-10 Gal" — short, one line
  const parts = [dim, thickness, gallon].filter(Boolean);
  return parts.join(" ");
}

function buildCupTitle(name: string, subcategory: string): string | null {
  if (subcategory !== "Cups & Lids") return null;
  const n = name;
  // Extract oz size
  const ozMatch = n.match(/([\d.\/]+)\s*[Oo]z/);
  const oz = ozMatch ? ozMatch[1] + " oz" : "";
  if (!oz) return null;

  // Determine cup type
  const lower = n.toLowerCase();
  let type = "Cup";
  if (lower.includes("hot cup") || lower.includes("paper hot")) type = "Paper Hot Cup";
  else if (lower.includes("cold cup") && lower.includes("translucent")) type = "Translucent Cold Cup";
  else if (lower.includes("cold cup") && lower.includes("clear")) type = "Clear Cold Cup";
  else if (lower.includes("cold cup") && lower.includes("squat")) type = "Squat Cold Cup";
  else if (lower.includes("double wall")) type = "Double Wall Paper Cup";
  else if (lower.includes("ripple")) type = "Ripple Hot Cup";
  else if (lower.includes("cone")) type = "Paper Cone Cup";
  else if (lower.includes("cold cup")) type = "Cold Cup";
  else if (lower.includes("paper cup")) type = "Paper Cup";

  return `${oz} ${type}`;
}

function buildGloveTitle(name: string, subcategory: string): string | null {
  const gloveTypes = ["Blue Nitrile", "Black Nitrile", "Orange Diamond Nitrile", "Black Diamond Nitrile", "Diamond Nitrile", "Nitrile Gloves", "Latex Gloves", "High Risk Latex", "Vinyl Gloves"];
  if (!gloveTypes.includes(subcategory)) return null;

  const n = name.toUpperCase();
  let size = "";
  if (/\bX-?\s*LARGE\b|\bXL\b/.test(n)) size = "XL";
  else if (/\bLARGE\b/.test(n) && !/X-?\s*LARGE/.test(n)) size = "Large";
  else if (/\bMEDIUM\b|\bMED\b/.test(n)) size = "Medium";
  else if (/\bSMALL\b/.test(n) && !/X-?\s*SMALL/.test(n)) size = "Small";

  if (subcategory.includes("Diamond")) {
    return `Diamond Textured 8 Mil${size ? " — " + size : ""}`;
  }
  if (subcategory === "Blue Nitrile") return `Blue Nitrile Exam Gloves${size ? " — " + size : ""}`;
  if (subcategory === "Black Nitrile") return `Black Nitrile Exam Gloves${size ? " — " + size : ""}`;
  if (subcategory === "Latex Gloves") return `Latex Powder Free Gloves${size ? " — " + size : ""}`;
  if (subcategory === "High Risk Latex") return `High Risk Latex 14 Mil${size ? " — " + size : ""}`;
  if (subcategory === "Vinyl Gloves") return `Vinyl Powder Free Gloves${size ? " — " + size : ""}`;
  return null;
}

function extractPack(name: string): string {
  // Normalize commas in numbers: "1,000" → "1000"
  const normalized = name.replace(/(\d),(\d)/g, "$1$2");
  const patterns = [
    /([\d,]+)\s*\/\s*(case|carton|ct|cs|bx|pk|box)/i,
    /([\d,]+)\s*(rolls?|sheets?|packs?|bags?|count|ct|pk|bx|per case)\b/i,
    /([\d,]+)\s*per\s+(case|carton|box)/i,
    /\b(gallon|each|pair)\b/i,
  ];
  for (const p of patterns) {
    const m = normalized.match(p);
    if (m) return m[0];
  }
  return "Each";
}

function extractBrand(name: string): string {
  const brands: Record<string, string> = {
    "JANITORS FINEST": "Janitors Finest",
    "BLUEFORCE": "Janitors Finest",
    "CHEMCOR": "Chemcor",
    "LIFEGUARD": "LifeGuard",
    "LIFE GUARD": "LifeGuard",
    "LATEX POWDER FREE": "LifeGuard",
    "VINYL POWDER FREE": "SunnyCare",
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
    "WRAP IT ALL": "Wrap It All",
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

  // ── Dispensers — MUST check before paper/tissue/glove to avoid false matches ──
  if (name.includes("tape dispenser") || name.includes("tape gun")) return "Tape Dispensers";
  if (name.includes("dispenser")) return "Dispensers";
  if (name.includes("receptacle") && !name.includes("waste")) return "Dispensers";

  // ── Paper Products — granular subcategories ──
  // Towels
  if (name.includes("center-pull") || name.includes("center pull") || name.includes("sofpull")) return "Center-Pull Towels";
  if (name.includes("kitchen roll") || name.includes("household paper towel") || name.includes("perforated") && name.includes("towel")) return "Kitchen Roll Towels";
  if (name.includes("singlefold") || name.includes("single-fold")) return "Singlefold Towels";
  if (name.includes("multifold") || name.includes("multi-fold") || name.includes("multi fold")) return "Multifold Towels";
  if (name.includes("c-fold") || name.includes("c fold")) return "C-Fold Towels";
  if (name.includes("jrt") || name.includes("jumbo") && name.includes("towel")) return "Jumbo Roll Towels";
  if (name.includes("hardwound") || name.includes("roll towel") || (name.includes("towel") && name.includes("roll")) || name.includes("tad") && name.includes("towel")) return "Hardwound Roll Towels";
  // Tissue
  if (name.includes("seat cover")) return "Seat Covers";
  if (name.includes("jumbo") && (name.includes("bath") || name.includes("tissue")) && !name.includes("towel")) return "Jumbo Toilet Tissue";
  if (name.includes("coreless") && name.includes("tissue")) return "Coreless Toilet Tissue";
  if (name.includes("mini jumbo")) return "Jumbo Toilet Tissue";
  if (name.includes("split core") || name.includes("spilt core")) return "Coreless Toilet Tissue";
  if (name.includes("bathroom tissue") || name.includes("bath tissue") || name.includes("toilet tissue") || name.includes("toilet paper")) return "Standard Toilet Tissue";
  if (name.includes("facial")) return "Facial Tissue";
  // Dispensers & misc
  if (name.includes("sanitary napkin") && name.includes("receptacle")) return "Restroom Dispensers";
  if (name.includes("napkin receptacle liner")) return "Restroom Dispensers";
  if (name.includes("tampon") || name.includes("feminine") || name.includes("hygiene product") || name.includes("sanitary napkin") || name.includes("maxithins")) return "Feminine Products";
  if (name.includes("copy paper") || name.includes("copier paper")) return "Copy Paper";
  if (name.includes("wiper") || name.includes("teri towel")) return "Wipers";

  // ── Gloves & Safety — context-aware ──
  // Gloves — granular by color/type for proper grouping
  if (name.includes("nitrile") && name.includes("diamond") && name.includes("orange")) return "Orange Diamond Nitrile";
  if (name.includes("nitrile") && name.includes("diamond") && name.includes("black")) return "Black Diamond Nitrile";
  if (name.includes("nitrile") && name.includes("diamond")) return "Diamond Nitrile";
  if (name.includes("nitrile") && name.includes("blue")) return "Blue Nitrile";
  if (name.includes("nitrile") && name.includes("black")) return "Black Nitrile";
  if (name.includes("nitrile")) return "Nitrile Gloves";
  if (name.includes("latex") && name.includes("high risk")) return "High Risk Latex";
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
  // Trash liners — granular by color
  if (name.includes("drawstring")) return "Drawstring Liners";
  if (name.includes("compostable")) return "Compostable Liners";
  if ((name.includes("liner") || name.includes("trash bag")) && name.includes("clear")) return "Clear Can Liners";
  if ((name.includes("liner") || name.includes("trash bag")) && name.includes("black")) return "Black Can Liners";
  if (name.includes("liner") || (name.includes("trash") && !name.includes("trash can"))) return "Can Liners";

  // ── Chemicals — order matters: specific before general ──
  if (name.includes("degreaser")) return "Degreasers";
  // Dish/oven/laundry BEFORE soap/sanitizer to avoid false matches
  if (name.includes("7th gen") || name.includes("seventh gen")) return "Dish & Laundry";
  if (name.includes("dish wash") || name.includes("dish soap") || name.includes("dishwash") || name.includes("dishmolive") || name.includes("dish detergent") || name.includes("pot/pan") || name.includes("pot &")) return "Dish & Laundry";
  if (name.includes("oven clean") || name.includes("oven &") || name.includes("grill clean")) return "Dish & Laundry";
  if (name.includes("laundry")) return "Dish & Laundry";
  // Sanitizing wipes → Disinfectants, not hand soap
  if (name.includes("sanitizing wipe") || name.includes("sanitizing multi") || name.includes("disinfecting wipe") || name.includes("disinfect")) return "Disinfectants";
  if (name.includes("urinal") || name.includes("bowl clip") || name.includes("eco air") || name.includes("freshprod") || (name.includes("dribble") && siteSlug === "cleaning-chemicals")) return "Urinal Screens";
  // Floor-friendly cleaners that contain "deodorizer" — must check BEFORE air fresheners
  if (name.includes("pine clean") || name.includes("pine disinfect") || (name.includes("pine") && name.includes("deodorizer"))) return "Floor & Carpet";
  if (name.includes("air freshener dispenser") || name.includes("metered") && name.includes("dispenser")) return "Dispensers";
  // Eco Air / FreshProd → Urinal Screens (before air freshener catch-all)
  if (name.includes("eco air") || name.includes("freshprod")) return "Urinal Screens";
  if (name.includes("metered spray") || name.includes("air freshener") || name.includes("freshener") || name.includes("odor") || name.includes("deodoriz")) return "Air Fresheners";
  if (name.includes("hand soap") || name.includes("hand sanitiz") || name.includes("hand lotion")) return "Hand Soap & Sanitizer";
  if (name.includes("lotion soap") || name.includes("foam soap") || name.includes("foam wash") || name.includes("body wash")) return "Hand Soap & Sanitizer";
  if (name.includes("soap") && !name.includes("dish") && siteSlug === "cleaning-chemicals") return "Hand Soap & Sanitizer";
  if (name.includes("sanitiz")) return "Hand Soap & Sanitizer";
  if (name.includes("wipe")) return "Disinfectants";
  if (name.includes("bleach")) return "Disinfectants";
  if (name.includes("glass clean")) return "Glass Cleaners";
  // Floor-friendly multi-purpose cleaners
  if (name.includes("lavender clean") || name.includes("fabuloso") || name.includes("neutral floor") || name.includes("neutral clean")) return "Floor & Carpet";
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
  if (name.includes("seal") && name.includes("urinal")) return "Urinal Screens";
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
  if (/\brag\b|\brags\b/.test(name) || name.includes("surgical towel") || name.includes("knit rag") || name.includes("teri towel")) return "Rags & Wipers";
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
  if (name.includes("food storage") || name.includes("freezer") && name.includes("bag") || name.includes("sandwich") && name.includes("bag") || name.includes("ziplock") || name.includes("resealable")) return "Food Storage";
  if (name.includes("battery") || name.includes("batteries") || name.includes("procell")) return "Batteries";
  if (name.includes("water") && (name.includes("bottle") || name.includes("spring") || name.includes("gallon"))) return "Beverages";
  if (name.includes("food storage") || name.includes("food bag")) return "Food Storage";
  if (name.includes("cup") || name.includes("lid")) return "Cups & Lids";
  if (name.includes("plate") || name.includes("bowl")) return "Plates & Bowls";
  if (name.includes("fork") || name.includes("spoon") || name.includes("knife") || name.includes("knives") || name.includes("cutlery") || name.includes("utensil")) return "Cutlery";
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
          const transformed = transformProduct(p);
          if (transformed) allFetched.push(transformed);
        }
      }
    }
  }

  // Filter out products that were reassigned to a different category
  const expectedCategoryName = SITE_CATEGORY_NAMES[siteSlug] || siteSlug;
  const filtered = allFetched.filter(p => p.category === expectedCategoryName);

  // Size ordering for products with sizes
  const SIZE_ORDER: Record<string, number> = {
    "small": 1, "s": 1,
    "medium": 2, "m": 2, "med": 2,
    "large": 3, "l": 3, "lg": 3,
    "x-large": 4, "xl": 4, "x large": 4, "xlarge": 4,
    "xx-large": 5, "xxl": 5, "2xl": 5, "2x": 5,
  };

  function getSizeOrder(name: string): number {
    const lower = name.toLowerCase();
    // Check from largest to smallest to avoid "large" matching before "x-large"
    if (/\bxx?-?large\b|\bx-?lg\b|\bxxl\b|\b2xl\b/.test(lower)) return 5;
    if (/\bx-?large\b|\bxl\b/.test(lower)) return 4;
    if (/\blarge\b|\blg\b/.test(lower) && !/x-?large/.test(lower)) return 3;
    if (/\bmedium\b|\bmed\b/.test(lower)) return 2;
    if (/\bsmall\b/.test(lower)) return 1;
    return 3; // default to middle
  }

  // Subcategory display order for paper products
  const PAPER_ORDER: Record<string, number> = {
    "Hardwound Roll Towels": 1,
    "Jumbo Roll Towels": 2,
    "Kitchen Roll Towels": 3,
    "Center-Pull Towels": 4,
    "Multifold Towels": 5,
    "Singlefold Towels": 6,
    "C-Fold Towels": 7,
    "Standard Toilet Tissue": 10,
    "Jumbo Toilet Tissue": 11,
    "Coreless Toilet Tissue": 12,
    "Facial Tissue": 15,
    "Seat Covers": 16,
    "Feminine Products": 20,
    "Restroom Dispensers": 21,
    "Wipers": 22,
    "Copy Paper": 25,
  };

  // Subcategory display order for breakroom
  const BREAKROOM_ORDER: Record<string, number> = {
    "Cups & Lids": 1,
    "Cutlery": 2,
    "Plates & Bowls": 3,
    "Napkins": 4,
    "Coffee & Supplies": 5,
    "Food Storage": 6,
    "Beverages": 7,
    "Batteries": 8,
    "General": 10,
  };

  // Subcategory display order for packaging
  const PACKAGING_ORDER: Record<string, number> = {
    "Stretch Film": 1,
    "Tape": 2,
    "Bubble Wrap": 3,
    "Cable Ties": 4,
    "Packing Peanuts": 5,
    "Steel Strapping": 6,
    "Labels": 7,
    "Tape Dispensers": 8,
    "General": 10,
  };

  // Subcategory display order for trash liners
  const LINER_ORDER: Record<string, number> = {
    "Clear Can Liners": 1,
    "Black Can Liners": 2,
    "Drawstring Liners": 3,
    "Compostable Liners": 4,
    "Can Liners": 5,
  };

  // Subcategory display order for gloves
  const GLOVE_ORDER: Record<string, number> = {
    "Blue Nitrile": 1,
    "Black Nitrile": 2,
    "Orange Diamond Nitrile": 3,
    "Black Diamond Nitrile": 4,
    "Diamond Nitrile": 5,
    "Nitrile Gloves": 6,
    "Latex Gloves": 7,
    "High Risk Latex": 8,
    "Vinyl Gloves": 9,
    "Face Masks": 10,
    "Hair Protection": 11,
    "Beard Covers": 12,
    "Shoe Covers": 13,
    "Aprons": 14,
    "Arm Sleeves": 15,
    "Dispensers": 16,
    "Back Support": 17,
  };

  // Sort: Janitors Finest first, then group by subcategory, then by size
  const machineSubs = new Set(["Vacuums", "Floor Machines", "Air Movers"]);
  filtered.sort((a, b) => {
    const aJF = a.brand.toLowerCase().includes("janitors finest") ? 1 : 0;
    const bJF = b.brand.toLowerCase().includes("janitors finest") ? 1 : 0;

    // For packaging: Wrap It All first
    if (siteSlug === "packaging-film" && a.subcategory === "Stretch Film" && b.subcategory === "Stretch Film") {
      const aWIA = a.brand.toLowerCase().includes("wrap it all") ? 1 : 0;
      const bWIA = b.brand.toLowerCase().includes("wrap it all") ? 1 : 0;
      if (aWIA !== bWIA) return bWIA - aWIA;
    }

    // For chemicals and paper: ALL JF products first
    if (siteSlug === "cleaning-chemicals" || siteSlug === "paper-products") {
      if (aJF !== bJF) return bJF - aJF;
      // Within JF paper: priority SKUs first
      if (siteSlug === "paper-products" && aJF && bJF) {
        const prioritySKUs = ["5602","5608","5603P","5604P","5200","5300","5108","5109"];
        const aIdx = prioritySKUs.indexOf(a.sku);
        const bIdx = prioritySKUs.indexOf(b.sku);
        const aPri = aIdx >= 0 ? aIdx : 99;
        const bPri = bIdx >= 0 ? bIdx : 99;
        if (aPri !== bPri) return aPri - bPri;
      }
      if (siteSlug === "cleaning-chemicals") {
        const aCC = a.brand.toLowerCase().includes("chemcor") ? 1 : 0;
        const bCC = b.brand.toLowerCase().includes("chemcor") ? 1 : 0;
        if (aCC !== bCC) return bCC - aCC;
      }
    }

    // For equipment: machines float to top
    if (siteSlug === "equipment") {
      const aMachine = machineSubs.has(a.subcategory) ? 1 : 0;
      const bMachine = machineSubs.has(b.subcategory) ? 1 : 0;
      if (aMachine !== bMachine) return bMachine - aMachine;
    }

    // Group by subcategory — keep product types together
    if (a.subcategory !== b.subcategory) {
      const orderMap = siteSlug === "gloves-safety" ? GLOVE_ORDER
        : siteSlug === "paper-products" ? PAPER_ORDER
        : siteSlug === "trash-liners" ? LINER_ORDER
        : siteSlug === "packaging-film" ? PACKAGING_ORDER
        : siteSlug === "breakroom" ? BREAKROOM_ORDER
        : null;
      const aOrder = orderMap?.[a.subcategory] ?? 50;
      const bOrder = orderMap?.[b.subcategory] ?? 50;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return a.subcategory.localeCompare(b.subcategory);
    }

    // Urinal Screens: custom order within subcategory
    if (a.subcategory === "Urinal Screens" && b.subcategory === "Urinal Screens") {
      const urinalOrder = (name: string): number => {
        const n = name.toLowerCase();
        if (n.includes("dribble") && !n.includes("non-para")) return 1;
        if (n.includes("non-para")) return 2;
        if (n.includes("wave") || n.includes("tidal")) return 3;
        if (n.includes("bowl clip")) return 5;
        if (n.includes("eco air") || n.includes("freshprod")) return 6;
        if (n.includes("mat")) return 7;
        if (n.includes("seal") || n.includes("1114")) return 8;
        return 4;
      };
      const diff = urinalOrder(a.name) - urinalOrder(b.name);
      if (diff !== 0) return diff;
    }

    // Within same subcategory: JF first, then by size, then popularity
    if (aJF !== bJF) return bJF - aJF;

    // Sort by volume for chemicals: gallon first, then quart/32oz, then 5-gal pails
    if (siteSlug === "cleaning-chemicals") {
      const getVolOrder = (name: string): number => {
        const n = name.toLowerCase();
        if (n.includes("gallon") || n.includes("gal") || n.includes("128 oz")) {
          // Check if it's a 5-gallon pail
          if (n.includes("5 gal") || n.includes("5-gal") || n.includes("pail")) return 3;
          return 1; // regular gallon
        }
        if (n.includes("quart") || n.includes("32 oz") || n.includes("qt")) return 2;
        if (n.includes("16 oz") || n.includes("pint")) return 2;
        if (n.includes("aerosol") || n.includes("spray")) return 4;
        return 2; // default middle
      };
      const aVol = getVolOrder(a.name);
      const bVol = getVolOrder(b.name);
      if (aVol !== bVol) return aVol - bVol;
    }

    // Sort by gallon size for trash liners
    const gallonRegex = /(\d+)\s*gallon/i;
    const aGal = a.name.match(gallonRegex);
    const bGal = b.name.match(gallonRegex);
    if (aGal && bGal) {
      const diff = parseInt(aGal[1]) - parseInt(bGal[1]);
      if (diff !== 0) return diff;
    }

    const aSize = getSizeOrder(a.name);
    const bSize = getSizeOrder(b.name);
    if (aSize !== bSize) return aSize - bSize;

    return b.reviewCount - a.reviewCount;
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
  const products = res.data.filter((p) => p.price > 0).map(transformProduct).filter(Boolean) as ProductData[];
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
        const transformed = transformProduct(p);
        if (transformed) allResults.push(transformed);
      }
    }
    if (page >= res.meta.pagination.total_pages) break;
    page++;
  }

  return allResults;
}

export { transformProduct };
