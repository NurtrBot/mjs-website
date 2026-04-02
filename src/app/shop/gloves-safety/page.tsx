import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import CategoryPage from "@/components/CategoryPage";
import Footer from "@/components/Footer";

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
