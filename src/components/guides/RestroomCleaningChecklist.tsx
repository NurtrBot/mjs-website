"use client";

import { useState } from "react";
import {
  ChevronRight,
  ArrowRight,
  Check,
  Info,
  ClipboardCheck,
  Clock,
  Sparkles,
  ShoppingCart,
  Droplets,
  SprayCan,
  Wind,
  Building2,
  Stethoscope,
  UtensilsCrossed,
  School,
  Star,
  AlertTriangle,
  Eye,
  Layers,
} from "lucide-react";
import Link from "next/link";

/* ─────────────────────────── Data ─────────────────────────── */

interface Step {
  number: number;
  title: string;
  duration: string;
  icon: React.ReactNode;
  description: string;
  details: string[];
  proTip?: string;
  products: { label: string; slug: string; sku: string }[];
}

const STEPS: Step[] = [
  {
    number: 1,
    title: "Stock Check & Pre-Spray",
    duration: "3-5 min",
    icon: <SprayCan className="w-5 h-5" />,
    description: "Assess supplies, ventilate the area, and pre-spray surfaces to give chemicals dwell time.",
    details: [
      "Post \"Cleaning in Progress\" sign at entrance",
      "Ventilate — prop door open or turn on exhaust fan",
      "Quick visual scan: note empty dispensers and supply levels",
      "Pre-spray disinfectant on all toilets, urinals, and sinks",
      "Let solution dwell while you address other tasks (follow label dwell time)",
      "Put on nitrile gloves and any required PPE",
    ],
    proTip: "Pre-spraying first and letting chemicals dwell while you work on other tasks is the single biggest time saver. The disinfectant does the hard work for you.",
    products: [
      { label: "Strike Bac Disinfectant Cleaner", slug: "strike-bac-lemon-odor-disinfectant-cleaner-gallon-91101ea", sku: "91101" },
      { label: "Nitrile Gloves (100/bx)", slug: "life-guard-blue-nitrile-exam-gloves-powder-free-medium-5-mil-100-bx", sku: "6303EA" },
      { label: "32 oz Spray Bottles (3-pack)", slug: "32-oz-value-check-3-pack-spray-bottle", sku: "SPRBOT3PK" },
    ],
  },
  {
    number: 2,
    title: "Toilets & Urinals",
    duration: "5-8 min",
    icon: <Droplets className="w-5 h-5" />,
    description: "Clean and disinfect all porcelain fixtures — the highest-priority touchpoints in any restroom.",
    details: [
      "Apply bowl cleaner inside each toilet bowl and under the rim",
      "Scrub inside with toilet bowl brush, flush",
      "Wipe exterior of toilet: lid, seat (both sides), base, handle",
      "Clean urinals: flush valve, interior, exterior, floor drain area",
      "Wipe all flush handles and touchpoints with disinfectant",
      "Check for any caulk damage or leaks around base",
    ],
    proTip: "Always clean the outside of the toilet before the floor. Drips from exterior wiping go onto a floor you haven't mopped yet, not onto a clean floor.",
    products: [
      { label: "Bowl Cling 10% Bowl Cleaner", slug: "bowl-cling-10-bowl-cleaner", sku: "40401" },
      { label: "Strike Bac Disinfectant Cleaner", slug: "strike-bac-lemon-odor-disinfectant-cleaner-gallon-91101ea", sku: "91101" },
    ],
  },
  {
    number: 3,
    title: "Sinks & Counters",
    duration: "3-5 min",
    icon: <Sparkles className="w-5 h-5" />,
    description: "Clean all sink basins, faucets, countertops, and soap dispenser exteriors.",
    details: [
      "Spray disinfectant on all sink surfaces, faucets, and countertops",
      "Scrub sink basins with a non-abrasive pad or cloth",
      "Wipe faucet handles, spout, and base — remove water spots",
      "Clean countertop from back edge to front",
      "Wipe soap dispenser exterior and hand dryer surfaces",
      "Dry all chrome fixtures with a clean cloth for shine",
    ],
    products: [
      { label: "Strike Bac Disinfectant Cleaner", slug: "strike-bac-lemon-odor-disinfectant-cleaner-gallon-91101ea", sku: "91101" },
    ],
  },
  {
    number: 4,
    title: "Mirrors & Chrome",
    duration: "2-3 min",
    icon: <Eye className="w-5 h-5" />,
    description: "Streak-free mirrors and polished chrome make the biggest visual impact.",
    details: [
      "Spray glass cleaner on mirror (or spray onto cloth to avoid drips)",
      "Wipe in an S-pattern from top to bottom",
      "Buff any streaks with a dry microfiber cloth",
      "Polish all chrome fixtures: towel dispensers, grab bars, hooks",
      "Clean any glass partitions or shelving",
    ],
    proTip: "For streak-free mirrors every time, use an ammoniated glass cleaner with a lint-free microfiber cloth. Spray the cloth, not the mirror, to prevent drips on the countertop.",
    products: [
      { label: "Ammoniated Glass Cleaner", slug: "janitors-finest-3187-ammoniated-glass-cleaner", sku: "3187" },
    ],
  },
  {
    number: 5,
    title: "Dispensers & Refills",
    duration: "3-5 min",
    icon: <Layers className="w-5 h-5" />,
    description: "Restock all paper products, soap, and dispensers. An empty dispenser is the fastest path to complaints.",
    details: [
      "Refill toilet tissue dispensers — replace rolls below 1/4 full",
      "Restock paper towel dispensers",
      "Refill soap dispensers — check pump mechanisms",
      "Replace seat cover supplies if provided",
      "Verify feminine hygiene product dispensers (if applicable)",
      "Check and replace air freshener cartridges as needed",
    ],
    proTip: "Stock dispensers to 75% capacity rather than waiting until empty. This prevents run-outs between cleaning cycles and reduces complaints by over 80%.",
    products: [
      { label: "2-Ply Toilet Tissue (96 rolls)", slug: "janitors-finest-2-ply-toilet-tissue-4-3-x-3-5-500-sheets-per-roll-96-rolls-per-case-5602", sku: "5602" },
      { label: "Half-Fold Seat Covers (5,000/ct)", slug: "janitors-finest-5800-premium-half-fold-toilet-seat-covers-250-covers-sleeve-20-sleeves-carton", sku: "5800" },
      { label: "Pink Cherry Hand Soap", slug: "janitors-finest-25630-pink-cherry-hand-soap", sku: "25630" },
      { label: "Multifold Paper Towels (4,000/ct)", slug: "janitors-finest-5300-premium-2-ply-white-multifold-towels-16-packs-250-sheets-4000-towels", sku: "5300" },
    ],
  },
  {
    number: 6,
    title: "Floors",
    duration: "5-10 min",
    icon: <Droplets className="w-5 h-5" />,
    description: "Mop the entire floor with disinfectant solution, paying extra attention to areas around fixtures.",
    details: [
      "Sweep or dust mop to remove loose debris first",
      "Mop with properly diluted disinfectant solution",
      "Work from the back of the restroom toward the door",
      "Pay special attention to base of toilets and urinals",
      "Clean grout lines where soil accumulates",
      "Mop behind toilets and in corners — don't skip tight spots",
      "Ensure floor drains are clear and free of debris",
    ],
    proTip: "Change your mop water frequently. A dirty mop in dirty water just moves contamination around. In restrooms, change solution after every 2-3 stalls.",
    products: [
      { label: "Strike Bac Disinfectant Cleaner", slug: "strike-bac-lemon-odor-disinfectant-cleaner-gallon-91101ea", sku: "91101" },
    ],
  },
  {
    number: 7,
    title: "Odor Control & Finishing",
    duration: "2-3 min",
    icon: <Wind className="w-5 h-5" />,
    description: "Address odors at the source and do a final quality check before leaving.",
    details: [
      "Place or replace urinal screens with fresh deodorizer",
      "Install or check bowl clips on toilets",
      "Verify all fixtures are dry and streak-free",
      "Final walk-through: check every stall, every dispenser, every surface",
      "Remove \"Cleaning in Progress\" sign",
      "Log cleaning time and any maintenance issues noted",
    ],
    products: [
      { label: "Urinal Deodorizer Screen (10/ct)", slug: "dribble-urinal-deodorizer-screen-ocean-mist-10-carton", sku: "DRIBBLEOM" },
      { label: "Bowl Clip Cucumber Melon (12/bx)", slug: "bowl-clip-cucumber-melon-green-12-box", sku: "BWKCLIPCME" },
    ],
  },
];

interface SupplyItem {
  category: string;
  items: { name: string; sku: string; slug: string }[];
}

const SUPPLY_LIST: SupplyItem[] = [
  {
    category: "Cleaning Chemicals",
    items: [
      { name: "Bowl Cling 10% Bowl Cleaner", sku: "40401", slug: "bowl-cling-10-bowl-cleaner" },
      { name: "Strike Bac Disinfectant Cleaner", sku: "91101", slug: "strike-bac-lemon-odor-disinfectant-cleaner-gallon-91101ea" },
      { name: "Ammoniated Glass Cleaner", sku: "3187", slug: "janitors-finest-3187-ammoniated-glass-cleaner" },
    ],
  },
  {
    category: "Paper Products",
    items: [
      { name: "2-Ply Toilet Tissue (96 rolls)", sku: "5602", slug: "janitors-finest-2-ply-toilet-tissue-4-3-x-3-5-500-sheets-per-roll-96-rolls-per-case-5602" },
      { name: "Half-Fold Seat Covers", sku: "5800", slug: "janitors-finest-5800-premium-half-fold-toilet-seat-covers-250-covers-sleeve-20-sleeves-carton" },
      { name: "Multifold Paper Towels (4,000/ct)", sku: "5300", slug: "janitors-finest-5300-premium-2-ply-white-multifold-towels-16-packs-250-sheets-4000-towels" },
    ],
  },
  {
    category: "Dispensables",
    items: [
      { name: "Pink Cherry Hand Soap", sku: "25630", slug: "janitors-finest-25630-pink-cherry-hand-soap" },
      { name: "Urinal Deodorizer Screen (10/ct)", sku: "DRIBBLEOM", slug: "dribble-urinal-deodorizer-screen-ocean-mist-10-carton" },
      { name: "Bowl Clip Cucumber Melon (12/bx)", sku: "BWKCLIPCME", slug: "bowl-clip-cucumber-melon-green-12-box" },
    ],
  },
  {
    category: "PPE & Tools",
    items: [
      { name: "Blue Nitrile Gloves (100/bx)", sku: "6303EA", slug: "life-guard-blue-nitrile-exam-gloves-powder-free-medium-5-mil-100-bx" },
      { name: "32 oz Spray Bottles (3-pack)", sku: "SPRBOT3PK", slug: "32-oz-value-check-3-pack-spray-bottle" },
    ],
  },
];

interface FrequencyTask {
  task: string;
  daily: boolean;
  weekly: boolean;
  monthly: boolean;
}

const FREQUENCY_TASKS: FrequencyTask[] = [
  { task: "Empty trash and replace liners", daily: true, weekly: false, monthly: false },
  { task: "Clean and disinfect all fixtures", daily: true, weekly: false, monthly: false },
  { task: "Restock paper products and soap", daily: true, weekly: false, monthly: false },
  { task: "Mop floors with disinfectant", daily: true, weekly: false, monthly: false },
  { task: "Clean mirrors and chrome", daily: true, weekly: false, monthly: false },
  { task: "Spot clean walls and partitions", daily: false, weekly: true, monthly: false },
  { task: "Deep scrub tile grout", daily: false, weekly: true, monthly: false },
  { task: "Clean air vents and exhaust fans", daily: false, weekly: false, monthly: true },
  { task: "Descale faucets and fixtures", daily: false, weekly: false, monthly: true },
  { task: "Check caulking and grout integrity", daily: false, weekly: false, monthly: true },
  { task: "Deep clean partition walls (both sides)", daily: false, weekly: false, monthly: true },
  { task: "Inspect and replace urinal screens", daily: false, weekly: true, monthly: false },
  { task: "Wipe down light switches and door handles", daily: true, weekly: false, monthly: false },
  { task: "Clean sanitary napkin dispensers", daily: false, weekly: true, monthly: false },
];

const INDUSTRY_STANDARDS = [
  { icon: <Stethoscope className="w-6 h-6" />, industry: "Healthcare", frequency: "Every 2-4 hours", standard: "CDC disinfection guidelines. 10-min dwell time required. EPA-registered hospital-grade disinfectant mandatory.", color: "text-blue-600", bgColor: "bg-blue-50" },
  { icon: <Building2 className="w-6 h-6" />, industry: "Office", frequency: "2x daily", standard: "Morning and evening clean cycle. Mid-day spot check and restock for high-occupancy floors.", color: "text-emerald-600", bgColor: "bg-emerald-50" },
  { icon: <UtensilsCrossed className="w-6 h-6" />, industry: "Restaurant", frequency: "Every 1-2 hours", standard: "Health code compliance. Customer-facing restrooms reflect food safety standards. Log sheet required.", color: "text-orange-600", bgColor: "bg-orange-50" },
  { icon: <School className="w-6 h-6" />, industry: "School", frequency: "3x daily minimum", standard: "Before school, midday, after school. High-touch disinfection between class periods during illness outbreaks.", color: "text-violet-600", bgColor: "bg-violet-50" },
];

const INSPECTION_CRITERIA = [
  { item: "All dispensers stocked above 25%", weight: "Critical" },
  { item: "No visible soil on floors, fixtures, or walls", weight: "Critical" },
  { item: "Mirrors and chrome streak-free", weight: "High" },
  { item: "No detectable odor", weight: "High" },
  { item: "Trash below 75% capacity", weight: "High" },
  { item: "Wet floor sign removed after drying", weight: "Medium" },
  { item: "Cleaning log current and signed", weight: "Medium" },
  { item: "All stall latches functional", weight: "Low" },
];

/* ─────────────────────────── Component ─────────────────────────── */

export default function RestroomCleaningChecklist() {
  const [activeStep, setActiveStep] = useState(0);
  const step = STEPS[activeStep];

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
            <span className="text-mjs-red">Restroom Cleaning Checklist</span>
          </nav>

          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-mjs-red/10 border border-mjs-red/20 text-mjs-red px-3 py-1.5 rounded-full text-xs font-semibold mb-4 uppercase tracking-wider">
              <ClipboardCheck className="w-3.5 h-3.5" />
              Step-by-Step Guide
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
              Commercial Restroom<br />Cleaning Checklist
            </h1>
            <p className="text-lg md:text-xl text-mjs-gray-300 leading-relaxed max-w-2xl mx-auto">
              The complete 7-step process for spotless, sanitary commercial restrooms — with every product you need.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-8">
              {[
                { icon: <Layers className="w-4 h-4" />, label: "7 Steps" },
                { icon: <Clock className="w-4 h-4" />, label: "25-40 Min" },
                { icon: <ShoppingCart className="w-4 h-4" />, label: "Full Supply List" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm text-white/80">
                  {s.icon}
                  <span className="font-semibold">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick Jump ── */}
      <div className="border-b border-gray-100 bg-mjs-gray-50 sticky top-0 z-20">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center justify-center gap-1 py-3 overflow-x-auto scrollbar-hide">
            <span className="text-xs font-semibold text-mjs-gray-400 mr-2 shrink-0 uppercase tracking-wider">Jump to:</span>
            {["Steps", "Supply List", "Frequency", "Inspection", "Standards", "Shop All"].map((label) => (
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

      {/* ── Step-by-Step Process ── */}
      <div id="steps" className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-4xl font-extrabold text-mjs-dark mb-3">
            The 7-Step Restroom Cleaning Process
          </h2>
          <p className="text-mjs-gray-500 text-base md:text-lg max-w-2xl mx-auto">
            Follow these steps in order. The sequence is designed to maximize dwell time and minimize re-contamination.
          </p>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          {/* Timeline nav */}
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible scrollbar-hide pb-2 lg:pb-0">
            {STEPS.map((s, i) => (
              <button
                key={s.number}
                onClick={() => setActiveStep(i)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 shrink-0 lg:shrink lg:w-full border-2
                  ${activeStep === i
                    ? "border-mjs-red bg-white shadow-lg shadow-mjs-red/10"
                    : "border-transparent bg-mjs-gray-50 hover:bg-white hover:shadow-sm"
                  }
                `}
              >
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-black shrink-0
                  ${activeStep === i ? "bg-mjs-red text-white" : "bg-gray-200 text-mjs-gray-500"}
                `}>
                  {s.number}
                </div>
                <div className="min-w-0">
                  <div className={`text-sm font-bold truncate ${activeStep === i ? "text-mjs-dark" : "text-mjs-gray-600"}`}>
                    {s.title}
                  </div>
                  <div className="text-[10px] text-mjs-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {s.duration}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Active step detail */}
          <div className="bg-mjs-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
            <div className="p-6 md:p-10">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-mjs-red text-white flex items-center justify-center text-xl font-black shrink-0">
                  {step.number}
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-mjs-dark">{step.title}</h3>
                  <p className="text-mjs-gray-500 mt-1">{step.description}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {step.details.map((d) => (
                  <div key={d} className="flex gap-3 bg-white rounded-lg p-3 border border-gray-100">
                    <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-mjs-gray-700">{d}</span>
                  </div>
                ))}
              </div>

              {step.proTip && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 mb-6">
                  <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-amber-800 mb-0.5">Pro Tip</p>
                    <p className="text-sm text-amber-700">{step.proTip}</p>
                  </div>
                </div>
              )}

              <div>
                <div className="text-xs font-semibold text-mjs-gray-400 uppercase tracking-wider mb-3">Products for This Step</div>
                <div className="grid sm:grid-cols-2 gap-2">
                  {step.products.map((p) => (
                    <Link
                      key={p.sku}
                      href={`/product/${p.slug}`}
                      className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-100 hover:border-mjs-red/30 hover:shadow-sm transition-all group"
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

            <div className="border-t border-gray-200 px-6 md:px-10 py-4 flex items-center justify-between bg-white">
              <button
                onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                disabled={activeStep === 0}
                className="text-sm font-semibold text-mjs-gray-500 hover:text-mjs-red transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Previous Step
              </button>
              <span className="text-xs text-mjs-gray-400">Step {step.number} of {STEPS.length}</span>
              <button
                onClick={() => setActiveStep(Math.min(STEPS.length - 1, activeStep + 1))}
                disabled={activeStep === STEPS.length - 1}
                className="text-sm font-semibold text-mjs-red hover:text-mjs-red-dark transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
              >
                Next Step <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Complete Supply List ── */}
      <div id="supply-list" className="bg-mjs-gray-50 border-y border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-3">
              Complete Supply List
            </h2>
            <p className="text-mjs-gray-500 max-w-2xl mx-auto">
              Everything you need to stock your restroom cleaning cart, organized by category.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SUPPLY_LIST.map((cat) => (
              <div key={cat.category} className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-bold text-mjs-dark mb-4 uppercase tracking-wider">{cat.category}</h3>
                <div className="space-y-2">
                  {cat.items.map((item) => (
                    <Link
                      key={item.sku}
                      href={`/product/${item.slug}`}
                      className="flex items-center justify-between bg-mjs-gray-50 rounded-lg p-2.5 border border-gray-100 hover:border-mjs-red/30 hover:shadow-sm transition-all group"
                    >
                      <div>
                        <div className="text-xs font-semibold text-mjs-dark group-hover:text-mjs-red transition-colors">{item.name}</div>
                        <div className="text-[10px] text-mjs-gray-400">SKU: {item.sku}</div>
                      </div>
                      <ArrowRight className="w-3 h-3 text-mjs-gray-300 group-hover:text-mjs-red transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Frequency Schedule ── */}
      <div id="frequency" className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-3">
            Cleaning Frequency Schedule
          </h2>
          <p className="text-mjs-gray-500 max-w-2xl mx-auto">
            Not every task needs to happen every day. Use this schedule to build an efficient routine.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-mjs-dark text-white">
                <th className="text-left px-4 py-3 font-semibold">Task</th>
                <th className="text-center px-4 py-3 font-semibold">Daily</th>
                <th className="text-center px-4 py-3 font-semibold">Weekly</th>
                <th className="text-center px-4 py-3 font-semibold">Monthly</th>
              </tr>
            </thead>
            <tbody>
              {FREQUENCY_TASKS.map((t) => (
                <tr key={t.task} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-mjs-dark">{t.task}</td>
                  <td className="px-4 py-3 text-center">
                    {t.daily ? <Check className="w-4 h-4 text-green-500 mx-auto" /> : <span className="text-gray-200">-</span>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {t.weekly ? <Check className="w-4 h-4 text-blue-500 mx-auto" /> : <span className="text-gray-200">-</span>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {t.monthly ? <Check className="w-4 h-4 text-violet-500 mx-auto" /> : <span className="text-gray-200">-</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Inspection Scorecard ── */}
      <div id="inspection" className="bg-mjs-gray-50 border-y border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-3">
              Restroom Inspection Scorecard
            </h2>
            <p className="text-mjs-gray-500 max-w-2xl mx-auto">
              Use these criteria for quality checks. Train supervisors to inspect consistently.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-mjs-dark text-white">
                    <th className="text-left px-4 py-3 font-semibold">Inspection Item</th>
                    <th className="text-center px-4 py-3 font-semibold">Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {INSPECTION_CRITERIA.map((c) => (
                    <tr key={c.item} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-mjs-gray-700">{c.item}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          c.weight === "Critical" ? "bg-red-50 text-red-700" :
                          c.weight === "High" ? "bg-amber-50 text-amber-700" :
                          c.weight === "Medium" ? "bg-blue-50 text-blue-700" :
                          "bg-gray-50 text-gray-600"
                        }`}>
                          {c.weight}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
              <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-800 mb-0.5">Pro Tip</p>
                <p className="text-sm text-amber-700">
                  Conduct unannounced inspections at varying times. Restrooms cleaned at 8 AM look very different at 2 PM. Inspect during peak use periods to see real-world conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Industry Standards ── */}
      <div id="standards" className="bg-mjs-dark">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
              Cleaning Standards by Industry
            </h2>
            <p className="text-mjs-gray-400 max-w-2xl mx-auto">
              Different industries have different expectations and regulatory requirements. Match your program to your facility type.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {INDUSTRY_STANDARDS.map((s) => (
              <div key={s.industry} className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg ${s.bgColor} ${s.color} flex items-center justify-center`}>
                    {s.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{s.industry}</h3>
                    <span className="text-xs font-semibold text-mjs-gold">{s.frequency}</span>
                  </div>
                </div>
                <p className="text-xs text-mjs-gray-400 leading-relaxed">{s.standard}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div id="shop-all" className="bg-gradient-to-r from-mjs-red to-mjs-red-dark">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
            Stock Your Restroom Cleaning Cart
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Browse our full selection of restroom supplies — chemicals, paper products, dispensers, and PPE. Wholesale pricing with free local delivery.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/category/paper-products"
              className="inline-flex items-center gap-2 bg-white text-mjs-red font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Layers className="w-4 h-4" />
              Shop Paper Products
            </Link>
            <Link
              href="/category/cleaning-chemicals"
              className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white font-bold px-6 py-3 rounded-lg hover:bg-white/20 transition-colors"
            >
              <SprayCan className="w-4 h-4" />
              Shop Cleaning Chemicals
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
