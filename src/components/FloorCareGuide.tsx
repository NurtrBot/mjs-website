"use client";

import { useState } from "react";
import {
  ChevronRight,
  ArrowRight,
  Check,
  Info,
  AlertTriangle,
  Sparkles,
  Clock,
  ShoppingCart,
  CircleDot,
  Droplets,
  Wind,
  Shield,
  Layers,
  Building2,
  School,
  Stethoscope,
  ShoppingBag,
  Warehouse,
  Church,
} from "lucide-react";
import Link from "next/link";

/* ─────────────────────────── Data ─────────────────────────── */

interface Step {
  number: number;
  title: string;
  duration: string;
  description: string;
  details: string[];
  proTip?: string;
  products: { label: string; slug: string; sku: string }[];
}

const STEPS: Step[] = [
  {
    number: 1,
    title: "Prep the Area",
    duration: "15-30 min",
    description: "Clear the space and protect surroundings before any chemicals hit the floor.",
    details: [
      "Move all furniture, trash cans, and obstacles off the floor",
      "Dust mop or sweep the entire area thoroughly",
      "Post wet floor signs at every entrance",
      "Tape off baseboards if needed to prevent stripper splash",
      "Ensure good ventilation — open doors or run fans",
    ],
    proTip: "Work in sections of 200-400 sq ft at a time. Trying to strip too large an area means the stripper dries before you can scrub it.",
    products: [
      { label: "Warehouse Broom", slug: "warehouse-broom-corn-fiber-bristles-42-wood-handle-natural", sku: "2102" },
    ],
  },
  {
    number: 2,
    title: "Apply Floor Stripper",
    duration: "10-15 min per section",
    description: "Lay down the stripper solution and let it dwell to dissolve the old finish.",
    details: [
      "Dilute stripper according to label (typically 1:4 for heavy buildup, 1:8 for light)",
      "Apply liberally with a mop — the floor should be wet, not just damp",
      "Work in manageable sections (don't let it dry!)",
      "Let the solution dwell for 5-10 minutes",
      "For heavy buildup, apply a second coat before scrubbing",
    ],
    proTip: "Never let stripper dry on the floor. If it starts drying, re-wet it. Dried stripper creates a white haze that's hard to remove.",
    products: [
      { label: "Wax Stripper Non-Ammoniated", slug: "wax-stripper-non-ammoniated", sku: "20501" },
      { label: "Super Stripper Ammoniated", slug: "super-stripper-ammoniated", sku: "20701" },
      { label: "Strip Force Floor Stripper", slug: "strip-force-floor-stripper", sku: "21201" },
      { label: "Mop Bucket/Wringer 35 QT", slug: "mop-bucket-and-wringer-combo-35-qt-sidepress-yellow", sku: "8036" },
    ],
  },
  {
    number: 3,
    title: "Scrub with Floor Machine",
    duration: "15-20 min per section",
    description: "Use a low-speed floor machine with a black stripping pad to agitate and remove the old finish.",
    details: [
      "Attach a black stripping pad to your floor machine",
      "Run the machine at 175 RPM in overlapping passes",
      "Work the stripper into the floor — you'll see it turn dark and murky",
      "Pay extra attention to edges, corners, and high-traffic areas",
      "Use a doodle bug or hand pad for tight spots the machine can't reach",
    ],
    proTip: "The slurry should look like chocolate milk. If it's still clear, the stripper needs more dwell time or a stronger dilution.",
    products: [
      { label: "Mercury 17\" Floor Machine", slug: "mercury-h-17e-hercules-17-inch-floor-machine", sku: "H17E" },
      { label: "Mercury 20\" Floor Machine", slug: "mercury-h-20e-hercules-20-inch-floor-machine-175-rpm-1-5-hp-pad-driver-included", sku: "H20E" },
      { label: "Black Stripping Pads (5/ct)", slug: "janitors-finest-black-stripping-pads-5-per-carton", sku: "72-15" },
      { label: "Razorback Super Stripping Pads", slug: "janitors-finest-razorback-super-stripping-pads-5-per-carton", sku: "75-19" },
    ],
  },
  {
    number: 4,
    title: "Vacuum the Slurry",
    duration: "10-15 min per section",
    description: "Pick up every drop of stripped residue. This is the most important step people rush through.",
    details: [
      "Use a wet/dry vacuum to pick up all slurry immediately after scrubbing",
      "Make overlapping passes — don't leave any puddles",
      "Check the floor surface: you should see bare tile with no old finish remaining",
      "If finish remains in spots, re-apply stripper to those areas and re-scrub",
    ],
    proTip: "Residual slurry left on the floor will prevent new finish from bonding. This is the #1 cause of peeling and poor results.",
    products: [
      { label: "Mercury 20 Gal Wet/Dry Vacuum", slug: "mercury-storm-wvp-20-wet-dry-tank-vacuum-20-gallon-twin-motors-powerful-dual-2-67-hp-2000-watt-vacuum-motors-w-tool-kit", sku: "WVP20" },
    ],
  },
  {
    number: 5,
    title: "Rinse & Neutralize",
    duration: "15-20 min",
    description: "Neutralize the floor's pH so the new finish bonds properly.",
    details: [
      "Mix neutralizer rinse per label directions (typically 2-4 oz per gallon)",
      "Mop the entire stripped area with the neutralizer solution",
      "Pick up the rinse water with a clean mop or wet vac",
      "Allow floor to dry completely before applying finish",
      "The floor should feel clean and slightly rough to the touch — that's good grip for the finish",
    ],
    proTip: "Skipping the neutralizer is the second biggest mistake. Alkaline residue from the stripper will eat through your new finish from underneath.",
    products: [
      { label: "Neutralizer Rinse", slug: "neutralizer-rinse", sku: "21001" },
    ],
  },
  {
    number: 6,
    title: "Apply Floor Finish",
    duration: "20-30 min per coat",
    description: "Lay down thin, even coats of floor finish. Patience here = a mirror-like result.",
    details: [
      "Use a clean finish mop or microfiber flat mop (never reuse the strip mop)",
      "Pour a line of finish along the baseboard and spread in an even, thin coat",
      "Work your way toward the exit — don't paint yourself into a corner",
      "Apply 3-5 coats, letting each coat dry 30-45 minutes between coats",
      "First 2 coats are your seal coats. Final coats build the gloss.",
    ],
    proTip: "Thin coats are everything. One thick coat will look worse than three thin ones. If you can see streaks or puddles, you're applying too much.",
    products: [
      { label: "Finish Gloss Floor Wax 16%", slug: "finish-gloss-floor-wax-16", sku: "20001" },
      { label: "Finish Gloss Floor Wax 23%", slug: "finish-gloss-floor-wax-23", sku: "20201" },
      { label: "Premium Gloss Floor Finish 29%", slug: "premium-gloss-floor-finish-29", sku: "21101" },
      { label: "Floor Sealer", slug: "floor-sealer", sku: "20401" },
    ],
  },
  {
    number: 7,
    title: "Buff to a High Gloss",
    duration: "15-20 min",
    description: "Once fully dry, buff the floor to bring out the shine and harden the finish.",
    details: [
      "Wait at least 1-2 hours after the final coat (overnight is best)",
      "Attach a red buffing pad to your floor machine",
      "Buff the entire floor in overlapping passes",
      "For extra gloss, follow up with a white polishing pad",
      "Apply spray buff between maintenance coats for quick touch-ups",
    ],
    proTip: "For the highest gloss, use a burnisher (1500+ RPM) with a natural blend pad after the initial buff. This melts the finish surface smooth.",
    products: [
      { label: "Red Buffing Pads (5/ct)", slug: "janitors-finest-red-buffing-pads-5-per-carton", sku: "51-15" },
      { label: "White Polishing Pads (5/ct)", slug: "janitors-finest-white-polishing-pads-5-per-carton", sku: "41-15" },
      { label: "Spray Buff", slug: "spray-buff", sku: "20301" },
      { label: "Natural Blend Pads (5/ct)", slug: "janitors-finest-natural-blend-light-pads-5-per-carton", sku: "33-19" },
    ],
  },
];

interface PadColor {
  name: string;
  color: string;
  bgClass: string;
  textClass: string;
  use: string;
  speed: string;
  aggression: number;
}

const PAD_COLORS: PadColor[] = [
  { name: "Black", color: "#1a1a1a", bgClass: "bg-gray-900", textClass: "text-white", use: "Stripping — removes old finish and heavy buildup", speed: "175 RPM", aggression: 5 },
  { name: "Brown", color: "#6B4226", bgClass: "bg-amber-900", textClass: "text-white", use: "Heavy scrubbing and wet stripping", speed: "175 RPM", aggression: 4 },
  { name: "Green", color: "#22c55e", bgClass: "bg-green-600", textClass: "text-white", use: "Heavy-duty scrubbing and spray cleaning", speed: "175-300 RPM", aggression: 3 },
  { name: "Red", color: "#ef4444", bgClass: "bg-red-500", textClass: "text-white", use: "Buffing and light scrubbing — daily maintenance", speed: "175-600 RPM", aggression: 2 },
  { name: "White", color: "#f5f5f5", bgClass: "bg-gray-100", textClass: "text-gray-800", use: "Polishing and burnishing to high gloss", speed: "175-3000 RPM", aggression: 1 },
  { name: "Natural", color: "#D2B48C", bgClass: "bg-amber-200", textClass: "text-amber-900", use: "High-speed burnishing for ultra-high gloss", speed: "1500-3000 RPM", aggression: 1 },
];

const FINISH_COMPARISON = [
  { name: "Floor Wax 16%", slug: "finish-gloss-floor-wax-16", sku: "20001", solids: "16%", coats: "4-5", gloss: "Medium", best: "Budget-friendly, standard traffic", durability: 2 },
  { name: "Floor Wax 23%", slug: "finish-gloss-floor-wax-23", sku: "20201", solids: "23%", coats: "3-4", gloss: "High", best: "Best value, most facilities", durability: 3 },
  { name: "Premium Finish 29%", slug: "premium-gloss-floor-finish-29", sku: "21101", solids: "29%", coats: "3", gloss: "Ultra-High", best: "High-traffic, showroom-quality", durability: 5 },
];

const INDUSTRY_SCHEDULES = [
  { icon: <Building2 className="w-6 h-6" />, industry: "Office Buildings", strip: "1-2x per year", buff: "Weekly-monthly", coats: "3-4 coats", color: "text-blue-600", bgColor: "bg-blue-50" },
  { icon: <School className="w-6 h-6" />, industry: "Schools", strip: "Annually (summer)", buff: "Weekly during school year", coats: "5 coats", color: "text-violet-600", bgColor: "bg-violet-50" },
  { icon: <Stethoscope className="w-6 h-6" />, industry: "Healthcare", strip: "2-3x per year", buff: "2-3x per week", coats: "4-5 coats", color: "text-emerald-600", bgColor: "bg-emerald-50" },
  { icon: <ShoppingBag className="w-6 h-6" />, industry: "Retail Stores", strip: "2x per year", buff: "Weekly", coats: "4 coats", color: "text-rose-600", bgColor: "bg-rose-50" },
  { icon: <Warehouse className="w-6 h-6" />, industry: "Warehouses", strip: "1x per year", buff: "Monthly", coats: "3 coats", color: "text-orange-600", bgColor: "bg-orange-50" },
  { icon: <Church className="w-6 h-6" />, industry: "Churches & Event Halls", strip: "1-2x per year", buff: "Before events", coats: "4 coats", color: "text-amber-600", bgColor: "bg-amber-50" },
];

/* ─────────────────────────── Component ─────────────────────────── */

export default function FloorCareGuide() {
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
            <span className="text-mjs-red">How to Strip and Wax Floors</span>
          </nav>

          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-mjs-red/10 border border-mjs-red/20 text-mjs-red px-3 py-1.5 rounded-full text-xs font-semibold mb-4 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Step-by-Step Guide
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
              How to Strip & Wax<br />Commercial Floors
            </h1>
            <p className="text-lg md:text-xl text-mjs-gray-300 leading-relaxed max-w-2xl mx-auto">
              The complete process from bare tile to mirror-like shine.
              7 steps, every product you need, and the pro tips that make the difference.
            </p>

            {/* Quick stats */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              {[
                { icon: <Layers className="w-4 h-4" />, label: "7 Steps" },
                { icon: <Clock className="w-4 h-4" />, label: "3-4 Hours" },
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
            {["Steps", "Pad Guide", "Finish Comparison", "Schedules", "Shop All"].map((label) => (
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
            The 7-Step Process
          </h2>
          <p className="text-mjs-gray-500 text-base md:text-lg max-w-2xl mx-auto">
            Follow these steps in order. Each one builds on the last — skip one and the final result suffers.
          </p>
        </div>

        {/* Step timeline + detail */}
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
              {/* Step header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-mjs-red text-white flex items-center justify-center text-xl font-black shrink-0">
                  {step.number}
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-mjs-dark">{step.title}</h3>
                  <p className="text-mjs-gray-500 mt-1">{step.description}</p>
                </div>
              </div>

              {/* Steps checklist */}
              <div className="space-y-3 mb-6">
                {step.details.map((d) => (
                  <div key={d} className="flex gap-3 bg-white rounded-lg p-3 border border-gray-100">
                    <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-mjs-gray-700">{d}</span>
                  </div>
                ))}
              </div>

              {/* Pro tip */}
              {step.proTip && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 mb-6">
                  <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-amber-800 mb-0.5">Pro Tip</p>
                    <p className="text-sm text-amber-700">{step.proTip}</p>
                  </div>
                </div>
              )}

              {/* Products for this step */}
              <div>
                <div className="text-xs font-semibold text-mjs-gray-400 uppercase tracking-wider mb-3">Products You Need for This Step</div>
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

            {/* Step nav */}
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

      {/* ── Floor Pad Color Guide ── */}
      <div id="pad-guide" className="bg-mjs-gray-50 border-y border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-3">
              Floor Pad Color Guide
            </h2>
            <p className="text-mjs-gray-500 max-w-2xl mx-auto">
              Pads are color-coded by aggression level — darker = more aggressive.
              Using the wrong pad can damage your floor or waste your time.
            </p>
          </div>

          {/* Aggression scale visual */}
          <div className="flex items-center justify-center gap-1 mb-8">
            <span className="text-xs font-semibold text-mjs-gray-400 mr-2">Aggressive</span>
            {PAD_COLORS.map((p) => (
              <div
                key={p.name}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: p.color }}
                title={p.name}
              />
            ))}
            <span className="text-xs font-semibold text-mjs-gray-400 ml-2">Gentle</span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PAD_COLORS.map((p) => (
              <div key={p.name} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className={`${p.bgClass} px-5 py-3 flex items-center justify-between`}>
                  <span className={`font-bold ${p.textClass}`}>{p.name} Pad</span>
                  <span className={`text-xs font-semibold ${p.textClass} opacity-80`}>{p.speed}</span>
                </div>
                <div className="p-5">
                  <p className="text-sm text-mjs-gray-600 mb-3">{p.use}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-mjs-gray-400 uppercase">Aggression</span>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className={`w-3 h-1.5 rounded-full ${i < p.aggression ? "bg-mjs-red" : "bg-gray-200"}`} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pad shopping links */}
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "Black Stripping Pads", slug: "janitors-finest-black-stripping-pads-5-per-carton", sku: "72-15" },
              { label: "Green Scrubbing Pads", slug: "janitors-finest-green-scrubbing-pads-5-per-carton", sku: "55-17" },
              { label: "Red Buffing Pads", slug: "janitors-finest-red-buffing-pads-5-per-carton", sku: "51-15" },
              { label: "White Polishing Pads", slug: "janitors-finest-white-polishing-pads-5-per-carton", sku: "41-15" },
            ].map((p) => (
              <Link
                key={p.sku}
                href={`/product/${p.slug}`}
                className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-200 hover:border-mjs-red/30 hover:shadow-sm transition-all group"
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

      {/* ── Finish Comparison ── */}
      <div id="finish-comparison" className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-3">
            Floor Finish Comparison
          </h2>
          <p className="text-mjs-gray-500 max-w-2xl mx-auto">
            Higher solids content = fewer coats needed, deeper gloss, and longer durability.
            Choose based on your traffic level and budget.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {FINISH_COMPARISON.map((f, i) => (
            <div
              key={f.sku}
              className={`relative bg-white rounded-2xl border-2 p-6 md:p-8 hover:shadow-lg transition-shadow ${
                i === 2 ? "border-mjs-red" : "border-gray-200"
              }`}
            >
              {i === 2 && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-mjs-red text-white text-xs font-bold px-3 py-1 rounded-full">
                  Best Value
                </div>
              )}
              <h3 className="text-lg font-bold text-mjs-dark mb-1">{f.name}</h3>
              <p className="text-xs text-mjs-gray-400 mb-4">SKU: {f.sku}</p>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-mjs-gray-500">Solids Content</span>
                  <span className="text-sm font-bold text-mjs-dark">{f.solids}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-mjs-gray-500">Coats Needed</span>
                  <span className="text-sm font-bold text-mjs-dark">{f.coats}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-mjs-gray-500">Gloss Level</span>
                  <span className="text-sm font-bold text-mjs-dark">{f.gloss}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-mjs-gray-500">Durability</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, j) => (
                      <div key={j} className={`w-3 h-3 rounded-full ${j < f.durability ? "bg-mjs-gold" : "bg-gray-200"}`} />
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-xs text-mjs-gray-500 mb-4">{f.best}</p>

              <Link
                href={`/product/${f.slug}`}
                className={`block text-center text-sm font-bold py-2.5 rounded-lg transition-colors ${
                  i === 2
                    ? "bg-mjs-red text-white hover:bg-mjs-red-dark"
                    : "bg-mjs-gray-50 text-mjs-dark hover:bg-gray-100"
                }`}
              >
                View Product
              </Link>
            </div>
          ))}
        </div>

        {/* Sealer callout */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-5 flex gap-4">
          <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-blue-800 mb-1">Should You Use a Floor Sealer?</p>
            <p className="text-sm text-blue-700">
              Applying 1-2 coats of <Link href="/product/floor-sealer" className="underline font-semibold hover:text-blue-900">Floor Sealer</Link> before
              your finish coats fills pores in the tile, creates a better bond, and makes your finish last significantly longer.
              Highly recommended for new or freshly stripped floors.
            </p>
          </div>
        </div>
      </div>

      {/* ── Maintenance Schedules by Industry ── */}
      <div id="schedules" className="bg-mjs-dark">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
              Maintenance Schedules by Facility
            </h2>
            <p className="text-mjs-gray-400 max-w-2xl mx-auto">
              How often should you strip and recoat? It depends on your foot traffic.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {INDUSTRY_SCHEDULES.map((s) => (
              <div key={s.industry} className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-lg ${s.bgColor} ${s.color} flex items-center justify-center`}>
                    {s.icon}
                  </div>
                  <h3 className="text-base font-bold text-white">{s.industry}</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-mjs-gray-400">Full strip & recoat</span>
                    <span className="font-semibold text-mjs-gold">{s.strip}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-mjs-gray-400">Buff / spray buff</span>
                    <span className="font-semibold text-white">{s.buff}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-mjs-gray-400">Recommended coats</span>
                    <span className="font-semibold text-white">{s.coats}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Common Mistakes ── */}
      <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-8 text-center">
          5 Mistakes That Ruin a Strip & Wax Job
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { num: 1, title: "Letting stripper dry", fix: "Work in small sections and keep the floor wet." },
            { num: 2, title: "Skipping the neutralizer", fix: "Alkaline residue eats through new finish from below." },
            { num: 3, title: "Applying finish too thick", fix: "3 thin coats always beats 1 thick coat." },
            { num: 4, title: "Not enough dry time", fix: "Wait 30-45 min between coats. Rushing causes bubbles." },
            { num: 5, title: "Using a dirty mop", fix: "Use a dedicated finish mop. Contamination = streaks." },
          ].map((m) => (
            <div key={m.num} className="bg-red-50 border border-red-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span className="text-xs font-bold text-red-600">#{m.num}</span>
              </div>
              <h4 className="text-sm font-bold text-red-900 mb-1">{m.title}</h4>
              <p className="text-xs text-red-700">{m.fix}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div id="shop-all" className="bg-gradient-to-r from-mjs-red to-mjs-red-dark">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
            Everything You Need in One Place
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Strippers, finishes, floor pads, machines, and more — all at wholesale prices with free local delivery.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/category/floor-care"
              className="inline-flex items-center gap-2 bg-white text-mjs-red font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Shop Floor Care
            </Link>
            <Link
              href="/category/equipment"
              className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white font-bold px-6 py-3 rounded-lg hover:bg-white/20 transition-colors"
            >
              Shop Floor Machines
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
