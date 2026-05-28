import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import DilutionChartGuide from "@/components/DilutionChartGuide";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Cleaning Chemical Dilution Chart | Ratios for Every Product",
  description:
    "Free dilution ratio chart for commercial cleaning chemicals. Covers degreasers, disinfectants, floor strippers, glass cleaners, carpet shampoo, and more. Printable reference guide from Mobile Janitorial Supply.",
  keywords:
    "cleaning chemical dilution chart, dilution ratio chart, how to dilute cleaning chemicals, degreaser dilution ratio, disinfectant dilution ratio, floor stripper dilution, bleach dilution chart, chemical mixing ratios, janitorial chemical dilution, ounces per gallon chart",
  openGraph: {
    type: "article",
    title: "Cleaning Chemical Dilution Chart — Ratios for Every Product",
    description:
      "Complete dilution ratio reference for commercial cleaning chemicals. Ounces-per-gallon conversion, product-specific ratios, and safety tips.",
    url: "https://www.mobilejanitorialsupply.com/guides/cleaning-chemical-dilution-chart",
    siteName: "Mobile Janitorial Supply",
    images: [
      {
        url: "/images/og-dilution-chart.png",
        width: 1200,
        height: 630,
        alt: "Cleaning Chemical Dilution Chart — Complete Ratio Guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cleaning Chemical Dilution Chart — Ratios for Every Product",
    description:
      "Complete dilution ratio reference for commercial cleaning chemicals with ounces-per-gallon conversion.",
    images: ["/images/og-dilution-chart.png"],
  },
  alternates: {
    canonical: "https://www.mobilejanitorialsupply.com/guides/cleaning-chemical-dilution-chart",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Cleaning Chemical Dilution Chart: Ratios for Every Product",
  description:
    "Complete dilution ratio reference chart for commercial cleaning chemicals. Covers degreasers, disinfectants, floor strippers, glass cleaners, carpet shampoo, bleach, and more.",
  image: "https://www.mobilejanitorialsupply.com/images/og-dilution-chart.png",
  author: {
    "@type": "Organization",
    name: "Mobile Janitorial Supply",
    url: "https://www.mobilejanitorialsupply.com",
  },
  publisher: {
    "@type": "Organization",
    name: "Mobile Janitorial Supply",
    url: "https://www.mobilejanitorialsupply.com",
    logo: {
      "@type": "ImageObject",
      url: "https://www.mobilejanitorialsupply.com/MJS-logo-full.png",
    },
  },
  datePublished: "2026-05-27",
  dateModified: "2026-05-27",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://www.mobilejanitorialsupply.com/guides/cleaning-chemical-dilution-chart",
  },
};

export default function DilutionChartGuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TopBar />
      <Header />
      <CategoryNav />
      <main>
        <DilutionChartGuide />
      </main>
      <Footer />
    </>
  );
}
