export type DeliveryZone = "oc" | "la" | "ie" | "sd" | "ups";

const OC_ZIPS = ["926", "927", "928"];
const LA_ZIPS = ["900", "901", "902", "903", "904", "905", "906", "907", "908", "909", "910", "911", "912", "913", "914", "915", "916", "917", "918"];
const IE_ZIPS = ["920", "921", "922", "923", "924", "925"];
const SD_ZIPS = ["919", "930", "931", "932", "933", "934", "935"];

export const LOCAL_FREE_DELIVERY_MINIMUM = 399;
export const EXTENDED_FREE_DELIVERY_MINIMUM = 699;

// Zips inside a local zone that require the higher free-delivery minimum
const EXTENDED_MINIMUM_ZIPS = ["92404", "92880"];

export function getDeliveryZone(zip: string): DeliveryZone {
  const prefix = (zip || "").trim().slice(0, 3);
  if (OC_ZIPS.includes(prefix)) return "oc";
  if (LA_ZIPS.includes(prefix)) return "la";
  if (IE_ZIPS.includes(prefix)) return "ie";
  if (SD_ZIPS.includes(prefix)) return "sd";
  return "ups";
}

// Zips that require the higher free-delivery minimum
export function isExtendedMinimumZip(zip: string): boolean {
  return EXTENDED_MINIMUM_ZIPS.includes((zip || "").trim().slice(0, 5));
}

// Subtotal needed for free delivery, or null when the zip ships via UPS
export function getFreeDeliveryMinimum(zip: string): number | null {
  const zone = getDeliveryZone(zip);
  if (zone === "ups") return null;
  if (zone === "sd") return EXTENDED_FREE_DELIVERY_MINIMUM;
  if (isExtendedMinimumZip(zip)) return EXTENDED_FREE_DELIVERY_MINIMUM;
  return LOCAL_FREE_DELIVERY_MINIMUM;
}
