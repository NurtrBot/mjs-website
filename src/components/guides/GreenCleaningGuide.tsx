"use client";

import { useState } from "react";
import {
  ChevronRight,
  ArrowRight,
  Check,
  X,
  Info,
  Leaf,
  Recycle,
  Shield,
  Building2,
  Stethoscope,
  School,
  Hotel,
  Award,
  Heart,
  Scale,
  Users,
  Sparkles,
  Droplets,
  Trash2,
  FileText,
} from "lucide-react";
import Link from "next/link";

/* ─────────────────────────── Types & Data ─────────────────────────── */

type GreenTab = "chemicals" | "liners" | "paper" | "microfiber" | "equipment";

interface GreenCategory {
  id: GreenTab;
  name: string;
  icon: React.ReactNode;
  tagline: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  keyBenefits: string[];
  products: { label: string; sku: string; slug: string; detail: string }[];
}

const GREEN_CATEGORIES: GreenCategory[] = [
  {
    id: "chemicals",
    name: "Green Chemicals",
    icon: <Droplets className="w-5 h-5" />,
    tagline: "Safer for people & planet",
    color: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    description:
      "Green cleaning chemicals use plant-based or naturally-derived ingredients that are biodegradable and low-toxicity. Neutral floor cleaners are pH-balanced (6.5-7.5) and safe for all sealed floor types. They clean effectively without the harsh fumes, VOCs, or chemical burns associated with conventional products.",
    keyBenefits: [
      "Reduced VOCs -- better indoor air quality for occupants",
      "No harsh fumes -- safer for cleaning staff",
      "Biodegradable ingredients break down in the environment",
      "pH-neutral formulas are safe for all sealed floor types",
      "Many qualify for LEED and Green Seal certification credits",
      "Concentrate formulas reduce plastic waste from packaging",
    ],
    products: [
      { label: "Lemon Neutral Floor Cleaner", sku: "3158", slug: "janitors-finest-3158-lemon-neutral-floor-cleaner", detail: "Gallon concentrate - Dilutes 1:64, neutral pH" },
    ],
  },
  {
    id: "liners",
    name: "Compostable Liners",
    icon: <Trash2 className="w-5 h-5" />,
    tagline: "Break down, not apart",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    description:
      "Compostable can liners are made from plant-based resins (PLA or PBAT) that break down in commercial composting facilities. They look and perform like conventional plastic liners but leave zero persistent microplastics. Ideal for facilities with organic waste streams or composting programs.",
    keyBenefits: [
      "Made from renewable plant-based materials",
      "Certified compostable (BPI/ASTM D6400)",
      "Break down completely in commercial composting (90-180 days)",
      "No persistent microplastics left in the environment",
      "Same strength ratings as conventional liners",
      "Support facility composting and waste diversion programs",
    ],
    products: [
      { label: "Compostable Liner 24x33 (small)", sku: "SC-COMP-2433", slug: "", detail: "SunnyCare compostable - 12-16 gallon" },
      { label: "Compostable Liner 33x40 (medium)", sku: "SC-COMP-3340", slug: "", detail: "SunnyCare compostable - 33 gallon" },
      { label: "Compostable Liner 40x48 (large)", sku: "SC-COMP-4048", slug: "", detail: "SunnyCare compostable - 40-45 gallon" },
    ],
  },
  {
    id: "paper",
    name: "Sustainable Paper",
    icon: <Recycle className="w-5 h-5" />,
    tagline: "Recycled & compostable",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    description:
      "Sustainable paper products include recycled-content towels and tissue as well as compostable foodservice items made from agricultural byproducts. Bagasse (sugarcane fiber) plates replace foam and plastic without sacrificing performance -- they handle hot, greasy foods and are commercially compostable.",
    keyBenefits: [
      "Recycled content reduces virgin timber demand",
      "Bagasse plates made from agricultural waste (sugarcane pulp)",
      "Commercially compostable in industrial facilities",
      "Grease and moisture resistant without plastic coatings",
      "Microwave safe (bagasse products)",
      "Comparable performance to conventional alternatives",
    ],
    products: [
      { label: "Bagasse Plate 9\" (Compostable)", sku: "BWKPLATEWF9", slug: "bagasse-dinnerware-plate-9-dia-white-500-carton-bwkplatewf9", detail: "500/case - Replaces foam/plastic plates" },
    ],
  },
  {
    id: "microfiber",
    name: "Microfiber",
    icon: <Sparkles className="w-5 h-5" />,
    tagline: "Clean with less chemicals",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    description:
      "Microfiber mops and cloths clean more effectively than cotton with up to 95% less water and chemical usage. The ultra-fine fibers (1/100th the width of human hair) physically trap dirt, dust, and bacteria instead of pushing it around. Each pad can be laundered 200-500 times, dramatically reducing waste.",
    keyBenefits: [
      "Removes 99% of bacteria with water alone (no chemicals needed)",
      "Uses 95% less water than cotton mops",
      "Each pad is launderable 200-500 times",
      "Lighter weight reduces worker fatigue and injury",
      "Color-coding prevents cross-contamination between areas",
      "Faster drying time reduces slip-and-fall risk",
    ],
    products: [
      { label: "18\" Microfiber Mop Complete (frame + pole)", sku: "M8300COMP", slug: "18-inch-microfiber-mop-frame-and-telescopic-pole-complete", detail: "Frame, pole, and 1 pad included" },
      { label: "18\" Blue Microfiber Mop Refill", sku: "M830018B", slug: "18-blue-microfiber-mop-head-refill", detail: "Replacement pad - Machine washable" },
    ],
  },
  {
    id: "equipment",
    name: "Green Equipment",
    icon: <Shield className="w-5 h-5" />,
    tagline: "Efficient & sustainable",
    color: "text-violet-700",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-200",
    description:
      "Green cleaning equipment reduces resource consumption through better engineering. Microfiber flat mop systems use 95% less water. Backpack vacuums with HEPA filtration capture 99.97% of particles instead of recirculating them. Dilution control systems ensure chemicals are mixed accurately, eliminating waste.",
    keyBenefits: [
      "Microfiber mop systems replace bucket-and-mop waste",
      "HEPA-filtered vacuums improve indoor air quality",
      "Dilution control systems eliminate chemical overuse",
      "Battery-powered equipment reduces noise pollution",
      "Ergonomic designs reduce worker injury and comp claims",
      "Longer equipment lifespan reduces replacement waste",
    ],
    products: [
      { label: "18\" Microfiber Mop Complete", sku: "M8300COMP", slug: "18-inch-microfiber-mop-frame-and-telescopic-pole-complete", detail: "Replaces traditional string mops" },
    ],
  },
];

const CERTIFICATIONS = [
  {
    name: "Green Seal",
    description: "Independent nonprofit that certifies products meeting rigorous environmental and performance standards. GS-37 covers cleaning products, GS-42 covers commercial cleaning services.",
    lookFor: "Green Seal logo on packaging",
    color: "bg-green-100 text-green-800",
  },
  {
    name: "EPA Safer Choice",
    description: "The EPA reviews every ingredient in a product for safety. Products earning this label contain ingredients that are safer for human health and the environment.",
    lookFor: "Safer Choice label on packaging",
    color: "bg-blue-100 text-blue-800",
  },
  {
    name: "LEED Credits",
    description: "LEED (Leadership in Energy and Environmental Design) awards points for green cleaning programs. Using certified products and implementing green cleaning policies contributes to LEED certification.",
    lookFor: "LEED EQ Credit: Green Cleaning",
    color: "bg-amber-100 text-amber-800",
  },
  {
    name: "BPI Certified (Compostable)",
    description: "The Biodegradable Products Institute certifies products that meet ASTM D6400 for compostability. Look for the BPI logo on liners, plates, and food service items.",
    lookFor: "BPI Compostable logo",
    color: "bg-emerald-100 text-emerald-800",
  },
];

const COST_COMPARISON = [
  { category: "All-Purpose Cleaner (per gallon RTU)", conventional: "$0.15-0.25", green: "$0.18-0.30", savings: "Green costs ~20% more per gallon" },
  { category: "Floor Cleaner (per gallon RTU)", conventional: "$0.10-0.20", green: "$0.12-0.22", savings: "Comparable when buying concentrates" },
  { category: "Mop System (annual cost)", conventional: "$200-400 (cotton mops + buckets)", green: "$150-250 (microfiber, launderable)", savings: "Green saves 25-40% annually" },
  { category: "Can Liners (per liner)", conventional: "$0.08-0.15", green: "$0.12-0.20", savings: "Green costs ~30-50% more per liner" },
  { category: "Paper Towels (per case)", conventional: "$25-35", green: "$28-40", savings: "Comparable for recycled content" },
  { category: "Total Annual (10K sqft)", conventional: "$1,800-2,500", green: "$1,900-2,700", savings: "3-8% more overall -- not the 30% myth" },
];

const GREEN_SWAPS = [
  { conventional: "Bleach-based cleaners", green: "Hydrogen peroxide disinfectants", benefit: "No chlorine fumes, same kill claims" },
  { conventional: "Ammonia glass cleaner", green: "Vinegar-based or plant-based glass cleaner", benefit: "No respiratory irritation" },
  { conventional: "Solvent-based degreaser", green: "Citrus or soy-based degreaser", benefit: "No VOCs, pleasant citrus scent" },
  { conventional: "Cotton string mop", green: "Microfiber flat mop system", benefit: "95% less water, 200+ washes per pad" },
  { conventional: "Plastic can liners", green: "Compostable (PLA/PBAT) liners", benefit: "No persistent microplastics" },
  { conventional: "Foam plates", green: "Bagasse (sugarcane) plates", benefit: "Commercially compostable" },
  { conventional: "Aerosol air fresheners", green: "Essential oil diffusers or gel cups", benefit: "No propellants or synthetic fragrances" },
];

const FIVE_STEPS = [
  { step: 1, title: "Audit Current Products", description: "Inventory all cleaning chemicals, paper products, liners, and equipment. Note brands, quantities, and costs. This is your baseline." },
  { step: 2, title: "Identify Easy Swaps", description: "Start with low-risk swaps: neutral floor cleaner, microfiber mops, recycled paper towels. These deliver immediate results with minimal disruption." },
  { step: 3, title: "Train Your Staff", description: "Green cleaning only works if staff use products correctly. Train on dilution ratios, microfiber color coding, and proper techniques. Document procedures." },
  { step: 4, title: "Implement Gradually", description: "Replace products as current stock runs out. Do not throw away usable products. Transition over 3-6 months to spread costs and allow staff to adapt." },
  { step: 5, title: "Measure & Communicate", description: "Track chemical usage, worker comp claims, and tenant satisfaction. Share results with building occupants. Green cleaning is a competitive advantage." },
];

const INDUSTRY_PICKS = [
  {
    icon: <School className="w-6 h-6" />,
    industry: "Schools & Universities",
    pick: "Highest impact -- start here",
    why: "Children are 10x more vulnerable to chemical exposure. Green cleaning reduces asthma triggers, improves attendance, and qualifies for LEED for Schools credits. Many districts mandate green cleaning.",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    icon: <Building2 className="w-6 h-6" />,
    industry: "Class A Office Buildings",
    pick: "Tenant attraction & LEED points",
    why: "Green cleaning is expected by premium tenants. It contributes to LEED certification which commands higher rents. Improved indoor air quality reduces sick days.",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: <Stethoscope className="w-6 h-6" />,
    industry: "Healthcare Facilities",
    pick: "Targeted green approach",
    why: "Healthcare has specific disinfection requirements that limit some green products. Use green chemicals for general cleaning and EPA-registered disinfectants only where needed.",
    color: "text-violet-600",
    bgColor: "bg-violet-50",
  },
  {
    icon: <Hotel className="w-6 h-6" />,
    industry: "Hotels & Hospitality",
    pick: "Guest perception & loyalty",
    why: "Guests increasingly choose eco-friendly hotels. Green cleaning programs can be marketed as an amenity. Lower chemical exposure protects housekeeping staff who clean 14-16 rooms daily.",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
];

const BENEFITS = [
  { icon: <Heart className="w-6 h-6" />, title: "Worker Health", description: "Cleaning workers have 2x the injury rate of other occupations. Green products reduce chemical burns, respiratory irritation, and long-term health risks from VOC exposure." },
  { icon: <Scale className="w-6 h-6" />, title: "Reduced Liability", description: "Fewer chemical injuries mean fewer workers comp claims. Safer products reduce slip-and-fall risk (less residue) and liability from chemical exposure complaints." },
  { icon: <Users className="w-6 h-6" />, title: "Tenant Satisfaction", description: "73% of office workers say air quality affects their productivity. Green cleaning eliminates the 'just cleaned' chemical smell that triggers complaints and headaches." },
  { icon: <Award className="w-6 h-6" />, title: "LEED Points", description: "Green cleaning contributes to LEED EQ credits. A comprehensive green cleaning program can earn 1-2 LEED points, which can be the difference between certification levels." },
];

/* ─────────────────────────── Component ─────────────────────────── */

export default function GreenCleaningGuide() {
  const [activeTab, setActiveTab] = useState<GreenTab>("chemicals");
  const activeCategory = GREEN_CATEGORIES.find((c) => c.id === activeTab)!;

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
            <span className="text-mjs-red">Green Cleaning Guide</span>
          </nav>

          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-mjs-red/10 border border-mjs-red/20 text-mjs-red px-3 py-1.5 rounded-full text-xs font-semibold mb-4 uppercase tracking-wider">
              <Leaf className="w-3.5 h-3.5" />
              Sustainability Guide
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
              Green Cleaning for Commercial Facilities
            </h1>
            <p className="text-lg md:text-xl text-mjs-gray-300 leading-relaxed max-w-2xl mx-auto">
              Build a sustainable cleaning program that protects your staff, your tenants,
              and the environment -- without breaking your budget.
            </p>
          </div>
        </div>
      </div>

      {/* ── Quick Jump ── */}
      <div className="border-b border-gray-100 bg-mjs-gray-50 sticky top-0 z-20">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center justify-center gap-1 py-3 overflow-x-auto scrollbar-hide">
            <span className="text-xs font-semibold text-mjs-gray-400 mr-2 shrink-0 uppercase tracking-wider">Jump to:</span>
            {["What Is Green", "Products", "Cost Myth", "5 Steps", "Swaps", "Benefits", "By Industry"].map((label) => (
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

      {/* ── What Is Green Cleaning ── */}
      <div id="what-is-green" className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-4xl font-extrabold text-mjs-dark mb-3">
            What Is Green Cleaning?
          </h2>
          <p className="text-mjs-gray-500 text-base md:text-lg max-w-2xl mx-auto">
            Green cleaning is the use of cleaning products and practices that protect human health
            and the environment. It is not about cleaning less -- it is about cleaning smarter.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          <div>
            <h3 className="text-lg font-bold text-mjs-dark mb-4">Core Principles</h3>
            <ul className="space-y-3">
              {[
                "Use products with fewer toxic ingredients and lower VOCs",
                "Choose concentrated formulas to reduce packaging waste",
                "Implement microfiber systems to reduce chemical and water use",
                "Select recycled and compostable disposable products",
                "Train staff on proper dilution and application techniques",
                "Measure and improve environmental impact over time",
              ].map((item) => (
                <li key={item} className="flex gap-2 text-sm text-mjs-gray-700">
                  <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-mjs-dark mb-4">Key Certifications to Look For</h3>
            <div className="space-y-3">
              {CERTIFICATIONS.map((cert) => (
                <div key={cert.name} className="bg-mjs-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${cert.color}`}>{cert.name}</span>
                  </div>
                  <p className="text-xs text-mjs-gray-600 leading-relaxed">{cert.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Green Product Categories (Interactive Tabs) ── */}
      <div id="products" className="bg-mjs-gray-50 border-y border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-3">
              Green Product Categories
            </h2>
            <p className="text-mjs-gray-500 max-w-2xl mx-auto">
              Select a category to see how green alternatives compare and what products are available.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center gap-3 mb-10 flex-wrap">
            {GREEN_CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveTab(c.id)}
                className={`
                  relative flex flex-col items-center px-5 md:px-8 py-4 rounded-xl transition-all duration-200 border-2 min-w-[100px]
                  ${activeTab === c.id
                    ? `${c.borderColor} bg-white shadow-lg scale-105`
                    : "border-gray-200 bg-white hover:shadow-md"
                  }
                `}
              >
                <div className={`w-8 h-8 rounded-full mb-2 flex items-center justify-center ${activeTab === c.id ? c.bgColor : "bg-gray-100"}`}>
                  <span className={activeTab === c.id ? c.color : "text-gray-400"}>{c.icon}</span>
                </div>
                <span className={`text-sm md:text-base font-bold ${activeTab === c.id ? c.color : "text-mjs-dark"}`}>
                  {c.name}
                </span>
                <span className="text-[10px] text-mjs-gray-400 mt-0.5">{c.tagline}</span>
              </button>
            ))}
          </div>

          {/* Active category */}
          <div className={`rounded-2xl border ${activeCategory.borderColor} overflow-hidden bg-white`}>
            <div className="grid lg:grid-cols-[1fr_1.5fr] gap-0">
              <div className={`${activeCategory.bgColor} p-6 md:p-10 border-b lg:border-b-0 lg:border-r ${activeCategory.borderColor}`}>
                <h3 className={`text-2xl md:text-3xl font-black ${activeCategory.color} mb-2`}>
                  {activeCategory.name}
                </h3>
                <p className="text-sm text-mjs-gray-600 mb-6 leading-relaxed">{activeCategory.description}</p>

                <h4 className="text-xs font-semibold text-mjs-gray-400 uppercase tracking-wider mb-3">Key Benefits</h4>
                <ul className="space-y-2">
                  {activeCategory.keyBenefits.map((f) => (
                    <li key={f} className="flex gap-2 text-sm text-mjs-gray-700">
                      <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 md:p-10">
                <h4 className="text-xs font-semibold text-mjs-gray-400 uppercase tracking-wider mb-3">Shop Green Products</h4>
                <div className="space-y-2">
                  {activeCategory.products.map((p) => (
                    p.slug ? (
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
                    ) : (
                      <div
                        key={p.sku}
                        className="flex items-center justify-between bg-mjs-gray-50 rounded-lg p-3 border border-gray-100"
                      >
                        <div>
                          <div className="text-sm font-semibold text-mjs-dark">{p.label}</div>
                          <div className="text-xs text-mjs-gray-400">{p.detail}</div>
                        </div>
                        <span className="text-xs text-mjs-gray-400 font-semibold">Contact for pricing</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Cost Comparison (Myth Busting) ── */}
      <div id="cost-myth" className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-3">
            The Cost Myth: Green vs Conventional
          </h2>
          <p className="text-mjs-gray-500 max-w-2xl mx-auto">
            The biggest objection to green cleaning is cost. The reality? The total program cost
            difference is typically 3-8% -- not the 30% many assume.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-mjs-dark text-white">
                <th className="text-left px-4 py-3 font-semibold">Category</th>
                <th className="text-center px-4 py-3 font-semibold">Conventional</th>
                <th className="text-center px-4 py-3 font-semibold">Green Alternative</th>
                <th className="text-left px-4 py-3 font-semibold">Real Difference</th>
              </tr>
            </thead>
            <tbody>
              {COST_COMPARISON.map((row) => (
                <tr key={row.category} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-mjs-dark">{row.category}</td>
                  <td className="px-4 py-3 text-center font-mono text-mjs-gray-600">{row.conventional}</td>
                  <td className="px-4 py-3 text-center font-mono text-green-700">{row.green}</td>
                  <td className="px-4 py-3 text-mjs-gray-500 text-xs">{row.savings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700">
            <strong>Pro Tip:</strong> When calculating the true cost, factor in reduced worker comp claims,
            lower absenteeism, and fewer chemical inventory items. Many facilities find green cleaning
            actually saves money when these indirect costs are included.
          </p>
        </div>
      </div>

      {/* ── 5 Steps to a Green Cleaning Program ── */}
      <div id="5-steps" className="bg-mjs-gray-50 border-y border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-3">
              5 Steps to a Green Cleaning Program
            </h2>
            <p className="text-mjs-gray-500 max-w-2xl mx-auto">
              You do not have to switch everything overnight. Follow this phased approach
              for a smooth, successful transition.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {FIVE_STEPS.map((s) => (
              <div key={s.step} className="bg-white rounded-xl border border-gray-200 p-5 flex gap-4 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-black text-lg shrink-0">
                  {s.step}
                </div>
                <div>
                  <h3 className="text-base font-bold text-mjs-dark mb-1">{s.title}</h3>
                  <p className="text-sm text-mjs-gray-600 leading-relaxed">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Green Product Swaps Table ── */}
      <div id="swaps" className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-3">
            Green Product Swaps
          </h2>
          <p className="text-mjs-gray-500 max-w-2xl mx-auto">
            Replace these conventional products with their green alternatives for immediate impact.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-mjs-dark text-white">
                <th className="text-left px-4 py-3 font-semibold">Conventional Product</th>
                <th className="text-left px-4 py-3 font-semibold">Green Alternative</th>
                <th className="text-left px-4 py-3 font-semibold">Key Benefit</th>
              </tr>
            </thead>
            <tbody>
              {GREEN_SWAPS.map((swap) => (
                <tr key={swap.conventional} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-mjs-gray-600">
                    <div className="flex items-center gap-2">
                      <X className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      {swap.conventional}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-green-700">
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                      {swap.green}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-mjs-gray-500">{swap.benefit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Benefits Section ── */}
      <div id="benefits" className="bg-mjs-gray-50 border-y border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-3">
              Why Green Cleaning Matters
            </h2>
            <p className="text-mjs-gray-500 max-w-2xl mx-auto">
              The business case for green cleaning goes far beyond environmental responsibility.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {BENEFITS.map((b) => (
              <div key={b.title} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-green-100 text-green-700 flex items-center justify-center mb-3">
                  {b.icon}
                </div>
                <h3 className="text-base font-bold text-mjs-dark mb-2">{b.title}</h3>
                <p className="text-xs text-mjs-gray-500 leading-relaxed">{b.description}</p>
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
              Green Cleaning by Industry
            </h2>
            <p className="text-mjs-gray-400 max-w-2xl mx-auto">
              Different facilities benefit from green cleaning in different ways.
              Here is where to start based on your industry.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
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
            Start Your Green Cleaning Program
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Browse eco-friendly cleaning products, compostable liners, and sustainable supplies.
            Wholesale pricing with free local delivery.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/category/trash-liners"
              className="inline-flex items-center gap-2 bg-white text-mjs-red font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Recycle className="w-4 h-4" />
              Shop Trash Liners
            </Link>
            <Link
              href="/category/cleaning-chemicals"
              className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white font-bold px-6 py-3 rounded-lg hover:bg-white/20 transition-colors"
            >
              <Leaf className="w-4 h-4" />
              Shop Green Chemicals
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
