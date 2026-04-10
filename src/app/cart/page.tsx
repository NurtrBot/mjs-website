"use client";

import { useCart } from "@/context/CartContext";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  Minus,
  Plus,
  Trash2,
  Truck,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  Tag,
  X,
  PackageCheck,
  ShoppingCart,
  Sparkles,
} from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useOrderSetup } from "@/context/OrderContext";

/* ═══ FREQUENTLY BOUGHT TOGETHER ENGINE ═══ */

// Pairing rules: product keywords → complementary products (never suggest the same type)
const PAIRING_RULES: { match: string[]; pairWith: string[]; avoid: string[] }[] = [
  // Paper → Dispensers + Restroom essentials
  { match: ["roll towel", "paper towel", "hardwound"], pairWith: ["towel dispenser", "hand soap", "trash liner"], avoid: ["towel"] },
  { match: ["toilet tissue", "bath tissue", "bathroom tissue"], pairWith: ["tissue dispenser", "seat cover", "hand soap", "air freshener"], avoid: ["tissue", "toilet"] },
  { match: ["multifold", "multi-fold", "c-fold", "singlefold"], pairWith: ["folded towel dispenser", "hand soap", "hand sanitizer"], avoid: ["fold"] },
  { match: ["facial tissue"], pairWith: ["tissue dispenser", "disinfecting wipe"], avoid: ["facial"] },
  // Dispensers → Refills + Restroom
  { match: ["soap dispenser", "foam dispenser"], pairWith: ["hand soap", "foam soap", "paper towel"], avoid: ["dispenser"] },
  { match: ["towel dispenser"], pairWith: ["roll towel", "hand soap", "trash liner"], avoid: ["dispenser"] },
  // Soaps → Dispensers + Towels
  { match: ["hand soap", "hand sanitizer", "foam soap", "foam wash"], pairWith: ["soap dispenser", "paper towel", "air freshener"], avoid: ["soap", "sanitizer", "wash"] },
  // Chemicals → Tools
  { match: ["degreaser", "all purpose cleaner"], pairWith: ["spray bottle", "microfiber", "nitrile glove"], avoid: ["degreaser", "cleaner"] },
  { match: ["glass cleaner", "window cleaner"], pairWith: ["squeegee", "microfiber towel", "spray bottle"], avoid: ["glass", "window"] },
  { match: ["floor cleaner", "floor finish", "floor stripper"], pairWith: ["mop head", "floor pad", "mop bucket"], avoid: ["floor"] },
  { match: ["carpet shampoo", "carpet cleaner"], pairWith: ["carpet bonnet", "carpet extractor", "floor pad"], avoid: ["carpet"] },
  { match: ["disinfectant", "disinfecting"], pairWith: ["spray bottle", "nitrile glove", "microfiber"], avoid: ["disinfect"] },
  // Mops → Buckets + Handles + Heads
  { match: ["mop head", "mop refill"], pairWith: ["mop handle", "mop bucket", "floor cleaner"], avoid: ["mop head"] },
  { match: ["mop handle"], pairWith: ["mop head", "mop bucket", "floor cleaner"], avoid: ["handle"] },
  { match: ["mop bucket", "wringer"], pairWith: ["mop head", "mop handle", "floor cleaner"], avoid: ["bucket", "wringer"] },
  // Gloves → Other PPE + Hygiene
  { match: ["nitrile glove", "latex glove", "vinyl glove"], pairWith: ["face mask", "bouffant cap", "hand sanitizer", "disinfecting wipe"], avoid: ["glove"] },
  // Trash → Can Liners + Cleaning
  { match: ["trash can", "waste receptacle"], pairWith: ["can liner", "degreaser", "disinfectant"], avoid: ["trash can", "receptacle"] },
  { match: ["can liner", "trash liner", "trash bag"], pairWith: ["trash can", "degreaser"], avoid: ["liner", "bag"] },
  // Packaging
  { match: ["stretch film", "stretch wrap"], pairWith: ["tape gun", "bubble wrap", "packing peanut"], avoid: ["stretch", "film"] },
  { match: ["tape", "packing tape"], pairWith: ["tape gun", "stretch film", "bubble wrap"], avoid: ["tape"] },
  { match: ["bubble wrap", "bubble cushion"], pairWith: ["tape gun", "packing peanut", "stretch film"], avoid: ["bubble"] },
  // Breakroom — always suggest DIFFERENT breakroom categories
  { match: ["fork", "spoon", "knife", "cutlery", "utensil"], pairWith: ["napkin", "coffee", "paper cup", "plate"], avoid: ["fork", "spoon", "knife", "cutlery", "utensil"] },
  { match: ["plate", "bowl"], pairWith: ["napkin", "cutlery", "coffee", "foam cup"], avoid: ["plate", "bowl"] },
  { match: ["cup", "foam cup", "paper cup"], pairWith: ["coffee", "napkin", "stir stick", "sugar"], avoid: ["cup"] },
  { match: ["coffee", "creamer"], pairWith: ["paper cup", "stir stick", "sugar", "napkin"], avoid: ["coffee", "creamer"] },
  { match: ["napkin"], pairWith: ["cutlery", "plate", "coffee", "cup"], avoid: ["napkin"] },
  // Vacuums → Bags + Chemicals
  { match: ["vacuum", "backpack vacuum"], pairWith: ["vacuum bag", "filter bag", "carpet shampoo"], avoid: ["vacuum"] },
];

interface CartItemType {
  slug: string;
  sku?: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  pack: string;
}

interface ProductType {
  slug: string;
  sku: string;
  cardTitle: string;
  name?: string;
  brand: string;
  price: number;
  images: string[];
  pack: string;
  imageFit?: string;
  subcategory?: string;
  reviewCount?: number;
}

function FrequentlyBoughtTogether({ cartItems, addItem }: { cartItems: CartItemType[]; addItem: (item: CartItemType, qty?: number) => void }) {
  const [pairings, setPairings] = useState<ProductType[]>([]);

  useEffect(() => {
    const cartNames = cartItems.map(i => i.name.toLowerCase());
    const searchTerms = new Set<string>();
    const avoidTerms = new Set<string>();

    // Collect what to search for AND what to avoid
    for (const rule of PAIRING_RULES) {
      const cartMatches = cartNames.some(name => rule.match.some(m => name.includes(m)));
      if (cartMatches) {
        rule.pairWith.forEach(term => searchTerms.add(term));
        rule.avoid.forEach(term => avoidTerms.add(term));
      }
    }

    // Also avoid anything already in the cart by name keywords
    for (const name of cartNames) {
      const words = name.split(/[\s,]+/).filter(w => w.length > 3);
      words.slice(0, 3).forEach(w => avoidTerms.add(w));
    }

    // Fallback: universal complements
    if (searchTerms.size === 0) {
      searchTerms.add("hand soap");
      searchTerms.add("microfiber");
      searchTerms.add("can liner");
      searchTerms.add("paper towel");
    }

    const cartSlugs = new Set(cartItems.map(i => i.slug));
    const terms = Array.from(searchTerms).slice(0, 8);

    Promise.all(
      terms.map(term =>
        fetch(`/api/products/search?q=${encodeURIComponent(term)}&limit=5`)
          .then(r => r.json())
          .catch(() => ({ products: [] }))
      )
    ).then(results => {
      const seen = new Set<string>();
      const picks: ProductType[] = [];

      for (const r of results) {
        for (const p of (r.products || [])) {
          if (seen.has(p.sku) || cartSlugs.has(p.slug)) continue;
          if (!p.images?.[0] || p.images[0].includes("placeholder")) continue;

          // Skip if product name contains any avoid terms
          const pName = p.cardTitle?.toLowerCase() || p.name?.toLowerCase() || "";
          const shouldAvoid = Array.from(avoidTerms).some(term => pName.includes(term));
          if (shouldAvoid) continue;

          seen.add(p.sku);
          picks.push(p);
        }
      }

      // Dedupe by taking max 1 per search term for variety
      setPairings(picks.slice(0, 6));
    });
  }, [cartItems]);

  if (pairings.length === 0) return null;

  return (
    <div className="mt-8 mb-2">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 pt-5 pb-4">
          <h3 className="text-sm font-bold text-mjs-dark">Frequently Bought Together</h3>
        </div>
        <div className="px-6 pb-6">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {pairings.map((product) => (
              <div key={product.slug} className="bg-mjs-gray-50 rounded-xl border border-gray-100 p-2.5 flex flex-col group hover:shadow-md hover:border-gray-200 transition-all">
                <a href={`/product/${product.slug}`} className="block aspect-square mb-2 overflow-hidden rounded-lg bg-white">
                  <img src={product.images[0]} alt={product.cardTitle} className="w-full h-full object-cover" />
                </a>
                <div className="flex-1 min-h-[36px]">
                  <div className="text-[9px] text-mjs-gray-400 font-medium uppercase truncate">{product.brand}</div>
                  <a href={`/product/${product.slug}`} className="text-[11px] font-semibold text-mjs-dark leading-tight line-clamp-2 group-hover:text-mjs-red transition-colors">
                    {product.cardTitle}
                  </a>
                </div>
                <div className="mt-1.5">
                  <span className="text-sm font-black text-mjs-dark">${product.price.toFixed(2)}</span>
                  <div className="text-[9px] text-mjs-gray-500 mb-1.5">{product.pack}</div>
                  <button
                    onClick={() => addItem({
                      slug: product.slug,
                      sku: product.sku,
                      name: product.cardTitle,
                      brand: product.brand,
                      price: product.price,
                      image: product.images[0],
                      pack: product.pack,
                    })}
                    className="w-full bg-white border border-mjs-red text-mjs-red text-[10px] font-bold py-1.5 rounded-lg hover:bg-mjs-red hover:text-white transition-colors flex items-center justify-center gap-1"
                  >
                    <ShoppingCart className="w-3 h-3" />
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  const { items, updateQty, removeItem, clearCart, addItem, itemCount, subtotal } =
    useCart();
  const { orderSetup } = useOrderSetup();
  const isPickup = orderSetup?.fulfillment === "pickup";
  const [promoCode, setPromoCode] = useState("");
  const [showShippingPopup, setShowShippingPopup] = useState(false);
  const [showPickupPopup, setShowPickupPopup] = useState(false);
  const [animateBar, setAnimateBar] = useState(false);
  const [paperQty, setPaperQty] = useState(1);
  const [paperAdded, setPaperAdded] = useState(false);
  const [pickupSuggestions, setPickupSuggestions] = useState<ProductType[]>([]);
  const router = useRouter();

  const copyPaper = {
    slug: "supreme-copy-paper-letter-20lb",
    name: "Supreme Copy Paper, Letter Size, 20 lb",
    brand: "Supreme",
    price: 52.99,
    image: "/images/product-copy-paper.png",
    pack: "10 Reams/Case",
  };

  // Smart product matching algorithm for impulse suggestions
  useEffect(() => {
    if (!showPickupPopup || items.length === 0) return;

    const cartNames = items.map(i => i.name.toLowerCase());
    const cartSkus = new Set(items.map(i => i.sku || i.slug));
    const cartSlugs = new Set(items.map(i => i.slug));

    // Step 1: Build search terms from pairing rules
    const pairedTerms = new Set<string>();
    const avoidTerms = new Set<string>();

    for (const rule of PAIRING_RULES) {
      if (cartNames.some(name => rule.match.some(m => name.includes(m)))) {
        rule.pairWith.forEach(t => pairedTerms.add(t));
        rule.avoid.forEach(t => avoidTerms.add(t));
      }
    }

    // Step 2: Extract keywords from cart item names for broader matching
    const cartKeywords: string[] = [];
    cartNames.forEach(n => {
      n.split(/[\s,]+/).filter(w => w.length > 3).forEach(w => {
        avoidTerms.add(w); // avoid suggesting same type
        cartKeywords.push(w);
      });
    });

    // Step 3: Build category-aware complementary searches
    // Map common cart keywords to complementary product categories
    const complementMap: Record<string, string[]> = {
      towel: ["hand soap", "soap dispenser", "trash liner"],
      tissue: ["seat cover", "hand sanitizer", "air freshener"],
      soap: ["paper towel", "soap dispenser", "hand sanitizer"],
      glove: ["face mask", "hand sanitizer", "disinfecting wipe"],
      liner: ["degreaser", "disinfectant", "trash can"],
      degreaser: ["spray bottle", "microfiber", "nitrile glove"],
      disinfect: ["spray bottle", "paper towel", "nitrile glove"],
      mop: ["floor cleaner", "mop bucket", "floor pad"],
      vacuum: ["vacuum bag", "carpet shampoo"],
      stretch: ["tape gun", "bubble wrap", "packing peanut"],
      tape: ["stretch film", "bubble wrap", "tape gun"],
      cup: ["napkin", "coffee", "stir stick"],
      plate: ["napkin", "cutlery", "cup"],
      napkin: ["cup", "plate", "cutlery"],
      coffee: ["cup", "napkin", "stir stick"],
      freshener: ["urinal screen", "disinfectant"],
      chemical: ["spray bottle", "microfiber", "nitrile glove"],
      cleaner: ["microfiber", "spray bottle", "mop head"],
      wipe: ["hand sanitizer", "nitrile glove", "paper towel"],
    };

    for (const keyword of cartKeywords) {
      for (const [trigger, complements] of Object.entries(complementMap)) {
        if (keyword.includes(trigger)) {
          complements.forEach(c => pairedTerms.add(c));
        }
      }
    }

    // Step 4: Always include some universal high-value items as fallback
    const universalTerms = ["hand soap", "microfiber towel", "nitrile glove", "paper towel", "disinfecting wipe", "trash liner", "air freshener"];

    // Step 5: Combine all search terms, shuffle for variety
    const allTerms = [...Array.from(pairedTerms), ...universalTerms];
    for (let i = allTerms.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allTerms[i], allTerms[j]] = [allTerms[j], allTerms[i]];
    }
    // Deduplicate
    const uniqueTerms = [...new Set(allTerms)].slice(0, 8);

    // Step 6: Fetch products for each term
    Promise.all(
      uniqueTerms.map(t =>
        fetch(`/api/products/search?q=${encodeURIComponent(t)}&limit=5`)
          .then(r => r.json())
          .catch(() => ({ products: [] }))
      )
    ).then(results => {
      // Step 7: Score and rank all candidates
      const candidates: (ProductType & { score: number })[] = [];
      const seen = new Set<string>();

      for (const r of results) {
        for (const p of (r.products || [])) {
          if (!p || seen.has(p.sku) || cartSkus.has(p.sku) || cartSlugs.has(p.slug)) continue;
          if (!p.images?.[0] || p.images[0].includes("placeholder")) continue;

          const pName = (p.cardTitle || p.name || "").toLowerCase();
          // Skip if too similar to cart items
          if (Array.from(avoidTerms).some(t => pName.includes(t))) continue;

          // Score: prefer items from pairing rules, popular items, different categories
          let score = Math.random() * 20; // Random base for variety
          if (p.reviewCount > 0) score += Math.min(p.reviewCount, 50); // Popularity bonus
          if (p.brand?.toLowerCase().includes("janitors finest")) score += 15; // JF bonus
          if (p.price > 5 && p.price < 80) score += 10; // Sweet spot pricing

          seen.add(p.sku);
          candidates.push({ ...p, score });
        }
      }

      // Step 8: Sort by score, take top 3
      candidates.sort((a, b) => b.score - a.score);

      // Ensure variety — don't pick 3 from the same subcategory
      const picks: ProductType[] = [];
      const usedSubcats = new Set<string>();
      for (const c of candidates) {
        if (picks.length >= 3) break;
        if (c.subcategory && usedSubcats.has(c.subcategory) && picks.length < candidates.length - 1) continue;
        if (c.subcategory) usedSubcats.add(c.subcategory);
        picks.push(c);
      }

      // If we couldn't get 3 diverse picks, fill from remaining
      if (picks.length < 3) {
        for (const c of candidates) {
          if (picks.length >= 3) break;
          if (!picks.find(p => p.sku === c.sku)) picks.push(c);
        }
      }

      setPickupSuggestions(picks);
    });
  }, [showPickupPopup, items]);

  const handleCheckout = () => {
    // Show impulse popup as last-chance upsell for everyone
    setShowPickupPopup(true);
  };

  const closePopup = () => {
    setAnimateBar(false);
    setShowShippingPopup(false);
    setShowPickupPopup(false);
    setPaperAdded(false);
    setPaperQty(1);
  };

  const handleAddPaper = () => {
    addItem(copyPaper, paperQty);
    setPaperAdded(true);
    setTimeout(() => setAnimateBar(true), 50);
  };

  const taxRate = 0.0775;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return (
    <>
      <TopBar />
      <Header />
      <main className="bg-mjs-gray-50 min-h-[60vh]">
        <div className="max-w-[1200px] mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-mjs-gray-400 mb-6">
            <Link href="/" className="hover:text-mjs-red transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-mjs-dark font-medium">Shopping Cart</span>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-black text-mjs-dark">
              Shopping Cart
              {itemCount > 0 && (
                <span className="text-base font-medium text-mjs-gray-400 ml-2">
                  ({itemCount} {itemCount === 1 ? "item" : "items"})
                </span>
              )}
            </h1>
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-sm text-mjs-gray-400 hover:text-mjs-red transition-colors"
              >
                Clear Cart
              </button>
            )}
          </div>


          {/* Empty State */}
          {items.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-200 py-20 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-mjs-gray-100 rounded-full flex items-center justify-center mb-5">
                <ShoppingBag className="w-9 h-9 text-mjs-gray-300" />
              </div>
              <h2 className="text-xl font-bold text-mjs-dark mb-2">
                Your cart is empty
              </h2>
              <p className="text-sm text-mjs-gray-400 mb-6 max-w-sm">
                Looks like you haven&apos;t added any products yet. Browse our
                catalog to find what you need.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-mjs-red hover:bg-mjs-red-dark text-white font-semibold px-8 py-3 rounded-lg text-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Continue Shopping
              </Link>
            </div>
          )}

          {/* Cart Content */}
          {items.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Items Column */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  {/* Table Header */}
                  <div className="hidden md:grid grid-cols-[1fr_120px_140px_100px_40px] gap-4 px-6 py-3 bg-mjs-gray-50 border-b border-gray-200 text-xs font-semibold text-mjs-gray-400 uppercase tracking-wider">
                    <span>Product</span>
                    <span className="text-center">Price</span>
                    <span className="text-center">Quantity</span>
                    <span className="text-right">Subtotal</span>
                    <span></span>
                  </div>

                  {/* Items */}
                  {items.map((item, index) => (
                    <div
                      key={item.slug}
                      className={`grid grid-cols-1 md:grid-cols-[1fr_120px_140px_100px_40px] gap-4 px-6 py-5 items-center ${
                        index < items.length - 1
                          ? "border-b border-gray-100"
                          : ""
                      }`}
                    >
                      {/* Product */}
                      <div className="flex items-center gap-4">
                        <Link
                          href={`/product/${item.slug}`}
                          className="w-20 h-20 bg-mjs-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </Link>
                        <div className="min-w-0">
                          <Link
                            href={`/product/${item.slug}`}
                            className="text-sm font-semibold text-mjs-dark hover:text-mjs-red transition-colors line-clamp-2"
                          >
                            {item.name}
                          </Link>
                          <div className="text-xs text-mjs-gray-400 mt-1">
                            {item.brand} &middot; {item.pack}
                          </div>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-sm font-semibold text-mjs-gray-600 text-center">
                        <span className="md:hidden text-xs text-mjs-gray-400 mr-1">
                          Price:
                        </span>
                        ${item.price.toFixed(2)}
                      </div>

                      {/* Quantity */}
                      <div className="flex items-center justify-center">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQty(item.slug, item.qty - 1)}
                            className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5 text-mjs-gray-600" />
                          </button>
                          <span className="w-12 h-9 flex items-center justify-center text-sm font-semibold text-mjs-dark border-x border-gray-200 bg-mjs-gray-50">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateQty(item.slug, item.qty + 1)}
                            className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5 text-mjs-gray-600" />
                          </button>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="text-sm font-bold text-mjs-dark text-right">
                        <span className="md:hidden text-xs text-mjs-gray-400 font-medium mr-1">
                          Subtotal:
                        </span>
                        ${(item.price * item.qty).toFixed(2)}
                      </div>

                      {/* Remove */}
                      <div className="flex justify-end">
                        <button
                          onClick={() => removeItem(item.slug)}
                          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors group"
                        >
                          <Trash2 className="w-4 h-4 text-mjs-gray-300 group-hover:text-mjs-red transition-colors" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Continue Shopping */}
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-sm font-medium text-mjs-gray-500 hover:text-mjs-red mt-4 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Continue Shopping
                </Link>
              </div>

              {/* Order Summary Column */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-[80px]">
                  <h2 className="text-lg font-bold text-mjs-dark mb-5">
                    Order Summary
                  </h2>

                  {/* Promo Code */}
                  <div className="mb-5">
                    <label className="text-xs font-medium text-mjs-gray-500 mb-1.5 block">
                      Promo Code
                    </label>
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Tag className="w-4 h-4 text-mjs-gray-300 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="Enter code"
                          className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mjs-red/20 focus:border-mjs-red/40"
                        />
                      </div>
                      <button className="px-4 py-2.5 bg-mjs-gray-100 hover:bg-mjs-gray-200 text-sm font-semibold text-mjs-gray-600 rounded-lg transition-colors">
                        Apply
                      </button>
                    </div>
                  </div>

                  <div className="h-px bg-gray-100 mb-4" />

                  {/* Totals */}
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-mjs-gray-500">Subtotal</span>
                      <span className="font-semibold text-mjs-gray-700">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-mjs-gray-500">Shipping</span>
                      <span className="font-semibold text-mjs-gray-400 text-xs">
                        Calculated at checkout
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-mjs-gray-500">
                        Sales Tax (7.75%)
                      </span>
                      <span className="font-semibold text-mjs-gray-700">
                        ${tax.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="h-px bg-gray-200 mb-4" />

                  <div className="flex justify-between items-center mb-6">
                    <span className="text-base font-bold text-mjs-dark">
                      Order Total
                    </span>
                    <span className="text-xl font-black text-mjs-dark">
                      ${total.toFixed(2)}
                    </span>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-mjs-red hover:bg-mjs-red-dark text-white font-bold py-3.5 rounded-lg text-sm transition-all hover:shadow-lg hover:shadow-red-500/20 flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Trust Badges */}
                  <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-1.5 text-[11px] text-mjs-gray-400">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Secure Checkout
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-mjs-gray-400">
                      <Truck className="w-3.5 h-3.5" />
                      Ships Nationwide
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══ FREQUENTLY BOUGHT TOGETHER ═══ */}
          {items.length > 0 && (() => {
            return <FrequentlyBoughtTogether cartItems={items} addItem={addItem} />;
          })()}
        </div>
      </main>
      <Footer />

      {/* ═══ IMPULSE POPUP ═══ */}
      {showPickupPopup && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[80]" onClick={() => { closePopup(); router.push("/checkout"); }} />
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.15)] max-w-[480px] w-full animate-[popIn_0.25s_ease-out]">
              <div className="px-8 pt-8 pb-6">
                <h3 className="text-lg font-black text-mjs-dark text-center mb-1">Before you go...</h3>
                <p className="text-sm text-mjs-gray-500 text-center mb-6">These items pair well with your order</p>

                {pickupSuggestions.length > 0 ? (
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {pickupSuggestions.map((p) => (
                      <div key={p.sku} className="bg-mjs-gray-50 rounded-xl border border-gray-100 p-3 flex flex-col group">
                        <a href={`/product/${p.slug}`} className="block aspect-square rounded-lg overflow-hidden mb-2 bg-white">
                          <img src={p.images[0]} alt={p.cardTitle} className="w-full h-full object-cover" />
                        </a>
                        <div className="text-[10px] font-semibold text-mjs-dark leading-tight line-clamp-2 min-h-[28px]">{p.cardTitle}</div>
                        <div className="text-sm font-black text-mjs-dark mt-1">${p.price.toFixed(2)}</div>
                        <div className="text-[9px] text-mjs-gray-500 mb-2">{p.pack}</div>
                        <button
                          onClick={() => addItem({ slug: p.slug, sku: p.sku, name: p.cardTitle, brand: p.brand, price: p.price, image: p.images[0], pack: p.pack })}
                          className="w-full bg-mjs-red text-white text-[10px] font-bold py-1.5 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-1"
                        >
                          <ShoppingCart className="w-3 h-3" /> Add
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-20 flex items-center justify-center mb-6">
                    <div className="w-5 h-5 border-2 border-gray-200 border-t-mjs-red rounded-full animate-spin" />
                  </div>
                )}

                <button
                  onClick={() => { closePopup(); router.push("/checkout"); }}
                  className="w-full bg-mjs-dark hover:bg-gray-800 text-white font-semibold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
                >
                  No thanks, proceed to checkout
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <style jsx>{`
            @keyframes popIn {
              from { opacity: 0; transform: scale(0.96) translateY(8px); }
              to { opacity: 1; transform: scale(1) translateY(0); }
            }
          `}</style>
        </>
      )}
    </>
  );
}
