import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import JohnnysChoicePage from "@/components/brands/JohnnysChoicePage";
import Footer from "@/components/Footer";

const SITE = "https://www.mobilejanitorialsupply.com";
const PAGE_URL = `${SITE}/brands/johnnys-choice`;
const OG_IMAGE = `${SITE}/images/johnnys-choice-grand-disks-250.png`;

export const metadata: Metadata = {
  title:
    "Johnny's Choice Toss-Ins & Sensory Grand Disks | Portable Restroom Deodorizer | Mobile Janitorial Supply",
  description:
    "Buy Johnny's Choice Toss-Ins and Sensory Grand Disks at wholesale prices. Professional-grade holding tank deodorizer and extra-fragrance disks for portable restroom operators. In stock in Anaheim, CA — free local delivery across Southern California.",
  keywords:
    "Johnny's Choice, Johnny's Choice Toss-Ins, Johnny's Choice Sensory Grand Disks, portable restroom deodorizer, holding tank deodorizer, porta potty deodorizer, dry toss-in deodorizer, portable sanitation supplies, Johnny's Choice distributor, buy toss-ins wholesale, JC25, JC250, JCD50, JCD250, Sensory Grand Disks, portable toilet deodorizer, porta john deodorizer, holding tank treatment, portable restroom chemicals, Chemcorp Industries",
  openGraph: {
    type: "website",
    title: "Johnny's Choice Toss-Ins & Grand Disks | Wholesale Pricing",
    description:
      "Professional-grade portable restroom deodorizers at wholesale pricing. Toss-Ins and Sensory Grand Disks in stock at Mobile Janitorial Supply, Anaheim CA.",
    url: PAGE_URL,
    siteName: "Mobile Janitorial Supply",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Johnny's Choice Sensory Grand Disks" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Johnny's Choice Toss-Ins & Grand Disks | Wholesale Pricing",
    description:
      "Professional-grade portable restroom deodorizers at wholesale pricing from Mobile Janitorial Supply.",
    images: [OG_IMAGE],
  },
  alternates: {
    canonical: PAGE_URL,
  },
};

/* ── Structured Data ── */

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE },
    { "@type": "ListItem", position: 2, name: "Brands", item: `${SITE}/brands` },
    { "@type": "ListItem", position: 3, name: "Johnny's Choice", item: PAGE_URL },
  ],
};

const orgLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Mobile Janitorial Supply",
  url: SITE,
  logo: `${SITE}/images/mjs-logo.png`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "3066 E. La Palma Ave",
    addressLocality: "Anaheim",
    addressRegion: "CA",
    postalCode: "92806",
    addressCountry: "US",
  },
  telephone: "+17147792640",
};

const seller = { "@type": "Organization", name: "Mobile Janitorial Supply", url: SITE };

const products = [
  {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Johnny's Choice Toss-Ins — Single Case (25 Pouches)",
    sku: "JC25",
    mpn: "JC25",
    brand: { "@type": "Brand", name: "Johnny's Choice", url: "https://www.johnnyschoicetossins.com" },
    description:
      "Pre-measured, water-soluble dry deodorizing pouches for portable restrooms. 25 pouches per case. Professional-grade holding tank deodorizer.",
    image: "https://cdn11.bigcommerce.com/s-wujf5nuxy5/products/201016/images/371410/toss_ins_case__41440.1773175622.1280.1280.png?c=1",
    url: `${SITE}/product/johnny-s-choice-toss-ins`,
    category: "Portable Restroom Supplies > Deodorizers",
    offers: {
      "@type": "Offer",
      price: "24.99",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller,
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "US", addressRegion: ["CA"] },
        deliveryTime: { "@type": "ShippingDeliveryTime", businessDays: { "@type": "QuantitativeValue", minValue: 1, maxValue: 3 } },
      },
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Johnny's Choice Toss-Ins — Bulk Case (250 Pouches)",
    sku: "JC250",
    mpn: "JC250",
    brand: { "@type": "Brand", name: "Johnny's Choice", url: "https://www.johnnyschoicetossins.com" },
    description:
      "High-volume bulk case with 250 pre-measured dry deodorizing pouches for portable restrooms. Best value for fleet operators and high-traffic service routes.",
    image: "https://cdn11.bigcommerce.com/s-wujf5nuxy5/products/201017/images/371413/Case_tossin__61111.1774366101.1280.1280.png?c=1",
    url: `${SITE}/product/johnny-s-choice-toss-ins-aebi`,
    category: "Portable Restroom Supplies > Deodorizers",
    offers: {
      "@type": "Offer",
      price: "114.95",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller,
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Johnny's Choice Sensory Grand Disks — 50 Pack",
    sku: "JCD50",
    mpn: "JCD50",
    brand: { "@type": "Brand", name: "Johnny's Choice", url: "https://www.johnnyschoicetossins.com" },
    description:
      "Extra-fragrance deodorizing disks for enhanced odor control in portable restrooms. 50 disks per case. Hang on a hook or place in a cabinet for long-lasting fragrance.",
    image: `${SITE}/images/johnnys-choice-grand-disks.png`,
    url: `${SITE}/product/johnny-s-choice-sensory-grand-fragrance-disks-50-pack`,
    category: "Portable Restroom Supplies > Deodorizers",
    offers: {
      "@type": "Offer",
      price: "32.99",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller,
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Johnny's Choice Sensory Grand Disks — Bulk Case (250 Disks)",
    sku: "JCD250",
    mpn: "JCD250",
    brand: { "@type": "Brand", name: "Johnny's Choice", url: "https://www.johnnyschoicetossins.com" },
    description:
      "High-volume bulk case of extra-fragrance deodorizing disks for portable restrooms. 250 disks per case. Best value for fleet operators.",
    image: `${SITE}/images/johnnys-choice-grand-disks-250.png`,
    url: `${SITE}/product/johnnys-choice-sensory-grand-fragrance-discs-250-pack`,
    category: "Portable Restroom Supplies > Deodorizers",
    offers: {
      "@type": "Offer",
      price: "149.95",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller,
    },
  },
];

const itemListLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Johnny's Choice Products",
  description: "Complete line of Johnny's Choice portable restroom deodorizers available at wholesale pricing.",
  url: PAGE_URL,
  numberOfItems: products.length,
  itemListElement: products.map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: p.url,
    name: p.name,
  })),
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What are Johnny's Choice Toss-Ins?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Johnny's Choice Toss-Ins are professional-grade, pre-measured dry deodorizing pouches designed for portable restroom holding tanks. Each water-soluble pouch dissolves on contact with water, releasing a powerful odor-neutralizing formula and bold deep-blue color dye. They are manufactured by Chemcorp Industries in Mississauga, Ontario, Canada.",
      },
    },
    {
      "@type": "Question",
      name: "How do you use Johnny's Choice Toss-Ins?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Simply toss one pre-measured pouch into the portable restroom holding tank. The water-soluble pouch dissolves on contact with water — no measuring, mixing, or gloves required. Each pouch provides long-lasting odor control between service stops.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between Toss-Ins and Sensory Grand Disks?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Toss-Ins are dry deodorizing pouches that go directly into the holding tank to neutralize odors and add blue color dye. Sensory Grand Disks are extra-fragrance deodorizing disks that hang on a hook or sit in a small cabinet inside the portable restroom to provide continuous air freshening. Many operators use both together for maximum odor control.",
      },
    },
    {
      "@type": "Question",
      name: "Where can I buy Johnny's Choice Toss-Ins wholesale?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Mobile Janitorial Supply is an authorized Johnny's Choice distributor offering wholesale pricing on all Toss-Ins and Sensory Grand Disks. Orders ship from Anaheim, CA with free 1-3 business day delivery on qualifying orders across Southern California. Visit mobilejanitorialsupply.com/brands/johnnys-choice to shop.",
      },
    },
    {
      "@type": "Question",
      name: "Are Johnny's Choice Toss-Ins biodegradable?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Johnny's Choice Toss-Ins use an eco-conscious formulation that breaks down naturally and is safe for disposal in approved waste systems.",
      },
    },
    {
      "@type": "Question",
      name: "What sizes do Johnny's Choice Toss-Ins come in?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Toss-Ins are available in a single case of 25 pouches (SKU: JC25, $24.99) and a bulk case of 250 pouches (SKU: JC250, $114.95). Sensory Grand Disks come in a 50-count case (SKU: JCD50, $32.99) and a bulk 250-count case (SKU: JCD250, $149.95).",
      },
    },
  ],
};

const webPageLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Johnny's Choice Toss-Ins & Sensory Grand Disks",
  description:
    "Buy Johnny's Choice portable restroom deodorizers at wholesale prices from Mobile Janitorial Supply — authorized distributor.",
  url: PAGE_URL,
  isPartOf: { "@type": "WebSite", name: "Mobile Janitorial Supply", url: SITE },
  about: {
    "@type": "Brand",
    name: "Johnny's Choice",
    url: "https://www.johnnyschoicetossins.com",
  },
  publisher: orgLd,
  breadcrumb: breadcrumbLd,
  mainEntity: itemListLd,
};

const allJsonLd = [webPageLd, breadcrumbLd, faqLd, itemListLd, ...products];

export default function Page() {
  return (
    <>
      {allJsonLd.map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}
      <TopBar />
      <Header />
      <CategoryNav />
      <main>
        <JohnnysChoicePage />
      </main>
      <Footer />
    </>
  );
}
