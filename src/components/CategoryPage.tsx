"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Tag, Check, X } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import type { ProductData } from "@/data/products";
import { trackViewCategory } from "@/lib/analytics";

/* ── Site category slug → display name ── */
const categoryNames: Record<string, string> = {
  "paper-products": "Paper Products",
  "cleaning-chemicals": "Cleaning Chemicals",
  "trash-liners": "Trash Liners",
  "gloves-safety": "Gloves & Safety",
  "packaging-film": "Packaging & Film",
  "breakroom": "Breakroom",
  "equipment": "Equipment & Tools",
  "floor-care": "Floor Care",
  "car-detailing": "Car Detailing",
};

/* ── Quick filter config per category ── */
const quickFilters: Record<string, { label: string; subcategories: string[] }[]> = {
  "paper-products": [
    { label: "Hardwound Roll Towels", subcategories: ["Hardwound Roll Towels", "Jumbo Roll Towels"] },
    { label: "Kitchen Towels", subcategories: ["Kitchen Roll Towels"] },
    { label: "Center-Pull", subcategories: ["Center-Pull Towels"] },
    { label: "Multifold & C-Fold", subcategories: ["Multifold Towels", "C-Fold Towels", "Singlefold Towels"] },
    { label: "Toilet Tissue", subcategories: ["Standard Toilet Tissue"] },
    { label: "Jumbo Toilet Tissue", subcategories: ["Jumbo Toilet Tissue", "Coreless Toilet Tissue"] },
    { label: "Facial Tissue", subcategories: ["Facial Tissue"] },
    { label: "Seat Covers", subcategories: ["Seat Covers"] },
    { label: "Feminine Products", subcategories: ["Feminine Products"] },
  ],
  "cleaning-chemicals": [
    { label: "Degreasers", subcategories: ["Degreasers"] },
    { label: "All Purpose", subcategories: ["__all_purpose_whitelist__"] },
    { label: "Disinfectants", subcategories: ["Disinfectants", "Bleach"] },
    { label: "Hand Soaps", subcategories: ["Hand Soap & Sanitizer"] },
    { label: "Air Fresheners", subcategories: ["Air Fresheners"] },
    { label: "Urinal Screens", subcategories: ["Urinal Screens"] },
    { label: "Dish & Laundry", subcategories: ["Dish & Laundry"] },
    { label: "Floor & Carpet", subcategories: ["Floor Care", "Floor Strippers", "Floor Finishes", "Carpet Care", "Drain Cleaners", "Floor & Carpet"] },
  ],
  "trash-liners": [
    { label: "Clear", subcategories: ["Clear Can Liners"] },
    { label: "Black", subcategories: ["Black Can Liners"] },
    { label: "Drawstring", subcategories: ["Drawstring Liners"] },
    { label: "Compostable", subcategories: ["Compostable Liners"] },
  ],
  "gloves-safety": [
    { label: "Blue Nitrile", subcategories: ["Blue Nitrile"] },
    { label: "Black Nitrile", subcategories: ["Black Nitrile"] },
    { label: "8 Mil Diamond", subcategories: ["Orange Diamond Nitrile", "Black Diamond Nitrile", "Diamond Nitrile"] },
    { label: "Latex", subcategories: ["Latex Gloves", "High Risk Latex"] },
    { label: "Vinyl", subcategories: ["Vinyl Gloves"] },
    { label: "Face Masks", subcategories: ["Face Masks"] },
    { label: "Hair & Beard", subcategories: ["Hair Protection", "Beard Covers"] },
    { label: "Aprons & PPE", subcategories: ["Aprons", "Arm Sleeves", "Shoe Covers", "Back Support"] },
    { label: "Dispensers", subcategories: ["Dispensers"] },
  ],
  "packaging-film": [
    { label: "Stretch Film", subcategories: ["Stretch Film"] },
    { label: "Colored Stretch Film", subcategories: ["Colored Stretch Film"] },
    { label: "Machine Film", subcategories: ["Machine Film"] },
    { label: "Tape", subcategories: ["Tape"] },
    { label: "Tape Guns", subcategories: ["Tape Dispensers"] },
    { label: "Bubble Wrap", subcategories: ["Bubble Wrap"] },
    { label: "Packing Peanuts", subcategories: ["Packing Peanuts"] },
    { label: "Steel Strapping", subcategories: ["Steel Strapping"] },
    { label: "Cable Ties", subcategories: ["Cable Ties"] },
    { label: "Labels", subcategories: ["Labels"] },
  ],
  "breakroom": [
    { label: "Cups & Lids", subcategories: ["Cups & Lids"] },
    { label: "Cutlery", subcategories: ["Cutlery"] },
    { label: "Plates & Bowls", subcategories: ["Plates & Bowls"] },
    { label: "Napkins", subcategories: ["Napkins"] },
    { label: "Food Storage", subcategories: ["Food Storage"] },
    { label: "Beverages", subcategories: ["Beverages"] },
  ],
  "equipment": [
    { label: "Dispensers", subcategories: ["Dispensers", "Tape Dispensers"] },
    { label: "Mops", subcategories: ["Mops & Handles", "Dust Mops"] },
    { label: "Brooms", subcategories: ["Brooms & Dustpans"] },
    { label: "Mop Buckets", subcategories: ["Buckets & Wringers"] },
    { label: "Vacuums", subcategories: ["Vacuums"] },
    { label: "Trash Cans", subcategories: ["Trash Cans", "Carts & Dollies"] },
    { label: "Window", subcategories: ["Window Equipment"] },
    { label: "Sprayers", subcategories: ["Sprayers & Bottles"] },
    { label: "Rags & Wipers", subcategories: ["Rags & Wipers", "Microfiber"] },
    { label: "Brushes & Pads", subcategories: ["Brushes & Pads", "Pad Drivers"] },
    { label: "Dusters", subcategories: ["Dusters"] },
    { label: "Batteries", subcategories: ["Batteries"] },
    { label: "Floor Machines", subcategories: ["Floor Machines", "Air Movers"] },
  ],
  "floor-care": [
    { label: "Floor Pads", subcategories: ["Floor Pads", "Stripping Pads", "Buffing Pads", "Polishing Pads", "Scrubbing Pads"] },
    { label: "Bonnets", subcategories: ["Bonnets"] },
    { label: "Chemicals", subcategories: ["Floor Care", "Floor Strippers", "Floor Finishes", "Floor & Carpet", "Carpet Care"] },
  ],
  "car-detailing": [
    { label: "Wonder Wafers", subcategories: ["__wonder_wafers__"] },
    { label: "Air Freshener Gallons", subcategories: ["__jf_air_fresheners__"] },
  ],
};

/* ── Sub-filters: secondary filter buttons that appear when a main filter is active ── */
const subFilters: Record<string, Record<string, { label: string; match: (name: string) => boolean }[]>> = {
  "trash-liners": {
    "Clear": [
      { label: "High Density", match: (n) => /micron/i.test(n) && /clear/i.test(n) },
      { label: "Low Density", match: (n) => /mil/i.test(n) && /clear/i.test(n) },
    ],
    "Black": [
      { label: "High Density", match: (n) => /micron/i.test(n) && /black/i.test(n) },
      { label: "Low Density", match: (n) => /mil/i.test(n) && /black/i.test(n) },
    ],
  },
  "equipment": {
    "Floor Machines": [
      { label: "Floor Machines", match: (n) => /hercules|walk.behind|vol.?430/i.test(n) || (/floor machine/i.test(n) && !/brush/i.test(n) && !/pad driver/i.test(n)) },
      { label: "Extractors", match: (n) => /extractor|sniper|spot.extractor/i.test(n) },
      { label: "Restroom", match: (n) => /restroom|dragon/i.test(n) },
      { label: "Air Mover", match: (n) => /air mover|genair|carpet dryer/i.test(n) },
      { label: "Pad Drivers", match: (n) => /pad driver.*bristle|pad driver.*rotary/i.test(n) },
      { label: "Floor Brushes", match: (n) => (/rotary floor brush|tampico|polypropylene.*floor|nylon.*floor/i.test(n)) && !/pad driver/i.test(n) },
      { label: "Wands & Hoses", match: (n) => /dual jet wand|wand and hose/i.test(n) },
    ],
    "Vacuums": [
      { label: "Upright", match: (n) => /upright|tradition|eureka|perfect.*p99|proforce/i.test(n) },
      { label: "Backpack", match: (n) => /backpack|super coach|gofit|mosquito/i.test(n) },
      { label: "Wet/Dry", match: (n) => /wet.*dry|storm|proguard|tank vacuum/i.test(n) },
      { label: "Bags & Filters", match: (n) => /bag|filter|janitized|replacement|cloth/i.test(n) },
    ],
    "Window": [
      { label: "Rubber Refills", match: (n) => /rubber refill|master rubber|rubber replacement/i.test(n) },
      { label: "Channels", match: (n) => /channel/i.test(n) && !/handle/i.test(n) },
      { label: "Handles", match: (n) => /handle/i.test(n) && !/extension/i.test(n) },
      { label: "Washers", match: (n) => /washer|sleeve|golden glove/i.test(n) },
      { label: "Squeegees", match: (n) => /squeeg/i.test(n) && !/handle/i.test(n) && !/holster/i.test(n) && !/soap|cleaning/i.test(n) },
      { label: "Scrapers", match: (n) => /scraper|blade/i.test(n) },
      { label: "Extension Poles", match: (n) => /extension pole|extension/i.test(n) },
      { label: "Equipment", match: (n) => /bucket|holster|belt|tool|kit|soap|cleaning/i.test(n) },
    ],
    "Rags & Wipers": [
      { label: "Microfiber", match: (n) => /microfiber|micro fiber|smartrag/i.test(n) },
      { label: "Teri Towels", match: (n) => /teri|bar mop/i.test(n) },
      { label: "Surgical", match: (n) => /surgical|blue towel/i.test(n) },
      { label: "Cloth Rags", match: (n) => /cloth rag|knit rag|colored rag|colored knit/i.test(n) },
    ],
    "Mops": [
      { label: "Dust Mop Heads", match: (n) => /dust mop head/i.test(n) },
      { label: "Dust Mop Frames", match: (n) => /dust mop frame/i.test(n) },
      { label: "Dust Mop Handles", match: (n) => /dust mop handle/i.test(n) },
      { label: "Cotton Mop", match: (n) => /cotton.*mop head|cut.end.*cotton/i.test(n) },
      { label: "Rayon Mop", match: (n) => /rayon/i.test(n) },
      { label: "Loop Mop", match: (n) => /loop.*mop|super loop|laundry/i.test(n) },
      { label: "Mop Handles", match: (n) => /mop.*handle|handle.*mop/i.test(n) && !/dust/i.test(n) },
    ],
    "Dispensers": [
      { label: "Soap", match: (n) => /soap|sanitizer|foam|hand.*dispenser/i.test(n) && !/napkin/i.test(n) },
      { label: "Roll Towel", match: (n) => /roll.*paper towel|roll towel|automated.*towel|lever/i.test(n) && !/center|multifold|m fold|c fold/i.test(n) },
      { label: "Multifold & C-Fold", match: (n) => /multifold|multi-fold|m fold|c fold|folded towel|surface.mount.*paper|surface.mount.*towel|wall mount.*paper towel|wall mount.*towel dispenser|acrylic.*(432|towel)/i.test(n) && !/soap/i.test(n) },
      { label: "Center Pull", match: (n) => /center.?pull/i.test(n) },
      { label: "Jr Jumbo Tissue", match: (n) => /jumbo|jrt|junior/i.test(n) },
      { label: "Toilet Tissue", match: (n) => /toilet.*paper|toilet.*tissue|double roll.*toilet|single roll.*toilet|2-roll/i.test(n) },
      { label: "Seat Covers", match: (n) => /seat cover/i.test(n) },
      { label: "Glove", match: (n) => /glove/i.test(n) },
      { label: "Sanitary Napkin", match: (n) => /napkin|sanitary/i.test(n) },
    ],
  },
};

// Category-specific coupon nudges (code, discount text, delay in seconds)
const CATEGORY_COUPONS: Record<string, { code: string; discount: string; delay: number }> = {
  "trash-liners": { code: "TRASH5", discount: "5% off", delay: 10 },
};

export default function CategoryPage({ slug }: { slug: string }) {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<number | null>(null);
  const [activeSubFilter, setActiveSubFilter] = useState<number | null>(null);

  // Coupon nudge
  const couponConfig = CATEGORY_COUPONS[slug];
  const [showCoupon, setShowCoupon] = useState(false);
  const [couponCopied, setCouponCopied] = useState(false);
  const [couponDismissed, setCouponDismissed] = useState(false);

  useEffect(() => {
    if (!couponConfig || couponDismissed) return;
    // Only stop showing if they already copied/claimed it
    try { if (sessionStorage.getItem(`mjs_coupon_claimed_${slug}`)) return; } catch {}
    const timer = setTimeout(() => setShowCoupon(true), couponConfig.delay * 1000);
    return () => clearTimeout(timer);
  }, [slug, couponConfig, couponDismissed]);

  const copyCoupon = useCallback(() => {
    if (!couponConfig) return;
    navigator.clipboard.writeText(couponConfig.code);
    setCouponCopied(true);
    setTimeout(() => {
      setShowCoupon(false);
      setCouponDismissed(true);
      try { sessionStorage.setItem(`mjs_coupon_claimed_${slug}`, "1"); } catch {}
    }, 1500);
  }, [couponConfig, slug]);

  const dismissCoupon = useCallback(() => {
    setShowCoupon(false);
    setCouponDismissed(true);
    // Only dismiss for this page visit — will show again on refresh
  }, []);

  const categoryName = categoryNames[slug];
  const filters = quickFilters[slug] || [];

  // Get active sub-filters for the current main filter
  const activeFilterLabel = activeFilter !== null ? filters[activeFilter]?.label : null;
  const currentSubFilters = activeFilterLabel ? subFilters[slug]?.[activeFilterLabel] || [] : [];

  useEffect(() => {
    setLoading(true);

    // For car-detailing: also fetch JF air freshener gallons from cleaning-chemicals
    if (slug === "car-detailing") {
      Promise.all([
        fetch(`/api/products/category?slug=car-detailing&limit=250`).then(r => r.json()),
        fetch(`/api/products/category?slug=cleaning-chemicals&limit=250`).then(r => r.json()),
      ]).then(([carData, chemData]) => {
        const carProducts = carData.products || [];
        const jfAirFresheners = (chemData.products || []).filter((p: ProductData) =>
          p.subcategory === "Air Fresheners" && p.brand?.toLowerCase().includes("janitors finest")
        );
        const seen = new Set(carProducts.map((p: ProductData) => p.sku));
        const merged = [...carProducts];
        for (const p of jfAirFresheners) {
          if (!seen.has(p.sku)) { seen.add(p.sku); merged.push(p); }
        }
        setProducts(merged);
        setLoading(false);
      }).catch(() => setLoading(false));
    } else
    // For gloves-safety: also fetch glove dispensers from equipment
    if (slug === "gloves-safety") {
      Promise.all([
        fetch(`/api/products/category?slug=gloves-safety&limit=250`).then(r => r.json()),
        fetch(`/api/products/category?slug=equipment&limit=250`).then(r => r.json()),
      ]).then(([gloveData, equipData]) => {
        const gloveProducts = gloveData.products || [];
        const gloveDispensers = (equipData.products || []).filter((p: ProductData) =>
          p.subcategory === "Dispensers" && /glove/i.test(p.name)
        );
        const seen = new Set(gloveProducts.map((p: ProductData) => p.sku));
        const merged = [...gloveProducts];
        for (const p of gloveDispensers) {
          if (!seen.has(p.sku)) { seen.add(p.sku); merged.push({ ...p, subcategory: "Dispensers" }); }
        }
        setProducts(merged);
        setLoading(false);
      }).catch(() => setLoading(false));
    } else
    // For floor-care: also fetch carpet/floor chemicals from cleaning-chemicals
    if (slug === "floor-care") {
      Promise.all([
        fetch(`/api/products/category?slug=floor-care&limit=250`).then(r => r.json()),
        fetch(`/api/products/category?slug=cleaning-chemicals&limit=250`).then(r => r.json()),
      ]).then(([floorData, chemData]) => {
        const floorProducts = floorData.products || [];
        // Pull in carpet/floor chemicals
        const floorChemicals = (chemData.products || []).filter((p: ProductData) =>
          ["Carpet Care", "Floor Care", "Floor Strippers", "Floor Finishes", "Floor & Carpet"].includes(p.subcategory)
        );
        // Merge and dedupe
        const seen = new Set(floorProducts.map((p: ProductData) => p.sku));
        const merged = [...floorProducts];
        for (const p of floorChemicals) {
          if (!seen.has(p.sku)) { seen.add(p.sku); merged.push(p); }
        }
        setProducts(merged);
        setLoading(false);
      }).catch(() => setLoading(false));
    } else {
      fetch(`/api/products/category?slug=${slug}&limit=250`)
        .then((res) => res.json())
        .then((data) => {
          setProducts(data.products || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [slug]);

  // Track category view when products load
  useEffect(() => {
    if (!loading && categoryName) {
      trackViewCategory(categoryName);
    }
  }, [loading, categoryName]);

  if (!categoryName) {
    return (
      <section className="bg-mjs-gray-50 min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-mjs-dark">Category Not Found</h1>
          <p className="text-mjs-gray-500 mt-2">The category you&apos;re looking for doesn&apos;t exist.</p>
          <a href="/" className="inline-block mt-4 bg-mjs-red text-white font-semibold px-6 py-2.5 rounded-lg text-sm hover:bg-red-700 transition-colors">
            Back to Home
          </a>
        </div>
      </section>
    );
  }

  let filtered = activeFilter !== null && filters[activeFilter]
    ? products.filter((p) => {
        const subs = filters[activeFilter].subcategories;
        // Special name-based filters
        if (subs.includes("__wonder_wafers__")) return /wonder wafer/i.test(p.name);
        if (subs.includes("__jf_air_fresheners__")) return /janitors finest/i.test(p.name) && p.subcategory === "Air Fresheners" && p.sku !== "31801EA";
        if (subs.includes("__all_purpose_whitelist__")) {
          const allowed = new Set(["3162EA","80301EA","12520EA","128EA","CLO60607CT","CPC53058"]);
          return allowed.has(p.sku);
        }
        return subs.includes(p.subcategory);
      })
    : products;

  // Apply sub-filter if active
  if (activeSubFilter !== null && currentSubFilters[activeSubFilter]) {
    filtered = filtered.filter((p) => currentSubFilters[activeSubFilter].match(p.name));
  }

  return (
    <section className="bg-mjs-gray-50 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-xs text-mjs-gray-400 mb-3">
            <a href="/" className="hover:text-mjs-red transition-colors">Home</a>
            <span>/</span>
            <span className="text-mjs-dark font-medium">{categoryName}</span>
            {activeFilter !== null && filters[activeFilter] && (
              <>
                <span>/</span>
                <span className="text-mjs-dark font-medium">{filters[activeFilter].label}</span>
              </>
            )}
          </div>
          <h1 className="text-2xl font-bold text-mjs-dark">{categoryName}</h1>
          <p className="text-sm text-mjs-gray-500 mt-1">
            {loading ? "Loading..." : `${filtered.length} products available`}
          </p>
        </div>

        {/* Quick Filter Buttons */}
        {filters.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 px-6 py-4 mb-6">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => { setActiveFilter(null); setActiveSubFilter(null); }}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeFilter === null
                    ? "bg-mjs-red text-white shadow-md shadow-red-200"
                    : "bg-mjs-gray-50 text-mjs-gray-600 hover:bg-red-50 hover:text-mjs-red"
                }`}
              >
                All Products
              </button>
              {filters.map((filter, i) => (
                <button
                  key={filter.label}
                  onClick={() => { setActiveFilter(activeFilter === i ? null : i); setActiveSubFilter(null); }}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                    activeFilter === i
                      ? "bg-mjs-red text-white shadow-md shadow-red-200"
                      : "bg-mjs-gray-50 text-mjs-gray-600 hover:bg-red-50 hover:text-mjs-red"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Sub-filters — appear when a main filter with sub-options is active */}
            {currentSubFilters.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 pt-3 border-t border-gray-100">
                <button
                  onClick={() => setActiveSubFilter(null)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    activeSubFilter === null
                      ? "bg-mjs-dark text-white"
                      : "bg-gray-100 text-mjs-gray-500 hover:bg-gray-200 hover:text-mjs-dark"
                  }`}
                >
                  All
                </button>
                {currentSubFilters.map((sf, i) => (
                  <button
                    key={sf.label}
                    onClick={() => setActiveSubFilter(activeSubFilter === i ? null : i)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      activeSubFilter === i
                        ? "bg-mjs-dark text-white"
                        : "bg-gray-100 text-mjs-gray-500 hover:bg-gray-200 hover:text-mjs-dark"
                    }`}
                  >
                    {sf.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-mjs-red animate-spin" />
          </div>
        )}

        {/* Product Grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="bg-white rounded-xl p-12 text-center">
            <p className="text-mjs-gray-500">No products in this category yet. Check back soon!</p>
            <a href="/" className="inline-block mt-4 bg-mjs-red text-white font-semibold px-6 py-2.5 rounded-lg text-sm hover:bg-red-700 transition-colors">
              Back to Home
            </a>
          </div>
        )}
      </div>

      {/* Coupon Nudge — push notification style, top-right */}
      {showCoupon && couponConfig && (
        <div className="fixed top-20 left-4 right-4 sm:left-auto sm:top-24 sm:right-6 z-50 animate-in slide-in-from-right-4 fade-in duration-500">
          <div className="w-full sm:w-[360px] rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
            {/* Red accent header */}
            <div className="bg-gradient-to-r from-mjs-red to-red-600 px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
                  <Tag className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">Limited Time Offer</span>
              </div>
              <button onClick={dismissCoupon} className="text-white/50 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            {/* Body */}
            <div className="bg-white px-5 py-5 text-center">
              <div className="text-2xl font-black text-mjs-dark tracking-tight">
                Exclusive {couponConfig.discount}
              </div>
              <p className="text-sm text-mjs-gray-500 mt-1 mb-5">
                Apply at checkout for {couponConfig.discount} your entire order.
              </p>
              <button
                onClick={copyCoupon}
                className={`w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-bold transition-all ${
                  couponCopied
                    ? "bg-emerald-50 border-2 border-emerald-300 text-emerald-700"
                    : "bg-mjs-dark border-2 border-mjs-dark text-white hover:bg-gray-800"
                }`}
              >
                {couponCopied ? (
                  <>
                    <Check className="w-5 h-5" />
                    Copied to Clipboard!
                  </>
                ) : (
                  <>
                    <span className="font-mono tracking-[0.25em] text-base">{couponConfig.code}</span>
                    <span className="text-white/50 text-xs font-normal">— Copy Code</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
