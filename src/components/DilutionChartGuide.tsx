"use client";

import { useState } from "react";
import {
  ChevronRight,
  ArrowRight,
  AlertTriangle,
  Info,
  Beaker,
  Droplets,
  SprayCan,
  ShieldAlert,
  Sparkles,
  Search,
  Building2,
  UtensilsCrossed,
  Stethoscope,
  School,
  Warehouse,
  Home,
} from "lucide-react";
import Link from "next/link";

/* ─────────────────────────── Data ─────────────────────────── */

type Category = "all" | "floor" | "glass" | "disinfectant" | "carpet" | "general";

interface ChemicalEntry {
  product: string;
  sku: string;
  slug: string;
  ratio: string;
  ozPerGal: string;
  category: Category;
  use: string;
  strength: "light" | "medium" | "heavy";
  note?: string;
}

const CHEMICALS: ChemicalEntry[] = [
  // Floor care
  {
    product: "Lemon Neutral Floor Cleaner",
    sku: "3158",
    slug: "janitors-finest-3158-lemon-neutral-floor-cleaner",
    ratio: "1:128",
    ozPerGal: "1 oz",
    category: "floor",
    use: "Daily mopping — all hard floors",
    strength: "light",
    note: "Safe on waxed floors. Won't strip finish.",
  },
  {
    product: "Wax Stripper Non-Ammoniated",
    sku: "20501",
    slug: "wax-stripper-non-ammoniated",
    ratio: "1:4 to 1:8",
    ozPerGal: "16-32 oz",
    category: "floor",
    use: "Stripping old floor finish",
    strength: "heavy",
    note: "1:4 for heavy buildup, 1:8 for light. Do not let dry on floor.",
  },
  {
    product: "Super Stripper Ammoniated",
    sku: "20701",
    slug: "super-stripper-ammoniated",
    ratio: "1:4 to 1:32",
    ozPerGal: "4-32 oz",
    category: "floor",
    use: "Heavy-duty stripping",
    strength: "heavy",
    note: "Most aggressive stripper. 1:4 for toughest jobs, 1:32 for light scrub.",
  },
  {
    product: "Neutralizer Rinse",
    sku: "21001",
    slug: "neutralizer-rinse",
    ratio: "1:128",
    ozPerGal: "1 oz",
    category: "floor",
    use: "Post-strip rinse to restore pH",
    strength: "light",
    note: "Required after stripping. Prevents new finish from peeling.",
  },
  {
    product: "Spray Buff",
    sku: "20301",
    slug: "spray-buff",
    ratio: "Ready to use",
    ozPerGal: "RTU",
    category: "floor",
    use: "Spray & buff maintenance between recoats",
    strength: "light",
  },
  // Glass
  {
    product: "Window Cleaner Concentrate 50:1",
    sku: "82201",
    slug: "window-cleaner-concentrate-50-1",
    ratio: "1:50",
    ozPerGal: "2.5 oz",
    category: "glass",
    use: "Windows, mirrors, glass surfaces",
    strength: "light",
    note: "Non-ammoniated. 1 gallon makes 50 gallons.",
  },
  {
    product: "Squeegee Shine Window Cleaner",
    sku: "81312",
    slug: "squeegee-shine-32-oz",
    ratio: "1:128",
    ozPerGal: "1 oz",
    category: "glass",
    use: "Windows, mirrors, chrome, countertops",
    strength: "light",
    note: "32 oz bottle makes 32 gallons of solution.",
  },
  {
    product: "Ammoniated Glass Cleaner",
    sku: "3187",
    slug: "janitors-finest-3187-ammoniated-glass-cleaner",
    ratio: "Ready to use",
    ozPerGal: "RTU",
    category: "glass",
    use: "Mirrors, windshields, display cases, porcelain",
    strength: "medium",
  },
  // Disinfectants
  {
    product: "Strike Bac Disinfectant Cleaner",
    sku: "91101",
    slug: "strike-bac-lemon-odor-disinfectant-cleaner-gallon-91101ea",
    ratio: "1:32",
    ozPerGal: "4 oz",
    category: "disinfectant",
    use: "Hard surface disinfection — floors, walls, fixtures",
    strength: "medium",
    note: "EPA approved for COVID-19. Lemon scent.",
  },
  {
    product: "Pine Disinfectant Neutral Cleaner",
    sku: "91301",
    slug: "pine-disinfectant",
    ratio: "1:64",
    ozPerGal: "2 oz",
    category: "disinfectant",
    use: "General disinfection and deodorizing",
    strength: "medium",
    note: "Kills influenza, herpes, salmonella, staph. EPA registered.",
  },
  {
    product: "Sani 10% Quaternary Sanitizer",
    sku: "91001",
    slug: "sani-10-epa-sanitizer",
    ratio: "1:256",
    ozPerGal: "0.5 oz",
    category: "disinfectant",
    use: "Food contact surface sanitizing",
    strength: "light",
    note: "Meets USDA public health requirements. No rinse needed on food surfaces at proper dilution.",
  },
  {
    product: "Pure Bright Liquid Bleach 6%",
    sku: "52416",
    slug: "pure-bright-liquid-bleach-6",
    ratio: "1:21",
    ozPerGal: "6 oz",
    category: "disinfectant",
    use: "Sanitizing, whitening, disinfecting",
    strength: "heavy",
    note: "6 oz per gallon for general cleaning. 1/3 cup per gallon for sanitizing.",
  },
  // Carpet
  {
    product: "Carpet Extraction Cleaner",
    sku: "30401",
    slug: "carpet-extraction-cleaner",
    ratio: "1:16",
    ozPerGal: "8 oz",
    category: "carpet",
    use: "Hot water extraction / steam cleaning",
    strength: "heavy",
    note: "For use in extraction machines. Great on oil-based stains.",
  },
  {
    product: "Carpet Extraction Emulsifier",
    sku: "30301",
    slug: "carpet-extraction-emlsifier",
    ratio: "1:64",
    ozPerGal: "2 oz",
    category: "carpet",
    use: "Pre-spray and extraction booster",
    strength: "medium",
    note: "Spray on high-traffic areas before extraction for best results.",
  },
  {
    product: "Dry Foam Carpet Shampoo",
    sku: "30101",
    slug: "dry-foam-carpet-shampoo",
    ratio: "1:50",
    ozPerGal: "2.5 oz",
    category: "carpet",
    use: "Dry foam and rotary carpet machines",
    strength: "medium",
    note: "Contains optical brighteners. Low moisture — carpets dry faster.",
  },
  {
    product: "Carpet Defoamer",
    sku: "30701",
    slug: "carpet-defoamer",
    ratio: "1:256",
    ozPerGal: "0.5 oz",
    category: "carpet",
    use: "Kills foam in extraction machines and wet vacs",
    strength: "light",
    note: "Add to recovery tank. A little goes a very long way.",
  },
  {
    product: "Traffic Lane Cleaner",
    sku: "30901",
    slug: "traffic-lane-cleaner",
    ratio: "1:16",
    ozPerGal: "8 oz",
    category: "carpet",
    use: "Pre-spray for heavy-traffic carpet areas",
    strength: "heavy",
  },
  // General
  {
    product: "Orange X-treme Degreaser",
    sku: "80601",
    slug: "janitors-finest-orange-x-treme-heavy-duty-degreaser-gal-80601ea",
    ratio: "1:10 to 1:64",
    ozPerGal: "2-13 oz",
    category: "general",
    use: "Heavy-duty degreasing — kitchens, hoods, equipment",
    strength: "heavy",
    note: "1:10 for heavy grease. 1:64 for light cleaning. Citrus d-limonene based.",
  },
  {
    product: "Clear Ammonia",
    sku: "82901",
    slug: "clear-ammonia",
    ratio: "1:16 to 1:64",
    ozPerGal: "2-8 oz",
    category: "general",
    use: "Floors, walls, kitchens, grease cutting",
    strength: "heavy",
    note: "Butyl-based. Strong degreaser. Ensure good ventilation.",
  },
  {
    product: "Tile and Grout Cleaner",
    sku: "41101",
    slug: "tile-grout-cleaner",
    ratio: "1:10 to 1:20",
    ozPerGal: "6-13 oz",
    category: "general",
    use: "Tubs, showers, toilets, chrome, grout lines",
    strength: "heavy",
    note: "Acid-based. Do not use on marble or natural stone.",
  },
  {
    product: "Green Lemon Dish Wash",
    sku: "60001",
    slug: "green-lemon-scented-dish-wash",
    ratio: "1:256 to 1:512",
    ozPerGal: "0.25-0.5 oz",
    category: "general",
    use: "Hand dishwashing — sinks and 3-compartment",
    strength: "light",
    note: "Highly concentrated. A small squeeze per sink basin.",
  },
  {
    product: "Odorzyme Plus Odor Eliminator",
    sku: "31801",
    slug: "janitors-finest-odorzyme-plus-odor-eliminator-spotter-gallon-31801ea",
    ratio: "Ready to use",
    ozPerGal: "RTU",
    category: "general",
    use: "Urine, vomit, pet stains, grease, blood — odor elimination",
    strength: "medium",
    note: "Enzyme-based. Pour directly on source. Allow to dwell 15+ minutes.",
  },
];

const RATIO_CONVERTER = [
  { ratio: "1:4", ozPerGal: "32 oz (1 qt)", tbspPerQt: "8 tbsp" },
  { ratio: "1:8", ozPerGal: "16 oz (1 pt)", tbspPerQt: "4 tbsp" },
  { ratio: "1:10", ozPerGal: "12.8 oz", tbspPerQt: "~3 tbsp" },
  { ratio: "1:16", ozPerGal: "8 oz (1 cup)", tbspPerQt: "2 tbsp" },
  { ratio: "1:20", ozPerGal: "6.4 oz", tbspPerQt: "~1.5 tbsp" },
  { ratio: "1:32", ozPerGal: "4 oz (1/2 cup)", tbspPerQt: "1 tbsp" },
  { ratio: "1:50", ozPerGal: "2.5 oz", tbspPerQt: "~2 tsp" },
  { ratio: "1:64", ozPerGal: "2 oz (1/4 cup)", tbspPerQt: "1.5 tsp" },
  { ratio: "1:128", ozPerGal: "1 oz (2 tbsp)", tbspPerQt: "~1 tsp" },
  { ratio: "1:256", ozPerGal: "0.5 oz (1 tbsp)", tbspPerQt: "~0.5 tsp" },
];

const CATEGORY_FILTERS: { id: Category; label: string; icon: React.ReactNode }[] = [
  { id: "all", label: "All Products", icon: <Beaker className="w-3.5 h-3.5" /> },
  { id: "floor", label: "Floor Care", icon: <Sparkles className="w-3.5 h-3.5" /> },
  { id: "glass", label: "Glass", icon: <SprayCan className="w-3.5 h-3.5" /> },
  { id: "disinfectant", label: "Disinfectants", icon: <ShieldAlert className="w-3.5 h-3.5" /> },
  { id: "carpet", label: "Carpet", icon: <Droplets className="w-3.5 h-3.5" /> },
  { id: "general", label: "General / Kitchen", icon: <UtensilsCrossed className="w-3.5 h-3.5" /> },
];

const SAFETY_RULES = [
  { title: "Never mix bleach + ammonia", desc: "Creates toxic chloramine gas. Can cause serious lung damage or death.", severity: "critical" as const },
  { title: "Never mix bleach + acids", desc: "Creates chlorine gas. This includes toilet bowl cleaners, vinegar, and rust removers.", severity: "critical" as const },
  { title: "Never mix hydrogen peroxide + vinegar", desc: "Creates peracetic acid which can irritate skin, eyes, and lungs.", severity: "warning" as const },
  { title: "Always dilute before mixing", desc: "Add chemical to water, not water to chemical. This prevents splashing of concentrated product.", severity: "warning" as const },
  { title: "Label every spray bottle", desc: "Unmarked bottles lead to accidental misuse and dangerous cross-contamination.", severity: "warning" as const },
  { title: "Wear PPE when diluting", desc: "Gloves and eye protection at minimum. Concentrates are much stronger than diluted product.", severity: "warning" as const },
];

const FACILITY_KITS = [
  {
    icon: <Building2 className="w-6 h-6" />,
    facility: "Office Building",
    chemicals: ["Neutral Floor Cleaner", "Glass Cleaner", "Disinfectant", "Hand Soap", "Dish Soap"],
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: <UtensilsCrossed className="w-6 h-6" />,
    facility: "Restaurant / Kitchen",
    chemicals: ["Degreaser", "Sanitizer (Sani 10%)", "Dish Wash", "Neutral Floor Cleaner", "Bleach"],
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  {
    icon: <Stethoscope className="w-6 h-6" />,
    facility: "Healthcare",
    chemicals: ["Disinfectant (EPA registered)", "Neutral Floor Cleaner", "Glass Cleaner", "Bleach", "Hand Soap"],
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    icon: <School className="w-6 h-6" />,
    facility: "Schools",
    chemicals: ["Disinfectant", "Neutral Floor Cleaner", "Carpet Extraction Cleaner", "Glass Cleaner", "Hand Soap"],
    color: "text-violet-600",
    bgColor: "bg-violet-50",
  },
  {
    icon: <Warehouse className="w-6 h-6" />,
    facility: "Warehouse / Industrial",
    chemicals: ["Heavy-Duty Degreaser", "Floor Stripper", "Disinfectant", "Ammonia", "Absorbent"],
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    icon: <Home className="w-6 h-6" />,
    facility: "Property Management",
    chemicals: ["Neutral Floor Cleaner", "Glass Cleaner", "Disinfectant", "Carpet Spotter", "Odor Eliminator"],
    color: "text-rose-600",
    bgColor: "bg-rose-50",
  },
];

/* ─────────────────────────── Component ─────────────────────────── */

export default function DilutionChartGuide() {
  const [activeFilter, setActiveFilter] = useState<Category>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = CHEMICALS.filter((c) => {
    const matchesCategory = activeFilter === "all" || c.category === activeFilter;
    const matchesSearch =
      searchTerm === "" ||
      c.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.use.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
            <span className="text-mjs-red">Dilution Chart</span>
          </nav>

          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-mjs-red/10 border border-mjs-red/20 text-mjs-red px-3 py-1.5 rounded-full text-xs font-semibold mb-4 uppercase tracking-wider">
              <Beaker className="w-3.5 h-3.5" />
              Reference Guide
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
              Cleaning Chemical<br />Dilution Chart
            </h1>
            <p className="text-lg md:text-xl text-mjs-gray-300 leading-relaxed max-w-2xl mx-auto">
              The exact ratio for every chemical. Stop guessing, stop wasting product,
              and stop mixing too strong or too weak.
            </p>
          </div>
        </div>
      </div>

      {/* ── Quick Jump ── */}
      <div className="border-b border-gray-100 bg-mjs-gray-50 sticky top-0 z-20">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center justify-center gap-1 py-3 overflow-x-auto scrollbar-hide">
            <span className="text-xs font-semibold text-mjs-gray-400 mr-2 shrink-0 uppercase tracking-wider">Jump to:</span>
            {["Product Chart", "Ratio Converter", "Safety Rules", "By Facility", "Shop All"].map((label) => (
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

      {/* ── Product Dilution Chart ── */}
      <div id="product-chart" className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-4xl font-extrabold text-mjs-dark mb-3">
            Dilution Ratios by Product
          </h2>
          <p className="text-mjs-gray-500 text-base md:text-lg max-w-2xl mx-auto">
            Filter by category or search by name. Every ratio is pulled directly from the manufacturer label.
          </p>
        </div>

        {/* Filters + Search */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORY_FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all
                  ${activeFilter === f.id
                    ? "bg-mjs-red text-white"
                    : "bg-mjs-gray-50 text-mjs-gray-600 hover:text-mjs-red border border-gray-200"
                  }
                `}
              >
                {f.icon}
                {f.label}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-auto sm:ml-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mjs-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-mjs-red focus:ring-1 focus:ring-mjs-red/20"
            />
          </div>
        </div>

        {/* Chart table */}
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-mjs-dark text-white">
                <th className="text-left px-4 py-3 font-semibold">Product</th>
                <th className="text-center px-4 py-3 font-semibold">Ratio</th>
                <th className="text-center px-4 py-3 font-semibold">Oz / Gallon</th>
                <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Use</th>
                <th className="text-center px-4 py-3 font-semibold">Strength</th>
                <th className="text-center px-4 py-3 font-semibold">Shop</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.sku} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-mjs-dark">{c.product}</div>
                    {c.note && <div className="text-[11px] text-mjs-gray-400 mt-0.5 max-w-xs">{c.note}</div>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-mono font-bold text-mjs-dark">{c.ratio}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-mono text-mjs-gray-600">{c.ozPerGal}</span>
                  </td>
                  <td className="px-4 py-3 text-mjs-gray-500 hidden md:table-cell text-xs">{c.use}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`
                      inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase
                      ${c.strength === "light" ? "bg-green-50 text-green-700" :
                        c.strength === "medium" ? "bg-amber-50 text-amber-700" :
                        "bg-red-50 text-red-700"}
                    `}>
                      {c.strength}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Link
                      href={`/product/${c.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-mjs-red hover:underline"
                    >
                      View <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-mjs-gray-400">
                    No products match your search. Try a different term or filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-mjs-gray-400 mt-3 text-center">
          {filtered.length} product{filtered.length !== 1 ? "s" : ""} shown. Always verify ratios on the product label.
        </p>
      </div>

      {/* ── Universal Ratio Converter ── */}
      <div id="ratio-converter" className="bg-mjs-gray-50 border-y border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-3">
              Universal Ratio Converter
            </h2>
            <p className="text-mjs-gray-500 max-w-2xl mx-auto">
              Don&apos;t have a measuring cup? This chart converts any ratio to ounces per gallon
              and tablespoons per quart. Bookmark this.
            </p>
          </div>

          <div className="max-w-3xl mx-auto overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mjs-dark text-white">
                  <th className="text-center px-4 py-3 font-semibold">Ratio</th>
                  <th className="text-center px-4 py-3 font-semibold">Oz per Gallon</th>
                  <th className="text-center px-4 py-3 font-semibold">Per Quart</th>
                  <th className="text-center px-4 py-3 font-semibold hidden sm:table-cell">Concentration</th>
                </tr>
              </thead>
              <tbody>
                {RATIO_CONVERTER.map((r, i) => (
                  <tr key={r.ratio} className={`border-t border-gray-100 ${i < 3 ? "bg-red-50/30" : i < 6 ? "" : "bg-green-50/30"}`}>
                    <td className="px-4 py-3 text-center font-mono font-bold text-mjs-dark">{r.ratio}</td>
                    <td className="px-4 py-3 text-center font-mono text-mjs-gray-600">{r.ozPerGal}</td>
                    <td className="px-4 py-3 text-center font-mono text-mjs-gray-600">{r.tbspPerQt}</td>
                    <td className="px-4 py-3 text-center hidden sm:table-cell">
                      <div className="flex justify-center">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full"
                            style={{ width: `${Math.min(100, (1 / parseInt(r.ratio.split(":")[1])) * 400 * 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 max-w-3xl mx-auto bg-blue-50 border border-blue-200 rounded-xl p-5 flex gap-4">
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-blue-800 mb-1">How to Read Ratios</p>
              <p className="text-sm text-blue-700">
                <strong>1:32</strong> means 1 part chemical to 32 parts water. For a gallon (128 oz),
                divide 128 by 32 = <strong>4 oz of chemical</strong>. Stronger ratios (1:4) use more
                chemical; weaker ratios (1:256) use less.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Safety Rules ── */}
      <div id="safety-rules" className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-3">
            Chemical Safety: Never Mix These
          </h2>
          <p className="text-mjs-gray-500 max-w-2xl mx-auto">
            Mixing the wrong chemicals creates toxic fumes that can hospitalize or kill.
            These rules are non-negotiable.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SAFETY_RULES.map((r) => (
            <div
              key={r.title}
              className={`rounded-xl border p-5 ${
                r.severity === "critical"
                  ? "bg-red-50 border-red-200"
                  : "bg-amber-50 border-amber-200"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className={`w-4 h-4 ${r.severity === "critical" ? "text-red-600" : "text-amber-600"}`} />
                <span className={`text-[10px] font-bold uppercase ${r.severity === "critical" ? "text-red-600" : "text-amber-600"}`}>
                  {r.severity === "critical" ? "Danger" : "Caution"}
                </span>
              </div>
              <h4 className={`text-sm font-bold mb-1 ${r.severity === "critical" ? "text-red-900" : "text-amber-900"}`}>
                {r.title}
              </h4>
              <p className={`text-xs ${r.severity === "critical" ? "text-red-700" : "text-amber-700"}`}>
                {r.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Facility Chemical Kits ── */}
      <div id="by-facility" className="bg-mjs-dark">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
              Essential Chemicals by Facility Type
            </h2>
            <p className="text-mjs-gray-400 max-w-2xl mx-auto">
              Not sure what chemicals your facility needs? Here are the staples for each type.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FACILITY_KITS.map((k) => (
              <div key={k.facility} className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-lg ${k.bgColor} ${k.color} flex items-center justify-center`}>
                    {k.icon}
                  </div>
                  <h3 className="text-base font-bold text-white">{k.facility}</h3>
                </div>
                <ul className="space-y-1.5">
                  {k.chemicals.map((c) => (
                    <li key={c} className="flex items-center gap-2 text-xs text-mjs-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-mjs-gold shrink-0" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Pro Tips ── */}
      <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-8 text-center">
          Dilution Pro Tips
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: "Stronger isn't better", desc: "Over-concentrated chemicals leave residue, damage surfaces, and waste money. The label ratio is the tested, effective concentration." },
            { title: "Use warm water", desc: "Most concentrates dissolve and activate better in warm (not hot) water. Hot water can break down some active ingredients." },
            { title: "Measure, don't pour", desc: "Use a measuring cup or chemical proportioner. Eyeballing leads to inconsistent results and wasted product." },
            { title: "Gallon lasts longer than you think", desc: "One gallon of 1:128 concentrate makes 128 gallons of ready-to-use solution. A case lasts most facilities 6-12 months." },
            { title: "Pre-label your bottles", desc: "Write the product name, dilution ratio, and date mixed on every spray bottle. OSHA requires it." },
            { title: "Fresh mix weekly", desc: "Diluted chemicals lose potency over time. Mix fresh batches weekly for best results, especially disinfectants." },
          ].map((t) => (
            <div key={t.title} className="bg-mjs-gray-50 border border-gray-100 rounded-xl p-5">
              <h4 className="text-sm font-bold text-mjs-dark mb-1">{t.title}</h4>
              <p className="text-xs text-mjs-gray-500 leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div id="shop-all" className="bg-gradient-to-r from-mjs-red to-mjs-red-dark">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
            Shop Professional Cleaning Chemicals
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Concentrated formulas at wholesale prices. One gallon goes further than you think.
            Free local delivery on orders $399+.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/category/cleaning-chemicals"
              className="inline-flex items-center gap-2 bg-white text-mjs-red font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Beaker className="w-4 h-4" />
              Shop All Chemicals
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
