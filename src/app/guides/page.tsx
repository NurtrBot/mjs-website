import type { Metadata } from "next";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Buying Guides & Resources | Free Cleaning & Janitorial Guides",
  description:
    "Free buying guides for janitorial professionals: trash bag sizing, glove comparison, floor care, chemical dilution charts, mop guide, carpet cleaning, respirator ratings, and more. Expert knowledge from Mobile Janitorial Supply.",
  keywords:
    "janitorial buying guides, cleaning supply guides, trash bag size chart, glove comparison guide, floor care guide, chemical dilution chart, commercial cleaning resources, janitorial education",
  openGraph: {
    type: "website",
    title: "Buying Guides & Resources — Mobile Janitorial Supply",
    description: "Free expert guides for janitorial professionals. Sizing charts, product comparisons, how-to guides, and industry checklists.",
    url: "https://www.mobilejanitorialsupply.com/guides",
    siteName: "Mobile Janitorial Supply",
  },
  alternates: { canonical: "https://www.mobilejanitorialsupply.com/guides" },
};

const GUIDES = [
  { title: "Trash Bag Size Guide", description: "Visual chart to find the right liner for every can size — 7 to 60 gallon.", href: "/guides/trash-bag-size-guide", category: "Sizing" },
  { title: "Disposable Glove Guide", description: "Nitrile vs vinyl vs latex — side-by-side comparison with sizing chart.", href: "/guides/disposable-glove-guide", category: "Comparison" },
  { title: "How to Strip & Wax Floors", description: "7-step process with equipment list, pad guide, and finish comparison.", href: "/guides/how-to-strip-and-wax-floors", category: "How-To" },
  { title: "Chemical Dilution Chart", description: "Exact ratios for every cleaning chemical — filterable and searchable.", href: "/guides/cleaning-chemical-dilution-chart", category: "Reference" },
  { title: "Paper Towel Guide", description: "C-fold vs multifold vs roll towels — dispenser compatibility and cost.", href: "/guides/paper-towel-guide", category: "Comparison" },
  { title: "Janitorial Supply Checklist", description: "Complete cleaning closet checklist with monthly estimates by facility.", href: "/guides/janitorial-supply-checklist", category: "Checklist" },
  { title: "Car Detailing Supply Guide", description: "6-stage detailing process with starter kit checklist and pricing tiers.", href: "/guides/car-detailing-supply-guide", category: "How-To" },
  { title: "Stretch Wrap Guide", description: "Gauge, width, hand vs machine film — everything about stretch wrap.", href: "/guides/stretch-wrap-guide", category: "Comparison" },
  { title: "Carpet Cleaning Guide", description: "Methods, equipment tiers, chemical ratios, and stain removal tips.", href: "/guides/commercial-carpet-cleaning-guide", category: "How-To" },
  { title: "Mop Buying Guide", description: "Dust mop vs wet mop vs microfiber — materials, sizes, and care.", href: "/guides/mop-buying-guide", category: "Comparison" },
  { title: "Restroom Cleaning Checklist", description: "Step-by-step restroom cleaning process with supply list and schedules.", href: "/guides/restroom-cleaning-checklist", category: "Checklist" },
  { title: "N95 & Respirator Guide", description: "N95 vs N100 vs P95 — NIOSH ratings explained with task recommendations.", href: "/guides/respirator-mask-guide", category: "Comparison" },
  { title: "Food Service Disposables", description: "Cups, plates, cutlery, and napkins — sizing, materials, and eco options.", href: "/guides/food-service-disposables-guide", category: "Comparison" },
  { title: "How to Bid a Cleaning Job", description: "Pricing formulas, sq ft benchmarks, supply costs, and walkthrough checklist.", href: "/guides/how-to-bid-a-cleaning-job", category: "How-To" },
  { title: "Soap & Dispenser Guide", description: "Foam vs liquid, manual vs automatic — capacity, cost, and ADA compliance.", href: "/guides/soap-dispenser-guide", category: "Comparison" },
  { title: "Shipping Supplies Guide", description: "Bubble wrap sizes, tape types, packing peanuts, and void fill options.", href: "/guides/shipping-supplies-guide", category: "Reference" },
  { title: "Green Cleaning Guide", description: "Eco-friendly products, certifications, cost comparison, and program setup.", href: "/guides/green-cleaning-guide", category: "How-To" },
];

const CATEGORIES = ["All", "Comparison", "How-To", "Checklist", "Reference", "Sizing"];

export default function GuidesIndex() {
  return (
    <>
      <TopBar />
      <Header />
      <CategoryNav />
      <main className="bg-mjs-gray-50 min-h-screen">
        {/* Hero */}
        <div className="bg-gradient-to-br from-mjs-dark via-mjs-charcoal to-mjs-dark">
          <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20 text-center">
            <h1 className="text-3xl md:text-5xl font-black text-white mb-4">
              Buying Guides & Resources
            </h1>
            <p className="text-lg text-mjs-gray-300 max-w-2xl mx-auto">
              Free expert guides to help you choose the right products, save money, and
              keep your facility running smoothly. Written by industry professionals.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {CATEGORIES.map((cat) => (
                <span
                  key={cat}
                  className="px-3 py-1.5 text-xs font-semibold rounded-full bg-white/10 text-white/80 border border-white/10"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-[1400px] mx-auto px-4 py-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {GUIDES.map((guide) => (
              <Link
                key={guide.href}
                href={guide.href}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-mjs-red/30 transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-mjs-red bg-mjs-red/10 px-2 py-0.5 rounded-full">
                    {guide.category}
                  </span>
                  <svg className="w-4 h-4 text-mjs-gray-300 group-hover:text-mjs-red transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <h2 className="text-base font-bold text-mjs-dark group-hover:text-mjs-red transition-colors mb-1">
                  {guide.title}
                </h2>
                <p className="text-xs text-mjs-gray-500 leading-relaxed">
                  {guide.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
