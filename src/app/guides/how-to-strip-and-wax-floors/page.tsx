import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import FloorCareGuide from "@/components/FloorCareGuide";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "How to Strip and Wax Floors | Step-by-Step Commercial Floor Care Guide",
  description:
    "Complete step-by-step guide to stripping and waxing commercial VCT, vinyl, and tile floors. Covers chemicals, equipment, floor pads, coat counts, and pro tips. Free guide from Mobile Janitorial Supply.",
  keywords:
    "how to strip and wax floors, strip and wax VCT, commercial floor stripping, floor waxing guide, floor finish application, floor care step by step, floor pad color guide, how many coats of floor wax, floor stripper ratio, commercial floor maintenance, VCT floor care, janitorial floor care",
  openGraph: {
    type: "article",
    title: "How to Strip and Wax Floors — Step-by-Step Guide",
    description:
      "Complete commercial floor care guide. Step-by-step stripping and waxing process with equipment list, chemical ratios, and floor pad color chart.",
    url: "https://www.mobilejanitorialsupply.com/guides/how-to-strip-and-wax-floors",
    siteName: "Mobile Janitorial Supply",
    images: [
      {
        url: "/images/og-floor-care-guide.png",
        width: 1200,
        height: 630,
        alt: "How to Strip and Wax Commercial Floors — Step-by-Step Guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Strip and Wax Floors — Step-by-Step Guide",
    description:
      "Complete commercial floor care guide with step-by-step process, equipment list, and pro tips.",
    images: ["/images/og-floor-care-guide.png"],
  },
  alternates: {
    canonical: "https://www.mobilejanitorialsupply.com/guides/how-to-strip-and-wax-floors",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Strip and Wax Commercial Floors",
  description:
    "Complete step-by-step guide to stripping and waxing commercial VCT, vinyl, and tile floors. Covers chemicals, equipment, floor pads, coat counts, and professional tips.",
  image: "https://www.mobilejanitorialsupply.com/images/og-floor-care-guide.png",
  totalTime: "PT4H",
  estimatedCost: {
    "@type": "MonetaryAmount",
    currency: "USD",
    value: "50-200",
  },
  supply: [
    { "@type": "HowToSupply", name: "Floor stripper" },
    { "@type": "HowToSupply", name: "Floor finish / wax" },
    { "@type": "HowToSupply", name: "Neutralizer rinse" },
    { "@type": "HowToSupply", name: "Black stripping pads" },
    { "@type": "HowToSupply", name: "Red buffing pads" },
    { "@type": "HowToSupply", name: "Mop and bucket" },
    { "@type": "HowToSupply", name: "Wet floor signs" },
  ],
  tool: [
    { "@type": "HowToTool", name: "Floor machine (17-20 inch)" },
    { "@type": "HowToTool", name: "Wet/dry vacuum" },
    { "@type": "HowToTool", name: "Mop bucket with wringer" },
    { "@type": "HowToTool", name: "Flat mop or finish mop" },
  ],
  step: [
    { "@type": "HowToStep", name: "Prep the area", text: "Clear furniture, sweep, and post wet floor signs." },
    { "@type": "HowToStep", name: "Apply stripper", text: "Dilute floor stripper and apply to floor in sections." },
    { "@type": "HowToStep", name: "Scrub with floor machine", text: "Use a floor machine with black stripping pad to agitate and remove old finish." },
    { "@type": "HowToStep", name: "Vacuum slurry", text: "Pick up all stripped residue with a wet/dry vacuum." },
    { "@type": "HowToStep", name: "Rinse and neutralize", text: "Mop with neutralizer rinse to remove chemical residue and restore pH." },
    { "@type": "HowToStep", name: "Apply finish coats", text: "Apply 3-5 thin, even coats of floor finish, allowing each coat to dry." },
    { "@type": "HowToStep", name: "Buff to shine", text: "After final coat dries, buff with a red pad for a high-gloss finish." },
  ],
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
};

export default function FloorCareGuidePage() {
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
        <FloorCareGuide />
      </main>
      <Footer />
    </>
  );
}
