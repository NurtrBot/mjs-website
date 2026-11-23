"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ShoppingCart, Minus, Plus, RotateCcw, Check } from "lucide-react";
import ProductImage from "@/components/ProductImage";
import StripBar from "@/components/StripBar";
import { getTierPrice } from "@/lib/tier-pricing";
import type { ProductData } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import type { HistoryItem } from "@/app/api/customers/history/route";

/*
 * Signed-in homepage strips, all fed by one request to /api/customers/history:
 *
 *   <BuyItAgain>     "Buy it again"               — in place of Best Sellers
 *   <DueForRestock>  "Due for a restock"          — in place of Ready to Ship (2+ items due)
 *   <AlsoBuy>        "Customers like you also buy" — extra cross-sell strip
 *
 * Each takes a `fallback` to render for visitors who are signed out, have no
 * order history yet, or while the history is still loading (a skeleton shows
 * during the load so the page doesn't jump).
 */

export interface History { items: HistoryItem[]; due: HistoryItem[]; alsoBuy: ProductData[]; orderCount: number }

const EMPTY: History = { items: [], due: [], alsoBuy: [], orderCount: 0 };
const cache = new Map<number, Promise<History>>();

export function loadHistory(customerId: number): Promise<History> {
  let p = cache.get(customerId);
  if (!p) {
    p = fetch(`/api/customers/history?customerId=${customerId}`)
      .then(r => r.json())
      .then(d => ({ items: d.items || [], due: d.due || [], alsoBuy: d.alsoBuy || [], orderCount: d.orderCount || 0 }))
      .catch(() => EMPTY);
    cache.set(customerId, p);
  }
  return p;
}

type State = { status: "anon" } | { status: "loading" } | { status: "ready"; data: History };

function useHistory(): State {
  const { user, isLoggedIn } = useAuth();
  const id = isLoggedIn ? user?.id : undefined;
  const [state, setState] = useState<State>(id ? { status: "loading" } : { status: "anon" });
  useEffect(() => {
    if (!id) { setState({ status: "anon" }); return; }
    let live = true;
    setState({ status: "loading" });
    loadHistory(id).then(data => { if (live) setState({ status: "ready", data }); });
    return () => { live = false; };
  }, [id]);
  return state;
}

/* ── helpers ── */

function formatCardName(name: string): string {
  let clean = name.replace(/\s*\([A-Z0-9-]+\)\s*$/, "").replace(/[®™]/g, "");
  if (clean === clean.toUpperCase() && clean.length > 5) {
    clean = clean.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
    clean = clean.replace(/\b(Oz|Ply|Ft|Qt|Gal|Mil|Ct|Cs|Bx|Pk|Jr|Hd|Ups|Sds|Epa)\b/gi, m => m.toUpperCase());
  }
  if (clean.length > 80) clean = clean.slice(0, 77) + "...";
  return clean.trim();
}

const shortDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });

function cadenceLabel(gapDays: number | null): string | null {
  if (!gapDays) return null;
  if (gapDays < 11) return "about weekly";
  if (gapDays < 45) return `every ${Math.round(gapDays / 7)} wks`;
  const months = Math.max(1, Math.round(gapDays / 30));
  return months === 1 ? "about monthly" : `every ${months} mo`;
}

/* ── card ── */

function QtyAdd({ product, initialQty, onAdded }: { product: ProductData; initialQty: number; onAdded?: () => void }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(initialQty);
  const [added, setAdded] = useState(false);
  return (
    <div className="flex items-center gap-1.5 mt-2.5">
      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
        <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-6 h-7 flex items-center justify-center hover:bg-gray-100 transition-colors" aria-label="Decrease quantity">
          <Minus className="w-2.5 h-2.5 text-mjs-gray-500" />
        </button>
        <input type="text" inputMode="numeric" value={qty} onChange={(e) => { const v = e.target.value.replace(/[^0-9]/g, ""); setQty(v === "" ? 0 : parseInt(v)); }} onBlur={() => { if (qty < 1) setQty(1); }} onFocus={(e) => e.target.select()} className="w-8 h-7 text-center text-[10px] font-bold text-mjs-dark border-x border-gray-200 bg-mjs-gray-50 outline-none" aria-label="Quantity" />
        <button onClick={() => setQty(qty + 1)} className="w-6 h-7 flex items-center justify-center hover:bg-gray-100 transition-colors" aria-label="Increase quantity">
          <Plus className="w-2.5 h-2.5 text-mjs-gray-500" />
        </button>
      </div>
      <button
        onClick={() => {
          const q = Math.max(1, qty);
          addItem({ slug: product.slug, sku: product.sku, name: product.cardTitle, brand: product.brand, price: getTierPrice(product, q), image: product.images[0], pack: product.pack }, q);
          setAdded(true); setTimeout(() => setAdded(false), 1600); onAdded?.();
        }}
        className={`flex-1 font-semibold py-1.5 rounded-lg text-[10px] transition-all flex items-center justify-center gap-1 border ${added ? "bg-mjs-green border-mjs-green text-white" : "bg-white border-mjs-red text-mjs-red hover:bg-mjs-red hover:text-white"}`}
      >
        {added ? <><Check className="w-3 h-3" /> Added</> : <><ShoppingCart className="w-3 h-3" /> Add</>}
      </button>
    </div>
  );
}

function HistoryCard({ item, showDue }: { item: HistoryItem; showDue: boolean }) {
  const { product } = item;
  const cadence = cadenceLabel(item.gapDays);
  return (
    <div className="flex-shrink-0 w-[190px] md:w-[calc((100%-48px)/5)] bg-white rounded-xl overflow-hidden group relative">
      {showDue && item.due && (
        <div className={`absolute top-2 left-2 z-10 text-white text-[9px] font-bold px-2 py-0.5 rounded-full ${item.due === "overdue" ? "bg-mjs-red" : "bg-amber-500"}`}>
          {item.due === "overdue" ? "Overdue" : "Due now"}
        </div>
      )}
      {item.orders > 1 && (
        <div className="absolute top-2 right-2 z-10 bg-mjs-dark/80 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
          Ordered {item.orders}×
        </div>
      )}
      <a href={`/product/${product.slug}`} className="block h-[160px] md:h-[230px] bg-white overflow-hidden relative">
        <ProductImage src={product.images[0]} alt={product.cardTitle} sku={product.sku} imageFit={product.imageFit} sizes="(max-width: 768px) 50vw, 300px" />
      </a>
      <div className="p-3">
        <a href={`/product/${product.slug}`}>
          <h3 className="text-xs md:text-[13px] font-semibold text-mjs-gray-800 leading-snug line-clamp-2 group-hover:text-mjs-red transition-colors">{formatCardName(product.name)}</h3>
        </a>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="text-base md:text-lg font-bold text-mjs-dark">${product.price.toFixed(2)}</span>
          <span className="text-[11px] font-medium text-mjs-gray-500">{product.pack}</span>
        </div>
        <div className="mt-1 text-[11px] text-mjs-gray-500 truncate">
          Last ordered {shortDate(item.lastDate)}{cadence ? <> <span className="text-mjs-gray-300">·</span> {cadence}</> : null}
        </div>
        <QtyAdd product={product} initialQty={item.usualQty} />
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: ProductData }) {
  return (
    <div className="flex-shrink-0 w-[190px] md:w-[calc((100%-48px)/5)] bg-white rounded-xl overflow-hidden group relative">
      <a href={`/product/${product.slug}`} className="block h-[160px] md:h-[230px] bg-white overflow-hidden relative">
        <ProductImage src={product.images[0]} alt={product.cardTitle} sku={product.sku} imageFit={product.imageFit} sizes="(max-width: 768px) 50vw, 300px" />
      </a>
      <div className="p-3">
        <a href={`/product/${product.slug}`}>
          <h3 className="text-xs md:text-[13px] font-semibold text-mjs-gray-800 leading-snug line-clamp-2 group-hover:text-mjs-red transition-colors">{formatCardName(product.name)}</h3>
        </a>
        <div className="mt-1.5"><span className="text-base md:text-lg font-bold text-mjs-dark">${product.price.toFixed(2)}</span></div>
        <div className="text-[11px] font-medium text-mjs-gray-500 mt-0.5">{product.pack}</div>
        <QtyAdd product={product} initialQty={1} />
      </div>
    </div>
  );
}

/* ── strip chrome ── */

function Strip({ title, subtitle, action, track, children }: { title: ReactNode; subtitle?: string; action?: ReactNode; track: string; children: ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") => scrollRef.current?.scrollBy({ left: dir === "left" ? -400 : 400, behavior: "smooth" });
  return (
    <section data-track={track} className="bg-white pt-6 pb-2 md:pb-6">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="rounded-2xl bg-[#f6f7f9] overflow-hidden">
          <StripBar title={title} subtitle={subtitle} action={action} onLeft={() => scroll("left")} onRight={() => scroll("right")} />
          <div ref={scrollRef} className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pt-2 pb-3 [mask-image:linear-gradient(to_right,black_calc(100%-16px),transparent)]">{children}</div>
        </div>
      </div>
    </section>
  );
}

function StripSkeleton() {
  return (
    <section className="bg-white pt-6 pb-2 md:pb-6" aria-hidden="true">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <div className="h-5 w-40 rounded bg-mjs-gray-100 animate-pulse" />
          <div className="flex gap-2"><div className="w-8 h-8 rounded-full bg-mjs-gray-100" /><div className="w-8 h-8 rounded-full bg-mjs-gray-100" /></div>
        </div>
        <div className="flex gap-3 overflow-hidden pb-2">
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} className="flex-shrink-0 w-[190px] md:w-[calc((100%-48px)/5)] rounded-xl overflow-hidden">
              <div className="h-[160px] md:h-[230px] bg-mjs-gray-100 animate-pulse" />
              <div className="p-3 space-y-2">
                <div className="h-3 w-5/6 rounded bg-mjs-gray-100" />
                <div className="h-3 w-3/5 rounded bg-mjs-gray-100" />
                <div className="h-5 w-1/3 rounded bg-mjs-gray-100" />
                <div className="h-7 w-full rounded-lg bg-mjs-gray-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── the three strips ── */

export function BuyItAgain({ fallback }: { fallback: ReactNode }) {
  const state = useHistory();
  if (state.status === "anon") return <>{fallback}</>;
  if (state.status === "loading") return <StripSkeleton />;
  const { items } = state.data;
  if (items.length === 0) return <>{fallback}</>;
  return (
    <Strip
      track="buy-it-again"
      title={<><RotateCcw className="w-4 h-4 text-mjs-red" /> Buy it again</>}
      subtitle="Your usual products, with your usual quantities filled in"
      action={<a href="/account?tab=orders" className="text-[13px] font-semibold text-mjs-red hover:text-mjs-red-dark transition-colors mr-2">Order history &rarr;</a>}
    >
      {items.slice(0, 20).map(item => <HistoryCard key={item.product.sku} item={item} showDue />)}
    </Strip>
  );
}

export function DueForRestock({ fallback }: { fallback: ReactNode }) {
  const state = useHistory();
  const { addItem } = useCart();
  const [addedAll, setAddedAll] = useState(false);
  if (state.status === "anon") return <>{fallback}</>;
  if (state.status === "loading") return <StripSkeleton />;
  // A single due item is flagged inside "Buy it again" instead of getting a strip of its own
  const { due } = state.data;
  if (due.length < 2) return <>{fallback}</>;

  const addAll = () => {
    for (const { product, usualQty } of due) {
      addItem({ slug: product.slug, sku: product.sku, name: product.cardTitle, brand: product.brand, price: getTierPrice(product, usualQty), image: product.images[0], pack: product.pack }, usualQty);
    }
    setAddedAll(true); setTimeout(() => setAddedAll(false), 2000);
  };

  return (
    <Strip
      track="due-for-restock"
      title={<>Due for a restock <span className="rounded-full bg-mjs-red px-2 py-0.5 text-[10px] font-bold text-white">{due.length}</span></>}
      subtitle="Based on how often you usually reorder these"
      action={
        <button onClick={addAll} className={`mr-2 inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold text-white transition-colors ${addedAll ? "bg-mjs-green" : "bg-mjs-red hover:bg-mjs-red-dark"}`}>
          {addedAll ? <><Check className="w-3.5 h-3.5" /> Added {due.length} to cart</> : <><ShoppingCart className="w-3.5 h-3.5" /> Add all {due.length} to cart</>}
        </button>
      }
    >
      {due.map(item => <HistoryCard key={item.product.sku} item={item} showDue />)}
    </Strip>
  );
}

export function AlsoBuy() {
  const state = useHistory();
  if (state.status !== "ready") return null;
  const { alsoBuy } = state.data;
  if (alsoBuy.length < 3) return null;
  return (
    <Strip track="also-buy" title="Customers like you also buy" subtitle="Picked from what other businesses order alongside your products">
      {alsoBuy.map(p => <ProductCard key={p.sku} product={p} />)}
    </Strip>
  );
}
