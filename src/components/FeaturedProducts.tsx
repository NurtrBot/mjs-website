"use client";

import { useRef, useState, useEffect } from "react";
import { ShoppingCart, ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import type { ProductData } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { usePurchases } from "@/context/PurchaseContext";
import { trackAddToCart } from "@/lib/analytics";

// Get a "family key" from a product name — strips sizes, colors, quantities to identify duplicates
function getProductFamily(name: string): string {
  return name.toLowerCase()
    .replace(/\b(small|medium|large|x-?large|xl|xxl)\b/gi, "")
    .replace(/\b\d+\s*(oz|gal|qt|ml|fl|lb|ft|"|inch|rolls?|sheets?|ct|pk|bx|cs|per|carton|case)\b/gi, "")
    .replace(/\b(white|black|blue|red|green|yellow|orange|pink|clear|natural|kraft)\b/gi, "")
    .replace(/\b\d+\s*x\s*\d+/g, "")
    .replace(/[®™,\-()]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 40);
}

function formatCardName(name: string): string {
  let clean = name.replace(/\s*\([A-Z0-9-]+\)\s*$/, "").replace(/[®™]/g, "");
  if (clean === clean.toUpperCase() && clean.length > 5) {
    clean = clean.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
    clean = clean.replace(/\b(Oz|Ply|Ft|Qt|Gal|Mil|Ct|Cs|Bx|Pk|Jr|Hd|Ups|Sds|Epa)\b/gi, m => m.toUpperCase());
  }
  if (clean.length > 80) clean = clean.slice(0, 77) + "...";
  return clean.trim();
}

function FeaturedCard({ product }: { product: ProductData }) {
  const { addItem } = useCart();
  const { getPurchaseDate } = usePurchases();
  const [qty, setQty] = useState(1);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  const purchasedDate = getPurchaseDate(product.sku);

  return (
    <div className="flex-shrink-0 w-[190px] bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-[0_0_12px_rgba(0,0,0,0.1)] transition-all group relative">
      {purchasedDate && (
        <div className="absolute top-2 right-2 z-10 bg-blue-600/90 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
          Purchased {purchasedDate}
        </div>
      )}
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
          <h3 className="text-xs font-semibold text-mjs-gray-800 leading-snug line-clamp-2 group-hover:text-mjs-red transition-colors">{formatCardName(product.name)}</h3>
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
            onClick={() => { addItem({ slug: product.slug, sku: product.sku, name: product.cardTitle, brand: product.brand, price: product.price, image: product.images[0], pack: product.pack }, qty); trackAddToCart({ sku: product.sku, name: product.cardTitle, price: product.price, quantity: qty, brand: product.brand }); setQty(1); }}
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
  const [items, setItems] = useState<ProductData[]>([]);
  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: dir === "left" ? -400 : 400, behavior: "smooth" });
  };

  useEffect(() => {
    // Fetch actual best sellers from BC sorted by total_sold
    fetch("/api/products/bestsellers")
      .then(r => r.json())
      .then(data => {
        const products = (data.products || []) as ProductData[];
        const filtered = products.filter((p: ProductData) => p.images?.[0] && !p.images[0].includes("placeholder"));
        // Shuffle for fresh look each visit
        for (let i = filtered.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
        }
        // Dedupe by product family — only one of each type
        const seenFamilies = new Set<string>();
        const diverse = filtered.filter(p => {
          const family = getProductFamily(p.name);
          if (seenFamilies.has(family)) return false;
          seenFamilies.add(family);
          return true;
        });
        setItems(diverse.slice(0, 20));
      })
      .catch(() => {});
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="bg-white py-6 border-t border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-mjs-dark">Best Sellers</h2>
          <div className="flex items-center gap-2">
            <a href="/collection?type=best-sellers" className="text-xs font-semibold text-mjs-red hover:text-mjs-red-dark transition-colors mr-2">View All &rarr;</a>
            <button onClick={() => scroll("left")} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
              <ChevronLeft className="w-4 h-4 text-mjs-gray-600" />
            </button>
            <button onClick={() => scroll("right")} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
              <ChevronRight className="w-4 h-4 text-mjs-gray-600" />
            </button>
          </div>
        </div>
        <div ref={scrollRef} className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {items.map((product) => (
            <FeaturedCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
