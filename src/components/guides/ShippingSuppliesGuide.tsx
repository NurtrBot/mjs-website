"use client";

import { useState } from "react";
import {
  ChevronRight,
  ArrowRight,
  Check,
  Info,
  Package,
  Layers,
  Scissors,
  CircleDot,
  Ruler,
  Building2,
  ShoppingCart,
  Truck,
  Box,
  Weight,
  Shield,
} from "lucide-react";
import Link from "next/link";

/* ─────────────────────────── Types & Data ─────────────────────────── */

type PackingTab = "bubble" | "peanuts" | "stretch" | "tape";

interface PackingCategory {
  id: PackingTab;
  name: string;
  icon: React.ReactNode;
  tagline: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  keyFeatures: string[];
  products: { label: string; sku: string; slug: string; detail: string }[];
}

const PACKING_CATEGORIES: PackingCategory[] = [
  {
    id: "bubble",
    name: "Bubble Wrap",
    icon: <CircleDot className="w-5 h-5" />,
    tagline: "Cushion & protect",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    description:
      "Bubble cushioning wrap is the most versatile packing material. Air-filled bubbles absorb shock and vibration during shipping. Available in 12\", 24\", and 48\" widths with 12\" perforations for easy tearing. Standard 3/16\" bubbles protect most items.",
    keyFeatures: [
      "3/16\" standard bubble provides shock absorption for most products",
      "12\" perforations for easy, clean tearing",
      "Lightweight -- adds minimal shipping weight",
      "Reusable by recipients (pop-able bonus)",
      "Available in 250' and 750' rolls for different volume needs",
    ],
    products: [
      { label: "Bubble 12\" x 250' (4 rolls)", sku: "BBL48412", slug: "bubble-cushioning-wrap-12-x-250-4-rolls-per-bundle-perf-12", detail: "4 rolls/bundle - Small items" },
      { label: "Bubble 24\" x 250' (2 rolls)", sku: "BBL48212", slug: "bubble-cushioning-wrap-24-x-250-2-rolls-per-bundle-perf-12", detail: "2 rolls/bundle - Medium items" },
      { label: "Bubble 48\" x 250' (1 roll)", sku: "BBL48112", slug: "bubble-cushioning-wrap-48-x-250-1-rolls-per-bundle-perf-12", detail: "1 roll/bundle - Large items, furniture" },
      { label: "Bubble 12\" x 750' (4 rolls)", sku: "BBL484316", slug: "bubble-cushioning-wrap-12-x-750-4-rolls-per-bundle-perf-12", detail: "4 rolls/bundle - High volume" },
      { label: "Bubble 24\" x 750' (2 rolls)", sku: "BBL482316", slug: "bubble-cushioning-wrap-24-x-750-2-rolls-per-bundle-perf-12", detail: "2 rolls/bundle - High volume" },
    ],
  },
  {
    id: "peanuts",
    name: "Packing Peanuts",
    icon: <Layers className="w-5 h-5" />,
    tagline: "Void fill classic",
    color: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    description:
      "Styrofoam packing peanuts fill empty space in boxes, preventing items from shifting during transit. White peanuts are the standard. Antistatic pink peanuts are essential for shipping electronics, circuit boards, and other static-sensitive components.",
    keyFeatures: [
      "Excellent void-fill for irregularly shaped items",
      "Extremely lightweight -- minimal added shipping cost",
      "Reusable and can be recycled at shipping stores",
      "White: standard general-purpose use",
      "Pink: antistatic formulation for electronics and sensitive components",
    ],
    products: [
      { label: "White Packing Peanuts 14 cu ft", sku: "SPACEPAK-W", slug: "styrofoam-white-packing-peanuts-14-cu", detail: "14 cubic feet - General purpose" },
      { label: "Antistatic Pink Peanuts 14 cu ft", sku: "SPACEPAK-P", slug: "antistatic-pink-packing-peanuts-14-cu", detail: "14 cubic feet - Electronics, sensitive items" },
    ],
  },
  {
    id: "stretch",
    name: "Stretch Wrap",
    icon: <Package className="w-5 h-5" />,
    tagline: "Secure & unitize",
    color: "text-violet-700",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-200",
    description:
      "Stretch film (pallet wrap) unitizes loads on pallets to prevent shifting during transport. It also provides a weather barrier and tamper evidence. Essential for warehouse operations, LTL freight, and any business shipping palletized goods.",
    keyFeatures: [
      "Self-clinging polyethylene requires no tape or adhesive",
      "Hand stretch wraps in 18\" and 20\" widths for manual use",
      "Machine stretch for high-volume pallet wrapping",
      "Cling technology keeps loads tight during transit",
      "Clear film allows barcode scanning through the wrap",
    ],
    products: [],
  },
  {
    id: "tape",
    name: "Carton Sealing Tape",
    icon: <Scissors className="w-5 h-5" />,
    tagline: "Seal it right",
    color: "text-orange-700",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    description:
      "Carton sealing tape (box tape) is a polypropylene or acrylic adhesive tape used to close corrugated boxes. Available in 2\" and 3\" widths. The 2\" width is standard for most boxes. 3\" provides better hold for heavy or oversized cartons.",
    keyFeatures: [
      "2\" width is standard for boxes up to 50 lbs",
      "3\" width provides extra adhesion for heavy or oversized boxes",
      "110 yard rolls are the industry standard length",
      "Clear tape for a clean, professional appearance",
      "Pair with a tape gun for speed and consistent application",
    ],
    products: [
      { label: "Tape 2\" x 110yd Clear (36 rolls)", sku: "TAPGP220C", slug: "carton-sealing-tape-2-x-110-yards-clear-2.0-mil-36-rls-carton", detail: "36/case - Standard boxes" },
      { label: "Tape 3\" x 110yd Clear (24 rolls)", sku: "TAPGP318C", slug: "carton-sealing-tape-3-x-110-yards-clear-1-8-mil-24-rls-carton", detail: "24/case - Heavy/oversized boxes" },
      { label: "Tape Dispenser/Gun 2\"", sku: "JMC203", slug: "tape-dispenser-economy-2-handheld", detail: "Economy handheld dispenser" },
    ],
  },
];

const BUBBLE_SIZE_CHART = [
  { width: '12"', length: "250'", sqft: "250", rolls: "4", bestFor: "Small items: mugs, bottles, electronics, small parts", costRange: "$0.02-0.03/sqft" },
  { width: '24"', length: "250'", sqft: "500", rolls: "2", bestFor: "Medium items: dishes, picture frames, small appliances", costRange: "$0.02-0.03/sqft" },
  { width: '48"', length: "250'", sqft: "1,000", rolls: "1", bestFor: "Large items: furniture legs, mirrors, artwork, TVs", costRange: "$0.02-0.03/sqft" },
  { width: '12"', length: "750'", sqft: "750", rolls: "4", bestFor: "High-volume small item shipping (e-commerce)", costRange: "$0.015-0.025/sqft" },
  { width: '24"', length: "750'", sqft: "1,500", rolls: "2", bestFor: "High-volume medium item shipping (warehouse)", costRange: "$0.015-0.025/sqft" },
];

const TAPE_COMPARE = [
  { feature: "Width", two: '2" (48mm)', three: '3" (72mm)' },
  { feature: "Standard Length", two: "110 yards", three: "110 yards" },
  { feature: "Thickness", two: "2.0 mil", three: "1.8 mil" },
  { feature: "Best For", two: "Standard boxes up to 50 lbs", three: "Heavy boxes, H-seal pattern, oversized" },
  { feature: "Rolls per Case", two: "36 rolls", three: "24 rolls" },
  { feature: "Tape Gun", two: '2" handheld gun', three: '3" gun (sold separately)' },
  { feature: "Coverage per Roll", two: "~330 feet of tape", three: "~330 feet of tape" },
  { feature: "Monthly Usage (est.)", two: "2-4 rolls for 50 boxes/month", three: "1-2 rolls for 50 boxes/month" },
];

const VOID_FILL_DECISION = [
  { scenario: "Fragile items (glass, ceramics, electronics)", recommended: "Bubble Wrap", reason: "Direct cushioning absorbs shock on impact. Wrap each item individually." },
  { scenario: "Filling empty space in a box", recommended: "Packing Peanuts", reason: "Flows around items and fills irregular voids. Prevents shifting." },
  { scenario: "Electronics and circuit boards", recommended: "Antistatic Pink Peanuts", reason: "Dissipates static charge that can damage sensitive components." },
  { scenario: "Heavy items needing cushion", recommended: "Bubble Wrap (double layer)", reason: "Two layers of bubble wrap provides ~1\" of cushioning for heavy drops." },
  { scenario: "Lightweight items, budget-sensitive", recommended: "Crumpled Kraft Paper", reason: "Cheapest void fill. Good enough for non-fragile, lightweight items." },
  { scenario: "High-volume e-commerce", recommended: "Air Pillows", reason: "Fast to dispense, lightweight, and cost-effective at scale. Machine-inflated on demand." },
];

const SHIPPING_STATION_CHECKLIST = [
  { category: "Packing Table", items: ["36\" x 72\" or larger work surface", "Anti-fatigue mat for standing", "Good overhead lighting", "Nearby outlet for tape guns and scales"] },
  { category: "Bubble & Wrap", items: ["12\" bubble wrap for small items", "24\" bubble wrap for medium items", "Kraft paper roll on holder for void fill", "Tissue paper for premium unboxing experience"] },
  { category: "Tape & Tools", items: ["2\" tape gun with clear tape", "Scissors or box cutter", "Box resizer/scorer tool", "Label printer and thermal labels"] },
  { category: "Box Inventory", items: ["3-4 standard box sizes", "Mailer boxes for small items", "Poly mailers for soft goods", "Padded mailers for small fragile items"] },
  { category: "Shipping Supplies", items: ["Packing peanuts or air pillow machine", "Shipping scale (accurate to 0.1 oz)", "Fragile/This Side Up stickers", "Packing slip pouches"] },
];

const STEEL_STRAP_INFO = {
  label: "Steel Strapping 1/2\" x .020",
  sku: "855537",
  slug: "1-2-x-020-steel-strapping",
  uses: [
    "Securing heavy pallets for LTL and truckload freight",
    "Bundling lumber, pipes, and construction materials",
    "Unitizing heavy machinery for shipping",
    "Compressing bales of cardboard or textiles",
    "Any load over 1,000 lbs where polypropylene strapping is insufficient",
  ],
};

/* ─────────────────────────── Component ─────────────────────────── */

export default function ShippingSuppliesGuide() {
  const [activeTab, setActiveTab] = useState<PackingTab>("bubble");
  const activeCategory = PACKING_CATEGORIES.find((c) => c.id === activeTab)!;

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
            <span className="text-mjs-red">Shipping Supplies Guide</span>
          </nav>

          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-mjs-red/10 border border-mjs-red/20 text-mjs-red px-3 py-1.5 rounded-full text-xs font-semibold mb-4 uppercase tracking-wider">
              <Package className="w-3.5 h-3.5" />
              Buying Guide
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
              Shipping & Packing Supplies
            </h1>
            <p className="text-lg md:text-xl text-mjs-gray-300 leading-relaxed max-w-2xl mx-auto">
              Bubble wrap, tape, packing peanuts, and strapping -- everything you need to ship
              products safely at the best wholesale price per unit.
            </p>
          </div>
        </div>
      </div>

      {/* ── Quick Jump ── */}
      <div className="border-b border-gray-100 bg-mjs-gray-50 sticky top-0 z-20">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center justify-center gap-1 py-3 overflow-x-auto scrollbar-hide">
            <span className="text-xs font-semibold text-mjs-gray-400 mr-2 shrink-0 uppercase tracking-wider">Jump to:</span>
            {["Compare", "Bubble Sizes", "Tape Guide", "Void Fill", "Steel Strapping", "Shipping Station"].map((label) => (
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

      {/* ── Category Comparison Tabs ── */}
      <div id="compare" className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-4xl font-extrabold text-mjs-dark mb-3">
            Explore Shipping Supplies
          </h2>
          <p className="text-mjs-gray-500 text-base md:text-lg max-w-2xl mx-auto">
            Select a category to see product details, sizing guides, and recommendations.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-3 mb-10 flex-wrap">
          {PACKING_CATEGORIES.map((c) => (
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

        {/* Active category detail */}
        <div className={`rounded-2xl border ${activeCategory.borderColor} overflow-hidden`}>
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-0">
            <div className={`${activeCategory.bgColor} p-6 md:p-10 border-b lg:border-b-0 lg:border-r ${activeCategory.borderColor}`}>
              <h3 className={`text-2xl md:text-3xl font-black ${activeCategory.color} mb-2`}>
                {activeCategory.name}
              </h3>
              <p className="text-sm text-mjs-gray-600 mb-6 leading-relaxed">{activeCategory.description}</p>

              <h4 className="text-xs font-semibold text-mjs-gray-400 uppercase tracking-wider mb-3">Key Features</h4>
              <ul className="space-y-2">
                {activeCategory.keyFeatures.map((f) => (
                  <li key={f} className="flex gap-2 text-sm text-mjs-gray-700">
                    <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 md:p-10 bg-white">
              {activeCategory.products.length > 0 ? (
                <>
                  <h4 className="text-xs font-semibold text-mjs-gray-400 uppercase tracking-wider mb-3">Shop {activeCategory.name}</h4>
                  <div className="space-y-2">
                    {activeCategory.products.map((p) => (
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
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-mjs-gray-400 text-sm">
                    Contact us for stretch wrap options tailored to your pallet volume and machine type.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bubble Wrap Size Chart ── */}
      <div id="bubble-sizes" className="bg-mjs-gray-50 border-y border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-3">
              Bubble Wrap Size Chart
            </h2>
            <p className="text-mjs-gray-500 max-w-2xl mx-auto">
              Choose the right width and roll length for your shipping volume.
              All rolls feature 12&quot; perforations for easy tearing.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mjs-dark text-white">
                  <th className="text-left px-4 py-3 font-semibold">Width</th>
                  <th className="text-left px-4 py-3 font-semibold">Length</th>
                  <th className="text-center px-4 py-3 font-semibold">Total Sq Ft</th>
                  <th className="text-center px-4 py-3 font-semibold">Rolls/Bundle</th>
                  <th className="text-left px-4 py-3 font-semibold">Best For</th>
                  <th className="text-center px-4 py-3 font-semibold">Cost/sqft</th>
                </tr>
              </thead>
              <tbody>
                {BUBBLE_SIZE_CHART.map((row, i) => (
                  <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-bold text-mjs-dark">{row.width}</td>
                    <td className="px-4 py-3 font-mono text-mjs-gray-600">{row.length}</td>
                    <td className="px-4 py-3 text-center font-mono text-mjs-gray-600">{row.sqft}</td>
                    <td className="px-4 py-3 text-center font-bold text-mjs-dark">{row.rolls}</td>
                    <td className="px-4 py-3 text-mjs-gray-500">{row.bestFor}</td>
                    <td className="px-4 py-3 text-center font-mono text-green-700">{row.costRange}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">
              <strong>Pro Tip:</strong> The 750&apos; rolls offer 15-20% lower cost per square foot compared to 250&apos; rolls.
              If you ship more than 20 packages per week, the bulk rolls pay for themselves quickly.
            </p>
          </div>
        </div>
      </div>

      {/* ── Tape Comparison ── */}
      <div id="tape-guide" className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-3">
            2&quot; vs 3&quot; Carton Sealing Tape
          </h2>
          <p className="text-mjs-gray-500 max-w-2xl mx-auto">
            Most businesses only need 2&quot; tape. Here is when to upgrade to 3&quot;.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-mjs-dark text-white">
                <th className="text-left px-4 py-3 font-semibold">Feature</th>
                <th className="text-center px-4 py-3 font-semibold">2&quot; Tape</th>
                <th className="text-center px-4 py-3 font-semibold">3&quot; Tape</th>
              </tr>
            </thead>
            <tbody>
              {TAPE_COMPARE.map((row) => (
                <tr key={row.feature} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-mjs-dark">{row.feature}</td>
                  <td className="px-4 py-3 text-center text-mjs-gray-600">{row.two}</td>
                  <td className="px-4 py-3 text-center text-mjs-gray-600">{row.three}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 mt-6">
          {[
            { label: "Tape 2\" x 110yd Clear (36/cs)", sku: "TAPGP220C", slug: "carton-sealing-tape-2-x-110-yards-clear-2.0-mil-36-rls-carton" },
            { label: "Tape 3\" x 110yd Clear (24/cs)", sku: "TAPGP318C", slug: "carton-sealing-tape-3-x-110-yards-clear-1-8-mil-24-rls-carton" },
            { label: "Economy Tape Gun 2\"", sku: "JMC203", slug: "tape-dispenser-economy-2-handheld" },
          ].map((p) => (
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

      {/* ── Void Fill Decision Tree ── */}
      <div id="void-fill" className="bg-mjs-gray-50 border-y border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-3">
              Void Fill Decision Guide
            </h2>
            <p className="text-mjs-gray-500 max-w-2xl mx-auto">
              Not sure what packing material to use? Find your shipping scenario below.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {VOID_FILL_DECISION.map((item) => (
              <div key={item.scenario} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <Box className="w-5 h-5 text-mjs-red" />
                  <h3 className="text-sm font-bold text-mjs-dark">{item.scenario}</h3>
                </div>
                <div className="mb-2">
                  <span className="text-xs font-semibold text-mjs-gray-400 uppercase">Recommended: </span>
                  <span className="text-sm font-bold text-blue-700">{item.recommended}</span>
                </div>
                <p className="text-xs text-mjs-gray-500 leading-relaxed">{item.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Steel Strapping ── */}
      <div id="steel-strapping" className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
        <div className="grid md:grid-cols-[1fr_1.5fr] gap-8 items-start max-w-4xl mx-auto">
          <div className="bg-mjs-gray-50 rounded-2xl border border-gray-200 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-mjs-red/10 text-mjs-red flex items-center justify-center">
                <Weight className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-mjs-dark">Steel Strapping</h2>
            </div>
            <p className="text-sm text-mjs-gray-600 mb-4 leading-relaxed">
              For heavy-duty applications where polypropylene strapping is not strong enough.
              Steel strapping provides maximum tensile strength for pallets over 1,000 lbs
              and industrial bundling.
            </p>
            <Link
              href={`/product/${STEEL_STRAP_INFO.slug}`}
              className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-100 hover:border-mjs-red/30 hover:shadow-sm transition-all group"
            >
              <div>
                <div className="text-sm font-semibold text-mjs-dark group-hover:text-mjs-red transition-colors">{STEEL_STRAP_INFO.label}</div>
                <div className="text-xs text-mjs-gray-400">SKU: {STEEL_STRAP_INFO.sku}</div>
              </div>
              <ArrowRight className="w-4 h-4 text-mjs-gray-300 group-hover:text-mjs-red transition-colors" />
            </Link>
          </div>

          <div>
            <h3 className="text-base font-bold text-mjs-dark mb-4">When to Use Steel Strapping</h3>
            <ul className="space-y-3">
              {STEEL_STRAP_INFO.uses.map((use) => (
                <li key={use} className="flex gap-2 text-sm text-mjs-gray-700">
                  <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  {use}
                </li>
              ))}
            </ul>

            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">
                <strong>Pro Tip:</strong> Steel strapping requires a tensioner and sealer (or seal-less crimper)
                for proper application. Wearing cut-resistant gloves is mandatory -- steel strap edges are razor-sharp.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── E-Commerce Shipping Station ── */}
      <div id="shipping-station" className="bg-mjs-dark">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
              E-Commerce Shipping Station Setup
            </h2>
            <p className="text-mjs-gray-400 max-w-2xl mx-auto">
              Set up an efficient packing station that keeps your team fast and your products safe.
              Here is what every shipping station needs.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SHIPPING_STATION_CHECKLIST.map((cat) => (
              <div key={cat.category} className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-mjs-gold" />
                  <h3 className="text-base font-bold text-white">{cat.category}</h3>
                </div>
                <ul className="space-y-2">
                  {cat.items.map((item) => (
                    <li key={item} className="flex gap-2 text-xs text-mjs-gray-400">
                      <Check className="w-3 h-3 text-green-400 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="bg-gradient-to-r from-mjs-red to-mjs-red-dark">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
            Stock Your Shipping Station
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Browse bubble wrap, tape, peanuts, and all packaging supplies at wholesale prices.
            Free local delivery on qualifying orders.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/category/packaging-film"
              className="inline-flex items-center gap-2 bg-white text-mjs-red font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Package className="w-4 h-4" />
              Shop Packaging & Film
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
