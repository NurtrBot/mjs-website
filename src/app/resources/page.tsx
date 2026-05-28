import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import ResourcesPage from "@/components/ResourcesPage";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Resources | SDS Sheets, Catalogs & Cleaning Guides",
  description: "Access Safety Data Sheets (SDS), product catalogs, buying guides, and cleaning resources from Mobile Janitorial Supply. Free downloads for facility managers and janitorial teams.",
  keywords: "SDS sheets cleaning chemicals, janitorial product catalog, cleaning supply resources, safety data sheets, MSDS janitorial products",
  alternates: { canonical: "https://www.mobilejanitorialsupply.com/resources" },
};

export default function Resources() {
  return (
    <>
      <TopBar />
      <Header />
      <CategoryNav />
      <main>
        <ResourcesPage />
      </main>
      <Footer />
    </>
  );
}
