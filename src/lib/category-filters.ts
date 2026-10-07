import type { ProductData } from "@/data/products";

/* ─────────────────────────────────────────────────────────────
   Category filter config shared by the category pages (server),
   the CategoryPage component (client) and the sitemap.
   Each quick filter becomes a crawlable URL:
     /category/<category>/<filter-slug>
   ───────────────────────────────────────────────────────────── */

/* ── Site category slug → display name ── */
export const categoryNames: Record<string, string> = {
  "paper-products": "Paper Products",
  "cleaning-chemicals": "Cleaning Chemicals",
  "trash-liners": "Trash Liners",
  "gloves-safety": "Gloves & Safety",
  "packaging-film": "Packaging & Film",
  "breakroom": "Breakroom",
  "equipment": "Equipment & Tools",
  "floor-care": "Floor Care",
  "car-detailing": "Car Detailing",
};

/* ── Quick filter config per category ── */
export const quickFilters: Record<string, { label: string; subcategories: string[] }[]> = {
  "paper-products": [
    { label: "Hardwound Roll Towels", subcategories: ["Hardwound Roll Towels", "Jumbo Roll Towels"] },
    { label: "Kitchen Towels", subcategories: ["Kitchen Roll Towels"] },
    { label: "Center-Pull", subcategories: ["Center-Pull Towels"] },
    { label: "Multifold & C-Fold", subcategories: ["Multifold Towels", "C-Fold Towels", "Singlefold Towels"] },
    { label: "Toilet Tissue", subcategories: ["Standard Toilet Tissue"] },
    { label: "Jumbo Toilet Tissue", subcategories: ["Jumbo Toilet Tissue", "Coreless Toilet Tissue"] },
    { label: "Facial Tissue", subcategories: ["Facial Tissue"] },
    { label: "Seat Covers", subcategories: ["Seat Covers"] },
    { label: "Feminine Products", subcategories: ["Feminine Products"] },
  ],
  "cleaning-chemicals": [
    { label: "Degreasers", subcategories: ["Degreasers"] },
    { label: "All Purpose", subcategories: ["__all_purpose_whitelist__"] },
    { label: "Disinfectants", subcategories: ["Disinfectants", "Bleach"] },
    { label: "Hand Soaps", subcategories: ["Hand Soap & Sanitizer"] },
    { label: "Air Fresheners", subcategories: ["Air Fresheners"] },
    { label: "Urinal Screens", subcategories: ["Urinal Screens"] },
    { label: "Dish & Laundry", subcategories: ["Dish & Laundry"] },
    { label: "Floor & Carpet", subcategories: ["Floor Care", "Floor Strippers", "Floor Finishes", "Carpet Care", "Drain Cleaners", "Floor & Carpet"] },
    { label: "Portable Toilets", subcategories: ["__portable_toilets__"] },
  ],
  "trash-liners": [
    { label: "Clear", subcategories: ["Clear Can Liners"] },
    { label: "Black", subcategories: ["Black Can Liners"] },
    { label: "Drawstring", subcategories: ["Drawstring Liners"] },
    { label: "Compostable", subcategories: ["Compostable Liners"] },
  ],
  "gloves-safety": [
    { label: "Blue Nitrile", subcategories: ["Blue Nitrile"] },
    { label: "Black Nitrile", subcategories: ["Black Nitrile"] },
    { label: "8 Mil Diamond", subcategories: ["Orange Diamond Nitrile", "Black Diamond Nitrile", "Diamond Nitrile"] },
    { label: "Latex", subcategories: ["Latex Gloves", "High Risk Latex"] },
    { label: "Vinyl", subcategories: ["Vinyl Gloves"] },
    { label: "Face Masks", subcategories: ["Face Masks"] },
    { label: "Hair & Beard", subcategories: ["Hair Protection", "Beard Covers"] },
    { label: "Aprons & PPE", subcategories: ["Aprons", "Arm Sleeves", "Shoe Covers", "Back Support"] },
    { label: "Dispensers", subcategories: ["Dispensers"] },
  ],
  "packaging-film": [
    { label: "Stretch Film", subcategories: ["Stretch Film"] },
    { label: "Colored Stretch Film", subcategories: ["Colored Stretch Film"] },
    { label: "Machine Film", subcategories: ["Machine Film"] },
    { label: "Tape", subcategories: ["Tape"] },
    { label: "Tape Guns", subcategories: ["Tape Dispensers"] },
    { label: "Bubble Wrap", subcategories: ["Bubble Wrap"] },
    { label: "Packing Peanuts", subcategories: ["Packing Peanuts"] },
    { label: "Steel Strapping", subcategories: ["Steel Strapping"] },
    { label: "Cable Ties", subcategories: ["Cable Ties"] },
    { label: "Labels", subcategories: ["Labels"] },
  ],
  "breakroom": [
    { label: "Cups & Lids", subcategories: ["Cups & Lids"] },
    { label: "Cutlery", subcategories: ["Cutlery"] },
    { label: "Plates & Bowls", subcategories: ["Plates & Bowls"] },
    { label: "Napkins", subcategories: ["Napkins"] },
    { label: "Food Storage", subcategories: ["Food Storage"] },
    { label: "Beverages", subcategories: ["Beverages"] },
  ],
  "equipment": [
    { label: "Dispensers", subcategories: ["Dispensers", "Tape Dispensers"] },
    { label: "Mops", subcategories: ["Mops & Handles", "Dust Mops"] },
    { label: "Brooms", subcategories: ["Brooms & Dustpans"] },
    { label: "Mop Buckets", subcategories: ["Buckets & Wringers"] },
    { label: "Vacuums", subcategories: ["Vacuums"] },
    { label: "Trash Cans", subcategories: ["Trash Cans", "Carts & Dollies"] },
    { label: "Window", subcategories: ["Window Equipment"] },
    { label: "Sprayers", subcategories: ["Sprayers & Bottles"] },
    { label: "Rags & Wipers", subcategories: ["Rags & Wipers", "Microfiber"] },
    { label: "Brushes & Pads", subcategories: ["Brushes & Pads", "Pad Drivers"] },
    { label: "Dusters", subcategories: ["Dusters"] },
    { label: "Batteries", subcategories: ["Batteries"] },
    { label: "Floor Machines", subcategories: ["Floor Machines", "Air Movers"] },
  ],
  "floor-care": [
    { label: "Floor Pads", subcategories: ["Floor Pads", "Stripping Pads", "Buffing Pads", "Polishing Pads", "Scrubbing Pads"] },
    { label: "Bonnets", subcategories: ["Bonnets"] },
    { label: "Chemicals", subcategories: ["Floor Care", "Floor Strippers", "Floor Finishes", "Floor & Carpet", "Carpet Care"] },
  ],
  "car-detailing": [
    { label: "Wonder Wafers", subcategories: ["__wonder_wafers__"] },
    { label: "Air Freshener Gallons", subcategories: ["__jf_air_fresheners__"] },
    { label: "Car Wash & Shampoo", subcategories: ["Car Wash & Shampoo"] },
    { label: "Coatings & Protectants", subcategories: ["Coatings & Protectants"] },
    { label: "Interior Care", subcategories: ["Interior Care"] },
    { label: "Brushes & Tools", subcategories: ["Brushes & Tools"] },
    { label: "Pads & Applicators", subcategories: ["Pads & Applicators"] },
  ],
};


export type QuickFilter = { label: string; subcategories: string[] };

export function filterSlug(label: string): string {
  return label.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function getQuickFilters(category: string): QuickFilter[] {
  return quickFilters[category] || [];
}

export function findQuickFilter(category: string, slug: string): { index: number; filter: QuickFilter } | null {
  const filters = getQuickFilters(category);
  const index = filters.findIndex(f => filterSlug(f.label) === slug);
  return index === -1 ? null : { index, filter: filters[index] };
}

// Does a product belong to the given quick filter's subcategory list?
export function matchesFilter(p: ProductData, subs: string[]): boolean {
  if (subs.includes("__wonder_wafers__")) return /wonder wafer/i.test(p.name);
  if (subs.includes("__jf_air_fresheners__")) return /janitors finest/i.test(p.name) && p.subcategory === "Air Fresheners" && p.sku !== "31801EA";
  if (subs.includes("__all_purpose_whitelist__")) {
    const allowed = new Set(["3162EA", "80301EA", "12520EA", "128EA", "CLO60607CT", "CPC53058"]);
    return allowed.has(p.sku);
  }
  if (subs.includes("__portable_toilets__")) {
    const allowed = new Set(["JC25", "JC250", "JCD50", "JCD250"]);
    return allowed.has(p.sku);
  }
  return subs.includes(p.subcategory);
}

// Which quick filter (subcategory page) does a product's subcategory belong to?
export function findFilterForSubcategory(category: string, subcategory: string): QuickFilter | null {
  const filters = getQuickFilters(category);
  const sub = (subcategory || "").trim().toLowerCase();
  if (!sub) return null;
  return (
    filters.find(f => f.subcategories.some(s => s.toLowerCase() === sub)) ||
    filters.find(f => f.label.toLowerCase() === sub) ||
    null
  );
}
