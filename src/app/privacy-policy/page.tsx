import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import PrivacyPolicyPage from "@/components/PrivacyPolicyPage";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <>
      <TopBar />
      <Header />
      <CategoryNav />
      <main>
        <PrivacyPolicyPage />
      </main>
      <Footer />
    </>
  );
}
