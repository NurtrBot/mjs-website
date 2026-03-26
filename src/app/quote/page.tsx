import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import QuotePage from "@/components/QuotePage";
import Footer from "@/components/Footer";

export default function Quote() {
  return (
    <>
      <TopBar />
      <Header />
      <CategoryNav />
      <main>
        <QuotePage />
      </main>
      <Footer />
    </>
  );
}
