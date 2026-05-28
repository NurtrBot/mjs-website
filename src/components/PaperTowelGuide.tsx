"use client";

import { useState } from "react";
import {
  ChevronRight,
  ArrowRight,
  Check,
  X,
  Info,
  Layers,
  Building2,
  UtensilsCrossed,
  Stethoscope,
  School,
  Warehouse,
  Home,
} from "lucide-react";
import Link from "next/link";

/* ─────────────────────────── Data ─────────────────────────── */

type TowelType = "hardwound" | "multifold" | "cfold" | "centerpull" | "kitchen";

interface TowelOption {
  id: TowelType;
  name: string;
  tagline: string;
  color: string;
  bgColor: string;
  borderColor: string;
  foldDescription: string;
  sheetSize: string;
  dispenserType: string;
  costPerTowel: string;
  wasteLevel: number;
  capacityRating: number;
  touchPoints: string;
  pros: string[];
  cons: string[];
  bestFor: string[];
  products: { label: string; sku: string; slug: string }[];
  dispensers: { label: string; sku: string; slug: string }[];
}

const TOWELS: TowelOption[] = [
  {
    id: "hardwound",
    name: "Hardwound Roll",
    tagline: "The high-capacity workhorse",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    foldDescription: "Continuous roll that feeds through a lever-action or automatic dispenser. User pulls to tear.",
    sheetSize: '8" x custom length',
    dispenserType: "Lever-action or automatic roll dispenser",
    costPerTowel: "$0.008-0.015",
    wasteLevel: 1,
    capacityRating: 5,
    touchPoints: "Low — lever or touchless",
    pros: [
      "Lowest cost per hand dry",
      "Highest capacity — fewer refills",
      "Less waste (controlled dispensing)",
      "Touchless options available",
      "Available in 350 ft to 800 ft rolls",
    ],
    cons: [
      "Requires specific dispenser",
      "Higher upfront dispenser cost",
      "Can jam if low quality",
    ],
    bestFor: ["High-traffic restrooms", "Warehouses", "Schools", "Healthcare"],
    products: [
      { label: "Premium Roll Towel 8\"x600ft White", sku: "5108", slug: "janitors-finest-premium-plus-roll-towel-1-ply-8-x-600-ft-white-12-rolls-carton-5108" },
      { label: "Roll Towel 8\"x350ft White", sku: "5101", slug: "hardwound-paper-roll-towels-8-x-350-white-12-rolls-case-5101" },
      { label: "Roll Towel 8\"x800ft White", sku: "5109", slug: "janitors-finest-premium-hardwound-roll-towels-8-x-800ft-white-6-rolls-carton-5109" },
      { label: "Roll Towel 8\"x600ft Natural", sku: "5105", slug: "janitors-finest-hardwound-paper-roll-towels-8-x-600-natural-12-rolls-case-5105" },
    ],
    dispensers: [
      { label: "Lever-Action Roll Dispenser", sku: "TD500", slug: "td-500-roll-paper-towel-dispenser-with-lever-action" },
      { label: "Marathon Automated Dispenser", sku: "980144024", slug: "marathon-automated-paper-towel-dispenser-black" },
    ],
  },
  {
    id: "multifold",
    name: "Multifold (M-Fold)",
    tagline: "The all-around standard",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    foldDescription: "Folded into thirds (like a letter). Interlocked so pulling one pops the next into position.",
    sheetSize: '9.5" x 9.25"',
    dispenserType: "Universal folded towel dispenser",
    costPerTowel: "$0.007-0.010",
    wasteLevel: 2,
    capacityRating: 3,
    touchPoints: "Low — single towel dispensing",
    pros: [
      "Most popular commercial towel",
      "Single-towel dispensing reduces waste",
      "Fits most universal dispensers",
      "Good balance of cost and quality",
      "Available in white and kraft/natural",
    ],
    cons: [
      "Smaller than C-fold when unfolded",
      "Can jam in dispensers if overpacked",
      "Moderate capacity per refill",
    ],
    bestFor: ["Offices", "Retail", "General restrooms", "Break rooms"],
    products: [
      { label: "Premium Multifold White (4000/ct)", sku: "5300", slug: "janitors-finest-5300-premium-2-ply-white-multifold-towels-16-packs-250-sheets-4000-towels" },
      { label: "Multifold Kraft/Natural (4000/ct)", sku: "5302", slug: "janitors-finest-multifold-paper-towels-kraft-9-45-x-9-25-250-towels-pack-16-packs-carton" },
      { label: "Genuine Joe Multifold White (4000/ct)", sku: "GJO21100", slug: "genuine-joe-multifold-towels-1-ply-9-50-x-9-10-white-interfolded-embossed-anti-contamination-chlorine-free-250-quantity-per-bundle-4000-carton" },
    ],
    dispensers: [
      { label: "Folded Towel Dispenser (Plastic, Black)", sku: "TD300", slug: "td-300-paper-towel-dispenser-m-fold-c-fold" },
      { label: "Acrylic Wall Mount (Clear)", sku: "432-CLR", slug: "alpine-industries-432-wall-mount-folded-paper-towel-dispenser-w-150-towel-capacity-acrylic-clear" },
      { label: "Stainless Steel Dispenser", sku: "481S", slug: "alpine-industries-481s-wall-mount-towel-dispenser-10-8w-x-7h-stainless-steel" },
    ],
  },
  {
    id: "cfold",
    name: "C-Fold",
    tagline: "The classic fold",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    foldDescription: "Folded into a C shape (two folds). Stacked in dispenser. User pulls one at a time.",
    sheetSize: '10" x 12" (unfolded)',
    dispenserType: "Universal folded towel dispenser (same as multifold)",
    costPerTowel: "$0.009-0.012",
    wasteLevel: 3,
    capacityRating: 2,
    touchPoints: "Medium — sometimes pulls multiples",
    pros: [
      "Larger sheet size when unfolded",
      "Fits same dispensers as multifold",
      "Good for hand drying and light cleaning",
      "Familiar to most users",
    ],
    cons: [
      "Higher waste — users often grab multiples",
      "Not interfolded (no pop-up action)",
      "Lower dispenser capacity vs multifold",
      "Being phased out in favor of multifold",
    ],
    bestFor: ["Legacy installations", "Where larger sheets are needed"],
    products: [
      { label: "Multifold White (also C-Fold compatible)", sku: "5300", slug: "janitors-finest-5300-premium-2-ply-white-multifold-towels-16-packs-250-sheets-4000-towels" },
    ],
    dispensers: [
      { label: "C-Fold/Multifold Dispenser (White)", sku: "TD600", slug: "cfold-multifold-disp-white" },
      { label: "Acrylic Wall Mount (Black)", sku: "432-BLK", slug: "alpine-industries-432-wall-mount-folded-paper-towel-dispenser-w-150-towel-capacity-acrylic-black" },
    ],
  },
  {
    id: "centerpull",
    name: "Center-Pull",
    tagline: "One-handed convenience",
    color: "text-violet-700",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-200",
    foldDescription: "Perforated roll that feeds from the center. Pull straight down for a single sheet.",
    sheetSize: '7.5" x 10" per sheet',
    dispenserType: "Center-pull dispenser",
    costPerTowel: "$0.010-0.014",
    wasteLevel: 2,
    capacityRating: 4,
    touchPoints: "Very low — one-hand pull",
    pros: [
      "One-handed dispensing",
      "Low touch points (hygienic)",
      "Good capacity per roll",
      "Works well in kitchens and food service",
    ],
    cons: [
      "Requires dedicated center-pull dispenser",
      "Slightly higher cost per sheet",
      "Can over-dispense if pulled too fast",
    ],
    bestFor: ["Food service", "Kitchens", "Healthcare", "Clean rooms"],
    products: [
      { label: "SunnyCare 10\"x800ft Roll", sku: "5110", slug: "sunnycare-1-ply-10-x-800-ft-white-6-rolls-carton-5110" },
    ],
    dispensers: [
      { label: "Center Pull Dispenser", sku: "TD330", slug: "td-330-center-pull-paper-towel-dispenser" },
    ],
  },
  {
    id: "kitchen",
    name: "Kitchen Roll",
    tagline: "Everyday perforated rolls",
    color: "text-rose-700",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
    foldDescription: "Standard perforated roll — tear off sheets as needed. No dispenser required.",
    sheetSize: '11" x 9" per sheet',
    dispenserType: "Countertop holder or free-standing",
    costPerTowel: "$0.015-0.020",
    wasteLevel: 4,
    capacityRating: 1,
    touchPoints: "High — open access",
    pros: [
      "No dispenser needed",
      "2-ply for better absorbency",
      "Familiar household format",
      "Good for kitchens, break rooms, and quick cleanup",
    ],
    cons: [
      "Highest waste — no dispensing control",
      "Most expensive per sheet",
      "Lowest capacity (frequent replacement)",
      "Not ideal for restrooms",
    ],
    bestFor: ["Break rooms", "Kitchens", "Maintenance carts"],
    products: [
      { label: "Kitchen Roll 2-Ply (30 rolls/ct)", sku: "ST852", slug: "soft-touch-kitchen-roll-towels-perforated-2-ply-11-x-9-white-85-sheets-roll-30-rls-ct-st852" },
    ],
    dispensers: [],
  },
];

const INDUSTRY_PICKS = [
  { icon: <Building2 className="w-6 h-6" />, industry: "Office Buildings", pick: "Multifold or Hardwound Roll", why: "Multifold for standard restrooms. Hardwound for high-traffic lobbies. Balance cost with professional appearance.", color: "text-blue-600", bgColor: "bg-blue-50" },
  { icon: <UtensilsCrossed className="w-6 h-6" />, industry: "Restaurants", pick: "Center-Pull + Kitchen Roll", why: "Center-pull for prep areas (one-handed, hygienic). Kitchen roll for counters and quick cleanup.", color: "text-amber-600", bgColor: "bg-amber-50" },
  { icon: <Stethoscope className="w-6 h-6" />, industry: "Healthcare", pick: "Hardwound Roll (Touchless)", why: "Automated touchless dispensers reduce cross-contamination. High capacity handles 24/7 traffic.", color: "text-emerald-600", bgColor: "bg-emerald-50" },
  { icon: <School className="w-6 h-6" />, industry: "Schools", pick: "Hardwound Roll", why: "Kids waste paper towels. Controlled dispensing limits use per pull and saves thousands per year.", color: "text-violet-600", bgColor: "bg-violet-50" },
  { icon: <Warehouse className="w-6 h-6" />, industry: "Warehouses", pick: "Hardwound Roll (Natural)", why: "Natural/kraft rolls are cheaper and work fine where appearance doesn't matter. 800ft rolls reduce change-outs.", color: "text-orange-600", bgColor: "bg-orange-50" },
  { icon: <Home className="w-6 h-6" />, industry: "Property Management", pick: "Multifold", why: "Universal dispensers are already installed in most buildings. Multifold is the easiest drop-in replacement.", color: "text-rose-600", bgColor: "bg-rose-50" },
];

/* ─────────────────────────── Component ─────────────────────────── */

function RatingDots({ value, max = 5, color }: { value: number; max?: number; color: string }) {
  return (
    <div className="flex gap-1">
      {[...Array(max)].map((_, i) => (
        <div key={i} className={`w-2.5 h-2.5 rounded-full ${i < value ? color : "bg-gray-200"}`} />
      ))}
    </div>
  );
}

export default function PaperTowelGuide() {
  const [activeTab, setActiveTab] = useState<TowelType>("hardwound");
  const active = TOWELS.find((t) => t.id === activeTab)!;

  return (
    <section className="bg-white min-h-screen">
      {/* ── Hero ── */}
      <div className="bg-gradient-to-br from-mjs-dark via-mjs-charcoal to-mjs-dark">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
          <nav className="flex items-center justify-center gap-2 text-xs text-mjs-gray-400 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">Guides</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-mjs-red">Paper Towel Guide</span>
          </nav>
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-mjs-red/10 border border-mjs-red/20 text-mjs-red px-3 py-1.5 rounded-full text-xs font-semibold mb-4 uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              Buying Guide
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
              C-Fold vs Multifold<br />vs Roll Towels
            </h1>
            <p className="text-lg md:text-xl text-mjs-gray-300 leading-relaxed max-w-2xl mx-auto">
              The right paper towel saves money, reduces waste, and keeps restrooms stocked longer.
              Here&apos;s how to choose.
            </p>
          </div>
        </div>
      </div>

      {/* ── Quick Jump ── */}
      <div className="border-b border-gray-100 bg-mjs-gray-50 sticky top-0 z-20">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center justify-center gap-1 py-3 overflow-x-auto scrollbar-hide">
            <span className="text-xs font-semibold text-mjs-gray-400 mr-2 shrink-0 uppercase tracking-wider">Jump to:</span>
            {["Compare", "Side by Side", "By Industry", "Shop All"].map((label) => (
              <a key={label} href={`#${label.toLowerCase().replace(/ /g, "-")}`} className="shrink-0 px-3 py-1.5 text-xs font-semibold rounded-full bg-white border border-gray-200 text-mjs-gray-600 hover:border-mjs-red hover:text-mjs-red transition-all">
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Interactive Towel Comparison ── */}
      <div id="compare" className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-4xl font-extrabold text-mjs-dark mb-3">Which Paper Towel Type Is Right?</h2>
          <p className="text-mjs-gray-500 text-base md:text-lg max-w-2xl mx-auto">Select a towel type to see the full breakdown — fold style, dispenser compatibility, cost, and our picks.</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {TOWELS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex flex-col items-center px-4 py-3 rounded-xl transition-all duration-200 border-2 min-w-[90px] ${activeTab === t.id ? `${t.borderColor} bg-white shadow-lg scale-105` : "border-gray-200 bg-white hover:shadow-md"}`}
            >
              <span className={`text-sm font-bold ${activeTab === t.id ? t.color : "text-mjs-dark"}`}>{t.name}</span>
              <span className="text-[10px] text-mjs-gray-400 mt-0.5">{t.tagline}</span>
            </button>
          ))}
        </div>

        {/* Detail card */}
        <div className={`rounded-2xl border ${active.borderColor} overflow-hidden`}>
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-0">
            {/* Left */}
            <div className={`${active.bgColor} p-6 md:p-10 border-b lg:border-b-0 lg:border-r ${active.borderColor}`}>
              <h3 className={`text-2xl font-black ${active.color} mb-2`}>{active.name}</h3>
              <p className="text-sm text-mjs-gray-600 mb-4">{active.foldDescription}</p>

              <div className="space-y-3 mb-6">
                {[
                  { label: "Waste Level", value: active.wasteLevel, inverted: true },
                  { label: "Dispenser Capacity", value: active.capacityRating },
                ].map((r) => (
                  <div key={r.label} className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-mjs-gray-600">{r.label}</span>
                    <RatingDots value={r.inverted ? 6 - r.value : r.value} color={active.bgColor.replace("50", "500")} />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/70 rounded-lg p-3 text-center">
                  <div className="text-[10px] font-semibold text-mjs-gray-400 uppercase">Sheet Size</div>
                  <div className="text-xs font-bold text-mjs-dark">{active.sheetSize}</div>
                </div>
                <div className="bg-white/70 rounded-lg p-3 text-center">
                  <div className="text-[10px] font-semibold text-mjs-gray-400 uppercase">Cost/Towel</div>
                  <div className="text-xs font-bold text-mjs-dark">{active.costPerTowel}</div>
                </div>
                <div className="bg-white/70 rounded-lg p-3 text-center col-span-2">
                  <div className="text-[10px] font-semibold text-mjs-gray-400 uppercase">Dispenser Type</div>
                  <div className="text-xs font-bold text-mjs-dark">{active.dispenserType}</div>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="p-6 md:p-10 bg-white">
              <div className="grid sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-xs font-semibold text-mjs-gray-400 uppercase tracking-wider mb-3">Advantages</h4>
                  <ul className="space-y-2">
                    {active.pros.map((p) => (
                      <li key={p} className="flex gap-2 text-sm text-mjs-gray-700"><Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />{p}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-mjs-gray-400 uppercase tracking-wider mb-3">Limitations</h4>
                  <ul className="space-y-2">
                    {active.cons.map((c) => (
                      <li key={c} className="flex gap-2 text-sm text-mjs-gray-700"><X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />{c}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-xs font-semibold text-mjs-gray-400 uppercase tracking-wider mb-3">Best For</h4>
                <div className="flex flex-wrap gap-2">
                  {active.bestFor.map((b) => (
                    <span key={b} className={`px-3 py-1.5 rounded-full text-xs font-semibold ${active.bgColor} ${active.color}`}>{b}</span>
                  ))}
                </div>
              </div>

              {/* Products */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-mjs-gray-400 uppercase tracking-wider mb-3">Shop Towels</h4>
                <div className="space-y-2">
                  {active.products.map((p) => (
                    <Link key={p.sku} href={`/product/${p.slug}`} className="flex items-center justify-between bg-mjs-gray-50 rounded-lg p-3 border border-gray-100 hover:border-mjs-red/30 hover:shadow-sm transition-all group">
                      <div>
                        <div className="text-sm font-semibold text-mjs-dark group-hover:text-mjs-red transition-colors">{p.label}</div>
                        <div className="text-xs text-mjs-gray-400">SKU: {p.sku}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-mjs-gray-300 group-hover:text-mjs-red transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Dispensers */}
              {active.dispensers.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-mjs-gray-400 uppercase tracking-wider mb-3">Compatible Dispensers</h4>
                  <div className="space-y-2">
                    {active.dispensers.map((d) => (
                      <Link key={d.sku} href={`/product/${d.slug}`} className="flex items-center justify-between bg-mjs-gray-50 rounded-lg p-3 border border-gray-100 hover:border-mjs-red/30 hover:shadow-sm transition-all group">
                        <div>
                          <div className="text-sm font-semibold text-mjs-dark group-hover:text-mjs-red transition-colors">{d.label}</div>
                          <div className="text-xs text-mjs-gray-400">SKU: {d.sku}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-mjs-gray-300 group-hover:text-mjs-red transition-colors" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Side-by-Side Table ── */}
      <div id="side-by-side" className="bg-mjs-gray-50 border-y border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
          <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-8 text-center">Side-by-Side Comparison</h2>
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mjs-dark text-white">
                  <th className="text-left px-4 py-3 font-semibold">Feature</th>
                  {TOWELS.map((t) => (<th key={t.id} className="text-center px-3 py-3 font-semibold text-xs">{t.name}</th>))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-100">
                  <td className="px-4 py-3 font-semibold text-mjs-dark">Cost/Towel</td>
                  {TOWELS.map((t) => (<td key={t.id} className="px-3 py-3 text-center text-xs font-mono">{t.costPerTowel}</td>))}
                </tr>
                <tr className="border-t border-gray-100">
                  <td className="px-4 py-3 font-semibold text-mjs-dark">Sheet Size</td>
                  {TOWELS.map((t) => (<td key={t.id} className="px-3 py-3 text-center text-xs">{t.sheetSize}</td>))}
                </tr>
                <tr className="border-t border-gray-100">
                  <td className="px-4 py-3 font-semibold text-mjs-dark">Waste Control</td>
                  {TOWELS.map((t) => (<td key={t.id} className="px-3 py-3 text-center"><div className="flex justify-center"><RatingDots value={6 - t.wasteLevel} color="bg-green-500" /></div></td>))}
                </tr>
                <tr className="border-t border-gray-100">
                  <td className="px-4 py-3 font-semibold text-mjs-dark">Capacity</td>
                  {TOWELS.map((t) => (<td key={t.id} className="px-3 py-3 text-center"><div className="flex justify-center"><RatingDots value={t.capacityRating} color="bg-blue-500" /></div></td>))}
                </tr>
                <tr className="border-t border-gray-100">
                  <td className="px-4 py-3 font-semibold text-mjs-dark">Touch Points</td>
                  {TOWELS.map((t) => (<td key={t.id} className="px-3 py-3 text-center text-xs">{t.touchPoints}</td>))}
                </tr>
                <tr className="border-t border-gray-100 bg-mjs-gray-50">
                  <td className="px-4 py-3 font-bold text-mjs-dark">Dispenser Needed</td>
                  {TOWELS.map((t) => (<td key={t.id} className="px-3 py-3 text-center">{t.id === "kitchen" ? <X className="w-4 h-4 text-gray-400 mx-auto" /> : <Check className="w-4 h-4 text-green-500 mx-auto" />}</td>))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Industry Recommendations ── */}
      <div id="by-industry" className="bg-mjs-dark">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3 text-center">Best Pick by Industry</h2>
          <p className="text-mjs-gray-400 text-center mb-10 max-w-2xl mx-auto">What we recommend based on traffic, budget, and hygiene requirements.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {INDUSTRY_PICKS.map((r) => (
              <div key={r.industry} className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg ${r.bgColor} ${r.color} flex items-center justify-center`}>{r.icon}</div>
                  <div>
                    <h3 className="text-base font-bold text-white">{r.industry}</h3>
                    <span className="text-xs font-semibold text-mjs-gold">{r.pick}</span>
                  </div>
                </div>
                <p className="text-xs text-mjs-gray-400 leading-relaxed">{r.why}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Pro Tip ── */}
      <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-16">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex gap-4">
          <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-blue-800 mb-1">Switching from C-Fold to Multifold?</p>
            <p className="text-sm text-blue-700">Most C-fold dispensers accept multifold towels without any modification. You&apos;ll get better single-towel dispensing, less waste, and the same or lower cost. It&apos;s the easiest upgrade in facility management.</p>
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div id="shop-all" className="bg-gradient-to-r from-mjs-red to-mjs-red-dark">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">Shop Paper Products & Dispensers</h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">Towels, tissue, napkins, dispensers — all at wholesale prices. Free local delivery.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/category/paper-products" className="inline-flex items-center gap-2 bg-white text-mjs-red font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors">
              <Layers className="w-4 h-4" /> Shop Paper Products
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white font-bold px-6 py-3 rounded-lg hover:bg-white/20 transition-colors">
              Need Samples? Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
