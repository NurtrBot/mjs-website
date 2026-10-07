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
    ];
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    minimumCacheTTL: 86400,
    qualities: [85],
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
