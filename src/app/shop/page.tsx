import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import Footer from "@/components/Footer";
import { ChevronRight } from "lucide-react";
import { SITE_CATEGORY_NAMES } from "@/lib/category-map";
import { getQuickFilters, filterSlug } from "@/lib/category-filters";

const SITE_URL = "https://www.mobilejanitorialsupply.com";

export const metadata: Metadata = {
  title: "Shop All Categories | Mobile Janitorial Supply",
  description:
    "Browse every janitorial supply category: paper products, cleaning chemicals, trash liners, gloves & safety, packaging, breakroom, equipment, floor care and car detailing. Wholesale prices, free local delivery in Southern California.",
  alternates: { canonical: `${SITE_URL}/shop` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/shop`,
    title: "Shop All Categories | Mobile Janitorial Supply",
    description: "Every janitorial supply category at wholesale prices. Free 1-3 day local delivery in Southern California.",
    siteName: "Mobile Janitorial Supply",
  },
};

const CATEGORY_BLURBS: Record<string, string> = {
  "paper-products": "Roll and multifold towels, toilet tissue, facial tissue, seat covers and dispensers.",
  "cleaning-chemicals": "Degreasers, disinfectants, all-purpose cleaners, hand soap, floor and carpet chemicals.",
  "trash-liners": "Clear, black, drawstring and compostable can liners from 7 to 60 gallons.",
  "gloves-safety": "Nitrile, vinyl and latex gloves plus masks, aprons and PPE.",
  "packaging-film": "Stretch wrap, bubble wrap, tape, strapping and shipping supplies.",
  breakroom: "Cups, lids, cutlery, plates, napkins and food service disposables.",
  equipment: "Mops, brooms, buckets, vacuums, floor machines, sprayers and dispensers.",
  "floor-care": "Floor pads, bonnets, strippers, finishes and carpet care.",
  "car-detailing": "Wonder Wafers, air fresheners, car wash, protectants and detailing tools.",
};

export default function ShopIndex() {
  const slugs = Object.keys(SITE_CATEGORY_NAMES);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Shop All Categories",
    url: `${SITE_URL}/shop`,
    hasPart: slugs.map(slug => ({
      "@type": "CollectionPage",
      name: SITE_CATEGORY_NAMES[slug],
      url: `${SITE_URL}/category/${slug}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TopBar />
      <Header />
      <CategoryNav />
      <main className="bg-mjs-gray-50 min-h-screen">
        <div className="max-w-[1400px] mx-auto px-4 py-8">
          <nav className="flex items-center gap-2 text-xs text-mjs-gray-400 mb-3" aria-label="Breadcrumb">
            <a href="/" className="hover:text-mjs-red transition-colors">Home</a>
            <span>/</span>
            <span className="text-mjs-dark font-medium">Shop</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-bold text-mjs-dark">Shop All Categories</h1>
          <p className="text-sm text-mjs-gray-500 mt-1 mb-8">
            Wholesale janitorial supplies with free 1-3 day local delivery on qualifying orders across Southern California.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {slugs.map(slug => {
              const filters = getQuickFilters(slug);
              return (
                <section key={slug} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h2 className="text-lg font-bold text-mjs-dark">
                    <a href={`/category/${slug}`} className="hover:text-mjs-red transition-colors inline-flex items-center gap-1">
                      {SITE_CATEGORY_NAMES[slug]}
                      <ChevronRight className="w-4 h-4" />
                    </a>
                  </h2>
                  <p className="text-xs text-mjs-gray-500 mt-1 mb-4">{CATEGORY_BLURBS[slug]}</p>
                  {filters.length > 0 && (
                    <ul className="flex flex-wrap gap-2">
                      {filters.map(f => (
                        <li key={f.label}>
                          <a
                            href={`/category/${slug}/${filterSlug(f.label)}`}
                            className="inline-block text-xs font-medium text-mjs-gray-700 bg-mjs-gray-50 hover:bg-red-50 hover:text-mjs-red border border-gray-100 rounded-full px-3 py-1 transition-colors"
                          >
                            {f.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
