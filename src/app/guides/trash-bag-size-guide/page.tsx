import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import TrashBagSizeGuide from "@/components/TrashBagSizeGuide";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Trash Bag Size Guide | Find the Right Liner for Any Can",
  description:
    "Visual trash bag size chart with gallon-to-dimension conversions. Find the perfect trash liner for every can size — from 7-gallon desk bins to 60-gallon rollouts. Free size guide from Mobile Janitorial Supply.",
  keywords:
    "trash bag sizes, trash bag size chart, what size trash bag do I need, trash liner dimensions, garbage bag sizes, can liner size guide, 13 gallon trash bag dimensions, 33 gallon trash bag, 55 gallon trash bag size, commercial trash bags",
  openGraph: {
    type: "article",
    title: "Trash Bag Size Guide — Find the Right Liner for Any Can",
    description:
      "Visual size chart and interactive guide to find the perfect trash bag for every can. Covers 7-gallon to 60-gallon with dimensions, thickness, and pro tips.",
    url: "https://www.mobilejanitorialsupply.com/guides/trash-bag-size-guide",
    siteName: "Mobile Janitorial Supply",
    images: [
      {
        url: "/images/og-trash-bag-size-guide.png",
        width: 1200,
        height: 630,
        alt: "Trash Bag Size Guide — Visual Chart for Every Can Size",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trash Bag Size Guide — Find the Right Liner for Any Can",
    description:
      "Visual size chart to find the perfect trash bag. Covers 7-gallon to 60-gallon with dimensions and pro tips.",
    images: ["/images/og-trash-bag-size-guide.png"],
  },
  alternates: {
    canonical: "https://www.mobilejanitorialsupply.com/guides/trash-bag-size-guide",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Trash Bag Size Guide: Find the Right Liner for Any Can",
  description:
    "Complete visual guide to trash bag sizes with gallon-to-dimension conversions, thickness recommendations, and pro tips for choosing the right trash liner.",
  image: "https://www.mobilejanitorialsupply.com/images/og-trash-bag-size-guide.png",
  author: {
    "@type": "Organization",
    name: "Mobile Janitorial Supply",
    url: "https://www.mobilejanitorialsupply.com",
  },
  publisher: {
    "@type": "Organization",
    name: "Mobile Janitorial Supply",
    url: "https://www.mobilejanitorialsupply.com",
    logo: {
      "@type": "ImageObject",
      url: "https://www.mobilejanitorialsupply.com/MJS-logo-full.png",
    },
  },
  datePublished: "2026-05-27",
  dateModified: "2026-05-27",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://www.mobilejanitorialsupply.com/guides/trash-bag-size-guide",
  },
};

export default function TrashBagSizeGuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TopBar />
      <Header />
      <CategoryNav />
      <main>
        <TrashBagSizeGuide />
      </main>
      <Footer />
    </>
  );
}
