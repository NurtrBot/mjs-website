"use client";

import Link from "next/link";
import { ExternalLink, ChevronRight } from "lucide-react";

/* ─── Product cards ─── */
const PRODUCTS = [
  {
    name: "Johnny's Choice Toss-Ins",
    subtitle: "Single Case — 25 Pouches",
    sku: "JC25",
    price: "$24.99",
    slug: "johnny-s-choice-toss-ins",
    image:
      "https://cdn11.bigcommerce.com/s-wujf5nuxy5/products/201016/images/371410/toss_ins_case__41440.1773175622.1280.1280.png?c=1",
    desc: "Pre-measured, water-soluble dry deodorizing pouches for portable restrooms.",
  },
  {
    name: "Johnny's Choice Toss-Ins",
    subtitle: "Bulk Case — 250 Pouches",
    sku: "JC250",
    price: "$114.95",
    slug: "johnny-s-choice-toss-ins-aebi",
    image:
      "https://cdn11.bigcommerce.com/s-wujf5nuxy5/products/201017/images/371413/Case_tossin__61111.1774366101.1280.1280.png?c=1",
    desc: "Best value for fleet operators and high-traffic service routes.",
  },
  {
    name: "Johnny's Choice Sensory Grand Disks",
    subtitle: "50-Count Case",
    sku: "JCD50",
    price: "$32.99",
    slug: "johnny-s-choice-sensory-grand-fragrance-disks-50-pack",
    image: "/images/johnnys-choice-grand-disks.png",
    desc: "Extra-fragrance deodorizing disks for enhanced odor control in portable restrooms. 50 disks per case.",
  },
  {
    name: "Johnny's Choice Sensory Grand Disks",
    subtitle: "Bulk Case — 250 Disks",
    sku: "JCD250",
    price: "$149.95",
    slug: "johnnys-choice-sensory-grand-fragrance-discs-250-pack",
    image: "/images/johnnys-choice-grand-disks-250.png",
    desc: "High-volume bulk case of extra-fragrance deodorizing disks. Best value for fleet operators. 250 disks per case.",
  },
];

const BENEFITS = [
  {
    title: "Powerful Odor Control",
    desc: "Advanced formula neutralizes odors on contact and releases a deep-blue color for a visually cleaner unit.",
  },
  {
    title: "Pre-Measured & Mess-Free",
    desc: "Water-soluble pouches dissolve instantly — no measuring, no spills, no gloves required.",
  },
  {
    title: "Biodegradable Formula",
    desc: "Eco-conscious formulation that breaks down naturally. Safe for disposal in approved waste systems.",
  },
  {
    title: "Built for the Field",
    desc: "Compact, lightweight packaging designed for service trucks and route operators who need speed and reliability.",
  },
];

const USE_CASES = [
  "Portable Restroom Operators",
  "Camping & RV Parks",
  "Construction Sites",
  "Outdoor Events & Festivals",
  "Remote Locations & Agriculture",
  "Emergency & Disaster Services",
  "Transportation Industries",
];

export default function JohnnysChoicePage() {
  return (
    <div className="bg-white">
      {/* ═══ BREADCRUMB + INTRO ═══ */}
      <section className="bg-[#0b1d3a] text-white">
        <div className="max-w-[1100px] mx-auto px-4 py-10 md:py-14">
          <nav className="flex items-center gap-1.5 text-xs text-white/40 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/70">Johnny&apos;s Choice</span>
          </nav>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-3 text-center">
            Johnny&apos;s Choice Toss-Ins
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto leading-relaxed text-sm md:text-base text-center">
            Professional-grade, pre-measured holding tank deodorizer trusted by portable restroom operators across the country. Available at wholesale pricing from Mobile Janitorial Supply — your authorized distributor.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Link
              href="#products"
              className="inline-flex items-center gap-2 bg-mjs-red hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors"
            >
              Shop Toss-Ins
            </Link>
            <a
              href="https://www.johnnyschoicetossins.com"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors"
            >
              Visit JohnnysChoiceTossins.com
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </a>
          </div>
        </div>
      </section>

      {/* ═══ WHAT ARE TOSS-INS ═══ */}
      <section className="max-w-[1100px] mx-auto px-4 py-14 md:py-20">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4 text-center">
          What Are Johnny&apos;s Choice Toss-Ins?
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed text-center mb-14">
          Johnny&apos;s Choice Toss-Ins are a high-performance dry deodorizing solution engineered for portable restroom professionals. Each water-soluble pouch is pre-measured for fast, mess-free application — just toss it in the holding tank and let the formula go to work. The advanced chemistry provides long-lasting odor control, releases a bold deep-blue color for a visually cleaner unit, and breaks down waste to keep tanks flowing smoothly between service stops.
        </p>

        {/* Benefits — clean centered cards, no icons */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {BENEFITS.map((b) => (
            <div
              key={b.title}
              className="text-center border border-gray-200 rounded-xl px-5 py-8 hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <h3 className="font-bold text-gray-900 text-[15px] mb-2">{b.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ USE CASES ═══ */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-[1100px] mx-auto px-4 py-14 md:py-20">
          <div className="md:flex md:items-start md:gap-14">
            <div className="md:flex-1 mb-8 md:mb-0">
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">
                Who Uses Johnny&apos;s Choice?
              </h2>
              <p className="text-gray-500 leading-relaxed mb-5">
                From single-unit operators to large portable restroom fleets, Johnny&apos;s Choice products are trusted across a wide range of industries and service conditions. The compact, lightweight packaging is designed to ride along on service trucks for fast, efficient treatment in the field.
              </p>
              <a
                href="https://www.johnnyschoicetossins.com"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
              >
                Learn more at JohnnysChoiceTossins.com
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="md:flex-1">
              <div className="grid grid-cols-2 gap-2.5">
                {USE_CASES.map((uc) => (
                  <div
                    key={uc}
                    className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 text-center"
                  >
                    {uc}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PRODUCTS ═══ */}
      <section id="products" className="max-w-[1100px] mx-auto px-4 py-14 md:py-20">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2 text-center">
          Shop the Johnny&apos;s Choice Line
        </h2>
        <p className="text-gray-400 text-center mb-10">
          Wholesale pricing &middot; In stock &middot; Ships from Anaheim, CA
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PRODUCTS.map((p) => {
            const inner = (
              <>
                <div className="bg-white border-b border-gray-100 p-6 flex items-center justify-center h-52">
                  <img
                    src={p.image}
                    alt={p.name}
                    className={`max-h-44 w-auto object-contain ${p.slug ? "group-hover:scale-105" : ""} transition-transform`}
                  />
                </div>
                <div className="p-5">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    SKU: {p.sku}
                  </div>
                  <h3 className={`font-bold text-gray-900 text-[15px] leading-snug mb-0.5 ${p.slug ? "group-hover:text-mjs-red" : ""} transition-colors`}>
                    {p.name}
                  </h3>
                  <div className="text-xs text-gray-400 mb-2">{p.subtitle}</div>
                  <p className="text-sm text-gray-500 mb-3 leading-relaxed">{p.desc}</p>
                  <div className="text-lg font-extrabold text-mjs-red">{p.price}</div>
                </div>
              </>
            );

            return p.slug ? (
              <Link
                key={p.sku}
                href={`/product/${p.slug}`}
                className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
              >
                {inner}
              </Link>
            ) : (
              <div
                key={p.sku}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden"
              >
                {inner}
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══ CROSS-LINK CTA ═══ */}
      <section className="bg-[#0b1d3a] text-white">
        <div className="max-w-[1100px] mx-auto px-4 py-12 md:py-14 text-center">
          <h2 className="text-xl md:text-2xl font-extrabold mb-2">
            Visit the Johnny&apos;s Choice Toss-Ins Informational Website
          </h2>
          <p className="text-white/50 max-w-lg mx-auto mb-6 text-sm">
            Product specs, SDS sheets, distributor information, and everything you need to know about Johnny&apos;s Choice portable sanitation products.
          </p>
          <a
            href="https://www.johnnyschoicetossins.com"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 bg-white text-[#0b1d3a] hover:bg-gray-100 font-bold px-7 py-3 rounded-lg text-sm transition-colors"
          >
            JohnnysChoiceTossins.com
            <ExternalLink className="w-4 h-4 opacity-50" />
          </a>
        </div>
      </section>

      {/* ═══ FAQ — feeds FAQPage schema for rich snippets ═══ */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-[800px] mx-auto px-4 py-14 md:py-20">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "What are Johnny's Choice Toss-Ins?",
                a: "Johnny's Choice Toss-Ins are professional-grade, pre-measured dry deodorizing pouches designed for portable restroom holding tanks. Each water-soluble pouch dissolves on contact with water, releasing a powerful odor-neutralizing formula and bold deep-blue color dye. They are manufactured by Chemcorp Industries in Mississauga, Ontario, Canada.",
              },
              {
                q: "How do you use Johnny's Choice Toss-Ins?",
                a: "Simply toss one pre-measured pouch into the portable restroom holding tank. The water-soluble pouch dissolves on contact with water — no measuring, mixing, or gloves required. Each pouch provides long-lasting odor control between service stops.",
              },
              {
                q: "What is the difference between Toss-Ins and Sensory Grand Disks?",
                a: "Toss-Ins are dry deodorizing pouches that go directly into the holding tank to neutralize odors and add blue color dye. Sensory Grand Disks are extra-fragrance deodorizing disks that hang on a hook or sit in a small cabinet inside the portable restroom to provide continuous air freshening. Many operators use both together for maximum odor control.",
              },
              {
                q: "Where can I buy Johnny's Choice Toss-Ins wholesale?",
                a: "Mobile Janitorial Supply is an authorized Johnny's Choice distributor offering wholesale pricing on all Toss-Ins and Sensory Grand Disks. Orders ship from Anaheim, CA with free 1-3 business day delivery on qualifying orders across Southern California.",
              },
              {
                q: "Are Johnny's Choice Toss-Ins biodegradable?",
                a: "Yes. Johnny's Choice Toss-Ins use an eco-conscious formulation that breaks down naturally and is safe for disposal in approved waste systems.",
              },
              {
                q: "What sizes do Johnny's Choice products come in?",
                a: "Toss-Ins are available in a single case of 25 pouches (JC25, $24.99) and a bulk case of 250 pouches (JC250, $114.95). Sensory Grand Disks come in a 50-count case (JCD50, $32.99) and a bulk 250-count case (JCD250, $149.95).",
              },
            ].map((faq) => (
              <details
                key={faq.q}
                className="bg-white border border-gray-200 rounded-xl group"
              >
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-semibold text-gray-900 text-[15px] select-none">
                  {faq.q}
                  <span className="text-gray-400 group-open:rotate-45 transition-transform text-xl leading-none ml-4">+</span>
                </summary>
                <div className="px-5 pb-4 text-sm text-gray-500 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHY BUY FROM MJS ═══ */}
      <section className="max-w-[1100px] mx-auto px-4 py-14 md:py-20">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-10 text-center">
          Why Buy Johnny&apos;s Choice From Mobile Janitorial Supply?
        </h2>
        <div className="grid sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
          <div className="text-center border border-gray-200 rounded-xl px-5 py-8">
            <h3 className="font-bold text-gray-900 mb-1.5">Free Local Delivery</h3>
            <p className="text-sm text-gray-500">Free 1-3 business day delivery on qualifying orders across Southern California.</p>
          </div>
          <div className="text-center border border-gray-200 rounded-xl px-5 py-8">
            <h3 className="font-bold text-gray-900 mb-1.5">Wholesale Pricing</h3>
            <p className="text-sm text-gray-500">Volume discounts and the lowest prices on Johnny&apos;s Choice products.</p>
          </div>
          <div className="text-center border border-gray-200 rounded-xl px-5 py-8">
            <h3 className="font-bold text-gray-900 mb-1.5">Authorized Distributor</h3>
            <p className="text-sm text-gray-500">Genuine Johnny&apos;s Choice products, direct from the source.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
