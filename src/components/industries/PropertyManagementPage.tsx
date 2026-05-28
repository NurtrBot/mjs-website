"use client";

import {
  ChevronRight,
  ArrowRight,
  Check,
  Building2,
  ShieldCheck,
  Truck,
  DollarSign,
  UserCheck,
  Sparkles,
  SprayCan,
  BookOpen,
  Layers,
  Wind,
} from "lucide-react";
import Link from "next/link";

/* ─────────────────────────── Data ─────────────────────────── */

interface Product {
  name: string;
  why: string;
  slug: string;
}

interface ProductArea {
  area: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  products: Product[];
}

const PRODUCT_AREAS: ProductArea[] = [
  {
    area: "Unit Turnover",
    icon: <SprayCan className="w-5 h-5" />,
    color: "text-orange-700",
    bgColor: "bg-orange-50",
    products: [
      {
        name: "Window Cleaner Concentrate 50:1",
        why: "One gallon makes 50 gallons of streak-free glass cleaner -- huge savings on turnovers",
        slug: "window-cleaner-concentrate-50-1",
      },
      {
        name: "Lift Out Carpet Spot Remover (Gal)",
        why: "Eliminates pet stains, food spills, and traffic marks before new tenants move in",
        slug: "chemcor-lift-out-carpet-spot-remover-gallon-30801",
      },
      {
        name: "OdorZyme Plus Odor Eliminator (Gal)",
        why: "Enzyme-based formula destroys pet odor, smoke, and cooking smells at the source",
        slug: "janitors-finest-odorzyme-plus-odor-eliminator-spotter-gallon-31801ea",
      },
    ],
  },
  {
    area: "Common Areas",
    icon: <Building2 className="w-5 h-5" />,
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    products: [
      {
        name: "Strike Bac Lemon Disinfectant Cleaner (Gal)",
        why: "EPA-registered disinfectant for lobbies, hallways, laundry rooms, and gyms",
        slug: "strike-bac-lemon-odor-disinfectant-cleaner-gallon-91101ea",
      },
      {
        name: "Clear Can Liners 40-45 Gal (250/cs)",
        why: "Heavy-duty liners for dumpster areas, common room trash cans, and recycling bins",
        slug: "janitors-finest-can-liners-clear-40-x-48-14-micron-40-45-gallon-250-cs-cl404814",
      },
    ],
  },
  {
    area: "Restrooms & Paper",
    icon: <Layers className="w-5 h-5" />,
    color: "text-green-700",
    bgColor: "bg-green-50",
    products: [
      {
        name: "Premium 2-Ply Multifold Towels (4,000/cs)",
        why: "For clubhouse restrooms, pool areas, and leasing office bathrooms",
        slug: "janitors-finest-5300-premium-2-ply-white-multifold-towels-16-packs-250-sheets-4000-towels",
      },
      {
        name: "2-Ply Toilet Tissue (96 rolls/cs)",
        why: "Bulk case keeps common-area restrooms stocked with fewer reorders",
        slug: "janitors-finest-2-ply-toilet-tissue-4-3-x-3-5-500-sheets-per-roll-96-rolls-per-case-5602",
      },
    ],
  },
];

const GUIDES = [
  {
    title: "Commercial Carpet Cleaning Guide",
    description: "Spot treatment, extraction, and maintenance schedules for apartment hallways and units.",
    slug: "commercial-carpet-cleaning-guide",
  },
  {
    title: "Cleaning Chemical Dilution Chart",
    description: "Get the right mix every time -- save money and avoid damage from over-concentrated chemicals.",
    slug: "cleaning-chemical-dilution-chart",
  },
  {
    title: "Janitorial Supply Checklist",
    description: "Complete checklist so your maintenance team never runs out of essential supplies.",
    slug: "janitorial-supply-checklist",
  },
];

const VALUE_PROPS = [
  {
    icon: <DollarSign className="w-6 h-6" />,
    title: "Wholesale Pricing",
    description: "Property-management-grade supplies at true wholesale. No markup, no membership fees.",
  },
  {
    icon: <Truck className="w-6 h-6" />,
    title: "Free Local Delivery",
    description: "Free 1-3 day delivery across Southern California on qualifying orders.",
  },
  {
    icon: <UserCheck className="w-6 h-6" />,
    title: "Dedicated Account Rep",
    description: "A rep who understands unit turnovers, seasonal demand, and multi-property logistics.",
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Price Match Guarantee",
    description: "Find a lower price from a local competitor? We will match it.",
  },
];

/* ─────────────────────────── Component ─────────────────────────── */

export default function PropertyManagementPage() {
  return (
    <section className="bg-white min-h-screen">
      {/* ── Hero ── */}
      <div className="bg-gradient-to-br from-mjs-dark via-mjs-charcoal to-mjs-dark">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
          <nav className="flex items-center justify-center gap-2 text-xs text-mjs-gray-400 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">Industries</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-mjs-red">Property Management</span>
          </nav>

          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-mjs-red/10 border border-mjs-red/20 text-mjs-red px-3 py-1.5 rounded-full text-xs font-semibold mb-4 uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5" />
              Industry Solutions
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
              Property Management
            </h1>
            <p className="text-lg md:text-xl text-mjs-gray-300 leading-relaxed max-w-2xl mx-auto">
              Unit turnover supplies, common area maintenance, carpet spotters, odor eliminators,
              and paper products for apartment complexes and property managers at wholesale prices.
            </p>
          </div>
        </div>
      </div>

      {/* ── Essential Supplies ── */}
      <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-4xl font-extrabold text-mjs-dark mb-3">
            Essential Property Management Supplies
          </h2>
          <p className="text-mjs-gray-500 text-base md:text-lg max-w-2xl mx-auto">
            From unit turnovers to daily common area maintenance -- everything your team needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCT_AREAS.map((area) => (
            <div key={area.area} className="rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className={`${area.bgColor} px-6 py-4 border-b border-gray-200 flex items-center gap-3`}>
                <div className={`w-8 h-8 rounded-lg bg-white flex items-center justify-center ${area.color}`}>
                  {area.icon}
                </div>
                <h3 className={`text-lg font-bold ${area.color}`}>{area.area}</h3>
              </div>
              <div className="p-4 space-y-2">
                {area.products.map((product) => (
                  <Link
                    key={product.slug}
                    href={`/product/${product.slug}`}
                    className="flex items-center justify-between bg-mjs-gray-50 rounded-lg p-3 border border-gray-100 hover:border-mjs-red/30 hover:shadow-sm transition-all group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-mjs-dark group-hover:text-mjs-red transition-colors">
                        {product.name}
                      </div>
                      <div className="text-xs text-mjs-gray-400 mt-0.5">{product.why}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-mjs-gray-300 group-hover:text-mjs-red transition-colors shrink-0 ml-3" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Recommended Guides ── */}
      <div className="bg-mjs-gray-50 border-y border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-3">
              Recommended Guides
            </h2>
            <p className="text-mjs-gray-500 max-w-2xl mx-auto">
              Free resources to help your maintenance team work faster and spend smarter.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {GUIDES.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md hover:border-mjs-red/30 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-mjs-red/10 text-mjs-red flex items-center justify-center mb-4">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-mjs-dark group-hover:text-mjs-red transition-colors mb-2">
                  {guide.title}
                </h3>
                <p className="text-sm text-mjs-gray-500 leading-relaxed">{guide.description}</p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-mjs-red mt-3">
                  Read Guide <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Why MJS ── */}
      <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-3">
            Why MJS for Property Management
          </h2>
          <p className="text-mjs-gray-500 max-w-2xl mx-auto">
            We supply apartment complexes, HOAs, and property management companies across Southern California.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUE_PROPS.map((prop) => (
            <div key={prop.title} className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-mjs-red/10 text-mjs-red flex items-center justify-center mx-auto mb-4">
                {prop.icon}
              </div>
              <h3 className="text-base font-bold text-mjs-dark mb-2">{prop.title}</h3>
              <p className="text-sm text-mjs-gray-500 leading-relaxed">{prop.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="bg-gradient-to-r from-mjs-red to-mjs-red-dark">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
            Get a Property Management Quote
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Tell us about your properties and we will build a custom supply program with wholesale
            pricing, multi-site delivery, and turnover kits.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/quote"
              className="inline-flex items-center gap-2 bg-white text-mjs-red font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Get a Custom Quote
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white font-bold px-6 py-3 rounded-lg hover:bg-white/20 transition-colors"
            >
              Shop All Products
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
