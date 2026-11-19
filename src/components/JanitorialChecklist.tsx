"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Printer, ShoppingCart } from "lucide-react";
import { CHECKLIST, MONTHLY, type ChecklistCategoryId } from "@/data/guides/checklist";
import type { GuideProduct } from "@/lib/guide-products";
import { pick } from "@/lib/guide-products";
import { useCart } from "@/context/CartContext";
import { GuideHero, GuideNav, GuideSection, GuideCta, Eyebrow } from "@/components/guides/GuideKit";

const TINT = "#fdf0c9";

function AddButton({ p }: { p: GuideProduct }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  return (
    <div className="shrink-0 flex flex-col items-end gap-1.5">
      <span className="text-[15px] font-black text-mjs-dark tabular-nums">${p.price.toFixed(2)} <span className="text-[11.5px] font-semibold text-mjs-dark/50">{p.pack}</span></span>
      <button type="button" onClick={() => { addItem({ slug: p.slug, sku: p.sku, name: p.cardTitle, brand: p.brand, price: p.price, image: p.image, pack: p.pack }, 1, p.category); setAdded(true); setTimeout(() => setAdded(false), 1800); }}
        className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12.5px] font-bold text-white transition-colors ${added ? "bg-emerald-600" : "bg-mjs-dark hover:bg-black"}`}>
        {added ? <><Check className="w-3.5 h-3.5" /> Added</> : <><ShoppingCart className="w-3.5 h-3.5" /> Add</>}
      </button>
    </div>
  );
}

export default function JanitorialChecklist({ products }: { products: Record<string, GuideProduct> }) {
  const [active, setActive] = useState<ChecklistCategoryId>("chemicals");
  const [done, setDone] = useState<Record<string, boolean>>({});
  const { addItem } = useCart();
  const [addedAll, setAddedAll] = useState(false);
  const cat = CHECKLIST.find((c) => c.id === active)!;
  const total = CHECKLIST.reduce((n, c) => n + c.items.length, 0);
  const checked = Object.values(done).filter(Boolean).length;

  const addCategory = () => {
    for (const it of cat.items) {
      const p = it.sku ? pick(products, it.sku) : undefined;
      if (p) addItem({ slug: p.slug, sku: p.sku, name: p.cardTitle, brand: p.brand, price: p.price, image: p.image, pack: p.pack }, 1, p.category);
    }
    setAddedAll(true); setTimeout(() => setAddedAll(false), 2000);
  };

  return (
    <article className="bg-white">
      <style>{`@media print { header, nav, footer, .no-print { display: none !important } .print-all { display: block !important } }`}</style>
      <GuideHero eyebrow="Checklist" title={<>Janitorial Supply<br />Checklist</>} lede={`${total} things a well-run cleaning closet keeps on the shelf, sorted into six categories with the product we'd stock for each. Tick what you have, order what you don't.`} art="/images/guides/checklist.webp" tint={TINT} crumb="Supply Checklist">
        <a href="#checklist" className="inline-flex items-center gap-2 rounded-full bg-mjs-dark px-6 py-3.5 text-[15px] font-black text-white hover:bg-black transition-colors">Start the checklist <ArrowRight className="w-4 h-4" /></a>
        <button type="button" onClick={() => window.print()} className="ml-3 inline-flex items-center gap-2 rounded-full border border-mjs-dark/30 px-6 py-3.5 text-[15px] font-bold text-mjs-dark hover:bg-white/60 transition-colors no-print"><Printer className="w-4 h-4" /> Print it</button>
      </GuideHero>
      <GuideNav items={[{ id: "checklist", label: "The checklist" }, { id: "monthly", label: "Monthly estimates" }]} />

      {/* 01 Checklist */}
      <GuideSection id="checklist" n="01" title="The master checklist" intro="Six categories. Pick one, check off what you already have, and add the rest straight to your cart.">
        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-6 no-print">
          {CHECKLIST.map((c) => { const n = c.items.filter((i) => done[c.id + i.name]).length; return (
            <button key={c.id} type="button" onClick={() => setActive(c.id)} className={`rounded-full px-4 py-2.5 text-[14px] font-bold transition-colors ${active === c.id ? "bg-mjs-dark text-white" : "bg-mjs-gray-100 text-mjs-dark hover:bg-mjs-gray-200"}`}>
              {c.name} <span className={`ml-1 tabular-nums ${active === c.id ? "text-white/60" : "text-mjs-dark/45"}`}>{n}/{c.items.length}</span>
            </button>
          ); })}
          <span className="ml-auto self-center text-[13px] font-bold text-mjs-dark/55 tabular-nums">{checked} of {total} checked</span>
        </div>

        {/* Active category (all categories render when printing) */}
        {CHECKLIST.map((c) => (
          <div key={c.id} className={`${c.id === active ? "block" : "hidden print-all"} rounded-3xl p-5 md:p-8`} style={{ background: c.tint }}>
            <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
              <div><Eyebrow>{c.items.length} items</Eyebrow><h3 className="text-[1.7rem] leading-none font-black tracking-tight text-mjs-dark">{c.name}</h3></div>
              <div className="flex gap-2 no-print">
                <button type="button" onClick={addCategory} className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13.5px] font-black transition-colors ${addedAll && c.id === active ? "bg-emerald-600 text-white" : "bg-mjs-dark text-white hover:bg-black"}`}>{addedAll && c.id === active ? <><Check className="w-4 h-4" /> Added</> : <><ShoppingCart className="w-4 h-4" /> Add all to cart</>}</button>
                <Link href={c.shop} className="inline-flex items-center gap-1.5 rounded-full border border-mjs-dark/25 px-5 py-2.5 text-[13.5px] font-bold text-mjs-dark hover:bg-white/60">Shop the category <ArrowRight className="w-4 h-4" /></Link>
              </div>
            </div>
            <ul className="space-y-2 list-none m-0 p-0">
              {c.items.map((it) => { const key = c.id + it.name; const p = it.sku ? pick(products, it.sku) : undefined; return (
                <li key={key} className="rounded-2xl bg-white p-3 flex items-center gap-4">
                  <label className="shrink-0 cursor-pointer">
                    <input type="checkbox" checked={!!done[key]} onChange={(e) => setDone({ ...done, [key]: e.target.checked })} className="sr-only peer" />
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-mjs-dark/30 bg-white peer-checked:bg-mjs-dark peer-checked:border-mjs-dark text-white"><Check className="w-4 h-4" /></span>
                  </label>
                  {p ? <Link href={`/product/${p.slug}`} className="relative w-16 h-16 shrink-0 rounded-xl bg-mjs-gray-50 overflow-hidden">{p.image && <Image src={p.image} alt="" fill sizes="64px" className="object-contain p-1.5" />}</Link> : <span className="w-16 h-16 shrink-0 rounded-xl bg-mjs-gray-50" />}
                  <div className="min-w-0 flex-1">
                    <p className={`text-[15px] font-black text-mjs-dark ${done[key] ? "line-through opacity-50" : ""}`}>{it.name}</p>
                    <p className="text-[13px] text-mjs-dark/65">{it.why}</p>
                    {p && <Link href={`/product/${p.slug}`} className="block text-[12.5px] font-semibold text-mjs-dark/55 hover:text-mjs-red mt-0.5 truncate">{p.cardTitle}</Link>}
                  </div>
                  {p && <AddButton p={p} />}
                </li>
              ); })}
            </ul>
          </div>
        ))}
      </GuideSection>

      {/* 02 Monthly */}
      <GuideSection id="monthly" n="02" title="What a month looks like" intro="Rough monthly usage for common buildings, so you can plan orders and never run out on a Friday." tint="#f7f8fa">
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 list-none m-0 p-0">
          {MONTHLY.map((m) => (
            <li key={m.name} className="rounded-3xl overflow-hidden bg-white">
              <div className="relative aspect-[16/8]"><Image src={m.photo} alt="" fill sizes="(max-width: 1024px) 50vw, 440px" className="object-cover" /></div>
              <div className="p-5">
                <h3 className="text-[17px] font-black text-mjs-dark mb-2">{m.name}</h3>
                <ul className="columns-2 gap-4 text-[13.5px] text-mjs-dark/75 list-none m-0 p-0">{m.lines.map((l) => <li key={l} className="py-0.5 break-inside-avoid">{l}</li>)}</ul>
              </div>
            </li>
          ))}
        </ul>
      </GuideSection>

      <GuideCta title="Want us to build the order for you?" text="Tell us the building and headcount. We'll put together a first order at wholesale pricing and set up a refill schedule." href="/quote" label="Request a quote" />
    </article>
  );
}
