"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { X, Loader2, ArrowRight, Minus, Plus, ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { trackAddToCart } from "@/lib/analytics";
import { getTierPrice } from "@/lib/tier-pricing";
import ProductCard from "@/components/ProductCard";
import type { ProductData } from "@/data/products";

/* ── Types ── */
type Hotspot = {
  id: string;
  x: number;
  y: number;
  label: string;
  categorySlug: string;
  subcategories: string[];
  nameFilter?: string;
  searchQuery?: string;
  categoryLink: string;
};

type Scene = {
  id: string;
  name: string;
  image: string;
  description: string;
  hotspots: Hotspot[];
};

/* ── Scene Data ── */
const scenes: Scene[] = [
  {
    id: "restroom",
    name: "Restroom",
    image: "/images/workspace-restroom.png",
    description:
      "Keep restrooms clean, stocked, and professional. From dispensers and toilet tissue to hand soap and air fresheners — everything you need in one place.",
    hotspots: [
      { id: "r1", x: 42, y: 22, label: "Paper Towel Dispensers", categorySlug: "equipment", subcategories: ["Dispensers"], nameFilter: "roll.*towel|paper.*towel|multifold|multi-fold|m.fold|c.fold|center.pull|folded|lever|automated", categoryLink: "/category/equipment" },
      { id: "r2", x: 22, y: 28, label: "Soap Dispensers", categorySlug: "equipment", subcategories: ["Dispensers"], nameFilter: "soap|sanitizer|foam|hand.*dispenser", categoryLink: "/category/equipment" },
      { id: "r3", x: 28, y: 72, label: "Trash Liners", categorySlug: "trash-liners", subcategories: ["Clear Can Liners", "Black Can Liners", "Drawstring Liners"], categoryLink: "/category/trash-liners" },
      { id: "r4", x: 82, y: 58, label: "Urinal Screens", categorySlug: "cleaning-chemicals", subcategories: ["Urinal Screens"], categoryLink: "/category/cleaning-chemicals" },
      { id: "r5", x: 50, y: 85, label: "Floor Cleaners & Mops", categorySlug: "cleaning-chemicals", subcategories: ["Floor Care", "Floor Strippers", "Floor Finishes"], categoryLink: "/category/cleaning-chemicals" },
      { id: "r6", x: 58, y: 35, label: "Paper Products", categorySlug: "paper-products", subcategories: ["Standard Toilet Tissue", "Jumbo Toilet Tissue", "Coreless Toilet Tissue", "Seat Covers"], categoryLink: "/category/paper-products" },
    ],
  },
  {
    id: "breakroom",
    name: "Breakroom",
    image: "/images/workspace-breakroom.png",
    description:
      "Stock your breakroom with everything employees and guests need. Cups, plates, cutlery, napkins, and cleaning supplies — all at wholesale prices.",
    hotspots: [
      { id: "b1", x: 48, y: 62, label: "Trash Liners", categorySlug: "trash-liners", subcategories: ["Clear Can Liners", "Black Can Liners", "Drawstring Liners"], categoryLink: "/category/trash-liners" },
      { id: "b2", x: 75, y: 38, label: "Cups & Lids", categorySlug: "breakroom", subcategories: ["Cups & Lids"], categoryLink: "/category/breakroom" },
      { id: "b3", x: 88, y: 48, label: "Plates & Cutlery", categorySlug: "breakroom", subcategories: ["Plates & Bowls", "Cutlery"], categoryLink: "/category/breakroom" },
      { id: "b4", x: 35, y: 75, label: "Disinfectants & All Purpose", categorySlug: "cleaning-chemicals", subcategories: ["Disinfectants", "Bleach"], nameFilter: "disinfect|all.purpose|multi.surface|clorox|lysol|fabuloso|lavender|pine", categoryLink: "/category/cleaning-chemicals" },
    ],
  },
  {
    id: "office",
    name: "Office",
    image: "/images/workspace-office.png",
    description:
      "Maintain a clean and professional work environment. Dusters, trash liners, air fresheners, and vacuums keep every desk and common area looking its best.",
    hotspots: [
      { id: "o1", x: 88, y: 45, label: "Copy Paper", categorySlug: "paper-products", subcategories: ["Copy Paper", "Office Paper"], categoryLink: "/category/paper-products" },
      { id: "o2", x: 50, y: 78, label: "Trash Liners", categorySlug: "trash-liners", subcategories: ["Clear Can Liners", "Black Can Liners", "Drawstring Liners"], categoryLink: "/category/trash-liners" },
      { id: "o3", x: 67, y: 35, label: "Cups & Lids", categorySlug: "breakroom", subcategories: ["Cups & Lids"], categoryLink: "/category/breakroom" },
      { id: "o4", x: 52, y: 48, label: "Office Supplies", categorySlug: "equipment", subcategories: ["Sprayers & Bottles", "Rags & Wipers", "Microfiber"], categoryLink: "/category/equipment" },
      { id: "o5", x: 15, y: 85, label: "Carpet Care & Vacuums", categorySlug: "equipment", subcategories: ["Vacuums"], categoryLink: "/category/equipment" },
    ],
  },
  {
    id: "portable-toilets",
    name: "Portable Toilets",
    image: "/images/workspace-portable-toilets.png",
    description:
      "Keep portable restrooms clean, stocked, and serviced. Blue deodorizers, paper products, hand soap, and towels — everything a portable sanitation operator needs.",
    hotspots: [
      { id: "p1", x: 62, y: 58, label: "Blue Deodorizers", categorySlug: "equipment", subcategories: [], searchQuery: "JC", categoryLink: "/search?q=JC" },
      { id: "p2", x: 28, y: 55, label: "Hand Soap", categorySlug: "cleaning-chemicals", subcategories: ["Hand Soap & Sanitizer"], categoryLink: "/category/cleaning-chemicals" },
      { id: "p3", x: 25, y: 28, label: "Paper Towels", categorySlug: "paper-products", subcategories: ["Singlefold Towels", "Multifold Towels"], categoryLink: "/category/paper-products" },
      { id: "p4", x: 72, y: 45, label: "Toilet Paper", categorySlug: "paper-products", subcategories: ["Standard Toilet Tissue", "Jumbo Toilet Tissue", "Coreless Toilet Tissue"], categoryLink: "/category/paper-products" },
    ],
  },
  {
    id: "warehouse",
    name: "Warehouse",
    image: "/images/workspace-warehouse.png",
    description:
      "Keep your warehouse running efficiently with packaging supplies and safety gear. Stretch film, tape, gloves, brooms, and more at wholesale prices.",
    hotspots: [
      { id: "w1", x: 45, y: 48, label: "Tape & Tape Guns", categorySlug: "packaging-film", subcategories: ["Tape", "Tape Dispensers"], categoryLink: "/category/packaging-film" },
      { id: "w2", x: 15, y: 58, label: "Stretch Film", categorySlug: "packaging-film", subcategories: ["Stretch Film", "Colored Stretch Film", "Machine Film"], categoryLink: "/category/packaging-film" },
      { id: "w3", x: 7, y: 40, label: "Trash Liners", categorySlug: "trash-liners", subcategories: ["Clear Can Liners", "Black Can Liners", "Drawstring Liners"], categoryLink: "/category/trash-liners" },
      { id: "w4", x: 72, y: 68, label: "Degreasers", categorySlug: "cleaning-chemicals", subcategories: ["Degreasers"], categoryLink: "/category/cleaning-chemicals" },
    ],
  },
];

/* ── Product cache ── */
const productCache: Record<string, ProductData[]> = {};

export default function ShopByWorkspace() {
  const [activeScene, setActiveScene] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [popupProducts, setPopupProducts] = useState<ProductData[]>([]);
  const [popupLoading, setPopupLoading] = useState(false);
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addedSkus, setAddedSkus] = useState<Set<string>>(new Set());
  const [essentials, setEssentials] = useState<ProductData[]>([]);
  const [essentialsLoading, setEssentialsLoading] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();

  const scene = scenes[activeScene];

  const getQty = (sku: string) => quantities[sku] || 1;
  const setQty = (sku: string, q: number) => setQuantities((prev) => ({ ...prev, [sku]: Math.max(1, q) }));

  const handleAddToCart = (product: ProductData) => {
    const qty = getQty(product.sku);
    const tierPrice = getTierPrice(product, qty);
    addItem({
      slug: product.slug,
      sku: product.sku,
      name: product.cardTitle,
      brand: product.brand,
      price: tierPrice,
      image: product.images[0],
      pack: product.pack,
    }, qty);
    trackAddToCart({ sku: product.sku, name: product.cardTitle, price: tierPrice, quantity: qty, category: product.category, brand: product.brand });
    setAddedSkus((prev) => new Set(prev).add(product.sku));
    setTimeout(() => setAddedSkus((prev) => { const next = new Set(prev); next.delete(product.sku); return next; }), 1800);
  };

  /* Fetch + filter products for a hotspot */
  const openHotspot = useCallback(async (hotspot: Hotspot) => {
    setActiveHotspot(hotspot);
    setPopupLoading(true);

    try {
      let filtered: ProductData[];

      if (hotspot.searchQuery) {
        const cacheKey = `search:${hotspot.searchQuery}`;
        let results = productCache[cacheKey];
        if (!results) {
          const res = await fetch(`/api/products/search?q=${encodeURIComponent(hotspot.searchQuery)}&limit=50`);
          const data = await res.json();
          results = data.products || [];
          productCache[cacheKey] = results;
        }
        filtered = results;
      } else {
        let allProducts = productCache[hotspot.categorySlug];
        if (!allProducts) {
          const res = await fetch(`/api/products/category?slug=${hotspot.categorySlug}&limit=250`);
          const data = await res.json();
          allProducts = data.products || [];
          productCache[hotspot.categorySlug] = allProducts;
        }

        filtered = allProducts.filter((p) =>
          hotspot.subcategories.includes(p.subcategory)
        );

        if (hotspot.nameFilter) {
          const re = new RegExp(hotspot.nameFilter, "i");
          filtered = filtered.filter((p) => re.test(p.name));
        }
      }

      setPopupProducts(filtered);
    } catch {
      setPopupProducts([]);
    } finally {
      setPopupLoading(false);
    }
  }, []);

  const closePopup = useCallback(() => {
    setActiveHotspot(null);
    setPopupProducts([]);
    setQuantities({});
  }, []);

  /* Close popup on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePopup();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closePopup]);

  /* Fetch essentials products for active scene */
  useEffect(() => {
    const s = scenes[activeScene];
    setEssentialsLoading(true);

    const fetchAll = async () => {
      try {
        // Collect unique category slugs and search queries
        const catSlugs = [...new Set(s.hotspots.filter((h) => !h.searchQuery).map((h) => h.categorySlug))];
        const searches = s.hotspots.filter((h) => h.searchQuery).map((h) => h.searchQuery!);

        // Fetch all categories + searches in parallel
        const catFetches = catSlugs.map(async (slug) => {
          if (productCache[slug]) return productCache[slug];
          const res = await fetch(`/api/products/category?slug=${slug}&limit=250`);
          const data = await res.json();
          const prods = data.products || [];
          productCache[slug] = prods;
          return prods;
        });
        const searchFetches = searches.map(async (q) => {
          const key = `search:${q}`;
          if (productCache[key]) return productCache[key];
          const res = await fetch(`/api/products/search?q=${encodeURIComponent(q)}&limit=50`);
          const data = await res.json();
          const prods = data.products || [];
          productCache[key] = prods;
          return prods;
        });

        const allResults = await Promise.all([...catFetches, ...searchFetches]);
        const allProducts = allResults.flat();

        // Filter to only products matching hotspot criteria
        const seen = new Set<string>();
        const matched: ProductData[] = [];

        for (const hotspot of s.hotspots) {
          let pool: ProductData[];
          if (hotspot.searchQuery) {
            const key = `search:${hotspot.searchQuery}`;
            pool = productCache[key] || [];
          } else {
            pool = (productCache[hotspot.categorySlug] || []).filter((p) =>
              hotspot.subcategories.includes(p.subcategory)
            );
            if (hotspot.nameFilter) {
              const re = new RegExp(hotspot.nameFilter, "i");
              pool = pool.filter((p) => re.test(p.name));
            }
          }
          for (const p of pool) {
            if (!seen.has(p.sku)) { seen.add(p.sku); matched.push(p); }
          }
        }

        setEssentials(matched);
      } catch {
        setEssentials([]);
      } finally {
        setEssentialsLoading(false);
      }
    };

    fetchAll();
  }, [activeScene]);

  return (
    <section className="bg-white min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 py-8 sm:py-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-mjs-gray-400 mb-6">
          <a href="/" className="hover:text-mjs-red transition-colors">Home</a>
          <span>/</span>
          <span className="text-mjs-dark font-medium">Shop by Workspace</span>
        </nav>

        {/* Page Header */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-black text-mjs-dark tracking-tight">
            Shop by Workspace
          </h1>
          <p className="text-mjs-gray-500 mt-2 max-w-2xl text-sm sm:text-base leading-relaxed">
            Every area of your facility has unique supply needs. Click on any scene below, then tap the
            highlighted items to browse products for that exact spot.
          </p>
        </div>

        {/* ═══ Desktop: Scene Viewer ═══ */}
        <div className="hidden md:grid md:grid-cols-[200px_1fr_240px] gap-0 border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm mb-10">
          {/* Left Sidebar — Scene List */}
          <div className="border-r border-gray-200 bg-mjs-gray-50">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xs font-bold text-mjs-gray-400 uppercase tracking-widest">Workspaces</h2>
            </div>
            <nav className="py-2">
              {scenes.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => { setActiveScene(i); setHoveredHotspot(null); }}
                  className={`w-full text-left px-4 py-3 text-sm font-semibold transition-all flex items-center justify-between group ${
                    activeScene === i
                      ? "bg-mjs-red text-white"
                      : "text-mjs-gray-600 hover:bg-red-50 hover:text-mjs-red"
                  }`}
                >
                  {s.name}
                  <ArrowRight className={`w-3.5 h-3.5 transition-transform ${
                    activeScene === i ? "opacity-100" : "opacity-0 group-hover:opacity-50"
                  }`} />
                </button>
              ))}
            </nav>
          </div>

          {/* Center — Scene Image with Hotspots */}
          <div className="relative bg-gray-100 aspect-[16/10] overflow-hidden">
            {/* Scene Image */}
            <img
              key={scene.id}
              src={scene.image}
              alt={`${scene.name} workspace scene`}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            {/* Fallback gradient when no image */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 -z-10 flex items-center justify-center">
              <span className="text-gray-400 text-lg font-semibold">{scene.name}</span>
            </div>

            {/* Hotspot Dots */}
            {scene.hotspots.map((h) => (
              <button
                key={h.id}
                onClick={() => openHotspot(h)}
                onMouseEnter={() => setHoveredHotspot(h.id)}
                onMouseLeave={() => setHoveredHotspot(null)}
                className="absolute z-10 group"
                style={{ left: `${h.x}%`, top: `${h.y}%`, transform: "translate(-50%, -50%)" }}
                aria-label={h.label}
              >
                {/* Pulse ring */}
                <span className="absolute inset-0 w-7 h-7 -translate-x-[6px] -translate-y-[6px] rounded-full bg-red-400/30 animate-ping" />
                {/* Dot */}
                <span className="relative block w-4 h-4 rounded-full bg-mjs-red border-2 border-white shadow-lg cursor-pointer group-hover:scale-125 transition-transform" />
                {/* Tooltip */}
                {hoveredHotspot === h.id && (
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-mjs-dark text-white text-xs font-semibold rounded-lg whitespace-nowrap shadow-lg pointer-events-none">
                    {h.label}
                    <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-mjs-dark" />
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Right — Description */}
          <div className="border-l border-gray-200 p-6 flex flex-col justify-center">
            <h3 className="text-lg font-bold text-mjs-dark mb-3">{scene.name}</h3>
            <p className="text-sm text-mjs-gray-500 leading-relaxed mb-5">{scene.description}</p>
            <div className="text-xs text-mjs-gray-400 font-medium">
              Click any <span className="inline-block w-2.5 h-2.5 bg-mjs-red rounded-full align-middle mx-0.5" /> dot to browse products
            </div>
          </div>
        </div>

        {/* ═══ Mobile: Scene Viewer ═══ */}
        <div className="md:hidden mb-8">
          {/* Scene tabs */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
            {scenes.map((s, i) => (
              <button
                key={s.id}
                onClick={() => { setActiveScene(i); setHoveredHotspot(null); }}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeScene === i
                    ? "bg-mjs-red text-white shadow-md shadow-red-200"
                    : "bg-mjs-gray-50 text-mjs-gray-600"
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>

          {/* Scene image */}
          <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-[4/3]">
            <img
              key={scene.id}
              src={scene.image}
              alt={`${scene.name} workspace scene`}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 -z-10 flex items-center justify-center">
              <span className="text-gray-400 text-lg font-semibold">{scene.name}</span>
            </div>
            {scene.hotspots.map((h) => (
              <button
                key={h.id}
                onClick={() => openHotspot(h)}
                className="absolute z-10"
                style={{ left: `${h.x}%`, top: `${h.y}%`, transform: "translate(-50%, -50%)" }}
                aria-label={h.label}
              >
                <span className="absolute inset-0 w-7 h-7 -translate-x-[6px] -translate-y-[6px] rounded-full bg-red-400/30 animate-ping" />
                <span className="relative block w-4 h-4 rounded-full bg-mjs-red border-2 border-white shadow-lg" />
              </button>
            ))}
          </div>

          {/* Description */}
          <p className="text-sm text-mjs-gray-500 mt-3 leading-relaxed">{scene.description}</p>
        </div>

        {/* ═══ Shopping Essentials for Active Scene ═══ */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-mjs-dark mb-1">{scene.name} Essentials</h2>
          <p className="text-sm text-mjs-gray-400 mb-6">
            {essentialsLoading ? "Loading products..." : `${essentials.length} products for this workspace`}
          </p>

          {essentialsLoading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-mjs-red animate-spin" />
            </div>
          )}

          {!essentialsLoading && essentials.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {essentials.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ═══ Product Popup Modal ═══ */}
      {activeHotspot && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          onClick={closePopup}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Panel */}
          <div
            ref={popupRef}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white sm:rounded-2xl shadow-2xl w-full sm:max-w-5xl max-h-[90vh] sm:max-h-[85vh] flex flex-col animate-in slide-in-from-bottom sm:zoom-in-95 fade-in duration-300 rounded-t-2xl"
          >
            {/* Header */}
            <div className="flex-shrink-0 px-6 sm:px-10 pt-6 sm:pt-8 pb-5 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-mjs-red flex-shrink-0" />
                    <span className="text-[10px] font-bold text-mjs-gray-400 uppercase tracking-[0.15em]">
                      {scene.name}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-mjs-dark tracking-tight">
                    {activeHotspot.label}
                  </h3>
                  <p className="text-sm text-mjs-gray-400 mt-1">
                    {popupLoading ? "Loading products..." : `${popupProducts.length} products available`}
                  </p>
                </div>
                <button
                  onClick={closePopup}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 transition-colors flex-shrink-0 ml-4"
                >
                  <X className="w-5 h-5 text-mjs-gray-400" />
                </button>
              </div>
            </div>

            {/* Products */}
            <div className="flex-1 overflow-y-auto">
              {popupLoading && (
                <div className="flex items-center justify-center py-24">
                  <Loader2 className="w-8 h-8 text-mjs-red animate-spin" />
                </div>
              )}

              {!popupLoading && popupProducts.length === 0 && (
                <div className="text-center py-24">
                  <p className="text-mjs-gray-400">No products found in this category.</p>
                </div>
              )}

              {!popupLoading && popupProducts.length > 0 && (
                <div className="divide-y divide-gray-100">
                  {popupProducts.map((product) => {
                    const qty = getQty(product.sku);
                    const currentTierPrice = getTierPrice(product, qty);
                    const hasTiers = product.quickBuy && product.quickBuy.length > 1;
                    const justAdded = addedSkus.has(product.sku);

                    return (
                      <div
                        key={product.slug}
                        className="px-6 sm:px-10 py-6 sm:py-8 hover:bg-gray-50/40 transition-colors"
                      >
                        <div className="flex gap-5 sm:gap-8">
                          {/* Image — large, clean, no border or shadow */}
                          <a href={`/product/${product.slug}`} className="flex-shrink-0 group">
                            <div className="w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center">
                              <img
                                src={product.images[0]}
                                alt={product.cardTitle || product.name}
                                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                              />
                            </div>
                          </a>

                          {/* Center — Name, Description, Tiers */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-bold text-mjs-gray-400 uppercase tracking-wide">{product.sku}</span>
                              {product.brand && (
                                <>
                                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                                  <span className="text-[10px] font-bold text-mjs-gray-400 uppercase tracking-wide">{product.brand}</span>
                                </>
                              )}
                            </div>
                            <a href={`/product/${product.slug}`}>
                              <h4 className="text-base sm:text-lg font-bold text-mjs-dark leading-snug line-clamp-2 hover:text-mjs-red transition-colors">
                                {product.cardTitle || product.name}
                              </h4>
                            </a>
                            {product.pack && (
                              <p className="text-xs text-mjs-gray-400 mt-0.5">{product.pack}</p>
                            )}
                            {product.description && (
                              <p className="text-xs sm:text-sm text-mjs-gray-500 leading-relaxed mt-2 line-clamp-2">
                                {product.description}
                              </p>
                            )}

                            {/* Tier Pricing */}
                            {hasTiers && (
                              <div className="mt-3 flex flex-wrap gap-1.5">
                                {product.quickBuy.map((tier) => {
                                  const isActive = qty >= tier.qty && (
                                    !product.quickBuy.find((t) => t.qty > tier.qty && qty >= t.qty)
                                  );
                                  return (
                                    <button
                                      key={tier.qty}
                                      onClick={() => setQty(product.sku, tier.qty)}
                                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                        isActive
                                          ? "bg-mjs-dark text-white"
                                          : "bg-gray-100 text-mjs-gray-500 hover:bg-gray-200"
                                      }`}
                                    >
                                      <span>{tier.label}</span>
                                      {tier.unitPrice && (
                                        <span className="ml-1.5 opacity-80">${tier.unitPrice.toFixed(2)}</span>
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          {/* Right — Price, Qty, Add to Cart */}
                          <div className="flex-shrink-0 flex flex-col items-end justify-center gap-3">
                            {/* Price */}
                            <div className="text-right">
                              <div className="text-xl sm:text-2xl font-black text-mjs-dark">
                                ${currentTierPrice.toFixed(2)}
                              </div>
                              {currentTierPrice < product.price && (
                                <span className="text-xs text-mjs-gray-400 line-through">
                                  ${product.price.toFixed(2)}
                                </span>
                              )}
                            </div>

                            {/* Qty Toggle */}
                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                              <button
                                onClick={() => setQty(product.sku, qty - 1)}
                                className="w-8 h-8 flex items-center justify-center text-mjs-gray-500 hover:bg-gray-100 transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <input
                                type="number"
                                min={1}
                                value={qty}
                                onChange={(e) => setQty(product.sku, parseInt(e.target.value) || 1)}
                                className="w-12 h-8 text-center text-sm font-bold text-mjs-dark border-x border-gray-200 bg-white outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              />
                              <button
                                onClick={() => setQty(product.sku, qty + 1)}
                                className="w-8 h-8 flex items-center justify-center text-mjs-gray-500 hover:bg-gray-100 transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Add to Cart */}
                            <button
                              onClick={() => handleAddToCart(product)}
                              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                                justAdded
                                  ? "bg-emerald-500 text-white"
                                  : "bg-mjs-red hover:bg-red-700 text-white"
                              }`}
                            >
                              {justAdded ? (
                                <>
                                  <Check className="w-4 h-4" />
                                  Added
                                </>
                              ) : (
                                <>
                                  <ShoppingCart className="w-4 h-4" />
                                  Add to Cart
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {!popupLoading && popupProducts.length > 0 && (
              <div className="flex-shrink-0 border-t border-gray-100 px-6 sm:px-10 py-4 sm:py-5 bg-mjs-gray-50/50 text-center">
                <a
                  href={activeHotspot.categoryLink}
                  className="inline-flex items-center justify-center gap-2 bg-mjs-dark hover:bg-gray-800 text-white text-sm font-bold px-8 py-3 rounded-xl transition-colors"
                >
                  Browse Full Category
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
