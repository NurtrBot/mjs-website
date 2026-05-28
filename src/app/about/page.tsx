import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import AboutPage from "@/components/AboutPage";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About Us | Southern California's #1 Wholesale Janitorial Supplier",
  description: "Mobile Janitorial Supply is a wholesale distributor based in Anaheim, CA serving Orange County, Los Angeles, Inland Empire, and San Diego. 10,000+ products, free local delivery, and unbeatable pricing since day one.",
  keywords: "about Mobile Janitorial Supply, wholesale janitorial distributor, Anaheim janitorial supply, SoCal cleaning supply company, janitorial distributor Orange County",
  alternates: { canonical: "https://www.mobilejanitorialsupply.com/about" },
};

export default function About() {
  return (
    <>
      <TopBar />
      <Header />
      <CategoryNav />
      <main>
        <AboutPage />
      </main>
      <Footer />
    </>
  );
}
