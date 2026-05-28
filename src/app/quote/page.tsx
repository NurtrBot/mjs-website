import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import QuotePage from "@/components/QuotePage";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Request a Quote | Custom Pricing for Bulk & Contract Orders",
  description: "Request a custom quote from Mobile Janitorial Supply. We offer volume discounts, contract pricing, and custom supply programs for businesses of all sizes. Free delivery on qualifying orders.",
  keywords: "janitorial supply quote, bulk cleaning supply pricing, custom janitorial quote, wholesale cleaning contract, volume discount cleaning supplies",
  alternates: { canonical: "https://www.mobilejanitorialsupply.com/quote" },
};

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
