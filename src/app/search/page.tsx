"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, ShoppingCart, Minus, Plus } from "lucide-react";
import type { ProductData } from "@/data/products";
import { useCart } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const hasRealImage = (p: ProductData) =>
  p.images.length > 0 && !p.images[0].includes("placeholder");

// Scoring is now handled server-side in searchProducts()

function ResultCard({ product }: { product: ProductData }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group relative">
      {product.badge && (
        <div className={`absolute top-2 left-2 z-10 ${product.badgeColor} text-white text-[9px] font-bold px-2 py-0.5 rounded`}>
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
      <div className="p-4">
        <div className="text-[10px] font-medium text-mjs-gray-400 uppercase tracking-wide">{product.brand}</div>
        <a href={`/product/${product.slug}`}>
          <h3 className="text-xs font-semibold text-mjs-gray-800 leading-snug line-clamp-2 group-hover:text-mjs-red transition-colors mt-1">
            {product.name}
          </h3>
        </a>
        <div className="mt-2">
          {(() => {
            const prices = product.quickBuy?.filter(q => q.unitPrice).map(q => q.unitPrice!) || [];
            const lowestPrice = prices.length > 0 ? Math.min(...prices) : product.price;
            const hasDiscount = lowestPrice < product.price;
            return (
              <>
                {hasDiscount && <span className="text-xs text-mjs-gray-400 line-through mr-1.5">${product.price.toFixed(2)}</span>}
                <span className="text-lg font-bold text-mjs-dark">${lowestPrice.toFixed(2)}</span>
                {hasDiscount && <div className="text-[10px] font-semibold text-mjs-green mt-0.5">As low as ${lowestPrice.toFixed(2)}</div>}
              </>
            );
          })()}
        </div>
        <div className="text-[11px] font-medium text-mjs-gray-500 mt-1">{product.pack}</div>
        <div className="text-[10px] text-mjs-gray-400 mt-0.5">SKU: {product.sku}</div>
        <div className="flex items-center gap-2 mt-3">
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-7 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors">
              <Minus className="w-3 h-3 text-mjs-gray-500" />
            </button>
            <span className="w-8 h-8 flex items-center justify-center text-xs font-bold text-mjs-dark border-x border-gray-200 bg-mjs-gray-50">{qty}</span>
            <button onClick={() => setQty(qty + 1)} className="w-7 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors">
              <Plus className="w-3 h-3 text-mjs-gray-500" />
            </button>
          </div>
          <button
            onClick={() => {
              addItem({ slug: product.slug, sku: product.sku, name: product.cardTitle, brand: product.brand, price: product.price, image: product.images[0], pack: product.pack }, qty);
              setQty(1);
            }}
            className="flex-1 bg-white border border-mjs-red text-mjs-red font-semibold py-2 rounded-lg text-xs hover:bg-mjs-red hover:text-white transition-all flex items-center justify-center gap-1.5"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const [query, setQuery] = useState(q);
  const [results, setResults] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch BC results (live data with current descriptions)
  useEffect(() => {
    if (query.length < 2) { setResults([]); return; }
    setLoading(true);
    fetch(`/api/products/search?q=${encodeURIComponent(query)}&limit=250`)
      .then((res) => res.json())
      .then((data) => {
        const products = (data.products || []).filter(hasRealImage) as ProductData[];
        setResults(products);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [query]);

  // Sync from URL param
  useEffect(() => {
    if (q && q !== query) setQuery(q);
  }, [q]);

  return (
    <>
      <Header />
      <main className="bg-mjs-gray-50 min-h-screen">
        <div className="max-w-[1400px] mx-auto px-4 py-6">
          {/* Search header */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-xl font-bold text-mjs-dark">
                {query ? (
                  <>Search results for &ldquo;<span className="text-mjs-red">{query}</span>&rdquo;</>
                ) : (
                  "Search Products"
                )}
              </h1>
              {query && (
                <p className="text-sm text-mjs-gray-400 mt-1">
                  {loading ? "Searching..." : `${results.length} product${results.length !== 1 ? "s" : ""} found`}
                </p>
              )}
            </div>
          </div>

          {/* Results grid */}
          {results.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {results.map((product) => (
                <ResultCard key={product.slug} product={product} />
              ))}
            </div>
          ) : query.length > 1 && !loading ? (
            <div className="text-center py-20">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-lg font-bold text-mjs-gray-700 mb-2">No products found</h2>
              <p className="text-sm text-mjs-gray-400 max-w-md mx-auto">
                We couldn&apos;t find any products matching &ldquo;{query}&rdquo;. Try a different search term or browse our categories.
              </p>
              <a
                href="/"
                className="inline-block mt-6 bg-mjs-red text-white font-semibold px-6 py-2.5 rounded-lg text-sm hover:bg-red-700 transition-colors"
              >
                Browse All Products
              </a>
            </div>
          ) : !query ? (
            <div className="text-center py-20">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-lg font-bold text-mjs-gray-700 mb-2">Search for products</h2>
              <p className="text-sm text-mjs-gray-400">Use the search bar above to find products by name, SKU, brand, or category.</p>
            </div>
          ) : null}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500 mt-3">Loading search...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
