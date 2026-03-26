import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import ResourcesPage from "@/components/ResourcesPage";
import Footer from "@/components/Footer";

export default function Resources() {
  return (
    <>
      <TopBar />
      <Header />
      <CategoryNav />
      <main>
        <ResourcesPage />
      </main>
      <Footer />
    </>
  );
}
