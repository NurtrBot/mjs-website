"use client";

import { useState } from "react";
import {
  ChevronRight,
  ArrowRight,
  Check,
  X,
  Info,
  Shield,
  AlertTriangle,
  Wind,
  Building2,
  Stethoscope,
  Paintbrush,
  Factory,
  UtensilsCrossed,
  HardHat,
  CircleAlert,
} from "lucide-react";
import Link from "next/link";

/* ─────────────────────────── Data ─────────────────────────── */

type MaskType = "dust" | "surgical" | "n95" | "n100" | "p95" | "r95";

interface MaskCategory {
  id: MaskType;
  name: string;
  tagline: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  filtration: string;
  oilResistant: string;
  nioshApproved: boolean;
  pros: string[];
  cons: string[];
  bestFor: string[];
  products: { label: string; sku: string; slug: string }[];
}

const MASK_TYPES: MaskCategory[] = [
  {
    id: "dust",
    name: "Nuisance Dust Mask",
    tagline: "Basic comfort, not rated",
    color: "text-gray-700",
    bgColor: "bg-gray-100",
    borderColor: "border-gray-300",
    description:
      "A basic single-strap mask for comfort against non-toxic nuisance dust. NOT NIOSH-approved and does NOT filter harmful particulates. These are for comfort only — mowing, sweeping, or general dusty conditions where no hazard exists.",
    filtration: "Not rated",
    oilResistant: "No",
    nioshApproved: false,
    pros: [
      "Very inexpensive — pennies per mask",
      "Comfortable for extended wear",
      "Good for non-hazardous nuisance dust",
      "Easy to breathe through",
    ],
    cons: [
      "NOT NIOSH-approved for any hazard",
      "No seal — air leaks around edges",
      "Zero protection against harmful particles",
      "Cannot be used for regulatory compliance",
    ],
    bestFor: ["Sweeping & dusting", "Mowing & yard work", "General comfort in dusty areas"],
    products: [
      { label: "Standard Nuisance Dust Masks", sku: "DM", slug: "standard-nuisance-dust-masks" },
    ],
  },
  {
    id: "surgical",
    name: "Surgical / Procedure Mask",
    tagline: "Fluid barrier, source control",
    color: "text-sky-700",
    bgColor: "bg-sky-50",
    borderColor: "border-sky-200",
    description:
      "A loose-fitting disposable mask designed to block large droplets, splashes, and sprays from reaching the wearer's mouth and nose. Primarily used for source control — keeping the wearer's respiratory droplets from reaching others. Not designed as a particulate respirator.",
    filtration: "Not particulate rated",
    oilResistant: "N/A",
    nioshApproved: false,
    pros: [
      "Blocks large droplets and splashes",
      "Comfortable ear-loop design",
      "Good for source control (protecting others)",
      "Inexpensive and widely available",
      "3-ply construction for fluid resistance",
    ],
    cons: [
      "Loose fit — doesn't seal to face",
      "Not a NIOSH-approved respirator",
      "Does not filter small airborne particles effectively",
      "Cannot replace N95 for hazardous environments",
    ],
    bestFor: ["General illness prevention", "Food handling", "Customer-facing environments", "Light cleaning tasks"],
    products: [
      { label: "Blue Surgical Masks (50/bag)", sku: "4330", slug: "ear-loop-face-masks-blue-50-Per-Bag" },
      { label: "Black Procedure Masks (50/bx)", sku: "4331", slug: "ear-loop-face-masks-3-ply-black-non-medical-50-box" },
    ],
  },
  {
    id: "n95",
    name: "N95 Respirator",
    tagline: "Industry standard protection",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    description:
      "NIOSH-approved respirator that filters at least 95% of airborne particles (0.3 microns and larger). The \"N\" means Not resistant to oil. This is the most widely used respirator in janitorial, construction, healthcare, and general industry. Requires a proper face seal to be effective.",
    filtration: "95% of particles",
    oilResistant: "Not oil resistant",
    nioshApproved: true,
    pros: [
      "Filters 95% of airborne particles",
      "NIOSH-approved — meets OSHA requirements",
      "Widely available and cost-effective",
      "Multiple styles: cup, flat-fold, with/without valve",
      "Cool Flow valve option reduces heat and moisture buildup",
    ],
    cons: [
      "Not oil-resistant — degrades in oily environments",
      "Requires fit testing for workplace compliance",
      "Can be uncomfortable for extended wear",
      "Must be replaced when damp, damaged, or breathing becomes difficult",
    ],
    bestFor: ["General construction dust", "Sweeping & grinding", "Chemical mixing (non-oil)", "Mold remediation", "Healthcare (airborne precautions)"],
    products: [
      { label: "3M 8200 N95 (20/bx)", sku: "MMM8200", slug: "n95-particle-respirator-8200-mask-20-box" },
      { label: "3M 8210 N95 (20/bx)", sku: "MMM8210", slug: "3m-particulate-respirator-8210-n95-20-bx" },
      { label: "3M 8210V N95 Cool Flow (10/bx)", sku: "MMM8210V", slug: "particulate-respirator-8210v-n95-cool-flow-valve-10-box" },
    ],
  },
  {
    id: "n100",
    name: "N100 Respirator",
    tagline: "Maximum particle filtration",
    color: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    description:
      "NIOSH-approved respirator that filters 99.97% of airborne particles — the same filtration level as a HEPA filter. The \"N\" means Not resistant to oil. Used when maximum protection is required against extremely hazardous non-oil-based particulates like asbestos, lead, and cadmium.",
    filtration: "99.97% of particles",
    oilResistant: "Not oil resistant",
    nioshApproved: true,
    pros: [
      "HEPA-level filtration (99.97%)",
      "Maximum protection for hazardous particles",
      "Required for asbestos and lead work",
      "NIOSH-approved for regulatory compliance",
    ],
    cons: [
      "Higher cost per mask",
      "Greater breathing resistance",
      "Not oil-resistant",
      "Heavier and bulkier than N95",
      "Requires fit testing",
    ],
    bestFor: ["Asbestos abatement", "Lead paint removal", "Cadmium handling", "Pharmaceutical dust", "Any task requiring HEPA filtration"],
    products: [
      { label: "3M 8233 N100 Respirator", sku: "MMM8233", slug: "n100-particulate-respirator" },
    ],
  },
  {
    id: "p95",
    name: "P95 Respirator",
    tagline: "Oil-proof, 95% filtration",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    description:
      "NIOSH-approved respirator that filters at least 95% of airborne particles AND is oil-Proof. The \"P\" means the filter does not degrade when exposed to oil-based aerosols. Ideal for environments with oil mists, lubricants, or petroleum-based products.",
    filtration: "95% of particles",
    oilResistant: "Oil-proof (P)",
    nioshApproved: true,
    pros: [
      "Oil-proof — maintains filtration in oily environments",
      "95% particle filtration",
      "No time-use limitation from oil exposure",
      "Includes organic vapor relief",
      "Ideal for painting and spray applications",
    ],
    cons: [
      "More expensive than N95",
      "Higher breathing resistance",
      "Bulkier design",
      "Requires fit testing",
    ],
    bestFor: ["Spray painting", "Oil mist environments", "Petroleum processing", "Lubrication operations", "Staining and coating"],
    products: [
      { label: "3M 8577 P95 (10/bx)", sku: "MMM8577", slug: "particulate-respirator-8577-p95-10-box" },
    ],
  },
  {
    id: "r95",
    name: "R95 Respirator",
    tagline: "Oil-resistant, 95% filtration",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    description:
      "NIOSH-approved respirator that filters at least 95% of airborne particles with Resistance to oil degradation. The \"R\" rating means it resists oil but only for one shift (8 hours). After 8 hours of oil exposure, the filter must be replaced. A middle ground between N95 and P95.",
    filtration: "95% of particles",
    oilResistant: "Resistant (8-hour limit)",
    nioshApproved: true,
    pros: [
      "Oil-resistant for up to 8 hours",
      "95% particle filtration",
      "Includes nuisance-level organic vapor relief",
      "Good balance of protection and cost",
      "NIOSH-approved",
    ],
    cons: [
      "Oil resistance limited to one 8-hour shift",
      "Must be replaced after oil exposure shift",
      "More expensive than N95",
      "Not as durable as P95 in oily environments",
    ],
    bestFor: ["Short-duration oil exposure", "Cooking/kitchen ventilation", "Light solvent use", "Organic vapor nuisance relief"],
    products: [
      { label: "3M 8247 R95 (20/bx)", sku: "MMM8247", slug: "r95-particulate-respirator-w-nuisance-level-organic-vapor-relief-20-box" },
    ],
  },
];

interface NIOSHRating {
  letter: string;
  meaning: string;
  oilStatus: string;
  color: string;
}

const NIOSH_LETTERS: NIOSHRating[] = [
  { letter: "N", meaning: "Not oil resistant", oilStatus: "Cannot be used in oil-containing environments", color: "bg-blue-500" },
  { letter: "R", meaning: "Resistant to oil", oilStatus: "Can resist oil for one 8-hour shift, then must be replaced", color: "bg-amber-500" },
  { letter: "P", meaning: "Oil-Proof", oilStatus: "Maintains full filtration regardless of oil exposure", color: "bg-emerald-500" },
];

interface NIOSHNumber {
  number: string;
  filtration: string;
  description: string;
}

const NIOSH_NUMBERS: NIOSHNumber[] = [
  { number: "95", filtration: "95%", description: "Filters at least 95% of airborne particles. Most common rating." },
  { number: "99", filtration: "99%", description: "Filters at least 99% of airborne particles. Uncommon in disposable masks." },
  { number: "100", filtration: "99.97%", description: "HEPA-equivalent. Filters 99.97% of particles. Maximum protection." },
];

interface TaskRecommendation {
  task: string;
  hazard: string;
  minimum: string;
  recommended: string;
  level: number;
}

const TASK_GUIDE: TaskRecommendation[] = [
  { task: "Sweeping & dusting (non-toxic)", hazard: "Nuisance dust", minimum: "Dust mask", recommended: "N95 for prolonged exposure", level: 1 },
  { task: "Chemical mixing (water-based)", hazard: "Chemical splash & mist", minimum: "N95", recommended: "N95 + splash goggles", level: 2 },
  { task: "Sanding drywall or wood", hazard: "Fine particulate", minimum: "N95", recommended: "N95 Cool Flow (8210V)", level: 2 },
  { task: "Mold remediation", hazard: "Mold spores", minimum: "N95", recommended: "N100 for large areas", level: 3 },
  { task: "Spray painting / staining", hazard: "Oil-based aerosols + vapors", minimum: "P95", recommended: "P95 with vapor relief", level: 3 },
  { task: "Solvent / chemical stripping", hazard: "Organic vapors + particles", minimum: "R95 or P95", recommended: "P95 + full face shield", level: 3 },
  { task: "Asbestos or lead abatement", hazard: "Carcinogenic fibers/dust", minimum: "N100", recommended: "N100 + Tyvek suit + HEPA vacuum", level: 5 },
  { task: "Welding / metal grinding", hazard: "Metal fumes + sparks", minimum: "N95", recommended: "P95 (for oil coolants)", level: 3 },
];

const INDUSTRY_PICKS = [
  { icon: <Building2 className="w-6 h-6" />, industry: "Janitorial & Facility Maintenance", pick: "N95 (3M 8210)", why: "General protection for sweeping, chemical mixing, and dust exposure. Cool Flow valve version for extended cleaning shifts.", color: "text-blue-600", bgColor: "bg-blue-50" },
  { icon: <HardHat className="w-6 h-6" />, industry: "Construction", pick: "N95 (3M 8200/8210)", why: "Drywall dust, concrete dust, wood particles. N100 required for asbestos and lead. P95 for tasks involving oil-based products.", color: "text-orange-600", bgColor: "bg-orange-50" },
  { icon: <Stethoscope className="w-6 h-6" />, industry: "Healthcare", pick: "N95 (surgical rated)", why: "OSHA-required for airborne precautions (TB, COVID, etc.). Must be NIOSH-approved AND fit-tested. Surgical N95s add fluid resistance.", color: "text-emerald-600", bgColor: "bg-emerald-50" },
  { icon: <Paintbrush className="w-6 h-6" />, industry: "Painting & Coatings", pick: "P95 (3M 8577)", why: "Oil-proof rating is essential for spray paint and oil-based coating mists. Organic vapor relief layer handles fumes.", color: "text-violet-600", bgColor: "bg-violet-50" },
  { icon: <UtensilsCrossed className="w-6 h-6" />, industry: "Food Processing", pick: "Surgical Mask or N95", why: "Surgical masks for general food handling (source control). N95 when dealing with flour dust, spice dust, or allergen-heavy environments.", color: "text-amber-600", bgColor: "bg-amber-50" },
  { icon: <Factory className="w-6 h-6" />, industry: "Manufacturing", pick: "N95 or P95", why: "N95 for general dust. P95 where oil mists from coolants or lubricants are present. R95 for short-duration oil exposure tasks.", color: "text-rose-600", bgColor: "bg-rose-50" },
];

/* ─────────────────────────── Component ─────────────────────────── */

export default function RespiratorMaskGuide() {
  const [activeTab, setActiveTab] = useState<MaskType>("n95");
  const activeMask = MASK_TYPES.find((m) => m.id === activeTab)!;

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
            <span className="text-mjs-red">Respirator & Mask Guide</span>
          </nav>

          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-mjs-red/10 border border-mjs-red/20 text-mjs-red px-3 py-1.5 rounded-full text-xs font-semibold mb-4 uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5" />
              Safety Guide
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
              Respirator & Mask<br />Ratings Explained
            </h1>
            <p className="text-lg md:text-xl text-mjs-gray-300 leading-relaxed max-w-2xl mx-auto">
              N95, N100, P95, R95 — what the letters and numbers mean, when to use each one, and which tasks require which rating.
            </p>
          </div>
        </div>
      </div>

      {/* ── Quick Jump ── */}
      <div className="border-b border-gray-100 bg-mjs-gray-50 sticky top-0 z-20">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center justify-center gap-1 py-3 overflow-x-auto scrollbar-hide">
            <span className="text-xs font-semibold text-mjs-gray-400 mr-2 shrink-0 uppercase tracking-wider">Jump to:</span>
            {["Compare", "NIOSH Ratings", "By Task", "Fit & Seal", "By Industry", "Shop All"].map((label) => (
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

      {/* ── Mask Type Comparison ── */}
      <div id="compare" className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-4xl font-extrabold text-mjs-dark mb-3">
            Mask & Respirator Types Compared
          </h2>
          <p className="text-mjs-gray-500 text-base md:text-lg max-w-2xl mx-auto">
            Not all masks are respirators. Understanding the difference could save your health.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10">
          {MASK_TYPES.map((m) => (
            <button
              key={m.id}
              onClick={() => setActiveTab(m.id)}
              className={`
                relative flex flex-col items-center px-3 md:px-5 py-3 md:py-4 rounded-xl transition-all duration-200 border-2 min-w-[75px]
                ${activeTab === m.id
                  ? `${m.borderColor} bg-white shadow-lg scale-105`
                  : "border-gray-200 bg-white hover:shadow-md"
                }
              `}
            >
              <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full mb-1.5 md:mb-2 ${activeTab === m.id ? m.bgColor : "bg-gray-100"}`}>
                <div className={`w-full h-full rounded-full flex items-center justify-center text-[10px] md:text-xs font-black ${activeTab === m.id ? m.color : "text-gray-400"}`}>
                  {m.id === "dust" ? "D" : m.id === "surgical" ? "S" : m.id.toUpperCase()}
                </div>
              </div>
              <span className={`text-[10px] md:text-xs font-bold ${activeTab === m.id ? m.color : "text-mjs-dark"}`}>
                {m.name.split(" ")[0]}
              </span>
              {activeTab === m.id && (
                <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full ${m.bgColor} border ${m.borderColor}`} />
              )}
            </button>
          ))}
        </div>

        {/* Detail panel */}
        <div className={`rounded-2xl border ${activeMask.borderColor} overflow-hidden`}>
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-0">
            <div className={`${activeMask.bgColor} p-6 md:p-10 border-b lg:border-b-0 lg:border-r ${activeMask.borderColor}`}>
              <h3 className={`text-2xl md:text-3xl font-black ${activeMask.color} mb-2`}>
                {activeMask.name}
              </h3>
              <p className="text-sm text-mjs-gray-600 mb-6 leading-relaxed">{activeMask.description}</p>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-white/70 rounded-lg p-3 text-center">
                  <div className="text-[10px] font-semibold text-mjs-gray-400 uppercase">Filtration</div>
                  <div className="text-sm font-bold text-mjs-dark">{activeMask.filtration}</div>
                </div>
                <div className="bg-white/70 rounded-lg p-3 text-center">
                  <div className="text-[10px] font-semibold text-mjs-gray-400 uppercase">Oil Resistance</div>
                  <div className="text-sm font-bold text-mjs-dark">{activeMask.oilResistant}</div>
                </div>
              </div>
              <div className="bg-white/70 rounded-lg p-3 text-center">
                <div className="text-[10px] font-semibold text-mjs-gray-400 uppercase">NIOSH Approved</div>
                <div className="text-sm font-bold">
                  {activeMask.nioshApproved
                    ? <span className="text-green-600 flex items-center justify-center gap-1"><Check className="w-4 h-4" /> Yes</span>
                    : <span className="text-red-600 flex items-center justify-center gap-1"><X className="w-4 h-4" /> No</span>
                  }
                </div>
              </div>
            </div>

            <div className="p-6 md:p-10 bg-white">
              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div>
                  <h4 className="text-xs font-semibold text-mjs-gray-400 uppercase tracking-wider mb-3">Advantages</h4>
                  <ul className="space-y-2">
                    {activeMask.pros.map((p) => (
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
                    {activeMask.cons.map((c) => (
                      <li key={c} className="flex gap-2 text-sm text-mjs-gray-700">
                        <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-xs font-semibold text-mjs-gray-400 uppercase tracking-wider mb-3">When to Use</h4>
                <div className="flex flex-wrap gap-2">
                  {activeMask.bestFor.map((b) => (
                    <span key={b} className={`px-3 py-1.5 rounded-full text-xs font-semibold ${activeMask.bgColor} ${activeMask.color}`}>
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-mjs-gray-400 uppercase tracking-wider mb-3">Shop This Type</h4>
                <div className="space-y-2">
                  {activeMask.products.map((p) => (
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

      {/* ── NIOSH Rating System ── */}
      <div id="niosh-ratings" className="bg-mjs-gray-50 border-y border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-3">
              NIOSH Rating System Decoded
            </h2>
            <p className="text-mjs-gray-500 max-w-2xl mx-auto">
              Every NIOSH-approved respirator has a letter + number rating. Here is what each part means.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Letters */}
            <div>
              <h3 className="text-lg font-bold text-mjs-dark mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-mjs-red" /> The Letter: Oil Resistance
              </h3>
              <div className="space-y-3">
                {NIOSH_LETTERS.map((l) => (
                  <div key={l.letter} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-lg ${l.color} text-white flex items-center justify-center text-lg font-black`}>
                        {l.letter}
                      </div>
                      <div>
                        <div className="text-base font-bold text-mjs-dark">{l.letter} = {l.meaning}</div>
                      </div>
                    </div>
                    <p className="text-xs text-mjs-gray-500 ml-13">{l.oilStatus}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Numbers */}
            <div>
              <h3 className="text-lg font-bold text-mjs-dark mb-4 flex items-center gap-2">
                <Wind className="w-5 h-5 text-mjs-red" /> The Number: Filtration Level
              </h3>
              <div className="space-y-3">
                {NIOSH_NUMBERS.map((n) => (
                  <div key={n.number} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-mjs-dark text-white flex items-center justify-center text-lg font-black">
                        {n.number}
                      </div>
                      <div>
                        <div className="text-base font-bold text-mjs-dark">Filters {n.filtration}</div>
                      </div>
                    </div>
                    <p className="text-xs text-mjs-gray-500">{n.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 max-w-3xl mx-auto">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-800 mb-0.5">Pro Tip</p>
              <p className="text-sm text-amber-700">
                Think of it as: <strong>Letter = Oil</strong>, <strong>Number = Filtration</strong>. An N95 is Not oil resistant + 95% filtration. A P100 is oil-Proof + 99.97% filtration. If oil aerosols are present, you need R or P.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── When to Use Each Type ── */}
      <div id="by-task" className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-3">
            Which Respirator by Task
          </h2>
          <p className="text-mjs-gray-500 max-w-2xl mx-auto">
            Match the hazard to the right level of protection. When in doubt, always go one level higher.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-mjs-dark text-white">
                <th className="text-left px-4 py-3 font-semibold">Task</th>
                <th className="text-left px-4 py-3 font-semibold">Hazard</th>
                <th className="text-left px-4 py-3 font-semibold">Minimum</th>
                <th className="text-left px-4 py-3 font-semibold">Recommended</th>
                <th className="text-center px-4 py-3 font-semibold">Risk</th>
              </tr>
            </thead>
            <tbody>
              {TASK_GUIDE.map((t) => (
                <tr key={t.task} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-mjs-dark">{t.task}</td>
                  <td className="px-4 py-3 text-mjs-gray-500 text-xs">{t.hazard}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">{t.minimum}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-mjs-gray-600">{t.recommended}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className={`w-2 h-2 rounded-full ${i < t.level ? "bg-red-500" : "bg-gray-200"}`} />
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Fit & Seal ── */}
      <div id="fit-&-seal" className="bg-mjs-gray-50 border-y border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-3">
              Fit & Seal: Why It Matters
            </h2>
            <p className="text-mjs-gray-500 max-w-2xl mx-auto">
              A respirator only works if it seals to your face. Air follows the path of least resistance — if there are gaps, contaminated air bypasses the filter entirely.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-mjs-dark flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" /> Proper Fit Checklist
              </h3>
              {[
                { title: "Fit testing is required by OSHA", detail: "Employers must fit-test workers annually for each respirator model used. Both qualitative and quantitative tests are accepted." },
                { title: "User seal check every time", detail: "Before each use, cup hands over respirator and exhale sharply. You should feel slight pressure and no air leaking around edges." },
                { title: "Facial hair breaks the seal", detail: "Any facial hair that crosses the sealing surface (stubble, beards, sideburns) prevents a proper seal. Clean-shaven is required." },
                { title: "Two straps positioned correctly", detail: "Top strap goes over the crown of the head, bottom strap below the ears. Both should be snug but not painfully tight." },
                { title: "Nose clip forms to bridge of nose", detail: "Use both hands to mold the nose clip to the shape of your nose. This is where most leaks occur." },
              ].map((tip) => (
                <div key={tip.title} className="flex gap-3 bg-white rounded-lg p-4 border border-gray-100">
                  <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold text-mjs-dark">{tip.title}</div>
                    <div className="text-xs text-mjs-gray-500 mt-0.5">{tip.detail}</div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-lg font-bold text-mjs-dark mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" /> When to Replace
              </h3>
              <div className="space-y-3">
                {[
                  "Breathing becomes noticeably more difficult",
                  "Respirator becomes wet, damp, or soiled",
                  "Any visible damage, tears, or deformation",
                  "Straps lose elasticity or break",
                  "Nose clip no longer holds its shape",
                  "You can smell or taste contaminants through the mask",
                  "After any exposure to oil (N-series only)",
                  "After 8 hours of oil exposure (R-series)",
                ].map((item) => (
                  <div key={item} className="flex gap-3 bg-white rounded-lg p-3 border border-gray-100">
                    <CircleAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-mjs-gray-700">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-amber-800 mb-0.5">Pro Tip</p>
                  <p className="text-sm text-amber-700">
                    Store respirators in a clean, dry plastic bag between uses. Never store them in tool bags, pockets, or hanging on hooks where they collect dust and deform.
                  </p>
                </div>
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
              Recommended by Industry
            </h2>
            <p className="text-mjs-gray-400 max-w-2xl mx-auto">
              Our top respirator picks based on the most common hazards in each industry.
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
            Protect Your Team
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Browse our full selection of respirators, masks, and safety PPE. Wholesale pricing with free local delivery.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/category/gloves-safety"
              className="inline-flex items-center gap-2 bg-white text-mjs-red font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Shield className="w-4 h-4" />
              Shop Gloves & Safety
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white font-bold px-6 py-3 rounded-lg hover:bg-white/20 transition-colors"
            >
              Need Bulk Pricing? Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
