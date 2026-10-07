import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import CategoryPage from "@/components/CategoryPage";
import Footer from "@/components/Footer";
import { fetchProductsByCategory } from "@/lib/products-api";
import { categorySeo } from "@/lib/category-seo";
import { getQuickFilters, filterSlug } from "@/lib/category-filters";

const SITE_URL = "https://www.mobilejanitorialsupply.com";

/* ─────────────────────────────────────────────────────────────
   generateMetadata — unique title, description, OpenGraph,
   and keywords for each category page.
   ───────────────────────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const seo = categorySeo[slug];

  if (!seo) {
    const fallbackName = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      title: `${fallbackName} | Mobile Janitorial Supply`,
      description: `Shop ${fallbackName} at wholesale prices. Free 1-3 day local delivery in Southern California.`,
    };
  }

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      type: "website",
      title: seo.title,
      description: seo.description,
      url: `${SITE_URL}/category/${slug}`,
      siteName: "Mobile Janitorial Supply",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
    },
    alternates: {
      canonical: `${SITE_URL}/category/${slug}`,
    },
  };
}

/* ─────────────────────────────────────────────────────────────
   Category JSON-LD — CollectionPage + BreadcrumbList schema.
   Tells Google this is a product listing page with structured
   navigation context.
   ───────────────────────────────────────────────────────────── */
function CategoryJsonLd({ slug, products }: { slug: string; products: { name: string; slug: string }[] }) {
  const seo = categorySeo[slug];
  if (!seo) return null;

  const subPages = getQuickFilters(slug).map((f) => ({
    "@type": "CollectionPage",
    name: f.label,
    url: `${SITE_URL}/category/${slug}/${filterSlug(f.label)}`,
  }));

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: seo.h1,
    description: seo.description,
    url: `${SITE_URL}/category/${slug}`,
    isPartOf: {
      "@type": "WebSite",
      name: "Mobile Janitorial Supply",
      url: SITE_URL,
    },
    ...(subPages.length > 0 ? { hasPart: subPages } : {}),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.slice(0, 50).map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: p.name,
        url: `${SITE_URL}/product/${p.slug}`,
      })),
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: seo.h1,
        item: `${SITE_URL}/category/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   Page Component
   ───────────────────────────────────────────────────────────── */
export default async function CategoryRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Pre-fetch products server-side so first paint has real content (no spinner)
  let initialProducts: Awaited<ReturnType<typeof fetchProductsByCategory>>["products"] = [];
  try {
    const result = await fetchProductsByCategory(slug, 1, 250);
    initialProducts = result.products || [];
  } catch {
    initialProducts = [];
  }

  return (
    <>
      <CategoryJsonLd slug={slug} products={initialProducts} />
      <TopBar />
      <Header />
      <CategoryNav />
      <main>
        <CategoryPage slug={slug} initialProducts={initialProducts} />
      </main>
      <Footer />
    </>
  );
}
