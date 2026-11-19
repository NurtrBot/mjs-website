"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ArrowRight, Search } from "lucide-react";
import { CHEMICALS, CHEM_CATEGORIES, CONTAINERS, RATIO_TABLE, NEVER_MIX, SAFETY_HABITS, FACILITY_KITS, type ChemCategory } from "@/data/guides/dilution";
import type { GuideProduct } from "@/lib/guide-products";
import { pick } from "@/lib/guide-products";
import { GuideHero, GuideNav, GuideSection, Callout, ProductTile, GuideCta, Eyebrow } from "@/components/guides/GuideKit";

const TINT = "#cbeafd";
const PANEL = "#eaf4fd";

const ozPerGal = (parts: number | null) => (parts ? 128 / parts : null);
const fmtOz = (oz: number) => (oz >= 10 ? Math.round(oz).toString() : oz >= 1 ? oz.toFixed(1).replace(/\.0$/, "") : oz.toFixed(2));
const STRENGTH = { light: ["Mild", "#2f9e44"], medium: ["Medium", "#e8a000"], heavy: ["Strong", "#d42027"] } as const;

export default function DilutionChartGuide({ products }: { products: Record<string, GuideProduct> }) {
  const [cat, setCat] = useState<ChemCategory | "all">("all");
  const [q, setQ] = useState("");
  const list = useMemo(() => CHEMICALS.filter((c) => (cat === "all" || c.category === cat) && (!q || (c.name + " " + c.use).toLowerCase().includes(q.toLowerCase()))), [cat, q]);

  // Mix calculator
  const [mixSku, setMixSku] = useState(CHEMICALS[0].sku);
  const [container, setContainer] = useState(CONTAINERS[1].id);
  const [customOz, setCustomOz] = useState("");
  const chem = CHEMICALS.find((c) => c.sku === mixSku)!;
  const totalOz = customOz ? parseFloat(customOz) || 0 : CONTAINERS.find((c) => c.id === container)!.oz;
  const conc = chem.parts ? totalOz / (chem.parts + 1) : null;

  return (
    <article className="bg-white">
      <GuideHero eyebrow="Reference chart" title={<>Chemical<br />Dilution Chart</>} lede="The right mix for every concentrate we sell, straight from the label, plus a calculator that turns any ratio into ounces for the bottle or bucket in your hand." art="/images/guides/dilution.webp" tint={TINT} crumb="Dilution Chart">
        <a href="#chart" className="inline-flex items-center gap-2 rounded-full bg-mjs-dark px-6 py-3.5 text-[15px] font-black text-white hover:bg-black transition-colors">Open the chart <ArrowRight className="w-4 h-4" /></a>
        <a href="#mix" className="ml-3 inline-flex items-center gap-2 rounded-full border border-mjs-dark/30 px-6 py-3.5 text-[15px] font-bold text-mjs-dark hover:bg-white/60 transition-colors">Mix calculator</a>
      </GuideHero>
      <GuideNav items={[{ id: "chart", label: "The chart" }, { id: "mix", label: "Mix calculator" }, { id: "convert", label: "Ratio converter" }, { id: "safety", label: "Safety" }, { id: "facility", label: "By facility" }]} />

      {/* 01 Chart */}
      <GuideSection id="chart" n="01" title="Dilution ratios by product" intro="Every ratio below is from the manufacturer's label. Filter by job, or search by name.">
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
          <div className="flex flex-wrap gap-2">
            {CHEM_CATEGORIES.map((c) => (
              <button key={c.id} type="button" onClick={() => setCat(c.id)} className={`rounded-full px-4 py-2 text-[13.5px] font-bold transition-colors ${cat === c.id ? "bg-mjs-dark text-white" : "bg-mjs-gray-100 text-mjs-dark hover:bg-mjs-gray-200"}`}>{c.label}</button>
            ))}
          </div>
          <label className="md:ml-auto relative block w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-mjs-dark/40" />
            <input id="chem-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products or jobs" className="w-full rounded-full bg-mjs-gray-100 pl-10 pr-4 py-2.5 text-[14px] text-mjs-dark outline-none focus:ring-2 focus:ring-mjs-dark/30" />
          </label>
        </div>

        <ul className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 list-none m-0 p-0">
          {list.map((c) => {
            const p = pick(products, c.sku); const oz = ozPerGal(c.parts); const [sLabel, sColor] = STRENGTH[c.strength];
            return (
              <li key={c.sku} className="rounded-3xl p-5 flex gap-4" style={{ background: PANEL }}>
                <div className="relative w-24 h-24 shrink-0 rounded-2xl bg-white overflow-hidden">{p?.image && <Image src={p.image} alt="" fill sizes="96px" className="object-contain p-2" />}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-[15.5px] font-black leading-snug text-mjs-dark">{c.name}</h3>
                    <span className="shrink-0 inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-mjs-dark/60"><span className="w-2 h-2 rounded-full" style={{ background: sColor }} />{sLabel}</span>
                  </div>
                  <div className="mt-2 flex items-baseline gap-3">
                    <span className="text-[1.9rem] leading-none font-black tracking-tight text-mjs-dark tabular-nums">{c.parts ? c.ratio : "RTU"}</span>
                    <span className="text-[13px] font-bold text-mjs-dark/60">{oz ? `${fmtOz(oz)} oz per gallon` : "Ready to use, no mixing"}</span>
                  </div>
                  <p className="mt-1.5 text-[13.5px] text-mjs-dark/75">{c.use}</p>
                  {c.note && <p className="mt-1 text-[12.5px] text-mjs-dark/55">{c.note}</p>}
                  {p && (
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <span className="text-[15px] font-black text-mjs-dark">${p.price.toFixed(2)} <span className="text-[12px] font-semibold text-mjs-dark/50">{p.pack}</span></span>
                      <button type="button" onClick={() => { setMixSku(c.sku); document.getElementById("mix")?.scrollIntoView({ behavior: "smooth" }); }} className="text-[12.5px] font-bold text-mjs-red underline underline-offset-4">Mix this</button>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
        {list.length === 0 && <p className="text-center text-mjs-dark/60 py-10">Nothing matches that. Try another word or clear the filter.</p>}
        <p className="mt-4 text-[13px] text-mjs-dark/50">{list.length} products shown. Always confirm the ratio on the label you&apos;re holding.</p>
      </GuideSection>

      {/* 02 Mix calculator */}
      <GuideSection id="mix" n="02" title="How much goes in the bottle?" intro="Pick the product and what you're filling. We'll tell you how much concentrate to add before topping up with water." tint="#f7f8fa">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="rounded-3xl bg-white p-6 md:p-8">
            <label className="block">
              <span className="text-[12px] font-black uppercase tracking-wider text-mjs-dark/60">Product</span>
              <select id="mix-product" value={mixSku} onChange={(e) => setMixSku(e.target.value)} className="mt-1.5 w-full rounded-xl bg-mjs-gray-100 px-4 py-3 text-[15px] font-bold text-mjs-dark outline-none focus:ring-2 focus:ring-mjs-dark/30">
                {CHEMICALS.map((c) => <option key={c.sku} value={c.sku}>{c.name} ({c.parts ? c.ratio : "ready to use"})</option>)}
              </select>
            </label>
            <div className="mt-5">
              <span className="text-[12px] font-black uppercase tracking-wider text-mjs-dark/60">Filling</span>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {CONTAINERS.map((c) => (
                  <button key={c.id} type="button" onClick={() => { setContainer(c.id); setCustomOz(""); }} className={`rounded-full px-4 py-2 text-[13.5px] font-bold ${container === c.id && !customOz ? "bg-mjs-dark text-white" : "bg-mjs-gray-100 text-mjs-dark hover:bg-mjs-gray-200"}`}>{c.label}</button>
                ))}
              </div>
              <div className="mt-3 flex items-center rounded-xl bg-mjs-gray-100 focus-within:ring-2 focus-within:ring-mjs-dark/30 max-w-xs">
                <input id="mix-oz" inputMode="decimal" value={customOz} onChange={(e) => setCustomOz(e.target.value)} placeholder="or any size" className="w-full bg-transparent px-4 py-3 text-[15px] font-bold text-mjs-dark outline-none" /><span className="pr-4 text-[13px] font-bold text-mjs-dark/50">oz</span>
              </div>
            </div>
          </div>
          <div className="rounded-3xl p-6 md:p-8" style={{ background: PANEL }}>
            {conc === null ? (
              <div><Eyebrow>{chem.name}</Eyebrow><p className="text-[1.6rem] font-black text-mjs-dark">Ready to use.</p><p className="mt-2 text-[15px] text-mjs-dark/70">Pour it straight in. No water, no mixing.</p></div>
            ) : (
              <div>
                <Eyebrow>{chem.name} at {chem.ratio}</Eyebrow>
                <p className="text-[2.6rem] leading-none font-black tracking-tight text-mjs-dark tabular-nums">{fmtOz(conc)} oz <span className="text-[1.2rem] text-mjs-dark/60">concentrate</span></p>
                <p className="mt-2 text-[1.3rem] font-black text-mjs-dark/80 tabular-nums">+ {fmtOz(totalOz - conc)} oz water</p>
                <p className="mt-1 text-[14px] text-mjs-dark/60">makes {fmtOz(totalOz)} oz ({(totalOz / 128).toFixed(2).replace(/\.?0+$/, "")} gal) of ready-to-use cleaner</p>
                <div className="mt-6 h-5 w-full rounded-full bg-white overflow-hidden flex">
                  <span className="h-full bg-mjs-red" style={{ width: `${Math.max(1.5, (conc / totalOz) * 100)}%` }} />
                  <span className="h-full bg-[#9cc9f0] flex-1" />
                </div>
                <p className="mt-2 text-[12px] font-bold text-mjs-dark/55">Red = concentrate · Blue = water. Add the concentrate first, then fill with water.</p>
                {conc < 0.5 && <p className="mt-3 text-[13px] text-mjs-dark/70">That&apos;s under half an ounce: about a teaspoon. Use a measuring spoon, not a pour.</p>}
              </div>
            )}
          </div>
        </div>
      </GuideSection>

      {/* 03 Converter */}
      <GuideSection id="convert" n="03" title="Any ratio, in ounces" intro="No label handy? This converts the common ratios to ounces per gallon and spoons per quart.">
        <div className="grid lg:grid-cols-[1fr_380px] gap-6 items-start">
          <div className="overflow-x-auto rounded-3xl" style={{ background: PANEL }}>
            <table className="w-full min-w-[520px] text-[15px]">
              <thead><tr className="text-left text-[11px] font-black uppercase tracking-[2px] text-mjs-dark/55"><th className="px-5 py-4">Ratio</th><th className="px-5 py-4">Per gallon</th><th className="px-5 py-4">Per quart</th><th className="px-5 py-4 w-40">Strength</th></tr></thead>
              <tbody>
                {RATIO_TABLE.map(([r, gal, qt]) => { const parts = parseInt(r.split(":")[1]); const pct = Math.min(100, (4 / parts) * 100); return (
                  <tr key={r} className="border-t border-mjs-dark/10"><td className="px-5 py-3 font-black tabular-nums text-mjs-dark">{r}</td><td className="px-5 py-3 font-semibold text-mjs-dark/80">{gal}</td><td className="px-5 py-3 text-mjs-dark/70">{qt}</td><td className="px-5 py-3"><span className="block h-2.5 rounded-full bg-white overflow-hidden"><span className="block h-full bg-mjs-red" style={{ width: `${pct}%` }} /></span></td></tr>
                ); })}
              </tbody>
            </table>
          </div>
          <Callout kind="tip" title="How to read a ratio">1:32 means one part concentrate to 32 parts water. A gallon is 128 oz, so 128 ÷ 32 = <strong>4 oz</strong> of concentrate. Smaller second number, stronger mix.</Callout>
        </div>
      </GuideSection>

      {/* 04 Safety */}
      <GuideSection id="safety" n="04" title="Never mix these" intro="Combining the wrong chemicals makes gases that put people in the hospital. These aren't tips. They're rules." tint="#f7f8fa">
        <ul className="grid md:grid-cols-3 gap-4 list-none m-0 p-0">
          {NEVER_MIX.map((m) => (
            <li key={m.a + m.b} className={`rounded-3xl p-6 ${m.danger ? "bg-[#fde8e8]" : "bg-[#fff3cc]"}`}>
              <p className="text-[11px] font-black uppercase tracking-[2px]" style={{ color: m.danger ? "#b01a20" : "#8a5a00" }}>{m.danger ? "Danger" : "Caution"}</p>
              <p className="mt-2 text-[1.6rem] leading-tight font-black tracking-tight text-mjs-dark">{m.a} <span className="text-mjs-dark/40">+</span> {m.b}</p>
              <p className="mt-2 text-[14.5px] text-mjs-dark/75">{m.result}</p>
            </li>
          ))}
        </ul>
        <h3 className="mt-10 mb-4 text-[1.3rem] font-black text-mjs-dark">Six habits that keep a crew safe</h3>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5 list-none m-0 p-0">
          {SAFETY_HABITS.map(([t, d]) => (<li key={t}><p className="text-[15px] font-black text-mjs-dark">{t}</p><p className="mt-1 text-[14px] text-mjs-dark/70">{d}</p></li>))}
        </ul>
      </GuideSection>

      {/* 05 By facility */}
      <GuideSection id="facility" n="05" title="The concentrates each building needs" intro="Not sure where to start? These four or five products cover 90% of the cleaning in each type of facility.">
        <ul className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 list-none m-0 p-0">
          {FACILITY_KITS.map((k) => (
            <li key={k.name} className="rounded-3xl overflow-hidden" style={{ background: PANEL }}>
              <div className="relative aspect-[16/7]"><Image src={k.photo} alt="" fill sizes="(max-width: 1280px) 50vw, 440px" className="object-cover" /></div>
              <div className="p-5">
                <h3 className="text-[17px] font-black text-mjs-dark mb-3">{k.name}</h3>
                <div className="space-y-2">{k.skus.map((s) => <ProductTile key={s} p={pick(products, s)} compact />)}</div>
              </div>
            </li>
          ))}
        </ul>
      </GuideSection>

      <GuideCta title="Concentrates go a long way." text="One gallon at 1:128 makes 128 gallons of cleaner. Shop professional concentrates at wholesale prices, with free local delivery on $399+ subtotals." href="/category/cleaning-chemicals" label="Shop cleaning chemicals" />
    </article>
  );
}
