"use client";

import { useState } from "react";
import {
  ChevronRight,
  ArrowRight,
  Check,
  X,
  Info,
  Shield,
  Hand,
  Droplets,
  Flame,
  Building2,
  UtensilsCrossed,
  Stethoscope,
  Paintbrush,
  Car,
  Factory,
  Ruler,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

/* ─────────────────────────── Data ─────────────────────────── */

type GloveType = "nitrile" | "vinyl" | "latex";

interface GloveMaterial {
  id: GloveType;
  name: string;
  tagline: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  pros: string[];
  cons: string[];
  bestFor: string[];
  thickness: string;
  punctureResistance: number; // 1-5
  chemicalResistance: number;
  tactileSensitivity: number;
  comfort: number;
  costPerGlove: string;
  allergenFree: boolean;
  foodSafe: boolean;
  products: { label: string; sku: string; slug: string; sizes: string }[];
}

const MATERIALS: GloveMaterial[] = [
  {
    id: "nitrile",
    name: "Nitrile",
    tagline: "The all-around champion",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    description:
      "Synthetic rubber that offers excellent chemical and puncture resistance. The most popular choice across industries — it does everything well.",
    pros: [
      "Latex-free — no allergy risk",
      "Excellent chemical resistance",
      "Strong puncture protection",
      "Conforms to hand over time",
      "Available in multiple thicknesses (5-8 mil)",
    ],
    cons: [
      "Higher cost than vinyl",
      "Less elastic than latex",
      "Can feel stiff until broken in",
    ],
    bestFor: ["Medical & exam", "Chemical handling", "Auto detailing", "Janitorial", "Tattoo & salon"],
    thickness: "5-8 MIL",
    punctureResistance: 5,
    chemicalResistance: 5,
    tactileSensitivity: 4,
    comfort: 4,
    costPerGlove: "$0.06-0.20",
    allergenFree: true,
    foodSafe: true,
    products: [
      { label: "Blue Nitrile 5 mil", sku: "6303EA", slug: "life-guard-blue-nitrile-exam-gloves-powder-free-medium-5-mil-100-bx", sizes: "S-XL" },
      { label: "Black Nitrile 5 mil", sku: "6343EA", slug: "life-guard-black-nitrile-exam-gloves-powder-free-medium-5-mil-100-bx", sizes: "S-XL" },
      { label: "Orange Diamond 8 mil", sku: "8303EA", slug: "sunnycare-orange-diamond-textured-nitrile-gloves-8-mil-100-per-box-large", sizes: "M-XL" },
      { label: "Black Diamond 8 mil", sku: "8403EA", slug: "sunnycare-black-diamond-textured-nitrile-gloves-8-mil-100-per-box-large", sizes: "M-XL" },
    ],
  },
  {
    id: "vinyl",
    name: "Vinyl",
    tagline: "The budget-friendly option",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    description:
      "Made from PVC (polyvinyl chloride). A cost-effective, latex-free option for low-risk tasks where frequent glove changes are needed.",
    pros: [
      "Most affordable option",
      "Latex-free — no allergy risk",
      "Easy to put on and take off",
      "Good for short-duration tasks",
    ],
    cons: [
      "Weakest puncture resistance",
      "Less chemical protection",
      "Looser fit — less dexterity",
      "Not ideal for extended wear",
    ],
    bestFor: ["Food prep & handling", "Light janitorial", "Beauty & salon", "Short-duration tasks"],
    thickness: "Standard",
    punctureResistance: 2,
    chemicalResistance: 2,
    tactileSensitivity: 3,
    comfort: 3,
    costPerGlove: "$0.04-0.06",
    allergenFree: true,
    foodSafe: true,
    products: [
      { label: "Vinyl PF General Purpose", sku: "VCPF-48MEA", slug: "diamond-if48-vinyl-powder-free-exam-grade-gloves-100-bx-size-medium", sizes: "S-XL" },
    ],
  },
  {
    id: "latex",
    name: "Latex",
    tagline: "The natural fit",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    description:
      "Made from natural rubber. Offers the best elasticity and tactile sensitivity of any disposable glove. The original medical exam glove.",
    pros: [
      "Superior comfort and fit",
      "Excellent tactile sensitivity",
      "High elasticity — stretches without tearing",
      "Biodegradable material",
    ],
    cons: [
      "Latex allergy risk (6-12% of healthcare workers)",
      "Weaker chemical resistance vs. nitrile",
      "Being phased out of many facilities",
    ],
    bestFor: ["Medical exams", "Lab work", "Detailed assembly", "When fit matters most"],
    thickness: "Standard-14 MIL",
    punctureResistance: 4,
    chemicalResistance: 3,
    tactileSensitivity: 5,
    comfort: 5,
    costPerGlove: "$0.07-3.58",
    allergenFree: false,
    foodSafe: true,
    products: [
      { label: "Latex PF Industrial Grade", sku: "LPF-56MEA", slug: "diamond-if56-latex-powder-free-industrial-grade-gloves-100-bx-size-medium", sizes: "S-XL" },
      { label: "High Risk 14 mil Exam", sku: "1243", slug: "lifeguard-1243-high-risk-14-mil-exam-disposable-gloves-powder-free-latex-blue-size-medium-50-bx-10-carton", sizes: "M" },
    ],
  },
];

const SIZE_CHART = [
  { size: "Small", palmWidth: '3-3.5"', palmLength: '6.5-7"', typical: "Smaller hands" },
  { size: "Medium", palmWidth: '3.5-4"', palmLength: '7-7.5"', typical: "Most common" },
  { size: "Large", palmWidth: '4-4.5"', palmLength: '7.5-8"', typical: "Average-large hands" },
  { size: "X-Large", palmWidth: '4.5-5"', palmLength: '8-8.5"', typical: "Large hands" },
];

const INDUSTRY_PICKS = [
  {
    icon: <Stethoscope className="w-6 h-6" />,
    industry: "Healthcare & Medical",
    pick: "Nitrile (5 mil)",
    why: "Latex-free policy compliance, chemical and bloodborne pathogen protection. Blue color for visibility.",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: <UtensilsCrossed className="w-6 h-6" />,
    industry: "Food Service",
    pick: "Vinyl or Nitrile",
    why: "Vinyl for prep and serving (budget-friendly with frequent changes). Nitrile for handling raw proteins or allergens.",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  {
    icon: <Building2 className="w-6 h-6" />,
    industry: "Janitorial & Cleaning",
    pick: "Nitrile (5 mil)",
    why: "Chemical resistance for cleaning solutions, puncture protection against sharp debris in trash.",
    color: "text-violet-600",
    bgColor: "bg-violet-50",
  },
  {
    icon: <Car className="w-6 h-6" />,
    industry: "Auto & Detailing",
    pick: "Nitrile (8 mil Diamond)",
    why: "Heavy-duty grip for oily parts. Diamond texture prevents slipping. Chemical resistance for solvents and degreasers.",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    icon: <Paintbrush className="w-6 h-6" />,
    industry: "Salon & Beauty",
    pick: "Nitrile (Black 5 mil)",
    why: "Black hides hair dye stains. Latex-free for client safety. Good chemical resistance for color treatments.",
    color: "text-gray-700",
    bgColor: "bg-gray-100",
  },
  {
    icon: <Factory className="w-6 h-6" />,
    industry: "Industrial & Manufacturing",
    pick: "Nitrile (8 mil Diamond)",
    why: "Maximum puncture resistance and grip. Orange for high visibility in warehouse environments.",
    color: "text-rose-600",
    bgColor: "bg-rose-50",
  },
];

/* ─────────────────────────── Helpers ─────────────────────────── */

function RatingDots({ value, max = 5, color }: { value: number; max?: number; color: string }) {
  return (
    <div className="flex gap-1">
      {[...Array(max)].map((_, i) => (
        <div
          key={i}
          className={`w-2.5 h-2.5 rounded-full ${i < value ? color : "bg-gray-200"}`}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────── Component ─────────────────────────── */

export default function GloveBuyingGuide() {
  const [activeTab, setActiveTab] = useState<GloveType>("nitrile");
  const activeMaterial = MATERIALS.find((m) => m.id === activeTab)!;

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
            <span className="text-mjs-red">Disposable Glove Guide</span>
          </nav>

          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-mjs-red/10 border border-mjs-red/20 text-mjs-red px-3 py-1.5 rounded-full text-xs font-semibold mb-4 uppercase tracking-wider">
              <Hand className="w-3.5 h-3.5" />
              Buying Guide
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
              Nitrile vs Vinyl vs Latex
            </h1>
            <p className="text-lg md:text-xl text-mjs-gray-300 leading-relaxed max-w-2xl mx-auto">
              The right glove protects your hands, your team, and your clients.
              This guide makes the choice simple.
            </p>
          </div>
        </div>
      </div>

      {/* ── Quick Jump ── */}
      <div className="border-b border-gray-100 bg-mjs-gray-50 sticky top-0 z-20">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center justify-center gap-1 py-3 overflow-x-auto scrollbar-hide">
            <span className="text-xs font-semibold text-mjs-gray-400 mr-2 shrink-0 uppercase tracking-wider">Jump to:</span>
            {["Compare", "Size Chart", "Thickness", "By Industry", "Shop All"].map((label) => (
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

      {/* ── Material Comparison ── */}
      <div id="compare" className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-4xl font-extrabold text-mjs-dark mb-3">
            Which Glove Material Is Right for You?
          </h2>
          <p className="text-mjs-gray-500 text-base md:text-lg max-w-2xl mx-auto">
            Each material has strengths. Select one to see the full breakdown.
          </p>
        </div>

        {/* Material tabs */}
        <div className="flex justify-center gap-3 mb-10">
          {MATERIALS.map((m) => (
            <button
              key={m.id}
              onClick={() => setActiveTab(m.id)}
              className={`
                relative flex flex-col items-center px-5 md:px-8 py-4 rounded-xl transition-all duration-200 border-2 min-w-[100px]
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
              <span className={`text-sm md:text-base font-bold ${activeTab === m.id ? m.color : "text-mjs-dark"}`}>
                {m.name}
              </span>
              <span className="text-[10px] text-mjs-gray-400 mt-0.5">{m.tagline}</span>
              {activeTab === m.id && (
                <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full ${m.bgColor.replace("bg-", "bg-")} border ${m.borderColor}`} />
              )}
            </button>
          ))}
        </div>

        {/* Active material detail */}
        <div className={`rounded-2xl border ${activeMaterial.borderColor} overflow-hidden`}>
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-0">
            {/* Left - Overview */}
            <div className={`${activeMaterial.bgColor} p-6 md:p-10 border-b lg:border-b-0 lg:border-r ${activeMaterial.borderColor}`}>
              <h3 className={`text-2xl md:text-3xl font-black ${activeMaterial.color} mb-2`}>
                {activeMaterial.name} Gloves
              </h3>
              <p className="text-sm text-mjs-gray-600 mb-6 leading-relaxed">{activeMaterial.description}</p>

              {/* Ratings */}
              <div className="space-y-3 mb-6">
                {[
                  { label: "Puncture Resistance", value: activeMaterial.punctureResistance },
                  { label: "Chemical Resistance", value: activeMaterial.chemicalResistance },
                  { label: "Tactile Sensitivity", value: activeMaterial.tactileSensitivity },
                  { label: "Comfort & Fit", value: activeMaterial.comfort },
                ].map((r) => (
                  <div key={r.label} className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-mjs-gray-600">{r.label}</span>
                    <RatingDots value={r.value} color={activeMaterial.bgColor.replace("50", "500").replace("bg-", "bg-")} />
                  </div>
                ))}
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/70 rounded-lg p-3 text-center">
                  <div className="text-[10px] font-semibold text-mjs-gray-400 uppercase">Thickness</div>
                  <div className="text-sm font-bold text-mjs-dark">{activeMaterial.thickness}</div>
                </div>
                <div className="bg-white/70 rounded-lg p-3 text-center">
                  <div className="text-[10px] font-semibold text-mjs-gray-400 uppercase">Cost/Glove</div>
                  <div className="text-sm font-bold text-mjs-dark">{activeMaterial.costPerGlove}</div>
                </div>
                <div className="bg-white/70 rounded-lg p-3 text-center">
                  <div className="text-[10px] font-semibold text-mjs-gray-400 uppercase">Latex-Free</div>
                  <div className="text-sm font-bold">{activeMaterial.allergenFree ? <span className="text-green-600">Yes</span> : <span className="text-red-600">No</span>}</div>
                </div>
                <div className="bg-white/70 rounded-lg p-3 text-center">
                  <div className="text-[10px] font-semibold text-mjs-gray-400 uppercase">Food Safe</div>
                  <div className="text-sm font-bold text-green-600">Yes</div>
                </div>
              </div>
            </div>

            {/* Right - Pros, Cons, Products */}
            <div className="p-6 md:p-10 bg-white">
              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                {/* Pros */}
                <div>
                  <h4 className="text-xs font-semibold text-mjs-gray-400 uppercase tracking-wider mb-3">Advantages</h4>
                  <ul className="space-y-2">
                    {activeMaterial.pros.map((p) => (
                      <li key={p} className="flex gap-2 text-sm text-mjs-gray-700">
                        <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Cons */}
                <div>
                  <h4 className="text-xs font-semibold text-mjs-gray-400 uppercase tracking-wider mb-3">Limitations</h4>
                  <ul className="space-y-2">
                    {activeMaterial.cons.map((c) => (
                      <li key={c} className="flex gap-2 text-sm text-mjs-gray-700">
                        <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Best for */}
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-mjs-gray-400 uppercase tracking-wider mb-3">Best For</h4>
                <div className="flex flex-wrap gap-2">
                  {activeMaterial.bestFor.map((b) => (
                    <span key={b} className={`px-3 py-1.5 rounded-full text-xs font-semibold ${activeMaterial.bgColor} ${activeMaterial.color}`}>
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* Products */}
              <div>
                <h4 className="text-xs font-semibold text-mjs-gray-400 uppercase tracking-wider mb-3">Shop {activeMaterial.name} Gloves</h4>
                <div className="space-y-2">
                  {activeMaterial.products.map((p) => (
                    <Link
                      key={p.sku}
                      href={`/product/${p.slug}`}
                      className="flex items-center justify-between bg-mjs-gray-50 rounded-lg p-3 border border-gray-100 hover:border-mjs-red/30 hover:shadow-sm transition-all group"
                    >
                      <div>
                        <div className="text-sm font-semibold text-mjs-dark group-hover:text-mjs-red transition-colors">{p.label}</div>
                        <div className="text-xs text-mjs-gray-400">SKU: {p.sku} &middot; Sizes: {p.sizes}</div>
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

      {/* ── Side-by-Side Comparison Table ── */}
      <div className="bg-mjs-gray-50 border-y border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
          <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-2 text-center">
            Side-by-Side Comparison
          </h2>
          <p className="text-mjs-gray-500 text-center mb-8 max-w-xl mx-auto">
            How nitrile, vinyl, and latex stack up on the metrics that matter.
          </p>

          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mjs-dark text-white">
                  <th className="text-left px-4 py-3 font-semibold">Feature</th>
                  <th className="text-center px-4 py-3 font-semibold">Nitrile</th>
                  <th className="text-center px-4 py-3 font-semibold">Vinyl</th>
                  <th className="text-center px-4 py-3 font-semibold">Latex</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Puncture Resistance", key: "punctureResistance" as const },
                  { feature: "Chemical Resistance", key: "chemicalResistance" as const },
                  { feature: "Tactile Sensitivity", key: "tactileSensitivity" as const },
                  { feature: "Comfort & Fit", key: "comfort" as const },
                ].map((row) => (
                  <tr key={row.feature} className="border-t border-gray-100">
                    <td className="px-4 py-3 font-semibold text-mjs-dark">{row.feature}</td>
                    {MATERIALS.map((m) => (
                      <td key={m.id} className="px-4 py-3 text-center">
                        <div className="flex justify-center">
                          <RatingDots value={m[row.key]} color={m.id === "nitrile" ? "bg-blue-500" : m.id === "vinyl" ? "bg-amber-500" : "bg-emerald-500"} />
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="border-t border-gray-100">
                  <td className="px-4 py-3 font-semibold text-mjs-dark">Latex-Free</td>
                  <td className="px-4 py-3 text-center"><Check className="w-4 h-4 text-green-500 mx-auto" /></td>
                  <td className="px-4 py-3 text-center"><Check className="w-4 h-4 text-green-500 mx-auto" /></td>
                  <td className="px-4 py-3 text-center"><X className="w-4 h-4 text-red-400 mx-auto" /></td>
                </tr>
                <tr className="border-t border-gray-100">
                  <td className="px-4 py-3 font-semibold text-mjs-dark">Food Safe</td>
                  <td className="px-4 py-3 text-center"><Check className="w-4 h-4 text-green-500 mx-auto" /></td>
                  <td className="px-4 py-3 text-center"><Check className="w-4 h-4 text-green-500 mx-auto" /></td>
                  <td className="px-4 py-3 text-center"><Check className="w-4 h-4 text-green-500 mx-auto" /></td>
                </tr>
                <tr className="border-t border-gray-100">
                  <td className="px-4 py-3 font-semibold text-mjs-dark">Cost per Glove</td>
                  <td className="px-4 py-3 text-center font-mono text-blue-700">$0.06-0.20</td>
                  <td className="px-4 py-3 text-center font-mono text-amber-700">$0.04-0.06</td>
                  <td className="px-4 py-3 text-center font-mono text-emerald-700">$0.07-3.58</td>
                </tr>
                <tr className="border-t border-gray-100 bg-mjs-gray-50">
                  <td className="px-4 py-3 font-bold text-mjs-dark">Best For</td>
                  <td className="px-4 py-3 text-center text-xs text-blue-700 font-medium">Most industries</td>
                  <td className="px-4 py-3 text-center text-xs text-amber-700 font-medium">Food service, light duty</td>
                  <td className="px-4 py-3 text-center text-xs text-emerald-700 font-medium">Medical, precision</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Size Chart ── */}
      <div id="size-chart" className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-3">
            Glove Sizing Guide
          </h2>
          <p className="text-mjs-gray-500 max-w-2xl mx-auto">
            A proper fit means better dexterity, less fatigue, and fewer tears.
            Measure across your palm (excluding thumb) to find your size.
          </p>
        </div>

        <div className="grid md:grid-cols-[1fr_1.5fr] gap-8 items-start">
          {/* How to measure */}
          <div className="bg-mjs-gray-50 rounded-2xl border border-gray-200 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-mjs-red/10 text-mjs-red flex items-center justify-center">
                <Ruler className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-mjs-dark">How to Measure</h3>
            </div>
            <ol className="space-y-4 text-sm text-mjs-gray-600">
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-mjs-red text-white text-xs font-bold flex items-center justify-center shrink-0">1</span>
                <span>Lay your dominant hand flat with fingers together.</span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-mjs-red text-white text-xs font-bold flex items-center justify-center shrink-0">2</span>
                <span>Wrap a tape measure around the widest part of your palm (just below the knuckles, excluding thumb).</span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-mjs-red text-white text-xs font-bold flex items-center justify-center shrink-0">3</span>
                <span>Note the measurement in inches and match it to the chart.</span>
              </li>
            </ol>

            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">
                <strong>Between sizes?</strong> Size up for comfort on long shifts, or size down for tasks requiring maximum dexterity.
              </p>
            </div>
          </div>

          {/* Size table */}
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mjs-dark text-white">
                  <th className="text-left px-4 py-3 font-semibold">Size</th>
                  <th className="text-left px-4 py-3 font-semibold">Palm Width</th>
                  <th className="text-left px-4 py-3 font-semibold">Hand Length</th>
                  <th className="text-left px-4 py-3 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody>
                {SIZE_CHART.map((s) => (
                  <tr key={s.size} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-bold text-mjs-dark">{s.size}</td>
                    <td className="px-4 py-3 font-mono text-mjs-gray-600">{s.palmWidth}</td>
                    <td className="px-4 py-3 font-mono text-mjs-gray-600">{s.palmLength}</td>
                    <td className="px-4 py-3 text-mjs-gray-500">
                      {s.size === "Medium" ? (
                        <span className="inline-flex items-center gap-1 text-mjs-red font-semibold text-xs">
                          <Check className="w-3 h-3" /> Most popular
                        </span>
                      ) : (
                        s.typical
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Thickness Guide ── */}
      <div id="thickness" className="bg-mjs-gray-50 border-y border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-3">
              Thickness Breakdown
            </h2>
            <p className="text-mjs-gray-500 max-w-2xl mx-auto">
              Measured in mils (thousandths of an inch). Thicker = more protection but less dexterity.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { mil: "3-4 mil", label: "Economy", desc: "Basic tasks, food service, light cleaning", icon: <Droplets className="w-5 h-5" />, bars: 1, color: "bg-amber-400" },
              { mil: "5 mil", label: "Standard", desc: "Medical exams, janitorial, general purpose", icon: <Shield className="w-5 h-5" />, bars: 2, color: "bg-blue-500" },
              { mil: "8 mil", label: "Heavy-Duty", desc: "Chemical handling, auto, industrial", icon: <Flame className="w-5 h-5" />, bars: 3, color: "bg-orange-500" },
              { mil: "14 mil", label: "High Risk", desc: "EMT/first responders, hazmat, biohazard", icon: <AlertTriangle className="w-5 h-5" />, bars: 4, color: "bg-red-600" },
            ].map((t) => (
              <div key={t.mil} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-8 h-8 rounded-lg ${t.color} text-white flex items-center justify-center`}>
                    {t.icon}
                  </div>
                  <div>
                    <div className="text-lg font-black text-mjs-dark">{t.mil}</div>
                    <div className="text-[10px] font-semibold text-mjs-gray-400 uppercase">{t.label}</div>
                  </div>
                </div>
                {/* Thickness visual */}
                <div className="flex gap-1 mb-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className={`h-2 flex-1 rounded-full ${i < t.bars ? t.color : "bg-gray-200"}`} />
                  ))}
                </div>
                <p className="text-xs text-mjs-gray-500">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Industry Recommendations ── */}
      <div id="by-industry" className="bg-mjs-dark">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
              The Right Glove for Your Industry
            </h2>
            <p className="text-mjs-gray-400 max-w-2xl mx-auto">
              Our top picks based on what we see working across thousands of facilities.
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

      {/* ── Allergy Warning ── */}
      <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-16">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 md:p-10 flex flex-col md:flex-row items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-bold text-red-900 mb-2">Latex Allergy? Go Nitrile.</h3>
            <p className="text-sm text-red-700 max-w-xl">
              An estimated 6-12% of healthcare workers have latex sensitivity. If anyone on your team
              or in your facility could be affected, nitrile is the safest choice — it offers comparable
              protection without the allergen risk. Many facilities have gone fully latex-free.
            </p>
          </div>
          <Link
            href="/category/gloves-safety"
            className="shrink-0 inline-flex items-center gap-2 bg-red-600 text-white font-bold px-5 py-3 rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            Shop Nitrile Gloves
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* ── CTA ── */}
      <div id="shop-all" className="bg-gradient-to-r from-mjs-red to-mjs-red-dark">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
            Find Your Perfect Glove
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Browse our full selection of disposable gloves — nitrile, vinyl, latex, and safety PPE.
            Wholesale pricing with free local delivery.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/category/gloves-safety"
              className="inline-flex items-center gap-2 bg-white text-mjs-red font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Hand className="w-4 h-4" />
              Shop All Gloves & Safety
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white font-bold px-6 py-3 rounded-lg hover:bg-white/20 transition-colors"
            >
              Need Samples? Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
