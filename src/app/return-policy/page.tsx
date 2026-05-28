import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import ReturnPolicyPage from "@/components/ReturnPolicyPage";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Return Policy",
  description: "Mobile Janitorial Supply return policy. Returns accepted within 7 days of receipt. Details on restocking fees, credit terms, and equipment returns.",
  alternates: { canonical: "https://www.mobilejanitorialsupply.com/return-policy" },
};

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
