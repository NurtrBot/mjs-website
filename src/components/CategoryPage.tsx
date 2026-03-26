"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { products, categoryMap, getProductsByCategory } from "@/data/products";
import { useCart } from "@/context/CartContext";

/* ── Friendly subcategory labels per category ── */
const subcategoryLabels: Record<string, Record<string, string>> = {
  "Paper & Restroom": {
    "Roll Towels": "Roll Towels",
    "Multifolds": "Multifolds",
    "Toilet Tissue": "Toilet Tissue",
    "Facial Tissue": "Facial Tissue",
  },
  "Cleaning Chemicals": {
    "Degreasers": "Degreasers",
    "Air Fresheners": "Air Fresheners",
    "All-Purpose Cleaners": "All-Purpose Cleaners",
    "Wipes": "Wipes",
  },
  "Gloves & Safety": {
    "Nitrile Gloves": "Nitrile",
    "Latex Gloves": "Latex",
    "Vinyl Gloves": "Vinyl",
  },
  "Trash Liners": {
    "Hi-Density Liners": "Hi-Density Liners",
  },
  "Packaging & Shipping": {
    "Stretch Film": "Stretch Film",
  },
  "Equipment & Tools": {
    "Mop Buckets": "Mop Buckets",
    "Dispensers": "Dispensers",
  },
};

function ProductCard({ product }: { product: (typeof products)[0] }) {
  const { addItem } = useCart();
  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group relative flex flex-col">
      {product.badge && (
        <div
          className={`absolute top-2 left-2 z-10 ${product.badgeColor} text-white text-[9px] font-bold px-2 py-0.5 rounded`}
        >
          {product.badge}
        </div>
      )}

      <a href={`/product/${product.slug}`} className="block h-[200px] bg-white overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.cardTitle}
          className={`w-full h-full ${product.imageFit === "contain" ? "object-contain p-4" : "object-cover"}`}
        />
      </a>

      <div className="p-4 flex flex-col flex-1">
        <div className="text-[10px] font-medium text-mjs-gray-400 uppercase tracking-wide">
          {product.brand}
        </div>
        <a href={`/product/${product.slug}`}>
          <h3 className="text-sm font-semibold text-mjs-gray-800 leading-snug mt-1 group-hover:text-mjs-red transition-colors">
            {product.name}
          </h3>
        </a>

        <div className="mt-auto pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-mjs-dark">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-xs text-mjs-gray-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
                <span className="text-xs font-bold text-mjs-green">
                  {discount}% OFF
                </span>
              </>
            )}
          </div>

          <div className="text-[11px] font-medium text-mjs-gray-500 mt-0.5">
            {product.pack}
          </div>

          <button
            onClick={() => {
              addItem({
                slug: product.slug,
                name: product.cardTitle,
                brand: product.brand,
                price: product.price,
                image: product.images[0],
                pack: product.pack,
              });
            }}
            className="w-full mt-3 bg-white border border-mjs-red text-mjs-red font-semibold py-2 rounded-lg text-xs hover:bg-mjs-red hover:text-white transition-all flex items-center justify-center gap-1.5"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CategoryPage({ slug }: { slug: string }) {
  const categoryName = categoryMap[slug];
  const baseProducts = categoryName ? getProductsByCategory(categoryName) : [];
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Get friendly labels
  const labels = categoryName ? subcategoryLabels[categoryName] || {} : {};

  // Use label keys if defined (shows all intended filters), otherwise derive from product data
  const subcategories = Object.keys(labels).length > 0
    ? Object.keys(labels)
    : Array.from(new Set(baseProducts.map((p) => p.subcategory)));

  // Filter products by selected subcategory
  const filteredBase = activeFilter
    ? baseProducts.filter((p) => p.subcategory === activeFilter)
    : baseProducts;

  // Fill to 30 items by repeating products for testing
  const categoryProducts = filteredBase.length > 0
    ? Array.from({ length: 30 }, (_, i) => ({
        ...filteredBase[i % filteredBase.length],
        slug: i < filteredBase.length
          ? filteredBase[i % filteredBase.length].slug
          : `${filteredBase[i % filteredBase.length].slug}-v${Math.floor(i / filteredBase.length)}`,
      }))
    : [];

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

  return (
    <section className="bg-mjs-gray-50 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-xs text-mjs-gray-400 mb-3">
            <a href="/" className="hover:text-mjs-red transition-colors">Home</a>
            <span>/</span>
            <span className="text-mjs-dark font-medium">{categoryName}</span>
            {activeFilter && (
              <>
                <span>/</span>
                <span className="text-mjs-dark font-medium">{labels[activeFilter] || activeFilter}</span>
              </>
            )}
          </div>
          <h1 className="text-2xl font-bold text-mjs-dark">{categoryName}</h1>
          <p className="text-sm text-mjs-gray-500 mt-1">
            {categoryProducts.length} {categoryProducts.length === 1 ? "product" : "products"} available
          </p>
        </div>

        {/* Quick Filter Buttons */}
        {subcategories.length > 1 && (
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
              {subcategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setActiveFilter(activeFilter === sub ? null : sub)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                    activeFilter === sub
                      ? "bg-mjs-red text-white shadow-md shadow-red-200"
                      : "bg-mjs-gray-50 text-mjs-gray-600 hover:bg-red-50 hover:text-mjs-red"
                  }`}
                >
                  {labels[sub] || sub}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Product Grid */}
        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {categoryProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        ) : (
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
