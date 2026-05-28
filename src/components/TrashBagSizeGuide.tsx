"use client";

import { useState } from "react";
import {
  ChevronRight,
  Trash2,
  Ruler,
  ShieldCheck,
  Leaf,
  ArrowRight,
  Check,
  Info,
  Building2,
  UtensilsCrossed,
  Briefcase,
  Home,
  Warehouse,
  Stethoscope,
} from "lucide-react";
import Link from "next/link";

/* ─────────────────────────── Data ─────────────────────────── */

interface SizeEntry {
  gallon: string;
  dimensions: string;
  width: number;
  height: number;
  commonUse: string;
  canDescription: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  recommended: { label: string; sku: string; slug: string; type: string }[];
}

const SIZES: SizeEntry[] = [
  {
    gallon: "7-10",
    dimensions: '24" x 24"',
    width: 24,
    height: 24,
    commonUse: "Desk-side bins, bathroom wastebaskets",
    canDescription: "Small office / bathroom cans",
    icon: <Briefcase className="w-5 h-5" />,
    color: "text-sky-600",
    bgColor: "bg-sky-50",
    recommended: [
      { label: "Clear Hi-D 6 Mic", sku: "CL242406", slug: "janitors-finest-can-liners-clear-24-x-24-6-micron-7-10-gallon-1000-cs-cl242406", type: "Clear" },
      { label: "Black LD .45 Mil", sku: "LD2423045K", slug: "janitors-finest-can-liners-black-24-x-23-45-mil-7-10-gallon-500-cs-ld2423045k", type: "Black" },
    ],
  },
  {
    gallon: "12-16",
    dimensions: '24" x 33"',
    width: 24,
    height: 33,
    commonUse: "Tall kitchen cans, restroom receptacles",
    canDescription: "Kitchen / restroom tall cans",
    icon: <Home className="w-5 h-5" />,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    recommended: [
      { label: "Clear Hi-D 6 Mic", sku: "CL243306", slug: "janitors-finest-can-liners-clear-24-x-33-6-micron-12-16-gallon-1000-cs-cl243306", type: "Clear" },
      { label: "Clear Hi-D 8 Mic", sku: "CL243308", slug: "janitors-finest-can-liners-clear-24-x-33-8-micron-12-16-gallon-1000-cs-cl243308", type: "Clear" },
    ],
  },
  {
    gallon: "13",
    dimensions: '24" x 27"',
    width: 24,
    height: 27,
    commonUse: "Kitchen trash cans with drawstring",
    canDescription: "Standard kitchen can (drawstring)",
    icon: <UtensilsCrossed className="w-5 h-5" />,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    recommended: [
      { label: "White Drawstring 1.0 Mil", sku: "LD242710WD", slug: "janitors-finest-drawstring-can-liners-white-24-x-27-10-mil-13-gallon-250-bx-ld242710wd", type: "Drawstring" },
    ],
  },
  {
    gallon: "20-30",
    dimensions: '30" x 37"',
    width: 30,
    height: 37,
    commonUse: "Medium bins, break rooms, small lobbies",
    canDescription: "Medium / break room bins",
    icon: <UtensilsCrossed className="w-5 h-5" />,
    color: "text-violet-600",
    bgColor: "bg-violet-50",
    recommended: [
      { label: "Clear Hi-D 8 Mic", sku: "CL303708", slug: "janitors-finest-can-liners-clear-30-x-37-8-micron-20-30-gallon-500-cs-cl303708", type: "Clear" },
      { label: "Clear Hi-D 10 Mic", sku: "CL303710", slug: "janitors-finest-can-liners-clear-30-x-37-10-micron-20-30-gallon-500-cs-cl303710", type: "Clear" },
    ],
  },
  {
    gallon: "33",
    dimensions: '33" x 40"',
    width: 33,
    height: 40,
    commonUse: "Large office cans, lobby trash, medical facilities",
    canDescription: "Large office / lobby cans",
    icon: <Building2 className="w-5 h-5" />,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    recommended: [
      { label: "Clear Hi-D 16 Mic", sku: "CL334016", slug: "janitors-finest-can-liners-clear-33-x-40-16-micron-33-gallon-250-cs-cl334016", type: "Clear" },
    ],
  },
  {
    gallon: "40-45",
    dimensions: '40" x 48"',
    width: 40,
    height: 48,
    commonUse: "Large round cans, outdoor bins, cafeterias",
    canDescription: "Large round / outdoor bins",
    icon: <Warehouse className="w-5 h-5" />,
    color: "text-rose-600",
    bgColor: "bg-rose-50",
    recommended: [
      { label: "Clear Hi-D 12 Mic", sku: "CL404812", slug: "janitors-finest-can-liners-clear-40-x-48-12-micron-40-45-gallon-250-cs-cl404812", type: "Clear" },
      { label: "Clear Hi-D 14 Mic", sku: "CL404814", slug: "janitors-finest-can-liners-clear-40-x-48-14-micron-40-45-gallon-250-cs-cl404814", type: "Clear" },
      { label: "Clear Hi-D 16 Mic", sku: "CL404816", slug: "janitors-finest-can-liners-clear-40-x-48-16-micron-40-45-gallon-250-cs-cl404816", type: "Clear" },
    ],
  },
  {
    gallon: "56",
    dimensions: '43" x 48"',
    width: 43,
    height: 48,
    commonUse: "Glutton containers, large industrial bins",
    canDescription: "Glutton / industrial containers",
    icon: <Warehouse className="w-5 h-5" />,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    recommended: [
      { label: "Clear Hi-D 14 Mic", sku: "CL434814", slug: "janitors-finest-can-liners-clear-43-x-48-14-micron-56-gallon-200-cs-cl434814", type: "Clear" },
      { label: "Clear Hi-D 16 Mic", sku: "CL434816", slug: "janitors-finest-can-liners-clear-43-x-48-16-micron-56-gallon-200-cs-cl434816", type: "Clear" },
    ],
  },
  {
    gallon: "60",
    dimensions: '38" x 60"',
    width: 38,
    height: 60,
    commonUse: "Rollout carts, dumpster liners, large waste stations",
    canDescription: "Rollout carts / large waste stations",
    icon: <Warehouse className="w-5 h-5" />,
    color: "text-red-600",
    bgColor: "bg-red-50",
    recommended: [
      { label: "Clear Hi-D 14 Mic", sku: "CL386014", slug: "janitors-finest-can-liners-clear-38-x-60-14-micron-60-gallon-200-cs-cl386014", type: "Clear" },
      { label: "Clear Hi-D 17 Mic", sku: "CL386017", slug: "janitors-finest-can-liners-clear-38-x-60-17-micron-60-gallon-200-cs-cl386017", type: "Clear" },
    ],
  },
];

const THICKNESS_GUIDE = [
  {
    type: "High-Density (Microns)",
    description: "Thinner, crinkly feel. Great for paper, lightweight office waste. Tear-resistant but not puncture-proof.",
    best: "Offices, restrooms, break rooms",
    icon: <Briefcase className="w-5 h-5" />,
    range: "6-17 micron",
    levels: [
      { label: "6 mic", use: "Light paper, tissues" },
      { label: "8-10 mic", use: "General office waste" },
      { label: "12-14 mic", use: "Heavier mixed waste" },
      { label: "16-17 mic", use: "Heavy, sharp items" },
    ],
  },
  {
    type: "Low-Density (Mils)",
    description: "Thicker, stretchy feel. Resists punctures and tears. Ideal for heavy, wet, or sharp waste.",
    best: "Kitchens, restaurants, construction, medical",
    icon: <ShieldCheck className="w-5 h-5" />,
    range: "0.45-1.5 mil",
    levels: [
      { label: "0.45 mil", use: "Light kitchen waste" },
      { label: "0.80 mil", use: "General-purpose heavy duty" },
      { label: "1.0 mil", use: "Wet waste, food scraps" },
      { label: "1.5+ mil", use: "Construction, sharp debris" },
    ],
  },
];

const INDUSTRY_RECS = [
  { icon: <Building2 className="w-6 h-6" />, industry: "Office Buildings", sizes: "7-10 gal (desks), 33-45 gal (lobbies)", tip: "High-density clear liners work best for paper-heavy waste." },
  { icon: <UtensilsCrossed className="w-6 h-6" />, industry: "Restaurants & Kitchens", sizes: "13 gal (prep), 33-45 gal (kitchen)", tip: "Use low-density (mil) bags to handle wet food waste and prevent leaks." },
  { icon: <Stethoscope className="w-6 h-6" />, industry: "Healthcare & Medical", sizes: "7-10 gal (exam rooms), 33 gal (common)", tip: "Red or color-coded bags required for biohazard. Check local regulations." },
  { icon: <Home className="w-6 h-6" />, industry: "Schools & Facilities", sizes: "12-16 gal (classrooms), 40-45 gal (cafeteria)", tip: "Go with heavier micron for cafeteria waste. Consider compostable for food scraps." },
  { icon: <Warehouse className="w-6 h-6" />, industry: "Warehouses & Industrial", sizes: "56-60 gal (rollouts, large bins)", tip: "Low-density 1.0+ mil bags handle heavy, sharp debris without tearing." },
];

/* ─────────────────────────── Component ─────────────────────────── */

export default function TrashBagSizeGuide() {
  const [activeSize, setActiveSize] = useState<number>(5); // Default to 40-45 gal (popular)
  const [showAllProducts, setShowAllProducts] = useState(false);
  const selected = SIZES[activeSize];

  // Scale factor for visual can representation
  const maxVisualH = 180;
  const maxDataH = 60;

  return (
    <section className="bg-white min-h-screen">
      {/* ── Hero ── */}
      <div className="bg-gradient-to-br from-mjs-dark via-mjs-charcoal to-mjs-dark">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
          {/* Breadcrumbs */}
          <nav className="flex items-center justify-center gap-2 text-xs text-mjs-gray-400 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">Guides</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-mjs-red">Trash Bag Size Guide</span>
          </nav>

          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-mjs-red/10 border border-mjs-red/20 text-mjs-red px-3 py-1.5 rounded-full text-xs font-semibold mb-4 uppercase tracking-wider">
              <Ruler className="w-3.5 h-3.5" />
              Buying Guide
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
              Trash Bag Size Guide
            </h1>
            <p className="text-lg md:text-xl text-mjs-gray-300 leading-relaxed max-w-2xl mx-auto">
              Stop guessing. Find the exact trash liner that fits your can — by gallon size,
              dimensions, or industry. Visual chart included.
            </p>
          </div>
        </div>
      </div>

      {/* ── Quick Jump ── */}
      <div className="border-b border-gray-100 bg-mjs-gray-50 sticky top-0 z-20">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center justify-center gap-1 py-3 overflow-x-auto scrollbar-hide">
            <span className="text-xs font-semibold text-mjs-gray-400 mr-2 shrink-0 uppercase tracking-wider">Jump to:</span>
            {["Size Chart", "Thickness", "By Industry", "Shop All"].map((label) => (
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

      {/* ── Interactive Size Finder ── */}
      <div id="size-chart" className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-4xl font-extrabold text-mjs-dark mb-3">
            What Size Trash Bag Do I Need?
          </h2>
          <p className="text-mjs-gray-500 text-base md:text-lg max-w-2xl mx-auto">
            Select a can size below. We&apos;ll show you the exact bag dimensions,
            what it fits, and our top picks.
          </p>
        </div>

        {/* Size selector tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {SIZES.map((s, i) => (
            <button
              key={s.gallon}
              onClick={() => { setActiveSize(i); setShowAllProducts(false); }}
              className={`
                relative flex flex-col items-center px-4 py-3 rounded-xl text-center transition-all duration-200 border-2 min-w-[80px]
                ${activeSize === i
                  ? "border-mjs-red bg-white shadow-lg shadow-mjs-red/10 scale-105"
                  : "border-gray-200 bg-white hover:border-mjs-red/40 hover:shadow-md"
                }
              `}
            >
              <span className={`text-lg md:text-xl font-black ${activeSize === i ? "text-mjs-red" : "text-mjs-dark"}`}>
                {s.gallon}
              </span>
              <span className="text-[10px] md:text-xs text-mjs-gray-400 font-medium">gallon</span>
              {activeSize === i && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-mjs-red rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Selected size detail card */}
        <div className="bg-mjs-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
          <div className="grid md:grid-cols-[1fr_2fr] gap-0">
            {/* Visual Can Representation */}
            <div className="flex flex-col items-center justify-center p-8 md:p-10 bg-gradient-to-br from-gray-50 to-white border-b md:border-b-0 md:border-r border-gray-100">
              <div className="relative flex items-end justify-center gap-6">
                {/* Can visual */}
                <div className="flex flex-col items-center">
                  <div
                    className="relative rounded-lg border-2 border-gray-300 bg-gradient-to-b from-gray-100 to-gray-200 flex items-end justify-center transition-all duration-500"
                    style={{
                      width: `${Math.max(60, (selected.width / maxDataH) * 120)}px`,
                      height: `${Math.max(60, (selected.height / maxDataH) * maxVisualH)}px`,
                    }}
                  >
                    {/* Bag inside the can */}
                    <div className="absolute inset-1 rounded bg-gradient-to-b from-mjs-red/5 to-mjs-red/15 border border-dashed border-mjs-red/30" />
                    <Trash2 className="relative w-6 h-6 text-gray-400 mb-2" />
                  </div>
                  <span className="mt-3 text-xs font-bold text-mjs-gray-500">{selected.gallon} GAL</span>
                </div>

                {/* Dimension labels */}
                <div className="flex flex-col items-start gap-1 text-xs text-mjs-gray-400">
                  <div className="flex items-center gap-1">
                    <div className="w-8 h-px bg-mjs-gray-300" />
                    <span className="font-semibold">{selected.dimensions.split("x")[0].trim()}&quot;W</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-px h-8 bg-mjs-gray-300" />
                    <span className="font-semibold">{selected.dimensions.split("x")[1].trim()}&quot;H</span>
                  </div>
                </div>
              </div>

              <div className={`mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${selected.bgColor} ${selected.color}`}>
                {selected.icon}
                {selected.canDescription}
              </div>
            </div>

            {/* Size Details */}
            <div className="p-6 md:p-10">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-mjs-dark">
                    {selected.gallon} Gallon
                  </h3>
                  <p className="text-mjs-gray-500 mt-1">{selected.commonUse}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-mjs-gray-400 uppercase tracking-wider">Bag Size</div>
                  <div className="text-xl font-black text-mjs-dark">{selected.dimensions}</div>
                </div>
              </div>

              {/* Quick Specs */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-white rounded-lg p-3 border border-gray-100">
                  <div className="text-[10px] font-semibold text-mjs-gray-400 uppercase tracking-wider mb-1">Width</div>
                  <div className="text-lg font-bold text-mjs-dark">{selected.width}&quot;</div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-gray-100">
                  <div className="text-[10px] font-semibold text-mjs-gray-400 uppercase tracking-wider mb-1">Height</div>
                  <div className="text-lg font-bold text-mjs-dark">{selected.height}&quot;</div>
                </div>
              </div>

              {/* Recommended Products */}
              <div className="mb-2">
                <div className="text-xs font-semibold text-mjs-gray-400 uppercase tracking-wider mb-3">Our Top Picks</div>
                <div className="space-y-2">
                  {(showAllProducts ? selected.recommended : selected.recommended.slice(0, 2)).map((p) => (
                    <Link
                      key={p.sku}
                      href={`/product/${p.slug}`}
                      className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-100 hover:border-mjs-red/30 hover:shadow-sm transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                          ${p.type === "Clear" ? "bg-sky-50 text-sky-600" : p.type === "Black" ? "bg-gray-100 text-gray-600" : p.type === "Drawstring" ? "bg-amber-50 text-amber-600" : "bg-green-50 text-green-600"}
                        `}>
                          {p.type[0]}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-mjs-dark group-hover:text-mjs-red transition-colors">{p.label}</div>
                          <div className="text-xs text-mjs-gray-400">SKU: {p.sku}</div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-mjs-gray-300 group-hover:text-mjs-red transition-colors" />
                    </Link>
                  ))}
                </div>
                {selected.recommended.length > 2 && !showAllProducts && (
                  <button
                    onClick={() => setShowAllProducts(true)}
                    className="mt-2 text-xs font-semibold text-mjs-red hover:underline"
                  >
                    +{selected.recommended.length - 2} more options
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Full Reference Table ── */}
      <div className="bg-mjs-gray-50 border-y border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
          <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-2 text-center">
            Complete Size Reference
          </h2>
          <p className="text-mjs-gray-500 text-center mb-8 max-w-xl mx-auto">
            Every standard trash bag size at a glance. Bookmark this chart.
          </p>

          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mjs-dark text-white">
                  <th className="text-left px-4 py-3 font-semibold">Gallon Size</th>
                  <th className="text-left px-4 py-3 font-semibold">Bag Dimensions</th>
                  <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">Common Use</th>
                  <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Can Type</th>
                  <th className="text-center px-4 py-3 font-semibold">Shop</th>
                </tr>
              </thead>
              <tbody>
                {SIZES.map((s, i) => (
                  <tr
                    key={s.gallon}
                    className={`border-t border-gray-100 transition-colors ${
                      i === activeSize ? "bg-mjs-red/5" : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-3">
                      <button
                        onClick={() => { setActiveSize(i); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                        className="font-bold text-mjs-dark hover:text-mjs-red transition-colors"
                      >
                        {s.gallon} gal
                      </button>
                    </td>
                    <td className="px-4 py-3 font-mono text-mjs-gray-600">{s.dimensions}</td>
                    <td className="px-4 py-3 text-mjs-gray-500 hidden sm:table-cell">{s.commonUse}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${s.bgColor} ${s.color}`}>
                        {s.icon}
                        {s.canDescription}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Link
                        href={`/product/${s.recommended[0].slug}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-mjs-red hover:underline"
                      >
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

      {/* ── Thickness Guide ── */}
      <div id="thickness" className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-3">
            Thickness Matters: Microns vs. Mils
          </h2>
          <p className="text-mjs-gray-500 max-w-2xl mx-auto">
            Size is only half the equation. The right thickness prevents tears,
            leaks, and frustration. Here&apos;s how to choose.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {THICKNESS_GUIDE.map((t) => (
            <div key={t.type} className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-mjs-red/10 text-mjs-red flex items-center justify-center">
                  {t.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-mjs-dark">{t.type}</h3>
                  <span className="text-xs font-semibold text-mjs-red">{t.range}</span>
                </div>
              </div>
              <p className="text-sm text-mjs-gray-500 mb-4">{t.description}</p>
              <div className="text-xs font-semibold text-mjs-gray-400 uppercase tracking-wider mb-2">Best for: {t.best}</div>

              {/* Thickness levels */}
              <div className="space-y-2 mt-4">
                {t.levels.map((l, i) => (
                  <div key={l.label} className="flex items-center gap-3">
                    <div className="flex gap-0.5">
                      {[...Array(i + 1)].map((_, j) => (
                        <div key={j} className="w-1.5 h-4 rounded-full bg-mjs-red/70" />
                      ))}
                      {[...Array(3 - i)].map((_, j) => (
                        <div key={j} className="w-1.5 h-4 rounded-full bg-gray-200" />
                      ))}
                    </div>
                    <div className="flex-1 flex items-center justify-between bg-mjs-gray-50 rounded-lg px-3 py-2">
                      <span className="text-sm font-bold text-mjs-dark">{l.label}</span>
                      <span className="text-xs text-mjs-gray-500">{l.use}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Pro Tip */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-5 flex gap-4">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-800 mb-1">Pro Tip: When in Doubt, Go One Thickness Up</p>
            <p className="text-sm text-amber-700">
              A torn bag costs more than a slightly thicker liner. If your waste includes
              anything sharp, wet, or heavy, step up one thickness level. The extra pennies
              per bag save you from double-bagging and messy cleanups.
            </p>
          </div>
        </div>
      </div>

      {/* ── Industry Recommendations ── */}
      <div id="by-industry" className="bg-mjs-dark">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
              Recommendations by Industry
            </h2>
            <p className="text-mjs-gray-400 max-w-2xl mx-auto">
              Different spaces need different bags. Here&apos;s what works best for your type of facility.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {INDUSTRY_RECS.map((r) => (
              <div key={r.industry} className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-mjs-red/20 text-mjs-red flex items-center justify-center">
                    {r.icon}
                  </div>
                  <h3 className="text-base font-bold text-white">{r.industry}</h3>
                </div>
                <div className="text-sm text-mjs-gray-300 mb-3">
                  <span className="font-semibold text-mjs-gold">Sizes:</span> {r.sizes}
                </div>
                <div className="flex gap-2 text-xs text-mjs-gray-400">
                  <Check className="w-3.5 h-3.5 text-mjs-green shrink-0 mt-0.5" />
                  <span>{r.tip}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Eco-Friendly Section ── */}
      <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-16">
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-200 p-6 md:p-10 flex flex-col md:flex-row items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <Leaf className="w-7 h-7" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-bold text-emerald-900 mb-2">Going Green? We Carry Compostable Liners</h3>
            <p className="text-sm text-emerald-700 max-w-xl">
              Our SunnyCare compostable liners are available in 24x33, 33x40, and 40x48 sizes.
              Made from plant-based materials, they break down in commercial composting facilities.
              Perfect for cafeterias, schools, and eco-conscious businesses.
            </p>
          </div>
          <Link
            href="/category/trash-liners"
            className="shrink-0 inline-flex items-center gap-2 bg-emerald-600 text-white font-bold px-5 py-3 rounded-lg hover:bg-emerald-700 transition-colors text-sm"
          >
            Shop Compostable
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* ── CTA ── */}
      <div id="shop-all" className="bg-gradient-to-r from-mjs-red to-mjs-red-dark">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
            Ready to Order the Right Size?
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Browse our full selection of trash liners — clear, black, drawstring, and compostable.
            Wholesale pricing with free local delivery.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/category/trash-liners"
              className="inline-flex items-center gap-2 bg-white text-mjs-red font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Shop All Trash Liners
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white font-bold px-6 py-3 rounded-lg hover:bg-white/20 transition-colors"
            >
              Need Help? Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
