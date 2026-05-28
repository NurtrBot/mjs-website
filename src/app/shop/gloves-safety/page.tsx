import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import CategoryPage from "@/components/CategoryPage";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Gloves & Safety | Nitrile, Vinyl & Latex Gloves + PPE",
  description: "Disposable gloves at wholesale: nitrile, vinyl, and latex in S-XL. Plus face masks, N95 respirators, aprons, shoe covers, and safety PPE. Free local delivery.",
  alternates: { canonical: "https://www.mobilejanitorialsupply.com/category/gloves-safety" },
};

export default function GlovesSafetyShop() {
  return (
    <>
      <TopBar />
      <Header />
      <CategoryNav />
      <main>
        <CategoryPage slug="gloves-safety" />
      </main>
      <Footer />
    </>
  );
}
