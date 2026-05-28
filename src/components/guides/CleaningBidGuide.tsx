"use client";

import { useState } from "react";
import {
  ChevronRight,
  ArrowRight,
  Check,
  X,
  Info,
  ClipboardList,
  Footprints,
  Search,
  Calculator,
  Package,
  PieChart,
  Presentation,
  Building2,
  Stethoscope,
  UtensilsCrossed,
  School,
  Hotel,
  Factory,
  AlertTriangle,
  CircleDollarSign,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

/* ─────────────────────────── Data ─────────────────────────── */

interface BidStep {
  id: number;
  title: string;
  icon: React.ReactNode;
  description: string;
  details: string[];
  tip: string;
}

const BID_STEPS: BidStep[] = [
  {
    id: 1,
    title: "Schedule a Walkthrough",
    icon: <Search className="w-5 h-5" />,
    description: "Visit the facility in person. Never bid blind from a phone call or email. Walk every room, hallway, restroom, and entrance.",
    details: [
      "Meet the decision-maker on site",
      "Visit during business hours to see actual traffic",
      "Bring a measuring wheel, clipboard, and camera",
      "Ask for a floor plan if available",
      "Note any existing cleaning issues or complaints",
    ],
    tip: "Dress professionally. This is your first impression and part of the sales process.",
  },
  {
    id: 2,
    title: "Measure Square Footage",
    icon: <Footprints className="w-5 h-5" />,
    description: "Accurate square footage is the foundation of your bid. Measure all cleanable areas including offices, restrooms, lobbies, kitchens, and hallways.",
    details: [
      "Use a measuring wheel for large areas",
      "Separate hard floor vs carpet vs tile areas",
      "Count restroom square footage separately (higher cost)",
      "Note warehouse/storage areas (lower cleaning needs)",
      "Record ceiling heights for any specialized cleaning",
    ],
    tip: "Ask for the building's total square footage from the property manager, then verify by measuring. Their number often includes non-cleanable space like mechanical rooms.",
  },
  {
    id: 3,
    title: "Assess the Scope of Work",
    icon: <ClipboardList className="w-5 h-5" />,
    description: "Define exactly what is included: daily tasks, weekly tasks, monthly tasks, and any special services. Get this in writing before bidding.",
    details: [
      "Daily: trash, vacuum, mop, restrooms, breakroom",
      "Weekly: dust surfaces, clean glass, detail restrooms",
      "Monthly: strip/wax floors, deep carpet clean, high dusting",
      "Special: window washing, pressure washing, post-construction",
      "Define frequency for each task (1x, 3x, 5x per week)",
    ],
    tip: "Scope creep kills profits. If it is not in the contract, it is not included. Be specific about what is extra.",
  },
  {
    id: 4,
    title: "Calculate Labor Hours",
    icon: <Calculator className="w-5 h-5" />,
    description: "Labor is your biggest expense (50-70% of the bid). Estimate how many worker-hours each visit requires based on square footage and task list.",
    details: [
      "General rule: 1 janitor cleans 2,500-3,500 sqft/hour",
      "Restrooms: budget 15-20 minutes per restroom",
      "Carpet vacuuming: ~3,000 sqft/hour",
      "Hard floor mopping: ~4,000 sqft/hour",
      "Factor in travel time, setup/breakdown, and supervision",
    ],
    tip: "Time yourself cleaning a sample area on the walkthrough. Real data beats estimates every time.",
  },
  {
    id: 5,
    title: "Calculate Supply Costs",
    icon: <Package className="w-5 h-5" />,
    description: "Estimate monthly costs for chemicals, paper products (towels, tissue, liners), and equipment wear. This is typically 5-10% of the bid.",
    details: [
      "Chemicals: $0.02-0.05/sqft/month (diluted from concentrates)",
      "Paper towels & tissue: $0.01-0.03/sqft/month",
      "Trash liners: $0.005-0.015/sqft/month",
      "Equipment depreciation: $0.005-0.01/sqft/month",
      "Gloves and misc supplies: $0.005/sqft/month",
    ],
    tip: "Buy concentrates and dilute on-site. A single gallon of concentrate can make 32-128 gallons of ready-to-use cleaner.",
  },
  {
    id: 6,
    title: "Add Overhead + Profit",
    icon: <PieChart className="w-5 h-5" />,
    description: "Overhead includes insurance, vehicle costs, office expenses, taxes, and management time. Profit is what keeps you in business. Never skip this step.",
    details: [
      "Overhead: typically 15-25% of direct costs",
      "General liability insurance: required by most contracts",
      "Workers comp insurance: legally required for employees",
      "Vehicle fuel and maintenance",
      "Profit margin: target 10-25% for commercial jobs",
    ],
    tip: "If you are not making at least 10% net profit, you are working for free once you account for unexpected costs. Price accordingly.",
  },
  {
    id: 7,
    title: "Present Your Bid",
    icon: <Presentation className="w-5 h-5" />,
    description: "Package your bid professionally with a cover page, scope of work, pricing breakdown, and references. Present in person when possible.",
    details: [
      "Use a professional template or proposal software",
      "Break down pricing by service (not just one lump sum)",
      "Include your insurance certificates",
      "Provide 3+ references from similar facilities",
      "Offer a 30-day trial period to reduce buyer risk",
    ],
    tip: "Present three pricing tiers (basic, standard, premium). Most clients pick the middle option, and it gives you negotiation room.",
  },
];

const PRICING_BENCHMARKS = [
  { facility: "General Office", icon: <Building2 className="w-4 h-4" />, low: "$0.05", high: "$0.15", avg: "$0.08", frequency: "5x/week", notes: "Most common contract type" },
  { facility: "Medical / Dental", icon: <Stethoscope className="w-4 h-4" />, low: "$0.10", high: "$0.25", avg: "$0.15", frequency: "5-7x/week", notes: "OSHA compliance, biohazard" },
  { facility: "Restaurant / Food Service", icon: <UtensilsCrossed className="w-4 h-4" />, low: "$0.12", high: "$0.20", avg: "$0.15", frequency: "7x/week", notes: "Grease, health dept standards" },
  { facility: "School / Daycare", icon: <School className="w-4 h-4" />, low: "$0.06", high: "$0.12", avg: "$0.08", frequency: "5x/week", notes: "High traffic, summer schedule" },
  { facility: "Hotel / Hospitality", icon: <Hotel className="w-4 h-4" />, low: "$0.08", high: "$0.18", avg: "$0.12", frequency: "7x/week", notes: "Public areas, meeting rooms" },
  { facility: "Industrial / Warehouse", icon: <Factory className="w-4 h-4" />, low: "$0.03", high: "$0.08", avg: "$0.05", frequency: "3-5x/week", notes: "Large area, basic cleaning" },
];

const WALKTHROUGH_CHECKLIST = [
  { category: "Floors", items: ["Total square footage", "Carpet vs hard floor breakdown", "Floor type (VCT, epoxy, concrete, tile)", "Current condition (wax buildup, stains, damage)", "Special areas (gym, kitchen, lab)"] },
  { category: "Restrooms", items: ["Number of restrooms", "Number of fixtures (toilets, urinals, sinks)", "Dispenser types (paper towel, soap, tissue)", "Current condition and odor issues", "ADA compliance needs"] },
  { category: "Windows & Glass", items: ["Number of interior glass doors/partitions", "Number of exterior windows (inside/outside)", "Height of windows (ladder needed?)", "Frequency requested (weekly, monthly)"] },
  { category: "Special Needs", items: ["Post-construction cleanup", "Biohazard or medical waste", "Security requirements (background checks, keys)", "Green cleaning requirements", "Specific chemical restrictions"] },
];

const COMMON_MISTAKES = [
  { mistake: "Bidding without a walkthrough", consequence: "You miss critical details like floor types, restroom count, and traffic patterns. Your bid will be too low or too high.", fix: "Always visit in person, no exceptions." },
  { mistake: "Forgetting to include overhead", consequence: "You win the job but lose money every month because insurance, vehicle costs, and taxes eat your profit.", fix: "Add 15-25% overhead on top of direct costs." },
  { mistake: "Using per-hour pricing", consequence: "The client expects faster service over time but your costs stay the same. You end up rushing and quality drops.", fix: "Always bid per-square-foot or flat monthly rate." },
  { mistake: "Not defining scope in writing", consequence: "Scope creep. The client asks for more and more services without paying more. You feel trapped.", fix: "Detailed scope of work in the contract with a change order process." },
  { mistake: "Underestimating restroom time", consequence: "Restrooms take 3-4x longer per sqft than open office space. Your staff runs behind schedule every night.", fix: "Budget 15-20 minutes per restroom, every visit." },
  { mistake: "Skipping the trial period", consequence: "You sign a 12-month contract and realize the building is harder than expected. You are stuck.", fix: "Offer a 30-60 day trial. Good for both sides." },
];

const SUPPLY_PRODUCTS = [
  { label: "Lemon Neutral Floor Cleaner", sku: "3158", slug: "janitors-finest-3158-lemon-neutral-floor-cleaner", detail: "Concentrate - Dilutes 1:64" },
  { label: "Strike Bac Disinfectant Cleaner", sku: "91101", slug: "strike-bac-lemon-odor-disinfectant-cleaner-gallon-91101ea", detail: "Hospital-grade disinfectant" },
  { label: "Can Liners 40-45 Gal Clear", sku: "CL404814", slug: "janitors-finest-can-liners-clear-40-x-48-14-micron-40-45-gallon-250-cs-cl404814", detail: "250/case - Everyday trash" },
  { label: "Multifold Paper Towels", sku: "5300", slug: "janitors-finest-5300-premium-2-ply-white-multifold-towels-16-packs-250-sheets-4000-towels", detail: "4,000 towels/case" },
  { label: "2-Ply Toilet Tissue", sku: "5602", slug: "janitors-finest-2-ply-toilet-tissue-4-3-x-3-5-500-sheets-per-roll-96-rolls-per-case-5602", detail: "96 rolls/case" },
  { label: "Blue Nitrile Gloves (Medium)", sku: "6303EA", slug: "life-guard-blue-nitrile-exam-gloves-powder-free-medium-5-mil-100-bx", detail: "100/box - PPE essential" },
];

/* ─────────────────────────── Component ─────────────────────────── */

export default function CleaningBidGuide() {
  const [activeStep, setActiveStep] = useState(1);
  const currentStep = BID_STEPS.find((s) => s.id === activeStep)!;

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
            <span className="text-mjs-red">Cleaning Bid Guide</span>
          </nav>

          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-mjs-red/10 border border-mjs-red/20 text-mjs-red px-3 py-1.5 rounded-full text-xs font-semibold mb-4 uppercase tracking-wider">
              <Calculator className="w-3.5 h-3.5" />
              Business Guide
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
              How to Bid Commercial Cleaning Jobs
            </h1>
            <p className="text-lg md:text-xl text-mjs-gray-300 leading-relaxed max-w-2xl mx-auto">
              A step-by-step guide to pricing janitorial contracts profitably.
              Stop guessing -- start bidding with confidence.
            </p>
          </div>
        </div>
      </div>

      {/* ── Quick Jump ── */}
      <div className="border-b border-gray-100 bg-mjs-gray-50 sticky top-0 z-20">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center justify-center gap-1 py-3 overflow-x-auto scrollbar-hide">
            <span className="text-xs font-semibold text-mjs-gray-400 mr-2 shrink-0 uppercase tracking-wider">Jump to:</span>
            {["Bid Process", "Pricing", "Supply Costs", "Walkthrough", "Profit Margins", "Mistakes to Avoid"].map((label) => (
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

      {/* ── Interactive Timeline / Bid Process ── */}
      <div id="bid-process" className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-4xl font-extrabold text-mjs-dark mb-3">
            The 7-Step Bid Process
          </h2>
          <p className="text-mjs-gray-500 text-base md:text-lg max-w-2xl mx-auto">
            Follow this proven process from walkthrough to signed contract.
            Click each step to see the full breakdown.
          </p>
        </div>

        {/* Timeline nav */}
        <div className="flex justify-center gap-1 mb-10 overflow-x-auto scrollbar-hide pb-2">
          {BID_STEPS.map((step) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`
                flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 border-2 shrink-0
                ${activeStep === step.id
                  ? "border-mjs-red bg-mjs-red/5 shadow-lg"
                  : "border-gray-200 bg-white hover:shadow-md hover:border-gray-300"
                }
              `}
            >
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                activeStep === step.id ? "bg-mjs-red text-white" :
                step.id < activeStep ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
              }`}>
                {step.id < activeStep ? <Check className="w-3.5 h-3.5" /> : step.id}
              </span>
              <span className={`text-xs md:text-sm font-bold ${activeStep === step.id ? "text-mjs-red" : "text-mjs-dark"}`}>
                {step.title}
              </span>
            </button>
          ))}
        </div>

        {/* Active step detail */}
        <div className="rounded-2xl border-2 border-mjs-red/20 overflow-hidden">
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-0">
            <div className="bg-red-50 p-6 md:p-10 border-b lg:border-b-0 lg:border-r border-mjs-red/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-mjs-red text-white flex items-center justify-center">
                  {currentStep.icon}
                </div>
                <div>
                  <div className="text-xs font-semibold text-mjs-gray-400 uppercase">Step {currentStep.id} of 7</div>
                  <h3 className="text-xl md:text-2xl font-black text-mjs-dark">{currentStep.title}</h3>
                </div>
              </div>
              <p className="text-sm text-mjs-gray-600 leading-relaxed mb-6">{currentStep.description}</p>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">
                  <strong>Pro Tip:</strong> {currentStep.tip}
                </p>
              </div>
            </div>

            <div className="p-6 md:p-10 bg-white">
              <h4 className="text-xs font-semibold text-mjs-gray-400 uppercase tracking-wider mb-3">Key Action Items</h4>
              <ul className="space-y-3">
                {currentStep.details.map((d) => (
                  <li key={d} className="flex gap-2 text-sm text-mjs-gray-700">
                    <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    {d}
                  </li>
                ))}
              </ul>

              {/* Step navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                <button
                  onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
                  disabled={activeStep === 1}
                  className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-mjs-gray-600 hover:border-mjs-red hover:text-mjs-red transition-all disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-mjs-gray-600"
                >
                  Previous Step
                </button>
                <button
                  onClick={() => setActiveStep(Math.min(7, activeStep + 1))}
                  disabled={activeStep === 7}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-mjs-red text-white hover:bg-mjs-red-dark transition-all disabled:opacity-30"
                >
                  Next Step
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Pricing Benchmarks ── */}
      <div id="pricing" className="bg-mjs-gray-50 border-y border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-3">
              Pricing Benchmarks by Facility Type
            </h2>
            <p className="text-mjs-gray-500 max-w-2xl mx-auto">
              These are per-square-foot, per-month rates based on industry averages. Your local market may vary.
              Use these as a starting point, not a ceiling.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mjs-dark text-white">
                  <th className="text-left px-4 py-3 font-semibold">Facility Type</th>
                  <th className="text-center px-4 py-3 font-semibold">Low $/sqft</th>
                  <th className="text-center px-4 py-3 font-semibold">High $/sqft</th>
                  <th className="text-center px-4 py-3 font-semibold">Average</th>
                  <th className="text-center px-4 py-3 font-semibold">Frequency</th>
                  <th className="text-left px-4 py-3 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody>
                {PRICING_BENCHMARKS.map((b) => (
                  <tr key={b.facility} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-bold text-mjs-dark">
                      <div className="flex items-center gap-2">
                        <span className="text-mjs-gray-400">{b.icon}</span>
                        {b.facility}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-green-700">{b.low}</td>
                    <td className="px-4 py-3 text-center font-mono text-orange-700">{b.high}</td>
                    <td className="px-4 py-3 text-center font-mono font-bold text-blue-700">{b.avg}</td>
                    <td className="px-4 py-3 text-center text-mjs-gray-600">{b.frequency}</td>
                    <td className="px-4 py-3 text-mjs-gray-500">{b.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">
              <strong>Example:</strong> A 10,000 sqft general office at $0.08/sqft = $800/month.
              At 5x/week cleaning, that is roughly $40/visit. If your janitor cleans 3,000 sqft/hour,
              that is about 3.3 hours of labor per visit.
            </p>
          </div>
        </div>
      </div>

      {/* ── Supply Cost Estimator ── */}
      <div id="supply-costs" className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-3">
            Supply Cost Estimates
          </h2>
          <p className="text-mjs-gray-500 max-w-2xl mx-auto">
            Budget 5-10% of your bid for cleaning supplies. Here are the core products every
            janitorial operation needs, with real wholesale pricing.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SUPPLY_PRODUCTS.map((p) => (
            <Link
              key={p.sku}
              href={`/product/${p.slug}`}
              className="flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200 hover:border-mjs-red/30 hover:shadow-sm transition-all group"
            >
              <div>
                <div className="text-sm font-semibold text-mjs-dark group-hover:text-mjs-red transition-colors">{p.label}</div>
                <div className="text-xs text-mjs-gray-400">SKU: {p.sku} &middot; {p.detail}</div>
              </div>
              <ArrowRight className="w-4 h-4 text-mjs-gray-300 group-hover:text-mjs-red transition-colors shrink-0 ml-2" />
            </Link>
          ))}
        </div>

        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700">
            <strong>Pro Tip:</strong> For a 10,000 sqft office cleaned 5x/week, expect roughly
            $150-300/month in supplies. That includes 2-3 cases of liners, 1-2 cases of paper towels,
            1-2 cases of tissue, and 1-2 gallons of concentrate per month.
          </p>
        </div>
      </div>

      {/* ── Walkthrough Checklist ── */}
      <div id="walkthrough" className="bg-mjs-gray-50 border-y border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-3">
              Walkthrough Checklist
            </h2>
            <p className="text-mjs-gray-500 max-w-2xl mx-auto">
              Print this out and bring it to every walkthrough. Missing one of these items can cost you
              hundreds per month in underpriced labor.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {WALKTHROUGH_CHECKLIST.map((cat) => (
              <div key={cat.category} className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-base font-bold text-mjs-dark mb-3 flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-mjs-red" />
                  {cat.category}
                </h3>
                <ul className="space-y-2">
                  {cat.items.map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-mjs-gray-600">
                      <div className="w-4 h-4 rounded border-2 border-gray-300 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Profit Margins ── */}
      <div id="profit-margins" className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-3">
            Profit Margin Targets
          </h2>
          <p className="text-mjs-gray-500 max-w-2xl mx-auto">
            Know your numbers. Here are the profit margins successful cleaning companies target
            for different types of work.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Residential */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-100 text-green-700 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-mjs-dark">Residential Cleaning</h3>
                <span className="text-xs font-semibold text-green-600">Target: 30-50% net margin</span>
              </div>
            </div>
            <ul className="space-y-2">
              {[
                "Higher margins because clients are less price-sensitive",
                "Shorter cleaning times (1-3 hours per home)",
                "Less competition from large companies",
                "Higher turnover and scheduling challenges",
                "Harder to scale past 10-15 clients without a team",
              ].map((item) => (
                <li key={item} className="flex gap-2 text-sm text-mjs-gray-600">
                  <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Commercial */}
          <div className="bg-white rounded-xl border-2 border-blue-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-mjs-dark">Commercial / Janitorial</h3>
                <span className="text-xs font-semibold text-blue-600">Target: 10-25% net margin</span>
              </div>
            </div>
            <ul className="space-y-2">
              {[
                "Lower margins but higher volume and predictability",
                "Monthly contracts provide steady recurring revenue",
                "Easier to scale with employees and routes",
                "More competitive bidding environment",
                "Larger contracts can generate $2,000-10,000+/month each",
              ].map((item) => (
                <li key={item} className="flex gap-2 text-sm text-mjs-gray-600">
                  <Check className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 max-w-4xl mx-auto">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700">
            <strong>Pro Tip:</strong> Track your actual costs for 90 days on a new contract before deciding
            if it is profitable. Many new operators think they are making money until they factor in drive time,
            supply reordering, and the time spent managing the account.
          </p>
        </div>
      </div>

      {/* ── Common Mistakes ── */}
      <div id="mistakes-to-avoid" className="bg-mjs-dark">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
              6 Bidding Mistakes That Kill Profits
            </h2>
            <p className="text-mjs-gray-400 max-w-2xl mx-auto">
              Every seasoned cleaning company owner has made these mistakes. Learn from them so you do not have to.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {COMMON_MISTAKES.map((m) => (
              <div key={m.mistake} className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">{m.mistake}</h3>
                </div>
                <p className="text-xs text-mjs-gray-400 leading-relaxed mb-3">
                  <span className="text-red-400 font-semibold">Risk:</span> {m.consequence}
                </p>
                <p className="text-xs text-green-400 font-semibold">
                  <span className="text-mjs-gold">Fix:</span> {m.fix}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="bg-gradient-to-r from-mjs-red to-mjs-red-dark">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
            Ready to Stock Your Cleaning Business?
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            MJS carries everything you need to run a profitable cleaning operation -- chemicals,
            paper products, liners, equipment, and more. Wholesale pricing with free local delivery.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-white text-mjs-red font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <CircleDollarSign className="w-4 h-4" />
              Shop All Products
            </Link>
            <Link
              href="/quote"
              className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white font-bold px-6 py-3 rounded-lg hover:bg-white/20 transition-colors"
            >
              Request a Custom Quote
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
