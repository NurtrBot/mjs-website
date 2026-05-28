import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import RestroomCleaningChecklist from "@/components/guides/RestroomCleaningChecklist";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Restroom Cleaning Checklist | Step-by-Step Commercial Restroom Guide",
  description: "Complete commercial restroom cleaning checklist with step-by-step process, supply list, and frequency schedule. Covers toilets, urinals, sinks, mirrors, floors, dispensers, and odor control.",
  keywords: "restroom cleaning checklist, commercial restroom cleaning, bathroom cleaning checklist, restroom supplies list, how to clean commercial restroom, urinal cleaning, restroom maintenance schedule, janitorial restroom checklist",
  openGraph: { type: "article", title: "Restroom Cleaning Checklist — Step-by-Step Guide", description: "Complete restroom cleaning process with checklist, supplies, and maintenance schedule.", url: "https://www.mobilejanitorialsupply.com/guides/restroom-cleaning-checklist", siteName: "Mobile Janitorial Supply" },
  twitter: { card: "summary_large_image", title: "Restroom Cleaning Checklist — Step-by-Step Guide" },
  alternates: { canonical: "https://www.mobilejanitorialsupply.com/guides/restroom-cleaning-checklist" },
};
const jsonLd = { "@context": "https://schema.org", "@type": "HowTo", name: "How to Clean a Commercial Restroom", description: "Step-by-step commercial restroom cleaning process with supply list and frequency schedule.", author: { "@type": "Organization", name: "Mobile Janitorial Supply" }, datePublished: "2026-05-28", dateModified: "2026-05-28" };
export default function Page() { return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><TopBar /><Header /><CategoryNav /><main><RestroomCleaningChecklist /></main><Footer /></>); }
