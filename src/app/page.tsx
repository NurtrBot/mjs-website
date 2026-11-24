import type { Metadata } from "next";
import HomePage from "@/components/HomePage";

const SITE_URL = "https://www.mobilejanitorialsupply.com";

// Home page metadata lives here (a server component) so the canonical, hreflang
// and Open Graph tags are in the HTML; the interactive page is components/HomePage.
export const metadata: Metadata = {
  title: { absolute: "Mobile Janitorial Supply | #1 Rated Cleaning Products in SoCal" },
  alternates: {
    canonical: SITE_URL,
    languages: {
      en: SITE_URL,
      es: `${SITE_URL}/es`,
      "x-default": SITE_URL,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Mobile Janitorial Supply",
    title: "Mobile Janitorial Supply | #1 Rated Cleaning Products in SoCal",
    description:
      "Southern California's highest-rated janitorial supply company. 10,000+ products at wholesale prices. Free 1-3 day local delivery on orders $399+ (OC, LA, Inland Empire) and $699+ (San Diego).",
    images: [{ url: "/banner-03.jpg", width: 1200, height: 630, alt: "Mobile Janitorial Supply — Wholesale Cleaning Products" }],
  },
};

export default function Home() {
  return <HomePage />;
}
