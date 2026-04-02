"use client";

import { useState } from "react";
import { allProducts, type ProductData } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export interface QuickFilter {
  label: string;
  subcategories: string[];
}

export interface ComboShopConfig {
  title: string;
  subtitle: string;
  categories: string[];
  quickFilters: QuickFilter[];
}

export default function ComboShopPage({ config }: { config: ComboShopConfig }) {
  const [activeFilter, setActiveFilter] = useState<number | null>(null);

  // Pull products from multiple categories
  const baseProducts = allProducts.filter(
    (p) => p.price > 0 && config.categories.includes(p.category)
  );

  // Filter by quick filter selection
  const filtered = activeFilter !== null
    ? baseProducts.filter((p) => config.quickFilters[activeFilter].subcategories.includes(p.subcategory))
    : baseProducts;

  return (
    <section className="bg-mjs-gray-50 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-xs text-mjs-gray-400 mb-3">
            <a href="/" className="hover:text-mjs-red transition-colors">Home</a>
            <span>/</span>
            <span className="text-mjs-dark font-medium">{config.title}</span>
            {activeFilter !== null && (
              <>
                <span>/</span>
                <span className="text-mjs-dark font-medium">{config.quickFilters[activeFilter].label}</span>
              </>
            )}
          </div>
          <h1 className="text-2xl font-bold text-mjs-dark">{config.title}</h1>
          <p className="text-sm text-mjs-gray-500 mt-1">{filtered.length} products available</p>
        </div>

        {/* Quick Filter Buttons */}
        {config.quickFilters.length > 0 && (
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
              {config.quickFilters.map((filter, i) => (
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

        {/* Product Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-12 text-center">
            <p className="text-mjs-gray-500">No products found. Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
}
