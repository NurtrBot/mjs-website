import type { MetadataRoute } from "next";

/**
 * robots.txt — tells Google what to crawl and what to skip.
 * Blocks API routes, auth, cart, checkout, and internal pages
 * that waste crawl budget. Points to sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/auth",
          "/cart",
          "/checkout",
          "/order-confirmation",
          "/account",
          "/rewards",
          "/_next/",
        ],
      },
    ],
    sitemap: "https://www.mobilejanitorialsupply.com/sitemap.xml",
  };
}
