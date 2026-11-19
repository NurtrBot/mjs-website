/* Cleaning Chemical Dilution Chart — data */

export type ChemCategory = "floor" | "glass" | "disinfectant" | "carpet" | "general";

export interface Chemical {
  sku: string;
  name: string;
  category: ChemCategory;
  ratio: string; // display, e.g. "1:128" or "1:4 to 1:8" or "Ready to use"
  parts: number | null; // water parts for the calculator (null = RTU). For ranges, the everyday-use end.
  use: string;
  strength: "light" | "medium" | "heavy";
  note?: string;
}

export const CHEM_CATEGORIES: { id: ChemCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "floor", label: "Floor care" },
  { id: "disinfectant", label: "Disinfectants" },
  { id: "general", label: "Kitchen & general" },
  { id: "glass", label: "Glass" },
  { id: "carpet", label: "Carpet" },
];

export const CHEMICALS: Chemical[] = [
  { sku: "3158", name: "Lemon Neutral Floor Cleaner", category: "floor", ratio: "1:128", parts: 128, use: "Daily mopping on all hard floors", strength: "light", note: "Safe on waxed floors; won't strip finish." },
  { sku: "20501", name: "Wax Stripper, Non-Ammoniated", category: "floor", ratio: "1:4 to 1:8", parts: 8, use: "Stripping old floor finish", strength: "heavy", note: "1:4 for heavy buildup, 1:8 for light. Don't let it dry on the floor." },
  { sku: "20701", name: "Super Stripper, Ammoniated", category: "floor", ratio: "1:4 to 1:32", parts: 16, use: "Heavy-duty stripping", strength: "heavy", note: "Most aggressive stripper. 1:4 for the toughest jobs." },
  { sku: "21001", name: "Neutralizer Rinse", category: "floor", ratio: "1:128", parts: 128, use: "Rinse after stripping to restore pH", strength: "light", note: "Required after stripping so new finish doesn't peel." },
  { sku: "20301", name: "Spray Buff", category: "floor", ratio: "Ready to use", parts: null, use: "Spray-and-buff maintenance between recoats", strength: "light" },
  { sku: "82201", name: "Window Cleaner Concentrate 50:1", category: "glass", ratio: "1:50", parts: 50, use: "Windows, mirrors, glass", strength: "light", note: "Non-ammoniated. One gallon makes 50." },
  { sku: "81312", name: "Squeegee Shine Window Cleaner", category: "glass", ratio: "1:128", parts: 128, use: "Windows, mirrors, chrome, counters", strength: "light", note: "A 32 oz bottle makes 32 gallons." },
  { sku: "3187", name: "Ammoniated Glass Cleaner", category: "glass", ratio: "Ready to use", parts: null, use: "Mirrors, display cases, porcelain", strength: "medium" },
  { sku: "91101", name: "Strike Bac Disinfectant Cleaner", category: "disinfectant", ratio: "1:32", parts: 32, use: "Hard-surface disinfecting: floors, walls, fixtures", strength: "medium", note: "EPA-registered. Lemon scent." },
  { sku: "91301", name: "Pine Disinfectant Neutral Cleaner", category: "disinfectant", ratio: "1:64", parts: 64, use: "General disinfecting and deodorizing", strength: "medium", note: "EPA-registered; kills flu, salmonella, staph." },
  { sku: "91001", name: "Sani 10% Quaternary Sanitizer", category: "disinfectant", ratio: "1:256", parts: 256, use: "Food-contact surface sanitizing", strength: "light", note: "No-rinse on food surfaces at the right dilution." },
  { sku: "52416", name: "Pure Bright Liquid Bleach 6%", category: "disinfectant", ratio: "1:21", parts: 21, use: "Sanitizing, whitening, disinfecting", strength: "heavy", note: "6 oz per gallon for general cleaning." },
  { sku: "30401", name: "Carpet Extraction Cleaner", category: "carpet", ratio: "1:16", parts: 16, use: "Hot-water extraction machines", strength: "heavy", note: "Great on oil-based stains." },
  { sku: "30301", name: "Carpet Extraction Emulsifier", category: "carpet", ratio: "1:64", parts: 64, use: "Pre-spray and extraction booster", strength: "medium" },
  { sku: "30101", name: "Dry Foam Carpet Shampoo", category: "carpet", ratio: "1:50", parts: 50, use: "Dry-foam and rotary machines", strength: "medium", note: "Low moisture, carpets dry faster." },
  { sku: "30701", name: "Carpet Defoamer", category: "carpet", ratio: "1:256", parts: 256, use: "Kills foam in recovery tanks", strength: "light", note: "A little goes a very long way." },
  { sku: "30901", name: "Traffic Lane Cleaner", category: "carpet", ratio: "1:16", parts: 16, use: "Pre-spray for high-traffic carpet", strength: "heavy" },
  { sku: "80601", name: "Orange X-treme Degreaser", category: "general", ratio: "1:10 to 1:64", parts: 32, use: "Kitchens, hoods, equipment grease", strength: "heavy", note: "1:10 for heavy grease, 1:64 for light cleaning." },
  { sku: "82901", name: "Clear Ammonia", category: "general", ratio: "1:16 to 1:64", parts: 32, use: "Floors, walls, grease cutting", strength: "heavy", note: "Ventilate well. Never mix with bleach." },
  { sku: "41101", name: "Tile & Grout Cleaner", category: "general", ratio: "1:10 to 1:20", parts: 16, use: "Tubs, showers, toilets, grout", strength: "heavy", note: "Acid-based: not for marble or natural stone." },
  { sku: "60001", name: "Green Lemon Dish Wash", category: "general", ratio: "1:256 to 1:512", parts: 256, use: "Hand dishwashing, 3-compartment sinks", strength: "light", note: "Highly concentrated. A small squeeze per basin." },
  { sku: "31801", name: "Odorzyme Plus Odor Eliminator", category: "general", ratio: "Ready to use", parts: null, use: "Urine, vomit, pet and grease odors", strength: "medium", note: "Enzyme-based. Let it dwell 15+ minutes." },
];

export const ALL_CHEM_SKUS = CHEMICALS.map((c) => c.sku);

export const CONTAINERS = [
  { id: "spray", label: "Spray bottle", oz: 32 },
  { id: "gallon", label: "1-gallon jug", oz: 128 },
  { id: "bucket", label: "Mop bucket (3.5 gal)", oz: 448 },
  { id: "bucket5", label: "5-gallon bucket", oz: 640 },
];

export const RATIO_TABLE = [
  ["1:4", "32 oz (1 qt)", "8 tbsp"], ["1:8", "16 oz (1 pt)", "4 tbsp"], ["1:10", "12.8 oz", "~3 tbsp"], ["1:16", "8 oz (1 cup)", "2 tbsp"], ["1:20", "6.4 oz", "~1½ tbsp"],
  ["1:32", "4 oz (½ cup)", "1 tbsp"], ["1:50", "2.5 oz", "~2 tsp"], ["1:64", "2 oz (¼ cup)", "1½ tsp"], ["1:128", "1 oz (2 tbsp)", "~1 tsp"], ["1:256", "0.5 oz (1 tbsp)", "~½ tsp"],
];

export const NEVER_MIX = [
  { a: "Bleach", b: "Ammonia", result: "Chloramine gas. Serious lung damage, can be fatal.", danger: true },
  { a: "Bleach", b: "Acids", result: "Chlorine gas. Includes bowl cleaners, vinegar and rust removers.", danger: true },
  { a: "Peroxide", b: "Vinegar", result: "Peracetic acid. Irritates skin, eyes and lungs.", danger: false },
];

export const SAFETY_HABITS = [
  ["Chemical into water", "Add concentrate to the water, never water to concentrate. It stops splashing of full-strength product."],
  ["Label every bottle", "Product name, ratio and date mixed. Unmarked bottles cause accidents and are an OSHA violation."],
  ["Gloves and eye protection", "Concentrates are far stronger than the diluted product you're used to handling."],
  ["Mix fresh weekly", "Diluted chemicals lose potency, especially disinfectants."],
  ["Warm water, not hot", "Hot water can break down active ingredients."],
  ["Measure, don't pour", "Use a cup or a proportioner. Eyeballing wastes product and gives uneven results."],
];

export const FACILITY_KITS = [
  { name: "Office building", photo: "/images/industry-commercial-offices.jpg", skus: ["3158", "82201", "91101", "60001"] },
  { name: "Restaurant & kitchen", photo: "/images/industry-food-service.jpg", skus: ["80601", "91001", "60001", "3158", "52416"] },
  { name: "Healthcare", photo: "/images/industry-healthcare.jpg", skus: ["91101", "3158", "82201", "52416"] },
  { name: "Schools", photo: "/images/industry-schools.jpg", skus: ["91101", "3158", "30401", "82201"] },
  { name: "Warehouse & industrial", photo: "/images/industry-industrial.jpg", skus: ["80601", "20501", "91101", "82901"] },
  { name: "Hotels & property", photo: "/images/industry-hospitality.jpg", skus: ["3158", "82201", "91101", "31801"] },
];
