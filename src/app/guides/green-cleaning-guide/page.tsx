import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import GreenCleaningGuide from "@/components/guides/GreenCleaningGuide";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Green Cleaning Guide | Eco-Friendly Products for Commercial Facilities",
  description: "Complete guide to green cleaning for commercial facilities. Covers eco-friendly chemicals, compostable liners, sustainable paper products, green certifications, and how to build a green cleaning program.",
  keywords: "green cleaning guide, eco-friendly cleaning products, sustainable cleaning, green cleaning program, compostable trash bags, green certified cleaning chemicals, LEED cleaning, environmentally friendly janitorial, green cleaning for schools, sustainable facility management",
  openGraph: { type: "article", title: "Green Cleaning Guide — Eco-Friendly Commercial Cleaning", description: "Complete guide to building a green cleaning program with eco-friendly products and certifications.", url: "https://www.mobilejanitorialsupply.com/guides/green-cleaning-guide", siteName: "Mobile Janitorial Supply" },
  twitter: { card: "summary_large_image", title: "Green Cleaning Guide — Eco-Friendly Commercial Cleaning" },
  alternates: { canonical: "https://www.mobilejanitorialsupply.com/guides/green-cleaning-guide" },
};
const jsonLd = { "@context": "https://schema.org", "@type": "Article", headline: "Green Cleaning Guide: Eco-Friendly Products for Commercial Facilities", author: { "@type": "Organization", name: "Mobile Janitorial Supply" }, publisher: { "@type": "Organization", name: "Mobile Janitorial Supply" }, datePublished: "2026-05-28", dateModified: "2026-05-28" };
export default function Page() { return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><TopBar /><Header /><CategoryNav /><main><GreenCleaningGuide /></main><Footer /></>); }
