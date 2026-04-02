import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import ComboShopPage from "@/components/ComboShopPage";
import Footer from "@/components/Footer";

const config = {
  title: "Equipment & Tools",
  subtitle: "Mops, buckets, dispensers, vacuums, carts & janitorial gear",
  categories: ["Equipment & Tools"],
  quickFilters: [
    { label: "Dispensers", subcategories: ["Dispensers", "Soap Dispensers", "Towel Dispensers", "Tissue Dispensers", "Seat Cover Dispensers"] },
    { label: "Mops & Brooms", subcategories: ["Mops & Handles", "Brooms & Dustpans", "Buckets & Wringers", "Dusters"] },
    { label: "Vacuums & Machines", subcategories: ["Vacuums", "Carpet Extractors", "Air Movers"] },
    { label: "Carts & Signs", subcategories: ["Carts & Shelving", "Safety Signs", "Window Cleaning", "Squeegees"] },
  ],
};

export default function EquipmentToolsShop() {
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
