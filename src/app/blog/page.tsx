import type { Metadata } from "next";
import Script from "next/script";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Blog | Cleaning Tips, Industry News & Product Spotlights",
  description:
    "Expert cleaning tips, industry news, product spotlights, and janitorial best practices from Mobile Janitorial Supply. Stay informed with the latest in commercial cleaning.",
  keywords:
    "janitorial blog, cleaning tips, commercial cleaning blog, janitorial industry news, cleaning product reviews, facility maintenance tips, MJS blog",
  openGraph: {
    type: "website",
    title: "Blog — Mobile Janitorial Supply",
    description: "Expert cleaning tips, industry news, and product spotlights.",
    url: "https://www.mobilejanitorialsupply.com/blog",
    siteName: "Mobile Janitorial Supply",
  },
  alternates: { canonical: "https://www.mobilejanitorialsupply.com/blog" },
};

export default function BlogPage() {
  return (
    <>
      <TopBar />
      <Header />
      <CategoryNav />
      <main className="bg-white min-h-screen">
        <div className="max-w-[1400px] mx-auto px-4 py-8">
          <div id="soro-blog" />
          <Script
            src="https://app.trysoro.com/api/embed/c67b149b-2683-4295-be89-cdcc24181de8"
            strategy="afterInteractive"
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
