import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import OfficesPage from "@/components/industries/OfficesPage";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Office & Commercial Building Cleaning Supplies | Wholesale",
  description: "Complete janitorial program for offices and commercial buildings. Paper products, cleaning chemicals, trash liners, breakroom supplies, and restroom essentials at wholesale prices.",
  keywords: "office cleaning supplies, commercial building janitorial, office paper products, corporate restroom supplies, office breakroom supplies, building maintenance supplies",
  openGraph: { type: "article", title: "Office & Commercial Building Cleaning Supplies | Wholesale", description: "Complete janitorial program for offices and commercial buildings at wholesale prices.", url: "https://www.mobilejanitorialsupply.com/industries/offices", siteName: "Mobile Janitorial Supply" },
  twitter: { card: "summary_large_image", title: "Office & Commercial Building Cleaning Supplies" },
  alternates: { canonical: "https://www.mobilejanitorialsupply.com/industries/offices" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Office & Commercial Building Cleaning Supplies",
  description: "Complete janitorial program for offices and commercial buildings at wholesale prices.",
  publisher: { "@type": "Organization", name: "Mobile Janitorial Supply" },
  url: "https://www.mobilejanitorialsupply.com/industries/offices",
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TopBar />
      <Header />
      <CategoryNav />
      <main><OfficesPage /></main>
      <Footer />
    </>
  );
}
