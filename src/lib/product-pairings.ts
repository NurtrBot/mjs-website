import type { ProductData } from "@/data/product-types";

/**
 * Smart Product Pairing — finds complementary products from local data.
 * Uses subcategory-to-subcategory mapping for accurate "You May Also Need" results.
 */

// What subcategories pair with what subcategories
const SUBCATEGORY_PAIRINGS: Record<string, string[]> = {
  // ── Mops & Mopping ──
  "Mop Buckets": ["Laundry mop heads", "Cotton mop heads", "Rayon mop heads", "Mop heads", "Floor cleaners", "Degreasers", "Microfiber flat mops", "Microfiber wet mopping system", "Dust mop refill heads"],
  "Laundry mop heads": ["Mop Buckets", "Floor cleaners", "Degreasers", "Dust mop handles", "Microfiber flat mops"],
  "Cotton mop heads": ["Mop Buckets", "Floor cleaners", "Degreasers", "Dust mop handles"],
  "Rayon mop heads": ["Mop Buckets", "Floor cleaners", "Degreasers", "Dust mop handles"],
  "Mop heads": ["Mop Buckets", "Floor cleaners", "Degreasers", "Dust mop handles"],
  "Microfiber flat mops": ["Mop Buckets", "Floor cleaners", "Microfiber flat mop system complete", "Microfiber wet mopping system"],
  "Microfiber wet mopping system": ["Floor cleaners", "Microfiber flat mops", "Degreasers"],
  "Dust mop refill heads": ["Dust mop handles", "Dust mop frames", "Sweeping compounds", "Floor cleaners"],
  "Dust mop handles": ["Dust mop refill heads", "Dust mop frames", "Sweeping compounds"],
  "Dust mop frames": ["Dust mop refill heads", "Dust mop handles", "Sweeping compounds"],

  // ── Floor Care ──
  "Floor cleaners": ["Mop Buckets", "Laundry mop heads", "Floor pads", "Microfiber flat mops", "Degreasers"],
  "Floor finish": ["Floor pads", "Floor stripper", "Floor machines", "Floor sealer", "Mop Buckets"],
  "Floor stripper": ["Floor finish", "Floor pads", "Floor machines", "Mop Buckets", "Degreasers"],
  "Floor sealer": ["Floor finish", "Floor pads", "Floor machines"],
  "Floor pads": ["Pad drivers", "Floor machines", "Floor finish", "Floor stripper"],
  "Pad drivers": ["Floor pads", "Floor machines", "Floor finish"],
  "Floor machines": ["Floor pads", "Pad drivers", "Floor finish", "Floor stripper", "Floor sealer"],
  "Scrubbers": ["Floor pads", "Floor cleaners", "Degreasers"],

  // ── Carpet ──
  "Carpet shampoo": ["Carpet extractors", "Carpet spotters", "Bonnet", "Upright vacuums"],
  "Carpet spotters": ["Carpet shampoo", "Carpet extractors", "Rags", "Trigger sprayers"],
  "Carpet extractors": ["Carpet shampoo", "Carpet spotters", "Bonnet"],
  "Bonnet": ["Carpet shampoo", "Floor machines", "Carpet spotters"],

  // ── Vacuums ──
  "Backpack vacuums": ["Backpack vacuum bags", "Upright vacuums"],
  "Upright vacuums": ["Backpack vacuums", "Carpet shampoo", "Carpet spotters"],
  "Backpack vacuum bags": ["Backpack vacuums"],
  "Wet and dry vacuums": ["Backpack vacuums", "Floor cleaners"],

  // ── Paper & Restroom ──
  "Toilet & bathroom": ["Toilet tissue dispensers", "Toilet seat covers", "Toilet seat cover dispensers", "Urinal screens", "Automatic air fresheners", "Hygene"],
  "Toilet Tissue": ["Toilet tissue dispensers", "Toilet seat covers", "Urinal screens", "Automatic air fresheners"],
  "Standard toilet tissue rolls": ["Toilet tissue dispensers", "Toilet seat covers", "Urinal screens"],
  "Coreless toilet tissue": ["Jumbo roll tissue dispensers", "Toilet seat covers", "Urinal screens"],
  "Jumbo rolls": ["Jumbo roll tissue dispensers", "Toilet seat covers", "Urinal screens", "Automatic air fresheners"],
  "Toilet seat covers": ["Toilet seat cover dispensers", "Toilet & bathroom", "Urinal screens"],
  "Roll towel": ["Roll towel dispensers", "Hand soaps", "Hand sanitizer"],
  "Roll Towels": ["Roll towel dispensers", "Hand soaps", "Hand sanitizer"],
  "Folded towels": ["Folded towel dispensers", "Hand soaps", "Hand sanitizer"],
  "Center pull towels": ["Hand soaps", "Hand sanitizer", "Roll towel dispensers"],
  "Facial tissue": ["Hand sanitizer", "Disinfecting wipes", "Toilet & bathroom"],
  "Feminine hygiene products": ["Feminine hygiene dispensers", "Hygene", "Toilet & bathroom"],

  // ── Dispensers ──
  "Toilet tissue dispensers": ["Toilet & bathroom", "Standard toilet tissue rolls", "Jumbo rolls"],
  "Jumbo roll tissue dispensers": ["Jumbo rolls", "Coreless toilet tissue"],
  "Toilet seat cover dispensers": ["Toilet seat covers", "Toilet & bathroom"],
  "Roll towel dispensers": ["Roll towel", "Hand soaps", "Hand sanitizer"],
  "Folded towel dispensers": ["Folded towels", "Hand soaps", "Hand sanitizer"],
  "Hand soap dispensers": ["Hand soaps", "Hand sanitizer", "Roll towel", "Folded towels"],
  "Manual foam soap dispensers": ["Hand soaps", "Roll towel", "Folded towels"],
  "Automatic liquid soap dispensers": ["Hand soaps", "Roll towel", "Folded towels"],
  "Automatic foam soap dispensers": ["Hand soaps", "Roll towel", "Folded towels"],
  "Feminine hygiene dispensers": ["Feminine hygiene products", "Hygene"],

  // ── Chemicals ──
  "Degreasers": ["Trigger sprayers", "Spray bottle", "Gloves", "Rags", "Mop Buckets", "Smart rags microfiber towels"],
  "Disinfectants": ["Trigger sprayers", "Gloves", "Rags", "Disinfecting wipes", "Smart rags microfiber towels"],
  "Disinfecting wipes": ["Disinfectants", "Gloves", "Hand sanitizer"],
  "All purpose cleaners": ["Trigger sprayers", "Rags", "Smart rags microfiber towels", "Gloves", "Mop Buckets"],
  "Glass cleaner": ["Complete squeeges", "Squeege refills", "Smart rags microfiber towels", "Trigger sprayers"],
  "Hand soaps": ["Hand soap dispensers", "Roll towel", "Hand sanitizer", "Folded towels"],
  "Hand sanitizer": ["Hand soaps", "Hand soap dispensers", "Disinfecting wipes"],
  "Drain cleaners & maintainers": ["Gloves", "Toilet bowl brushes"],
  "Janitors finest chemicals": ["Trigger sprayers", "Spray bottle", "Mop Buckets", "Rags"],
  "Aerosols": ["Trigger sprayers", "Rags"],
  "Odor control": ["Urinal screens", "Automatic air fresheners", "Bowl clips", "Disinfectants"],
  "Automatic air fresheners": ["Urinal screens", "Bowl clips", "Odor control", "Bulk batteries"],
  "Bulk air freshener": ["Urinal screens", "Automatic air fresheners", "Bowl clips"],
  "Urinal screens": ["Automatic air fresheners", "Bowl clips", "Toilet & bathroom", "Disinfectants"],
  "Bowl clips": ["Urinal screens", "Automatic air fresheners", "Toilet & bathroom"],

  // ── Trash ──
  "Low density": ["Warehouse and trash collection", "Special event trash cans", "Gloves", "Degreasers"],
  "High density": ["Warehouse and trash collection", "Special event trash cans", "Gloves", "All purpose cleaners"],
  "Drawstring bags": ["Warehouse and trash collection", "Special event trash cans"],
  "Warehouse and trash collection": ["Low density", "High density", "Gloves"],
  "Special event trash cans": ["Low density", "High density", "Special event trash can lids"],

  // ── Gloves ──
  "Blue nitrile gloves": ["Hand soaps", "Hand sanitizer", "Acrylic glove dispenser", "Rags"],
  "Black nitrile gloves": ["Hand soaps", "Hand sanitizer", "Acrylic glove dispenser", "Degreasers"],
  "Nitrile Gloves": ["Hand soaps", "Hand sanitizer", "Acrylic glove dispenser"],
  "Latex gloves": ["Hand soaps", "Hand sanitizer", "Acrylic glove dispenser"],
  "Vinyl gloves": ["Hand soaps", "Hand sanitizer", "Acrylic glove dispenser"],
  "Acrylic glove dispenser": ["Blue nitrile gloves", "Black nitrile gloves", "Latex gloves", "Vinyl gloves"],

  // ── Safety ──
  "Bouffant caps": ["Gloves", "Face masks", "Poly aprons", "Shoe covers"],
  "Face masks": ["Gloves", "Bouffant caps", "Poly aprons", "Shoe covers"],
  "Face protection": ["Gloves", "Face masks", "Bouffant caps"],
  "Poly aprons": ["Gloves", "Bouffant caps", "Face masks"],
  "Shoe covers": ["Gloves", "Bouffant caps", "Face masks"],
  "Poly sleeves": ["Gloves", "Poly aprons", "Bouffant caps"],

  // ── Brooms & Dusting ──
  "Brooms": ["Dust pans", "Dust mop refill heads", "Dust mop handles"],
  "Dust pans": ["Brooms", "Dust mop refill heads"],
  "Ostrich feather dusters": ["Extendable dusters", "Microfiber dusters", "Lambswool dusters"],
  "Extendable dusters": ["Ostrich feather dusters", "Microfiber dusters", "Lambswool dusters", "Extension poles"],
  "Microfiber dusters": ["Ostrich feather dusters", "Extendable dusters", "Lambswool dusters"],
  "Lambswool dusters": ["Ostrich feather dusters", "Extendable dusters", "Microfiber dusters"],

  // ── Window Cleaning ──
  "Complete squeeges": ["Squeege refills", "Squeege handles", "Glass cleaner", "Window buckets", "Extension poles"],
  "Squeege refills": ["Complete squeeges", "Squeege handles", "Glass cleaner"],
  "Squeege handles": ["Complete squeeges", "Squeege refills", "Extension poles"],
  "Window buckets": ["Complete squeeges", "Glass cleaner", "Smart rags microfiber towels"],
  "Extension poles": ["Complete squeeges", "Squeege handles", "High reach dusters"],
  "Channel replacements with rubber": ["Complete squeeges", "Squeege handles"],
  "Golden glove washers complete": ["Complete squeeges", "Glass cleaner", "Window buckets"],
  "Super channels": ["Complete squeeges", "Squeege refills"],
  "Scrapers": ["Glass cleaner", "Replacement blades", "Complete squeeges"],
  "Replacement blades": ["Scrapers", "Floor scrapers"],

  // ── Packaging ──
  "Hand film": ["Hand held tape", "Tape gun dispensers", "Bundling film"],
  "Clear stretch film": ["Hand film", "Tape gun dispensers", "Hand held tape"],
  "Bundling film": ["Hand film", "Clear stretch film"],
  "Hand held tape": ["Tape gun dispensers", "Hand film"],
  "Tape gun dispensers": ["Hand held tape", "Hand film"],
  "Packing slip envelopes": ["Hand held tape", "Hand film", "Tape gun dispensers"],
  "Styrofoam packing peanuts": ["Bubble wrap", "Hand held tape"],
  "Bubble wrap": ["Hand held tape", "Styrofoam packing peanuts", "Tape gun dispensers"],

  // ── Breakroom ──
  "Plastic cups": ["Paper cups", "Cups", "Napkins", "Utensils medium weight"],
  "Paper cups": ["Plastic cups", "Napkins", "Utensils medium weight"],
  "Napkins": ["Cups", "Plastic cups", "Utensils medium weight", "Plates"],
  "Plates": ["Utensils medium weight", "Utensils heavy weight", "Napkins", "Cups"],
  "Bowls": ["Utensils medium weight", "Napkins", "Cups"],
  "Utensils medium weight": ["Plates", "Napkins", "Cups", "Food storage bags"],
  "Utensils heavy weight": ["Plates", "Napkins", "Cups", "Food storage bags"],
  "Food storage bags": ["Utensils medium weight", "Plates", "Cups"],

  // ── Car Detailing ──
  "Wonder wafers auto detail air fresheners": ["Polishes", "Car wash"],
  "Polishes": ["Smart rags microfiber towels", "Trigger sprayers"],
  "Stone pro products": ["Floor pads", "Floor machines", "Floor sealer"],

  // ── Sprayers & Rags ──
  "Trigger sprayers": ["Plastic bottles", "Sprayers & bottles", "Rags", "Smart rags microfiber towels"],
  "Pump sprayers": ["Degreasers", "All purpose cleaners", "Disinfectants"],
  "Rags": ["Smart rags microfiber towels", "Trigger sprayers", "All purpose cleaners"],
  "Smart rags microfiber towels": ["Trigger sprayers", "All purpose cleaners", "Glass cleaner", "Rags"],
  "Microfiber towels": ["Trigger sprayers", "All purpose cleaners", "Glass cleaner"],
};

// Category-level fallback
const CATEGORY_FALLBACKS: Record<string, string[]> = {
  "Paper & Restroom": ["Hand soaps", "Hand sanitizer", "Toilet & bathroom", "Urinal screens", "Automatic air fresheners"],
  "Cleaning Chemicals": ["Trigger sprayers", "Smart rags microfiber towels", "Gloves", "Mop Buckets", "Rags"],
  "Trash Liners": ["Warehouse and trash collection", "Gloves", "All purpose cleaners", "Degreasers"],
  "Gloves & Safety": ["Hand soaps", "Hand sanitizer", "Rags", "Disinfectants"],
  "Equipment": ["Floor cleaners", "Gloves", "Rags", "All purpose cleaners", "Trigger sprayers"],
  "Equipment & Tools": ["Floor cleaners", "Gloves", "Rags", "All purpose cleaners", "Trigger sprayers"],
  "Packaging & Shipping": ["Hand held tape", "Hand film", "Bubble wrap", "Tape gun dispensers"],
  "Breakroom": ["Napkins", "Cups", "Utensils medium weight", "Plates", "Food storage bags"],
  "Floor Care": ["Floor cleaners", "Mop Buckets", "Floor pads", "Degreasers", "Dust mop refill heads"],
  "Car Detailing": ["Smart rags microfiber towels", "Trigger sprayers", "Glass cleaner", "Degreasers"],
};

/**
 * Find complementary products from local data
 */
export function getSmartPairings(
  currentProduct: ProductData,
  allProducts: ProductData[],
  limit = 6
): ProductData[] {
  const sub = currentProduct.subcategory || "";
  const cat = currentProduct.category || "";
  const currentSku = currentProduct.sku.toUpperCase();

  // Get target subcategories to match against
  const targetSubs = SUBCATEGORY_PAIRINGS[sub] || CATEGORY_FALLBACKS[cat] || [];

  if (targetSubs.length === 0) {
    // Fallback: return products from same category but different subcategory
    return allProducts
      .filter(p => p.sku.toUpperCase() !== currentSku && p.category === cat && p.subcategory !== sub && p.images[0]?.startsWith("http"))
      .slice(0, limit);
  }

  // Score each product based on how well it matches the pairing targets
  const scored: { product: ProductData; score: number }[] = [];

  for (const p of allProducts) {
    if (p.sku.toUpperCase() === currentSku) continue;
    if (!p.images[0]?.startsWith("http")) continue;

    const pSub = p.subcategory || "";
    const pName = p.name.toLowerCase();

    let score = 0;

    // Exact subcategory match — highest priority
    for (let i = 0; i < targetSubs.length; i++) {
      const target = targetSubs[i].toLowerCase();
      if (pSub.toLowerCase() === target) {
        score += 100 - i * 5; // Earlier in the list = higher priority
        break;
      }
      // Partial subcategory match
      if (pSub.toLowerCase().includes(target) || target.includes(pSub.toLowerCase())) {
        score += 60 - i * 5;
        break;
      }
      // Name contains the target keyword
      if (pName.includes(target)) {
        score += 40 - i * 5;
      }
    }

    // Boost in-stock products
    if (p.inStock) score += 10;

    // Boost products with reviews
    if (p.reviewCount > 0) score += 5;

    if (score > 0) {
      scored.push({ product: p, score });
    }
  }

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // Diversify — don't show more than 2 from the same subcategory
  const result: ProductData[] = [];
  const subCounts = new Map<string, number>();

  for (const { product } of scored) {
    if (result.length >= limit) break;
    const pSub = product.subcategory || "other";
    const count = subCounts.get(pSub) || 0;
    if (count >= 2) continue;
    result.push(product);
    subCounts.set(pSub, count + 1);
  }

  return result;
}
