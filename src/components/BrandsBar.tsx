"use client";

import { useRef } from "react";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";

function ProductCard({ product }: { product: (typeof products)[0] }) {
  const { addItem } = useCart();
  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <div className="flex-shrink-0 w-[190px] bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-[0_0_12px_rgba(0,0,0,0.1)] transition-all group relative">
      {product.badge && (
        <div
          className={`absolute top-2 left-2 z-10 ${product.badgeColor} text-white text-[9px] font-bold px-2 py-0.5 rounded`}
        >
          {product.badge}
        </div>
      )}

      <a href={`/product/${product.slug}`} className="block h-[160px] bg-white overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.cardTitle}
          className={`w-full h-full ${product.imageFit === "contain" ? "object-contain p-2" : "object-cover"}`}
        />
      </a>

      <div className="p-3">
        <a href={`/product/${product.slug}`}>
          <h3 className="text-xs font-semibold text-mjs-gray-800 leading-snug line-clamp-1 group-hover:text-mjs-red transition-colors">
            {product.cardTitle}
          </h3>
        </a>

        <div className="mt-1.5">
          <span className="text-base font-bold text-mjs-dark">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[11px] text-mjs-gray-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
              <span className="text-[11px] font-bold text-mjs-green">
                {discount}% OFF
              </span>
            </div>
          )}
        </div>

        <div className="text-[11px] font-medium text-mjs-gray-500 mt-0.5">
          {product.pack}
        </div>

        <button
          onClick={() => addItem({
            slug: product.slug,
            name: product.cardTitle,
            brand: product.brand,
            price: product.price,
            image: product.images[0],
            pack: product.pack,
          })}
          className="w-full mt-2.5 bg-white border border-mjs-red text-mjs-red font-semibold py-1.5 rounded-lg text-xs hover:bg-mjs-red hover:text-white transition-all flex items-center justify-center gap-1.5"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default function BrandsBar() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -400 : 400,
      behavior: "smooth",
    });
  };

  // Ready to Ship: only Janitors Finest chemicals & paper products
  const readyToShip = products.filter(
    (p) => p.brand === "Janitors Finest" && (p.category === "Cleaning Chemicals" || p.category === "Paper & Restroom")
  );

  return (
    <section className="bg-white py-6 border-t border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold text-mjs-dark">Ready to Ship</h2>
            <span className="bg-mjs-red text-white text-[9px] font-bold px-2 py-0.5 rounded tracking-wide">
              SHIPS IN 24 HRS
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="#"
              className="text-xs font-semibold text-mjs-red hover:text-mjs-red-dark transition-colors mr-2"
            >
              View All &rarr;
            </a>
            <button
              onClick={() => scroll("left")}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-mjs-gray-600" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-mjs-gray-600" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide pb-2"
        >
          {readyToShip.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
