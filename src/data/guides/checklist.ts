/* Janitorial Supply Checklist — data */

export type ChecklistCategoryId = "chemicals" | "paper" | "trash" | "gloves" | "equipment" | "breakroom";

export interface ChecklistItem {
  name: string;
  why: string;
  sku?: string;
}

export interface ChecklistCategory {
  id: ChecklistCategoryId;
  name: string;
  tint: string;
  shop: string;
  items: ChecklistItem[];
}

export const CHECKLIST: ChecklistCategory[] = [
  { id: "chemicals", name: "Cleaning chemicals", tint: "#e4f1ff", shop: "/category/cleaning-chemicals", items: [
    { name: "Neutral floor cleaner", why: "Daily mopping, safe on all hard floors and wax", sku: "3158" },
    { name: "Disinfectant cleaner", why: "Restrooms, high-touch surfaces, common areas", sku: "91101" },
    { name: "Glass cleaner", why: "Mirrors, windows, glass doors and display cases", sku: "82201" },
    { name: "Heavy-duty degreaser", why: "Kitchens, hoods, equipment and tough grease", sku: "80601" },
    { name: "Bleach", why: "Sanitizing, whitening and deep disinfection", sku: "52416" },
    { name: "Hand soap (bulk)", why: "Restroom and break-room dispensers", sku: "25630" },
    { name: "Dish soap", why: "Break-room sinks and kitchens", sku: "60001" },
    { name: "Bowl cleaner", why: "Toilets and urinals: scale and stains", sku: "40401" },
  ] },
  { id: "paper", name: "Paper products", tint: "#e6f6ee", shop: "/category/paper-products", items: [
    { name: "Multifold paper towels", why: "Restroom hand drying: the most-used supply in any building", sku: "5300" },
    { name: "2-ply toilet tissue", why: "Standard roll for every restroom", sku: "5602" },
    { name: "Jumbo-roll toilet tissue", why: "High-traffic restrooms, fewer roll changes", sku: "5200" },
    { name: "Facial tissue", why: "Conference rooms, offices, reception", sku: "5701" },
    { name: "Toilet seat covers", why: "Expected in any professional restroom", sku: "5800" },
  ] },
  { id: "trash", name: "Trash liners", tint: "#efe9fb", shop: "/category/trash-liners", items: [
    { name: "7–10 gal liners", why: "Desk-side and bathroom wastebaskets", sku: "CL242406" },
    { name: "12–16 gal liners", why: "Tall kitchen and restroom cans", sku: "CL243306" },
    { name: "33 gal liners", why: "Lobby cans, common areas, break rooms", sku: "CL334016" },
    { name: "40–45 gal liners", why: "Large round cans, cafeterias, outdoor bins", sku: "CL404814" },
    { name: "13 gal drawstring liners", why: "Easy tie-off for kitchen cans", sku: "LD242710WD" },
  ] },
  { id: "gloves", name: "Gloves & PPE", tint: "#fff3cc", shop: "/category/gloves-safety", items: [
    { name: "Nitrile gloves", why: "All-purpose, chemical resistant, latex-free", sku: "8602EA" },
    { name: "Vinyl gloves", why: "Budget option for food service and light tasks", sku: "VCPF-48MEA" },
    { name: "Every size, S to XL", why: "Stock all sizes. One size does not fit all." },
    { name: "Glove dispenser", why: "Wall-mounted at each cleaning station", sku: "90203" },
  ] },
  { id: "equipment", name: "Equipment & tools", tint: "#fde8e8", shop: "/category/equipment", items: [
    { name: "Mop bucket & wringer", why: "Side-press wringer for daily mopping", sku: "8036" },
    { name: "Wet mop heads", why: "Cotton or rayon; replace monthly for hygiene", sku: "8852016" },
    { name: "Dust mop, 24\" or 36\"", why: "Dust mop before you wet mop", sku: "92524B" },
    { name: "Broom & dustpan", why: "Angled broom for corners, lobby pan for open areas", sku: "2515" },
    { name: "Spray bottles, 3-pack", why: "Color-code by chemical: an OSHA requirement", sku: "130136" },
    { name: "Trigger sprayers", why: "Heavy-duty replacements for worn sprayers", sku: "110246" },
    { name: "Microfiber mop system", why: "Finish application and daily cleaning", sku: "M8300COMP" },
    { name: "Duster", why: "Desks, vents and fixtures", sku: "UNS914FD" },
  ] },
  { id: "breakroom", name: "Breakroom", tint: "#fdeedd", shop: "/category/breakroom", items: [
    { name: "Hot cups", why: "Coffee and tea: 8, 12 or 16 oz", sku: "SIP121000" },
    { name: "Paper plates", why: "Lunches and catering", sku: "PLATE91200C" },
    { name: "Cutlery", why: "Bulk forks, spoons and knives", sku: "MEFO10" },
    { name: "Napkins", why: "Beverage and luncheon napkins", sku: "5930" },
  ] },
];

export const ALL_CHECKLIST_SKUS = CHECKLIST.flatMap((c) => c.items.map((i) => i.sku).filter(Boolean) as string[]);

export const MONTHLY = [
  { name: "Office, 25–50 people", photo: "/images/industry-commercial-offices.jpg", lines: ["2 cases paper towels", "2 cases toilet tissue", "1 case 7–10 gal liners", "1 case 33 gal liners", "2 gal neutral floor cleaner", "1 gal disinfectant", "1 gal glass cleaner", "2 boxes nitrile gloves", "1 gal hand soap", "1 case facial tissue"] },
  { name: "Restaurant", photo: "/images/industry-food-service.jpg", lines: ["3 cases paper towels", "2 cases toilet tissue", "2 cases 33–45 gal liners", "1 gal degreaser", "1 gal sanitizer", "1 gal dish soap", "4 boxes nitrile gloves", "2 cases napkins", "1 gal floor cleaner", "1 gal bleach"] },
  { name: "Medical office", photo: "/images/industry-healthcare.jpg", lines: ["3 cases paper towels", "2 cases toilet tissue", "2 cases liners (mixed)", "2 gal disinfectant", "1 gal glass cleaner", "6 boxes nitrile gloves", "2 gal hand soap", "1 case seat covers", "1 gal floor cleaner", "1 gal bleach"] },
  { name: "School or daycare", photo: "/images/industry-schools.jpg", lines: ["5 cases paper towels", "4 cases toilet tissue", "3 cases liners", "3 gal disinfectant", "2 gal floor cleaner", "4 boxes nitrile gloves", "2 gal hand soap", "2 cases facial tissue", "1 gal glass cleaner", "1 case seat covers"] },
  { name: "Warehouse or shop", photo: "/images/industry-industrial.jpg", lines: ["1 case roll towels", "1 case toilet tissue", "2 cases 40–45 gal liners", "1 gal degreaser", "1 gal disinfectant", "2 boxes nitrile gloves", "1 gal hand soap", "1 case absorbent", "1 gal floor cleaner"] },
  { name: "Hotel housekeeping cart", photo: "/images/industry-hospitality.jpg", lines: ["1 case multifold towels", "1 case toilet tissue", "1 case 7–10 gal liners", "1 gal disinfectant", "1 qt glass cleaner", "1 qt all-purpose cleaner", "2 boxes nitrile gloves", "1 gal hand soap"] },
];
