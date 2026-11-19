"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { ArrowRight, Check, ShoppingCart, Phone } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { GuideProduct } from "@/lib/guide-products";

/*
 * Shared building blocks for the five resource guides so they read as one
 * family: pastel illustrated hero, numbered editorial sections, product
 * tiles with real photos + Add to cart, soft callouts, navy footer CTA.
 * Deliberately plain: no glass cards, no gradient bands, no pill badges.
 */

/* ── Hero ─────────────────────────────────────────────────────── */
export function GuideHero({ eyebrow, title, lede, art, tint, crumb, children }: {
  eyebrow: string; title: ReactNode; lede: string; art: string; tint: string; crumb: string; children?: ReactNode;
}) {
  return (
    <header style={{ background: tint }}>
      <div className="max-w-[1400px] mx-auto px-4 pt-6 pb-10 md:pt-8 md:pb-14">
        <nav className="text-[13px] text-mjs-dark/60 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-mjs-dark">Home</Link>
          <span>/</span>
          <Link href="/resources" className="hover:text-mjs-dark">Guides &amp; Resources</Link>
          <span>/</span>
          <span className="text-mjs-dark font-semibold">{crumb}</span>
        </nav>
        <div className="grid md:grid-cols-[1.1fr_1fr] gap-8 md:gap-12 items-center">
          <div>
            <p className="text-[12px] font-black uppercase tracking-[3px] text-mjs-red mb-3">{eyebrow}</p>
            <h1 className="text-[2.4rem] leading-[1.02] md:text-[3.6rem] font-black tracking-tight text-mjs-dark text-balance">{title}</h1>
            <p className="mt-5 text-[17px] md:text-[19px] leading-relaxed text-mjs-dark/75 max-w-[52ch]">{lede}</p>
            {children && <div className="mt-7">{children}</div>}
          </div>
          <div className="relative aspect-[3/2] w-full max-w-[640px] md:justify-self-end">
            <Image src={art} alt="" fill priority sizes="(max-width: 768px) 100vw, 640px" className="object-contain" />
          </div>
        </div>
      </div>
    </header>
  );
}

/* ── Sticky in-page nav ───────────────────────────────────────── */
export function GuideNav({ items }: { items: { id: string; label: string }[] }) {
  return (
    <div className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-gray-100">
      <nav className="max-w-[1400px] mx-auto px-4 flex gap-1 overflow-x-auto scrollbar-hide">
        {items.map((i) => (
          <a key={i.id} href={`#${i.id}`} className="shrink-0 px-3 py-3 text-[13px] font-bold text-mjs-dark/70 hover:text-mjs-red border-b-2 border-transparent hover:border-mjs-red transition-colors">
            {i.label}
          </a>
        ))}
      </nav>
    </div>
  );
}

/* ── Section wrapper with big faint numeral ───────────────────── */
export function GuideSection({ id, n, title, intro, children, tint, className = "" }: {
  id: string; n?: string; title: ReactNode; intro?: string; children: ReactNode; tint?: string; className?: string;
}) {
  return (
    <section id={id} className={`scroll-mt-14 ${className}`} style={tint ? { background: tint } : undefined}>
      <div className="max-w-[1400px] mx-auto px-4 py-14 md:py-20">
        <div className="grid md:grid-cols-[auto_1fr] gap-x-6 items-start mb-8 md:mb-10">
          {n && <span className="hidden md:block text-[72px] leading-none font-black text-mjs-dark/10 select-none -mt-2">{n}</span>}
          <div>
            <h2 className="text-[1.9rem] md:text-[2.4rem] font-black tracking-tight text-mjs-dark text-balance leading-[1.05]">{title}</h2>
            {intro && <p className="mt-3 text-[16px] md:text-[17px] text-mjs-dark/70 max-w-[62ch] leading-relaxed">{intro}</p>}
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}

/* ── Callouts ─────────────────────────────────────────────────── */
export function Callout({ kind = "tip", title, children }: { kind?: "tip" | "warn" | "danger"; title: string; children: ReactNode }) {
  const style = kind === "danger" ? "bg-[#fde8e8] text-[#7a1d1d]" : kind === "warn" ? "bg-[#fff3cc] text-[#6b4a00]" : "bg-[#e7f0ff] text-[#173a78]";
  return (
    <div className={`rounded-2xl px-6 py-5 ${style}`}>
      <p className="font-black text-[15px] mb-1">{title}</p>
      <div className="text-[15px] leading-relaxed opacity-90">{children}</div>
    </div>
  );
}

/* ── Product tile with photo + Add to cart ────────────────────── */
export function ProductTile({ p, note, tag, compact = false }: { p?: GuideProduct; note?: string; tag?: string; compact?: boolean }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  if (!p) return null;
  const add = () => {
    addItem({ slug: p.slug, sku: p.sku, name: p.cardTitle, brand: p.brand, price: p.price, image: p.image, pack: p.pack }, 1, p.category);
    setAdded(true); setTimeout(() => setAdded(false), 1800);
  };
  return (
    <div className={`bg-white rounded-2xl flex ${compact ? "items-center gap-4 p-3" : "flex-col p-4"}`}>
      <Link href={`/product/${p.slug}`} className={`relative shrink-0 bg-white ${compact ? "w-20 h-20" : "w-full aspect-square"}`}>
        {p.image ? <Image src={p.image} alt={p.cardTitle} fill sizes={compact ? "80px" : "260px"} className={p.imageFit === "cover" ? "object-cover" : "object-contain p-2"} /> : null}
      </Link>
      <div className={`min-w-0 flex-1 flex flex-col ${compact ? "" : "mt-3"}`}>
        {tag && <span className="text-[11px] font-black uppercase tracking-wider text-mjs-red mb-1">{tag}</span>}
        <Link href={`/product/${p.slug}`} className="text-[14px] font-bold leading-snug text-mjs-dark hover:text-mjs-red line-clamp-2">{p.cardTitle}</Link>
        {note && <p className="text-[12.5px] text-mjs-dark/60 mt-0.5">{note}</p>}
        <div className={`flex items-center justify-between gap-3 ${compact ? "mt-1.5" : "mt-auto pt-3"}`}>
          <div>
            <span className="text-[17px] font-black text-mjs-dark">${p.price.toFixed(2)}</span>
            <span className="ml-1.5 text-[12px] text-mjs-dark/55">{p.pack}</span>
          </div>
          <button type="button" onClick={add} className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[12.5px] font-bold transition-colors ${added ? "bg-emerald-600 text-white" : "bg-mjs-dark text-white hover:bg-black"}`}>
            {added ? <><Check className="w-3.5 h-3.5" /> Added</> : <><ShoppingCart className="w-3.5 h-3.5" /> Add</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Footer CTA ───────────────────────────────────────────────── */
export function GuideCta({ title, text, href, label }: { title: string; text: string; href: string; label: string }) {
  return (
    <section className="bg-mjs-dark">
      <div className="max-w-[1400px] mx-auto px-4 py-14 md:py-16 grid md:grid-cols-[1fr_auto] gap-8 items-center">
        <div>
          <h2 className="text-[1.8rem] md:text-[2.2rem] font-black tracking-tight text-white text-balance">{title}</h2>
          <p className="mt-2 text-[16px] text-white/70 max-w-[60ch]">{text}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href={href} className="inline-flex items-center gap-2 rounded-full bg-[#fecd02] px-6 py-3.5 text-[15px] font-black text-mjs-dark hover:bg-[#ffd836] transition-colors">
            {label} <ArrowRight className="w-4 h-4" />
          </Link>
          <a href="tel:+17147792640" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-[15px] font-bold text-white hover:bg-white/10 transition-colors">
            <Phone className="w-4 h-4" /> (714) 779-2640
          </a>
        </div>
      </div>
    </section>
  );
}

/* ── Small helpers ────────────────────────────────────────────── */
export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-[11px] font-black uppercase tracking-[2.5px] text-mjs-dark/50 mb-2">{children}</p>;
}
