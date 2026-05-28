import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import SchoolsPage from "@/components/industries/SchoolsPage";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "School & Education Janitorial Supplies | Budget-Friendly Wholesale",
  description: "Janitorial supplies for schools, universities, and daycares. Disinfectants, paper products, floor care, trash liners, and breakroom supplies at wholesale prices. Free delivery on qualifying orders.",
  keywords: "school janitorial supplies, custodial supplies for schools, school cleaning products, education facility supplies, daycare cleaning supplies, school paper products wholesale",
  openGraph: { type: "article", title: "School & Education Janitorial Supplies | Budget-Friendly Wholesale", description: "Janitorial supplies for schools, universities, and daycares at wholesale prices.", url: "https://www.mobilejanitorialsupply.com/industries/schools", siteName: "Mobile Janitorial Supply" },
  twitter: { card: "summary_large_image", title: "School & Education Janitorial Supplies" },
  alternates: { canonical: "https://www.mobilejanitorialsupply.com/industries/schools" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "School & Education Janitorial Supplies",
  description: "Janitorial supplies for schools, universities, and daycares at wholesale prices.",
  publisher: { "@type": "Organization", name: "Mobile Janitorial Supply" },
  url: "https://www.mobilejanitorialsupply.com/industries/schools",
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TopBar />
      <Header />
      <CategoryNav />
      <main><SchoolsPage /></main>
      <Footer />
    </>
  );
}
