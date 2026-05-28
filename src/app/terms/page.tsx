import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import TermsPage from "@/components/TermsPage";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for purchasing from Mobile Janitorial Supply. Covers ordering, payment, shipping, and liability.",
  alternates: { canonical: "https://www.mobilejanitorialsupply.com/terms" },
};

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
