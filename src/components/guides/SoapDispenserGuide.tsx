"use client";

import { useState } from "react";
import {
  ChevronRight,
  ArrowRight,
  Check,
  X,
  Info,
  Droplets,
  Zap,
  Hand,
  Shield,
  Building2,
  Stethoscope,
  UtensilsCrossed,
  School,
  Hotel,
  Wrench,
  BatteryFull,
  Accessibility,
} from "lucide-react";
import Link from "next/link";

/* ─────────────────────────── Types & Data ─────────────────────────── */

type DispenserTab = "manual-liquid" | "auto-liquid" | "manual-foam" | "auto-foam";

interface DispenserType {
  id: DispenserTab;
  name: string;
  tagline: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  pros: string[];
  cons: string[];
  bestFor: string[];
  costPerWash: string;
  reliability: number; // 1-5
  hygiene: number;
  maintenance: number;
  products: { label: string; sku: string; slug: string; detail: string }[];
}

const DISPENSER_TYPES: DispenserType[] = [
  {
    id: "manual-liquid",
    name: "Manual Liquid",
    tagline: "The proven classic",
    icon: <Droplets className="w-5 h-5" />,
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    description:
      "Push-button or lever-operated liquid soap dispensers are the most common in commercial restrooms. They are reliable, affordable, and easy to maintain. No batteries required.",
    pros: [
      "No batteries -- zero electrical maintenance",
      "Lowest upfront cost",
      "Universally familiar to users",
      "Simple mechanism -- rarely breaks",
      "Compatible with most bulk liquid soaps",
    ],
    cons: [
      "Touch required -- higher germ transfer risk",
      "Soap can drip and create mess",
      "Mechanism can clog with thick soaps",
      "Harder to control portion size",
    ],
    bestFor: ["Back-of-house restrooms", "Low-traffic areas", "Budget-conscious facilities", "Industrial washrooms"],
    costPerWash: "$0.006-0.01",
    reliability: 5,
    hygiene: 3,
    maintenance: 5,
    products: [
      { label: "Manual Gray 27oz", sku: "425GRY", slug: "alpine-industries-425-gry-27-oz-wall-mount-liquid-soap-hand-sanitizer-dispenser-manual-gray", detail: "Wall-mount, ABS plastic" },
      { label: "Manual Stainless 40oz", sku: "424SSB", slug: "alpine-industries-424-ssb-40-oz-wall-mount-liquid-soap-dispenser-manual-stainless", detail: "Wall-mount, stainless steel" },
      { label: "Bobrick ClassicSeries 40oz", sku: "BOB2111", slug: "classicseries-surface-mounted-soap-dispenser-40oz-stainless-steel", detail: "Surface-mount, stainless steel" },
      { label: "Bobrick ConturaSeries 40oz", sku: "BOB4112", slug: "conturaseries-surface-mounted-liquid-soap-dispenser-40oz-stainless-steel-satin", detail: "Surface-mount, satin stainless" },
    ],
  },
  {
    id: "auto-liquid",
    name: "Automatic Liquid",
    tagline: "Touchless hygiene",
    icon: <Zap className="w-5 h-5" />,
    color: "text-violet-700",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-200",
    description:
      "Infrared sensor-activated dispensers deliver a measured dose of liquid soap without touching. Ideal for high-traffic public restrooms where hygiene is a priority.",
    pros: [
      "Touchless -- reduces cross-contamination",
      "Controlled portion size reduces waste",
      "Modern, professional appearance",
      "Less soap mess on counters",
      "Users prefer touchless in public restrooms",
    ],
    cons: [
      "Requires batteries (typically 4x AA or C)",
      "Higher upfront cost than manual",
      "Sensor can malfunction with dirt or moisture",
      "Battery replacement adds ongoing cost",
    ],
    bestFor: ["Public-facing restrooms", "Medical and dental offices", "Food service", "Office lobbies"],
    costPerWash: "$0.005-0.008",
    reliability: 4,
    hygiene: 5,
    maintenance: 3,
    products: [
      { label: "Auto Liquid White 33oz", sku: "421WHI", slug: "alpine-industries-421-whi-33-oz-wall-mount-liquid-soap-dispenser-automatic-white", detail: "Wall-mount, IR sensor, ABS" },
    ],
  },
  {
    id: "manual-foam",
    name: "Manual Foam",
    tagline: "Less soap, same clean",
    icon: <Hand className="w-5 h-5" />,
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    description:
      "Manual foam dispensers mix air into foaming soap concentrate, creating a rich lather that spreads easily. Foam uses 40-50% less soap per wash than liquid while providing equivalent cleaning.",
    pros: [
      "Uses 40-50% less soap per wash vs liquid",
      "Foam is easier to spread -- better hand coverage",
      "Less water needed to rinse",
      "Significantly less mess/dripping",
      "No batteries required",
    ],
    cons: [
      "Requires foaming soap formulation (not regular liquid)",
      "Touch required for dispensing",
      "Foam mechanism is slightly more complex",
      "Limited product compatibility",
    ],
    bestFor: ["Sustainability-focused facilities", "Schools and daycare", "High-volume restrooms", "Cost-conscious operations"],
    costPerWash: "$0.003-0.006",
    reliability: 4,
    hygiene: 3,
    maintenance: 4,
    products: [
      { label: "Manual Gray 27oz (foam compatible)", sku: "425GRY", slug: "alpine-industries-425-gry-27-oz-wall-mount-liquid-soap-hand-sanitizer-dispenser-manual-gray", detail: "Wall-mount, also works with sanitizer" },
    ],
  },
  {
    id: "auto-foam",
    name: "Automatic Foam",
    tagline: "Best of both worlds",
    icon: <Shield className="w-5 h-5" />,
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    description:
      "The premium option. Combines touchless hygiene with foam's efficiency. Infrared sensors detect hands and dispense a perfectly portioned dose of foam soap. The gold standard for modern facilities.",
    pros: [
      "Touchless + foam = maximum hygiene and savings",
      "Lowest cost per wash of any dispenser type",
      "Controlled portions eliminate waste",
      "Modern aesthetic impresses visitors",
      "Less dripping and counter mess",
    ],
    cons: [
      "Highest upfront cost",
      "Requires batteries and foaming soap",
      "Most complex mechanism to maintain",
      "Sensor may need periodic cleaning",
    ],
    bestFor: ["Class A offices", "Healthcare", "Restaurants (front of house)", "Hotels and hospitality"],
    costPerWash: "$0.002-0.005",
    reliability: 4,
    hygiene: 5,
    maintenance: 3,
    products: [
      { label: "Auto Foam White 33oz", sku: "422WHI", slug: "alpine-industries-422-whi-33-oz-wall-mount-foam-soap-dispenser-automatic-white", detail: "Wall-mount, IR sensor, ABS" },
    ],
  },
];

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

const FOAM_VS_LIQUID = [
  { feature: "Soap per Wash", foam: "~0.4 mL", liquid: "~1.0 mL", winner: "foam" },
  { feature: "Cost per Wash", foam: "$0.003-0.006", liquid: "$0.006-0.01", winner: "foam" },
  { feature: "Washes per Refill (33oz)", foam: "~2,400", liquid: "~975", winner: "foam" },
  { feature: "Lather Quality", foam: "Instant, pre-lathered", liquid: "Requires rubbing", winner: "foam" },
  { feature: "Rinse Time", foam: "Faster", liquid: "Standard", winner: "foam" },
  { feature: "Counter Mess", foam: "Minimal", liquid: "Common dripping", winner: "foam" },
  { feature: "Product Availability", foam: "Foaming formulas only", liquid: "Most products work", winner: "liquid" },
  { feature: "Dispenser Cost", foam: "10-20% higher", liquid: "Lower", winner: "liquid" },
];

const MATERIAL_COMPARE = [
  { feature: "Durability", plastic: "Good (ABS grade)", stainless: "Excellent", abs: "Good" },
  { feature: "Appearance", plastic: "Clean, modern", stainless: "Premium, professional", abs: "Clean, modern" },
  { feature: "Cost", plastic: "$15-30", stainless: "$40-80", abs: "$15-30" },
  { feature: "Vandal Resistance", plastic: "Low-Moderate", stainless: "High", abs: "Low-Moderate" },
  { feature: "Weight", plastic: "Light", stainless: "Heavy", abs: "Light" },
  { feature: "Cleaning", plastic: "Easy, wipe down", stainless: "Shows fingerprints", abs: "Easy, wipe down" },
  { feature: "Best For", plastic: "Offices, schools", stainless: "Hotels, restaurants, healthcare", abs: "General commercial" },
];

const CAPACITY_GUIDE = [
  { capacity: "27oz (800mL)", refillFreq: "Every 2-4 weeks", traffic: "Low traffic (under 50 uses/day)", bestFor: "Private offices, small restrooms" },
  { capacity: "33oz (1000mL)", refillFreq: "Every 3-5 weeks", traffic: "Medium traffic (50-150 uses/day)", bestFor: "Standard commercial restrooms" },
  { capacity: "40oz (1200mL)", refillFreq: "Every 4-8 weeks", traffic: "Medium-high (100-200 uses/day)", bestFor: "Busy restrooms, food service" },
  { capacity: "46oz (1360mL)", refillFreq: "Every 6-10 weeks", traffic: "High traffic (200+ uses/day)", bestFor: "Airports, stadiums, hospitals" },
];

const SOAP_PRODUCTS = [
  { label: "Pink Cherry Hand Soap", sku: "25630", slug: "janitors-finest-25630-pink-cherry-hand-soap", detail: "Gallon - Cherry scent, economical" },
  { label: "Pearly White Lotion Soap", sku: "51301", slug: "janitors-finest-51301-pearly-white-lotion-hand-soap", detail: "Gallon - Mild, moisturizing" },
  { label: "Foaming Hand Soap", sku: "3265", slug: "janitors-finest-foaming-hand-soap-gallon-3265ea", detail: "Gallon - For foam dispensers" },
  { label: "Antibacterial Hand Soap", sku: "50401", slug: "antibacterial-liquid-hand-soap-gallon-50401ea", detail: "Gallon - Kills 99.9% of germs" },
];

const INDUSTRY_PICKS = [
  {
    icon: <Building2 className="w-6 h-6" />,
    industry: "Office Building",
    pick: "Auto Foam + Foaming Soap",
    why: "Touchless foam impresses tenants and visitors. Low cost per wash keeps your budget in line. Modern look elevates restroom perception.",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: <Stethoscope className="w-6 h-6" />,
    industry: "Healthcare / Medical",
    pick: "Auto Liquid + Antibacterial Soap",
    why: "Touchless is essential for infection control. Antibacterial formula meets CDC hand hygiene guidelines. Stainless steel dispensers for durability.",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    icon: <UtensilsCrossed className="w-6 h-6" />,
    industry: "Restaurant / Food Service",
    pick: "Auto Liquid + Antibacterial Soap",
    why: "Health department inspectors look for touchless dispensers. Antibacterial soap meets food safety requirements. Mount at every hand wash station.",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    icon: <School className="w-6 h-6" />,
    industry: "School / Daycare",
    pick: "Manual Foam + Foaming Soap",
    why: "Foam is fun for kids and encourages hand washing. Manual is budget-friendly for tight school budgets. 40-50% less soap waste.",
    color: "text-violet-600",
    bgColor: "bg-violet-50",
  },
  {
    icon: <Hotel className="w-6 h-6" />,
    industry: "Hotel / Hospitality",
    pick: "Auto Foam + Stainless Dispenser",
    why: "Premium look matches hotel standards. Touchless foam is the expected standard for upscale properties. Stainless resists vandalism.",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
];

/* ─────────────────────────── Component ─────────────────────────── */

export default function SoapDispenserGuide() {
  const [activeTab, setActiveTab] = useState<DispenserTab>("manual-liquid");
  const activeType = DISPENSER_TYPES.find((t) => t.id === activeTab)!;

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
            <span className="text-mjs-red">Soap & Dispenser Guide</span>
          </nav>

          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-mjs-red/10 border border-mjs-red/20 text-mjs-red px-3 py-1.5 rounded-full text-xs font-semibold mb-4 uppercase tracking-wider">
              <Droplets className="w-3.5 h-3.5" />
              Buying Guide
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
              Commercial Soap & Dispenser Guide
            </h1>
            <p className="text-lg md:text-xl text-mjs-gray-300 leading-relaxed max-w-2xl mx-auto">
              Manual vs automatic, foam vs liquid, plastic vs stainless -- find the right
              soap system for your facility, budget, and hygiene standards.
            </p>
          </div>
        </div>
      </div>

      {/* ── Quick Jump ── */}
      <div className="border-b border-gray-100 bg-mjs-gray-50 sticky top-0 z-20">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center justify-center gap-1 py-3 overflow-x-auto scrollbar-hide">
            <span className="text-xs font-semibold text-mjs-gray-400 mr-2 shrink-0 uppercase tracking-wider">Jump to:</span>
            {["Compare", "Foam vs Liquid", "Materials", "Capacity", "Touchless", "Mounting", "ADA", "By Industry"].map((label) => (
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

      {/* ── Dispenser Type Comparison ── */}
      <div id="compare" className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-4xl font-extrabold text-mjs-dark mb-3">
            Which Dispenser Type Is Right for You?
          </h2>
          <p className="text-mjs-gray-500 text-base md:text-lg max-w-2xl mx-auto">
            Select a dispenser type to see a full breakdown of features, costs, and product options.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-3 mb-10 flex-wrap">
          {DISPENSER_TYPES.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`
                relative flex flex-col items-center px-5 md:px-8 py-4 rounded-xl transition-all duration-200 border-2 min-w-[100px]
                ${activeTab === t.id
                  ? `${t.borderColor} bg-white shadow-lg scale-105`
                  : "border-gray-200 bg-white hover:shadow-md"
                }
              `}
            >
              <div className={`w-8 h-8 rounded-full mb-2 flex items-center justify-center ${activeTab === t.id ? t.bgColor : "bg-gray-100"}`}>
                <span className={activeTab === t.id ? t.color : "text-gray-400"}>{t.icon}</span>
              </div>
              <span className={`text-sm md:text-base font-bold ${activeTab === t.id ? t.color : "text-mjs-dark"}`}>
                {t.name}
              </span>
              <span className="text-[10px] text-mjs-gray-400 mt-0.5">{t.tagline}</span>
            </button>
          ))}
        </div>

        {/* Active type detail */}
        <div className={`rounded-2xl border ${activeType.borderColor} overflow-hidden`}>
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-0">
            {/* Left */}
            <div className={`${activeType.bgColor} p-6 md:p-10 border-b lg:border-b-0 lg:border-r ${activeType.borderColor}`}>
              <h3 className={`text-2xl md:text-3xl font-black ${activeType.color} mb-2`}>
                {activeType.name}
              </h3>
              <p className="text-sm text-mjs-gray-600 mb-6 leading-relaxed">{activeType.description}</p>

              {/* Ratings */}
              <div className="space-y-3 mb-6">
                {[
                  { label: "Reliability", value: activeType.reliability },
                  { label: "Hygiene Level", value: activeType.hygiene },
                  { label: "Ease of Maintenance", value: activeType.maintenance },
                ].map((r) => (
                  <div key={r.label} className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-mjs-gray-600">{r.label}</span>
                    <RatingDots value={r.value} color={activeType.bgColor.replace("50", "500")} />
                  </div>
                ))}
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/70 rounded-lg p-3 text-center">
                  <div className="text-[10px] font-semibold text-mjs-gray-400 uppercase">Cost/Wash</div>
                  <div className="text-sm font-bold text-mjs-dark">{activeType.costPerWash}</div>
                </div>
                <div className="bg-white/70 rounded-lg p-3 text-center">
                  <div className="text-[10px] font-semibold text-mjs-gray-400 uppercase">Batteries</div>
                  <div className="text-sm font-bold text-mjs-dark">
                    {activeType.id.startsWith("auto") ? "Required" : "None"}
                  </div>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="p-6 md:p-10 bg-white">
              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div>
                  <h4 className="text-xs font-semibold text-mjs-gray-400 uppercase tracking-wider mb-3">Advantages</h4>
                  <ul className="space-y-2">
                    {activeType.pros.map((p) => (
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
                    {activeType.cons.map((c) => (
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
                  {activeType.bestFor.map((b) => (
                    <span key={b} className={`px-3 py-1.5 rounded-full text-xs font-semibold ${activeType.bgColor} ${activeType.color}`}>
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-mjs-gray-400 uppercase tracking-wider mb-3">Shop Dispensers</h4>
                <div className="space-y-2">
                  {activeType.products.map((p) => (
                    <Link
                      key={p.sku}
                      href={`/product/${p.slug}`}
                      className="flex items-center justify-between bg-mjs-gray-50 rounded-lg p-3 border border-gray-100 hover:border-mjs-red/30 hover:shadow-sm transition-all group"
                    >
                      <div>
                        <div className="text-sm font-semibold text-mjs-dark group-hover:text-mjs-red transition-colors">{p.label}</div>
                        <div className="text-xs text-mjs-gray-400">SKU: {p.sku} &middot; {p.detail}</div>
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

      {/* ── Foam vs Liquid ── */}
      <div id="foam-vs-liquid" className="bg-mjs-gray-50 border-y border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-3">
              Foam vs Liquid Soap
            </h2>
            <p className="text-mjs-gray-500 max-w-2xl mx-auto">
              Foam soap is not just a trend -- it delivers real cost savings.
              Here is how the two formats compare head-to-head.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mjs-dark text-white">
                  <th className="text-left px-4 py-3 font-semibold">Feature</th>
                  <th className="text-center px-4 py-3 font-semibold">Foam</th>
                  <th className="text-center px-4 py-3 font-semibold">Liquid</th>
                </tr>
              </thead>
              <tbody>
                {FOAM_VS_LIQUID.map((row) => (
                  <tr key={row.feature} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-mjs-dark">{row.feature}</td>
                    <td className={`px-4 py-3 text-center font-medium ${row.winner === "foam" ? "text-green-700 font-bold" : "text-mjs-gray-600"}`}>
                      {row.foam}
                    </td>
                    <td className={`px-4 py-3 text-center font-medium ${row.winner === "liquid" ? "text-green-700 font-bold" : "text-mjs-gray-600"}`}>
                      {row.liquid}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">
              <strong>Pro Tip:</strong> Switching from liquid to foam soap typically saves 40-50% on soap costs
              annually. For a building with 200 hand washes per day, that can mean $300-500/year in savings
              per restroom.
            </p>
          </div>
        </div>
      </div>

      {/* ── Dispenser Material Comparison ── */}
      <div id="materials" className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-3">
            Dispenser Materials Compared
          </h2>
          <p className="text-mjs-gray-500 max-w-2xl mx-auto">
            The material of your dispenser affects durability, aesthetics, and cost.
            Choose based on your environment and vandalism risk.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-mjs-dark text-white">
                <th className="text-left px-4 py-3 font-semibold">Feature</th>
                <th className="text-center px-4 py-3 font-semibold">ABS Plastic</th>
                <th className="text-center px-4 py-3 font-semibold">Stainless Steel</th>
              </tr>
            </thead>
            <tbody>
              {MATERIAL_COMPARE.map((row) => (
                <tr key={row.feature} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-mjs-dark">{row.feature}</td>
                  <td className="px-4 py-3 text-center text-mjs-gray-600">{row.plastic}</td>
                  <td className="px-4 py-3 text-center text-mjs-gray-600">{row.stainless}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Capacity Guide ── */}
      <div id="capacity" className="bg-mjs-gray-50 border-y border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-3">
              Capacity & Refill Frequency
            </h2>
            <p className="text-mjs-gray-500 max-w-2xl mx-auto">
              Match your dispenser capacity to your restroom traffic. Running out of soap is one of
              the top complaints in facility management surveys.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mjs-dark text-white">
                  <th className="text-left px-4 py-3 font-semibold">Capacity</th>
                  <th className="text-left px-4 py-3 font-semibold">Refill Frequency</th>
                  <th className="text-left px-4 py-3 font-semibold">Traffic Level</th>
                  <th className="text-left px-4 py-3 font-semibold">Best For</th>
                </tr>
              </thead>
              <tbody>
                {CAPACITY_GUIDE.map((c) => (
                  <tr key={c.capacity} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-bold text-mjs-dark">{c.capacity}</td>
                    <td className="px-4 py-3 text-mjs-gray-600">{c.refillFreq}</td>
                    <td className="px-4 py-3 text-mjs-gray-600">{c.traffic}</td>
                    <td className="px-4 py-3 text-mjs-gray-500">{c.bestFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Touchless vs Manual ── */}
      <div id="touchless" className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-3">
            Touchless vs Manual Dispensers
          </h2>
          <p className="text-mjs-gray-500 max-w-2xl mx-auto">
            The touchless vs manual decision comes down to three factors: hygiene requirements,
            budget, and maintenance capacity.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-100 text-green-700 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-mjs-dark">Hygiene</h3>
            </div>
            <p className="text-sm text-mjs-gray-600 leading-relaxed">
              Touchless dispensers eliminate the #1 germ transfer point in restrooms. Studies show
              touchless systems reduce bacterial contamination on dispenser surfaces by up to 90%.
              Essential for healthcare and food service.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                <BatteryFull className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-mjs-dark">Battery Costs</h3>
            </div>
            <p className="text-sm text-mjs-gray-600 leading-relaxed">
              Automatic dispensers typically use 4x AA or 4x C batteries. Expect to replace them
              every 6-12 months depending on traffic. Budget $5-10/year per dispenser for batteries.
              Use alkaline, not rechargeable.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <Wrench className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-mjs-dark">Reliability</h3>
            </div>
            <p className="text-sm text-mjs-gray-600 leading-relaxed">
              Manual dispensers have fewer failure points and last 5-10+ years. Automatic dispensers
              have sensors and motors that can malfunction. Keep spares on hand for automatic units
              in critical locations.
            </p>
          </div>
        </div>
      </div>

      {/* ── Mounting Guide ── */}
      <div id="mounting" className="bg-mjs-gray-50 border-y border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-3">
              Mounting Options
            </h2>
            <p className="text-mjs-gray-500 max-w-2xl mx-auto">
              How you mount the dispenser depends on your wall type, counter layout, and ADA requirements.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-mjs-dark mb-2">Wall-Mount</h3>
              <span className="text-xs font-semibold text-green-600 mb-3 block">Most common</span>
              <p className="text-sm text-mjs-gray-600 mb-4">
                Screws directly into the wall. Standard for most commercial restrooms.
                Install 48&quot; from floor to dispenser bottom for ADA compliance.
                Requires drywall anchors or stud mounting.
              </p>
              <div className="space-y-1">
                {["Alpine 421WHI, 422WHI, 425GRY", "Alpine 424SSB", "Bobrick BOB2111, BOB4112"].map((item) => (
                  <div key={item} className="text-xs text-mjs-gray-400">{item}</div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-mjs-dark mb-2">Countertop</h3>
              <span className="text-xs font-semibold text-blue-600 mb-3 block">No drilling needed</span>
              <p className="text-sm text-mjs-gray-600 mb-4">
                Freestanding pump bottles or countertop automatic dispensers. Best for temporary
                setups, reception desks, and locations where wall mounting is not possible.
                Easy to relocate.
              </p>
              <div className="text-xs text-mjs-gray-400">Best for: Reception, break rooms, temporary stations</div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-mjs-dark mb-2">Lavatory-Mount</h3>
              <span className="text-xs font-semibold text-violet-600 mb-3 block">Built-in look</span>
              <p className="text-sm text-mjs-gray-600 mb-4">
                Mounts directly on or behind the sink. Soap dispenses right at the bowl.
                Creates a clean, integrated look. Requires counter drilling.
                Popular in upscale restrooms.
              </p>
              <Link
                href="/product/lavatory-mounted-soap-dispenser-34oz"
                className="flex items-center gap-2 text-sm font-semibold text-mjs-red hover:underline"
              >
                Bobrick Lavatory Mount 34oz (BOB822)
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── ADA Compliance ── */}
      <div id="ada" className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
        <div className="max-w-3xl mx-auto">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 md:p-10 flex flex-col md:flex-row items-start gap-6">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <Accessibility className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">ADA Compliance Notes</h3>
              <ul className="space-y-2">
                {[
                  "Mount dispensers so the activating mechanism is no higher than 48\" from the floor (44\" for side approach)",
                  "Dispenser must be operable with one hand and without tight grasping, pinching, or twisting",
                  "Automatic dispensers meet ADA requirements by default (no grasping required)",
                  "Ensure clear floor space of 30\" x 48\" in front of the dispenser",
                  "Protruding objects must not extend more than 4\" from the wall between 27\" and 80\" height",
                ].map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-blue-800">
                    <Check className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ── Soap Products ── */}
      <div className="bg-mjs-gray-50 border-y border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-3">
              Shop Bulk Hand Soap
            </h2>
            <p className="text-mjs-gray-500 max-w-2xl mx-auto">
              Pair your dispensers with these bulk hand soaps. All available in gallon jugs
              for refilling wall-mount dispensers.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
            {SOAP_PRODUCTS.map((p) => (
              <Link
                key={p.sku}
                href={`/product/${p.slug}`}
                className="flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200 hover:border-mjs-red/30 hover:shadow-sm transition-all group"
              >
                <div>
                  <div className="text-sm font-semibold text-mjs-dark group-hover:text-mjs-red transition-colors">{p.label}</div>
                  <div className="text-xs text-mjs-gray-400">SKU: {p.sku} &middot; {p.detail}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-mjs-gray-300 group-hover:text-mjs-red transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Industry Recommendations ── */}
      <div id="by-industry" className="bg-mjs-dark">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
              The Right Setup for Your Industry
            </h2>
            <p className="text-mjs-gray-400 max-w-2xl mx-auto">
              Our recommendations based on thousands of commercial restroom installations.
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
      <div className="bg-gradient-to-r from-mjs-red to-mjs-red-dark">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
            Upgrade Your Restroom Soap System
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Browse dispensers, bulk hand soaps, and sanitizers. Wholesale pricing with free local delivery.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/category/cleaning-chemicals"
              className="inline-flex items-center gap-2 bg-white text-mjs-red font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Droplets className="w-4 h-4" />
              Shop Soap & Chemicals
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
