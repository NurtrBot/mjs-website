import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import RespiratorMaskGuide from "@/components/guides/RespiratorMaskGuide";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "N95 & Respirator Guide | N95 vs N100 vs P95 — Which Mask Do You Need",
  description: "Complete guide to respirators and face masks: N95 vs N100 vs P95 vs R95 ratings explained. Covers dust masks, surgical masks, and NIOSH-rated respirators for construction, healthcare, and janitorial use.",
  keywords: "N95 vs N100, respirator guide, N95 mask guide, P95 vs N95, dust mask vs N95, which respirator do I need, 3M respirator guide, face mask types, NIOSH mask ratings, respirator for cleaning chemicals",
  openGraph: { type: "article", title: "N95 & Respirator Guide — Which Mask Do You Need?", description: "Complete guide to N95, N100, P95, and R95 respirators with ratings explained.", url: "https://www.mobilejanitorialsupply.com/guides/respirator-mask-guide", siteName: "Mobile Janitorial Supply" },
  twitter: { card: "summary_large_image", title: "N95 & Respirator Guide — Which Mask Do You Need?" },
  alternates: { canonical: "https://www.mobilejanitorialsupply.com/guides/respirator-mask-guide" },
};
const jsonLd = { "@context": "https://schema.org", "@type": "Article", headline: "N95 & Respirator Guide: Which Mask Do You Need?", author: { "@type": "Organization", name: "Mobile Janitorial Supply" }, publisher: { "@type": "Organization", name: "Mobile Janitorial Supply" }, datePublished: "2026-05-28", dateModified: "2026-05-28" };
export default function Page() { return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><TopBar /><Header /><CategoryNav /><main><RespiratorMaskGuide /></main><Footer /></>); }
