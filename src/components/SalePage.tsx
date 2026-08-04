"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, Check, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { trackAddToCart } from "@/lib/analytics";
import { SALE_CONFIG, isSaleActive, getDaysRemaining } from "@/lib/active-sale";
import ProductCard from "@/components/ProductCard";
import type { ProductData } from "@/data/products";

/* ── Recommended SKU pool (6 picked at random per page load) ── */
const ALL_RECOMMENDED_SKUS = [
  "8036",        // Mop Bucket/Wringer Combo
  "611",         // Janitor Cart
  "3162EA",      // Lavender Cleaner
  "3158EA",      // Lemon Floor Cleaner
  "3180EA",      // Green Degreaser
  "91101EA",     // Strike Bac Disinfectant
  "1015",        // Quick Change Wooden Mop Handle
  "1015F",       // Quick Change Plastic Mop Handle
  "8997LG5BLU",  // Super Loop Wet Mop Head
  "EURSC679K",   // TRADITION Upright Vacuum
  "101011G",     // Mosquito 10 Qt HEPA Backpack Vacuum
];

function pickRandom(arr: string[], count: number): string[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export default function SalePage() {
  const { addItem, items } = useCart();
  const [addedSkus, setAddedSkus] = useState<Set<string>>(new Set());
  const [recommended, setRecommended] = useState<ProductData[]>([]);
  const [loadingRec, setLoadingRec] = useState(true);
  const active = isSaleActive();
  const daysLeft = getDaysRemaining();

  const cartSkus = new Set(items.map((i) => i.sku));
  const missingItems = SALE_CONFIG.items.filter((i) => !cartSkus.has(i.sku));

  const totalOriginal = SALE_CONFIG.items.reduce((s, i) => s + i.originalPrice, 0);
  const totalSave = totalOriginal - SALE_CONFIG.bundlePrice;

  useEffect(() => {
    const chosen = pickRandom(ALL_RECOMMENDED_SKUS, 6);
    const fetchRec = async () => {
      try {
        const results = await Promise.all(
          chosen.map((sku) =>
            fetch(`/api/products/search?q=${encodeURIComponent(sku)}&limit=5`)
              .then((r) => r.json())
              .then((d) => d.products || [])
          )
        );
        const seen = new Set<string>();
        const matched: ProductData[] = [];
        for (const prods of results) {
          for (const p of prods) {
            if (chosen.includes(p.sku) && !seen.has(p.sku)) {
              seen.add(p.sku);
              matched.push(p);
            }
          }
        }
        setRecommended(matched);
      } catch {
        setRecommended([]);
      } finally {
        setLoadingRec(false);
      }
    };
    fetchRec();
  }, []);

  const handleAdd = (item: typeof SALE_CONFIG.items[0]) => {
    addItem({
      slug: item.slug, sku: item.sku, name: item.name,
      brand: "", price: item.salePrice, image: item.image, pack: "Each",
    }, 1);
    trackAddToCart({ sku: item.sku, name: item.name, price: item.salePrice, quantity: 1, category: "Sale", brand: "" });
    setAddedSkus((prev) => new Set(prev).add(item.sku));
    setTimeout(() => setAddedSkus((prev) => { const n = new Set(prev); n.delete(item.sku); return n; }), 2000);
  };

  const handleAddAll = () => {
    for (const item of missingItems) handleAdd(item);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* ═══ Hero ═══ */}
      <div>
      <div className="relative max-w-[1400px] mx-auto px-4 pt-10 sm:pt-16 pb-8 text-center">
        <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-xs text-mjs-gray-400 mb-8">
          <a href="/" className="hover:text-mjs-red transition-colors">Home</a>
          <span>/</span>
          <span className="text-mjs-dark font-medium">Sale</span>
        </nav>

        {active && (
          <div className="inline-flex items-center gap-2 bg-mjs-red text-white text-xs font-bold px-4 py-1.5 rounded-full mb-6">
            {daysLeft} days left — ends September 1
          </div>
        )}

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-mjs-dark tracking-tight leading-none">
          Summer Essentials
        </h1>
        <p className="text-mjs-dark mt-3 text-base sm:text-lg">
          Three must-haves for every janitorial crew — at prices that won&apos;t last.
        </p>
      </div>

      {/* ═══ Sale Items ═══ */}
      <div className="max-w-[1270px] mx-auto px-4 pb-16 sm:pb-24">
        <div className="grid grid-cols-3 gap-5 sm:gap-14">
          {SALE_CONFIG.items.map((item) => {
            const discount = Math.round(((item.originalPrice - item.salePrice) / item.originalPrice) * 100);
            const inCart = cartSkus.has(item.sku);
            const justAdded = addedSkus.has(item.sku);

            return (
              <div key={item.sku} className="text-center">
                {/* Discount */}
                <div className="text-xs sm:text-sm font-black text-mjs-red uppercase tracking-wider mb-2 sm:mb-3">
                  Save {discount}%
                </div>

                {/* Image */}
                <a href={`/product/${item.slug}`} className="block mx-auto w-36 h-36 sm:w-60 sm:h-60 flex items-center justify-center mb-3 sm:mb-5">
                  <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-300" />
                </a>

                {/* Info */}
                <h3 className="text-sm sm:text-base font-bold text-mjs-dark mb-1 leading-tight">{item.name}</h3>

                {/* Price */}
                <div className="flex items-baseline justify-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                  <span className="text-2xl sm:text-4xl font-black text-mjs-dark">${item.salePrice}</span>
                  <span className="text-xs sm:text-base text-mjs-gray-400 line-through">${item.originalPrice.toFixed(2)}</span>
                </div>

                {/* Button */}
                <button
                  onClick={() => handleAdd(item)}
                  disabled={!active}
                  className={`inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-7 py-2 sm:py-3 rounded-lg text-xs sm:text-base font-bold transition-all ${
                    justAdded || inCart
                      ? "bg-emerald-500 text-white"
                      : active
                      ? "bg-mjs-dark hover:bg-gray-800 text-white"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {justAdded || inCart ? (
                    <><Check className="w-4 h-4" /> Added</>
                  ) : (
                    <><ShoppingCart className="w-4 h-4" /> Add to Cart</>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Bundle */}
        <div className="mt-10 border-t border-gray-100 pt-8 text-center">
          <div className="text-xs font-bold text-mjs-gray-400 uppercase tracking-wider mb-2">Take all three</div>
          <div className="flex items-baseline justify-center gap-3 mb-1">
            <span className="text-5xl font-black text-mjs-dark">${SALE_CONFIG.bundlePrice}</span>
            <span className="text-lg text-mjs-gray-400 line-through">${totalOriginal.toFixed(2)}</span>
          </div>
          <p className="text-sm text-mjs-gray-400 mb-5">You keep ${totalSave.toFixed(2)}</p>
          <button
            onClick={handleAddAll}
            disabled={!active || missingItems.length === 0}
            className={`inline-flex items-center gap-2 px-10 py-3.5 rounded-xl text-sm font-bold transition-all ${
              missingItems.length === 0
                ? "bg-emerald-500 text-white"
                : active
                ? "bg-mjs-red hover:bg-red-700 text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {missingItems.length === 0 ? (
              <><Check className="w-4 h-4" /> All 3 in Cart</>
            ) : (
              <><ShoppingCart className="w-4 h-4" /> Add All 3 to Cart</>
            )}
          </button>
        </div>
      </div>

      </div>

      {/* ═══ Recommended ═══ */}
      <div className="bg-mjs-gray-50 border-t border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-10 sm:py-14">
          <h2 className="text-xl font-bold text-mjs-dark mb-1">Pair With Your Order</h2>
          <p className="text-sm text-mjs-gray-400 mb-6">Equipment and chemicals that go with the essentials above.</p>

          {loadingRec ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-mjs-red animate-spin" />
            </div>
          ) : recommended.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {recommended.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
