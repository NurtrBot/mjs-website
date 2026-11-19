/* Trash Bag Size Guide — data (plain module so the server page and the client
   component can both import it). */

export interface LinerPick {
  sku: string;
  type: "Clear" | "Black" | "Drawstring" | "Compostable";
  thickness: string; // "6 mic", "0.45 mil"
  note?: string;
}

export interface CanSize {
  id: string;
  gallon: string; // "40-45"
  gallonNum: number; // for sorting / scale (upper bound)
  bagWidth: number; // inches, flat bag
  bagHeight: number;
  canHeight: number; // typical can height, inches (for the visual)
  canTopDiameter: number; // typical, inches
  whereUsed: string;
  canType: string;
  picks: LinerPick[];
}

export const CAN_SIZES: CanSize[] = [
  { id: "7-10", gallon: "7–10", gallonNum: 10, bagWidth: 24, bagHeight: 24, canHeight: 15, canTopDiameter: 11, whereUsed: "Desk-side bins, bathroom wastebaskets", canType: "Small office / bathroom can",
    picks: [{ sku: "CL242406", type: "Clear", thickness: "6 mic", note: "Paper & light office waste" }, { sku: "LD2423045K", type: "Black", thickness: "0.45 mil", note: "Hides contents, a bit stretchier" }] },
  { id: "12-16", gallon: "12–16", gallonNum: 16, bagWidth: 24, bagHeight: 33, canHeight: 24, canTopDiameter: 13, whereUsed: "Tall kitchen cans, restroom receptacles", canType: "Tall kitchen / restroom can",
    picks: [{ sku: "CL243306", type: "Clear", thickness: "6 mic" }, { sku: "CL243308", type: "Clear", thickness: "8 mic", note: "Step up for heavier mixed waste" }] },
  { id: "13", gallon: "13", gallonNum: 13, bagWidth: 24, bagHeight: 27, canHeight: 25, canTopDiameter: 12, whereUsed: "Standard kitchen cans with a tie-off", canType: "Kitchen can (drawstring)",
    picks: [{ sku: "LD242710WD", type: "Drawstring", thickness: "1.0 mil", note: "Easy tie-off, leak resistant" }] },
  { id: "20-30", gallon: "20–30", gallonNum: 30, bagWidth: 30, bagHeight: 37, canHeight: 28, canTopDiameter: 16, whereUsed: "Break rooms, small lobbies, medium bins", canType: "Medium / break-room bin",
    picks: [{ sku: "CL303708", type: "Clear", thickness: "8 mic" }, { sku: "CL303710", type: "Clear", thickness: "10 mic", note: "Heavier mixed waste" }] },
  { id: "33", gallon: "33", gallonNum: 33, bagWidth: 33, bagHeight: 40, canHeight: 30, canTopDiameter: 19, whereUsed: "Large office cans, lobby trash, medical offices", canType: "Large office / lobby can",
    picks: [{ sku: "CL334016", type: "Clear", thickness: "16 mic", note: "Our most popular 33-gal liner" }] },
  { id: "40-45", gallon: "40–45", gallonNum: 45, bagWidth: 40, bagHeight: 48, canHeight: 33, canTopDiameter: 22, whereUsed: "Large round cans, outdoor bins, cafeterias", canType: "Large round / outdoor bin",
    picks: [{ sku: "CL404812", type: "Clear", thickness: "12 mic" }, { sku: "CL404814", type: "Clear", thickness: "14 mic", note: "Best all-round pick" }, { sku: "CL404816", type: "Clear", thickness: "16 mic", note: "Heavy, sharp items" }] },
  { id: "56", gallon: "56", gallonNum: 56, bagWidth: 43, bagHeight: 48, canHeight: 35, canTopDiameter: 25, whereUsed: "Glutton containers, large industrial bins", canType: "Glutton / industrial container",
    picks: [{ sku: "CL434814", type: "Clear", thickness: "14 mic" }, { sku: "CL434816", type: "Clear", thickness: "16 mic" }] },
  { id: "60", gallon: "60", gallonNum: 60, bagWidth: 38, bagHeight: 60, canHeight: 42, canTopDiameter: 24, whereUsed: "Rollout carts, dumpster liners, large waste stations", canType: "Rollout cart / waste station",
    picks: [{ sku: "CL386014", type: "Clear", thickness: "14 mic" }, { sku: "CL386017", type: "Clear", thickness: "17 mic" }] },
];

export const ALL_TRASH_SKUS = CAN_SIZES.flatMap((c) => c.picks.map((p) => p.sku));

export const THICKNESS = [
  { kind: "High-density (microns)", feel: "Thin, crinkly, strong for its weight. Tear-resistant, not puncture-proof.", bestFor: "Offices, restrooms, break rooms: paper and dry waste.", range: "6–17 micron",
    levels: [["6 mic", "Light paper, tissues"], ["8–10 mic", "General office waste"], ["12–14 mic", "Heavier mixed waste"], ["16–17 mic", "Heavy or sharp items"]] },
  { kind: "Low-density (mils)", feel: "Thick and stretchy. Shrugs off punctures and tears.", bestFor: "Kitchens, restaurants, construction, medical: wet, heavy or sharp waste.", range: "0.45–1.5 mil",
    levels: [["0.45 mil", "Light kitchen waste"], ["0.80 mil", "General heavy duty"], ["1.0 mil", "Wet waste, food scraps"], ["1.5+ mil", "Construction, sharp debris"]] },
];

export const INDUSTRIES = [
  { name: "Office buildings", sizes: "7–10 gal at desks · 33–45 gal in lobbies", tip: "High-density clear liners for paper-heavy waste.", photo: "/images/industry-commercial-offices.jpg" },
  { name: "Restaurants & kitchens", sizes: "13 gal at prep · 33–45 gal in the kitchen", tip: "Low-density (mil) bags handle wet food waste without leaks.", photo: "/images/industry-food-service.jpg" },
  { name: "Healthcare & medical", sizes: "7–10 gal in exam rooms · 33 gal in common areas", tip: "Red or color-coded bags are required for biohazard. Check local rules.", photo: "/images/industry-healthcare.jpg" },
  { name: "Schools & facilities", sizes: "12–16 gal in classrooms · 40–45 gal in cafeterias", tip: "Heavier micron for cafeteria waste; compostable for food scraps.", photo: "/images/industry-schools.jpg" },
  { name: "Warehouses & industrial", sizes: "56–60 gal rollouts and large bins", tip: "Low-density 1.0+ mil handles heavy, sharp debris.", photo: "/images/industry-industrial.jpg" },
  { name: "Hotels & hospitality", sizes: "7–10 gal in rooms · 33 gal on housekeeping carts", tip: "Keep a drawstring liner on the cart for quick tie-offs.", photo: "/images/industry-hospitality.jpg" },
];
