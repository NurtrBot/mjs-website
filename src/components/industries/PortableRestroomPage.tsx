"use client";

import { useState, useEffect } from "react";
import { Droplets, ScrollText, HandMetal, Wind, Truck, DollarSign, ShieldCheck, ArrowRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import type { ProductData } from "@/data/products";

/* ── Curated SKU list ── */
const FEATURED_SKUS = [
  "JC25", "JC250",           // Blue deodorizers — Johnny's Choice Toss-Ins
  "5602",                     // 2-Ply Toilet Tissue, 96 Rolls
  "5300",                     // Premium White Multifold Towels
  "5302",                     // Natural Kraft Multifold Towels
  "5402",                     // Singlefold Paper Towels, Kraft
  "25630EA",                  // Pink Cherry Hand Soap, Gallon
  "7015SP",                   // Pink Lotion Hand Soap, 800ml
  "31801EA",                  // Odorzyme Plus Odor Eliminator
];

/* ── Product categories for the page ── */
const SECTIONS = [
  {
    id: "deodorizers",
    title: "Blue Deodorizers & Odor Control",
    description: "High-performance dry deodorizing solutions built for portable restroom professionals. Water-soluble pouches deliver mess-free application, powerful odor control, and a bold blue color that signals a clean, serviced unit.",
    icon: <Droplets className="w-5 h-5" />,
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    skus: ["JC25", "JC250", "31801EA"],
  },
  {
    id: "toilet-paper",
    title: "Toilet Paper & Tissue",
    description: "Bulk toilet tissue designed for high-traffic portable restrooms. Economical 2-ply rolls that balance softness with durability — built to last between service runs.",
    icon: <ScrollText className="w-5 h-5" />,
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    skus: ["5602"],
  },
  {
    id: "paper-towels",
    title: "Paper Towels — Singlefold & Multifold",
    description: "Singlefold and multifold towels for portable handwash stations. One-at-a-time dispensing reduces waste and keeps units cleaner between services.",
    icon: <ScrollText className="w-5 h-5" />,
    color: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    skus: ["5300", "5302", "5402"],
  },
  {
    id: "hand-soap",
    title: "Hand Soap & Sanitizer",
    description: "Bulk hand soap for portable handwash stations and pump dispensers. Thick, rich formulas that cut through grease and grime while leaving hands feeling clean.",
    icon: <HandMetal className="w-5 h-5" />,
    color: "text-pink-700",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
    skus: ["25630EA", "7015SP"],
  },
];

/* ── Value props ── */
const VALUE_PROPS = [
  { icon: <Truck className="w-5 h-5" />, title: "Free 1-3 Day Delivery", description: "On qualifying orders throughout Southern California" },
  { icon: <DollarSign className="w-5 h-5" />, title: "Wholesale Pricing", description: "Volume discounts on every product — the more you buy, the more you save" },
  { icon: <ShieldCheck className="w-5 h-5" />, title: "PRO-Trusted Brands", description: "Janitors Finest and Johnny's Choice — built for the field" },
  { icon: <Wind className="w-5 h-5" />, title: "Odor Control Experts", description: "Exclusive deodorizers and eliminators formulated for portable sanitation" },
];

export default function PortableRestroomPage() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const searches = FEATURED_SKUS.map((sku) =>
          fetch(`/api/products/search?q=${encodeURIComponent(sku)}&limit=5`)
            .then((r) => r.json())
            .then((d) => d.products || [])
        );
        const results = await Promise.all(searches);
        const all = results.flat();

        // Dedupe and keep only exact SKU matches
        const seen = new Set<string>();
        const matched: ProductData[] = [];
        for (const p of all) {
          if (FEATURED_SKUS.includes(p.sku) && !seen.has(p.sku)) {
            seen.add(p.sku);
            matched.push(p);
          }
        }
        setProducts(matched);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const getProductsBySku = (skus: string[]) =>
    products.filter((p) => skus.includes(p.sku));

  return (
    <div className="bg-white">
      {/* ═══ Hero ═══ */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white">
        <div className="max-w-[1400px] mx-auto px-4 py-14 sm:py-20">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-white/40 mb-8">
            <a href="/" className="hover:text-white/70 transition-colors">Home</a>
            <span>/</span>
            <a href="/industries" className="hover:text-white/70 transition-colors">Industries</a>
            <span>/</span>
            <span className="text-white/70">Portable Restroom</span>
          </nav>

          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Portable Restroom
              <span className="text-blue-400"> Supplies</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/70 mt-4 leading-relaxed max-w-2xl">
              Everything portable sanitation operators need to keep units clean, stocked, and service-ready.
              Blue deodorizers, toilet paper, paper towels, hand soap, and odor control — all at wholesale prices.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <a
                href="#deodorizers"
                className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors"
              >
                Shop Deodorizers
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="/shop-by-workspace"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors backdrop-blur-sm"
              >
                Shop by Workspace
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Value Props ═══ */}
      <section className="border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUE_PROPS.map((prop) => (
              <div key={prop.title} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  {prop.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-mjs-dark">{prop.title}</h3>
                  <p className="text-xs text-mjs-gray-400 mt-0.5 leading-relaxed">{prop.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Product Sections ═══ */}
      <div className="max-w-[1400px] mx-auto px-4 py-10 sm:py-14">
        {SECTIONS.map((section) => {
          const sectionProducts = getProductsBySku(section.skus);

          return (
            <section key={section.id} id={section.id} className="mb-14 last:mb-0 scroll-mt-24">
              {/* Section Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-11 h-11 rounded-xl ${section.bgColor} ${section.color} flex items-center justify-center flex-shrink-0`}>
                  {section.icon}
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-mjs-dark tracking-tight">
                    {section.title}
                  </h2>
                  <p className="text-sm text-mjs-gray-500 mt-1 leading-relaxed max-w-2xl">
                    {section.description}
                  </p>
                </div>
              </div>

              {/* Product Grid */}
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {section.skus.map((sku) => (
                    <div key={sku} className="bg-gray-50 rounded-xl h-72 animate-pulse" />
                  ))}
                </div>
              ) : sectionProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {sectionProducts.map((product) => (
                    <ProductCard key={product.slug} product={product} />
                  ))}
                </div>
              ) : null}
            </section>
          );
        })}
      </div>

      {/* ═══ Why PROs Choose Us ═══ */}
      <section className="bg-slate-900 text-white">
        <div className="max-w-[1400px] mx-auto px-4 py-14 sm:py-20">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-center mb-3">
            Why Portable Restroom Operators Choose Us
          </h2>
          <p className="text-white/50 text-center text-sm max-w-xl mx-auto mb-10">
            We understand the portable sanitation industry. Our products are field-tested, competitively priced, and always in stock.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { title: "Built for the Field", text: "Pre-measured, water-soluble deodorizer pouches mean zero mess and zero guesswork at every service stop." },
              { title: "Volume Pricing That Scales", text: "Tier pricing across every product — the more units you service, the more you save on every supply run." },
              { title: "Fast Local Delivery", text: "Free 1-3 business day delivery throughout Southern California on qualifying orders. Never run out of stock." },
              { title: "One Supplier, Every SKU", text: "Deodorizers, paper, soap, and odor control — all from one order, one invoice, one delivery." },
              { title: "Net 30 Accounts Available", text: "Qualified portable restroom companies can apply for business credit terms to manage cash flow." },
              { title: "Dedicated Support", text: "Real people who understand your business. Call us at (714) 779-2640 for product recommendations and bulk quotes." },
            ].map((item) => (
              <div key={item.title} className="bg-white/5 rounded-xl p-5 border border-white/10">
                <h3 className="text-sm font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-white/50 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="bg-blue-600">
        <div className="max-w-[1400px] mx-auto px-4 py-10 sm:py-14 text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Ready to Stock Up?
          </h2>
          <p className="text-blue-100 mt-2 text-sm max-w-lg mx-auto">
            Get wholesale pricing on every portable restroom supply. Free delivery on qualifying orders in Southern California.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <a
              href="/quote"
              className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold text-sm px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors"
            >
              Request a Quote
            </a>
            <a
              href="tel:7147792640"
              className="inline-flex items-center gap-2 bg-white/15 text-white font-bold text-sm px-8 py-3.5 rounded-xl hover:bg-white/25 transition-colors backdrop-blur-sm"
            >
              Call (714) 779-2640
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
