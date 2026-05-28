import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import HealthcarePage from "@/components/industries/HealthcarePage";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Healthcare & Medical Facility Cleaning Supplies | EPA-Registered",
  description: "Infection control supplies for healthcare facilities: EPA-registered disinfectants, nitrile exam gloves, N95 respirators, hand soap, paper products, and biohazard waste liners. Wholesale pricing.",
  keywords: "healthcare cleaning supplies, medical facility janitorial, hospital disinfectant, exam gloves wholesale, infection control supplies, EPA registered disinfectant, medical waste liners",
  openGraph: { type: "article", title: "Healthcare & Medical Facility Cleaning Supplies | EPA-Registered", description: "Infection control supplies for healthcare facilities at wholesale pricing.", url: "https://www.mobilejanitorialsupply.com/industries/healthcare", siteName: "Mobile Janitorial Supply" },
  twitter: { card: "summary_large_image", title: "Healthcare & Medical Facility Cleaning Supplies" },
  alternates: { canonical: "https://www.mobilejanitorialsupply.com/industries/healthcare" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Healthcare & Medical Facility Cleaning Supplies",
  description: "Infection control supplies for healthcare facilities at wholesale pricing.",
  publisher: { "@type": "Organization", name: "Mobile Janitorial Supply" },
  url: "https://www.mobilejanitorialsupply.com/industries/healthcare",
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TopBar />
      <Header />
      <CategoryNav />
      <main><HealthcarePage /></main>
      <Footer />
    </>
  );
}
