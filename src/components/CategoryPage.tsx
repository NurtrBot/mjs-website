"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import type { ProductData } from "@/data/products";

/* ── Site category slug → display name ── */
const categoryNames: Record<string, string> = {
  "paper-products": "Paper Products",
  "cleaning-chemicals": "Cleaning Chemicals",
  "trash-liners": "Trash Liners",
  "gloves-safety": "Gloves & Safety",
  "packaging-film": "Packaging & Film",
  "breakroom": "Breakroom",
  "equipment": "Equipment & Tools",
  "floor-care": "Floor Care",
  "car-detailing": "Car Detailing",
};

/* ── Quick filter config per category ── */
const quickFilters: Record<string, { label: string; subcategories: string[] }[]> = {
  "paper-products": [
    { label: "Roll Towels", subcategories: ["Roll Towels"] },
    { label: "Multifolds", subcategories: ["Multifolds"] },
    { label: "Toilet Tissue", subcategories: ["Toilet Tissue"] },
    { label: "Facial Tissue", subcategories: ["Facial Tissue"] },
  ],
  "cleaning-chemicals": [
    { label: "Cleaners & Degreasers", subcategories: ["Degreasers", "General", "Glass Cleaners"] },
    { label: "Disinfectants & Wipes", subcategories: ["Disinfectants", "Wipes", "Bleach"] },
    { label: "Hand Soap", subcategories: ["Hand Soap & Sanitizer"] },
    { label: "Air Fresheners", subcategories: ["Air Fresheners"] },
  ],
  "trash-liners": [
    { label: "High Density", subcategories: ["High Density Liners", "Hi-Density"] },
    { label: "Low Density", subcategories: ["Low Density Liners"] },
    { label: "Can Liners", subcategories: ["Can Liners"] },
  ],
  "gloves-safety": [
    { label: "Nitrile", subcategories: ["Nitrile Gloves"] },
    { label: "Latex", subcategories: ["Latex Gloves"] },
    { label: "Vinyl", subcategories: ["Vinyl Gloves"] },
  ],
  "equipment": [
    { label: "Dispensers", subcategories: ["Dispensers"] },
    { label: "Mops & Brooms", subcategories: ["Mops & Handles", "Brooms & Dustpans", "Buckets & Wringers"] },
    { label: "Vacuums", subcategories: ["Vacuums"] },
  ],
  "car-detailing": [
    { label: "Wash & Foam", subcategories: ["Wash"] },
    { label: "Glass Care", subcategories: ["Glass"] },
    { label: "Wax & Protection", subcategories: ["Wax & Protection"] },
  ],
};

export default function CategoryPage({ slug }: { slug: string }) {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<number | null>(null);

  const categoryName = categoryNames[slug];
  const filters = quickFilters[slug] || [];

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products/category?slug=${slug}&limit=100`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (!categoryName) {
    return (
      <section className="bg-mjs-gray-50 min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-mjs-dark">Category Not Found</h1>
          <p className="text-mjs-gray-500 mt-2">The category you&apos;re looking for doesn&apos;t exist.</p>
          <a href="/" className="inline-block mt-4 bg-mjs-red text-white font-semibold px-6 py-2.5 rounded-lg text-sm hover:bg-red-700 transition-colors">
            Back to Home
          </a>
        </div>
      </section>
    );
  }

  const filtered = activeFilter !== null && filters[activeFilter]
    ? products.filter((p) => filters[activeFilter].subcategories.includes(p.subcategory))
    : products;

  return (
    <section className="bg-mjs-gray-50 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-xs text-mjs-gray-400 mb-3">
            <a href="/" className="hover:text-mjs-red transition-colors">Home</a>
            <span>/</span>
            <span className="text-mjs-dark font-medium">{categoryName}</span>
            {activeFilter !== null && filters[activeFilter] && (
              <>
                <span>/</span>
                <span className="text-mjs-dark font-medium">{filters[activeFilter].label}</span>
              </>
            )}
          </div>
          <h1 className="text-2xl font-bold text-mjs-dark">{categoryName}</h1>
          <p className="text-sm text-mjs-gray-500 mt-1">
            {loading ? "Loading..." : `${filtered.length} products available`}
          </p>
        </div>

        {/* Quick Filter Buttons */}
        {filters.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 px-6 py-4 mb-6">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => setActiveFilter(null)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeFilter === null
                    ? "bg-mjs-red text-white shadow-md shadow-red-200"
                    : "bg-mjs-gray-50 text-mjs-gray-600 hover:bg-red-50 hover:text-mjs-red"
                }`}
              >
                All Products
              </button>
              {filters.map((filter, i) => (
                <button
                  key={filter.label}
                  onClick={() => setActiveFilter(activeFilter === i ? null : i)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                    activeFilter === i
                      ? "bg-mjs-red text-white shadow-md shadow-red-200"
                      : "bg-mjs-gray-50 text-mjs-gray-600 hover:bg-red-50 hover:text-mjs-red"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-mjs-red animate-spin" />
          </div>
        )}

        {/* Product Grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="bg-white rounded-xl p-12 text-center">
            <p className="text-mjs-gray-500">No products in this category yet. Check back soon!</p>
            <a href="/" className="inline-block mt-4 bg-mjs-red text-white font-semibold px-6 py-2.5 rounded-lg text-sm hover:bg-red-700 transition-colors">
              Back to Home
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
