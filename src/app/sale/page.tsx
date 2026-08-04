import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import SalePage from "@/components/SalePage";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Summer Essentials Sale | Caddy Bag $15, Dolly $25, Wet Floor Sign $10",
  description:
    "Limited time sale on janitorial essentials. Yellow Vinyl Caddy Bag $15 (save 56%), 18\" Universal Dolly $25 (save 37%), 24\" Wet Floor Sign $10 (save 23%). Take all three for $50. Sale ends September 1.",
  keywords:
    "janitorial supply sale, caddy bag sale, trash can dolly sale, wet floor sign deal, janitorial bundle deal, cleaning supply discount",
  openGraph: {
    title: "Summer Essentials Sale | Mobile Janitorial Supply",
    description: "Caddy Bag $15, Universal Dolly $25, Wet Floor Sign $10 — or take all three for $50. Sale ends September 1.",
    url: "https://www.mobilejanitorialsupply.com/sale",
    type: "website",
  },
  alternates: {
    canonical: "https://www.mobilejanitorialsupply.com/sale",
  },
};

export default function Page() {
  return (
    <>
      <TopBar />
      <Header />
      <CategoryNav />
      <main><SalePage /></main>
      <Footer />
    </>
  );
}
