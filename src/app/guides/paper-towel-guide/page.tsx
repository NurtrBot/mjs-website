import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import PaperTowelGuide from "@/components/PaperTowelGuide";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Paper Towel Guide | C-Fold vs Multifold vs Roll Towels — Which to Choose",
  description:
    "Complete guide to commercial paper towels: C-fold vs multifold vs hardwound roll towels. Covers dispenser compatibility, cost per towel, sheet sizes, and the best fit for your facility.",
  keywords:
    "c-fold vs multifold towels, commercial paper towels, paper towel dispenser types, hardwound roll towels, c-fold paper towels, multifold towels, center pull towels, commercial restroom towels, paper towel cost comparison, what paper towels fit my dispenser",
  openGraph: {
    type: "article",
    title: "Paper Towel Guide — C-Fold vs Multifold vs Roll Towels",
    description:
      "Side-by-side comparison of commercial paper towel types. Dispenser compatibility, cost per towel, and facility recommendations.",
    url: "https://www.mobilejanitorialsupply.com/guides/paper-towel-guide",
    siteName: "Mobile Janitorial Supply",
  },
  twitter: {
    card: "summary_large_image",
    title: "Paper Towel Guide — C-Fold vs Multifold vs Roll Towels",
    description: "Complete guide to choosing the right commercial paper towels for your facility.",
  },
  alternates: {
    canonical: "https://www.mobilejanitorialsupply.com/guides/paper-towel-guide",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Paper Towel Guide: C-Fold vs Multifold vs Roll Towels",
  description: "Complete guide to commercial paper towel types with dispenser compatibility, cost comparison, and facility recommendations.",
  author: { "@type": "Organization", name: "Mobile Janitorial Supply", url: "https://www.mobilejanitorialsupply.com" },
  publisher: { "@type": "Organization", name: "Mobile Janitorial Supply", url: "https://www.mobilejanitorialsupply.com" },
  datePublished: "2026-05-28",
  dateModified: "2026-05-28",
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://www.mobilejanitorialsupply.com/guides/paper-towel-guide" },
};

export default function PaperTowelGuidePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TopBar />
      <Header />
      <CategoryNav />
      <main><PaperTowelGuide /></main>
      <Footer />
    </>
  );
}
