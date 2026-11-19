"use client";

import { useState } from "react";
import { ArrowRight, Check, ChevronDown } from "lucide-react";
import { BID_STEPS, BENCHMARKS, SUPPLY_SKUS, WALKTHROUGH, MISTAKES } from "@/data/guides/bid";
import type { GuideProduct } from "@/lib/guide-products";
import { pick } from "@/lib/guide-products";
import { GuideHero, GuideNav, GuideSection, Callout, ProductTile, GuideCta, Eyebrow } from "@/components/guides/GuideKit";

const TINT = "#fee0d2";
const PANEL = "#fdf0e9";
const money = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default function CleaningBidGuide({ products }: { products: Record<string, GuideProduct> }) {
  const [open, setOpen] = useState(1);
  const [sqft, setSqft] = useState("10000");
  const [fac, setFac] = useState(0);
  const b = BENCHMARKS[fac]; const area = parseFloat(sqft.replace(/,/g, "")) || 0;

  return (
    <article className="bg-white">
      <GuideHero eyebrow="Business guide" title={<>How to Bid a<br />Cleaning Job</>} lede="Seven steps from the first walkthrough to a signed contract, with real per-square-foot benchmarks, a quick estimator and the mistakes that quietly eat a cleaning company's profit." art="/images/guides/bid.webp" tint={TINT} crumb="How to Bid a Cleaning Job">
        <a href="#steps" className="inline-flex items-center gap-2 rounded-full bg-mjs-dark px-6 py-3.5 text-[15px] font-black text-white hover:bg-black transition-colors">Start with step 1 <ArrowRight className="w-4 h-4" /></a>
        <a href="#pricing" className="ml-3 inline-flex items-center gap-2 rounded-full border border-mjs-dark/30 px-6 py-3.5 text-[15px] font-bold text-mjs-dark hover:bg-white/60 transition-colors">Quick estimate</a>
      </GuideHero>
      <GuideNav items={[{ id: "steps", label: "The 7 steps" }, { id: "pricing", label: "Pricing" }, { id: "supplies", label: "Supplies" }, { id: "walkthrough", label: "Walkthrough list" }, { id: "mistakes", label: "Mistakes" }]} />

      {/* 01 Steps */}
      <GuideSection id="steps" n="01" title="The seven-step bid" intro="Work through them in order. Each one feeds the next; skip one and the price is a guess.">
        <ol className="list-none m-0 p-0 divide-y divide-mjs-dark/10 border-y border-mjs-dark/10">
          {BID_STEPS.map((s) => { const isOpen = open === s.n; return (
            <li key={s.n}>
              <button type="button" onClick={() => setOpen(isOpen ? 0 : s.n)} aria-expanded={isOpen} className="w-full grid grid-cols-[56px_1fr_auto] md:grid-cols-[96px_1fr_auto] items-center gap-4 py-5 text-left">
                <span className={`text-[2.4rem] md:text-[3.2rem] leading-none font-black tabular-nums ${isOpen ? "text-mjs-red" : "text-mjs-dark/20"}`}>{String(s.n).padStart(2, "0")}</span>
                <span><span className="block text-[1.25rem] md:text-[1.5rem] font-black tracking-tight text-mjs-dark">{s.title}</span><span className="block mt-0.5 text-[14.5px] text-mjs-dark/65">{s.summary}</span></span>
                <ChevronDown className={`w-5 h-5 text-mjs-dark/40 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && (
                <div className="grid md:grid-cols-[96px_1fr] gap-4 pb-7">
                  <span />
                  <div className="grid md:grid-cols-[1fr_320px] gap-5">
                    <ul className="list-none m-0 p-0 space-y-2">{s.actions.map((a) => <li key={a} className="flex gap-3 text-[15px] text-mjs-dark/85"><Check className="w-4 h-4 mt-1 text-emerald-600 shrink-0" />{a}</li>)}</ul>
                    <Callout kind="tip" title="From the field">{s.tip}</Callout>
                  </div>
                </div>
              )}
            </li>
          ); })}
        </ol>
      </GuideSection>

      {/* 02 Pricing */}
      <GuideSection id="pricing" n="02" title="What buildings pay per square foot" intro="Monthly rates by facility type. Your market will shift these, so treat them as a starting point." tint="#f7f8fa">
        <div className="grid lg:grid-cols-[1fr_400px] gap-6 items-start">
          <div className="overflow-x-auto rounded-3xl" style={{ background: PANEL }}>
            <table className="w-full min-w-[640px] text-[14.5px]">
              <thead><tr className="text-left text-[11px] font-black uppercase tracking-[2px] text-mjs-dark/55"><th className="px-5 py-4">Facility</th><th className="px-5 py-4">Low</th><th className="px-5 py-4">Average</th><th className="px-5 py-4">High</th><th className="px-5 py-4">Visits</th><th className="px-5 py-4">Notes</th></tr></thead>
              <tbody>{BENCHMARKS.map((r, i) => (
                <tr key={r.facility} onClick={() => setFac(i)} className={`cursor-pointer border-t border-mjs-dark/10 hover:bg-white/60 ${i === fac ? "bg-white" : ""}`}>
                  <td className="px-5 py-3 font-black text-mjs-dark">{r.facility}</td><td className="px-5 py-3 tabular-nums text-mjs-dark/70">${r.low.toFixed(2)}</td><td className="px-5 py-3 tabular-nums font-black text-mjs-dark">${r.avg.toFixed(2)}</td><td className="px-5 py-3 tabular-nums text-mjs-dark/70">${r.high.toFixed(2)}</td><td className="px-5 py-3 text-mjs-dark/70 whitespace-nowrap">{r.freq}</td><td className="px-5 py-3 text-mjs-dark/60">{r.note}</td>
                </tr>))}</tbody>
            </table>
          </div>
          <div className="rounded-3xl bg-white p-6 md:p-7">
            <Eyebrow>Quick estimate</Eyebrow>
            <label className="block mt-2"><span className="text-[12px] font-black uppercase tracking-wider text-mjs-dark/60">Cleanable square feet</span>
              <div className="mt-1.5 flex items-center rounded-xl bg-mjs-gray-100 focus-within:ring-2 focus-within:ring-mjs-dark/30"><input id="bid-sqft" inputMode="numeric" value={sqft} onChange={(e) => setSqft(e.target.value)} className="w-full bg-transparent px-4 py-3 text-[18px] font-bold text-mjs-dark outline-none" /><span className="pr-4 text-[13px] font-bold text-mjs-dark/50">sq ft</span></div></label>
            <p className="mt-3 text-[13px] text-mjs-dark/60">Facility: <strong className="text-mjs-dark">{b.facility}</strong> (tap a row to change)</p>
            <div className="mt-5 grid grid-cols-3 gap-2 text-center">
              {[["Low", b.low], ["Average", b.avg], ["High", b.high]].map(([l, v], i) => (
                <div key={l as string} className={`rounded-2xl py-3 ${i === 1 ? "bg-mjs-dark text-white" : "bg-mjs-gray-100 text-mjs-dark"}`}><p className="text-[11px] font-black uppercase tracking-wider opacity-60">{l}</p><p className="text-[1.3rem] font-black tabular-nums">{money(area * (v as number))}</p><p className="text-[11px] opacity-60">per month</p></div>
              ))}
            </div>
            <p className="mt-4 text-[13px] text-mjs-dark/60">At the average and {b.freq.replace(" / week", " a week")}, that&apos;s about {money((area * b.avg) / 21.7)} per visit, and roughly {(area / 3000).toFixed(1)} labor hours each time.</p>
          </div>
        </div>
      </GuideSection>

      {/* 03 Supplies */}
      <GuideSection id="supplies" n="03" title="Budget 5–10% for supplies" intro="The six products almost every contract runs on, at our wholesale prices. A 10,000 sq ft office cleaned five nights a week uses about $150–300 of these a month.">
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 list-none m-0 p-0">{SUPPLY_SKUS.map((s) => <li key={s} className="rounded-3xl p-3" style={{ background: PANEL }}><ProductTile p={pick(products, s)} /></li>)}</ul>
      </GuideSection>

      {/* 04 Walkthrough */}
      <GuideSection id="walkthrough" n="04" title="Bring this to the walkthrough" intro="Every line here is money. Miss one and you'll be underpricing it for a year." tint="#f7f8fa">
        <ul className="grid sm:grid-cols-2 gap-5 list-none m-0 p-0">
          {WALKTHROUGH.map((w) => (
            <li key={w.area} className="rounded-3xl bg-white p-6"><h3 className="text-[1.2rem] font-black text-mjs-dark mb-3">{w.area}</h3>
              <ul className="space-y-2 list-none m-0 p-0">{w.items.map((i) => <li key={i} className="flex items-center gap-3 text-[15px] text-mjs-dark/85"><span className="h-5 w-5 shrink-0 rounded-md border-2 border-mjs-dark/30" />{i}</li>)}</ul></li>
          ))}
        </ul>
      </GuideSection>

      {/* 05 Mistakes */}
      <GuideSection id="mistakes" n="05" title="Six mistakes that kill the margin" intro="Every experienced operator has made at least three of these.">
        <ul className="list-none m-0 p-0 divide-y divide-mjs-dark/10 border-y border-mjs-dark/10">
          {MISTAKES.map((m) => (
            <li key={m.mistake} className="grid md:grid-cols-[1.1fr_1.4fr_1fr] gap-3 md:gap-8 py-5">
              <p className="text-[1.1rem] font-black tracking-tight text-mjs-dark">{m.mistake}</p>
              <p className="text-[14.5px] text-mjs-dark/70"><span className="font-black text-mjs-red">Risk</span> · {m.risk}</p>
              <p className="text-[14.5px] text-mjs-dark/85"><span className="font-black text-emerald-700">Fix</span> · {m.fix}</p>
            </li>
          ))}
        </ul>
      </GuideSection>

      <GuideCta title="Stocking a cleaning business?" text="Chemicals, paper, liners and equipment at wholesale, delivered to your shop or straight to the job. Ask about net-30 terms for contractors." href="/quote" label="Request a quote" />
    </article>
  );
}
