import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import MopBuyingGuide from "@/components/guides/MopBuyingGuide";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Mop Buying Guide | Dust Mop vs Wet Mop vs Microfiber — Which to Choose",
  description: "Complete commercial mop guide: dust mops vs wet mops vs microfiber flat mops. Covers head materials (cotton, rayon, synthetic), sizes, handles, buckets, and the best mop for every floor type.",
  keywords: "commercial mop guide, dust mop vs wet mop, microfiber mop, cotton vs rayon mop head, best mop for commercial floors, mop head sizes, loop end vs cut end mop, mop bucket guide, flat mop vs string mop",
  openGraph: { type: "article", title: "Mop Buying Guide — Dust Mop vs Wet Mop vs Microfiber", description: "Complete guide to choosing the right commercial mop for every floor type.", url: "https://www.mobilejanitorialsupply.com/guides/mop-buying-guide", siteName: "Mobile Janitorial Supply" },
  twitter: { card: "summary_large_image", title: "Mop Buying Guide — Dust Mop vs Wet Mop vs Microfiber" },
  alternates: { canonical: "https://www.mobilejanitorialsupply.com/guides/mop-buying-guide" },
};
const jsonLd = { "@context": "https://schema.org", "@type": "Article", headline: "Mop Buying Guide: Dust Mop vs Wet Mop vs Microfiber", author: { "@type": "Organization", name: "Mobile Janitorial Supply" }, publisher: { "@type": "Organization", name: "Mobile Janitorial Supply" }, datePublished: "2026-05-28", dateModified: "2026-05-28" };
export default function Page() { return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><TopBar /><Header /><CategoryNav /><main><MopBuyingGuide /></main><Footer /></>); }
