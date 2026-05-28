"use client";

import { useState } from "react";
import {
  ChevronRight,
  ArrowRight,
  Check,
  Info,
  Car,
  Droplets,
  Sparkles,
  Shield,
  Wind,
  Eye,
  Building2,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";

/* ─────────────────────────── Data ─────────────────────────── */

type StageId = "wash" | "decontaminate" | "protect" | "interior" | "glass" | "finishing";

interface DetailingStage {
  id: StageId;
  number: number;
  name: string;
  tagline: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  steps: string[];
  proTip: string;
  products: { label: string; sku: string; slug: string }[];
}

const STAGES: DetailingStage[] = [
  {
    id: "wash",
    number: 1,
    name: "Wash & Foam",
    tagline: "Remove loose dirt safely",
    icon: <Droplets className="w-5 h-5" />,
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    description: "The foundation of any detail. A proper wash removes surface contaminants without scratching the paint.",
    steps: [
      "Rinse the entire vehicle with a pressure washer to remove loose dirt",
      "Apply foam cannon soap and let it dwell 3-5 minutes",
      "Wash panels top-to-bottom using the two-bucket method",
      "Use a grit guard in your rinse bucket to trap particles",
      "Final rinse — work top-down to prevent water spots",
    ],
    proTip: "Never wash in direct sunlight. The soap dries before you can rinse, leaving spots and streaks.",
    products: [
      { label: "Platinum Knight Wash & Foam", sku: "PK-WF500", slug: "platinum-knight-wash-foam" },
      { label: "Platinum Knight Ceramic Shampoo", sku: "PK-CS500", slug: "platinum-knight-ceramic-shampoo" },
      { label: "Detailing Bucket with Grit Guard", sku: "PK-BKT5G", slug: "platinum-knight-detailing-bucket" },
    ],
  },
  {
    id: "decontaminate",
    number: 2,
    name: "Decontaminate",
    tagline: "Remove what washing can't",
    icon: <Shield className="w-5 h-5" />,
    color: "text-violet-700",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-200",
    description: "After washing, the paint may still have embedded iron particles, tar, tree sap, and overspray that soap alone won't remove.",
    steps: [
      "Run your hand over the paint — if it feels rough, it needs decontamination",
      "Apply iron remover spray and let it react (turns purple on contact with iron)",
      "Use a clay bar or clay mitt on lubricated paint to pull out embedded particles",
      "Tar remover for any remaining spots of road tar or adhesive residue",
      "Rinse thoroughly and dry with a clean microfiber towel",
    ],
    proTip: "The 'plastic bag test' — put your hand in a sandwich bag and run it over the paint. You'll feel contaminants you can't feel with bare fingers.",
    products: [
      { label: "Platinum Knight Wash & Foam", sku: "PK-WF500", slug: "platinum-knight-wash-foam" },
    ],
  },
  {
    id: "protect",
    number: 3,
    name: "Wax & Protect",
    tagline: "Lock in the shine",
    icon: <Sparkles className="w-5 h-5" />,
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    description: "Protection is what separates a car wash from a detail. Wax, sealants, or ceramic coatings create a barrier against UV, rain, and contaminants.",
    steps: [
      "Ensure the paint is completely clean and dry",
      "Apply wax or sealant in thin, even layers using an applicator pad",
      "Work one panel at a time — apply, let haze, then buff off",
      "For carnauba paste wax: apply in straight lines, not circles",
      "Buff with a clean, dry microfiber towel to reveal the gloss",
    ],
    proTip: "Carnauba wax gives the deepest, warmest shine on dark colors. Ceramic coatings last longer (6-12 months vs 4-8 weeks) but cost more.",
    products: [
      { label: "Platinum Knight Nature's Wax Shield", sku: "PK-WS200", slug: "platinum-knight-wax-shield" },
    ],
  },
  {
    id: "interior",
    number: 4,
    name: "Interior Deep Clean",
    tagline: "Where clients spend 100% of their time",
    icon: <Car className="w-5 h-5" />,
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    description: "The interior is what the driver experiences every day. A thorough interior detail covers every surface from headliner to floor mats.",
    steps: [
      "Remove all floor mats and loose items — shake out mats",
      "Vacuum everything: seats, carpet, crevices, trunk, under seats",
      "Clean and condition leather seats (or shampoo cloth seats)",
      "Wipe all hard surfaces: dash, console, door panels, steering wheel",
      "Clean air vents with a detail brush and compressed air",
      "Clean pedals, seatbelt buckles, and frequently missed areas",
    ],
    proTip: "The steering wheel is the dirtiest surface in any car — dirtier than a toilet seat. Always clean it, even on a quick detail.",
    products: [
      { label: "Platinum Knight Wash & Foam", sku: "PK-WF500", slug: "platinum-knight-wash-foam" },
    ],
  },
  {
    id: "glass",
    number: 5,
    name: "Glass Care",
    tagline: "Crystal clear visibility",
    icon: <Eye className="w-5 h-5" />,
    color: "text-sky-700",
    bgColor: "bg-sky-50",
    borderColor: "border-sky-200",
    description: "Automotive glass requires a different approach than household glass. Film buildup from off-gassing dashboards, water spots, and residue need proper removal.",
    steps: [
      "Clean the inside of the windshield first (it's always the worst)",
      "Use an automotive glass cleaner — household glass cleaners can leave film",
      "Wipe in straight lines, not circles, to avoid streaks",
      "Flip your microfiber towel to a dry side for the final buff",
      "Apply a glass sealant to exterior windows for rain repellency",
    ],
    proTip: "Inside windshield haze is caused by plasticizers off-gassing from the dashboard. It gets worse in summer. Clean it every detail.",
    products: [
      { label: "Platinum Knight Ceramic Glass Cleaner", sku: "PK-CGC500", slug: "platinum-knight-ceramic-glass-cleaner" },
    ],
  },
  {
    id: "finishing",
    number: 6,
    name: "Finishing Touches",
    tagline: "The details that wow",
    icon: <Wind className="w-5 h-5" />,
    color: "text-rose-700",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
    description: "The final touches transform a good detail into a great one. This is what clients notice and remember.",
    steps: [
      "Dress tires with a water-based tire gel for a satin finish",
      "Clean and dress exterior trim (faded black plastic)",
      "Wipe down door jambs, fuel door, and trunk jamb",
      "Place a fresh air freshener inside the vehicle",
      "Do a final walk-around under good lighting to catch anything missed",
    ],
    proTip: "New Car scent is the #1 selling air freshener for a reason — it signals 'this car is taken care of.' Always have it in stock.",
    products: [
      { label: "Wonder Wafers — New Car", sku: "WWNUCAR", slug: "wonder-wafers-new-car-auto-air-fresheners-250-ct" },
      { label: "Wonder Wafers — Baby Powder", sku: "WWBABYPOWDER", slug: "wonder-wafers-baby-powder-auto-air-fresheners-250-ct" },
      { label: "Wonder Wafers — Wild Cherry", sku: "WWWILDCHERRY", slug: "wonder-wafers-wild-cherry-auto-air-fresheners-250-ct" },
      { label: "Wonder Wafers — Black Royale", sku: "WWBLACKROYALE", slug: "wonder-wafers-black-royale-auto-air-fresheners-250-ct" },
    ],
  },
];

const STARTER_KIT = [
  { category: "Wash", items: ["Car shampoo / foam soap", "2 wash buckets with grit guards", "Wash mitt (microfiber or lambswool)", "Foam cannon or foam gun", "Drying towel (waffle weave)"] },
  { category: "Decontamination", items: ["Iron remover spray", "Clay bar or clay mitt", "Tar remover", "Clay lube or detail spray"] },
  { category: "Protection", items: ["Carnauba paste wax or paint sealant", "Applicator pads", "Buffing microfiber towels"] },
  { category: "Interior", items: ["Interior cleaner (all-purpose)", "Leather conditioner", "Detail brushes (various sizes)", "Vacuum with crevice tool", "Microfiber towels for interior"] },
  { category: "Glass", items: ["Automotive glass cleaner", "Glass-specific microfiber towels", "Glass sealant / rain repellent"] },
  { category: "Finishing", items: ["Tire dressing / gel", "Trim restorer", "Air fresheners (bulk)", "Spray wax for quick details"] },
];

const SERVICE_TIERS = [
  { name: "Express Wash", price: "$25-40", time: "30-45 min", includes: ["Exterior wash & dry", "Tire dressing", "Window clean", "Air freshener"], color: "border-gray-200" },
  { name: "Interior Detail", price: "$75-150", time: "1.5-2 hrs", includes: ["Full vacuum & wipe-down", "Leather/fabric cleaning", "Dashboard & console", "Glass inside & out", "Air freshener"], color: "border-blue-200" },
  { name: "Full Detail", price: "$150-300", time: "3-5 hrs", includes: ["Complete wash & decontamination", "Clay bar treatment", "Hand wax application", "Full interior detail", "Engine bay cleaning", "Tire & trim dressing"], color: "border-mjs-red" },
];

/* ─────────────────────────── Component ─────────────────────────── */

export default function CarDetailingGuide() {
  const [activeStage, setActiveStage] = useState(0);
  const stage = STAGES[activeStage];

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
            <span className="text-mjs-red">Car Detailing Supply Guide</span>
          </nav>
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-mjs-red/10 border border-mjs-red/20 text-mjs-red px-3 py-1.5 rounded-full text-xs font-semibold mb-4 uppercase tracking-wider">
              <Car className="w-3.5 h-3.5" />
              Supply Guide
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
              Car Detailing<br />Supply Guide
            </h1>
            <p className="text-lg md:text-xl text-mjs-gray-300 leading-relaxed max-w-2xl mx-auto">
              Everything you need to detail like a pro — from first wash to final wax.
              Build your kit step by step.
            </p>
          </div>
        </div>
      </div>

      {/* ── Quick Jump ── */}
      <div className="border-b border-gray-100 bg-mjs-gray-50 sticky top-0 z-20">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center justify-center gap-1 py-3 overflow-x-auto scrollbar-hide">
            <span className="text-xs font-semibold text-mjs-gray-400 mr-2 shrink-0 uppercase tracking-wider">Jump to:</span>
            {["Process", "Starter Kit", "Service Tiers", "Shop All"].map((label) => (
              <a key={label} href={`#${label.toLowerCase().replace(/ /g, "-")}`} className="shrink-0 px-3 py-1.5 text-xs font-semibold rounded-full bg-white border border-gray-200 text-mjs-gray-600 hover:border-mjs-red hover:text-mjs-red transition-all">
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── 6-Stage Process ── */}
      <div id="process" className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-4xl font-extrabold text-mjs-dark mb-3">The 6-Stage Detailing Process</h2>
          <p className="text-mjs-gray-500 text-base md:text-lg max-w-2xl mx-auto">Each stage builds on the last. Skip a stage and the final result shows it.</p>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          {/* Stage nav */}
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible scrollbar-hide pb-2 lg:pb-0">
            {STAGES.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setActiveStage(i)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 shrink-0 lg:shrink lg:w-full border-2 ${
                  activeStage === i ? `${s.borderColor} bg-white shadow-lg` : "border-transparent bg-mjs-gray-50 hover:bg-white hover:shadow-sm"
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black shrink-0 ${activeStage === i ? `${s.bgColor} ${s.color}` : "bg-gray-200 text-mjs-gray-500"}`}>
                  {s.number}
                </div>
                <div className="min-w-0">
                  <div className={`text-sm font-bold truncate ${activeStage === i ? "text-mjs-dark" : "text-mjs-gray-600"}`}>{s.name}</div>
                  <div className="text-[10px] text-mjs-gray-400">{s.tagline}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Stage detail */}
          <div className={`rounded-2xl border ${stage.borderColor} overflow-hidden`}>
            <div className="p-6 md:p-10">
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-12 h-12 rounded-xl ${stage.bgColor} ${stage.color} flex items-center justify-center shrink-0`}>{stage.icon}</div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-mjs-dark">{stage.name}</h3>
                  <p className="text-mjs-gray-500 mt-1">{stage.description}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {stage.steps.map((s) => (
                  <div key={s} className="flex gap-3 bg-white rounded-lg p-3 border border-gray-100">
                    <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-mjs-gray-700">{s}</span>
                  </div>
                ))}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 mb-6">
                <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-amber-800 mb-0.5">Pro Tip</p>
                  <p className="text-sm text-amber-700">{stage.proTip}</p>
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-mjs-gray-400 uppercase tracking-wider mb-3">Products for This Stage</div>
                <div className="grid sm:grid-cols-2 gap-2">
                  {stage.products.map((p) => (
                    <Link key={p.sku} href={`/product/${p.slug}`} className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-100 hover:border-mjs-red/30 hover:shadow-sm transition-all group">
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

            {/* Stage nav */}
            <div className="border-t border-gray-200 px-6 md:px-10 py-4 flex items-center justify-between bg-white">
              <button onClick={() => setActiveStage(Math.max(0, activeStage - 1))} disabled={activeStage === 0} className="text-sm font-semibold text-mjs-gray-500 hover:text-mjs-red transition-colors disabled:opacity-30 disabled:cursor-not-allowed">Previous</button>
              <span className="text-xs text-mjs-gray-400">Stage {stage.number} of {STAGES.length}</span>
              <button onClick={() => setActiveStage(Math.min(STAGES.length - 1, activeStage + 1))} disabled={activeStage === STAGES.length - 1} className="text-sm font-semibold text-mjs-red hover:text-mjs-red-dark transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1">Next <ArrowRight className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Starter Kit Checklist ── */}
      <div id="starter-kit" className="bg-mjs-gray-50 border-y border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-3">Detailing Starter Kit Checklist</h2>
            <p className="text-mjs-gray-500 max-w-2xl mx-auto">Everything you need to start detailing. Check off each category as you build your kit.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {STARTER_KIT.map((kit) => (
              <div key={kit.category} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                <h3 className="text-base font-bold text-mjs-dark mb-3">{kit.category}</h3>
                <ul className="space-y-2">
                  {kit.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-mjs-gray-600">
                      <div className="w-4 h-4 rounded border border-gray-300 shrink-0 mt-0.5 flex items-center justify-center">
                        <Check className="w-3 h-3 text-transparent" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Service Tier Pricing ── */}
      <div id="service-tiers" className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-3">Common Service Tiers & Pricing</h2>
          <p className="text-mjs-gray-500 max-w-2xl mx-auto">If you&apos;re starting a detailing business, here&apos;s what the market charges for each tier.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {SERVICE_TIERS.map((tier, i) => (
            <div key={tier.name} className={`relative bg-white rounded-2xl border-2 p-6 md:p-8 hover:shadow-lg transition-shadow ${tier.color}`}>
              {i === 2 && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-mjs-red text-white text-xs font-bold px-3 py-1 rounded-full">Most Profitable</div>}
              <h3 className="text-lg font-bold text-mjs-dark mb-1">{tier.name}</h3>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-2xl font-black text-mjs-dark">{tier.price}</span>
              </div>
              <p className="text-xs text-mjs-gray-400 mb-4">{tier.time}</p>
              <ul className="space-y-2">
                {tier.includes.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-mjs-gray-600">
                    <Check className="w-4 h-4 text-green-500 shrink-0" />{item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-5 flex gap-4">
          <Building2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-blue-800 mb-1">Starting a Mobile Detailing Business?</p>
            <p className="text-sm text-blue-700">Buying supplies at wholesale prices is how you protect your margins. A gallon of concentrate that costs $19 can wash 50+ cars. That&apos;s $0.38 per car in product cost.</p>
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div id="shop-all" className="bg-gradient-to-r from-mjs-red to-mjs-red-dark">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">Ready to Build Your Kit?</h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">Professional detailing products at wholesale prices. Start with our Platinum Knight line.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/category/car-detailing" className="inline-flex items-center gap-2 bg-white text-mjs-red font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors">
              <ShoppingCart className="w-4 h-4" /> Shop Car Detailing
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white font-bold px-6 py-3 rounded-lg hover:bg-white/20 transition-colors">
              Bulk Pricing? Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
