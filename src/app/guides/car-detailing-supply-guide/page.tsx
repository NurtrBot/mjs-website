import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import CarDetailingGuide from "@/components/CarDetailingGuide";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Car Detailing Supply Guide | Everything You Need to Detail Like a Pro",
  description:
    "Complete car detailing supply checklist and buying guide. Covers wash, decontamination, polish, wax, interior cleaning, glass care, and air fresheners. Build your detailing kit from scratch.",
  keywords:
    "car detailing supplies list, detailing supply checklist, what do you need to detail a car, mobile detailing equipment, car wash supplies, car wax guide, detailing starter kit, auto detailing products, ceramic coating supplies, car interior cleaning supplies",
  openGraph: {
    type: "article",
    title: "Car Detailing Supply Guide — Everything You Need",
    description: "Complete detailing supply checklist. Build your kit from wash to wax with pro-grade products.",
    url: "https://www.mobilejanitorialsupply.com/guides/car-detailing-supply-guide",
    siteName: "Mobile Janitorial Supply",
  },
  twitter: {
    card: "summary_large_image",
    title: "Car Detailing Supply Guide — Everything You Need",
    description: "Complete car detailing supply checklist and buying guide for beginners to pros.",
  },
  alternates: {
    canonical: "https://www.mobilejanitorialsupply.com/guides/car-detailing-supply-guide",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Car Detailing Supply Guide: Everything You Need to Detail Like a Pro",
  description: "Complete car detailing supply checklist covering wash, polish, wax, interior cleaning, glass care, and air fresheners.",
  author: { "@type": "Organization", name: "Mobile Janitorial Supply", url: "https://www.mobilejanitorialsupply.com" },
  publisher: { "@type": "Organization", name: "Mobile Janitorial Supply", url: "https://www.mobilejanitorialsupply.com" },
  datePublished: "2026-05-28",
  dateModified: "2026-05-28",
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://www.mobilejanitorialsupply.com/guides/car-detailing-supply-guide" },
};

export default function CarDetailingGuidePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TopBar />
      <Header />
      <CategoryNav />
      <main><CarDetailingGuide /></main>
      <Footer />
    </>
  );
}
