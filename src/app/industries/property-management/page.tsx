import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import PropertyManagementPage from "@/components/industries/PropertyManagementPage";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Property Management Cleaning Supplies | Unit Turnover & Common Areas",
  description: "Cleaning supplies for property managers and apartment complexes. Unit turnover kits, common area maintenance, carpet spotters, glass cleaners, and odor eliminators at wholesale prices.",
  keywords: "property management cleaning supplies, apartment turnover cleaning, common area janitorial, property manager supplies, unit turn cleaning kit, apartment complex cleaning",
  openGraph: { type: "article", title: "Property Management Cleaning Supplies | Unit Turnover & Common Areas", description: "Cleaning supplies for property managers and apartment complexes at wholesale prices.", url: "https://www.mobilejanitorialsupply.com/industries/property-management", siteName: "Mobile Janitorial Supply" },
  twitter: { card: "summary_large_image", title: "Property Management Cleaning Supplies" },
  alternates: { canonical: "https://www.mobilejanitorialsupply.com/industries/property-management" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Property Management Cleaning Supplies",
  description: "Cleaning supplies for property managers and apartment complexes at wholesale prices.",
  publisher: { "@type": "Organization", name: "Mobile Janitorial Supply" },
  url: "https://www.mobilejanitorialsupply.com/industries/property-management",
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TopBar />
      <Header />
      <CategoryNav />
      <main><PropertyManagementPage /></main>
      <Footer />
    </>
  );
}
