import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import CategoryPage from "@/components/CategoryPage";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Cleaning Chemicals | Wholesale Degreasers, Disinfectants & Floor Care",
  description: "Professional-grade cleaning chemicals at wholesale prices: degreasers, disinfectants, floor strippers & finishes, glass cleaners, hand soap, and carpet care. Free local delivery.",
  alternates: { canonical: "https://www.mobilejanitorialsupply.com/category/cleaning-chemicals" },
};

export default function CleaningChemicalsShop() {
  return (
    <>
      <TopBar />
      <Header />
      <CategoryNav />
      <main>
        <CategoryPage slug="cleaning-chemicals" />
      </main>
      <Footer />
    </>
  );
}
