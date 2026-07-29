import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import ShopByWorkspace from "@/components/ShopByWorkspace";
import Footer from "@/components/Footer";

const SITE_URL = "https://www.mobilejanitorialsupply.com";

export const metadata: Metadata = {
  title: "Shop by Workspace | Find Janitorial Supplies for Every Area",
  description:
    "Visually shop janitorial supplies by workspace. Browse restroom, breakroom, office, lobby, and warehouse scenes to find the exact cleaning products, dispensers, paper products, and equipment your facility needs. Free 1-3 day delivery in SoCal.",
  keywords:
    "janitorial supplies by room, restroom supplies, breakroom supplies, office cleaning supplies, warehouse cleaning supplies, facility supplies, commercial cleaning products, visual shopping, shop by workspace",
  openGraph: {
    title: "Shop by Workspace | Mobile Janitorial Supply",
    description:
      "Visually shop janitorial supplies by workspace. Click on items in each scene to find the products you need for every area of your facility.",
    url: `${SITE_URL}/shop-by-workspace`,
    type: "website",
    siteName: "Mobile Janitorial Supply",
  },
  alternates: {
    canonical: `${SITE_URL}/shop-by-workspace`,
  },
};

export default function ShopByWorkspacePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Shop by Workspace",
    description:
      "Visually shop janitorial supplies by workspace — restroom, breakroom, office, lobby, and warehouse.",
    url: `${SITE_URL}/shop-by-workspace`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Shop by Workspace",
          item: `${SITE_URL}/shop-by-workspace`,
        },
      ],
    },
  };

  return (
    <>
      <TopBar />
      <Header />
      <CategoryNav />
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ShopByWorkspace />
      </main>
      <Footer />
    </>
  );
}
