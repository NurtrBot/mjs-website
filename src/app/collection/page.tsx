"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import type { ProductData } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { usePurchases } from "@/context/PurchaseContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const hasRealImage = (p: ProductData) =>
  p.images.length > 0 && !p.images[0].includes("placeholder");

const COLLECTIONS: Record<string, { title: string; badge: string; badgeColor: string; apiUrl: string }> = {
  "best-sellers": {
    title: "Best Sellers",
    badge: "POPULAR",
    badgeColor: "bg-mjs-red",
    apiUrl: "/api/products/bestsellers",
  },
  "new-arrivals": {
    title: "New Arrivals",
    badge: "JUST IN",
    badgeColor: "bg-mjs-red",
    apiUrl: "/api/products/new-arrivals",
  },
  "ready-to-ship": {
    title: "Ready to Ship",
    badge: "IN STOCK",
    badgeColor: "bg-emerald-600",
    apiUrl: "/api/products/search?q=janitors+finest&limit=100",
  },
};

function CollectionCard({ product }: { product: ProductData }) {
  const { addItem } = useCart();
  const { getPurchaseDate } = usePurchases();
  const [qty, setQty] = useState(1);
  const purchasedDate = getPurchaseDate(product.sku);
  const prices = product.quickBuy?.filter(q => q.unitPrice).map(q => q.unitPrice!) || [];
  const lowestPrice = prices.length > 0 ? Math.min(...prices) : product.price;
  const hasDiscount = lowestPrice < product.price;

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group relative">
      {purchasedDate && (
        <div className="absolute top-2 right-2 z-10 bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
          Purchased {purchasedDate}
        </div>
      )}
      {product.badge && (
        <div className={`absolute top-2 left-2 z-10 ${product.badgeColor} text-white text-[9px] font-bold px-2 py-0.5 rounded`}>
          {product.badge}
        </div>
      )}
      <a href={`/product/${product.slug}`} className="block h-[200px] bg-white overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
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
          {hasDiscount && <span className="text-xs text-mjs-gray-400 line-through mr-1.5">${product.price.toFixed(2)}</span>}
          <span className="text-lg font-bold text-mjs-dark">${lowestPrice.toFixed(2)}</span>
          {hasDiscount && <div className="text-[10px] font-semibold text-mjs-green mt-0.5">As low as ${lowestPrice.toFixed(2)}</div>}
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

function CollectionContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "best-sellers";
  const collection = COLLECTIONS[type] || COLLECTIONS["best-sellers"];
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(collection.apiUrl)
      .then(r => r.json())
      .then(data => {
        const items = (data.products || []) as ProductData[];
        setProducts(items.filter(hasRealImage));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [type, collection.apiUrl]);

  return (
    <>
      <Header />
      <main className="bg-mjs-gray-50 min-h-screen">
        <div className="max-w-[1400px] mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-6">
            <h1 className="text-xl font-bold text-mjs-dark">{collection.title}</h1>
            <span className={`${collection.badgeColor} text-white text-[9px] font-bold px-2 py-0.5 rounded tracking-wide`}>
              {collection.badge}
            </span>
            {!loading && (
              <span className="text-sm text-mjs-gray-400 ml-auto">
                {products.length} product{products.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin" />
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {products.map((product) => (
                <CollectionCard key={product.slug} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h2 className="text-lg font-bold text-mjs-gray-700 mb-2">No products found</h2>
              <a href="/" className="inline-block mt-4 bg-mjs-red text-white font-semibold px-6 py-2.5 rounded-lg text-sm hover:bg-red-700 transition-colors">
                Browse All Products
              </a>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function CollectionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin" />
      </div>
    }>
      <CollectionContent />
    </Suspense>
  );
}
