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

  const qtyInput = (
    <div className="flex items-center rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
      <button
        onClick={() => setQty(Math.max(1, qty - 1))}
        className="w-9 h-9 sm:w-7 sm:h-8 flex items-center justify-center bg-gray-600 text-white active:bg-gray-700 sm:bg-white sm:text-mjs-gray-500 sm:hover:bg-gray-100 transition-colors"
        aria-label="Decrease quantity"
      >
        <Minus className="w-3.5 h-3.5 sm:w-3 sm:h-3" />
      </button>
      <input
        type="text"
        inputMode="numeric"
        value={qty}
        onChange={(e) => { const val = e.target.value.replace(/[^0-9]/g, ""); if (val === "") { setQty(0); return; } const n = parseInt(val); if (n >= 0) setQty(n); }}
        onBlur={() => { if (qty < 1) setQty(1); }}
        onFocus={(e) => e.target.select()}
        className="w-12 h-9 sm:w-8 sm:h-8 text-center text-sm sm:text-xs font-bold text-mjs-dark border-x border-gray-200 bg-white sm:bg-mjs-gray-50 outline-none"
        aria-label="Quantity"
      />
      <button
        onClick={() => setQty(qty + 1)}
        className="w-9 h-9 sm:w-7 sm:h-8 flex items-center justify-center bg-gray-600 text-white active:bg-gray-700 sm:bg-white sm:text-mjs-gray-500 sm:hover:bg-gray-100 transition-colors"
        aria-label="Increase quantity"
      >
        <Plus className="w-3.5 h-3.5 sm:w-3 sm:h-3" />
      </button>
    </div>
  );

  // One card for every screen size: a list row on phones, a grid card from `sm` up.
  return (
    <div className="relative border-b border-gray-200 py-4 px-3 sm:p-0 sm:flex sm:flex-col sm:bg-white sm:rounded-xl sm:border sm:border-gray-100 sm:overflow-hidden sm:hover:shadow-lg transition-all group">
      {purchasedDate && (
        <div className="absolute top-2 right-2 z-10 bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
          Purchased {purchasedDate}
        </div>
      )}
      {product.badge && (
        <div className={`hidden sm:block absolute top-2 left-2 z-10 ${product.badgeColor} text-white text-[9px] font-bold px-2 py-0.5 rounded`}>
          {product.badge}
        </div>
      )}

      <div className="flex gap-3 sm:block">
        {/* Image + SKU */}
        <div className="flex-shrink-0 w-[120px] sm:w-auto">
          <a href={`/product/${product.slug}`} className="relative block w-[120px] h-[120px] sm:w-auto sm:h-[200px] bg-white rounded-lg sm:rounded-none overflow-hidden">
            <ProductImage
              src={product.images[0]}
              alt={product.cardTitle}
              sku={product.sku}
              imageFit={product.imageFit}
              sizes="(max-width: 640px) 120px, (max-width: 1024px) 50vw, 25vw"
            />
          </a>
          <div className="text-[10px] text-mjs-gray-400 text-center mt-1.5 font-medium sm:hidden">{product.sku}</div>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0 sm:p-4 sm:flex sm:flex-col sm:flex-1">
          <div className="hidden sm:block text-[10px] font-medium text-mjs-gray-400 uppercase tracking-wide">{product.sku}</div>
          <a href={`/product/${product.slug}`}>
            <h3 className="text-sm sm:text-xs font-bold sm:font-semibold text-mjs-blue sm:text-mjs-gray-800 leading-snug sm:mt-1 group-hover:text-mjs-red transition-colors line-clamp-2">
              {formatCardName(product.name)}
            </h3>
          </a>

          {/* Phone-only spec rows */}
          <div className="mt-1.5 space-y-0.5 sm:hidden">
            {product.brand && (
              <div className="flex justify-between text-[11px]">
                <span className="text-mjs-gray-400 font-semibold uppercase tracking-wide">Brand</span>
                <span className="text-mjs-gray-700 font-medium">{product.brand}</span>
              </div>
            )}
            {Object.entries(product.specs || {}).slice(0, 2).map(([key, value]) => (
              <div key={key} className="flex justify-between text-[11px]">
                <span className="text-mjs-gray-400 font-semibold uppercase tracking-wide">{key}</span>
                <span className="text-mjs-gray-700 font-medium text-right">{value}</span>
              </div>
            ))}
          </div>

          <div className="sm:mt-auto sm:pt-3">
            <div className="flex justify-between items-baseline sm:justify-start sm:gap-2 text-[11px] pt-0.5 sm:pt-0">
              <span className="text-mjs-gray-400 font-semibold uppercase tracking-wide sm:hidden">Price</span>
              <span className="text-[13px] sm:text-lg font-extrabold sm:font-bold text-mjs-green sm:text-mjs-dark">
                ${displayPrice.toFixed(2)}
              </span>
              {customPrice && customPrice < product.price ? (
                <span className="text-[8px] sm:text-[9px] font-bold text-blue-600 bg-blue-50 px-1 sm:px-1.5 py-0.5 rounded ml-1 sm:ml-0">YOUR PRICE</span>
              ) : product.originalPrice ? (
                <>
                  <span className="hidden sm:inline text-xs text-mjs-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                  <span className="text-[9px] sm:text-xs font-bold text-mjs-green ml-1 sm:ml-0">{discount}% OFF</span>
                </>
              ) : null}
            </div>
            {product.pack && (
              <div className="flex justify-between sm:block text-[11px] font-medium text-mjs-gray-500 mt-0.5">
                <span className="text-mjs-gray-400 font-semibold uppercase tracking-wide sm:hidden">Pack</span>
                <span className="text-mjs-gray-700 sm:text-mjs-gray-500">{product.pack}</span>
              </div>
            )}

            {/* Qty + Add to Cart */}
            <div className="flex items-center gap-2 mt-3">
              {qtyInput}
              <button
                onClick={handleAdd}
                className="flex-1 h-9 sm:h-auto sm:py-2 rounded-lg text-sm sm:text-xs font-bold sm:font-semibold bg-mjs-red text-white active:bg-red-700 sm:bg-white sm:border sm:border-mjs-red sm:text-mjs-red sm:hover:bg-mjs-red sm:hover:text-white transition-all flex items-center justify-center gap-1.5"
              >
                <ShoppingCart className="hidden sm:block w-3.5 h-3.5" />
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
