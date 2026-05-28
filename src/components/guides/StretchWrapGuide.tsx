"use client";

import { useState } from "react";
import {
  ChevronRight,
  ArrowRight,
  Check,
  X,
  Info,
  Package,
  Layers,
  Warehouse,
  ShoppingBag,
  UtensilsCrossed,
  Factory,
  Ruler,
  Eye,
  EyeOff,
  Shield,
  Tag,
} from "lucide-react";
import Link from "next/link";

/* ─────────────────────────── Data ─────────────────────────── */

type WrapType = "hand" | "machine" | "bundling";

interface WrapCategory {
  id: WrapType;
  name: string;
  tagline: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  pros: string[];
  cons: string[];
  bestFor: string[];
  widths: string;
  gauge: string;
  rollLength: string;
  products: { label: string; sku: string; slug: string }[];
}

const WRAP_TYPES: WrapCategory[] = [
  {
    id: "hand",
    name: "Hand Wrap",
    tagline: "Most versatile, manual application",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    description:
      "Applied manually using a hand dispenser. The most common stretch film for warehouses, shipping docks, and general pallet wrapping. Ideal when you have fewer than 15-20 pallets per day.",
    pros: [
      "No equipment investment needed",
      "Portable — wrap anywhere in the facility",
      "Quick setup for small or irregular loads",
      "Easy to train new operators",
      "Multiple gauge options for different loads",
    ],
    cons: [
      "Slower than machine wrap for high volume",
      "Inconsistent tension can waste film",
      "More physically demanding for operators",
      "Higher per-pallet film cost at scale",
    ],
    bestFor: ["Small warehouses", "Shipping docks", "Retail back rooms", "Irregular loads"],
    widths: '16"-20"',
    gauge: "47-80 ga",
    rollLength: "1,500 ft",
    products: [
      { label: "Clear 18\" x 55ga (4 rolls)", sku: "FLM140180", slug: "stretch-film-clear-18-x-63-ga-x-1500-4-rolls-per-carton" },
      { label: "Clear 16\" x 47ga (4 rolls)", sku: "FLM140160", slug: "stretch-film-clear-16-x-47-ga-x-1500-4-rolls-per-carton" },
      { label: "80ga 18\" Hand Wrap (4/ct)", sku: "FLM8018", slug: "stretch-wrap-film-18-x-1500-x-80-gauge-clear-for-hand-dispenser-4-carton" },
      { label: "Black 80ga 18\" (4/ct)", sku: "FLM8018BLK", slug: "black-stretch-wrap-18-x-1500-80-gauge-4-carton" },
      { label: "Blue 80ga 18\" (4/ct)", sku: "FLM8018BLU", slug: "blue-color-hand-wrap-stretch-film-18-in-x-1500-ft-80-gauge-4-rolls-case" },
    ],
  },
  {
    id: "machine",
    name: "Machine Wrap",
    tagline: "High volume, consistent results",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    description:
      "Designed for automatic or semi-automatic stretch wrap machines. Wider rolls with longer footage provide consistent tension, faster throughput, and less film waste per pallet.",
    pros: [
      "Wraps pallets 3-5x faster than hand wrap",
      "Consistent tension = better load containment",
      "Lower film cost per pallet at scale",
      "Reduces operator fatigue and injury risk",
      "Programmable wrap patterns for different loads",
    ],
    cons: [
      "Requires stretch wrap machine investment",
      "Fixed location — not portable",
      "Overkill for fewer than 15 pallets/day",
      "Machine maintenance required",
    ],
    bestFor: ["High-volume distribution", "Manufacturing plants", "3PL warehouses", "Assembly lines"],
    widths: '20"',
    gauge: "63-80 ga",
    rollLength: "5,000 ft",
    products: [
      { label: "Machine 20\" x 63ga (5,000 ft)", sku: "FLM2063M", slug: "20-machine-stretch-film-x-5000-63-gauge" },
      { label: "Machine 20\" x 80ga (5,000 ft)", sku: "FLM80205M", slug: "machine-grade-stretch-film-20-x-80-gauge-5000" },
    ],
  },
  {
    id: "bundling",
    name: "Bundling Film",
    tagline: "Small items, tight bundles",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    description:
      "Narrow-width stretch film (3-5 inches) for bundling small items together without a box. Perfect for grouping products, securing parts, or unitizing items for storage or shipping.",
    pros: [
      "Eliminates boxes for small groupings",
      "Fast to apply by hand — no dispenser needed",
      "Excellent for irregular-shaped items",
      "Clear visibility of bundled contents",
      "Very cost-effective for small item grouping",
    ],
    cons: [
      "Not designed for full pallet wrapping",
      "Limited load containment for heavy items",
      "Shorter roll length than standard wrap",
    ],
    bestFor: ["Parts bundling", "E-commerce prep", "Retail grouping", "Pipe & lumber"],
    widths: '3"-5"',
    gauge: "80 ga",
    rollLength: "1,000 ft",
    products: [
      { label: "3\" x 1,000 ft Bundling (18 rolls)", sku: "FLM803", slug: "3-x-1000-stretch-film-80-gu-18-rolls-per-case-1000-per-roll" },
      { label: "5\" x 1,000 ft Bundling (12 rolls)", sku: "FLM805", slug: "5-x-1000-stretch-film-80-gu-12-rolls-per-case-1000-per-roll" },
    ],
  },
];

interface GaugeInfo {
  gauge: string;
  microns: string;
  strength: string;
  description: string;
  useCases: string[];
  level: number;
}

const GAUGE_CHART: GaugeInfo[] = [
  {
    gauge: "47 ga",
    microns: "12 micron",
    strength: "Economy",
    description: "Thinnest option. Best for lightweight loads and cost-conscious operations.",
    useCases: ["Lightweight pallets under 1,200 lbs", "Unitizing cartons of similar size", "Indoor storage where loads don't move"],
    level: 1,
  },
  {
    gauge: "55 ga",
    microns: "14 micron",
    strength: "Standard",
    description: "A balanced option for general warehouse use. Good stretch with moderate puncture resistance.",
    useCases: ["Standard pallets 1,200-2,000 lbs", "Mixed-case loads", "General shipping and storage"],
    level: 2,
  },
  {
    gauge: "63 ga",
    microns: "16 micron",
    strength: "Performance",
    description: "Higher stretch and puncture resistance. Ideal for irregular loads and machine application.",
    useCases: ["Heavy pallets 2,000-2,500 lbs", "Irregular or protruding loads", "Machine wrap applications"],
    level: 3,
  },
  {
    gauge: "80 ga",
    microns: "20 micron",
    strength: "Premium",
    description: "Maximum strength and puncture resistance. The go-to for heavy, sharp, or demanding loads.",
    useCases: ["Heavy pallets over 2,500 lbs", "Sharp edges (hardware, metal parts)", "Outdoor storage or long transport", "Loads requiring maximum containment"],
    level: 4,
  },
];

interface FilmColor {
  name: string;
  hex: string;
  bgClass: string;
  textClass: string;
  dotClass: string;
  purpose: string;
  detail: string;
}

const FILM_COLORS: FilmColor[] = [
  { name: "Clear", hex: "#e5e7eb", bgClass: "bg-gray-100", textClass: "text-gray-800", dotClass: "bg-gray-300", purpose: "Standard / Inspection", detail: "See-through for barcode scanning and visual inspection. Most common choice." },
  { name: "Black", hex: "#1a1a1a", bgClass: "bg-gray-900", textClass: "text-white", dotClass: "bg-gray-900", purpose: "Concealment / Theft prevention", detail: "Hides contents from view. Reduces pilferage in transit and storage." },
  { name: "Blue", hex: "#3b82f6", bgClass: "bg-blue-500", textClass: "text-white", dotClass: "bg-blue-500", purpose: "Color coding / Identification", detail: "Identifies specific product lines, shifts, or destinations at a glance." },
  { name: "Green", hex: "#22c55e", bgClass: "bg-green-500", textClass: "text-white", dotClass: "bg-green-500", purpose: "QC Passed / Approved", detail: "Common in manufacturing to indicate lots that passed quality control." },
  { name: "Red", hex: "#ef4444", bgClass: "bg-red-500", textClass: "text-white", dotClass: "bg-red-500", purpose: "Rejected / Hold", detail: "Flags pallets on hold, rejected lots, or hazardous materials." },
  { name: "Orange", hex: "#f97316", bgClass: "bg-orange-500", textClass: "text-white", dotClass: "bg-orange-500", purpose: "Priority / Rush", detail: "Marks priority shipments or expedited orders for faster identification." },
  { name: "Yellow", hex: "#eab308", bgClass: "bg-yellow-400", textClass: "text-gray-900", dotClass: "bg-yellow-400", purpose: "Caution / Special handling", detail: "Indicates fragile items, temperature-sensitive goods, or special handling." },
  { name: "White", hex: "#f5f5f5", bgClass: "bg-gray-50 border border-gray-200", textClass: "text-gray-800", dotClass: "bg-white border border-gray-300", purpose: "Opaque / UV protection", detail: "Blocks UV rays. Protects light-sensitive products in outdoor storage." },
];

const WIDTH_GUIDE = [
  { width: '3"', type: "Bundling", application: "Small parts, bundling pipes/tubes, retail grouping", pallet: "No", sku: "FLM803", slug: "3-x-1000-stretch-film-80-gu-18-rolls-per-case-1000-per-roll" },
  { width: '5"', type: "Bundling", application: "Larger bundles, securing items to pallets, top wrap", pallet: "No", sku: "FLM805", slug: "5-x-1000-stretch-film-80-gu-12-rolls-per-case-1000-per-roll" },
  { width: '16"', type: "Hand", application: "Smaller pallets, lighter loads, tighter spaces", pallet: "Yes", sku: "FLM140160", slug: "stretch-film-clear-16-x-47-ga-x-1500-4-rolls-per-carton" },
  { width: '18"', type: "Hand", application: "Most common hand wrap. Standard pallets, general shipping", pallet: "Yes", sku: "FLM8018", slug: "stretch-wrap-film-18-x-1500-x-80-gauge-clear-for-hand-dispenser-4-carton" },
  { width: '20"', type: "Machine", application: "Machine wrap for full-size pallets. Maximum coverage", pallet: "Yes", sku: "FLM2063M", slug: "20-machine-stretch-film-x-5000-63-gauge" },
];

const INDUSTRY_PICKS = [
  {
    icon: <Warehouse className="w-6 h-6" />,
    industry: "Warehouse & Distribution",
    pick: "80ga Hand or Machine 20\"",
    why: "High-volume environments need reliable containment. Machine wrap pays for itself above 15 pallets/day. 80ga handles heavy, mixed loads.",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: <ShoppingBag className="w-6 h-6" />,
    industry: "E-Commerce & Fulfillment",
    pick: "3-5\" Bundling + 47ga Hand",
    why: "Bundling film groups multi-item orders without boxes. Lightweight 47ga hand wrap for pallet unitizing keeps costs low.",
    color: "text-violet-600",
    bgColor: "bg-violet-50",
  },
  {
    icon: <UtensilsCrossed className="w-6 h-6" />,
    industry: "Food & Beverage",
    pick: "80ga Clear Hand Wrap",
    why: "FDA-compliant clear film allows product inspection and barcode scanning. Heavy gauge handles beverage pallets safely.",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    icon: <Factory className="w-6 h-6" />,
    industry: "Manufacturing",
    pick: "Colored Film + 63-80ga Machine",
    why: "Color-coded wrap for QC status (green=pass, red=hold). Machine wrap keeps production lines moving with consistent results.",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
];

/* ─────────────────────────── Helpers ─────────────────────────── */

function StrengthBar({ level, max = 4 }: { level: number; max?: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(max)].map((_, i) => (
        <div
          key={i}
          className={`h-2 flex-1 rounded-full ${i < level ? "bg-blue-500" : "bg-gray-200"}`}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────── Component ─────────────────────────── */

export default function StretchWrapGuide() {
  const [activeTab, setActiveTab] = useState<WrapType>("hand");
  const activeWrap = WRAP_TYPES.find((w) => w.id === activeTab)!;

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
            <span className="text-mjs-red">Stretch Wrap Guide</span>
          </nav>

          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-mjs-red/10 border border-mjs-red/20 text-mjs-red px-3 py-1.5 rounded-full text-xs font-semibold mb-4 uppercase tracking-wider">
              <Package className="w-3.5 h-3.5" />
              Buying Guide
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
              Stretch Wrap &<br />Packaging Film Guide
            </h1>
            <p className="text-lg md:text-xl text-mjs-gray-300 leading-relaxed max-w-2xl mx-auto">
              Gauge, width, color, hand vs machine — everything you need to choose the right stretch film for your operation.
            </p>
          </div>
        </div>
      </div>

      {/* ── Quick Jump ── */}
      <div className="border-b border-gray-100 bg-mjs-gray-50 sticky top-0 z-20">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center justify-center gap-1 py-3 overflow-x-auto scrollbar-hide">
            <span className="text-xs font-semibold text-mjs-gray-400 mr-2 shrink-0 uppercase tracking-wider">Jump to:</span>
            {["Compare", "Gauge Chart", "Color Guide", "Width Selection", "By Industry", "Shop All"].map((label) => (
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

      {/* ── Wrap Type Comparison ── */}
      <div id="compare" className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-4xl font-extrabold text-mjs-dark mb-3">
            Hand Wrap vs Machine Wrap vs Bundling Film
          </h2>
          <p className="text-mjs-gray-500 text-base md:text-lg max-w-2xl mx-auto">
            Three types of stretch film, each built for different volume levels and applications.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-3 mb-10">
          {WRAP_TYPES.map((w) => (
            <button
              key={w.id}
              onClick={() => setActiveTab(w.id)}
              className={`
                relative flex flex-col items-center px-5 md:px-8 py-4 rounded-xl transition-all duration-200 border-2 min-w-[100px]
                ${activeTab === w.id
                  ? `${w.borderColor} bg-white shadow-lg scale-105`
                  : "border-gray-200 bg-white hover:shadow-md"
                }
              `}
            >
              <div className={`w-8 h-8 rounded-full mb-2 ${activeTab === w.id ? w.bgColor : "bg-gray-100"}`}>
                <div className={`w-full h-full rounded-full flex items-center justify-center text-xs font-black ${activeTab === w.id ? w.color : "text-gray-400"}`}>
                  {w.name[0]}
                </div>
              </div>
              <span className={`text-sm md:text-base font-bold ${activeTab === w.id ? w.color : "text-mjs-dark"}`}>
                {w.name}
              </span>
              <span className="text-[10px] text-mjs-gray-400 mt-0.5">{w.tagline}</span>
              {activeTab === w.id && (
                <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full ${w.bgColor} border ${w.borderColor}`} />
              )}
            </button>
          ))}
        </div>

        {/* Active wrap detail */}
        <div className={`rounded-2xl border ${activeWrap.borderColor} overflow-hidden`}>
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-0">
            {/* Left */}
            <div className={`${activeWrap.bgColor} p-6 md:p-10 border-b lg:border-b-0 lg:border-r ${activeWrap.borderColor}`}>
              <h3 className={`text-2xl md:text-3xl font-black ${activeWrap.color} mb-2`}>
                {activeWrap.name}
              </h3>
              <p className="text-sm text-mjs-gray-600 mb-6 leading-relaxed">{activeWrap.description}</p>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/70 rounded-lg p-3 text-center">
                  <div className="text-[10px] font-semibold text-mjs-gray-400 uppercase">Widths</div>
                  <div className="text-sm font-bold text-mjs-dark">{activeWrap.widths}</div>
                </div>
                <div className="bg-white/70 rounded-lg p-3 text-center">
                  <div className="text-[10px] font-semibold text-mjs-gray-400 uppercase">Gauge</div>
                  <div className="text-sm font-bold text-mjs-dark">{activeWrap.gauge}</div>
                </div>
                <div className="bg-white/70 rounded-lg p-3 text-center col-span-2">
                  <div className="text-[10px] font-semibold text-mjs-gray-400 uppercase">Roll Length</div>
                  <div className="text-sm font-bold text-mjs-dark">{activeWrap.rollLength}</div>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="p-6 md:p-10 bg-white">
              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div>
                  <h4 className="text-xs font-semibold text-mjs-gray-400 uppercase tracking-wider mb-3">Advantages</h4>
                  <ul className="space-y-2">
                    {activeWrap.pros.map((p) => (
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
                    {activeWrap.cons.map((c) => (
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
                  {activeWrap.bestFor.map((b) => (
                    <span key={b} className={`px-3 py-1.5 rounded-full text-xs font-semibold ${activeWrap.bgColor} ${activeWrap.color}`}>
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-mjs-gray-400 uppercase tracking-wider mb-3">Shop {activeWrap.name}</h4>
                <div className="space-y-2">
                  {activeWrap.products.map((p) => (
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

      {/* ── Gauge Thickness Chart ── */}
      <div id="gauge-chart" className="bg-mjs-gray-50 border-y border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-3">
              Gauge Thickness Guide
            </h2>
            <p className="text-mjs-gray-500 max-w-2xl mx-auto">
              Gauge measures film thickness. Higher gauge = thicker film = more puncture resistance and load holding force.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {GAUGE_CHART.map((g) => (
              <div key={g.gauge} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500 text-white flex items-center justify-center">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-lg font-black text-mjs-dark">{g.gauge}</div>
                    <div className="text-[10px] font-semibold text-mjs-gray-400 uppercase">{g.strength} &middot; {g.microns}</div>
                  </div>
                </div>
                <StrengthBar level={g.level} />
                <p className="text-xs text-mjs-gray-500 mt-3 mb-3">{g.description}</p>
                <ul className="space-y-1">
                  {g.useCases.map((u) => (
                    <li key={u} className="flex gap-2 text-xs text-mjs-gray-600">
                      <Check className="w-3 h-3 text-green-500 shrink-0 mt-0.5" />
                      {u}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 max-w-3xl mx-auto">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-800 mb-0.5">Pro Tip</p>
              <p className="text-sm text-amber-700">
                &ldquo;True gauge&rdquo; and &ldquo;equivalent gauge&rdquo; are not the same. True gauge is the actual thickness; equivalent gauge means the film is pre-stretched and performs like a thicker film. Always compare true gauge to true gauge.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Color-Coded Film Guide ── */}
      <div id="color-guide" className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-3">
            Color-Coded Film Guide
          </h2>
          <p className="text-mjs-gray-500 max-w-2xl mx-auto">
            Colored stretch wrap is not just cosmetic — each color serves a specific purpose in logistics, QC, and security.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FILM_COLORS.map((c) => (
            <div key={c.name} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg ${c.bgClass} ${c.textClass} flex items-center justify-center`}>
                  {c.name === "Clear" ? <Eye className="w-5 h-5" /> : c.name === "Black" ? <EyeOff className="w-5 h-5" /> : <Tag className="w-5 h-5" />}
                </div>
                <div>
                  <div className="text-base font-bold text-mjs-dark">{c.name}</div>
                  <div className="text-[10px] font-semibold text-mjs-gray-400 uppercase">{c.purpose}</div>
                </div>
              </div>
              <p className="text-xs text-mjs-gray-500 leading-relaxed">{c.detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 max-w-3xl mx-auto">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-800 mb-0.5">Pro Tip</p>
            <p className="text-sm text-amber-700">
              Use at least two colors in your facility: clear for standard pallets and one color for &ldquo;hold&rdquo; or &ldquo;special handling.&rdquo; This simple system prevents shipping errors and speeds up warehouse operations.
            </p>
          </div>
        </div>
      </div>

      {/* ── Width Selection ── */}
      <div id="width-selection" className="bg-mjs-gray-50 border-y border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-3">
              Width Selection
            </h2>
            <p className="text-mjs-gray-500 max-w-2xl mx-auto">
              Wider film means fewer wraps and faster application. Narrower film offers precision for small items.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mjs-dark text-white">
                  <th className="text-left px-4 py-3 font-semibold">Width</th>
                  <th className="text-left px-4 py-3 font-semibold">Type</th>
                  <th className="text-left px-4 py-3 font-semibold">Application</th>
                  <th className="text-center px-4 py-3 font-semibold">Pallet Wrap?</th>
                  <th className="text-right px-4 py-3 font-semibold">Shop</th>
                </tr>
              </thead>
              <tbody>
                {WIDTH_GUIDE.map((w) => (
                  <tr key={w.width} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-bold text-mjs-dark text-base">{w.width}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        w.type === "Bundling" ? "bg-amber-50 text-amber-700" : w.type === "Hand" ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-700"
                      }`}>
                        {w.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-mjs-gray-600">{w.application}</td>
                    <td className="px-4 py-3 text-center">
                      {w.pallet === "Yes" ? <Check className="w-4 h-4 text-green-500 mx-auto" /> : <X className="w-4 h-4 text-red-400 mx-auto" />}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/product/${w.slug}`} className="inline-flex items-center gap-1 text-mjs-red font-semibold text-xs hover:underline">
                        View <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Industry Recommendations ── */}
      <div id="by-industry" className="bg-mjs-dark">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
              Recommended by Industry
            </h2>
            <p className="text-mjs-gray-400 max-w-2xl mx-auto">
              Our top stretch wrap picks based on what works across thousands of facilities.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
            Find Your Perfect Stretch Wrap
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Browse our full selection of stretch film — hand wrap, machine wrap, bundling film, and colored options. Wholesale pricing with free local delivery.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/category/packaging-film"
              className="inline-flex items-center gap-2 bg-white text-mjs-red font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Package className="w-4 h-4" />
              Shop All Packaging Film
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white font-bold px-6 py-3 rounded-lg hover:bg-white/20 transition-colors"
            >
              Need a Quote? Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
