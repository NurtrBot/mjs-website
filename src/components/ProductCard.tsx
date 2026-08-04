"use client";

import { useState } from "react";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { usePurchases } from "@/context/PurchaseContext";
import type { ProductData } from "@/data/products";
import { useAuth } from "@/context/AuthContext";
import { trackAddToCart } from "@/lib/analytics";
import { getTierPrice } from "@/lib/tier-pricing";
import ProductImage from "@/components/ProductImage";

function formatCardName(name: string): string {
  let clean = name.replace(/\s*\([A-Z0-9-]+\)\s*$/, "");
  clean = clean.replace(/[®™]/g, "");
  if (clean === clean.toUpperCase() && clean.length > 5) {
    clean = clean.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
    clean = clean.replace(/\b(Oz|Ply|Ft|Qt|Gal|Mil|Ct|Cs|Bx|Pk|Jr|Hd|Ups|Sds|Epa)\b/gi, m => m.toUpperCase());
  }
  if (clean.length > 80) clean = clean.slice(0, 77) + "...";
  return clean.trim();
}

export default function ProductCard({ product }: { product: ProductData }) {
  const { addItem } = useCart();
  const { getPurchaseDate } = usePurchases();
  const { getCustomPrice } = useAuth();
  const [qty, setQty] = useState(1);
  const customPrice = getCustomPrice(product.sku);
  const displayPrice = customPrice || product.price;
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  const purchasedDate = getPurchaseDate(product.sku);

  const handleAdd = () => {
    const tierPrice = customPrice || getTierPrice(product, qty);
    addItem({
      slug: product.slug,
      sku: product.sku,
      name: product.cardTitle,
      brand: product.brand,
      price: tierPrice,
      image: product.images[0],
      pack: product.pack,
    }, qty);
    trackAddToCart({ sku: product.sku, name: product.cardTitle, price: tierPrice, quantity: qty, category: product.category, brand: product.brand });
    setQty(1);
  };

  return (
    <>
      {/* ═══ MOBILE: Expanded list row ═══ */}
      <div className="sm:hidden border-b border-gray-200 py-4 px-3">
        {/* Image + Details */}
        <div className="flex gap-3">
          {/* Image + SKU */}
          <div className="flex-shrink-0 w-[120px]">
            <a href={`/product/${product.slug}`} className="relative w-[120px] h-[120px] block bg-white rounded-lg overflow-hidden">
              <ProductImage
                src={product.images[0]}
                alt={product.cardTitle}
                sku={product.sku}
                imageFit={product.imageFit}
                sizes="120px"
                noPadding
              />
            </a>
            <div className="text-[10px] text-mjs-gray-400 text-center mt-1.5 font-medium">{product.sku}</div>
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <a href={`/product/${product.slug}`}>
              <h3 className="text-sm font-bold text-mjs-blue leading-snug line-clamp-2">
                {formatCardName(product.name)}
              </h3>
            </a>

            {/* Specs mini-table */}
            <div className="mt-1.5 space-y-0.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-mjs-gray-400 font-semibold uppercase tracking-wide">Brand</span>
                <span className="text-mjs-gray-700 font-medium">{product.brand}</span>
              </div>
              {product.pack && (
                <div className="flex justify-between text-[11px]">
                  <span className="text-mjs-gray-400 font-semibold uppercase tracking-wide">Pack</span>
                  <span className="text-mjs-gray-700 font-medium">{product.pack}</span>
                </div>
              )}
              {Object.entries(product.specs || {}).slice(0, 2).map(([key, value]) => (
                <div key={key} className="flex justify-between text-[11px]">
                  <span className="text-mjs-gray-400 font-semibold uppercase tracking-wide">{key}</span>
                  <span className="text-mjs-gray-700 font-medium text-right">{value}</span>
                </div>
              ))}
              {/* Price row */}
              <div className="flex justify-between items-baseline text-[11px] pt-0.5">
                <span className="text-mjs-gray-400 font-semibold uppercase tracking-wide">Price</span>
                <span className="text-[13px] font-extrabold text-mjs-green text-right">
                  ${displayPrice.toFixed(2)}
                  {customPrice && customPrice < product.price ? (
                    <span className="text-[8px] font-bold text-blue-600 bg-blue-50 px-1 py-0.5 rounded ml-1">YOUR PRICE</span>
                  ) : product.originalPrice ? (
                    <span className="text-[9px] font-bold text-mjs-green ml-1">{discount}% OFF</span>
                  ) : null}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Qty + Add row */}
        <div className="flex items-center gap-2 mt-3">
          <div className="flex items-center rounded overflow-hidden flex-shrink-0">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="w-9 h-9 flex items-center justify-center bg-gray-600 text-white active:bg-gray-700"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <input
              type="text"
              inputMode="numeric"
              value={qty}
              onChange={(e) => { const val = e.target.value.replace(/[^0-9]/g, ""); if (val === "") { setQty(0); return; } const n = parseInt(val); if (n >= 0) setQty(n); }}
              onBlur={() => { if (qty < 1) setQty(1); }}
              onFocus={(e) => e.target.select()}
              className="w-12 h-9 text-center text-sm font-bold border-y border-gray-300 outline-none"
            />
            <button
              onClick={() => setQty(qty + 1)}
              className="w-9 h-9 flex items-center justify-center bg-gray-600 text-white active:bg-gray-700"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <button
            onClick={handleAdd}
            className="flex-1 bg-mjs-red text-white font-bold text-sm h-9 rounded active:bg-red-700 transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      {/* ═══ DESKTOP: Card grid ═══ */}
      <div className="hidden sm:flex bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group relative flex-col">
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

        <a href={`/product/${product.slug}`} className="block h-[200px] bg-white overflow-hidden relative">
          <ProductImage
            src={product.images[0]}
            alt={product.cardTitle}
            sku={product.sku}
            imageFit={product.imageFit}
            sizes="(max-width: 1024px) 50vw, 25vw"
          />
        </a>

        <div className="p-4 flex flex-col flex-1">
          <div className="text-[10px] font-medium text-mjs-gray-400 uppercase tracking-wide">
            {product.sku}
          </div>
          <a href={`/product/${product.slug}`}>
            <h3 className="text-xs font-semibold text-mjs-gray-800 leading-snug mt-1 group-hover:text-mjs-red transition-colors line-clamp-2">
              {formatCardName(product.name)}
            </h3>
          </a>

          <div className="mt-auto pt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-mjs-dark">
                ${displayPrice.toFixed(2)}
              </span>
              {customPrice && customPrice < product.price ? (
                <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                  YOUR PRICE
                </span>
              ) : product.originalPrice ? (
                <>
                  <span className="text-xs text-mjs-gray-400 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                  <span className="text-xs font-bold text-mjs-green">
                    {discount}% OFF
                  </span>
                </>
              ) : null}
            </div>

            <div className="text-[11px] font-medium text-mjs-gray-500 mt-0.5">
              {product.pack}
            </div>

            {/* Qty + Add to Cart */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-7 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <Minus className="w-3 h-3 text-mjs-gray-500" />
                </button>
                <span className="w-8 h-8 flex items-center justify-center text-xs font-bold text-mjs-dark border-x border-gray-200 bg-mjs-gray-50">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-7 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <Plus className="w-3 h-3 text-mjs-gray-500" />
                </button>
              </div>
              <button
                onClick={handleAdd}
                className="flex-1 bg-white border border-mjs-red text-mjs-red font-semibold py-2 rounded-lg text-xs hover:bg-mjs-red hover:text-white transition-all flex items-center justify-center gap-1.5"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
