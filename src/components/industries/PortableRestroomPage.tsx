"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import type { ProductData } from "@/data/products";

/* ── Curated SKU list ── */
const FEATURED_SKUS = [
  "JC25", "JC250",           // Blue deodorizers — Johnny's Choice Toss-Ins
  "JCD50", "JCD250",         // Grand Fragrance Disks
  "31801EA",                  // Odorzyme Plus Odor Eliminator
  "5602",                     // 2-Ply Toilet Tissue, 96 Rolls
  "5603P",                    // Bathroom Tissue
  "5200",                     // Jumbo Roll Tissue
  "5505",                     // Toilet Tissue
  "5302",                     // Natural Kraft Multifold Towels
  "5300",                     // Premium White Multifold Towels
  "5402",                     // Singlefold Paper Towels, Kraft
  "GJO21100",                 // Genuine Joe Multifold Towels
  "5108",                     // Paper Towels
  "5106",                     // Paper Towels
  "25630EA",                  // Pink Cherry Hand Soap, Gallon
  "7015SP",                   // Pink Lotion Hand Soap, 800ml
  "51301EA",                  // Pearly White Lotion Hand Soap
  "25640EA",
  "25625EA",
  "51401EA",
  "5800",
  "07323",
];

/* ── Product sections ── */
const SECTIONS = [
  {
    id: "deodorizers",
    title: "Blue Deodorizers & Odor Control",
    description: "Pre-measured, water-soluble pouches for mess-free application. Powerful odor control with a bold blue color that signals a clean, serviced unit.",
    skus: ["JC25", "JC250", "JCD50", "JCD250", "31801EA", "07323"],
  },
  {
    id: "toilet-paper",
    title: "Toilet Paper",
    description: "Bulk 2-ply toilet tissue built for high-traffic portable restrooms. Economical and durable between service runs.",
    skus: ["5602", "5603P", "5200", "5505", "5302", "5800"],
  },
  {
    id: "paper-towels",
    title: "Paper Towels",
    description: "Singlefold and multifold towels for portable handwash stations. One-at-a-time dispensing reduces waste.",
    skus: ["5300", "5302", "5402", "GJO21100", "5108", "5106"],
  },
  {
    id: "hand-soap",
    title: "Hand Soap",
    description: "Bulk hand soap for portable handwash stations and pump dispensers.",
    skus: ["25630EA", "7015SP", "51301EA", "25640EA", "25625EA", "51401EA"],
  },
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
    <div className="bg-mjs-gray-50 min-h-screen">
      {/* ═══ Header ═══ */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 py-8 sm:py-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-mjs-gray-400 mb-4">
            <a href="/" className="hover:text-mjs-red transition-colors">Home</a>
            <span>/</span>
            <span className="text-mjs-dark font-medium">Portable Restroom Supplies</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-black text-mjs-dark tracking-tight">
            Portable Restroom Supplies
          </h1>
          <p className="text-sm text-mjs-gray-500 mt-2 max-w-2xl leading-relaxed">
            Blue deodorizers, toilet paper, paper towels, hand soap, and odor control for portable sanitation operators. Wholesale prices with free local delivery.
          </p>
        </div>
      </div>

      {/* ═══ Product Sections ═══ */}
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        {SECTIONS.map((section) => {
          const sectionProducts = getProductsBySku(section.skus);

          return (
            <section key={section.id} id={section.id} className="mb-10 last:mb-0 scroll-mt-24">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-mjs-dark">{section.title}</h2>
                <p className="text-xs text-mjs-gray-400 mt-0.5">{section.description}</p>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 text-mjs-red animate-spin" />
                </div>
              ) : sectionProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {sectionProducts.map((product) => (
                    <ProductCard key={product.slug} product={product} />
                  ))}
                </div>
              ) : null}
            </section>
          );
        })}
      </div>

      {/* ═══ Bottom Info ═══ */}
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 py-10">
          <h2 className="text-lg font-bold text-mjs-dark mb-4">Why Operators Choose Us</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 text-sm text-mjs-gray-500">
            <div>
              <span className="font-semibold text-mjs-dark">Volume Pricing</span> — tier discounts on every product. The more you buy, the more you save.
            </div>
            <div>
              <span className="font-semibold text-mjs-dark">Free Local Delivery</span> — 1-3 business days throughout Southern California on qualifying orders.
            </div>
            <div>
              <span className="font-semibold text-mjs-dark">One Supplier</span> — deodorizers, paper, soap, and odor control from one order, one invoice.
            </div>
            <div>
              <span className="font-semibold text-mjs-dark">Net 30 Available</span> — qualified portable restroom companies can apply for business credit terms.
            </div>
            <div>
              <span className="font-semibold text-mjs-dark">Field-Tested Products</span> — pre-measured pouches, bulk rolls, and concentrates built for service routes.
            </div>
            <div>
              <span className="font-semibold text-mjs-dark">Dedicated Support</span> — call <a href="tel:7147792640" className="text-mjs-red font-semibold">(714) 779-2640</a> for product help and bulk quotes.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
