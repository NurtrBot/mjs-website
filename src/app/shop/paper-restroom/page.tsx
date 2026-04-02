import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import CategoryPage from "@/components/CategoryPage";
import Footer from "@/components/Footer";

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
