"use client";

import { useRef, useState } from "react";
import { ShoppingCart, ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";

function FeaturedCard({ product }: { product: (typeof products)[0] }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="flex-shrink-0 w-[190px] bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-[0_0_12px_rgba(0,0,0,0.1)] transition-all group relative">
      {product.badge && (
        <div className={`absolute top-2 left-2 z-10 ${product.badgeColor} text-white text-[9px] font-bold px-2 py-0.5 rounded`}>
          {product.badge}
        </div>
      )}
      <a href={`/product/${product.slug}`} className="block h-[160px] bg-white overflow-hidden">
        <img src={product.images[0]} alt={product.cardTitle} className={`w-full h-full ${product.imageFit === "contain" ? "object-contain p-2" : "object-cover"}`} />
      </a>
      <div className="p-3">
        <a href={`/product/${product.slug}`}>
          <h3 className="text-xs font-semibold text-mjs-gray-800 leading-snug line-clamp-1 group-hover:text-mjs-red transition-colors">{product.cardTitle}</h3>
        </a>
        <div className="mt-1.5">
          <span className="text-base font-bold text-mjs-dark">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[11px] text-mjs-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
              <span className="text-[11px] font-bold text-mjs-green">{discount}% OFF</span>
            </div>
          )}
        </div>
        <div className="text-[11px] font-medium text-mjs-gray-500 mt-0.5">{product.pack}</div>
        <div className="flex items-center gap-1.5 mt-2.5">
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-6 h-7 flex items-center justify-center hover:bg-gray-100 transition-colors">
              <Minus className="w-2.5 h-2.5 text-mjs-gray-500" />
            </button>
            <span className="w-7 h-7 flex items-center justify-center text-[10px] font-bold text-mjs-dark border-x border-gray-200 bg-mjs-gray-50">{qty}</span>
            <button onClick={() => setQty(qty + 1)} className="w-6 h-7 flex items-center justify-center hover:bg-gray-100 transition-colors">
              <Plus className="w-2.5 h-2.5 text-mjs-gray-500" />
            </button>
          </div>
          <button
            onClick={() => { addItem({ slug: product.slug, name: product.cardTitle, brand: product.brand, price: product.price, image: product.images[0], pack: product.pack }, qty); setQty(1); }}
            className="flex-1 bg-white border border-mjs-red text-mjs-red font-semibold py-1.5 rounded-lg text-[10px] hover:bg-mjs-red hover:text-white transition-all flex items-center justify-center gap-1"
          >
            <ShoppingCart className="w-3 h-3" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedProducts() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: dir === "left" ? -400 : 400, behavior: "smooth" });
  };

  return (
    <section className="bg-white py-6 border-t border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-mjs-dark">Best Sellers</h2>
          <div className="flex items-center gap-2">
            <a href="#" className="text-xs font-semibold text-mjs-red hover:text-mjs-red-dark transition-colors mr-2">View All &rarr;</a>
            <button onClick={() => scroll("left")} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
              <ChevronLeft className="w-4 h-4 text-mjs-gray-600" />
            </button>
            <button onClick={() => scroll("right")} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
              <ChevronRight className="w-4 h-4 text-mjs-gray-600" />
            </button>
          </div>
        </div>
        <div ref={scrollRef} className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {products.filter((_, i) => i % 2 === 0).map((product) => (
            <FeaturedCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
