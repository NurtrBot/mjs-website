import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import CatalogsPage from "@/components/CatalogsPage";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Product Catalogs | Browse Our Full Line of Janitorial Supplies",
  description: "Download and browse product catalogs from Mobile Janitorial Supply. Full line of cleaning chemicals, paper products, equipment, gloves, packaging, and breakroom supplies.",
  keywords: "janitorial supply catalog, cleaning product catalog, wholesale supply catalog, MJS product catalog",
  alternates: { canonical: "https://www.mobilejanitorialsupply.com/catalogs" },
};

export default function Catalogs() {
  return (
    <>
      <TopBar />
      <Header />
      <CategoryNav />
      <main>
        <CatalogsPage />
      </main>
      <Footer />
    </>
  );
}
