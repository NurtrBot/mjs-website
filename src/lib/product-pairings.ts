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

/**
 * FBT Pairings — curated "Frequently Bought Together" logic.
 *
 * Priority order for each product type:
 *   1. Its matching dispenser or key companion (highest priority)
 *   2. A "staple" product (e.g., 5602 toilet tissue for all paper products)
 *   3. A complementary product from a different category
 *
 * Rules:
 *   - Max 1 product per subcategory (no red mop + blue mop)
 *   - No items from the same subcategory as the current product
 *   - Penalize items with too many shared name words (prevents size/color variants)
 */

// SKU-level FBT overrides — manually curated pairings for specific products
// These take priority over subcategory-based pairing logic
const FBT_SKU_OVERRIDES: Record<string, string[]> = {
  "8036":  ["3162EA", "1015F", "8997LG5BLU"],   // Mop Bucket → Cleaner + Mop Handle + Loop Mop Blue
  "8028":  ["3162EA", "1015F", "8011724"],       // Mop Bucket 26qt → Cleaner + Handle + Cotton Mop
  "8019":  ["3162EA", "1015F", "8011724"],       // Mop Bucket 19qt → same
  "3158EA": ["8036", "8997LG5BLU", "1015F"],     // Lemon Floor Cleaner → Mop Bucket + Loop Mop + Handle
  "3162EA": ["8036", "8997LG5GRN", "1015F"],     // Lavender Cleaner → Mop Bucket + Loop Mop Green + Handle
};

// SKUs to always try to include for specific categories
const FBT_STAPLE_SKUS: Record<string, string[]> = {
  "Paper & Restroom": ["5602"],       // 2-Ply Toilet Tissue always pairs with paper
  "Cleaning Chemicals": ["SPRBOT3PK"], // Spray bottles pair with chemicals
  "Trash Liners": ["CL404814"],       // 40-45 gal liner is a staple
  "Floor Care": ["3158EA"],           // Lemon neutral floor cleaner
};

// FBT-specific subcategory pairings — first item in list = highest priority (the dispenser/companion)
const FBT_PAIRINGS: Record<string, string[]> = {
  // ── Paper: every paper product → its dispenser FIRST, then toilet tissue, then soap ──
  "Hardwound Roll Towels": ["Roll towel dispensers", "Standard toilet tissue rolls", "Hand soaps"],
  "Roll towel": ["Roll towel dispensers", "Standard toilet tissue rolls", "Hand soaps"],
  "Roll Towels": ["Roll towel dispensers", "Standard toilet tissue rolls", "Hand soaps"],
  "Towels": ["Roll towel dispensers", "Standard toilet tissue rolls", "Hand soaps"],
  "Multifolds": ["Folded towel dispensers", "Standard toilet tissue rolls", "Hand soaps"],
  "Folded towels": ["Folded towel dispensers", "Standard toilet tissue rolls", "Hand soaps"],
  "Center pull towels": ["Roll towel dispensers", "Standard toilet tissue rolls", "Hand soaps"],
  "Standard toilet tissue rolls": ["Toilet tissue dispensers", "Folded towels", "Hand soaps"],
  "Toilet Tissue": ["Toilet tissue dispensers", "Folded towels", "Hand soaps"],
  "Jumbo rolls": ["Jumbo roll tissue dispensers", "Folded towels", "Hand soaps"],
  "Coreless toilet tissue": ["Jumbo roll tissue dispensers", "Folded towels", "Hand soaps"],
  "Facial Tissue": ["Roll towel dispensers", "Standard toilet tissue rolls", "Hand sanitizer"],
  "Facial tissue": ["Roll towel dispensers", "Standard toilet tissue rolls", "Hand sanitizer"],
  "Restroom Supplies": ["Toilet tissue dispensers", "Standard toilet tissue rolls", "Hand soaps"],
  "Bowl clips": ["Urinal screens", "Toilet & bathroom", "Standard toilet tissue rolls"],
  "Urinal and toilet mats": ["Urinal screens", "Toilet & bathroom", "Bowl clips"],

  // ── Paper dispensers → the paper they hold, then soap, then toilet tissue ──
  "Roll towel dispensers": ["Roll towel", "Hand soaps", "Standard toilet tissue rolls"],
  "Folded towel dispensers": ["Folded towels", "Hand soaps", "Standard toilet tissue rolls"],
  "Toilet tissue dispensers": ["Standard toilet tissue rolls", "Folded towels", "Hand soaps"],
  "Jumbo roll tissue dispensers": ["Jumbo rolls", "Hand soaps", "Folded towels"],
  "Toilet seat cover dispensers": ["Restroom Supplies", "Standard toilet tissue rolls", "Urinal screens"],

  // ── Chemicals: spray bottle/trigger → gloves → mop bucket ──
  "Degreasers": ["Trigger sprayers", "Blue nitrile gloves", "Mop Buckets"],
  "Disinfectants": ["Trigger sprayers", "Blue nitrile gloves", "Smart rags microfiber towels"],
  "All-Purpose Cleaners": ["Trigger sprayers", "Smart rags microfiber towels", "Mop Buckets"],
  "All purpose cleaners": ["Trigger sprayers", "Smart rags microfiber towels", "Mop Buckets"],
  "Glass cleaner": ["Smart rags microfiber towels", "Complete squeeges", "Trigger sprayers"],
  "Hand soaps": ["Hand soap dispensers", "Roll towel", "Hand sanitizer"],
  "Hand sanitizer": ["Hand soaps", "Roll towel", "Blue nitrile gloves"],
  "Janitors finest chemicals": ["Trigger sprayers", "Mop Buckets", "Blue nitrile gloves"],
  "Toilet & bathroom": ["Toilet tissue dispensers", "Standard toilet tissue rolls", "Blue nitrile gloves"],
  "Kitchen & laundry": ["Blue nitrile gloves", "Trigger sprayers", "Smart rags microfiber towels"],
  "Odor control": ["Urinal screens", "Bowl clips", "Disinfectants"],
  "Air Fresheners": ["Urinal screens", "Bowl clips", "Disinfectants"],
  "Drain cleaners & maintainers": ["Blue nitrile gloves", "Trigger sprayers", "Toilet bowl brushes"],

  // ── Trash Liners: trash cans → gloves → cleaner ──
  "Hi-Density Liners": ["Warehouse and trash collection", "Blue nitrile gloves", "All purpose cleaners"],
  "Clear Can Liners": ["Warehouse and trash collection", "Blue nitrile gloves", "All purpose cleaners"],
  "Black Can Liners": ["Warehouse and trash collection", "Blue nitrile gloves", "Degreasers"],
  "High density": ["Warehouse and trash collection", "Blue nitrile gloves", "All purpose cleaners"],
  "Low density": ["Warehouse and trash collection", "Blue nitrile gloves", "Degreasers"],
  "Drawstring bags": ["Warehouse and trash collection", "Blue nitrile gloves", "All purpose cleaners"],
  "Compostable": ["Warehouse and trash collection", "Blue nitrile gloves", "All purpose cleaners"],

  // ── Gloves: dispenser → soap → disinfectant ──
  "Blue nitrile gloves": ["Acrylic glove dispenser", "Hand soaps", "Disinfectants"],
  "Black nitrile gloves": ["Acrylic glove dispenser", "Hand soaps", "Degreasers"],
  "Nitrile Gloves": ["Acrylic glove dispenser", "Hand soaps", "Disinfectants"],
  "Latex gloves": ["Acrylic glove dispenser", "Hand soaps", "Disinfectants"],
  "Vinyl gloves": ["Acrylic glove dispenser", "Hand soaps", "Disinfectants"],
  "Acrylic glove dispenser": ["Blue nitrile gloves", "Hand soaps", "Disinfectants"],

  // ── Equipment: mops → bucket → cleaner ──
  "Mop Buckets": ["Laundry mop heads", "Floor cleaners", "Blue nitrile gloves"],
  "Mop buckets": ["Laundry mop heads", "Floor cleaners", "Blue nitrile gloves"],
  "Cotton mop heads": ["Mop Buckets", "Floor cleaners", "Dust mop refill heads"],
  "Rayon mop heads": ["Mop Buckets", "Floor cleaners", "Dust mop refill heads"],
  "Laundry mop heads": ["Mop Buckets", "Floor cleaners", "Dust mop refill heads"],
  "Mop heads": ["Mop Buckets", "Floor cleaners", "Dust mop refill heads"],
  "Microfiber flat mops": ["Mop Buckets", "Floor cleaners", "Microfiber wet mopping system"],
  "Microfiber wet mopping system": ["Floor cleaners", "Mop Buckets", "Blue nitrile gloves"],
  "Dust mop refill heads": ["Dust mop handles", "Dust mop frames", "Floor cleaners"],
  "Dust mop handles": ["Dust mop refill heads", "Dust mop frames", "Floor cleaners"],
  "Dust mop frames": ["Dust mop refill heads", "Dust mop handles", "Floor cleaners"],
  "Trigger sprayers": ["Plastic bottles", "Degreasers", "All purpose cleaners"],
  "Brooms": ["Dust pans", "Dust mop refill heads", "Floor cleaners"],
  "Dust pans": ["Brooms", "Dust mop refill heads", "Floor cleaners"],

  // ── Floor Care ──
  "Floor pads": ["Pad drivers", "Floor machines", "Floor finish"],
  "Floor finish": ["Floor pads", "Floor stripper", "Mop Buckets"],
  "Floor stripper": ["Floor pads", "Floor finish", "Mop Buckets"],
  "Floor sealer": ["Floor finish", "Floor pads", "Mop Buckets"],
  "Floor cleaners": ["Mop Buckets", "Laundry mop heads", "Dust mop refill heads"],
  "Floor machines": ["Floor pads", "Pad drivers", "Floor finish"],
  "Pad drivers": ["Floor pads", "Floor machines", "Floor finish"],

  // ── Breakroom ──
  "Cups": ["Napkins", "Utensils medium weight", "Plates"],
  "Paper cups": ["Napkins", "Utensils medium weight", "Plates"],
  "Plastic cups": ["Napkins", "Utensils medium weight", "Plates"],
  "Plates": ["Utensils medium weight", "Napkins", "Cups"],
  "Bowls": ["Utensils medium weight", "Napkins", "Cups"],
  "Napkins": ["Cups", "Utensils medium weight", "Plates"],
  "Utensils medium weight": ["Plates", "Napkins", "Cups"],
  "Utensils heavy weight": ["Plates", "Napkins", "Cups"],
  "Food storage bags": ["Utensils medium weight", "Plates", "Cups"],

  // ── Packaging ──
  "Stretch Film": ["Hand held tape", "Tape gun dispensers", "Bubble wrap"],
  "Hand film": ["Hand held tape", "Tape gun dispensers", "Bubble wrap"],
  "Clear stretch film": ["Hand held tape", "Tape gun dispensers", "Bubble wrap"],
  "Bundling film": ["Hand film", "Hand held tape", "Tape gun dispensers"],
  "Hand held tape": ["Tape gun dispensers", "Hand film", "Bubble wrap"],
  "Tape gun dispensers": ["Hand held tape", "Hand film", "Bubble wrap"],
  "Bubble wrap": ["Hand held tape", "Styrofoam packing peanuts", "Tape gun dispensers"],
  "Styrofoam packing peanuts": ["Bubble wrap", "Hand held tape", "Tape gun dispensers"],

  // ── Car Detailing ──
  "Wonder wafers auto detail air fresheners": ["Smart rags microfiber towels", "Trigger sprayers", "Blue nitrile gloves"],
  "Special event trash cans": ["Special event trash can lids", "Hi-Density Liners", "Blue nitrile gloves"],
  "Special event trash can lids": ["Special event trash cans", "Hi-Density Liners", "Blue nitrile gloves"],
};

export function getFbtPairings(
  currentProduct: ProductData,
  allProducts: ProductData[],
  limit = 3
): ProductData[] {
  const sub = currentProduct.subcategory || "";
  const cat = currentProduct.category || "";
  const currentSku = currentProduct.sku.toUpperCase();
  const currentNameWords = new Set(currentProduct.name.toLowerCase().split(/[\s,]+/).filter(w => w.length > 3));

  // Check for SKU-level overrides first — manually curated pairings
  const skuOverride = FBT_SKU_OVERRIDES[currentProduct.sku];
  if (skuOverride) {
    const overrideProducts: ProductData[] = [];
    for (const sku of skuOverride) {
      const p = allProducts.find(x => x.sku === sku);
      if (p && p.images[0]?.startsWith("http")) overrideProducts.push(p);
    }
    if (overrideProducts.length > 0) return overrideProducts.slice(0, limit);
  }

  // Use FBT-specific pairings first, fall back to general pairings
  const targetSubs = FBT_PAIRINGS[sub] || SUBCATEGORY_PAIRINGS[sub] || CATEGORY_FALLBACKS[cat] || [];

  // Try to include staple SKU for this category
  const stapleSku = FBT_STAPLE_SKUS[cat]?.[0];
  const stapleProduct = stapleSku ? allProducts.find(p => p.sku === stapleSku && p.sku.toUpperCase() !== currentSku) : null;

  const scored: { product: ProductData; score: number }[] = [];

  for (const p of allProducts) {
    if (p.sku.toUpperCase() === currentSku) continue;
    if (!p.images[0]?.startsWith("http")) continue;
    if (p.subcategory === sub) continue;

    const pSub = p.subcategory || "";
    const pName = p.name.toLowerCase();

    let score = 0;
    for (let i = 0; i < targetSubs.length; i++) {
      const target = targetSubs[i].toLowerCase();
      if (pSub.toLowerCase() === target) { score += 100 - i * 10; break; }
      if (pSub.toLowerCase().includes(target) || target.includes(pSub.toLowerCase())) { score += 60 - i * 10; break; }
      if (pName.includes(target)) { score += 30 - i * 5; }
    }

    if (p.inStock) score += 10;
    if (p.reviewCount > 0) score += 5;
    // Boost Janitors Finest brand
    if (p.brand?.toLowerCase().includes("janitors finest")) score += 8;

    // Penalize too-similar items
    const pWords = new Set(pName.split(/[\s,]+/).filter(w => w.length > 3));
    let overlap = 0;
    for (const w of pWords) { if (currentNameWords.has(w)) overlap++; }
    if (overlap >= 3) score -= 50;

    if (score > 0) scored.push({ product: p, score });
  }

  scored.sort((a, b) => b.score - a.score);

  // Build result with strict diversity: max 1 per subcategory
  const result: ProductData[] = [];
  const usedSubs = new Set<string>();

  for (const { product } of scored) {
    if (result.length >= limit) break;
    const pSub = product.subcategory || "other";
    if (usedSubs.has(pSub)) continue;
    result.push(product);
    usedSubs.add(pSub);
  }

  // If we have room and a staple product that wasn't included, inject it
  if (stapleProduct && result.length < limit && !result.find(p => p.sku === stapleProduct.sku)) {
    const stapleSub = stapleProduct.subcategory || "other";
    if (!usedSubs.has(stapleSub)) {
      result.push(stapleProduct);
    }
  }

  return result;
}
