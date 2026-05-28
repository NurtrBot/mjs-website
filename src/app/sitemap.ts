import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/bigcommerce";

const SITE_URL = "https://www.mobilejanitorialsupply.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  // ── Static pages ──
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/quote`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/resources`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/catalogs`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/privacy-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/return-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  // ── Category pages ──
  const categories = [
    "paper-restroom",
    "cleaning-chemicals",
    "trash-liners",
    "gloves-safety",
    "packaging-film",
    "breakroom",
    "equipment-tools",
    "floor-care",
    "car-detailing",
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((slug) => ({
    url: `${SITE_URL}/shop/${slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.9,
  }));

  // ── Guide pages ──
  const guidePages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/guides`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/guides/trash-bag-size-guide`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/guides/disposable-glove-guide`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/guides/how-to-strip-and-wax-floors`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/guides/cleaning-chemical-dilution-chart`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/guides/paper-towel-guide`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/guides/janitorial-supply-checklist`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/guides/car-detailing-supply-guide`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/guides/stretch-wrap-guide`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/guides/commercial-carpet-cleaning-guide`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/guides/mop-buying-guide`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/guides/restroom-cleaning-checklist`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/guides/respirator-mask-guide`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/guides/food-service-disposables-guide`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/guides/how-to-bid-a-cleaning-job`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/guides/soap-dispenser-guide`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/guides/shipping-supplies-guide`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/guides/green-cleaning-guide`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];

  // ── Industry pages ──
  const industryPages: MetadataRoute.Sitemap = [
    "restaurants", "healthcare", "schools", "property-management", "offices", "warehouses",
  ].map((slug) => ({
    url: `${SITE_URL}/industries/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // ── Local SEO pages ──
  const locationPages: MetadataRoute.Sitemap = [
    "orange-county", "los-angeles", "inland-empire", "san-diego",
    "anaheim", "irvine", "santa-ana", "huntington-beach",
    "fullerton", "costa-mesa", "garden-grove", "long-beach",
  ].map((slug) => ({
    url: `${SITE_URL}/locations/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // ── Collection pages ──
  const collectionPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/collection?type=best-sellers`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/collection?type=new-arrivals`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/collection?type=ready-to-ship`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
  ];

  // ── Product pages — fetch all visible products from BC ──
  const productPages: MetadataRoute.Sitemap = [];
  try {
    const seen = new Set<number>();
    let page = 1;
    const maxPages = 30; // Up to 7,500 products

    while (page <= maxPages) {
      const res = await getProducts({ page, limit: 250, is_visible: true });

      for (const p of res.data) {
        if (seen.has(p.id) || !p.price || p.price <= 0) continue;
        seen.add(p.id);

        const slug = p.custom_url?.url
          ? p.custom_url.url
              .replace(/^\/|\/$/g, "")
              .replace(/\//g, "-")
              .replace(/-{2,}/g, "-")
              .replace(/^-|-$/g, "")
          : `product-${p.id}`;

        productPages.push({
          url: `${SITE_URL}/product/${slug}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.6,
        });
      }

      if (page >= res.meta.pagination.total_pages) break;
      page++;
    }
  } catch {
    // If product fetch fails, sitemap still works with static + category pages
  }

  return [...staticPages, ...categoryPages, ...guidePages, ...industryPages, ...locationPages, ...collectionPages, ...productPages];
}
