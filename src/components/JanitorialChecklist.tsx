"use client";

import { useState } from "react";
import {
  ChevronRight,
  ArrowRight,
  Check,
  ClipboardList,
  SprayCan,
  Layers,
  Trash2,
  Hand,
  Wrench,
  Coffee,
  Building2,
  UtensilsCrossed,
  Stethoscope,
  School,
  Warehouse,
  Home,
} from "lucide-react";
import Link from "next/link";

/* ─────────────────────────── Data ─────────────────────────── */

type CategoryId = "chemicals" | "paper" | "trash" | "gloves" | "equipment" | "breakroom";

interface ChecklistCategory {
  id: CategoryId;
  name: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  shopLink: string;
  items: { name: string; why: string; sku?: string; slug?: string }[];
}

const CATEGORIES: ChecklistCategory[] = [
  {
    id: "chemicals",
    name: "Cleaning Chemicals",
    icon: <SprayCan className="w-5 h-5" />,
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    shopLink: "/category/cleaning-chemicals",
    items: [
      { name: "Neutral Floor Cleaner", why: "Daily mopping — safe on all hard floors and waxed surfaces", sku: "3158", slug: "janitors-finest-3158-lemon-neutral-floor-cleaner" },
      { name: "Disinfectant Cleaner", why: "Kill germs on restrooms, high-touch surfaces, and common areas", sku: "91101", slug: "strike-bac-lemon-odor-disinfectant-cleaner-gallon-91101ea" },
      { name: "Glass Cleaner", why: "Mirrors, windows, display cases, and glass doors", sku: "82201", slug: "window-cleaner-concentrate-50-1" },
      { name: "Heavy-Duty Degreaser", why: "Kitchens, hoods, equipment, and tough grease buildup", sku: "80601", slug: "janitors-finest-orange-x-treme-heavy-duty-degreaser-gal-80601ea" },
      { name: "Bleach", why: "Sanitizing, whitening, and deep disinfection", sku: "52416", slug: "pure-bright-liquid-bleach-6" },
      { name: "Hand Soap (Bulk)", why: "Restroom and break room dispensers", sku: "25630", slug: "janitors-finest-25630-pink-cherry-hand-soap" },
      { name: "Dish Soap", why: "Break room sinks and kitchen areas", sku: "60001", slug: "green-lemon-scented-dish-wash" },
      { name: "Bowl Cleaner", why: "Toilet bowls and urinals — removes scale and stains", sku: "40401", slug: "bowl-cling-10-bowl-cleaner" },
    ],
  },
  {
    id: "paper",
    name: "Paper Products",
    icon: <Layers className="w-5 h-5" />,
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    shopLink: "/category/paper-products",
    items: [
      { name: "Paper Towels (Multifold or Roll)", why: "Restroom hand drying — most used supply in any facility", sku: "5300", slug: "janitors-finest-5300-premium-2-ply-white-multifold-towels-16-packs-250-sheets-4000-towels" },
      { name: "Toilet Tissue", why: "Standard 2-ply for all restrooms", sku: "5602", slug: "janitors-finest-2-ply-toilet-tissue-4-3-x-3-5-500-sheets-per-roll-96-rolls-per-case-5602" },
      { name: "Jumbo Roll Toilet Tissue", why: "High-traffic restrooms — fewer roll changes", sku: "5200", slug: "janitors-finest-5200-9jrt-2-ply-premium-jumbo-roll-paper-bathroom-tissue-12-rolls" },
      { name: "Facial Tissue", why: "Conference rooms, offices, reception areas", sku: "5701", slug: "janitors-finest-5701-boxed-facial-tissue-2-ply-white-100-sheets-box-30-cs" },
      { name: "Seat Covers", why: "Restroom hygiene — expected in professional facilities", sku: "5800", slug: "janitors-finest-5800-premium-half-fold-toilet-seat-covers-250-covers-sleeve-20-sleeves-carton" },
    ],
  },
  {
    id: "trash",
    name: "Trash Liners",
    icon: <Trash2 className="w-5 h-5" />,
    color: "text-violet-700",
    bgColor: "bg-violet-50",
    shopLink: "/category/trash-liners",
    items: [
      { name: "7-10 Gallon Liners (Desk/Bathroom)", why: "Small waste baskets and under-desk bins", sku: "CL242406", slug: "janitors-finest-can-liners-clear-24-x-24-6-micron-7-10-gallon-1000-cs-cl242406" },
      { name: "12-16 Gallon Liners (Tall Kitchen)", why: "Kitchen cans and tall restroom bins", sku: "CL243306", slug: "janitors-finest-can-liners-clear-24-x-33-6-micron-12-16-gallon-1000-cs-cl243306" },
      { name: "33 Gallon Liners (Large Office)", why: "Lobby cans, common areas, break rooms" },
      { name: "40-45 Gallon Liners (Outdoor/Large)", why: "Large round cans, cafeterias, outdoor bins", sku: "CL404814", slug: "janitors-finest-can-liners-clear-40-x-48-14-micron-40-45-gallon-250-cs-cl404814" },
      { name: "Drawstring Liners (13 Gallon)", why: "Easy tie-off for kitchen cans", sku: "LD242710WD", slug: "janitors-finest-drawstring-can-liners-white-24-x-27-10-mil-13-gallon-250-bx-ld242710wd" },
    ],
  },
  {
    id: "gloves",
    name: "Gloves & PPE",
    icon: <Hand className="w-5 h-5" />,
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    shopLink: "/category/gloves-safety",
    items: [
      { name: "Nitrile Gloves (Blue or Black)", why: "All-purpose protection — chemical resistant, latex-free", sku: "6303EA", slug: "life-guard-blue-nitrile-exam-gloves-powder-free-medium-5-mil-100-bx" },
      { name: "Vinyl Gloves", why: "Budget option for food service and light tasks", sku: "VCPF-48MEA", slug: "diamond-if48-vinyl-powder-free-exam-grade-gloves-100-bx-size-medium" },
      { name: "Multiple Sizes (S, M, L, XL)", why: "Stock all sizes — one size does NOT fit all" },
      { name: "Glove Dispenser", why: "Wall-mounted for easy access at cleaning stations", sku: "90203", slug: "alpine-industries-902-03-wall-mount-glove-dispenser-w-3-box-capacity-acrylic-clear" },
    ],
  },
  {
    id: "equipment",
    name: "Equipment & Tools",
    icon: <Wrench className="w-5 h-5" />,
    color: "text-rose-700",
    bgColor: "bg-rose-50",
    shopLink: "/category/equipment",
    items: [
      { name: "Mop Bucket & Wringer", why: "Side-press wringer for daily mopping", sku: "8036", slug: "mop-bucket-and-wringer-combo-35-qt-sidepress-yellow" },
      { name: "Wet Mop Heads", why: "Cotton or rayon — replace monthly for hygiene", sku: "UNMR24WH", slug: "cut-end-wet-mop-heads-rayon-24-oz-white" },
      { name: "Dust Mop (24\" or 36\")", why: "Daily dust mopping before wet mopping", sku: "92524B", slug: "24-x-5-blue-dust-mop-head" },
      { name: "Broom & Dustpan", why: "Angled broom for corners, lobby dustpan for common areas", sku: "2515", slug: "angler-broom-plastic-bristles-42-wood-handle-yellow" },
      { name: "Spray Bottles (3-Pack)", why: "Color-coded for different chemicals — OSHA requirement", sku: "SPRBOT3PK", slug: "32-oz-value-check-3-pack-spray-bottle" },
      { name: "Trigger Sprayers", why: "Heavy-duty replacements for spray bottles", sku: "TRIGSP-WR", slug: "white-red-heavy-duty-trigger-sprayer-9-1-4-dip-tube-28mm-28-400" },
      { name: "Microfiber Mop System", why: "For finish application and daily cleaning", sku: "EOMU18-3", slug: "18-inch-microfiber-mop-frame-and-telescopic-pole-complete" },
      { name: "Duster", why: "Feather or microfiber for desks, vents, and fixtures", sku: "UNS914FD", slug: "retractable-feather-duster-10-14" },
    ],
  },
  {
    id: "breakroom",
    name: "Breakroom Supplies",
    icon: <Coffee className="w-5 h-5" />,
    color: "text-orange-700",
    bgColor: "bg-orange-50",
    shopLink: "/category/breakroom",
    items: [
      { name: "Paper Cups (Hot)", why: "Coffee and tea — 8oz, 12oz, or 16oz", sku: "SIP121000", slug: "paper-hot-cups-12-oz-white-20-cups-sleeve-50-sleeves-carton-sip121000" },
      { name: "Paper Plates", why: "Lunch and catering", sku: "PLATE91200C", slug: "paper-plates-9-dia-white-coated-100-pack-12-packs-carton-plate91200c" },
      { name: "Cutlery (Forks, Spoons, Knives)", why: "Bulk packs for break rooms", sku: "MEFO10", slug: "mediumweight-polypropylene-forks-white-1-000-carton" },
      { name: "Napkins", why: "Beverage and luncheon napkins", sku: "5930", slug: "beverage-napkins-white-1-ply-4-75-x-4-5-4000-carton" },
    ],
  },
];

const FACILITY_GUIDES = [
  { icon: <Building2 className="w-6 h-6" />, facility: "Office (25-50 people)", color: "text-blue-600", bgColor: "bg-blue-50", monthly: ["2 cases paper towels", "2 cases toilet tissue", "1 case trash liners (7-10 gal)", "1 case trash liners (33 gal)", "2 gallons neutral floor cleaner", "1 gallon disinfectant", "1 gallon glass cleaner", "2 boxes nitrile gloves", "1 gallon hand soap", "1 case facial tissue"] },
  { icon: <UtensilsCrossed className="w-6 h-6" />, facility: "Restaurant", color: "text-amber-600", bgColor: "bg-amber-50", monthly: ["3 cases paper towels", "2 cases toilet tissue", "2 cases trash liners (33-45 gal)", "1 gallon degreaser", "1 gallon sanitizer (Sani 10%)", "1 gallon dish soap", "4 boxes nitrile gloves", "2 cases napkins", "1 gallon floor cleaner", "1 gallon bleach"] },
  { icon: <Stethoscope className="w-6 h-6" />, facility: "Medical Office", color: "text-emerald-600", bgColor: "bg-emerald-50", monthly: ["3 cases paper towels", "2 cases toilet tissue", "2 cases trash liners (various)", "2 gallons disinfectant", "1 gallon glass cleaner", "6 boxes nitrile gloves", "2 gallons hand soap", "1 case seat covers", "1 gallon floor cleaner", "1 gallon bleach"] },
  { icon: <School className="w-6 h-6" />, facility: "School / Daycare", color: "text-violet-600", bgColor: "bg-violet-50", monthly: ["5 cases paper towels", "4 cases toilet tissue", "3 cases trash liners", "3 gallons disinfectant", "2 gallons floor cleaner", "4 boxes nitrile gloves", "2 gallons hand soap", "2 cases facial tissue", "1 gallon glass cleaner", "1 case seat covers"] },
  { icon: <Warehouse className="w-6 h-6" />, facility: "Warehouse / Shop", color: "text-orange-600", bgColor: "bg-orange-50", monthly: ["1 case paper towels (roll)", "1 case toilet tissue", "2 cases trash liners (40-45 gal)", "1 gallon degreaser", "1 gallon disinfectant", "2 boxes nitrile gloves", "1 gallon hand soap", "1 case absorbent", "1 gallon floor cleaner"] },
  { icon: <Home className="w-6 h-6" />, facility: "Property Mgmt (per unit turn)", color: "text-rose-600", bgColor: "bg-rose-50", monthly: ["1 pack paper towels", "1 pack toilet tissue", "1 sleeve trash liners", "1 qt glass cleaner", "1 qt disinfectant", "1 qt all-purpose cleaner", "1 box nitrile gloves", "1 qt carpet spotter", "Mop head replacement"] },
];

/* ─────────────────────────── Component ─────────────────────────── */

export default function JanitorialChecklist() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("chemicals");

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
            <span className="text-mjs-red">Janitorial Supply Checklist</span>
          </nav>
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-mjs-red/10 border border-mjs-red/20 text-mjs-red px-3 py-1.5 rounded-full text-xs font-semibold mb-4 uppercase tracking-wider">
              <ClipboardList className="w-3.5 h-3.5" />
              Checklist
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
              Janitorial Supply<br />Checklist
            </h1>
            <p className="text-lg md:text-xl text-mjs-gray-300 leading-relaxed max-w-2xl mx-auto">
              Every chemical, paper product, tool, and supply your cleaning closet needs —
              organized by category with direct links to order.
            </p>
          </div>
        </div>
      </div>

      {/* ── Quick Jump ── */}
      <div className="border-b border-gray-100 bg-mjs-gray-50 sticky top-0 z-20">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center justify-center gap-1 py-3 overflow-x-auto scrollbar-hide">
            <span className="text-xs font-semibold text-mjs-gray-400 mr-2 shrink-0 uppercase tracking-wider">Jump to:</span>
            {["Checklist", "By Facility", "Shop All"].map((label) => (
              <a key={label} href={`#${label.toLowerCase().replace(/ /g, "-")}`} className="shrink-0 px-3 py-1.5 text-xs font-semibold rounded-full bg-white border border-gray-200 text-mjs-gray-600 hover:border-mjs-red hover:text-mjs-red transition-all">
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Interactive Checklist ── */}
      <div id="checklist" className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-4xl font-extrabold text-mjs-dark mb-3">The Master Checklist</h2>
          <p className="text-mjs-gray-500 text-base md:text-lg max-w-2xl mx-auto">
            6 categories, 35+ essential items. Select a category to see what you need and why.
          </p>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          {/* Category nav */}
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible scrollbar-hide pb-2 lg:pb-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 shrink-0 lg:shrink lg:w-full border-2 ${
                  activeCategory === cat.id
                    ? "border-mjs-red bg-white shadow-lg shadow-mjs-red/10"
                    : "border-transparent bg-mjs-gray-50 hover:bg-white hover:shadow-sm"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${activeCategory === cat.id ? "bg-mjs-red text-white" : `${cat.bgColor} ${cat.color}`}`}>
                  {cat.icon}
                </div>
                <div className="min-w-0">
                  <div className={`text-sm font-bold truncate ${activeCategory === cat.id ? "text-mjs-dark" : "text-mjs-gray-600"}`}>{cat.name}</div>
                  <div className="text-[10px] text-mjs-gray-400">{cat.items.length} items</div>
                </div>
              </button>
            ))}
          </div>

          {/* Items */}
          {(() => {
            const cat = CATEGORIES.find((c) => c.id === activeCategory)!;
            return (
              <div className="bg-mjs-gray-50 rounded-2xl border border-gray-100 p-6 md:p-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${cat.bgColor} ${cat.color} flex items-center justify-center`}>{cat.icon}</div>
                    <h3 className="text-xl font-black text-mjs-dark">{cat.name}</h3>
                  </div>
                  <Link href={cat.shopLink} className="text-xs font-semibold text-mjs-red hover:underline flex items-center gap-1">
                    Shop Category <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                <div className="space-y-2">
                  {cat.items.map((item) => (
                    <div key={item.name} className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-100">
                      <Check className="w-4 h-4 text-green-500 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-mjs-dark">{item.name}</div>
                        <div className="text-xs text-mjs-gray-400">{item.why}</div>
                      </div>
                      {item.slug && (
                        <Link href={`/product/${item.slug}`} className="shrink-0 text-xs font-semibold text-mjs-red hover:underline flex items-center gap-1">
                          View <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* ── Facility-Specific Guides ── */}
      <div id="by-facility" className="bg-mjs-dark">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">Monthly Supply Estimates by Facility</h2>
            <p className="text-mjs-gray-400 max-w-2xl mx-auto">Approximate monthly usage to help you plan orders and avoid running out.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FACILITY_GUIDES.map((f) => (
              <div key={f.facility} className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-lg ${f.bgColor} ${f.color} flex items-center justify-center`}>{f.icon}</div>
                  <h3 className="text-base font-bold text-white">{f.facility}</h3>
                </div>
                <ul className="space-y-1.5">
                  {f.monthly.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-mjs-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-mjs-gold shrink-0 mt-1.5" />
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
      <div id="shop-all" className="bg-gradient-to-r from-mjs-red to-mjs-red-dark">
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">Stock Your Cleaning Closet</h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">Everything on this checklist at wholesale prices. Free local delivery on orders $399+.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/" className="inline-flex items-center gap-2 bg-white text-mjs-red font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors">
              <ClipboardList className="w-4 h-4" /> Shop All Products
            </Link>
            <Link href="/quote" className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white font-bold px-6 py-3 rounded-lg hover:bg-white/20 transition-colors">
              Request a Custom Quote
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
