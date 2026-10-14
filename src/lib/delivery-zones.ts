export type DeliveryZone = "oc" | "la" | "ie" | "sd" | "ups";

const OC_ZIPS = ["926", "927", "928"];
const LA_ZIPS = ["900", "901", "902", "903", "904", "905", "906", "907", "908", "909", "910", "911", "912", "913", "914", "915", "916", "917", "918"];
// 920xx and 921xx are San Diego County (Carlsbad, Oceanside, Escondido, San Diego
// city) and used to sit here, which billed the whole county at the $399 local
// minimum. 922xx stays Inland Empire because it is the Coachella Valley — Palm
// Springs, Indio, Palm Desert, Riverside County — not San Diego; it earns the
// higher minimum through EXTENDED_MINIMUM_PREFIXES below instead of a wrong label.
const IE_ZIPS = ["922", "923", "924", "925"];
const SD_ZIPS = ["919", "920", "921", "930", "931", "932", "933", "934", "935"];

export const LOCAL_FREE_DELIVERY_MINIMUM = 399;
export const EXTENDED_FREE_DELIVERY_MINIMUM = 699;

// Zips inside a local zone that require the higher free-delivery minimum.
// 91352 is Sun Valley: an LA-prefix zip, but far enough out to bill at $699.
const EXTENDED_MINIMUM_ZIPS = ["92404", "92880", "91352"];

// Whole prefixes inside a local zone that bill at the higher minimum.
// 922xx is the Coachella Valley — Inland Empire by county, San Diego by distance.
const EXTENDED_MINIMUM_PREFIXES = ["922"];

export function getDeliveryZone(zip: string): DeliveryZone {
  const prefix = (zip || "").trim().slice(0, 3);
  if (OC_ZIPS.includes(prefix)) return "oc";
  if (LA_ZIPS.includes(prefix)) return "la";
  if (IE_ZIPS.includes(prefix)) return "ie";
  if (SD_ZIPS.includes(prefix)) return "sd";
  return "ups";
}

// Zips that require the higher free-delivery minimum. Checkout and order creation
// also read this to prefer the UPS rate over free local delivery below the minimum.
export function isExtendedMinimumZip(zip: string): boolean {
  const clean = (zip || "").trim();
  return EXTENDED_MINIMUM_ZIPS.includes(clean.slice(0, 5)) || EXTENDED_MINIMUM_PREFIXES.includes(clean.slice(0, 3));
}

// Subtotal needed for free delivery, or null when the zip ships via UPS
export function getFreeDeliveryMinimum(zip: string): number | null {
  const zone = getDeliveryZone(zip);
  if (zone === "ups") return null;
  if (zone === "sd") return EXTENDED_FREE_DELIVERY_MINIMUM;
  if (isExtendedMinimumZip(zip)) return EXTENDED_FREE_DELIVERY_MINIMUM;
  return LOCAL_FREE_DELIVERY_MINIMUM;
}
