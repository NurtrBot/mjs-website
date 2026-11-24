import type { NextConfig } from "next";

// Legacy /shop/* URLs (client-rendered shells) → the server-rendered /category/* pages
const LEGACY_SHOP_REDIRECTS: Record<string, string> = {
  "paper-restroom": "paper-products",
  "cleaning-chemicals": "cleaning-chemicals",
  "trash-liners": "trash-liners",
  "gloves-safety": "gloves-safety",
  "packaging-film": "packaging-film",
  "breakroom": "breakroom",
  "equipment-tools": "equipment",
  "floor-care": "floor-care",
  "car-detailing": "car-detailing",
};

const nextConfig: NextConfig = {
  async redirects() {
    return [
      ...Object.entries(LEGACY_SHOP_REDIRECTS).map(([from, to]) => ({
        source: `/shop/${from}`,
        destination: `/category/${to}`,
        permanent: true,
      })),
      { source: "/catalogs", destination: "/resources", permanent: true },
      // Old BigCommerce storefront URLs (still in Google and in bookmarks) → their new homes.
      // Unknown leftovers fall through to a real 404; nothing redirects to the home page.
      { source: "/products.php", destination: "/shop", permanent: true },
      { source: "/categories", destination: "/shop", permanent: true },
      { source: "/cart.php", destination: "/cart", permanent: true },
      { source: "/login.php", destination: "/auth", permanent: true },
      { source: "/account.php", destination: "/account", permanent: true },
      { source: "/search.php", has: [{ type: "query", key: "search_query", value: "(?<q>.+)" }], destination: "/search?q=:q", permanent: true },
      { source: "/search.php", destination: "/search", permanent: true },
      { source: "/xmlsitemap.php", destination: "/sitemap.xml", permanent: true },
      { source: "/sitemap_index.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/sitemap-index.xml", destination: "/sitemap.xml", permanent: true },
      // Old "Janitorial Supply" landing URL → the home page
      { source: "/janitorial/supply", destination: "/", permanent: true },
      { source: "/janitorial", destination: "/", permanent: true },
    ];
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    minimumCacheTTL: 2592000, // 30 days — product/category photos rarely change
    // AVIF first (≈30–50% smaller than WebP on phones), WebP fallback
    formats: ["image/avif", "image/webp"],
    // 75 = default for thumbnails/cards; 85 = hero + main product photo
    qualities: [75, 85],
    // Drop the 3840/2048 widths — no phone or laptop needs them for this site
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn11.bigcommerce.com",
      },
      {
        protocol: "https",
        hostname: "api.tremendous.com",
      },
      {
        protocol: "https",
        hostname: "testflight.tremendous.com",
      },
    ],
  },
};

export default nextConfig;
