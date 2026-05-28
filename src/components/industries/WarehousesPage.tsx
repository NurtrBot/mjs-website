"use client";

import {
  ChevronRight,
  ArrowRight,
  Check,
  Warehouse,
  ShieldCheck,
  Truck,
  DollarSign,
  UserCheck,
  Sparkles,
  BookOpen,
  HardHat,
  SprayCan,
  Package,
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
    area: "Heavy-Duty Cleaning",
    icon: <SprayCan className="w-5 h-5" />,
    color: "text-orange-700",
    bgColor: "bg-orange-50",
    products: [
      {
        name: "Orange X-Treme Heavy Duty Degreaser (Gal)",
        why: "Industrial-strength degreaser for dock floors, forklifts, and machinery",
        slug: "janitors-finest-orange-x-treme-heavy-duty-degreaser-gal-80601ea",
      },
      {
        name: "Clear Ammonia",
        why: "Versatile heavy-duty cleaner for concrete floors, walls, and grease traps",
        slug: "clear-ammonia",
      },
      {
        name: "Lemon Neutral Floor Cleaner (Gal)",
        why: "Daily floor maintenance for sealed warehouse and office floors",
        slug: "janitors-finest-3158-lemon-neutral-floor-cleaner",
      },
    ],
  },
  {
    area: "Spill Control & Waste",
    icon: <Package className="w-5 h-5" />,
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    products: [
      {
        name: "All-Purpose Absorbent",
        why: "Instantly absorbs oil, coolant, and chemical spills on warehouse floors",
        slug: "all-purpose-absorbant",
      },
      {
        name: "Clear Can Liners 60 Gal (200/cs)",
        why: "Extra-large 38x60 liners for warehouse drums, large bins, and dock trash cans",
        slug: "janitors-finest-can-liners-clear-38-x-60-14-micron-60-gallon-200-cs-cl386014",
      },
    ],
  },
  {
    area: "PPE & Safety",
    icon: <HardHat className="w-5 h-5" />,
    color: "text-red-700",
    bgColor: "bg-red-50",
    products: [
      {
        name: "Orange Diamond Textured Nitrile Gloves 8mil (100/bx)",
        why: "Extra-thick 8mil nitrile with diamond grip for handling parts, chemicals, and heavy objects",
        slug: "sunnycare-orange-diamond-textured-nitrile-gloves-8-mil-100-per-box-large",
      },
      {
        name: "3M N95 Particulate Respirator 8210 (20/bx)",
        why: "NIOSH-approved dust and particulate protection for warehouse and loading dock workers",
        slug: "3m-particulate-respirator-8210-n95-20-bx",
      },
    ],
  },
  {
    area: "Shipping & Packaging",
    icon: <Truck className="w-5 h-5" />,
    color: "text-violet-700",
    bgColor: "bg-violet-50",
    products: [
      {
        name: "Stretch Wrap Film 18\" x 1500ft 80ga (4/cs)",
        why: "Standard pallet wrap for securing loads -- 4 rolls per carton for hand dispensers",
        slug: "stretch-wrap-film-18-x-1500-x-80-gauge-clear-for-hand-dispenser-4-carton",
      },
    ],
  },
];

const GUIDES = [
  {
    title: "Stretch Wrap Buying Guide",
    description: "Hand vs machine wrap, gauge comparison, and how to calculate wrap cost per pallet.",
    slug: "stretch-wrap-guide",
  },
  {
    title: "Respirator & Mask Guide",
    description: "N95 vs P100 vs half-face respirators: choosing the right protection for your warehouse.",
    slug: "respirator-mask-guide",
  },
  {
    title: "Mop Buying Guide",
    description: "Cut-end vs looped-end, cotton vs synthetic: the right mop for warehouse floors.",
    slug: "mop-buying-guide",
  },
];

const VALUE_PROPS = [
  {
    icon: <DollarSign className="w-6 h-6" />,
    title: "Wholesale Pricing",
    description: "Industrial-grade supplies at true distributor prices. No markup, no membership fees.",
  },
  {
    icon: <Truck className="w-6 h-6" />,
    title: "Free Local Delivery",
    description: "Free 1-3 day delivery across Southern California on qualifying orders.",
  },
  {
    icon: <UserCheck className="w-6 h-6" />,
    title: "Dedicated Account Rep",
    description: "A rep who understands warehouse operations, seasonal peaks, and bulk ordering.",
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Price Match Guarantee",
    description: "Find a lower price from a local competitor? We will match it.",
  },
];

/* ─────────────────────────── Component ─────────────────────────── */

export default function WarehousesPage() {
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
            <span className="text-mjs-red">Warehouses</span>
          </nav>

          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-mjs-red/10 border border-mjs-red/20 text-mjs-red px-3 py-1.5 rounded-full text-xs font-semibold mb-4 uppercase tracking-wider">
              <Warehouse className="w-3.5 h-3.5" />
              Industry Solutions
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
              Warehouses &amp; Industrial
            </h1>
            <p className="text-lg md:text-xl text-mjs-gray-300 leading-relaxed max-w-2xl mx-auto">
              Industrial-strength degreasers, spill absorbents, large trash liners, heavy-duty PPE,
              stretch wrap, and floor care for warehouses and manufacturing facilities at wholesale.
            </p>
          </div>
        </div>
      </div>

      {/* ── Essential Supplies ── */}
      <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-4xl font-extrabold text-mjs-dark mb-3">
            Essential Warehouse Supplies
          </h2>
          <p className="text-mjs-gray-500 text-base md:text-lg max-w-2xl mx-auto">
            Heavy-duty products organized by need. Click any product to view pricing and order.
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
              Free resources to help warehouse teams maintain safety and efficiency.
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
            Why MJS for Warehouses
          </h2>
          <p className="text-mjs-gray-500 max-w-2xl mx-auto">
            We supply distribution centers, manufacturing plants, and logistics facilities across Southern California.
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
            Get a Warehouse Supply Quote
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Tell us about your facility and we will build a custom supply program with industrial-grade
            products, bulk pricing, and scheduled deliveries.
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
