import type { MetadataRoute } from "next";

/**
 * robots.txt — tells Google what to crawl and what to skip.
 * Blocks API routes, auth, cart, checkout, and internal pages
 * that waste crawl budget. Points to sitemap.
 */
const PRIVATE_PATHS = [
  "/api/",
  "/auth",
  "/cart",
  "/checkout",
  "/order-confirmation",
  "/account",
  "/rewards",
  "/_next/",
];

// AI search / assistant crawlers are explicitly welcome on the public catalog
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot",
  "Applebot-Extended",
  "Bingbot",
  "DuckAssistBot",
  "Amazonbot",
  "meta-externalagent",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE_PATHS },
      { userAgent: AI_CRAWLERS, allow: ["/", "/llms.txt", "/llms-full.txt"], disallow: PRIVATE_PATHS },
    ],
    sitemap: "https://www.mobilejanitorialsupply.com/sitemap.xml",
  };
}
