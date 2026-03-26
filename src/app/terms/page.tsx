import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import TermsPage from "@/components/TermsPage";
import Footer from "@/components/Footer";

export default function Terms() {
  return (
    <>
      <TopBar />
      <Header />
      <CategoryNav />
      <main>
        <TermsPage />
      </main>
      <Footer />
    </>
  );
}
