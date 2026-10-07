import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/bigcommerce";
import { SITE_CATEGORY_NAMES, BC_CATEGORY_MAP } from "@/lib/category-map";
import { getQuickFilters, filterSlug } from "@/lib/category-filters";

const SITE_URL = "https://www.mobilejanitorialsupply.com";

// Rebuild at most once a day — lastmod values must not change on every request
export const revalidate = 86400;

// Bump this when static page content changes; it's the lastmod for hand-written pages
const STATIC_CONTENT_DATE = "2026-10-05";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = STATIC_CONTENT_DATE;

  // ── Static pages ──
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/shop`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/quote`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/resources`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/privacy-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/return-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/shop-by-workspace`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/industries/portable-restroom`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];

  // ── Category + subcategory pages (filled in after products are fetched so lastmod is real) ──
  const categorySlugs = Object.keys(SITE_CATEGORY_NAMES);
  const categoryLastMod: Record<string, string> = {};

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

  // ── Brand pages ──
  const brandPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/brands/johnnys-choice`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
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

  // ── Spanish pages ──
  const spanishPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/es`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 },
    ...[
    "anaheim", "santa-ana", "garden-grove", "fullerton", "fountain-valley",
    "restaurantes", "escuelas", "oficinas", "iglesias",
  ].map((slug) => ({
    url: `${SITE_URL}/es/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  })),
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

        const modified = p.date_modified ? new Date(p.date_modified).toISOString() : now;
        for (const catId of p.categories || []) {
          const siteSlug = BC_CATEGORY_MAP[catId];
          if (siteSlug && (!categoryLastMod[siteSlug] || modified > categoryLastMod[siteSlug])) categoryLastMod[siteSlug] = modified;
        }

        productPages.push({
          url: `${SITE_URL}/product/${slug}`,
          lastModified: modified,
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

  const categoryPages: MetadataRoute.Sitemap = categorySlugs.flatMap((slug) => {
    const lastModified = categoryLastMod[slug] || now;
    return [
      { url: `${SITE_URL}/category/${slug}`, lastModified, changeFrequency: "daily" as const, priority: 0.9 },
      ...getQuickFilters(slug).map((f) => ({
        url: `${SITE_URL}/category/${slug}/${filterSlug(f.label)}`,
        lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    ];
  });

  return [...staticPages, ...categoryPages, ...brandPages, ...guidePages, ...industryPages, ...locationPages, ...spanishPages, ...productPages];
}
