import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import PortableRestroomPage from "@/components/industries/PortableRestroomPage";
import Footer from "@/components/Footer";

const SITE_URL = "https://www.mobilejanitorialsupply.com";

export const metadata: Metadata = {
  title: "Portable Restroom Supplies | Blue Deodorizers, Toilet Paper, Hand Soap & Towels",
  description:
    "Wholesale portable restroom supplies for operators and service companies. Johnny's Choice Toss-In blue deodorizers, bulk toilet paper, singlefold and multifold paper towels, hand soap, and odor eliminators. Free 1-3 day delivery in SoCal.",
  keywords:
    "portable restroom supplies, porta potty supplies, blue deodorizer, portable toilet chemicals, johnny's choice toss-ins, bulk toilet paper portable restroom, singlefold towels, multifold towels, portable restroom hand soap, portable sanitation supplies, porta potty deodorizer, portable toilet paper wholesale, portable restroom operator supplies, PRO supplies",
  openGraph: {
    type: "article",
    title: "Portable Restroom Supplies | Mobile Janitorial Supply",
    description:
      "Everything portable restroom operators need: blue deodorizers, toilet paper, paper towels, hand soap, and odor control — at wholesale prices with free local delivery.",
    url: `${SITE_URL}/industries/portable-restroom`,
    siteName: "Mobile Janitorial Supply",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portable Restroom Supplies | Wholesale PRO Supplies",
  },
  alternates: {
    canonical: `${SITE_URL}/industries/portable-restroom`,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Portable Restroom Supplies",
  description:
    "Wholesale portable restroom supplies: blue deodorizers, toilet tissue, paper towels, hand soap, and odor eliminators for portable sanitation operators.",
  publisher: { "@type": "Organization", name: "Mobile Janitorial Supply" },
  url: `${SITE_URL}/industries/portable-restroom`,
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Industries", item: `${SITE_URL}/industries` },
      { "@type": "ListItem", position: 3, name: "Portable Restroom Supplies", item: `${SITE_URL}/industries/portable-restroom` },
    ],
  },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TopBar />
      <Header />
      <CategoryNav />
      <main><PortableRestroomPage /></main>
      <Footer />
    </>
  );
}
