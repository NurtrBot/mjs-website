/* ── Active Sale Configuration ──
   Single source of truth for sale items, prices, and expiration.
   Used by the sale page, cart upsell, and cart price overrides.
*/

export const SALE_CONFIG = {
  name: "Summer Essentials Sale",
  endsAt: new Date("2026-09-01T23:59:59"),
  bundlePrice: 50,
  items: [
    {
      sku: "3175",
      name: "Yellow Vinyl Caddy Bag",
      shortDescription: "Hangs on Huskee cans. Keeps sprays, rags, and liners within reach.",
      salePrice: 15,
      originalPrice: 33.95,
      image: "https://cdn11.bigcommerce.com/s-wujf5nuxy5/products/12252/images/13023/306__60858.1576532646.1280.1280.jpg?c=1",
      slug: "3175-yellow-vinyl-caddy-bag",
    },
    {
      sku: "DLR18",
      name: '18" Universal Dolly',
      shortDescription: "Five swivel casters, 400 lb capacity. Rolls 20 to 55 gallon cans.",
      salePrice: 25,
      originalPrice: 39.99,
      image: "https://cdn11.bigcommerce.com/s-wujf5nuxy5/products/12248/images/316196/s-l1600__69435.1684175433.1280.1280.jpg?c=1",
      slug: "trash-can-dolly-18-diameter-x-6-height-black-400-lb-capacity",
    },
    {
      sku: "ALP-499",
      name: '24" Wet Floor Sign',
      shortDescription: "Folding polypropylene, English and Spanish. Wipes clean, stores flat.",
      salePrice: 10,
      originalPrice: 12.95,
      image: "https://cdn11.bigcommerce.com/s-wujf5nuxy5/products/12562/images/13370/ALP499_540x540__25847.1576532890.1280.1280.jpg?c=1",
      slug: "alpine-alp499-24-caution-wet-floor-sign",
    },
  ],
};

export function isSaleActive(): boolean {
  return new Date() < SALE_CONFIG.endsAt;
}

export function getSalePrice(sku: string): number | null {
  if (!isSaleActive()) return null;
  const item = SALE_CONFIG.items.find((i) => i.sku === sku);
  return item?.salePrice ?? null;
}

export function getDaysRemaining(): number {
  const now = new Date();
  const diff = SALE_CONFIG.endsAt.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}
