import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import CatalogsPage from "@/components/CatalogsPage";
import Footer from "@/components/Footer";

export default function Catalogs() {
  return (
    <>
      <TopBar />
      <Header />
      <CategoryNav />
      <main>
        <CatalogsPage />
      </main>
      <Footer />
    </>
  );
}
