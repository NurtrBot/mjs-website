import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import ProductDetailPage from "@/components/ProductDetailPage";
import Footer from "@/components/Footer";
import { getProductBySlug, getCategorySlug } from "@/data/products";
import type { ProductData } from "@/data/product-types";
import { fetchProductForSeo } from "@/lib/fetch-product-for-seo";

const SITE_URL = "https://www.mobilejanitorialsupply.com";

/* ─────────────────────────────────────────────────────────────
   getProduct — tries local data first (instant, no API call),
   then falls back to BigCommerce API for products not in local
   data. This ensures EVERY product gets rich metadata.
   ───────────────────────────────────────────────────────────── */
async function getProduct(slug: string): Promise<ProductData | null> {
  // 1. Try local data first (fast, no network)
  const local = getProductBySlug(slug);
  if (local) return local;

  // 2. Fall back to BigCommerce API
  try {
    return await fetchProductForSeo(slug);
  } catch {
    return null;
  }
}

/* ─────────────────────────────────────────────────────────────
   buildMetadataFromProduct — shared helper that builds rich
   metadata from any ProductData object (local or API-fetched).
   ───────────────────────────────────────────────────────────── */
function buildMetadataFromProduct(product: ProductData, slug: string): Metadata {
  const brandPrefix = product.brand && !product.name.toLowerCase().includes(product.brand.toLowerCase())
    ? `${product.brand} `
    : "";
  const packSuffix = product.pack ? ` — ${product.pack}` : "";
  const title = `${brandPrefix}${product.name}${packSuffix}`;

  const priceText = product.price > 0 ? `$${product.price.toFixed(2)}` : "";
  const ratingText = product.rating > 0 ? ` ${product.rating}/5 stars.` : "";
  const highlightText = product.highlights.length > 0
    ? ` ${product.highlights.slice(0, 3).join(". ")}.`
    : "";
  const description = `${priceText ? `${priceText} — ` : ""}${product.name}${product.pack ? ` (${product.pack})` : ""} by ${product.brand}.${highlightText}${ratingText} Wholesale pricing with free local delivery in SoCal.`;

  const productImage = product.images?.[0] || "/banner-03.jpg";

  return {
    title,
    description: description.slice(0, 320),
    keywords: [
      product.name,
      product.brand,
      product.sku,
      product.category,
      product.subcategory,
      product.pack,
      `${product.name} wholesale`,
      `buy ${product.name}`,
    ].filter(Boolean).join(", "),
    openGraph: {
      type: "website",
      title: `${brandPrefix}${product.name}${packSuffix}`,
      description: description.slice(0, 200),
      url: `${SITE_URL}/product/${slug}`,
      siteName: "Mobile Janitorial Supply",
      images: [{ url: productImage, width: 1200, height: 1200, alt: `${product.name} — ${product.brand}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${brandPrefix}${product.name}${packSuffix}`,
      description: description.slice(0, 200),
      images: [productImage],
    },
    alternates: { canonical: `${SITE_URL}/product/${slug}` },
    other: {
      "product:price:amount": product.price.toString(),
      "product:price:currency": "USD",
      "product:availability": product.inStock ? "in stock" : "out of stock",
      "product:brand": product.brand,
      "product:category": product.category,
    },
  };
}

/* ─────────────────────────────────────────────────────────────
   generateMetadata — unique metadata for EVERY product.
   Local data products: instant, no API call.
   BigCommerce products: fetched server-side from BC API.
   ───────────────────────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    // Final fallback — product truly not found anywhere
    const titleFromSlug = slug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      title: titleFromSlug,
      description: `Shop ${titleFromSlug} at wholesale prices from Mobile Janitorial Supply. Free 1-3 day local delivery in Southern California.`,
      alternates: { canonical: `${SITE_URL}/product/${slug}` },
    };
  }

  return buildMetadataFromProduct(product, slug);
}

/* ─────────────────────────────────────────────────────────────
   ProductJsonLd — Product schema + BreadcrumbList for EVERY
   product. Powers Google rich snippets with price, rating,
   availability, and breadcrumbs.
   ───────────────────────────────────────────────────────────── */
async function ProductJsonLd({ slug }: { slug: string }) {
  const product = await getProduct(slug);
  if (!product) return null;

  const categorySlug = getCategorySlug(product.category);
  const productImage = product.images?.[0] || `${SITE_URL}/banner-03.jpg`;

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.length > 0 ? product.images : [productImage],
    sku: product.sku,
    mpn: product.sku,
    brand: { "@type": "Brand", name: product.brand },
    category: product.category,
    url: `${SITE_URL}/product/${slug}`,
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/product/${slug}`,
      priceCurrency: "USD",
      price: product.price.toFixed(2),
      priceValidUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: "Mobile Janitorial Supply" },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "US", addressRegion: ["CA"] },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 1, unitCode: "DAY" },
          transitTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 3, unitCode: "DAY" },
        },
      },
    },
  };

  if (product.rating > 0 && product.reviewCount > 0) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.rating.toString(),
      bestRating: "5",
      worstRating: "1",
      reviewCount: product.reviewCount.toString(),
    };
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: product.category, item: `${SITE_URL}/category/${categorySlug}` },
      { "@type": "ListItem", position: 3, name: product.name, item: `${SITE_URL}/product/${slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   Page Component — unchanged behavior. Local products get
   passed as initialProduct. API products load client-side
   (same as before). The only difference is metadata is now
   rich for ALL products.
   ───────────────────────────────────────────────────────────── */
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const initialProduct = getProductBySlug(slug) || null;

  return (
    <>
      <ProductJsonLd slug={slug} />
      <TopBar />
      <Header />
      <CategoryNav />
      <main>
        <ProductDetailPage slug={slug} initialProduct={initialProduct} />
      </main>
      <Footer />
    </>
  );
}
