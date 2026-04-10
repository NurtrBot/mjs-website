"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, ShoppingCart, Minus, Plus } from "lucide-react";
import { allProducts, type ProductData } from "@/data/products";
import { useCart } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const hasRealImage = (p: ProductData) =>
  p.images.length > 0 && !p.images[0].includes("placeholder");

function scoreProduct(p: ProductData, query: string): number {
  const q = query.toLowerCase().trim();
  const tokens = q.split(/\s+/).filter(Boolean);
  const sku = p.sku.toLowerCase();
  const name = p.name.toLowerCase();
  const cardTitle = p.cardTitle.toLowerCase();
  const brand = p.brand.toLowerCase();
  const category = p.category.toLowerCase();
  const subcategory = p.subcategory.toLowerCase();
  const searchable = `${name} ${cardTitle} ${brand} ${category} ${subcategory} ${sku}`;

  let score = 0;

  if (sku === q) return 1000;
  if (sku.startsWith(q)) score += 200;
  else if (sku.includes(q)) score += 150;

  if (cardTitle.includes(q)) score += 100;
  if (name.includes(q)) score += 80;
  if (brand.includes(q)) score += 60;

  for (const token of tokens) {
    if (searchable.includes(token)) score += 20;
    if (cardTitle.includes(token)) score += 10;
    if (brand.includes(token)) score += 5;
    if (subcategory.includes(token)) score += 5;
  }

  const matchedTokens = tokens.filter((t) => searchable.includes(t)).length;
  if (tokens.length > 1 && matchedTokens < tokens.length) {
    score -= (tokens.length - matchedTokens) * 30;
  }

  return score;
}

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
          <h3 className="text-sm font-semibold text-mjs-gray-800 leading-snug line-clamp-2 group-hover:text-mjs-red transition-colors mt-1">
            {product.cardTitle}
          </h3>
        </a>
        <div className="mt-2">
          <span className="text-lg font-bold text-mjs-dark">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs text-mjs-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
              <span className="text-xs font-bold text-mjs-green">{discount}% OFF</span>
            </div>
          )}
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
  const [bcResults, setBcResults] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(false);

  // Local scored results
  const localResults = useMemo(() => {
    if (query.length < 2) return [];
    return allProducts
      .filter(hasRealImage)
      .map((p) => ({ product: p, score: scoreProduct(p, query) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((r) => r.product);
  }, [query]);

  // Fetch BC results
  useEffect(() => {
    if (query.length < 2) { setBcResults([]); return; }
    setLoading(true);
    fetch(`/api/products/search?q=${encodeURIComponent(query)}&limit=250`)
      .then((res) => res.json())
      .then((data) => {
        setBcResults((data.products || []).filter(hasRealImage));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [query]);

  // Merge & dedup
  const results = useMemo(() => {
    const seenSlugs = new Set<string>();
    const seenSkus = new Set<string>();
    const merged: ProductData[] = [];
    for (const p of [...localResults, ...bcResults]) {
      const skuKey = p.sku.toLowerCase();
      if (seenSlugs.has(p.slug) || seenSkus.has(skuKey)) continue;
      seenSlugs.add(p.slug);
      seenSkus.add(skuKey);
      merged.push(p);
    }
    return merged;
  }, [localResults, bcResults]);

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
