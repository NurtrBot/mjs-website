import { NextRequest, NextResponse } from "next/server";
import { searchProducts } from "@/lib/products-api";

/*
  Smart Product Pairing — returns complementary products based on what the customer is viewing.

  Logic:
  1. Identify the product's category and subcategory
  2. Look up curated pairing rules (what goes WITH this type of product)
  3. Fetch matching products from BC
  4. Score and deduplicate
  5. Return top 6 diverse recommendations
*/

// Pairing rules: subcategory/category → what to search for
const PAIRING_RULES: Record<string, string[]> = {
  // ── Paper Products ──
  "Toilet Tissue": ["toilet paper dispenser", "seat covers", "air freshener", "bathroom cleaner", "urinal screen"],
  "Roll Towels": ["towel dispenser", "hand soap", "sanitizer dispenser", "paper towel holder"],
  "Folded Towels": ["towel dispenser", "hand soap", "sanitizer", "waste basket"],
  "Center-Pull Towels": ["center pull dispenser", "hand soap", "sanitizer"],
  "Facial Tissue": ["tissue dispenser", "hand sanitizer", "disinfecting wipes"],
  "Seat Covers": ["seat cover dispenser", "toilet tissue", "bathroom cleaner", "urinal screen"],
  "Kitchen Towels": ["all purpose cleaner", "degreaser", "trash liner", "dish soap"],

  // ── Cleaning Chemicals ──
  "All Purpose Cleaners": ["microfiber cloth", "spray bottle", "mop", "bucket", "gloves"],
  "Disinfectants": ["spray bottle", "gloves", "microfiber cloth", "paper towel", "wipes"],
  "Floor Care": ["mop", "mop bucket", "floor pad", "wet floor sign", "dust mop"],
  "Floor Finishes": ["floor pad", "floor machine", "mop", "floor stripper", "applicator"],
  "Carpet Care": ["carpet extractor", "spot remover", "vacuum", "carpet bonnet"],
  "Glass Cleaners": ["microfiber cloth", "squeegee", "spray bottle", "paper towel"],
  "Degreasers": ["spray bottle", "gloves", "scrub brush", "microfiber cloth", "mop"],
  "Hand Soap & Sanitizer": ["soap dispenser", "paper towel", "towel dispenser", "trash liner"],
  "Dish & Laundry": ["gloves", "sponge", "scrub brush", "paper towel"],
  "Air Fresheners": ["urinal screen", "bathroom cleaner", "trash liner", "toilet tissue"],
  "Urinal Screens": ["bathroom cleaner", "air freshener", "toilet tissue", "gloves"],
  "Specialty Cleaners": ["spray bottle", "microfiber cloth", "gloves", "scrub brush"],

  // ── Trash Liners ──
  "Can Liners": ["waste basket", "trash can", "gloves", "all purpose cleaner", "degreaser"],
  "Clear Can Liners": ["waste basket", "gloves", "all purpose cleaner", "recycling bin"],
  "Black Can Liners": ["waste basket", "gloves", "degreaser", "trash can"],
  "Trash Liners": ["waste basket", "gloves", "all purpose cleaner", "degreaser"],

  // ── Gloves ──
  "Nitrile Gloves": ["hand soap", "sanitizer", "trash liner", "disinfectant", "paper towel"],
  "Latex Gloves": ["hand soap", "sanitizer", "trash liner", "disinfectant"],
  "Vinyl Gloves": ["hand soap", "sanitizer", "trash liner", "cleaning wipes"],
  "Diamond Grip Gloves": ["degreaser", "trash liner", "paper towel", "all purpose cleaner"],

  // ── Equipment ──
  "Mops": ["mop bucket", "mop handle", "floor cleaner", "wet floor sign", "dust mop"],
  "Mop Buckets": ["mop", "mop handle", "floor cleaner", "wet floor sign", "gloves"],
  "Dispensers": ["paper towel", "toilet tissue", "hand soap", "seat covers", "trash liner"],
  "Vacuums": ["vacuum bags", "carpet cleaner", "dust mop", "broom"],
  "Brooms & Brushes": ["dust pan", "mop", "trash liner", "broom handle"],
  "Floor Machines": ["floor pad", "floor finish", "floor stripper", "mop bucket", "wet floor sign"],
  "Rags & Wipers": ["all purpose cleaner", "degreaser", "spray bottle", "gloves"],
  "Batteries": ["towel dispenser", "soap dispenser", "sanitizer dispenser"],
  "Microfiber": ["spray bottle", "all purpose cleaner", "glass cleaner", "bucket"],
  "Window Cleaning": ["squeegee", "glass cleaner", "microfiber cloth", "bucket", "extension pole"],

  // ── Packaging ──
  "Stretch Film": ["tape", "tape dispenser", "labels", "box cutter", "pallet wrap"],
  "Tape": ["tape dispenser", "stretch film", "box cutter", "labels", "bubble wrap"],
  "Tape Dispensers": ["tape", "stretch film", "labels", "box cutter"],
  "Bubble Wrap": ["tape", "packing peanuts", "stretch film", "boxes"],

  // ── Breakroom ──
  "Cups & Lids": ["coffee", "stir sticks", "napkins", "sugar", "creamer"],
  "Cutlery": ["plates", "napkins", "cups", "food container"],
  "Plates & Bowls": ["cutlery", "napkins", "cups", "food container"],
  "Napkins": ["cups", "plates", "cutlery", "paper towel"],
  "Food Containers": ["cutlery", "napkins", "trash liner", "gloves"],

  // ── Floor Care ──
  "Floor Pads": ["floor machine", "floor finish", "floor stripper", "mop bucket", "dust mop"],
  "Pad Drivers": ["floor pad", "floor machine", "floor finish"],

  // ── Car Detailing ──
  "Car Wash": ["microfiber towel", "tire shine", "glass cleaner", "spray bottle", "degreaser"],
};

// Category-level fallbacks when subcategory isn't matched
const CATEGORY_FALLBACKS: Record<string, string[]> = {
  "Paper Products": ["dispenser", "hand soap", "trash liner", "air freshener", "sanitizer"],
  "Cleaning Chemicals": ["spray bottle", "microfiber", "gloves", "mop", "bucket"],
  "Trash Liners & Bags": ["gloves", "all purpose cleaner", "degreaser", "waste basket"],
  "Gloves & Safety": ["hand soap", "sanitizer", "trash liner", "paper towel", "disinfectant"],
  "Equipment": ["floor cleaner", "trash liner", "gloves", "paper towel", "all purpose cleaner"],
  "Packaging & Film": ["tape", "stretch film", "bubble wrap", "labels", "box cutter"],
  "Breakroom": ["cups", "napkins", "cutlery", "plates", "trash liner"],
  "Floor Care": ["floor cleaner", "mop", "mop bucket", "floor pad", "dust mop"],
  "Car Detailing": ["microfiber", "spray bottle", "glass cleaner", "degreaser", "tire shine"],
};

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category") || "";
  const subcategory = req.nextUrl.searchParams.get("subcategory") || "";
  const currentSku = req.nextUrl.searchParams.get("sku") || "";

  try {
    // Get pairing keywords
    const pairings = PAIRING_RULES[subcategory] || CATEGORY_FALLBACKS[category] || ["cleaning supplies"];

    // Search for each pairing keyword in parallel (limit to 4 searches for speed)
    const searches = pairings.slice(0, 4);
    const results = await Promise.all(
      searches.map(keyword => searchProducts(keyword, 8).catch(() => []))
    );

    // Deduplicate and filter out the current product
    const seen = new Set<string>();
    seen.add(currentSku.toUpperCase());
    const candidates: (typeof results[0][0])[] = [];

    for (const batch of results) {
      for (const p of batch) {
        const key = p.sku.toUpperCase();
        if (seen.has(key)) continue;
        if (!p.images?.[0] || p.images[0].includes("placeholder")) continue;
        seen.add(key);
        candidates.push(p);
      }
    }

    // Diversify — pick at most 2 from each search to ensure variety
    const diverse: (typeof candidates[0])[] = [];
    const usedPerSearch = new Map<number, number>();

    for (let round = 0; round < 3 && diverse.length < 6; round++) {
      for (let s = 0; s < results.length && diverse.length < 6; s++) {
        const count = usedPerSearch.get(s) || 0;
        if (count > round) continue;

        const batch = results[s].filter(p => {
          const key = p.sku.toUpperCase();
          return !diverse.some(d => d.sku.toUpperCase() === key) &&
                 key !== currentSku.toUpperCase() &&
                 p.images?.[0] && !p.images[0].includes("placeholder");
        });

        if (batch[count]) {
          diverse.push(batch[count]);
          usedPerSearch.set(s, count + 1);
        }
      }
    }

    return NextResponse.json({ products: diverse.slice(0, 6) });
  } catch {
    return NextResponse.json({ products: [] });
  }
}
