import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import JanitorialChecklist from "@/components/JanitorialChecklist";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Janitorial Supply Checklist | Everything Your Cleaning Closet Needs",
  description:
    "Complete janitorial supply checklist for offices, schools, healthcare, restaurants, and more. Covers chemicals, paper products, equipment, trash liners, gloves, and breakroom essentials.",
  keywords:
    "janitorial supply list, cleaning supply checklist, janitorial closet essentials, what every janitor needs, office cleaning supply list, commercial cleaning supplies checklist, facility cleaning checklist, custodian supply list, building maintenance supplies, cleaning cart essentials",
  openGraph: {
    type: "article",
    title: "Janitorial Supply Checklist — Everything Your Cleaning Closet Needs",
    description: "Complete facility cleaning checklist. Never run out of essentials again.",
    url: "https://www.mobilejanitorialsupply.com/guides/janitorial-supply-checklist",
    siteName: "Mobile Janitorial Supply",
  },
  twitter: {
    card: "summary_large_image",
    title: "Janitorial Supply Checklist — Everything Your Cleaning Closet Needs",
    description: "Complete facility cleaning checklist covering every category of janitorial supplies.",
  },
  alternates: {
    canonical: "https://www.mobilejanitorialsupply.com/guides/janitorial-supply-checklist",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Janitorial Supply Checklist: Everything Your Cleaning Closet Needs",
  description: "Complete janitorial supply checklist organized by category and facility type. Covers chemicals, paper, equipment, trash liners, gloves, and breakroom supplies.",
  author: { "@type": "Organization", name: "Mobile Janitorial Supply", url: "https://www.mobilejanitorialsupply.com" },
  publisher: { "@type": "Organization", name: "Mobile Janitorial Supply", url: "https://www.mobilejanitorialsupply.com" },
  datePublished: "2026-05-28",
  dateModified: "2026-05-28",
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://www.mobilejanitorialsupply.com/guides/janitorial-supply-checklist" },
};

export default function JanitorialChecklistPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TopBar />
      <Header />
      <CategoryNav />
      <main><JanitorialChecklist /></main>
      <Footer />
    </>
  );
}
