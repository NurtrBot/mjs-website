import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import FAQPage from "@/components/FAQPage";
import Footer from "@/components/Footer";

export default function FAQ() {
  return (
    <>
      <TopBar />
      <Header />
      <CategoryNav />
      <main>
        <FAQPage />
      </main>
      <Footer />
    </>
  );
}
