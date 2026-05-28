import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import CategoryPage from "@/components/CategoryPage";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Equipment & Tools | Mops, Brooms, Vacuums, Floor Machines & More",
  description: "Commercial janitorial equipment: floor machines, wet/dry vacuums, mops & buckets, brooms, dust mops, spray bottles, microfiber systems, and carpet extractors. Wholesale prices.",
  alternates: { canonical: "https://www.mobilejanitorialsupply.com/category/equipment" },
};

export default function EquipmentToolsShop() {
  return (
    <>
      <TopBar />
      <Header />
      <CategoryNav />
      <main>
        <CategoryPage slug="equipment" />
      </main>
      <Footer />
    </>
  );
}
