import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import ComboShopPage from "@/components/ComboShopPage";
import Footer from "@/components/Footer";

const config = {
  title: "Paper & Restroom",
  subtitle: "Toilet paper, towels, trash liners, hand soaps & restroom essentials",
  categories: ["Paper & Restroom", "Trash Liners", "Cleaning Chemicals"],
  quickFilters: [
    { label: "Paper Towels", subcategories: ["Roll Towels", "Multifolds", "Paper Towels"] },
    { label: "Toilet Tissue", subcategories: ["Toilet Tissue", "Facial Tissue", "Seat Covers"] },
    { label: "Trash Liners", subcategories: ["Can Liners", "High Density Liners", "Low Density Liners", "Compostable Liners"] },
    { label: "Hand Soap", subcategories: ["Hand Soap & Sanitizer"] },
  ],
};

export default function PaperRestroomShop() {
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
