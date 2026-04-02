import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import ComboShopPage from "@/components/ComboShopPage";
import Footer from "@/components/Footer";

const config = {
  title: "Cleaning Chemicals",
  subtitle: "Degreasers, disinfectants, floor care chemicals & sanitizers",
  categories: ["Cleaning Chemicals", "Floor Care"],
  quickFilters: [
    { label: "Cleaners & Degreasers", subcategories: ["Degreasers", "All-Purpose Cleaners", "General Cleaners", "Glass Cleaners", "Kitchen Chemicals"] },
    { label: "Disinfectants & Wipes", subcategories: ["Disinfectants", "Wipes", "Bleach", "Restroom Cleaners"] },
    { label: "Floor & Carpet Care", subcategories: ["Floor Care Chemicals", "Carpet Care", "Floor Pads", "Floor Brushes"] },
    { label: "Air Fresheners", subcategories: ["Air Fresheners"] },
  ],
};

export default function CleaningChemicalsShop() {
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
