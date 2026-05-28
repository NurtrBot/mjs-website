import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import RestaurantsPage from "@/components/industries/RestaurantsPage";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Restaurant & Food Service Cleaning Supplies | Wholesale Pricing",
  description: "Complete janitorial supply program for restaurants, cafeterias, and food service. Degreasers, sanitizers, gloves, dish soap, trash liners, paper products, and breakroom disposables at wholesale prices.",
  keywords: "restaurant cleaning supplies, food service janitorial, kitchen degreaser, restaurant sanitizer, food service disposables, commercial kitchen cleaning, restaurant paper products",
  openGraph: { type: "article", title: "Restaurant & Food Service Cleaning Supplies | Wholesale Pricing", description: "Complete janitorial supply program for restaurants, cafeterias, and food service at wholesale prices.", url: "https://www.mobilejanitorialsupply.com/industries/restaurants", siteName: "Mobile Janitorial Supply" },
  twitter: { card: "summary_large_image", title: "Restaurant & Food Service Cleaning Supplies" },
  alternates: { canonical: "https://www.mobilejanitorialsupply.com/industries/restaurants" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Restaurant & Food Service Cleaning Supplies",
  description: "Complete janitorial supply program for restaurants, cafeterias, and food service at wholesale prices.",
  publisher: { "@type": "Organization", name: "Mobile Janitorial Supply" },
  url: "https://www.mobilejanitorialsupply.com/industries/restaurants",
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TopBar />
      <Header />
      <CategoryNav />
      <main><RestaurantsPage /></main>
      <Footer />
    </>
  );
}
