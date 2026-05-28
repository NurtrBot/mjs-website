import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import CleaningBidGuide from "@/components/guides/CleaningBidGuide";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "How to Bid a Cleaning Job | Janitorial Pricing Guide & Calculator",
  description: "Learn how to bid commercial cleaning jobs. Covers square footage pricing, hourly rates, supply costs, profit margins, and walkthrough checklists. Free bidding guide for janitorial businesses.",
  keywords: "how to bid a cleaning job, janitorial bid template, cleaning business pricing, commercial cleaning bid, janitorial pricing per square foot, cleaning job estimate, how to price cleaning services, janitorial contract bidding, cleaning business profit margins",
  openGraph: { type: "article", title: "How to Bid a Cleaning Job — Janitorial Pricing Guide", description: "Complete guide to bidding commercial cleaning jobs with pricing formulas, supply costs, and walkthrough checklist.", url: "https://www.mobilejanitorialsupply.com/guides/how-to-bid-a-cleaning-job", siteName: "Mobile Janitorial Supply" },
  twitter: { card: "summary_large_image", title: "How to Bid a Cleaning Job — Pricing Guide" },
  alternates: { canonical: "https://www.mobilejanitorialsupply.com/guides/how-to-bid-a-cleaning-job" },
};
const jsonLd = { "@context": "https://schema.org", "@type": "Article", headline: "How to Bid a Cleaning Job: Janitorial Pricing Guide", author: { "@type": "Organization", name: "Mobile Janitorial Supply" }, publisher: { "@type": "Organization", name: "Mobile Janitorial Supply" }, datePublished: "2026-05-28", dateModified: "2026-05-28" };
export default function Page() { return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><TopBar /><Header /><CategoryNav /><main><CleaningBidGuide /></main><Footer /></>); }
