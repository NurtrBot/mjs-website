import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import CarpetCleaningGuide from "@/components/guides/CarpetCleaningGuide";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Commercial Carpet Cleaning Guide | Methods, Chemicals & Equipment",
  description: "Complete guide to commercial carpet cleaning: hot water extraction vs bonnet cleaning vs encapsulation. Covers equipment selection, chemical dilution, stain removal, and maintenance schedules.",
  keywords: "commercial carpet cleaning, carpet extraction guide, hot water extraction, bonnet cleaning, carpet shampoo guide, carpet stain removal, commercial carpet maintenance, carpet cleaning chemicals, carpet extractor buying guide",
  openGraph: { type: "article", title: "Commercial Carpet Cleaning Guide — Methods & Equipment", description: "Complete guide to commercial carpet cleaning methods, equipment, and chemicals.", url: "https://www.mobilejanitorialsupply.com/guides/commercial-carpet-cleaning-guide", siteName: "Mobile Janitorial Supply" },
  twitter: { card: "summary_large_image", title: "Commercial Carpet Cleaning Guide" },
  alternates: { canonical: "https://www.mobilejanitorialsupply.com/guides/commercial-carpet-cleaning-guide" },
};
const jsonLd = { "@context": "https://schema.org", "@type": "Article", headline: "Commercial Carpet Cleaning Guide: Methods, Chemicals & Equipment", author: { "@type": "Organization", name: "Mobile Janitorial Supply" }, publisher: { "@type": "Organization", name: "Mobile Janitorial Supply" }, datePublished: "2026-05-28", dateModified: "2026-05-28" };
export default function Page() { return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><TopBar /><Header /><CategoryNav /><main><CarpetCleaningGuide /></main><Footer /></>); }
