import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import WarehousesPage from "@/components/industries/WarehousesPage";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Warehouse & Industrial Cleaning Supplies | Heavy-Duty Wholesale",
  description: "Industrial-strength cleaning supplies for warehouses, manufacturing, and distribution centers. Heavy-duty degreasers, absorbents, large trash liners, PPE, stretch wrap, and floor care at wholesale.",
  keywords: "warehouse cleaning supplies, industrial janitorial, heavy duty degreaser, warehouse trash liners, industrial floor cleaner, warehouse PPE supplies, spill absorbent",
  openGraph: { type: "article", title: "Warehouse & Industrial Cleaning Supplies | Heavy-Duty Wholesale", description: "Industrial-strength cleaning supplies for warehouses, manufacturing, and distribution centers at wholesale.", url: "https://www.mobilejanitorialsupply.com/industries/warehouses", siteName: "Mobile Janitorial Supply" },
  twitter: { card: "summary_large_image", title: "Warehouse & Industrial Cleaning Supplies" },
  alternates: { canonical: "https://www.mobilejanitorialsupply.com/industries/warehouses" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Warehouse & Industrial Cleaning Supplies",
  description: "Industrial-strength cleaning supplies for warehouses, manufacturing, and distribution centers at wholesale.",
  publisher: { "@type": "Organization", name: "Mobile Janitorial Supply" },
  url: "https://www.mobilejanitorialsupply.com/industries/warehouses",
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TopBar />
      <Header />
      <CategoryNav />
      <main><WarehousesPage /></main>
      <Footer />
    </>
  );
}
