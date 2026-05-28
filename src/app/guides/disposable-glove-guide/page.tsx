import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import GloveBuyingGuide from "@/components/GloveBuyingGuide";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Disposable Glove Guide | Nitrile vs Vinyl vs Latex — Which to Choose",
  description:
    "Complete guide to disposable gloves: nitrile vs vinyl vs latex comparison, sizing chart, thickness ratings, and industry recommendations. Find the right glove for your job.",
  keywords:
    "nitrile vs vinyl vs latex gloves, disposable glove guide, glove size chart, nitrile gloves, vinyl gloves, latex gloves, best disposable gloves, glove thickness mil, exam gloves, industrial gloves, food service gloves, medical gloves",
  openGraph: {
    type: "article",
    title: "Disposable Glove Guide — Nitrile vs Vinyl vs Latex",
    description:
      "Side-by-side comparison of nitrile, vinyl, and latex gloves. Sizing chart, thickness guide, and industry-specific recommendations.",
    url: "https://www.mobilejanitorialsupply.com/guides/disposable-glove-guide",
    siteName: "Mobile Janitorial Supply",
    images: [
      {
        url: "/images/og-glove-guide.png",
        width: 1200,
        height: 630,
        alt: "Disposable Glove Guide — Nitrile vs Vinyl vs Latex Comparison",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Disposable Glove Guide — Nitrile vs Vinyl vs Latex",
    description:
      "Side-by-side comparison of nitrile, vinyl, and latex gloves with sizing chart and industry recommendations.",
    images: ["/images/og-glove-guide.png"],
  },
  alternates: {
    canonical: "https://www.mobilejanitorialsupply.com/guides/disposable-glove-guide",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Disposable Glove Guide: Nitrile vs Vinyl vs Latex — Which to Choose",
  description:
    "Complete guide to choosing the right disposable gloves. Covers nitrile, vinyl, and latex with side-by-side comparison, sizing chart, thickness ratings, and industry-specific recommendations.",
  image: "https://www.mobilejanitorialsupply.com/images/og-glove-guide.png",
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
    "@id": "https://www.mobilejanitorialsupply.com/guides/disposable-glove-guide",
  },
};

export default function GloveGuidePage() {
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
        <GloveBuyingGuide />
      </main>
      <Footer />
    </>
  );
}
