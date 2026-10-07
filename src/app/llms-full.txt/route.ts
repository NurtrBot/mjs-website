import { getProducts } from "@/lib/bigcommerce";
import { getBrands } from "@/lib/bigcommerce";
import { BUSINESS } from "@/lib/business";
import { SITE_CATEGORY_NAMES, getSiteCategory } from "@/lib/category-map";

export const revalidate = 86400;

// llms-full.txt — every visible product on one line, for AI agents that want the whole catalog
export async function GET() {
  const base = BUSINESS.siteUrl;
  const lines: string[] = [
    `# ${BUSINESS.name} — full product list`,
    `# Columns: SKU | name | brand | category | price (USD) | URL`,
    `# Prices are list prices; quantity-tier and account pricing may be lower. Generated daily.`,
    "",
  ];

  let brandNames: Record<number, string> = {};
  try {
    const brands = await getBrands();
    brandNames = Object.fromEntries(brands.map(b => [b.id, b.name]));
  } catch {}

  try {
    const seen = new Set<number>();
    for (let page = 1; page <= 30; page++) {
      const res = await getProducts({ page, limit: 250, is_visible: true });
      for (const p of res.data) {
        if (seen.has(p.id) || !p.price || p.price <= 0) continue;
        seen.add(p.id);
        const slug = p.custom_url?.url
          ? p.custom_url.url.replace(/^\/|\/$/g, "").replace(/\//g, "-").replace(/-{2,}/g, "-").replace(/^-|-$/g, "")
          : `product-${p.id}`;
        const category = SITE_CATEGORY_NAMES[getSiteCategory(p.categories || [])] || "";
        const brand = brandNames[p.brand_id] || "";
        const name = (p.name || "").replace(/\s+/g, " ").trim();
        lines.push(`${p.sku} | ${name} | ${brand} | ${category} | ${p.price.toFixed(2)} | ${base}/product/${slug}`);
      }
      if (page >= res.meta.pagination.total_pages) break;
    }
  } catch {
    lines.push("# (product list temporarily unavailable)");
  }

  return new Response(lines.join("\n") + "\n", { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
