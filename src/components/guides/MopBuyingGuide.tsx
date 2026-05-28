"use client";

import { useState } from "react";
import {
  ChevronRight,
  ArrowRight,
  Check,
  X,
  Info,
  Droplets,
  Ruler,
  Building2,
  Stethoscope,
  UtensilsCrossed,
  School,
  Factory,
  Warehouse,
  Palette,
  RefreshCw,
  Star,
} from "lucide-react";
import Link from "next/link";

/* ─────────────────────────── Data ─────────────────────────── */

type MopType = "dust" | "cutend" | "loopend" | "microfiber";

interface MopCategory {
  id: MopType;
  name: string;
  tagline: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  pros: string[];
  cons: string[];
  bestFor: string[];
  lifespan: string;
  absorbency: number;
  durability: number;
  lintFree: number;
  easeOfUse: number;
  products: { label: string; sku: string; slug: string }[];
}

const MOP_TYPES: MopCategory[] = [
  {
    id: "dust",
    name: "Dust Mop",
    tagline: "Dry floor prep, large areas",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    description:
      "Flat heads with long fibers designed to attract and hold dust, dirt, and debris from hard floors. Used before wet mopping to remove loose soil. Essential first step in any hard floor maintenance program.",
    pros: [
      "Covers large areas quickly",
      "Attracts and holds fine dust particles",
      "Reduces wet mop contamination",
      "Extends floor finish life by removing abrasive grit",
      "Available in widths from 18\" to 60\"",
    ],
    cons: [
      "Dry use only — not for spills or stains",
      "Must be laundered or treated regularly",
      "Large sizes can be awkward in tight spaces",
      "Needs dust mop treatment spray for best results",
    ],
    bestFor: ["Warehouses & large floors", "Hallways & corridors", "Retail sales floors", "Pre-wet-mopping prep"],
    lifespan: "3-6 months",
    absorbency: 1,
    durability: 4,
    lintFree: 3,
    easeOfUse: 5,
    products: [
      { label: "24\" Blue Dust Mop Head", sku: "92524B", slug: "24-x-5-blue-dust-mop-head" },
      { label: "36\" Blue Dust Mop Head", sku: "92536B", slug: "36-x-5-blue-dust-mop-head" },
      { label: "24\" Dust Mop Frame", sku: "9524F", slug: "24-dust-mop-frame" },
      { label: "Clip-On Dust Mop Handle", sku: "9000", slug: "clip-on-dust-mop-handle-wood" },
    ],
  },
  {
    id: "cutend",
    name: "Cut-End Wet Mop",
    tagline: "Budget workhorse, disposable",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    description:
      "Traditional wet mop with cut (straight-edge) yarn strands. The most economical option for general wet mopping. Available in cotton or rayon. Cotton absorbs more; rayon releases solution better and is more lint-free.",
    pros: [
      "Lowest cost per mop head",
      "Good absorbency for general cleaning",
      "Easy to wring out",
      "Widely available in multiple materials",
      "Good for single-use or short-life applications",
    ],
    cons: [
      "Frays and tangles with repeated use",
      "Harder to launder than loop-end",
      "Cotton varieties leave more lint",
      "Shorter lifespan than loop-end mops",
    ],
    bestFor: ["Budget-conscious operations", "High-turnover facilities", "Light to medium duty", "Disposable mop programs"],
    lifespan: "1-3 months",
    absorbency: 4,
    durability: 2,
    lintFree: 2,
    easeOfUse: 4,
    products: [
      { label: "Cotton Cut-End #24 White", sku: "8011724", slug: "cut-end-wet-mop-head-cotton-no-24-white" },
      { label: "Rayon Cut-End 24oz White", sku: "8852024", slug: "cut-end-wet-mop-heads-rayon-24-oz-white" },
    ],
  },
  {
    id: "loopend",
    name: "Loop-End Wet Mop",
    tagline: "Professional grade, durable",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    description:
      "Yarn strands are looped and banded at the ends, preventing fraying and tangling. The professional standard for commercial wet mopping. Lasts significantly longer than cut-end and provides more uniform floor coverage.",
    pros: [
      "Won't fray, tangle, or unravel",
      "Lasts 4-5x longer than cut-end",
      "Machine washable — maintains shape",
      "More uniform coverage and cleaning",
      "Available in color-coded options",
    ],
    cons: [
      "Higher initial cost than cut-end",
      "Slightly heavier when saturated",
      "Requires compatible side-press wringer",
    ],
    bestFor: ["Professional janitorial", "Healthcare facilities", "Schools & universities", "Any facility wanting lower long-term cost"],
    lifespan: "6-12 months",
    absorbency: 4,
    durability: 5,
    lintFree: 4,
    easeOfUse: 4,
    products: [
      { label: "Super Loop Large Blue", sku: "8997LG5BLU", slug: "super-loop-wet-mop-head-cotton-synthetic-large-size-blue" },
      { label: "Quick Change Mop Handle", sku: "1015", slug: "quick-change-metal-head-wooden-mop-handle-20-and-up-1-1-8-dia-x-63" },
    ],
  },
  {
    id: "microfiber",
    name: "Microfiber Flat Mop",
    tagline: "Modern, efficient, green",
    color: "text-violet-700",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-200",
    description:
      "Ultra-fine synthetic fibers (split polyester/polyamide) on a flat mop frame. Uses 90% less water and chemical than traditional mops. The ergonomic choice that reduces strain and cross-contamination with single-use pad changes.",
    pros: [
      "Uses 90% less water and chemical",
      "Reduces cross-contamination (single-use pads)",
      "Ergonomic — lighter, less bending",
      "Superior dust and bacteria pickup",
      "Machine washable up to 500+ times",
    ],
    cons: [
      "Higher upfront system cost",
      "Not ideal for large spill cleanup",
      "Requires dedicated bucket system",
      "Small pads need frequent changing in large areas",
    ],
    bestFor: ["Healthcare & clean rooms", "Green cleaning programs", "Offices & corporate", "Any operation focused on hygiene"],
    lifespan: "500+ washes",
    absorbency: 3,
    durability: 5,
    lintFree: 5,
    easeOfUse: 5,
    products: [
      { label: "18\" Microfiber Mop Head Refill", sku: "M830018B", slug: "18-blue-microfiber-mop-head-refill" },
      { label: "18\" Microfiber Mop Complete System", sku: "M8300COMP", slug: "18-inch-microfiber-mop-frame-and-telescopic-pole-complete" },
      { label: "Microfiber Mop Bucket w/ Strainer", sku: "M77002", slug: "microfiber-mop-bucket-with-strainer-and-lid-yellow-for-use-with-18-mops-m77002" },
    ],
  },
];

interface MaterialComparison {
  material: string;
  absorbency: number;
  durability: number;
  lint: number;
  chemical: number;
  cost: string;
  bestUse: string;
}

const MATERIALS: MaterialComparison[] = [
  { material: "Cotton", absorbency: 5, durability: 2, lint: 2, chemical: 2, cost: "$", bestUse: "General cleaning, stripping floors" },
  { material: "Rayon", absorbency: 4, durability: 3, lint: 4, chemical: 4, cost: "$$", bestUse: "Floor finishing, healthcare, food service" },
  { material: "Synthetic Blend", absorbency: 4, durability: 4, lint: 4, chemical: 5, cost: "$$", bestUse: "Heavy-duty, chemical-resistant applications" },
  { material: "Microfiber", absorbency: 3, durability: 5, lint: 5, chemical: 3, cost: "$$$", bestUse: "Healthcare, green cleaning, daily maintenance" },
];

const DUST_MOP_SIZES = [
  { size: '24"', area: "Up to 2,000 sq ft", use: "Offices, break rooms, small retail", recommended: false },
  { size: '36"', area: "2,000-5,000 sq ft", use: "Classrooms, medium retail, lobbies", recommended: true },
  { size: '48"', area: "5,000-10,000 sq ft", use: "Large retail, gymnasiums, warehouses", recommended: false },
  { size: '60"', area: "10,000+ sq ft", use: "Distribution centers, convention halls", recommended: false },
];

const WET_MOP_SIZES = [
  { size: "#16 (16 oz)", area: "Up to 1,000 sq ft", use: "Restrooms, small areas, detail work", recommended: false },
  { size: "#24 (24 oz)", area: "1,000-3,000 sq ft", use: "Most common — offices, classrooms, corridors", recommended: true },
  { size: "#32 (32 oz)", area: "3,000+ sq ft", use: "Large open areas, cafeterias, gymnasiums", recommended: false },
];

interface BucketOption {
  name: string;
  capacity: string;
  sku: string;
  slug: string;
  bestFor: string;
  wringer: string;
}

const BUCKETS: BucketOption[] = [
  { name: "Microfiber Mop Bucket", capacity: "Fits 18\" pads", sku: "M77002", slug: "microfiber-mop-bucket-with-strainer-and-lid-yellow-for-use-with-18-mops-m77002", bestFor: "Microfiber flat mop systems", wringer: "Built-in strainer" },
  { name: "Side Press 26 Qt", capacity: "26 quart", sku: "8028", slug: "mop-bucket-wringer-combos-side-press-26-qt-plastic-yellow", bestFor: "Restrooms, small areas, tight spaces", wringer: "Side press" },
  { name: "Side Press 35 Qt", capacity: "35 quart", sku: "8036", slug: "mop-bucket-and-wringer-combo-35-qt-sidepress-yellow", bestFor: "General purpose, most applications", wringer: "Side press" },
];

const INDUSTRY_PICKS = [
  { icon: <Stethoscope className="w-6 h-6" />, industry: "Healthcare", pick: "Microfiber Flat Mop", why: "Reduces cross-contamination with single-use pads. Uses less chemical. Color coding prevents zone cross-over.", color: "text-blue-600", bgColor: "bg-blue-50" },
  { icon: <UtensilsCrossed className="w-6 h-6" />, industry: "Food Service", pick: "Rayon Cut-End or Loop-End", why: "Rayon is lint-free for food areas. Chemical resistant for sanitizer solutions. Easy to sanitize and replace.", color: "text-amber-600", bgColor: "bg-amber-50" },
  { icon: <School className="w-6 h-6" />, industry: "Schools", pick: "Loop-End + 36\" Dust Mop", why: "Loop-end handles heavy traffic hallways. 36\" dust mop covers classrooms efficiently. Durability lowers cost per year.", color: "text-violet-600", bgColor: "bg-violet-50" },
  { icon: <Building2 className="w-6 h-6" />, industry: "Office Buildings", pick: "Microfiber or Loop-End", why: "Microfiber for daily restroom and break room cleaning. Loop-end for periodic deep mopping of lobbies and corridors.", color: "text-emerald-600", bgColor: "bg-emerald-50" },
  { icon: <Warehouse className="w-6 h-6" />, industry: "Warehouse", pick: "48-60\" Dust Mop + Loop-End #32", why: "Wide dust mops for massive floor areas. Large-capacity wet mop for spill cleanup and dock areas.", color: "text-orange-600", bgColor: "bg-orange-50" },
  { icon: <Factory className="w-6 h-6" />, industry: "Manufacturing", pick: "Synthetic Blend Loop-End", why: "Chemical-resistant for industrial cleaners. Heavy-duty for oil, grease, and machine shop floors. Long lifespan.", color: "text-rose-600", bgColor: "bg-rose-50" },
];

const COLOR_CODE_GUIDE = [
  { color: "Red", bgClass: "bg-red-500", use: "Restrooms — toilets, urinals, high-contamination areas" },
  { color: "Blue", bgClass: "bg-blue-500", use: "General cleaning — offices, corridors, common areas" },
  { color: "Green", bgClass: "bg-green-500", use: "Food service — kitchens, cafeterias, break rooms" },
  { color: "Yellow", bgClass: "bg-yellow-400", use: "Isolation areas — healthcare, chemical spills" },
];

/* ─────────────────────────── Helpers ─────────────────────────── */

function RatingDots({ value, max = 5, color }: { value: number; max?: number; color: string }) {
  return (
    <div className="flex gap-1">
      {[...Array(max)].map((_, i) => (
        <div key={i} className={`w-2.5 h-2.5 rounded-full ${i < value ? color : "bg-gray-200"}`} />
      ))}
    </div>
  );
}

/* ─────────────────────────── Component ─────────────────────────── */

export default function MopBuyingGuide() {
  const [activeTab, setActiveTab] = useState<MopType>("loopend");
  const activeMop = MOP_TYPES.find((m) => m.id === activeTab)!;

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
            <span className="text-mjs-red">Mop Buying Guide</span>
          </nav>

          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-mjs-red/10 border border-mjs-red/20 text-mjs-red px-3 py-1.5 rounded-full text-xs font-semibold mb-4 uppercase tracking-wider">
              <Droplets className="w-3.5 h-3.5" />
              Buying Guide
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
              Commercial Mop<br />Buying Guide
            </h1>
            <p className="text-lg md:text-xl text-mjs-gray-300 leading-relaxed max-w-2xl mx-auto">
              Dust mops, cut-end, loop-end, microfiber — how to choose the right mop type, material, and size for your facility.
            </p>
          </div>
        </div>
      </div>

      {/* ── Quick Jump ── */}
      <div className="border-b border-gray-100 bg-mjs-gray-50 sticky top-0 z-20">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center justify-center gap-1 py-3 overflow-x-auto scrollbar-hide">
            <span className="text-xs font-semibold text-mjs-gray-400 mr-2 shrink-0 uppercase tracking-wider">Jump to:</span>
            {["Compare", "Materials", "Size Guide", "Buckets", "Mop Care", "By Industry", "Shop All"].map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase().replace(/ /g, "-")}`}
                className="shrink-0 px-3 py-1.5 text-xs font-semibold rounded-full bg-white border border-gray-200 text-mjs-gray-600 hover:border-mjs-red hover:text-mjs-red transition-all"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Mop Type Comparison ── */}
      <div id="compare" className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-4xl font-extrabold text-mjs-dark mb-3">
            Which Mop Type Is Right for You?
          </h2>
          <p className="text-mjs-gray-500 text-base md:text-lg max-w-2xl mx-auto">
            Four mop categories, each designed for different tasks and facility needs.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {MOP_TYPES.map((m) => (
            <button
              key={m.id}
              onClick={() => setActiveTab(m.id)}
              className={`
                relative flex flex-col items-center px-4 md:px-6 py-4 rounded-xl transition-all duration-200 border-2 min-w-[90px]
                ${activeTab === m.id
                  ? `${m.borderColor} bg-white shadow-lg scale-105`
                  : "border-gray-200 bg-white hover:shadow-md"
                }
              `}
            >
              <div className={`w-8 h-8 rounded-full mb-2 ${activeTab === m.id ? m.bgColor : "bg-gray-100"}`}>
                <div className={`w-full h-full rounded-full flex items-center justify-center text-xs font-black ${activeTab === m.id ? m.color : "text-gray-400"}`}>
                  {m.name[0]}
                </div>
              </div>
              <span className={`text-xs md:text-sm font-bold ${activeTab === m.id ? m.color : "text-mjs-dark"}`}>
                {m.name}
              </span>
              <span className="text-[10px] text-mjs-gray-400 mt-0.5 hidden md:block">{m.tagline}</span>
              {activeTab === m.id && (
                <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full ${m.bgColor} border ${m.borderColor}`} />
              )}
            </button>
          ))}
        </div>

        {/* Active detail */}
        <div className={`rounded-2xl border ${activeMop.borderColor} overflow-hidden`}>
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-0">
            <div className={`${activeMop.bgColor} p-6 md:p-10 border-b lg:border-b-0 lg:border-r ${activeMop.borderColor}`}>
              <h3 className={`text-2xl md:text-3xl font-black ${activeMop.color} mb-2`}>
                {activeMop.name}
              </h3>
              <p className="text-sm text-mjs-gray-600 mb-6 leading-relaxed">{activeMop.description}</p>

              <div className="space-y-3 mb-6">
                {[
                  { label: "Absorbency", value: activeMop.absorbency },
                  { label: "Durability", value: activeMop.durability },
                  { label: "Lint-Free", value: activeMop.lintFree },
                  { label: "Ease of Use", value: activeMop.easeOfUse },
                ].map((r) => (
                  <div key={r.label} className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-mjs-gray-600">{r.label}</span>
                    <RatingDots value={r.value} color={activeMop.bgColor.replace("50", "500")} />
                  </div>
                ))}
              </div>

              <div className="bg-white/70 rounded-lg p-3 text-center">
                <div className="text-[10px] font-semibold text-mjs-gray-400 uppercase">Expected Lifespan</div>
                <div className="text-sm font-bold text-mjs-dark">{activeMop.lifespan}</div>
              </div>
            </div>

            <div className="p-6 md:p-10 bg-white">
              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div>
                  <h4 className="text-xs font-semibold text-mjs-gray-400 uppercase tracking-wider mb-3">Advantages</h4>
                  <ul className="space-y-2">
                    {activeMop.pros.map((p) => (
                      <li key={p} className="flex gap-2 text-sm text-mjs-gray-700">
                        <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-mjs-gray-400 uppercase tracking-wider mb-3">Limitations</h4>
                  <ul className="space-y-2">
                    {activeMop.cons.map((c) => (
                      <li key={c} className="flex gap-2 text-sm text-mjs-gray-700">
                        <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-xs font-semibold text-mjs-gray-400 uppercase tracking-wider mb-3">Best For</h4>
                <div className="flex flex-wrap gap-2">
                  {activeMop.bestFor.map((b) => (
                    <span key={b} className={`px-3 py-1.5 rounded-full text-xs font-semibold ${activeMop.bgColor} ${activeMop.color}`}>
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-mjs-gray-400 uppercase tracking-wider mb-3">Shop {activeMop.name}</h4>
                <div className="space-y-2">
                  {activeMop.products.map((p) => (
                    <Link
                      key={p.sku}
                      href={`/product/${p.slug}`}
                      className="flex items-center justify-between bg-mjs-gray-50 rounded-lg p-3 border border-gray-100 hover:border-mjs-red/30 hover:shadow-sm transition-all group"
                    >
                      <div>
                        <div className="text-sm font-semibold text-mjs-dark group-hover:text-mjs-red transition-colors">{p.label}</div>
                        <div className="text-xs text-mjs-gray-400">SKU: {p.sku}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-mjs-gray-300 group-hover:text-mjs-red transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Material Comparison ── */}
      <div id="materials" className="bg-mjs-gray-50 border-y border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
          <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-2 text-center">
            Head Material Comparison
          </h2>
          <p className="text-mjs-gray-500 text-center mb-8 max-w-xl mx-auto">
            The material matters as much as the mop type. Here is how they stack up.
          </p>

          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mjs-dark text-white">
                  <th className="text-left px-4 py-3 font-semibold">Material</th>
                  <th className="text-center px-4 py-3 font-semibold">Absorbency</th>
                  <th className="text-center px-4 py-3 font-semibold">Durability</th>
                  <th className="text-center px-4 py-3 font-semibold">Lint-Free</th>
                  <th className="text-center px-4 py-3 font-semibold">Chemical Resistance</th>
                  <th className="text-center px-4 py-3 font-semibold">Cost</th>
                  <th className="text-left px-4 py-3 font-semibold">Best Use</th>
                </tr>
              </thead>
              <tbody>
                {MATERIALS.map((m) => (
                  <tr key={m.material} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-bold text-mjs-dark">{m.material}</td>
                    <td className="px-4 py-3"><div className="flex justify-center"><RatingDots value={m.absorbency} color="bg-blue-500" /></div></td>
                    <td className="px-4 py-3"><div className="flex justify-center"><RatingDots value={m.durability} color="bg-emerald-500" /></div></td>
                    <td className="px-4 py-3"><div className="flex justify-center"><RatingDots value={m.lint} color="bg-violet-500" /></div></td>
                    <td className="px-4 py-3"><div className="flex justify-center"><RatingDots value={m.chemical} color="bg-amber-500" /></div></td>
                    <td className="px-4 py-3 text-center font-mono text-mjs-gray-600">{m.cost}</td>
                    <td className="px-4 py-3 text-xs text-mjs-gray-500">{m.bestUse}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Size Guide ── */}
      <div id="size-guide" className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-3">
            Size Selection Guide
          </h2>
          <p className="text-mjs-gray-500 max-w-2xl mx-auto">
            The right size means faster cleaning with less effort. Match mop size to your floor area.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Dust Mop Sizes */}
          <div>
            <h3 className="text-lg font-bold text-mjs-dark mb-4 flex items-center gap-2">
              <Ruler className="w-5 h-5 text-blue-500" /> Dust Mop Widths
            </h3>
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-mjs-dark text-white">
                    <th className="text-left px-4 py-3 font-semibold">Width</th>
                    <th className="text-left px-4 py-3 font-semibold">Coverage</th>
                    <th className="text-left px-4 py-3 font-semibold">Typical Use</th>
                  </tr>
                </thead>
                <tbody>
                  {DUST_MOP_SIZES.map((s) => (
                    <tr key={s.size} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-bold text-mjs-dark">
                        {s.size}
                        {s.recommended && <span className="ml-2 text-[10px] text-mjs-red font-semibold">POPULAR</span>}
                      </td>
                      <td className="px-4 py-3 text-mjs-gray-600">{s.area}</td>
                      <td className="px-4 py-3 text-xs text-mjs-gray-500">{s.use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Wet Mop Sizes */}
          <div>
            <h3 className="text-lg font-bold text-mjs-dark mb-4 flex items-center gap-2">
              <Droplets className="w-5 h-5 text-emerald-500" /> Wet Mop Sizes
            </h3>
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-mjs-dark text-white">
                    <th className="text-left px-4 py-3 font-semibold">Size</th>
                    <th className="text-left px-4 py-3 font-semibold">Coverage</th>
                    <th className="text-left px-4 py-3 font-semibold">Typical Use</th>
                  </tr>
                </thead>
                <tbody>
                  {WET_MOP_SIZES.map((s) => (
                    <tr key={s.size} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-bold text-mjs-dark">
                        {s.size}
                        {s.recommended && <span className="ml-2 text-[10px] text-mjs-red font-semibold">POPULAR</span>}
                      </td>
                      <td className="px-4 py-3 text-mjs-gray-600">{s.area}</td>
                      <td className="px-4 py-3 text-xs text-mjs-gray-500">{s.use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bucket & Wringer Guide ── */}
      <div id="buckets" className="bg-mjs-gray-50 border-y border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-3">
              Bucket & Wringer Guide
            </h2>
            <p className="text-mjs-gray-500 max-w-2xl mx-auto">
              The right bucket makes mopping faster, less messy, and more ergonomic.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {BUCKETS.map((b) => (
              <Link
                key={b.sku}
                href={`/product/${b.slug}`}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-mjs-red/30 transition-all group"
              >
                <h3 className="text-base font-bold text-mjs-dark group-hover:text-mjs-red transition-colors mb-1">{b.name}</h3>
                <div className="text-xs text-mjs-gray-400 mb-4">SKU: {b.sku}</div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-mjs-gray-400 font-semibold">Capacity</span>
                    <span className="text-mjs-dark font-bold">{b.capacity}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-mjs-gray-400 font-semibold">Wringer</span>
                    <span className="text-mjs-dark font-bold">{b.wringer}</span>
                  </div>
                </div>
                <p className="text-xs text-mjs-gray-500">{b.bestFor}</p>
                <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-mjs-red">
                  View Product <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Mop Care ── */}
      <div id="mop-care" className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-3">
            Proper Mop Care & Color Coding
          </h2>
          <p className="text-mjs-gray-500 max-w-2xl mx-auto">
            A well-maintained mop cleans better, lasts longer, and prevents cross-contamination.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Care tips */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-mjs-dark flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-mjs-red" /> Washing & Replacing
            </h3>
            {[
              { title: "Rinse after every use", detail: "Wring out thoroughly and rinse in clean water. Never leave a mop sitting in dirty solution." },
              { title: "Launder weekly (or more)", detail: "Machine wash loop-end and microfiber heads in warm water with bleach-free detergent. Air dry or tumble dry low." },
              { title: "Replace on schedule", detail: "Cut-end: every 1-3 months. Loop-end: every 6-12 months. Microfiber: when pads stop absorbing or develop odor after washing." },
              { title: "Store upright", detail: "Hang mops head-up on a wall rack or store in a mop holder. Never leave wet mops on the floor — this breeds bacteria." },
              { title: "Never mix chemicals", detail: "Dedicate mop heads to specific solutions. A mop used for stripping should never be used for finishing." },
            ].map((tip) => (
              <div key={tip.title} className="flex gap-3 bg-mjs-gray-50 rounded-lg p-4 border border-gray-100">
                <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-mjs-dark">{tip.title}</div>
                  <div className="text-xs text-mjs-gray-500 mt-0.5">{tip.detail}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Color coding */}
          <div>
            <h3 className="text-lg font-bold text-mjs-dark mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5 text-mjs-red" /> Color Coding System
            </h3>
            <p className="text-sm text-mjs-gray-500 mb-4">
              Color coding prevents cross-contamination between zones. Many healthcare and food service regulations require it.
            </p>
            <div className="space-y-3">
              {COLOR_CODE_GUIDE.map((c) => (
                <div key={c.color} className="flex items-center gap-3 bg-mjs-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className={`w-8 h-8 rounded-lg ${c.bgClass} shrink-0`} />
                  <div>
                    <div className="text-sm font-bold text-mjs-dark">{c.color}</div>
                    <div className="text-xs text-mjs-gray-500">{c.use}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
              <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-800 mb-0.5">Pro Tip</p>
                <p className="text-sm text-amber-700">
                  Label your mop handles and matching bucket with the same color tape. Train all staff on the system. Even two colors (red for restrooms, blue for everything else) dramatically reduces contamination risk.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Industry Recommendations ── */}
      <div id="by-industry" className="bg-mjs-dark">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
              The Right Mop for Your Industry
            </h2>
            <p className="text-mjs-gray-400 max-w-2xl mx-auto">
              Our recommendations based on what works across thousands of facilities.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {INDUSTRY_PICKS.map((r) => (
              <div key={r.industry} className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg ${r.bgColor} ${r.color} flex items-center justify-center`}>
                    {r.icon}
                  </div>
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

      {/* ── CTA ── */}
      <div id="shop-all" className="bg-gradient-to-r from-mjs-red to-mjs-red-dark">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
            Find Your Perfect Mop Setup
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Browse our full selection of mops, buckets, handles, and accessories. Wholesale pricing with free local delivery.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/category/equipment"
              className="inline-flex items-center gap-2 bg-white text-mjs-red font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Droplets className="w-4 h-4" />
              Shop All Equipment
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white font-bold px-6 py-3 rounded-lg hover:bg-white/20 transition-colors"
            >
              Need Help Choosing? Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
