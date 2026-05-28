import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import ShippingSuppliesGuide from "@/components/guides/ShippingSuppliesGuide";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Shipping & Packaging Supply Guide | Bubble Wrap, Tape & Packing Materials",
  description: "Complete guide to shipping and packaging supplies: bubble wrap sizes, packing tape types, packing peanuts, steel strapping, and void fill. Cost-effective solutions for e-commerce, warehouses, and shipping departments.",
  keywords: "shipping supplies guide, bubble wrap sizes, packing tape types, packing peanuts, shipping materials, packaging supplies list, e-commerce shipping supplies, void fill options, steel strapping guide, bubble wrap vs packing peanuts",
  openGraph: { type: "article", title: "Shipping & Packaging Supply Guide", description: "Complete guide to shipping supplies: bubble wrap, tape, packing peanuts, and more.", url: "https://www.mobilejanitorialsupply.com/guides/shipping-supplies-guide", siteName: "Mobile Janitorial Supply" },
  twitter: { card: "summary_large_image", title: "Shipping & Packaging Supply Guide" },
  alternates: { canonical: "https://www.mobilejanitorialsupply.com/guides/shipping-supplies-guide" },
};
const jsonLd = { "@context": "https://schema.org", "@type": "Article", headline: "Shipping & Packaging Supply Guide: Bubble Wrap, Tape & Packing Materials", author: { "@type": "Organization", name: "Mobile Janitorial Supply" }, publisher: { "@type": "Organization", name: "Mobile Janitorial Supply" }, datePublished: "2026-05-28", dateModified: "2026-05-28" };
export default function Page() { return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><TopBar /><Header /><CategoryNav /><main><ShippingSuppliesGuide /></main><Footer /></>); }
