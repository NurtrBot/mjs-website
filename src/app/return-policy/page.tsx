import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import ReturnPolicyPage from "@/components/ReturnPolicyPage";
import Footer from "@/components/Footer";

export default function ReturnPolicy() {
  return (
    <>
      <TopBar />
      <Header />
      <CategoryNav />
      <main>
        <ReturnPolicyPage />
      </main>
      <Footer />
    </>
  );
}
