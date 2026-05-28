"use client";

import { useState } from "react";
import {
  ChevronRight,
  ArrowRight,
  Check,
  X,
  Info,
  Droplets,
  Thermometer,
  Wind,
  Sparkles,
  Building2,
  Stethoscope,
  UtensilsCrossed,
  School,
  Star,
  Clock,
  AlertTriangle,
  Zap,
} from "lucide-react";
import Link from "next/link";

/* ─────────────────────────── Data ─────────────────────────── */

type MethodType = "hwe" | "bonnet" | "dryfoam" | "encapsulation";

interface CleaningMethod {
  id: MethodType;
  name: string;
  tagline: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  pros: string[];
  cons: string[];
  bestFor: string[];
  dryTime: string;
  effectiveness: number;
  speed: number;
  cost: number;
  products: { label: string; sku: string; slug: string }[];
}

const METHODS: CleaningMethod[] = [
  {
    id: "hwe",
    name: "Hot Water Extraction",
    tagline: "Deepest clean, industry standard",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    description:
      "Also called \"steam cleaning\" — injects hot water and cleaning solution deep into carpet fibers under pressure, then immediately extracts the dirty solution. This is the method most carpet manufacturers recommend to maintain warranty coverage.",
    pros: [
      "Deepest clean available — reaches carpet backing",
      "Recommended by Shaw, Mohawk, and most manufacturers",
      "Removes allergens, bacteria, and deep-set soil",
      "Restores carpet appearance most effectively",
      "Required for healthcare and food service facilities",
    ],
    cons: [
      "Longest dry time (6-24 hours)",
      "Requires trained operator",
      "Equipment is more expensive",
      "Can over-wet carpet if not done properly",
    ],
    bestFor: ["Annual deep cleaning", "Healthcare facilities", "Heavily soiled carpet", "Warranty compliance"],
    dryTime: "6-24 hours",
    effectiveness: 5,
    speed: 2,
    cost: 4,
    products: [
      { label: "Carpet Extraction Cleaner", sku: "30401", slug: "carpet-extraction-cleaner" },
      { label: "Carpet Extraction Emulsifier", sku: "30301", slug: "carpet-extraction-emlsifier" },
      { label: "Sandia Sniper w/ Heat", sku: "80-2100H", slug: "sandia-80-2100-h-sniper-12-gallon-light-duty-carpet-extractor-with-heat-100-psi-pump-dual-2-stage-vacuum-motors-w-hoses-wand-kit-included" },
      { label: "Sandia Heavy Duty 500 PSI", sku: "80-2500H", slug: "sandia-80-2500-h-sniper-12-gallon-heavy-duty-carpet-extractor-with-heat-500-psi-adjustable-pump-dual-2-stage-vacuum-motors-w-hoses-wand-kit-included" },
      { label: "Air Mover / Carpet Dryer", sku: "90-0000", slug: "sandia-90-0000-genair-3-speed-air-mover-115-volt-vacuum-motor-1-2-hp-2500-cfm-carpet-dryer" },
    ],
  },
  {
    id: "bonnet",
    name: "Bonnet Cleaning",
    tagline: "Quick maintenance, surface clean",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    description:
      "A low-moisture method that uses a rotary floor machine with an absorbent bonnet pad soaked in cleaning solution. The spinning pad absorbs surface soil from the carpet fibers. Ideal for interim maintenance between deep cleanings.",
    pros: [
      "Very fast dry time (1-2 hours)",
      "Quick to set up and perform",
      "Low equipment cost — uses existing floor machine",
      "Good for maintaining appearance between deep cleans",
      "Minimal training required",
    ],
    cons: [
      "Surface cleaning only — doesn't reach carpet backing",
      "Can push soil deeper if pad isn't changed often enough",
      "May leave detergent residue that attracts soil",
      "Not a substitute for periodic deep extraction",
    ],
    bestFor: ["Interim maintenance", "Hotel hallways", "Office common areas", "Quick turnarounds"],
    dryTime: "1-2 hours",
    effectiveness: 2,
    speed: 5,
    cost: 2,
    products: [
      { label: "Bonnet Clean Carpet Shampoo", sku: "30201", slug: "bonnet-clean-carpet-shampoo" },
      { label: "17\" Carpet Bonnet w/ Scrubbers", sku: "202-17", slug: "17-carpet-bonnet-w-scrubbers" },
      { label: "Carpet Defoamer", sku: "30701", slug: "carpet-defoamer" },
    ],
  },
  {
    id: "dryfoam",
    name: "Dry Foam Shampoo",
    tagline: "Low moisture, moderate clean",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    description:
      "Generates a dry foam (about 90% air, 10% liquid) that is worked into the carpet. The foam encapsulates soil particles, which are then vacuumed away once dry. Uses much less water than extraction.",
    pros: [
      "Low moisture — shorter dry time than extraction",
      "Good for routine cleaning of moderate soil",
      "Less risk of over-wetting",
      "Works well on commercial-grade carpet",
      "Can be combined with bonnet cleaning",
    ],
    cons: [
      "Not as deep as hot water extraction",
      "Requires thorough vacuuming after drying",
      "Foam residue can attract soil if not fully removed",
      "Less effective on heavy staining",
    ],
    bestFor: ["Routine maintenance", "Commercial offices", "Retail spaces", "Medium-traffic areas"],
    dryTime: "2-4 hours",
    effectiveness: 3,
    speed: 4,
    cost: 3,
    products: [
      { label: "Dry Foam Carpet Shampoo", sku: "30101", slug: "dry-foam-carpet-shampoo" },
      { label: "Carpet Defoamer", sku: "30701", slug: "carpet-defoamer" },
    ],
  },
  {
    id: "encapsulation",
    name: "Encapsulation",
    tagline: "Modern low-moisture technology",
    color: "text-violet-700",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-200",
    description:
      "A newer technology where crystallizing polymers encapsulate soil particles into dry residues that are removed through routine vacuuming. The crystals prevent soil from re-attaching to fibers, keeping carpets cleaner longer.",
    pros: [
      "Very fast dry time (30-60 minutes)",
      "Carpets stay cleaner longer between cleanings",
      "No sticky residue — polymers crystallize",
      "Very low water usage",
      "Excellent for interim maintenance programs",
    ],
    cons: [
      "Not a substitute for periodic deep extraction",
      "Less effective on heavily soiled carpet",
      "Requires specialized chemistry",
      "Results depend on regular vacuuming",
    ],
    bestFor: ["Interim maintenance programs", "Office buildings", "Retail with fast turnaround", "Green cleaning programs"],
    dryTime: "30-60 min",
    effectiveness: 3,
    speed: 5,
    cost: 3,
    products: [
      { label: "Carpet Extraction Cleaner", sku: "30401", slug: "carpet-extraction-cleaner" },
      { label: "Traffic Lane Cleaner", sku: "30901", slug: "traffic-lane-cleaner" },
    ],
  },
];

interface EquipmentTier {
  name: string;
  price: string;
  capacity: string;
  psi: string;
  bestFor: string;
  sku: string;
  slug: string;
}

const EQUIPMENT_TIERS: EquipmentTier[] = [
  { name: "Spot Extractor", price: "$1,100", capacity: "3 gal", psi: "55 PSI", bestFor: "Spot cleaning, upholstery, vehicle interiors", sku: "50-4000", slug: "sandia-50-4000-spot-xtract-3-gallon-carpet-extractor-with-heater-15-ft-hoses-and-4-stainless-steel-hand-tool" },
  { name: "Light Duty Extractor", price: "$1,700", capacity: "12 gal", psi: "100 PSI", bestFor: "Small offices, routine cleaning, moderate soil", sku: "80-2100", slug: "sandia-80-2100-sniper-12-gallon-light-duty-carpet-extractor-100-psi-pump-dual-2-stage-vacuum-motors-w-hoses-wand-kit-included" },
  { name: "Light Duty w/ Heat", price: "$2,200", capacity: "12 gal", psi: "100 PSI + Heat", bestFor: "Same as above with heated extraction for better results", sku: "80-2100H", slug: "sandia-80-2100-h-sniper-12-gallon-light-duty-carpet-extractor-with-heat-100-psi-pump-dual-2-stage-vacuum-motors-w-hoses-wand-kit-included" },
  { name: "Heavy Duty w/ Heat", price: "$2,700", capacity: "12 gal", psi: "500 PSI + Heat", bestFor: "Large facilities, heavy soil, restaurant, healthcare", sku: "80-2500H", slug: "sandia-80-2500-h-sniper-12-gallon-heavy-duty-carpet-extractor-with-heat-500-psi-adjustable-pump-dual-2-stage-vacuum-motors-w-hoses-wand-kit-included" },
];

interface ChemicalProduct {
  name: string;
  sku: string;
  slug: string;
  dilution: string;
  method: string;
  use: string;
}

const CHEMICALS: ChemicalProduct[] = [
  { name: "Carpet Extraction Cleaner", sku: "30401", slug: "carpet-extraction-cleaner", dilution: "1:64 - 1:128", method: "Extraction", use: "Primary extraction detergent for all carpet types" },
  { name: "Carpet Extraction Emulsifier", sku: "30301", slug: "carpet-extraction-emlsifier", dilution: "1:32 - 1:64", method: "Extraction", use: "Pre-spray for heavy soil before extraction" },
  { name: "Dry Foam Shampoo", sku: "30101", slug: "dry-foam-carpet-shampoo", dilution: "1:16 - 1:32", method: "Dry Foam", use: "Low-moisture foam cleaning solution" },
  { name: "Bonnet Shampoo", sku: "30201", slug: "bonnet-clean-carpet-shampoo", dilution: "1:32 - 1:64", method: "Bonnet", use: "Spray-on solution for bonnet pad cleaning" },
  { name: "Traffic Lane Cleaner", sku: "30901", slug: "traffic-lane-cleaner", dilution: "1:8 - 1:16", method: "Pre-spray", use: "Concentrated pre-spray for high-traffic lanes" },
  { name: "Spot Remover", sku: "30801", slug: "chemcor-lift-out-carpet-spot-remover-gallon-30801", dilution: "Ready-to-use", method: "Spot", use: "Immediate spot and stain treatment" },
  { name: "Carpet Defoamer", sku: "30701", slug: "carpet-defoamer", dilution: "As needed", method: "All", use: "Eliminates foam in recovery tanks" },
  { name: "Carpet Protector", sku: "03025", slug: "janitors-finest-defender-carpet-upholstery-protector-gal", dilution: "Ready-to-use", method: "Post-clean", use: "Applies protective barrier after cleaning" },
];

interface StainGuide {
  stain: string;
  difficulty: number;
  method: string;
  steps: string[];
}

const STAIN_GUIDE: StainGuide[] = [
  { stain: "Coffee / Tea", difficulty: 2, method: "Blot + Spot Remover", steps: ["Blot excess immediately — never rub", "Apply spot remover and let dwell 3-5 min", "Blot from outside in toward center", "Rinse with cool water, blot dry"] },
  { stain: "Ink (Ballpoint)", difficulty: 4, method: "Solvent + Spot Remover", steps: ["Apply rubbing alcohol to clean cloth", "Dab (don't rub) the stain repeatedly", "Switch to clean area of cloth frequently", "Follow with spot remover, rinse and blot"] },
  { stain: "Grease / Oil", difficulty: 3, method: "Extraction Emulsifier", steps: ["Scrape excess with dull knife", "Apply extraction emulsifier at strong dilution", "Let dwell 5-10 minutes", "Extract with hot water, repeat if needed"] },
  { stain: "Blood", difficulty: 3, method: "Cold Water + Spot Remover", steps: ["ALWAYS use cold water — hot sets blood permanently", "Blot with cold water first", "Apply spot remover and let dwell", "Blot and rinse with cold water, repeat"] },
  { stain: "Gum", difficulty: 2, method: "Freeze + Scrape", steps: ["Apply ice or freeze spray to harden gum", "Shatter or scrape off frozen gum with dull knife", "Treat remaining residue with spot remover", "Blot clean and vacuum when dry"] },
  { stain: "Pet Urine", difficulty: 5, method: "Enzyme + Extraction", steps: ["Blot excess immediately", "Apply enzyme-based cleaner — let dwell 15+ min", "Extract with hot water extractor", "May require carpet backing treatment for old stains"] },
];

const INDUSTRY_SCHEDULES = [
  { icon: <Building2 className="w-6 h-6" />, industry: "Office Building", vacuum: "Daily", spot: "As needed", interim: "Quarterly", deep: "Annually", color: "text-blue-600", bgColor: "bg-blue-50" },
  { icon: <Stethoscope className="w-6 h-6" />, industry: "Healthcare", vacuum: "Daily (2x)", spot: "Immediately", interim: "Monthly", deep: "Quarterly", color: "text-emerald-600", bgColor: "bg-emerald-50" },
  { icon: <UtensilsCrossed className="w-6 h-6" />, industry: "Restaurant", vacuum: "Daily", spot: "Immediately", interim: "Monthly", deep: "Semi-annually", color: "text-orange-600", bgColor: "bg-orange-50" },
  { icon: <School className="w-6 h-6" />, industry: "School / University", vacuum: "Daily", spot: "Daily", interim: "Quarterly", deep: "Summer break", color: "text-violet-600", bgColor: "bg-violet-50" },
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

export default function CarpetCleaningGuide() {
  const [activeTab, setActiveTab] = useState<MethodType>("hwe");
  const activeMethod = METHODS.find((m) => m.id === activeTab)!;

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
            <span className="text-mjs-red">Carpet Cleaning Guide</span>
          </nav>

          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-mjs-red/10 border border-mjs-red/20 text-mjs-red px-3 py-1.5 rounded-full text-xs font-semibold mb-4 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Complete Guide
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
              Commercial Carpet<br />Cleaning Guide
            </h1>
            <p className="text-lg md:text-xl text-mjs-gray-300 leading-relaxed max-w-2xl mx-auto">
              Methods, equipment, chemicals, and stain removal — everything you need to keep commercial carpets looking their best.
            </p>
          </div>
        </div>
      </div>

      {/* ── Quick Jump ── */}
      <div className="border-b border-gray-100 bg-mjs-gray-50 sticky top-0 z-20">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center justify-center gap-1 py-3 overflow-x-auto scrollbar-hide">
            <span className="text-xs font-semibold text-mjs-gray-400 mr-2 shrink-0 uppercase tracking-wider">Jump to:</span>
            {["Methods", "Equipment", "Chemicals", "Stain Guide", "Schedules", "Shop All"].map((label) => (
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

      {/* ── Method Comparison ── */}
      <div id="methods" className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-4xl font-extrabold text-mjs-dark mb-3">
            Cleaning Method Comparison
          </h2>
          <p className="text-mjs-gray-500 text-base md:text-lg max-w-2xl mx-auto">
            Four methods, each suited to different needs. Select one to see the full breakdown.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {METHODS.map((m) => (
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
                {m.name.split(" ").slice(0, 2).join(" ")}
              </span>
              <span className="text-[10px] text-mjs-gray-400 mt-0.5 hidden md:block">{m.tagline}</span>
              {activeTab === m.id && (
                <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full ${m.bgColor} border ${m.borderColor}`} />
              )}
            </button>
          ))}
        </div>

        {/* Detail panel */}
        <div className={`rounded-2xl border ${activeMethod.borderColor} overflow-hidden`}>
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-0">
            <div className={`${activeMethod.bgColor} p-6 md:p-10 border-b lg:border-b-0 lg:border-r ${activeMethod.borderColor}`}>
              <h3 className={`text-2xl md:text-3xl font-black ${activeMethod.color} mb-2`}>
                {activeMethod.name}
              </h3>
              <p className="text-sm text-mjs-gray-600 mb-6 leading-relaxed">{activeMethod.description}</p>

              <div className="space-y-3 mb-6">
                {[
                  { label: "Cleaning Effectiveness", value: activeMethod.effectiveness },
                  { label: "Speed", value: activeMethod.speed },
                  { label: "Cost", value: activeMethod.cost },
                ].map((r) => (
                  <div key={r.label} className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-mjs-gray-600">{r.label}</span>
                    <RatingDots value={r.value} color={activeMethod.bgColor.replace("50", "500")} />
                  </div>
                ))}
              </div>

              <div className="bg-white/70 rounded-lg p-3 text-center">
                <div className="text-[10px] font-semibold text-mjs-gray-400 uppercase">Dry Time</div>
                <div className="text-sm font-bold text-mjs-dark">{activeMethod.dryTime}</div>
              </div>
            </div>

            <div className="p-6 md:p-10 bg-white">
              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div>
                  <h4 className="text-xs font-semibold text-mjs-gray-400 uppercase tracking-wider mb-3">Advantages</h4>
                  <ul className="space-y-2">
                    {activeMethod.pros.map((p) => (
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
                    {activeMethod.cons.map((c) => (
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
                  {activeMethod.bestFor.map((b) => (
                    <span key={b} className={`px-3 py-1.5 rounded-full text-xs font-semibold ${activeMethod.bgColor} ${activeMethod.color}`}>
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-mjs-gray-400 uppercase tracking-wider mb-3">Products for {activeMethod.name}</h4>
                <div className="space-y-2">
                  {activeMethod.products.map((p) => (
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

      {/* ── Equipment Tiers ── */}
      <div id="equipment" className="bg-mjs-gray-50 border-y border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-3">
              Extractor Equipment Guide
            </h2>
            <p className="text-mjs-gray-500 max-w-2xl mx-auto">
              From portable spot cleaning to heavy-duty deep extraction — choose the right machine for your facility size.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {EQUIPMENT_TIERS.map((tier, i) => (
              <Link
                key={tier.sku}
                href={`/product/${tier.slug}`}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-mjs-red/30 transition-all group"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-10 h-10 rounded-lg ${i === 3 ? "bg-mjs-red" : i === 2 ? "bg-blue-500" : i === 1 ? "bg-emerald-500" : "bg-amber-500"} text-white flex items-center justify-center`}>
                    <Droplets className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-mjs-dark group-hover:text-mjs-red transition-colors">{tier.name}</div>
                    <div className="text-lg font-black text-mjs-dark">{tier.price}</div>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-mjs-gray-400 font-semibold">Capacity</span>
                    <span className="text-mjs-dark font-bold">{tier.capacity}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-mjs-gray-400 font-semibold">Pressure</span>
                    <span className="text-mjs-dark font-bold">{tier.psi}</span>
                  </div>
                </div>
                <p className="text-xs text-mjs-gray-500">{tier.bestFor}</p>
                <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-mjs-red">
                  View Details <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 max-w-3xl mx-auto">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-800 mb-0.5">Pro Tip</p>
              <p className="text-sm text-amber-700">
                Heated extraction makes a significant difference. Hot water breaks down grease and soil faster, reduces dry time, and improves overall results. If your budget allows, always choose the heated model.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Chemical Selection ── */}
      <div id="chemicals" className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-3">
            Chemical Selection & Dilution Ratios
          </h2>
          <p className="text-mjs-gray-500 max-w-2xl mx-auto">
            The right chemistry at the right dilution is just as important as the method you choose.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-mjs-dark text-white">
                <th className="text-left px-4 py-3 font-semibold">Product</th>
                <th className="text-left px-4 py-3 font-semibold">Dilution</th>
                <th className="text-left px-4 py-3 font-semibold">Method</th>
                <th className="text-left px-4 py-3 font-semibold">Use</th>
                <th className="text-right px-4 py-3 font-semibold">Shop</th>
              </tr>
            </thead>
            <tbody>
              {CHEMICALS.map((c) => (
                <tr key={c.sku} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-mjs-dark">{c.name}</td>
                  <td className="px-4 py-3 font-mono text-mjs-gray-600">{c.dilution}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">{c.method}</span>
                  </td>
                  <td className="px-4 py-3 text-mjs-gray-500 text-xs">{c.use}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/product/${c.slug}`} className="inline-flex items-center gap-1 text-mjs-red font-semibold text-xs hover:underline">
                      View <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Stain Removal ── */}
      <div id="stain-guide" className="bg-mjs-gray-50 border-y border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-3">
              Stain Removal Quick Reference
            </h2>
            <p className="text-mjs-gray-500 max-w-2xl mx-auto">
              Act fast — the first 15 minutes determine whether a stain is temporary or permanent.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {STAIN_GUIDE.map((s) => (
              <div key={s.stain} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-mjs-dark">{s.stain}</h3>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className={`w-2 h-2 rounded-full ${i < s.difficulty ? "bg-red-500" : "bg-gray-200"}`} />
                    ))}
                  </div>
                </div>
                <div className="text-xs font-semibold text-mjs-red mb-3">{s.method}</div>
                <ol className="space-y-2">
                  {s.steps.map((step, i) => (
                    <li key={i} className="flex gap-2 text-xs text-mjs-gray-600">
                      <span className="w-4 h-4 rounded-full bg-mjs-gray-50 text-mjs-gray-400 text-[10px] font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 max-w-3xl mx-auto">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-800 mb-0.5">Pro Tip</p>
              <p className="text-sm text-amber-700">
                Always blot, never rub. Rubbing pushes the stain deeper into carpet fibers and damages the pile. Work from the outside edge toward the center to prevent spreading.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Maintenance Schedules ── */}
      <div id="schedules" className="bg-mjs-dark">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
              Maintenance Schedule by Facility Type
            </h2>
            <p className="text-mjs-gray-400 max-w-2xl mx-auto">
              A consistent schedule extends carpet life by 40-60% and maintains appearance year-round.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {INDUSTRY_SCHEDULES.map((s) => (
              <div key={s.industry} className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-lg ${s.bgColor} ${s.color} flex items-center justify-center`}>
                    {s.icon}
                  </div>
                  <h3 className="text-base font-bold text-white">{s.industry}</h3>
                </div>
                <div className="space-y-2">
                  {[
                    { task: "Vacuum", freq: s.vacuum },
                    { task: "Spot Clean", freq: s.spot },
                    { task: "Interim Clean", freq: s.interim },
                    { task: "Deep Extract", freq: s.deep },
                  ].map((t) => (
                    <div key={t.task} className="flex justify-between text-xs">
                      <span className="text-mjs-gray-400">{t.task}</span>
                      <span className="text-white font-semibold">{t.freq}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div id="shop-all" className="bg-gradient-to-r from-mjs-red to-mjs-red-dark">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
            Get Your Carpet Cleaning Supplies
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Browse our full selection of carpet extractors, chemicals, pads, and accessories. Wholesale pricing with free local delivery.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/category/floor-care"
              className="inline-flex items-center gap-2 bg-white text-mjs-red font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Droplets className="w-4 h-4" />
              Shop Floor Care
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white font-bold px-6 py-3 rounded-lg hover:bg-white/20 transition-colors"
            >
              Need Equipment Advice? Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
