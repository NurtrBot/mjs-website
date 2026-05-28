import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import PrivacyPolicyPage from "@/components/PrivacyPolicyPage";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Mobile Janitorial Supply privacy policy. How we collect, use, and protect your personal information.",
  alternates: { canonical: "https://www.mobilejanitorialsupply.com/privacy-policy" },
};

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
