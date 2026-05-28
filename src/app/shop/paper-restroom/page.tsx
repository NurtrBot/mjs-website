import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import CategoryPage from "@/components/CategoryPage";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Paper Products | Commercial Towels, Toilet Tissue & Dispensers",
  description: "Shop bulk paper products at wholesale prices: multifold & roll paper towels, toilet tissue, facial tissue, seat covers, and dispensers. Free local delivery in SoCal.",
  alternates: { canonical: "https://www.mobilejanitorialsupply.com/category/paper-products" },
};

export default function PaperRestroomShop() {
  return (
    <>
      <TopBar />
      <Header />
      <CategoryNav />
      <main>
        <CategoryPage slug="paper-products" />
      </main>
      <Footer />
    </>
  );
}
