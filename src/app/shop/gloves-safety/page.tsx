import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import ComboShopPage from "@/components/ComboShopPage";
import Footer from "@/components/Footer";

const config = {
  title: "Gloves & Safety",
  subtitle: "Nitrile, latex, vinyl gloves & PPE safety supplies",
  categories: ["Gloves & Safety"],
  quickFilters: [
    { label: "Nitrile", subcategories: ["Nitrile Gloves"] },
    { label: "Latex", subcategories: ["Latex Gloves"] },
    { label: "Vinyl", subcategories: ["Vinyl Gloves"] },
    { label: "Safety & PPE", subcategories: ["Safety Equipment", "Gloves", "Bouffant Caps", "Shoe Covers"] },
  ],
};

export default function GlovesSafetyShop() {
  return (
    <>
      <TopBar />
      <Header />
      <CategoryNav />
      <main>
        <ComboShopPage config={config} />
      </main>
      <Footer />
    </>
  );
}
