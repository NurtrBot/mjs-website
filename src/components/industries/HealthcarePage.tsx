"use client";

import {
  ChevronRight,
  ArrowRight,
  Check,
  HeartPulse,
  ShieldCheck,
  Truck,
  DollarSign,
  UserCheck,
  Sparkles,
  Bath,
  BookOpen,
  Shield,
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
    area: "Infection Control",
    icon: <Shield className="w-5 h-5" />,
    color: "text-red-700",
    bgColor: "bg-red-50",
    products: [
      {
        name: "Strike Bac Lemon Disinfectant Cleaner (Gal)",
        why: "EPA-registered hospital-grade disinfectant -- kills 99.9% of pathogens on hard surfaces",
        slug: "strike-bac-lemon-odor-disinfectant-cleaner-gallon-91101ea",
      },
      {
        name: "Pure Bright Liquid Bleach 6%",
        why: "Concentrated bleach for terminal cleaning, laundry disinfection, and spill response",
        slug: "pure-bright-liquid-bleach-6",
      },
      {
        name: "Antibacterial Liquid Hand Soap (Gal)",
        why: "Antibacterial formula for clinical handwashing stations and staff restrooms",
        slug: "antibacterial-liquid-hand-soap-gallon-50401ea",
      },
    ],
  },
  {
    area: "Personal Protective Equipment",
    icon: <ShieldCheck className="w-5 h-5" />,
    color: "text-violet-700",
    bgColor: "bg-violet-50",
    products: [
      {
        name: "Blue Nitrile Exam Gloves 5mil (100/bx)",
        why: "Medical-grade, powder-free nitrile for patient care and specimen handling",
        slug: "life-guard-blue-nitrile-exam-gloves-powder-free-medium-5-mil-100-bx",
      },
      {
        name: "3M N95 Particulate Respirator 8210 (20/bx)",
        why: "NIOSH-approved N95 for airborne pathogen protection and aerosol-generating procedures",
        slug: "3m-particulate-respirator-8210-n95-20-bx",
      },
    ],
  },
  {
    area: "Restroom & Patient Areas",
    icon: <Bath className="w-5 h-5" />,
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    products: [
      {
        name: "Premium 2-Ply Multifold Towels (4,000/cs)",
        why: "Hygienic single-sheet dispensing for patient and visitor restrooms",
        slug: "janitors-finest-5300-premium-2-ply-white-multifold-towels-16-packs-250-sheets-4000-towels",
      },
      {
        name: "2-Ply Toilet Tissue (96 rolls/cs)",
        why: "Soft 2-ply tissue for patient rooms and public restrooms",
        slug: "janitors-finest-2-ply-toilet-tissue-4-3-x-3-5-500-sheets-per-roll-96-rolls-per-case-5602",
      },
      {
        name: "Half-Fold Toilet Seat Covers (5,000/cs)",
        why: "Patient and visitor confidence -- essential for public-facing healthcare facilities",
        slug: "janitors-finest-5800-premium-half-fold-toilet-seat-covers-250-covers-sleeve-20-sleeves-carton",
      },
    ],
  },
];

const GUIDES = [
  {
    title: "Disposable Glove Buying Guide",
    description: "Nitrile vs vinyl vs latex: choosing the right exam glove for clinical and custodial use.",
    slug: "disposable-glove-guide",
  },
  {
    title: "Respirator & Mask Guide",
    description: "N95 vs KN95 vs surgical masks: protection levels, fit testing, and compliance requirements.",
    slug: "respirator-mask-guide",
  },
  {
    title: "Restroom Cleaning Checklist",
    description: "Step-by-step restroom sanitation protocol for healthcare-grade cleanliness.",
    slug: "restroom-cleaning-checklist",
  },
];

const VALUE_PROPS = [
  {
    icon: <DollarSign className="w-6 h-6" />,
    title: "Wholesale Pricing",
    description: "Healthcare-grade supplies without healthcare-grade markups. True wholesale pricing.",
  },
  {
    icon: <Truck className="w-6 h-6" />,
    title: "Free Local Delivery",
    description: "Free 1-3 day delivery across Southern California on qualifying orders.",
  },
  {
    icon: <UserCheck className="w-6 h-6" />,
    title: "Dedicated Account Rep",
    description: "A rep who understands infection control requirements and regulatory needs.",
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Price Match Guarantee",
    description: "Find a lower price from a local competitor? We will match it.",
  },
];

/* ─────────────────────────── Component ─────────────────────────── */

export default function HealthcarePage() {
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
            <span className="text-mjs-red">Healthcare</span>
          </nav>

          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-mjs-red/10 border border-mjs-red/20 text-mjs-red px-3 py-1.5 rounded-full text-xs font-semibold mb-4 uppercase tracking-wider">
              <HeartPulse className="w-3.5 h-3.5" />
              Industry Solutions
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
              Healthcare &amp; Medical
            </h1>
            <p className="text-lg md:text-xl text-mjs-gray-300 leading-relaxed max-w-2xl mx-auto">
              EPA-registered disinfectants, exam gloves, N95 respirators, and facility supplies
              built for infection control and patient safety -- all at wholesale prices.
            </p>
          </div>
        </div>
      </div>

      {/* ── Essential Supplies ── */}
      <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-4xl font-extrabold text-mjs-dark mb-3">
            Essential Healthcare Supplies
          </h2>
          <p className="text-mjs-gray-500 text-base md:text-lg max-w-2xl mx-auto">
            Infection control, PPE, and facility maintenance -- organized by need.
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
              Free resources for infection control compliance and supply management.
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
            Why MJS for Healthcare
          </h2>
          <p className="text-mjs-gray-500 max-w-2xl mx-auto">
            We supply clinics, dental offices, urgent care centers, and assisted living facilities across Southern California.
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
            Get a Healthcare Facility Quote
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Tell us about your facility and we will build a custom supply program with EPA-registered
            products, scheduled deliveries, and wholesale pricing.
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
