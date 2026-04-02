"use client";

import { useState } from "react";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { ProductData } from "@/data/products";

export default function ProductCard({ product }: { product: ProductData }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group relative flex flex-col">
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

      <div className="p-4 flex flex-col flex-1">
        <div className="text-[10px] font-medium text-mjs-gray-400 uppercase tracking-wide">
          {product.brand}
        </div>
        <a href={`/product/${product.slug}`}>
          <h3 className="text-sm font-semibold text-mjs-gray-800 leading-snug mt-1 group-hover:text-mjs-red transition-colors">
            {product.cardTitle}
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
              onClick={() => {
                addItem({
                  slug: product.slug,
                  name: product.cardTitle,
                  brand: product.brand,
                  price: product.price,
                  image: product.images[0],
                  pack: product.pack,
                }, qty);
                setQty(1);
              }}
              className="flex-1 bg-white border border-mjs-red text-mjs-red font-semibold py-2 rounded-lg text-xs hover:bg-mjs-red hover:text-white transition-all flex items-center justify-center gap-1.5"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
