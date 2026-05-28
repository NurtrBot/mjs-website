import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import SoapDispenserGuide from "@/components/guides/SoapDispenserGuide";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Soap & Dispenser Guide | Foam vs Liquid, Manual vs Automatic",
  description: "Complete guide to commercial soap dispensers: foam vs liquid soap, manual vs automatic, wall-mount vs countertop. Covers capacity, refill types, cost per wash, and ADA compliance.",
  keywords: "soap dispenser types, foam vs liquid soap dispenser, commercial soap dispenser, automatic soap dispenser, wall mount soap dispenser, best soap dispenser for office, bulk soap dispenser, touchless soap dispenser, soap dispenser buying guide",
  openGraph: { type: "article", title: "Soap & Dispenser Guide — Foam vs Liquid, Manual vs Auto", description: "Complete buying guide for commercial soap dispensers with cost comparison and facility recommendations.", url: "https://www.mobilejanitorialsupply.com/guides/soap-dispenser-guide", siteName: "Mobile Janitorial Supply" },
  twitter: { card: "summary_large_image", title: "Soap & Dispenser Guide" },
  alternates: { canonical: "https://www.mobilejanitorialsupply.com/guides/soap-dispenser-guide" },
};
const jsonLd = { "@context": "https://schema.org", "@type": "Article", headline: "Soap & Dispenser Guide: Foam vs Liquid, Manual vs Automatic", author: { "@type": "Organization", name: "Mobile Janitorial Supply" }, publisher: { "@type": "Organization", name: "Mobile Janitorial Supply" }, datePublished: "2026-05-28", dateModified: "2026-05-28" };
export default function Page() { return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><TopBar /><Header /><CategoryNav /><main><SoapDispenserGuide /></main><Footer /></>); }
