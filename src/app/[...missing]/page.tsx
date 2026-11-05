import { permanentRedirect, redirect } from "next/navigation";
import { getProductBySlug } from "@/data/products";
import { fetchProductForSeo } from "@/lib/fetch-product-for-seo";

/*
 * Catch-all for any address that doesn't match a real page. Every real route
 * (static folders like /about, /product/[slug], /category/...) takes precedence,
 * so this only sees paths that would otherwise 404.
 *
 * - Old BigCommerce storefront product URLs lived at the site root
 *   (e.g. /suma-suma-oven-d9-6-oven-cleaner-unscented-1gal-bottle-dvo957278280/).
 *   If the slug still resolves to a visible product, send the visitor there.
 * - Anything else goes to the home page instead of a 404 screen.
 */

// Cache each lookup for a day so repeat hits (and bots) don't re-query BigCommerce.
export const revalidate = 86400;

// Old product slugs are lowercase words joined by hyphens, usually ending in the SKU.
const LOOKS_LIKE_PRODUCT = /^[a-z0-9]+(-[a-z0-9]+){2,}$/;

export default async function MissingPage({
  params,
}: {
  params: Promise<{ missing: string[] }>;
}) {
  const { missing } = await params;

  if (missing.length === 1) {
    const slug = decodeURIComponent(missing[0]).toLowerCase();
    if (LOOKS_LIKE_PRODUCT.test(slug)) {
      // Same order as the product page: bundled catalog first, then BigCommerce
      const product = getProductBySlug(slug) ?? (await fetchProductForSeo(slug));
      if (product?.slug) permanentRedirect(`/product/${product.slug}`);
    }
  }

  redirect("/");
}
