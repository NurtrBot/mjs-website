import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import StretchWrapGuide from "@/components/guides/StretchWrapGuide";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Stretch Wrap Guide | Gauge, Width & Hand vs Machine Film Explained",
  description: "Complete stretch wrap buying guide. Understand gauge thickness, hand wrap vs machine wrap, colored film uses, and how to choose the right stretch film for pallets, bundling, and shipping.",
  keywords: "stretch wrap gauge guide, hand wrap vs machine wrap, stretch film thickness, pallet wrap guide, shrink wrap vs stretch wrap, 80 gauge stretch film, bundling film, colored stretch wrap, packaging film guide",
  openGraph: { type: "article", title: "Stretch Wrap Guide — Gauge, Width & Film Types", description: "Everything you need to know about stretch wrap: gauge, width, hand vs machine, and color-coded uses.", url: "https://www.mobilejanitorialsupply.com/guides/stretch-wrap-guide", siteName: "Mobile Janitorial Supply" },
  twitter: { card: "summary_large_image", title: "Stretch Wrap Guide — Gauge, Width & Film Types" },
  alternates: { canonical: "https://www.mobilejanitorialsupply.com/guides/stretch-wrap-guide" },
};
const jsonLd = { "@context": "https://schema.org", "@type": "Article", headline: "Stretch Wrap Guide: Gauge, Width & Hand vs Machine Film Explained", author: { "@type": "Organization", name: "Mobile Janitorial Supply" }, publisher: { "@type": "Organization", name: "Mobile Janitorial Supply" }, datePublished: "2026-05-28", dateModified: "2026-05-28" };
export default function Page() { return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><TopBar /><Header /><CategoryNav /><main><StretchWrapGuide /></main><Footer /></>); }
