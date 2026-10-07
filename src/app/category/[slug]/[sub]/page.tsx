import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import CategoryPage from "@/components/CategoryPage";
import Footer from "@/components/Footer";
import { fetchProductsByCategory } from "@/lib/products-api";
import { categorySeo } from "@/lib/category-seo";
import { findQuickFilter, matchesFilter } from "@/lib/category-filters";

const SITE_URL = "https://www.mobilejanitorialsupply.com";

/* ─────────────────────────────────────────────────────────────
   Subcategory page — /category/<category>/<filter-slug>
   Server-renders only the products in that quick filter so the
   page is a real, crawlable listing with its own title and URL.
   ───────────────────────────────────────────────────────────── */
type Params = Promise<{ slug: string; sub: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug, sub } = await params;
  const seo = categorySeo[slug];
  const found = findQuickFilter(slug, sub);
  if (!seo || !found) return { title: "Not Found" };

  const title = `${found.filter.label} | ${seo.h1} | Mobile Janitorial Supply`;
  const description = `Shop ${found.filter.label.toLowerCase()} in our ${seo.h1.toLowerCase()} department at wholesale prices. Free 1-3 day local delivery on qualifying orders in Southern California.`;
  const url = `${SITE_URL}/category/${slug}/${sub}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", title, description, url, siteName: "Mobile Janitorial Supply" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function SubcategoryRoute({ params }: { params: Params }) {
  const { slug, sub } = await params;
  const seo = categorySeo[slug];
  const found = findQuickFilter(slug, sub);
  if (!seo || !found) notFound();

  let products: Awaited<ReturnType<typeof fetchProductsByCategory>>["products"] = [];
  try {
    products = (await fetchProductsByCategory(slug, 1, 250)).products || [];
  } catch {}

  const url = `${SITE_URL}/category/${slug}/${sub}`;
  const matching = products.filter((p) => matchesFilter(p, found.filter.subcategories));

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: `${found.filter.label} — ${seo.h1}`,
      url,
      isPartOf: { "@type": "CollectionPage", name: seo.h1, url: `${SITE_URL}/category/${slug}` },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: matching.length,
        itemListElement: matching.slice(0, 50).map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: p.name,
          url: `${SITE_URL}/product/${p.slug}`,
        })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: seo.h1, item: `${SITE_URL}/category/${slug}` },
        { "@type": "ListItem", position: 3, name: found.filter.label, item: url },
      ],
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TopBar />
      <Header />
      <CategoryNav />
      <main>
        <CategoryPage slug={slug} initialProducts={products} initialFilter={found.index} />
      </main>
      <Footer />
    </>
  );
}
