import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import ProductDetailPage, { type ReviewData } from "@/components/ProductDetailPage";
import Footer from "@/components/Footer";
import { getProductBySlug, getCategorySlug } from "@/data/products";
import type { ProductData } from "@/data/product-types";
import { fetchProductForSeo } from "@/lib/fetch-product-for-seo";
import { getProductBySku, getProductReviews } from "@/lib/bigcommerce";
import { transformProduct, loadBrandMap } from "@/lib/products-api";
import { DELIVERY, RETURNS } from "@/lib/business";
import { SITE_CATEGORY_NAMES } from "@/lib/category-map";
import { findFilterForSubcategory, filterSlug } from "@/lib/category-filters";

const SITE_URL = "https://www.mobilejanitorialsupply.com";

/* ─────────────────────────────────────────────────────────────
   getProduct — tries local data first (instant, no API call),
   then falls back to BigCommerce API for products not in local
   data. This ensures EVERY product gets rich metadata.
   ───────────────────────────────────────────────────────────── */
// Product pages are cached and refreshed hourly, so the live BigCommerce lookup below
// costs one request per product per hour rather than one per visitor.
export const revalidate = 3600;

// Live BigCommerce data first (correct category, subcategory, brand and pricing),
// with the bundled snapshot as a fallback if the API is unavailable.
async function getProduct(slug: string): Promise<ProductData | null> {
  const local = getProductBySlug(slug);
  try {
    // When the snapshot knows the SKU, one exact lookup beats the slug heuristics
    let live: ProductData | null = null;
    if (local?.sku) {
      await loadBrandMap();
      const bc = await getProductBySku(local.sku);
      if (bc && bc.price > 0) live = transformProduct(bc);
    }
    if (!live) live = await fetchProductForSeo(slug);
    if (live && (!local || live.sku === local.sku)) {
      // Keep the curated local images/name when they exist; take everything else live
      return local ? { ...live, images: local.images[0]?.startsWith("http") ? local.images : live.images, name: local.name || live.name } : live;
    }
  } catch {}
  return local || null;
}

/* ─────────────────────────────────────────────────────────────
   buildMetadataFromProduct — shared helper that builds rich
   metadata from any ProductData object (local or API-fetched).
   ───────────────────────────────────────────────────────────── */
function buildMetadataFromProduct(product: ProductData, slug: string): Metadata {
  const brandPrefix = product.brand && !product.name.toLowerCase().includes(product.brand.toLowerCase())
    ? `${product.brand} `
    : "";
  const packInName = product.pack && product.name.toLowerCase().includes(product.pack.toLowerCase());
  const packLooksLikeSku = product.pack && /^[A-Z0-9-]+(EA|CT|CS|BX|PK)?$/i.test(product.pack.trim()) && product.pack.trim().toUpperCase() === product.sku.toUpperCase();
  const packSuffix = product.pack && !packInName && !packLooksLikeSku ? ` — ${product.pack}` : "";
  const title = `${brandPrefix}${product.name}${packSuffix}`;

  const priceText = product.price > 0 ? `$${product.price.toFixed(2)}` : "";
  const ratingText = product.rating > 0 ? ` ${product.rating}/5 stars.` : "";
  const highlightText = product.highlights.length > 0
    ? ` ${product.highlights.slice(0, 3).join(". ")}.`
    : "";
  const description = `${priceText ? `${priceText} — ` : ""}${product.name}${product.pack ? ` (${product.pack})` : ""}${product.brand ? ` by ${product.brand}` : ""}.${highlightText}${ratingText} Wholesale pricing with free local delivery in SoCal.`;

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
// Approved reviews, server-rendered so the visible reviews back up the aggregateRating
async function getReviews(product: ProductData | null): Promise<ReviewData[]> {
  if (!product?.sku || product.reviewCount <= 0) return [];
  try {
    const bc = await getProductBySku(product.sku);
    if (!bc) return [];
    const reviews = await getProductReviews(bc.id);
    return reviews.map((r) => ({
      id: r.id, title: r.title, text: r.text, rating: r.rating, name: r.name,
      date: r.date_reviewed || r.date_created,
    }));
  } catch {
    return [];
  }
}

function ProductJsonLd({ slug, product, reviews }: { slug: string; product: ProductData | null; reviews: ReviewData[] }) {
  if (!product) return null;

  const categorySlug = getCategorySlug(product.category);
  const productImage = product.images?.[0] || `${SITE_URL}/banner-03.jpg`;
  const subFilter = findFilterForSubcategory(categorySlug, product.subcategory);

  // Quantity-tier pricing (e.g. 5+, 15+, 25+) as UnitPriceSpecification entries
  const tierPrices = (product.quickBuy || [])
    .filter((t) => t.unitPrice && t.qty > 1)
    .map((t) => ({
      "@type": "UnitPriceSpecification",
      price: t.unitPrice!.toFixed(2),
      priceCurrency: "USD",
      eligibleQuantity: { "@type": "QuantitativeValue", minValue: t.qty, unitText: product.pack || "unit" },
    }));

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.length > 0 ? product.images : [productImage],
    sku: product.sku,
    mpn: product.sku,
    ...(product.brand ? { brand: { "@type": "Brand", name: product.brand } } : {}),
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
      ...(tierPrices.length > 0 ? { priceSpecification: tierPrices } : {}),
      shippingDetails: [
        {
          "@type": "OfferShippingDetails",
          name: "Free local delivery (Orange County, Los Angeles, Inland Empire)",
          shippingDestination: { "@type": "DefinedRegion", addressCountry: "US", addressRegion: "CA" },
          shippingRate: { "@type": "MonetaryAmount", value: 0, currency: "USD" },
          freeShippingThreshold: { "@type": "MonetaryAmount", value: DELIVERY.localMinimum, currency: "USD" },
          deliveryTime: {
            "@type": "ShippingDeliveryTime",
            handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 1, unitCode: "DAY" },
            transitTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 3, unitCode: "DAY" },
          },
        },
        {
          "@type": "OfferShippingDetails",
          name: "Free delivery (San Diego County)",
          shippingDestination: { "@type": "DefinedRegion", addressCountry: "US", addressRegion: "CA" },
          shippingRate: { "@type": "MonetaryAmount", value: 0, currency: "USD" },
          freeShippingThreshold: { "@type": "MonetaryAmount", value: DELIVERY.extendedMinimum, currency: "USD" },
          deliveryTime: {
            "@type": "ShippingDeliveryTime",
            handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 1, unitCode: "DAY" },
            transitTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 3, unitCode: "DAY" },
          },
        },
      ],
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "US",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: RETURNS.windowDays,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/ReturnFeesCustomerResponsibility",
        restockingFee: { "@type": "MonetaryAmount", value: RETURNS.restockingFeePercent, currency: "USD" },
        merchantReturnLink: `${SITE_URL}/return-policy`,
      },
    },
  };

  // Only claim a rating when the reviews themselves are on the page
  if (reviews.length > 0) {
    const avg = Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10;
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: avg.toString(),
      bestRating: "5",
      worstRating: "1",
      reviewCount: reviews.length.toString(),
    };
    jsonLd.review = reviews.slice(0, 10).map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.name || "Verified customer" },
      datePublished: r.date ? new Date(r.date).toISOString().split("T")[0] : undefined,
      reviewBody: r.text,
      name: r.title,
      reviewRating: { "@type": "Rating", ratingValue: r.rating.toString(), bestRating: "5", worstRating: "1" },
    }));
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: SITE_CATEGORY_NAMES[categorySlug] || product.category, item: `${SITE_URL}/category/${categorySlug}` },
      ...(subFilter ? [{ "@type": "ListItem", position: 3, name: subFilter.label, item: `${SITE_URL}/category/${categorySlug}/${filterSlug(subFilter.label)}` }] : []),
      { "@type": "ListItem", position: subFilter ? 4 : 3, name: product.name, item: `${SITE_URL}/product/${slug}` },
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
  const initialProduct = await getProduct(slug);
  const initialReviews = await getReviews(initialProduct);

  return (
    <>
      <ProductJsonLd slug={slug} product={initialProduct} reviews={initialReviews} />
      <TopBar />
      <Header />
      <CategoryNav />
      <main>
        <ProductDetailPage slug={slug} initialProduct={initialProduct} initialReviews={initialReviews} />
      </main>
      <Footer />
    </>
  );
}
