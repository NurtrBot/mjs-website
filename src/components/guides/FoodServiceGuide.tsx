"use client";

import { useState } from "react";
import {
  ChevronRight,
  ArrowRight,
  Check,
  Info,
  Coffee,
  GlassWater,
  UtensilsCrossed,
  Layers,
  Leaf,
  Building2,
  Truck,
  School,
  ChefHat,
  CircleDollarSign,
} from "lucide-react";
import Link from "next/link";

/* ─────────────────────────── Types & Data ─────────────────────────── */

type CategoryTab = "hot-cups" | "cold-cups" | "plates" | "cutlery" | "napkins";

interface CategoryInfo {
  id: CategoryTab;
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

const CATEGORIES: CategoryInfo[] = [
  {
    id: "hot-cups",
    name: "Hot Cups",
    icon: <Coffee className="w-5 h-5" />,
    tagline: "For coffee, tea & soup",
    color: "text-orange-700",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    description:
      "Paper hot cups are lined with polyethylene to resist heat and prevent leaks. They come in standard sizes from 8oz for espresso to 16oz for large coffees. Always pair with a matching lid for takeout.",
    keyFeatures: [
      "Poly-lined paper resists heat and moisture",
      "White exterior is easy to brand with sleeves",
      "Available in 8oz, 12oz, and 16oz",
      "Pair with dome or flat sip lids (sold separately)",
      "Packed 20 cups/sleeve, 50 sleeves/carton (1,000 total)",
    ],
    products: [
      { label: "Paper Hot Cup 8oz White", sku: "SIP81000", slug: "paper-hot-cups-8-oz-white-20-cups-sleeve-50-sleeves-carton-sip81000", detail: "1,000/case - Espresso, sampling, small coffee" },
      { label: "Paper Hot Cup 12oz White", sku: "SIP121000", slug: "paper-hot-cups-12-oz-white-20-cups-sleeve-50-sleeves-carton-sip121000", detail: "1,000/case - Standard drip coffee" },
      { label: "Paper Hot Cup 16oz White", sku: "SIP161000", slug: "boardwalk-paper-hot-cups-16-oz-white-20-cups-sleeve-50-sleeves-carton-bwkwht16hcup", detail: "1,000/case - Large coffee, latte" },
    ],
  },
  {
    id: "cold-cups",
    name: "Cold Cups",
    icon: <GlassWater className="w-5 h-5" />,
    tagline: "For water, juice & soda",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    description:
      "Clear PET plastic cold cups showcase beverages beautifully. Crystal-clear construction is perfect for iced drinks, smoothies, and fountain sodas. They resist cracking and are fully recyclable where PET is accepted.",
    keyFeatures: [
      "Crystal-clear PET plastic for drink visibility",
      "Crack-resistant even when overfilled with ice",
      "Recyclable (#1 PET) in most municipalities",
      "Available in squat (12-14oz) and tall (16oz) profiles",
      "Packed 20 cups/sleeve, 50 sleeves/carton (1,000 total)",
    ],
    products: [
      { label: "Clear PET Cold Cup 12/14oz", sku: "DRINK12S1000", slug: "drink-clear-plastic-squat-cold-cups-12-14-oz-pet-20-cups-sleeve-50-sleeves-carton", detail: "1,000/case - Water, juice, iced tea" },
      { label: "Clear PET Cold Cup 16oz", sku: "DRINK161000", slug: "drink-clear-plastic-cold-cups-16-oz-pet-20-cups-sleeve-50-sleeves-carton", detail: "1,000/case - Fountain drinks, smoothies" },
    ],
  },
  {
    id: "plates",
    name: "Plates",
    icon: <Layers className="w-5 h-5" />,
    tagline: "Paper & eco-friendly",
    color: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    description:
      "Disposable plates range from economical coated paper for light snacks to heavy-duty bagasse (sugarcane fiber) plates that can handle a full meal. Bagasse is fully compostable and grease-resistant, making it the premium eco-friendly choice.",
    keyFeatures: [
      "Coated paper plates are budget-friendly for light foods",
      "Bagasse plates handle hot, wet, and greasy foods",
      "Bagasse is compostable in commercial facilities",
      "Microwave-safe (bagasse only)",
      "9-inch diameter fits standard meals",
    ],
    products: [
      { label: "Coated Paper Plate 9\"", sku: "PLATE91200C", slug: "paper-plates-9-dia-white-coated-100-pack-12-packs-carton-plate91200c", detail: "1,200/case - Light snacks, desserts, dry foods" },
      { label: "Bagasse Plate 9\" (Eco)", sku: "BWKPLATEWF9", slug: "bagasse-dinnerware-plate-9-dia-white-500-carton-bwkplatewf9", detail: "500/case - Full meals, compostable, grease-resistant" },
    ],
  },
  {
    id: "cutlery",
    name: "Cutlery",
    icon: <UtensilsCrossed className="w-5 h-5" />,
    tagline: "Forks, knives & spoons",
    color: "text-violet-700",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-200",
    description:
      "Polypropylene cutlery comes in mediumweight and heavyweight grades. Mediumweight is suitable for soft foods like pasta and salads. Heavyweight is engineered for dense foods like steak and root vegetables without bending or snapping.",
    keyFeatures: [
      "Polypropylene is strong, food-safe, and BPA-free",
      "Mediumweight: cost-effective for cafeterias and catering",
      "Heavyweight: restaurant-quality rigidity and feel",
      "White color is standard and professional",
      "Packed 1,000/carton for high-volume use",
    ],
    products: [
      { label: "Mediumweight PP Forks", sku: "MEFO10", slug: "mediumweight-polypropylene-forks-white-1-000-carton", detail: "1,000/case - Salads, pasta, soft foods" },
      { label: "Heavyweight PP Forks", sku: "HEFO", slug: "heavyweight-polypropylene-forks-white-1-000-carton", detail: "1,000/case - Steaks, dense foods, premium events" },
    ],
  },
  {
    id: "napkins",
    name: "Napkins",
    icon: <Layers className="w-5 h-5" />,
    tagline: "Beverage to dinner",
    color: "text-rose-700",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
    description:
      "Napkins vary by size, ply, and intended use. Beverage napkins (1-ply, 4.75\") go under drinks at bars. Dinner napkins (2-ply, 15x17\") handle full meals. Dispenser napkins are interfolded for self-serve stations and save waste.",
    keyFeatures: [
      "Beverage: 1-ply, 4.75\" square, bars and cocktail service",
      "Dinner: 2-ply, 15x17\", 1/8 fold, formal dining",
      "Dispenser: Interfolded for Tork/Georgia-Pacific dispensers",
      "Higher ply = more absorbent and durable",
      "Bulk cases reduce per-napkin cost",
    ],
    products: [
      { label: "Beverage Napkins 1-Ply", sku: "5930", slug: "beverage-napkins-white-1-ply-4-75-x-4-5-4000-carton", detail: "4,000/case - Bars, cocktail service, coffee shops" },
      { label: "Dinner Napkins 2-Ply", sku: "5900", slug: "sunnycare-2-ply-1-8-fold-white-dinner-napkin-15-x-17-3000-cs", detail: "3,000/case - Full-service dining, events, catering" },
      { label: "Dispenser Napkins Interfolded", sku: "5963P", slug: "kwik-nap-dispenser-napkins-interfolded-2-ply-8-86-x-6-3-white-6000-carton", detail: "6,000/case - Self-serve counters, fast-casual" },
    ],
  },
];

const CUP_SIZE_GUIDE = [
  { size: "3.5oz", name: "Sampling Cup", use: "Tasting samples, condiment portions, mouthwash", temp: "Hot or Cold", popular: false },
  { size: "5oz", name: "Bathroom / Water Cup", use: "Restroom dispensers, water coolers", temp: "Cold", popular: false },
  { size: "8oz", name: "Small Coffee", use: "Espresso, cappuccino, small drip coffee, hot tea", temp: "Hot", popular: true },
  { size: "10oz", name: "Medium Cold", use: "Kids drinks, juice, small iced tea", temp: "Cold", popular: false },
  { size: "12oz", name: "Standard Coffee", use: "Regular drip coffee, latte, iced coffee", temp: "Hot & Cold", popular: true },
  { size: "16oz", name: "Large", use: "Large coffee, fountain drinks, smoothies, iced tea", temp: "Hot & Cold", popular: true },
  { size: "20oz", name: "Extra Large", use: "Big fountain drinks, movie theater", temp: "Cold", popular: false },
  { size: "24oz", name: "Jumbo", use: "Supersize fountain, specialty cold drinks", temp: "Cold", popular: false },
];

const MATERIAL_COMPARE = [
  { feature: "Temperature", paper: "Hot only", plastic: "Cold only", foam: "Hot & Cold" },
  { feature: "Insulation", paper: "Low (needs sleeve)", plastic: "None", foam: "Excellent" },
  { feature: "Cost per Cup", paper: "$0.04-0.08", plastic: "$0.03-0.06", foam: "$0.03-0.05" },
  { feature: "Recyclable", paper: "Limited (coated)", plastic: "Yes (#1 PET)", foam: "No" },
  { feature: "Compostable Options", paper: "Yes (PLA-lined)", plastic: "Limited", foam: "No" },
  { feature: "Leak Resistance", paper: "Good (poly-lined)", plastic: "Excellent", foam: "Good" },
  { feature: "Print/Brand", paper: "Easy (custom sleeves)", plastic: "Moderate", foam: "Difficult" },
];

const NAPKIN_TYPES = [
  { type: "Beverage", size: '4.75" x 4.5"', ply: "1-Ply", perCase: "4,000", costPer: "~$0.005", bestFor: "Bars, coffee shops, cocktails" },
  { type: "Luncheon", size: '6.5" x 6.5"', ply: "1-Ply", perCase: "6,000", costPer: "~$0.004", bestFor: "Fast food, cafeterias, self-serve" },
  { type: "Dinner", size: '15" x 17"', ply: "2-Ply", perCase: "3,000", costPer: "~$0.01", bestFor: "Sit-down restaurants, catering, events" },
  { type: "Dispenser", size: '8.86" x 6.3"', ply: "2-Ply", perCase: "6,000", costPer: "~$0.005", bestFor: "Fast-casual counters, self-serve stations" },
];

const INDUSTRY_PICKS = [
  {
    icon: <ChefHat className="w-6 h-6" />,
    industry: "Full-Service Restaurant",
    pick: "HW Cutlery + Dinner Napkins + Bagasse Plates",
    why: "Upscale feel with heavyweight forks and 2-ply dinner napkins. Bagasse plates for takeout show eco-consciousness customers love.",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    icon: <Truck className="w-6 h-6" />,
    industry: "Catering & Events",
    pick: "Bagasse Plates + HW Cutlery + Dinner Napkins",
    why: "Compostable plates handle heavy, saucy meals. Heavyweight cutlery won't embarrass you. Buy in bulk for per-event savings.",
    color: "text-violet-600",
    bgColor: "bg-violet-50",
  },
  {
    icon: <Building2 className="w-6 h-6" />,
    industry: "Office Breakroom",
    pick: "8oz & 12oz Hot Cups + MW Cutlery + Beverage Napkins",
    why: "Coffee is king in offices. Stock two cup sizes and mediumweight cutlery for lunches. Beverage napkins by the coffee maker.",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: <School className="w-6 h-6" />,
    industry: "School Cafeteria",
    pick: "Coated Plates + MW Cutlery + Dispenser Napkins",
    why: "Budget-friendly coated plates for pizza and sandwiches. Dispenser napkins reduce waste from students grabbing handfuls.",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
];

const COST_PER_SETTING = [
  { setting: "Basic (plate + MW fork + bev napkin)", low: "$0.05", mid: "$0.07", high: "$0.09" },
  { setting: "Standard (plate + HW fork/knife + dinner napkin)", low: "$0.10", mid: "$0.14", high: "$0.18" },
  { setting: "Premium Eco (bagasse + HW fork/knife + dinner napkin)", low: "$0.14", mid: "$0.18", high: "$0.22" },
  { setting: "Full Beverage (hot cup + lid + sleeve + bev napkin)", low: "$0.08", mid: "$0.11", high: "$0.14" },
  { setting: "Cold Drink (clear cup + flat lid + straw + bev napkin)", low: "$0.06", mid: "$0.09", high: "$0.12" },
];

/* ─────────────────────────── Component ─────────────────────────── */

export default function FoodServiceGuide() {
  const [activeTab, setActiveTab] = useState<CategoryTab>("hot-cups");
  const activeCategory = CATEGORIES.find((c) => c.id === activeTab)!;

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
            <span className="text-mjs-red">Food Service Disposables</span>
          </nav>

          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-mjs-red/10 border border-mjs-red/20 text-mjs-red px-3 py-1.5 rounded-full text-xs font-semibold mb-4 uppercase tracking-wider">
              <UtensilsCrossed className="w-3.5 h-3.5" />
              Buying Guide
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
              Food Service Disposables
            </h1>
            <p className="text-lg md:text-xl text-mjs-gray-300 leading-relaxed max-w-2xl mx-auto">
              Cups, plates, cutlery, and napkins -- the complete guide to stocking your kitchen,
              breakroom, or catering operation at wholesale prices.
            </p>
          </div>
        </div>
      </div>

      {/* ── Quick Jump ── */}
      <div className="border-b border-gray-100 bg-mjs-gray-50 sticky top-0 z-20">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center justify-center gap-1 py-3 overflow-x-auto scrollbar-hide">
            <span className="text-xs font-semibold text-mjs-gray-400 mr-2 shrink-0 uppercase tracking-wider">Jump to:</span>
            {["Compare", "Cup Sizes", "Materials", "Cutlery", "Napkins", "Eco-Friendly", "Cost Guide", "By Industry"].map((label) => (
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
            Explore by Category
          </h2>
          <p className="text-mjs-gray-500 text-base md:text-lg max-w-2xl mx-auto">
            Select a disposable category to see sizes, materials, and product recommendations.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-3 mb-10 flex-wrap">
          {CATEGORIES.map((c) => (
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
            {/* Left */}
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

            {/* Right - Products */}
            <div className="p-6 md:p-10 bg-white">
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
            </div>
          </div>
        </div>
      </div>

      {/* ── Cup Size Guide ── */}
      <div id="cup-sizes" className="bg-mjs-gray-50 border-y border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-3">
              Cup Size Guide
            </h2>
            <p className="text-mjs-gray-500 max-w-2xl mx-auto">
              From sampling cups to jumbo fountain drinks, here is what each size is designed for.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mjs-dark text-white">
                  <th className="text-left px-4 py-3 font-semibold">Size</th>
                  <th className="text-left px-4 py-3 font-semibold">Common Name</th>
                  <th className="text-left px-4 py-3 font-semibold">Best Use Cases</th>
                  <th className="text-center px-4 py-3 font-semibold">Temp</th>
                </tr>
              </thead>
              <tbody>
                {CUP_SIZE_GUIDE.map((c) => (
                  <tr key={c.size} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-bold text-mjs-dark">
                      {c.size}
                      {c.popular && (
                        <span className="ml-2 inline-flex items-center gap-1 text-mjs-red font-semibold text-[10px]">
                          <Check className="w-3 h-3" /> Popular
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-mjs-gray-600">{c.name}</td>
                    <td className="px-4 py-3 text-mjs-gray-500">{c.use}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        c.temp === "Hot" ? "bg-orange-50 text-orange-700" :
                        c.temp === "Cold" ? "bg-blue-50 text-blue-700" :
                        "bg-violet-50 text-violet-700"
                      }`}>
                        {c.temp}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Hot vs Cold Material Comparison ── */}
      <div id="materials" className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-3">
            Paper vs Plastic vs Foam
          </h2>
          <p className="text-mjs-gray-500 max-w-2xl mx-auto">
            Each cup material excels in different situations. Paper is the standard for hot beverages.
            Clear PET plastic showcases cold drinks. Foam insulates but has environmental trade-offs.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-mjs-dark text-white">
                <th className="text-left px-4 py-3 font-semibold">Feature</th>
                <th className="text-center px-4 py-3 font-semibold">Paper (Hot)</th>
                <th className="text-center px-4 py-3 font-semibold">PET Plastic (Cold)</th>
                <th className="text-center px-4 py-3 font-semibold">Foam (Both)</th>
              </tr>
            </thead>
            <tbody>
              {MATERIAL_COMPARE.map((row) => (
                <tr key={row.feature} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-mjs-dark">{row.feature}</td>
                  <td className="px-4 py-3 text-center text-orange-700 font-medium">{row.paper}</td>
                  <td className="px-4 py-3 text-center text-blue-700 font-medium">{row.plastic}</td>
                  <td className="px-4 py-3 text-center text-gray-600 font-medium">{row.foam}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700">
            <strong>Pro Tip:</strong> Many municipalities are banning foam cups. Check local regulations before stocking foam.
            Paper and PET plastic are the safest bets for long-term compliance.
          </p>
        </div>
      </div>

      {/* ── Cutlery Weight Guide ── */}
      <div id="cutlery" className="bg-mjs-gray-50 border-y border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-3">
              Cutlery Weight Guide
            </h2>
            <p className="text-mjs-gray-500 max-w-2xl mx-auto">
              The difference between mediumweight and heavyweight cutlery matters more than you think.
              Nothing ruins a meal like a fork that snaps in a piece of chicken.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Mediumweight */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-black text-sm">MW</div>
                <div>
                  <h3 className="text-lg font-bold text-mjs-dark">Mediumweight</h3>
                  <span className="text-xs text-mjs-gray-400">Budget-friendly everyday cutlery</span>
                </div>
              </div>
              <ul className="space-y-2 mb-4">
                {["Cafeterias and breakrooms", "Salads, pasta, soft foods", "Takeout containers with pre-cut food", "Events where cost control matters", "Environments with frequent turnover"].map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-mjs-gray-600">
                    <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/product/mediumweight-polypropylene-forks-white-1-000-carton"
                className="flex items-center justify-between bg-mjs-gray-50 rounded-lg p-3 border border-gray-100 hover:border-mjs-red/30 transition-all group"
              >
                <div>
                  <div className="text-sm font-semibold text-mjs-dark group-hover:text-mjs-red transition-colors">MW Forks - 1,000/case</div>
                  <div className="text-xs text-mjs-gray-400">SKU: MEFO10</div>
                </div>
                <ArrowRight className="w-4 h-4 text-mjs-gray-300 group-hover:text-mjs-red transition-colors" />
              </Link>
            </div>

            {/* Heavyweight */}
            <div className="bg-white rounded-xl border-2 border-violet-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center font-black text-sm">HW</div>
                <div>
                  <h3 className="text-lg font-bold text-mjs-dark">Heavyweight</h3>
                  <span className="text-xs text-violet-600 font-semibold">Premium pick</span>
                </div>
              </div>
              <ul className="space-y-2 mb-4">
                {["Full-service restaurants (dine-in to-go)", "Steaks, ribs, root vegetables", "Catering and events where presentation matters", "BBQ and food trucks with hearty portions", "Any food that requires cutting force"].map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-mjs-gray-600">
                    <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/product/heavyweight-polypropylene-forks-white-1-000-carton"
                className="flex items-center justify-between bg-mjs-gray-50 rounded-lg p-3 border border-gray-100 hover:border-mjs-red/30 transition-all group"
              >
                <div>
                  <div className="text-sm font-semibold text-mjs-dark group-hover:text-mjs-red transition-colors">HW Forks - 1,000/case</div>
                  <div className="text-xs text-mjs-gray-400">SKU: HEFO</div>
                </div>
                <ArrowRight className="w-4 h-4 text-mjs-gray-300 group-hover:text-mjs-red transition-colors" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Napkin Types ── */}
      <div id="napkins" className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-3">
            Napkin Types Compared
          </h2>
          <p className="text-mjs-gray-500 max-w-2xl mx-auto">
            Matching the right napkin to the right setting saves money and elevates the experience.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-mjs-dark text-white">
                <th className="text-left px-4 py-3 font-semibold">Type</th>
                <th className="text-left px-4 py-3 font-semibold">Size</th>
                <th className="text-center px-4 py-3 font-semibold">Ply</th>
                <th className="text-center px-4 py-3 font-semibold">Per Case</th>
                <th className="text-center px-4 py-3 font-semibold">Cost/Napkin</th>
                <th className="text-left px-4 py-3 font-semibold">Best For</th>
              </tr>
            </thead>
            <tbody>
              {NAPKIN_TYPES.map((n) => (
                <tr key={n.type} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-bold text-mjs-dark">{n.type}</td>
                  <td className="px-4 py-3 font-mono text-mjs-gray-600">{n.size}</td>
                  <td className="px-4 py-3 text-center font-medium text-mjs-gray-600">{n.ply}</td>
                  <td className="px-4 py-3 text-center font-mono text-mjs-gray-600">{n.perCase}</td>
                  <td className="px-4 py-3 text-center font-mono text-green-700">{n.costPer}</td>
                  <td className="px-4 py-3 text-mjs-gray-500">{n.bestFor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700">
            <strong>Pro Tip:</strong> Dispenser napkins reduce waste by 30-40% compared to loose stacks.
            Customers take one at a time instead of grabbing a fistful. The dispenser pays for itself in the first month.
          </p>
        </div>
      </div>

      {/* ── Eco-Friendly Section ── */}
      <div id="eco-friendly" className="bg-mjs-gray-50 border-y border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-green-700 mb-3">
              <Leaf className="w-5 h-5" />
              <span className="text-xs font-semibold uppercase tracking-wider">Sustainable Choice</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-3">
              Eco-Friendly Alternatives
            </h2>
            <p className="text-mjs-gray-500 max-w-2xl mx-auto">
              Bagasse (sugarcane fiber) plates are the leading sustainable alternative. They are made from
              agricultural waste, compostable in commercial facilities, and strong enough for a full meal.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-mjs-dark mb-4">Why Bagasse?</h3>
              <ul className="space-y-2">
                {[
                  "Made from sugarcane pulp (agricultural byproduct)",
                  "Commercially compostable (BPI certified)",
                  "Grease and moisture resistant without coatings",
                  "Microwave safe for reheating",
                  "Comparable strength to foam and plastic plates",
                  "Shows environmental commitment to customers",
                ].map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-mjs-gray-600">
                    <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-green-200 p-6">
              <h3 className="text-lg font-bold text-green-700 mb-4">Shop Eco-Friendly</h3>
              <Link
                href="/product/bagasse-dinnerware-plate-9-dia-white-500-carton-bwkplatewf9"
                className="flex items-center justify-between bg-green-50 rounded-lg p-4 border border-green-100 hover:border-green-300 transition-all group mb-3"
              >
                <div>
                  <div className="text-sm font-semibold text-mjs-dark group-hover:text-green-700 transition-colors">Bagasse Plate 9&quot;</div>
                  <div className="text-xs text-mjs-gray-400">SKU: BWKPLATEWF9 &middot; 500/case</div>
                </div>
                <ArrowRight className="w-4 h-4 text-mjs-gray-300 group-hover:text-green-700 transition-colors" />
              </Link>
              <p className="text-xs text-mjs-gray-500">
                Compare: Bagasse plates cost about $0.06/plate vs $0.03/plate for coated paper.
                The premium is modest considering the environmental benefit and superior performance with hot, greasy foods.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Cost Per Setting ── */}
      <div id="cost-guide" className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-mjs-dark mb-3">
            <CircleDollarSign className="w-5 h-5" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-3">
            Cost Per Setting Estimates
          </h2>
          <p className="text-mjs-gray-500 max-w-2xl mx-auto">
            Use these estimates to forecast your disposable costs per meal or beverage served.
            Prices reflect bulk wholesale pricing.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-mjs-dark text-white">
                <th className="text-left px-4 py-3 font-semibold">Setting</th>
                <th className="text-center px-4 py-3 font-semibold">Low Est.</th>
                <th className="text-center px-4 py-3 font-semibold">Mid Est.</th>
                <th className="text-center px-4 py-3 font-semibold">High Est.</th>
              </tr>
            </thead>
            <tbody>
              {COST_PER_SETTING.map((row) => (
                <tr key={row.setting} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-mjs-dark">{row.setting}</td>
                  <td className="px-4 py-3 text-center font-mono text-green-700">{row.low}</td>
                  <td className="px-4 py-3 text-center font-mono text-blue-700">{row.mid}</td>
                  <td className="px-4 py-3 text-center font-mono text-orange-700">{row.high}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700">
            <strong>Pro Tip:</strong> Track your disposable cost per meal as a KPI. Most successful food
            operations keep disposable costs under 3% of the plate price. If you are spending $0.18 on
            disposables, your plate price should be at least $6.00.
          </p>
        </div>
      </div>

      {/* ── Industry Recommendations ── */}
      <div id="by-industry" className="bg-mjs-dark">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
              Recommended Setups by Industry
            </h2>
            <p className="text-mjs-gray-400 max-w-2xl mx-auto">
              Our top picks based on what works best for each type of food service operation.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
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
            Stock Your Kitchen Today
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Browse our full selection of food service disposables -- cups, plates, cutlery, napkins, and more.
            Wholesale pricing with free local delivery.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/category/breakroom"
              className="inline-flex items-center gap-2 bg-white text-mjs-red font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <UtensilsCrossed className="w-4 h-4" />
              Shop Breakroom & Food Service
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
