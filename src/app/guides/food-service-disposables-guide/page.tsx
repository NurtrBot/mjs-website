import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import FoodServiceGuide from "@/components/guides/FoodServiceGuide";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Food Service Disposables Guide | Cups, Plates, Cutlery & Napkins",
  description: "Complete guide to food service disposables: paper vs plastic cups, plate types, cutlery grades, napkin styles, and food storage. Cost comparison and sizing guide for restaurants, catering, and break rooms.",
  keywords: "food service disposables, restaurant disposable supplies, paper cup sizes, disposable plates guide, plastic cutlery types, commercial napkins, food service supply list, catering supplies, break room supplies guide, paper vs plastic cups",
  openGraph: { type: "article", title: "Food Service Disposables Guide — Cups, Plates & More", description: "Complete buying guide for food service disposables with sizing, cost comparison, and recommendations.", url: "https://www.mobilejanitorialsupply.com/guides/food-service-disposables-guide", siteName: "Mobile Janitorial Supply" },
  twitter: { card: "summary_large_image", title: "Food Service Disposables Guide" },
  alternates: { canonical: "https://www.mobilejanitorialsupply.com/guides/food-service-disposables-guide" },
};
const jsonLd = { "@context": "https://schema.org", "@type": "Article", headline: "Food Service Disposables Guide: Cups, Plates, Cutlery & Napkins", author: { "@type": "Organization", name: "Mobile Janitorial Supply" }, publisher: { "@type": "Organization", name: "Mobile Janitorial Supply" }, datePublished: "2026-05-28", dateModified: "2026-05-28" };
export default function Page() { return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><TopBar /><Header /><CategoryNav /><main><FoodServiceGuide /></main><Footer /></>); }
