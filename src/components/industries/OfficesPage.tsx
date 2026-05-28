"use client";

import {
  ChevronRight,
  ArrowRight,
  Check,
  Building,
  ShieldCheck,
  Truck,
  DollarSign,
  UserCheck,
  Sparkles,
  Bath,
  BookOpen,
  Layers,
  SprayCan,
  Coffee,
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
    area: "Restroom Essentials",
    icon: <Bath className="w-5 h-5" />,
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    products: [
      {
        name: "Premium 2-Ply Multifold Towels (4,000/cs)",
        why: "Professional appearance with controlled dispensing to reduce waste",
        slug: "janitors-finest-5300-premium-2-ply-white-multifold-towels-16-packs-250-sheets-4000-towels",
      },
      {
        name: "2-Ply Toilet Tissue (96 rolls/cs)",
        why: "Soft 2-ply tissue that keeps employees and visitors comfortable",
        slug: "janitors-finest-2-ply-toilet-tissue-4-3-x-3-5-500-sheets-per-roll-96-rolls-per-case-5602",
      },
      {
        name: "Boxed Facial Tissue 2-Ply (30 boxes/cs)",
        why: "Reception desks, conference rooms, and individual offices",
        slug: "janitors-finest-5701-boxed-facial-tissue-2-ply-white-100-sheets-box-30-cs",
      },
      {
        name: "Pink Cherry Hand Soap (Gal)",
        why: "Pleasant cherry scent that leaves a positive impression on visitors",
        slug: "janitors-finest-25630-pink-cherry-hand-soap",
      },
    ],
  },
  {
    area: "Cleaning Chemicals",
    icon: <SprayCan className="w-5 h-5" />,
    color: "text-green-700",
    bgColor: "bg-green-50",
    products: [
      {
        name: "Lemon Neutral Floor Cleaner (Gal)",
        why: "No-rinse neutral pH formula safe for all hard floor types in offices",
        slug: "janitors-finest-3158-lemon-neutral-floor-cleaner",
      },
      {
        name: "Window Cleaner Concentrate 50:1",
        why: "Streak-free formula for glass doors, partitions, and interior windows",
        slug: "window-cleaner-concentrate-50-1",
      },
      {
        name: "Strike Bac Lemon Disinfectant Cleaner (Gal)",
        why: "EPA-registered disinfectant for high-touch surfaces, break rooms, and restrooms",
        slug: "strike-bac-lemon-odor-disinfectant-cleaner-gallon-91101ea",
      },
    ],
  },
  {
    area: "Waste Management",
    icon: <Layers className="w-5 h-5" />,
    color: "text-violet-700",
    bgColor: "bg-violet-50",
    products: [
      {
        name: "Clear Can Liners 7-10 Gal (1,000/cs)",
        why: "Perfect fit for desk-side wastebaskets -- the most-used liner in any office",
        slug: "janitors-finest-can-liners-clear-24-x-24-6-micron-7-10-gallon-1000-cs-cl242406",
      },
      {
        name: "Clear Can Liners 40-45 Gal (250/cs)",
        why: "For kitchen trash cans, copy rooms, and common area bins",
        slug: "janitors-finest-can-liners-clear-40-x-48-14-micron-40-45-gallon-250-cs-cl404814",
      },
    ],
  },
  {
    area: "Breakroom",
    icon: <Coffee className="w-5 h-5" />,
    color: "text-orange-700",
    bgColor: "bg-orange-50",
    products: [
      {
        name: "Paper Hot Cups 12oz White (1,000/cs)",
        why: "Standard size for office coffee service and hot beverages",
        slug: "paper-hot-cups-12-oz-white-20-cups-sleeve-50-sleeves-carton-sip121000",
      },
      {
        name: "Paper Plates 9\" Coated (1,200/cs)",
        why: "For lunch meetings, team events, and breakroom meals",
        slug: "paper-plates-9-dia-white-coated-100-pack-12-packs-carton-plate91200c",
      },
      {
        name: "2-Ply Dinner Napkins (3,000/cs)",
        why: "Full-size napkins for breakroom and catered meeting lunches",
        slug: "sunnycare-2-ply-1-8-fold-white-dinner-napkin-15-x-17-3000-cs",
      },
    ],
  },
];

const GUIDES = [
  {
    title: "Paper Towel Buying Guide",
    description: "Multifold vs hardwound vs C-fold: which dispensing system is best for your office restrooms.",
    slug: "paper-towel-guide",
  },
  {
    title: "Trash Bag Size Guide",
    description: "Find the right liner for every can in your building -- from desk-side to dumpster.",
    slug: "trash-bag-size-guide",
  },
  {
    title: "Janitorial Supply Checklist",
    description: "Complete checklist so your cleaning crew never misses an essential supply on reorder.",
    slug: "janitorial-supply-checklist",
  },
];

const VALUE_PROPS = [
  {
    icon: <DollarSign className="w-6 h-6" />,
    title: "Wholesale Pricing",
    description: "Office supplies at true wholesale -- no markup, no minimum orders, no membership fees.",
  },
  {
    icon: <Truck className="w-6 h-6" />,
    title: "Free Local Delivery",
    description: "Free 1-3 day delivery across Southern California on qualifying orders.",
  },
  {
    icon: <UserCheck className="w-6 h-6" />,
    title: "Dedicated Account Rep",
    description: "Your own rep who tracks your usage and reminds you before you run out.",
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Price Match Guarantee",
    description: "Find a lower price from a local competitor? We will match it.",
  },
];

/* ─────────────────────────── Component ─────────────────────────── */

export default function OfficesPage() {
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
            <span className="text-mjs-red">Offices</span>
          </nav>

          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-mjs-red/10 border border-mjs-red/20 text-mjs-red px-3 py-1.5 rounded-full text-xs font-semibold mb-4 uppercase tracking-wider">
              <Building className="w-3.5 h-3.5" />
              Industry Solutions
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
              Offices &amp; Commercial Buildings
            </h1>
            <p className="text-lg md:text-xl text-mjs-gray-300 leading-relaxed max-w-2xl mx-auto">
              Paper products, cleaning chemicals, trash liners, breakroom supplies, and restroom
              essentials for offices and commercial buildings at wholesale prices.
            </p>
          </div>
        </div>
      </div>

      {/* ── Essential Supplies ── */}
      <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-4xl font-extrabold text-mjs-dark mb-3">
            Essential Office Supplies
          </h2>
          <p className="text-mjs-gray-500 text-base md:text-lg max-w-2xl mx-auto">
            Organized by area so your building stays stocked. Click any product to view pricing.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
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
              Free resources to help facility managers buy smarter and keep buildings spotless.
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
            Why MJS for Offices
          </h2>
          <p className="text-mjs-gray-500 max-w-2xl mx-auto">
            We supply office buildings, co-working spaces, and corporate campuses across Southern California.
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
            Get an Office Supply Quote
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Tell us about your building and we will build a custom janitorial program with wholesale
            pricing and scheduled deliveries.
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
