"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf } from "lucide-react";
import { CAN_SIZES, THICKNESS, INDUSTRIES, type CanSize } from "@/data/guides/trash-bag";
import type { GuideProduct } from "@/lib/guide-products";
import { pick } from "@/lib/guide-products";
import { GuideHero, GuideNav, GuideSection, Callout, ProductTile, GuideCta, Eyebrow } from "@/components/guides/GuideKit";

const TINT = "#daedd5"; // background of the hero illustration
const PANEL = "#eef6ea";

/* ── Can drawing (true relative scale between sizes) ─────────── */
function Can({ size, px, selected, withBag }: { size: CanSize; px: number; selected?: boolean; withBag?: boolean }) {
  // px = pixels per inch
  const h = size.canHeight * px, top = size.canTopDiameter * px, bot = top * 0.84, rim = Math.max(3, px * 0.9);
  const W = top + 24, H = h + rim + 30;
  const x0 = (W - top) / 2, x1 = x0 + top, xb0 = (W - bot) / 2, xb1 = xb0 + bot;
  const body = selected ? "#3b3f4a" : "#6b7280", rimC = selected ? "#1f2330" : "#4b5563";
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} aria-hidden="true" className="block">
      {/* body */}
      <path d={`M${x0} ${rim + 8} L${xb0} ${rim + 8 + h} Q${W / 2} ${rim + 8 + h + 10} ${xb1} ${rim + 8 + h} L${x1} ${rim + 8} Z`} fill={body} />
      {/* subtle highlight */}
      <path d={`M${x0 + top * 0.12} ${rim + 12} L${xb0 + bot * 0.1} ${rim + h} L${xb0 + bot * 0.2} ${rim + h} L${x0 + top * 0.24} ${rim + 12} Z`} fill="rgba(255,255,255,0.12)" />
      {/* bag draped over the rim */}
      {withBag && (
        <path d={`M${x0 - 4} ${rim + 8} Q${x0 - 10} ${rim + 8 + h * 0.18} ${x0 + top * 0.06} ${rim + 8 + h * 0.2} L${x0 + top * 0.06} ${rim + 10} Z
                  M${x1 + 4} ${rim + 8} Q${x1 + 10} ${rim + 8 + h * 0.18} ${x1 - top * 0.06} ${rim + 8 + h * 0.2} L${x1 - top * 0.06} ${rim + 10} Z`} fill="rgba(255,255,255,0.85)" />
      )}
      {/* rim */}
      <rect x={x0 - 4} y={4} width={top + 8} height={rim + 6} rx={rim / 2} fill={rimC} />
      <ellipse cx={W / 2} cy={rim / 2 + 7} rx={top / 2 - 2} ry={Math.max(2, rim * 0.6)} fill={withBag ? "#f3f4f6" : "#111827"} opacity={withBag ? 1 : 0.5} />
    </svg>
  );
}

/* ── Component ───────────────────────────────────────────────── */
export default function TrashBagSizeGuide({ products }: { products: Record<string, GuideProduct> }) {
  const [active, setActive] = useState(5); // 40–45 gal, the most common
  const sel = CAN_SIZES[active];

  // Calculator state
  const [shape, setShape] = useState<"round" | "square">("round");
  const [canH, setCanH] = useState("");
  const [dia, setDia] = useState("");
  const [len, setLen] = useState("");
  const [wid, setWid] = useState("");

  const calc = useMemo(() => {
    const H = parseFloat(canH);
    const D = parseFloat(dia), L = parseFloat(len), Wd = parseFloat(wid);
    const ok = shape === "round" ? H > 0 && D > 0 : H > 0 && L > 0 && Wd > 0;
    if (!ok) return null;
    const circumference = shape === "round" ? Math.PI * D : 2 * (L + Wd);
    const shortSide = shape === "round" ? D : Math.min(L, Wd);
    const needW = Math.ceil(circumference / 2 + 2); // half the perimeter plus slack
    const needH = Math.ceil(H + shortSide / 2 + 4); // can height + half the base to reach the bottom + 4" overhang
    const idx = CAN_SIZES.findIndex((c) => c.bagWidth >= needW && c.bagHeight >= needH);
    return { needW, needH, idx };
  }, [shape, canH, dia, len, wid]);

  const choose = (i: number) => {
    setActive(i);
    document.getElementById("find")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <article className="bg-white">
      <GuideHero
        eyebrow="Buying guide"
        title={<>Trash Bag<br />Size Guide</>}
        lede="Pick your can, read off the bag. Every standard size from a 7-gallon desk bin to a 60-gallon rollout, with the liners we recommend for each and a measuring tool for odd cans."
        art="/images/guides/trash-bag.webp"
        tint={TINT}
        crumb="Trash Bag Size Guide"
      >
        <a href="#find" className="inline-flex items-center gap-2 rounded-full bg-mjs-dark px-6 py-3.5 text-[15px] font-black text-white hover:bg-black transition-colors">Find my size <ArrowRight className="w-4 h-4" /></a>
        <a href="#measure" className="ml-3 inline-flex items-center gap-2 rounded-full border border-mjs-dark/30 px-6 py-3.5 text-[15px] font-bold text-mjs-dark hover:bg-white/60 transition-colors">Measure my can</a>
      </GuideHero>

      <GuideNav items={[{ id: "find", label: "Find my size" }, { id: "measure", label: "Measure a can" }, { id: "thickness", label: "Thickness" }, { id: "industry", label: "By industry" }, { id: "all", label: "All sizes" }]} />

      {/* ── 1. Pick a can ─────────────────────────────────────── */}
      <GuideSection id="find" n="01" title="What size trash bag do I need?" intro="Tap the can that looks like yours. The lineup is drawn to scale, so a 60-gallon rollout really is four times the size of a desk bin.">
        {/* Lineup */}
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
          <ul className="flex items-end gap-2 md:gap-4 min-w-max md:min-w-0 md:justify-between pb-3 border-b-2 border-mjs-dark/15 list-none m-0 p-0">
            {CAN_SIZES.map((c, i) => (
              <li key={c.id}>
                <button type="button" onClick={() => setActive(i)} aria-pressed={i === active} className="group flex flex-col items-center gap-2 px-1 focus:outline-none">
                  <span className="transition-transform group-hover:-translate-y-1"><Can size={c} px={4.2} selected={i === active} /></span>
                  <span className={`rounded-full px-3 py-1 text-[13px] font-black ${i === active ? "bg-mjs-dark text-white" : "bg-mjs-gray-100 text-mjs-dark group-hover:bg-mjs-gray-200"}`}>{c.gallon} gal</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Result */}
        <div className="mt-8 rounded-3xl overflow-hidden" style={{ background: PANEL }}>
          <div className="grid lg:grid-cols-[minmax(0,440px)_1fr]">
            {/* Visual */}
            <div className="flex flex-col items-center justify-center px-6 py-10 lg:border-r lg:border-mjs-dark/10">
              <div className="relative flex items-end gap-6">
                <Can size={sel} px={7} selected withBag />
                {/* dimension callouts */}
                <div className="flex flex-col gap-3 text-[13px] font-bold text-mjs-dark/80 pb-4">
                  <div className="flex items-center gap-2"><span className="h-px w-8 bg-mjs-dark/40" /> Bag {sel.bagWidth}&quot; wide (flat)</div>
                  <div className="flex items-center gap-2"><span className="w-px h-8 bg-mjs-dark/40" /> Bag {sel.bagHeight}&quot; tall</div>
                  <div className="flex items-center gap-2 text-mjs-dark/55 font-semibold"><span className="h-px w-8 bg-transparent" /> Typical can ≈ {sel.canHeight}&quot; H × {sel.canTopDiameter}&quot; across</div>
                </div>
              </div>
              <p className="mt-6 text-[13px] font-semibold text-mjs-dark/60">{sel.canType}</p>
            </div>

            {/* Details + picks */}
            <div className="px-6 py-8 md:px-10 md:py-10">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <Eyebrow>Your can</Eyebrow>
                  <h3 className="text-[2rem] md:text-[2.6rem] leading-none font-black tracking-tight text-mjs-dark">{sel.gallon} gallon</h3>
                  <p className="mt-2 text-[15px] text-mjs-dark/70">{sel.whereUsed}</p>
                </div>
                <div className="text-right">
                  <Eyebrow>Bag size</Eyebrow>
                  <div className="text-[2rem] md:text-[2.6rem] leading-none font-black tracking-tight text-mjs-dark tabular-nums">{sel.bagWidth}&quot; × {sel.bagHeight}&quot;</div>
                </div>
              </div>

              <div className="mt-7">
                <Eyebrow>Liners we recommend</Eyebrow>
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {sel.picks.map((lp) => (
                    <ProductTile key={lp.sku} p={pick(products, lp.sku)} tag={`${lp.type} · ${lp.thickness}`} note={lp.note} />
                  ))}
                </div>
                <p className="mt-4 text-[13px] text-mjs-dark/55">Clear, high-density liners are the everyday choice. Need black, drawstring or compostable in this size? <Link href="/category/trash-liners" className="font-bold text-mjs-red underline underline-offset-4">Browse all liners</Link>.</p>
              </div>
            </div>
          </div>
        </div>
      </GuideSection>

      {/* ── 2. Measure ───────────────────────────────────────── */}
      <GuideSection id="measure" n="02" title="Have an odd can? Measure it." intro="Three numbers from a tape measure and we'll work out the smallest standard bag that fits with a proper overhang." tint="#f7f8fa">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
          <div className="rounded-3xl bg-white p-6 md:p-8">
            <div className="flex gap-2 mb-6">
              {(["round", "square"] as const).map((s) => (
                <button key={s} type="button" onClick={() => setShape(s)} className={`rounded-full px-5 py-2.5 text-[14px] font-bold transition-colors ${shape === s ? "bg-mjs-dark text-white" : "bg-mjs-gray-100 text-mjs-dark hover:bg-mjs-gray-200"}`}>
                  {s === "round" ? "Round can" : "Square / rectangular"}
                </button>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-[12px] font-black uppercase tracking-wider text-mjs-dark/60">Can height</span>
                <div className="mt-1.5 flex items-center rounded-xl bg-mjs-gray-100 focus-within:ring-2 focus-within:ring-mjs-dark/30"><input id="can-h" inputMode="decimal" value={canH} onChange={(e) => setCanH(e.target.value)} placeholder="e.g. 30" className="w-full bg-transparent px-4 py-3 text-[18px] font-bold text-mjs-dark outline-none" /><span className="pr-4 text-[14px] font-bold text-mjs-dark/50">in</span></div>
              </label>
              {shape === "round" ? (
                <label className="block">
                  <span className="text-[12px] font-black uppercase tracking-wider text-mjs-dark/60">Diameter at the top</span>
                  <div className="mt-1.5 flex items-center rounded-xl bg-mjs-gray-100 focus-within:ring-2 focus-within:ring-mjs-dark/30"><input id="can-d" inputMode="decimal" value={dia} onChange={(e) => setDia(e.target.value)} placeholder="e.g. 20" className="w-full bg-transparent px-4 py-3 text-[18px] font-bold text-mjs-dark outline-none" /><span className="pr-4 text-[14px] font-bold text-mjs-dark/50">in</span></div>
                </label>
              ) : (
                <>
                  <label className="block">
                    <span className="text-[12px] font-black uppercase tracking-wider text-mjs-dark/60">Opening length</span>
                    <div className="mt-1.5 flex items-center rounded-xl bg-mjs-gray-100 focus-within:ring-2 focus-within:ring-mjs-dark/30"><input id="can-l" inputMode="decimal" value={len} onChange={(e) => setLen(e.target.value)} placeholder="e.g. 16" className="w-full bg-transparent px-4 py-3 text-[18px] font-bold text-mjs-dark outline-none" /><span className="pr-4 text-[14px] font-bold text-mjs-dark/50">in</span></div>
                  </label>
                  <label className="block">
                    <span className="text-[12px] font-black uppercase tracking-wider text-mjs-dark/60">Opening width</span>
                    <div className="mt-1.5 flex items-center rounded-xl bg-mjs-gray-100 focus-within:ring-2 focus-within:ring-mjs-dark/30"><input id="can-w" inputMode="decimal" value={wid} onChange={(e) => setWid(e.target.value)} placeholder="e.g. 12" className="w-full bg-transparent px-4 py-3 text-[18px] font-bold text-mjs-dark outline-none" /><span className="pr-4 text-[14px] font-bold text-mjs-dark/50">in</span></div>
                  </label>
                </>
              )}
            </div>
            <p className="mt-5 text-[13px] leading-relaxed text-mjs-dark/60">How it works: a bag needs to be at least <strong>half the can&apos;s perimeter plus 2&quot;</strong> wide, and <strong>the can&apos;s height plus half its base plus 4&quot;</strong> tall so it reaches the bottom and folds over the rim.</p>
          </div>

          <div className="rounded-3xl p-6 md:p-8 flex flex-col justify-center" style={{ background: PANEL }}>
            {!calc ? (
              <div className="text-center text-mjs-dark/60">
                <p className="text-[17px] font-bold text-mjs-dark">Your result shows here</p>
                <p className="mt-1 text-[14px]">Enter the measurements on the left.</p>
              </div>
            ) : calc.idx === -1 ? (
              <div className="text-center">
                <Eyebrow>You need at least</Eyebrow>
                <p className="text-[2.2rem] font-black tracking-tight text-mjs-dark tabular-nums">{calc.needW}&quot; × {calc.needH}&quot;</p>
                <p className="mt-3 text-[15px] text-mjs-dark/70">That&apos;s larger than our biggest stock liner (38&quot; × 60&quot;). Call us at (714) 779-2640 and we&apos;ll source the right size.</p>
              </div>
            ) : (
              <div>
                <Eyebrow>You need at least</Eyebrow>
                <p className="text-[1.6rem] font-black tracking-tight text-mjs-dark/70 tabular-nums">{calc.needW}&quot; × {calc.needH}&quot;</p>
                <Eyebrow>Closest standard size</Eyebrow>
                <p className="text-[2.4rem] leading-none font-black tracking-tight text-mjs-dark">{CAN_SIZES[calc.idx].gallon} gallon <span className="text-mjs-dark/50 text-[1.4rem]">({CAN_SIZES[calc.idx].bagWidth}&quot; × {CAN_SIZES[calc.idx].bagHeight}&quot; bag)</span></p>
                <p className="mt-3 text-[14px] text-mjs-dark/70">{CAN_SIZES[calc.idx].whereUsed}</p>
                <button type="button" onClick={() => choose(calc.idx)} className="mt-6 inline-flex items-center gap-2 rounded-full bg-mjs-dark px-6 py-3 text-[14px] font-black text-white hover:bg-black">See the liners for this size <ArrowRight className="w-4 h-4" /></button>
              </div>
            )}
          </div>
        </div>
      </GuideSection>

      {/* ── 3. Thickness ─────────────────────────────────────── */}
      <GuideSection id="thickness" n="03" title="Size is half of it. Thickness is the other half." intro="Liners come in two materials, measured two different ways. The wrong one tears; the right one costs pennies more and never double-bags.">
        <div className="grid md:grid-cols-2 gap-5">
          {THICKNESS.map((t, ti) => (
            <div key={t.kind} className="rounded-3xl p-7 md:p-8" style={{ background: ti === 0 ? "#e4f1ff" : "#fff3cc" }}>
              <Eyebrow>{t.range}</Eyebrow>
              <h3 className="text-[1.5rem] font-black tracking-tight text-mjs-dark">{t.kind}</h3>
              <p className="mt-2 text-[15px] text-mjs-dark/75">{t.feel}</p>
              <p className="mt-1 text-[14px] font-semibold text-mjs-dark/70">Best for: {t.bestFor}</p>
              <ul className="mt-6 space-y-2.5 list-none m-0 p-0">
                {t.levels.map(([label, use], i) => (
                  <li key={label} className="flex items-center gap-4">
                    <span className="block rounded-sm bg-mjs-dark" style={{ width: 56, height: 4 + i * 4 }} />
                    <span className="w-20 shrink-0 text-[15px] font-black text-mjs-dark tabular-nums">{label}</span>
                    <span className="text-[14px] text-mjs-dark/75">{use}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-5"><Callout kind="tip" title="When in doubt, go one thickness up.">A torn bag costs more than a slightly thicker liner. Anything sharp, wet or heavy: step up one level.</Callout></div>
      </GuideSection>

      {/* ── 4. By industry ───────────────────────────────────── */}
      <GuideSection id="industry" n="04" title="What we'd put in your building" intro="Different spaces, different bags. These are the combinations our delivery drivers see working every week." tint="#f7f8fa">
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 list-none m-0 p-0">
          {INDUSTRIES.map((ind) => (
            <li key={ind.name} className="rounded-3xl overflow-hidden bg-white">
              <div className="relative aspect-[16/9]"><Image src={ind.photo} alt="" fill sizes="(max-width: 1024px) 50vw, 440px" className="object-cover" /></div>
              <div className="p-5">
                <h3 className="text-[17px] font-black text-mjs-dark">{ind.name}</h3>
                <p className="mt-1 text-[14px] font-semibold text-mjs-dark/80">{ind.sizes}</p>
                <p className="mt-1.5 text-[13.5px] text-mjs-dark/60">{ind.tip}</p>
              </div>
            </li>
          ))}
        </ul>
      </GuideSection>

      {/* ── 5. All sizes ─────────────────────────────────────── */}
      <GuideSection id="all" n="05" title="Every size on one chart" intro="Bookmark this. Tap any row to jump back up to its liners.">
        <div className="overflow-x-auto rounded-3xl" style={{ background: PANEL }}>
          <table className="w-full min-w-[720px] text-[14.5px]">
            <thead>
              <tr className="text-left text-[11px] font-black uppercase tracking-[2px] text-mjs-dark/55">
                <th className="px-5 py-4">Can</th><th className="px-5 py-4">Bag size</th><th className="px-5 py-4">Typical can</th><th className="px-5 py-4">Where it&apos;s used</th><th className="px-5 py-4">Top pick</th>
              </tr>
            </thead>
            <tbody>
              {CAN_SIZES.map((c, i) => {
                const top = pick(products, c.picks[Math.min(1, c.picks.length - 1)].sku) || pick(products, c.picks[0].sku);
                return (
                  <tr key={c.id} onClick={() => choose(i)} className={`cursor-pointer border-t border-mjs-dark/10 transition-colors hover:bg-white/70 ${i === active ? "bg-white" : ""}`}>
                    <td className="px-5 py-3 font-black text-mjs-dark whitespace-nowrap">{c.gallon} gal</td>
                    <td className="px-5 py-3 font-bold tabular-nums text-mjs-dark">{c.bagWidth}&quot; × {c.bagHeight}&quot;</td>
                    <td className="px-5 py-3 text-mjs-dark/75">{c.canType}</td>
                    <td className="px-5 py-3 text-mjs-dark/75">{c.whereUsed}</td>
                    <td className="px-5 py-3">
                      {top && (
                        <span className="inline-flex items-center gap-3">
                          <span className="relative w-10 h-10 rounded-lg bg-white overflow-hidden">{top.image && <Image src={top.image} alt="" fill sizes="40px" className="object-contain p-1" />}</span>
                          <span className="font-bold text-mjs-dark">${top.price.toFixed(2)} <span className="font-semibold text-mjs-dark/50">{top.pack}</span></span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-8 rounded-3xl bg-[#e6f6ee] p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-5">
          <Leaf className="w-8 h-8 text-emerald-700 shrink-0" />
          <div className="flex-1">
            <h3 className="text-[17px] font-black text-mjs-dark">Going green? We carry compostable liners.</h3>
            <p className="mt-1 text-[14.5px] text-mjs-dark/70">Plant-based SunnyCare liners in 24×33, 33×40 and 40×48. They break down in commercial composting, ideal for cafeterias and schools.</p>
          </div>
          <Link href="/category/trash-liners" className="inline-flex items-center gap-2 rounded-full bg-mjs-dark px-5 py-3 text-[14px] font-black text-white hover:bg-black">Shop compostable <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </GuideSection>

      <GuideCta title="Ready to order the right size?" text="Clear, black, drawstring and compostable liners by the case, with free local delivery on $399+ subtotals across Orange, LA and the Inland Empire." href="/category/trash-liners" label="Shop all trash liners" />
    </article>
  );
}
