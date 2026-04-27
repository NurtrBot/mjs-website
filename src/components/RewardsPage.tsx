"use client";

import { useEffect, useState, useRef } from "react";
import { Gift, Star, ArrowRight, ShoppingCart, CheckCircle, Crown, Zap, CreditCard, Shield, Clock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// ── Tier definitions ──
const GUEST_TIERS = [
  { minSpend: 500, label: "Bronze", amount: 10, color: "from-amber-600 to-amber-800", icon: Star },
  { minSpend: 1000, label: "Silver", amount: 20, color: "from-gray-400 to-gray-600", icon: Star },
  { minSpend: 2500, label: "Gold", amount: 50, color: "from-yellow-400 to-amber-500", icon: Crown },
  { minSpend: 3500, label: "Platinum", amount: 75, color: "from-indigo-500 to-purple-600", icon: Zap },
  { minSpend: 5000, label: "Diamond", amount: 125, color: "from-mjs-red to-red-700", icon: Gift },
];

const CUSTOMER_TIERS = [
  { minSpend: 700, label: "Bronze", amount: 10, color: "from-amber-600 to-amber-800", icon: Star },
  { minSpend: 2000, label: "Silver", amount: 25, color: "from-gray-400 to-gray-600", icon: Star },
  { minSpend: 3500, label: "Gold", amount: 50, color: "from-yellow-400 to-amber-500", icon: Crown },
  { minSpend: 5000, label: "Platinum", amount: 75, color: "from-indigo-500 to-purple-600", icon: Zap },
  { minSpend: 7500, label: "Diamond", amount: 100, color: "from-mjs-red to-red-700", icon: Gift },
];

// ── Hardcoded popular brands (always visible, no API wait) ──
const POPULAR_BRANDS = [
  { id: "OKMHM2X2OHYV", name: "Amazon" },
  { id: "SRDHFATO9KHN", name: "Target" },
  { id: "DC82VBYLI4CC", name: "Apple" },
  { id: "DPIPLH0SRBO6", name: "Walmart" },
  { id: "4SAT90Q41D60", name: "Chevron" },
  { id: "2XG0FLQXBDCZ", name: "Starbucks" },
  { id: "FGXZUYWP4FII", name: "Nike" },
  { id: "9OEIQ5EWBWT9", name: "DoorDash" },
  { id: "AFO794BZA8LR", name: "Home Depot" },
  { id: "UL2EZW1028HF", name: "Uber" },
  { id: "CRN0ID07Y2XD", name: "Chipotle" },
  { id: "C9N9S97PA7QL", name: "Best Buy" },
  { id: "3Y1VI49CMXEC", name: "Nordstrom" },
  { id: "GL3Y4RNQJAQ1", name: "Southwest Airlines" },
  { id: "OUUZS1D2WZED", name: "Macy's" },
  { id: "2OEXU81GQGHZ", name: "Sephora" },
  { id: "NYTE9M63VZ7A", name: "eBay" },
  { id: "HNFP6TMSPA9W", name: "Airbnb" },
  { id: "DYHLA54LEX11", name: "AMC Theatres" },
  { id: "OUOC99YPZ5OB", name: "Lowe's" },
  { id: "KGPM2ZYRPHE6", name: "Delta Air Lines" },
  { id: "GQHY7QGWSI00", name: "Domino's" },
  { id: "HX4U3DQX6GSA", name: "Adidas" },
  { id: "IIX6NOU88XQC", name: "Panera Bread" },
  { id: "SUCNT639A6H9", name: "Google Play" },
  { id: "VICATURH56RI", name: "H&M" },
  { id: "GB08GUQD12NV", name: "Taco Bell" },
  { id: "EZ9TELXE8OYB", name: "Bath & Body Works" },
  { id: "67FA8RXMAMXK", name: "Columbia Sportswear" },
  { id: "J8IF1NOYS959", name: "Burger King" },
  { id: "VKURYR906AG9", name: "Barnes & Noble" },
  { id: "LRY6PF4E4AKC", name: "GameStop" },
  { id: "4Q8AZCZ0AZ8E", name: "Saks Fifth Avenue" },
  { id: "GTA2XIZHZ36U", name: "Carnival Cruise Line" },
  { id: "PJNLKSECF7GR", name: "CVS Pharmacy" },
  { id: "L9SW3VT4MLW4", name: "Dick's Sporting Goods" },
  { id: "H3NT6D9F1F2X", name: "Texas Roadhouse" },
  { id: "QE673ZZANX9Q", name: "Krispy Kreme" },
  { id: "X2R7MKDGN5NB", name: "REI" },
  { id: "7JJM4UE9VMAW", name: "Staples" },
  { id: "899XF6JLQTER", name: "Ulta" },
  { id: "46I7B4VZAFES", name: "Fanatics" },
  { id: "9QGPDPJ90G9Q", name: "Cheesecake Factory" },
  { id: "AWK191TKR91A", name: "IHOP" },
  { id: "AC5JKD7ABONB", name: "T.J.Maxx" },
  { id: "ZYAN2BFK1M60", name: "Subway" },
  { id: "0BDNR16UFAEZ", name: "Wayfair" },
  { id: "AIHWKAS0WMCF", name: "Kohl's" },
  { id: "2YHZ6RZH5FYT", name: "JCPenney" },
  { id: "N9QEV7YC3HLK", name: "Instacart" },
  { id: "8C7E0V49KKTF", name: "Sam's Club" },
  { id: "QJ4T6Y5ORZFM", name: "Dave & Buster's" },
  { id: "WIUHHHXTSHYF", name: "Red Robin" },
  { id: "N7XGUA9XXFAB", name: "Banana Republic" },
];

// Brands to prioritize at top of grid
const PRIORITY_NAMES = ["Amazon", "Target", "Apple", "Walmart", "Chevron", "Visa", "Starbucks", "Nike", "DoorDash", "Home Depot", "Pizza Hut", "Netflix", "Chipotle", "Southwest Airlines", "Costco"];

interface BrandCard {
  id: string;
  name: string;
  image: string;
}

// ── Marquee Row ──
function MarqueeRow({ brands, direction = "left", speed = 35 }: { brands: BrandCard[]; direction?: "left" | "right"; speed?: number }) {
  const trackRef = useRef<HTMLDivElement>(null);

  // Repeat items enough to always overflow viewport for seamless loop
  const repeats = Math.max(2, Math.ceil(20 / brands.length));
  const items = Array.from({ length: repeats * 2 }, () => brands).flat();
  const duration = brands.length * speed;

  return (
    <div className="overflow-hidden relative group">
      {/* Edge fades */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-mjs-dark to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-mjs-dark to-transparent z-10 pointer-events-none" />

      <div
        ref={trackRef}
        className="flex gap-4 w-max"
        style={{
          animation: `marquee-${direction} ${duration}s linear infinite`,
        }}
      >
        {items.map((brand, i) => (
          <div
            key={`${brand.id}-${i}`}
            className="flex-shrink-0 w-[180px] h-[115px] rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/25 hover:scale-105 transition-all duration-300 group/card relative"
          >
            <img
              src={brand.image}
              alt={brand.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover/card:opacity-100 transition-opacity">
              <span className="text-[10px] font-bold text-white drop-shadow-lg">{brand.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RewardsPage() {
  const { isLoggedIn } = useAuth();
  const [brands, setBrands] = useState<BrandCard[]>([]);
  const [showCustomerTiers, setShowCustomerTiers] = useState(false);
  const tiers = showCustomerTiers ? CUSTOMER_TIERS : GUEST_TIERS;

  // Fetch full brand catalog from Tremendous
  useEffect(() => {
    // Start with popular brands immediately
    const initial: BrandCard[] = POPULAR_BRANDS.map(b => ({
      ...b,
      image: `https://api.tremendous.com/product_images/${b.id}/card`,
    }));
    setBrands(initial);

    // Then fetch full catalog
    fetch("/api/rewards/catalog")
      .then(r => r.json())
      .then(data => {
        if (data.products?.length > 0) {
          const all: BrandCard[] = data.products.map((p: { id: string; name: string; image: string }) => ({
            id: p.id,
            name: p.name,
            image: p.image || `https://api.tremendous.com/product_images/${p.id}/card`,
          }));
          setBrands(all);
        }
      })
      .catch(() => {});
  }, []);

  // Split brands into 3 rows
  const row1 = brands.filter((_, i) => i % 3 === 0);
  const row2 = brands.filter((_, i) => i % 3 === 1);
  const row3 = brands.filter((_, i) => i % 3 === 2);

  return (
    <section className="bg-gray-50 min-h-screen">
      {/* ═══ HERO ═══ */}
      <div className="bg-mjs-dark relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-[-200px] right-[-100px] w-[600px] h-[600px] bg-mjs-red/5 rounded-full" />
          <div className="absolute bottom-[-300px] left-[-200px] w-[800px] h-[800px] bg-mjs-red/3 rounded-full" />
          <div className="absolute top-[30%] left-[55%] w-[400px] h-[400px] bg-white/[0.02] rounded-full" />
        </div>

        <div className="max-w-[1100px] mx-auto px-4 pt-20 pb-14 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-mjs-red/10 border border-mjs-red/20 rounded-full px-5 py-2 mb-8">
              <CreditCard className="w-4 h-4 text-mjs-red" />
              <span className="text-xs font-bold text-mjs-red uppercase tracking-widest">MJS Rewards Program</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black text-white leading-[1.1] tracking-tight">
              Earn a free gift card<br />
              <span className="text-mjs-red">with every order.</span>
            </h1>

            <p className="text-lg text-gray-400 mt-6 leading-relaxed max-w-xl mx-auto">
              Every qualifying order earns you a digital gift card to your favorite brand.
              No points. No hoops. Just real rewards, delivered to your inbox.
            </p>

            {/* Quick stats */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-3">
                <Gift className="w-5 h-5 text-mjs-red" />
                <div className="text-left">
                  <div className="text-white font-bold text-sm">Up to $125</div>
                  <div className="text-[10px] text-gray-500">per order</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-3">
                <CreditCard className="w-5 h-5 text-mjs-red" />
                <div className="text-left">
                  <div className="text-white font-bold text-sm">2,500+ Brands</div>
                  <div className="text-[10px] text-gray-500">to choose from</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-3">
                <CheckCircle className="w-5 h-5 text-mjs-red" />
                <div className="text-left">
                  <div className="text-white font-bold text-sm">Every Order</div>
                  <div className="text-[10px] text-gray-500">qualifies at $500+</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ═══ BRAND MARQUEE ═══ */}
      {brands.length > 0 && (
        <div className="bg-mjs-dark pb-20 space-y-4 w-full overflow-hidden">
          <MarqueeRow brands={row1} direction="left" speed={25} />
          <MarqueeRow brands={row2} direction="right" speed={30} />
          <MarqueeRow brands={row3} direction="left" speed={24} />
        </div>
      )}

      {/* ═══ TIER BREAKDOWN ═══ */}
      <div className="max-w-[1100px] mx-auto px-4 -mt-10 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="text-center px-6 pt-10 pb-4">
            <div className="text-[10px] font-bold uppercase tracking-[3px] text-mjs-red mb-2">Reward Tiers</div>
            <h2 className="text-3xl font-black text-mjs-dark">The More You Spend, The More You Earn</h2>
            <p className="text-sm text-mjs-gray-500 mt-2 max-w-lg mx-auto">
              Higher order totals unlock bigger gift card values.<br />Pick any brand you love at checkout.
            </p>

            {/* Toggle: Guest vs Customer */}
            <div className="mt-6 inline-flex items-center bg-gray-100 rounded-full p-1">
              <button
                onClick={() => setShowCustomerTiers(false)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${!showCustomerTiers ? "bg-mjs-dark text-white shadow-md" : "text-mjs-gray-500 hover:text-mjs-dark"}`}
              >
                Guest Checkout
              </button>
              <button
                onClick={() => setShowCustomerTiers(true)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${showCustomerTiers ? "bg-mjs-dark text-white shadow-md" : "text-mjs-gray-500 hover:text-mjs-dark"}`}
              >
                Account Holders
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 px-4 sm:px-0 py-8">
            {tiers.map((tier, i) => {
              const Icon = tier.icon;
              return (
                <div key={tier.label} className="flex flex-col items-center text-center px-4 py-6 group relative">
                  {i === tiers.length - 1 && (
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 bg-mjs-red text-white text-[8px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full">
                      Best Value
                    </div>
                  )}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tier.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-[10px] font-bold text-mjs-gray-400 uppercase tracking-widest mb-1">{tier.label}</div>
                  <div className="text-3xl font-black text-mjs-dark">${tier.amount}</div>
                  <div className="text-[10px] text-mjs-gray-400 mt-0.5">gift card</div>
                  <div className="mt-3 bg-gray-50 rounded-lg px-3 py-1.5">
                    <div className="text-xs font-bold text-mjs-dark">${tier.minSpend.toLocaleString()}+</div>
                    <div className="text-[9px] text-mjs-gray-400">order minimum</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tier progress bar */}
          <div className="px-8 pb-8">
            <div className="flex items-center gap-2 max-w-[800px] mx-auto">
              <div className="text-[10px] text-mjs-gray-400 font-bold">${tiers[0].minSpend}</div>
              <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden relative">
                <div className="h-full bg-gradient-to-r from-amber-600 via-yellow-400 via-60% via-indigo-500 to-mjs-red rounded-full w-full" />
                {tiers.map((tier) => {
                  const max = tiers[tiers.length - 1].minSpend;
                  const min = tiers[0].minSpend;
                  const pct = ((tier.minSpend - min) / (max - min)) * 100;
                  return (
                    <div key={tier.label} className="absolute top-1/2 -translate-y-1/2" style={{ left: `${pct}%` }}>
                      <div className="w-3.5 h-3.5 bg-white rounded-full border-2 border-gray-300 -ml-1.5 shadow-sm" />
                    </div>
                  );
                })}
              </div>
              <div className="text-[10px] text-mjs-gray-400 font-bold">${tiers[tiers.length - 1].minSpend.toLocaleString()}+</div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ HOW IT WORKS ═══ */}
      <div className="max-w-[1100px] mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <div className="text-[10px] font-bold uppercase tracking-[3px] text-mjs-red mb-2">How It Works</div>
          <h2 className="text-3xl font-black text-mjs-dark">Three Steps to Free Gift Cards</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-[900px] mx-auto">
          {[
            {
              step: "1",
              icon: ShoppingCart,
              title: "Place Your Order",
              desc: "Shop from 10,000+ cleaning and janitorial products. Build your cart like normal.",
            },
            {
              step: "2",
              icon: CreditCard,
              title: "Pick Your Brand",
              desc: "At checkout, choose a gift card from Amazon, Apple, Starbucks, and dozens more top brands.",
            },
            {
              step: "3",
              icon: Gift,
              title: "Get Your Card",
              desc: "Your digital gift card is delivered to your email within 72 hours. Ready to spend instantly.",
            },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 bg-mjs-dark rounded-2xl flex items-center justify-center mx-auto shadow-xl">
                  <item.icon className="w-9 h-9 text-mjs-red" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-mjs-red rounded-full flex items-center justify-center text-white text-sm font-black shadow-md ring-4 ring-gray-50">
                  {item.step}
                </div>
              </div>
              <h3 className="text-lg font-black text-mjs-dark mb-2">{item.title}</h3>
              <p className="text-sm text-mjs-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Connecting line (desktop) */}
        <div className="hidden md:block max-w-[600px] mx-auto mt-[-140px] mb-[80px]">
          <div className="flex items-center justify-between px-[100px]">
            <div className="flex-1 h-[2px] bg-gradient-to-r from-mjs-red/30 to-mjs-red/10" />
            <div className="flex-1 h-[2px] bg-gradient-to-r from-mjs-red/10 to-mjs-red/30" />
          </div>
        </div>
      </div>

      {/* ═══ BRAND SHOWCASE GRID ═══ */}
      <div className="bg-white border-t border-gray-100">
        <div className="max-w-[1100px] mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <div className="text-[10px] font-bold uppercase tracking-[3px] text-mjs-red mb-2">Gift Card Library</div>
            <h2 className="text-3xl font-black text-mjs-dark">Over 2,500+ Top Brands</h2>
            <p className="text-sm text-mjs-gray-500 mt-2">From everyday essentials to luxury experiences. Pick the brand that fits your life.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {[...brands].sort((a, b) => {
              const ai = PRIORITY_NAMES.findIndex(n => a.name.includes(n));
              const bi = PRIORITY_NAMES.findIndex(n => b.name.includes(n));
              if (ai !== -1 && bi !== -1) return ai - bi;
              if (ai !== -1) return -1;
              if (bi !== -1) return 1;
              return 0;
            }).slice(0, 30).map((brand) => (
              <div
                key={brand.id}
                className="rounded-xl overflow-hidden bg-gray-50 border border-gray-100 hover:shadow-lg hover:border-mjs-red/20 hover:scale-[1.03] transition-all duration-200 group relative aspect-[1.6]"
              >
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[11px] font-bold text-white drop-shadow-lg">{brand.name}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ═══ WHY MJS REWARDS ═══ */}
      <div className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-[1100px] mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <div className="text-[10px] font-bold uppercase tracking-[3px] text-mjs-red mb-2">Why It&apos;s Different</div>
            <h2 className="text-3xl font-black text-mjs-dark">No Points. No Gimmicks. Just Rewards.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                emoji: "\ud83c\udf81",
                title: "Every Order Counts",
                desc: "No loyalty points to accumulate. Every qualifying order earns you a gift card immediately. Place 10 orders, get 10 gift cards.",
              },
              {
                emoji: "\u2764\ufe0f",
                title: "Real Brands You Love",
                desc: "Not some generic store credit. Choose from Amazon, Apple, Starbucks, DoorDash, and dozens more brands you actually use.",
              },
              {
                emoji: "\ud83d\udd12",
                title: "Secure & Instant",
                desc: "Digital gift cards delivered straight to your email. Redeemable instantly online or in-store. No expiration dates.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-md transition-shadow text-center">
                <div className="text-4xl mb-5">{item.emoji}</div>
                <h3 className="text-base font-black text-mjs-dark mb-2">{item.title}</h3>
                <p className="text-sm text-mjs-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ FAQ ═══ */}
      <div className="bg-white border-t border-gray-100">
        <div className="max-w-[800px] mx-auto px-4 py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black text-mjs-dark">Common Questions</h2>
          </div>
          <div className="space-y-3">
            {[
              { q: "How do I earn a gift card?", a: "Place any order of $500 or more. At checkout, you'll be prompted to choose a gift card brand. It's automatic." },
              { q: "When will I receive my gift card?", a: "Your digital gift card is delivered to your email within 72 hours of your order being placed." },
              { q: "Can I earn a gift card on every order?", a: "Yes! Every qualifying order earns a gift card. There's no limit to how many you can earn." },
              { q: "What brands can I choose from?", a: "We offer 2,500+ brands including Amazon, Apple, Starbucks, DoorDash, Southwest Airlines, Chipotle, and many more." },
              { q: "Do I need an account?", a: "No. Guest orders of $500+ qualify. Creating a free account lets you track your rewards and order history." },
              { q: "Can I use my gift card immediately?", a: "Yes. Once delivered to your email, the gift card is ready to use online or in-store at the brand you selected." },
            ].map((faq, i) => (
              <div key={i} className="bg-gray-50 rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-shadow">
                <h3 className="text-sm font-bold text-mjs-dark">{faq.q}</h3>
                <p className="text-xs text-mjs-gray-500 mt-2 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ CTA ═══ */}
      <div className="bg-mjs-dark relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-[-100px] right-[-50px] w-[400px] h-[400px] bg-mjs-red/5 rounded-full" />
          <div className="absolute bottom-[-100px] left-[-50px] w-[300px] h-[300px] bg-mjs-red/3 rounded-full" />
        </div>
        <div className="max-w-[800px] mx-auto px-4 py-16 text-center relative">
          <div className="w-16 h-16 bg-mjs-red/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <CreditCard className="w-8 h-8 text-mjs-red" />
          </div>
          <div className="text-3xl font-black text-white mb-3">
            Your next order comes with a<br /><span className="text-mjs-red">free gift card.</span>
          </div>
          <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto">
            Place an order of $500 or more and choose from {brands.length}+ top brands. It&apos;s that simple.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {isLoggedIn ? (
              <a href="/" className="inline-flex items-center gap-2 bg-mjs-red text-white font-bold px-8 py-4 rounded-xl text-sm hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20">
                Start Shopping <ArrowRight className="w-4 h-4" />
              </a>
            ) : (
              <>
                <a href="/auth" className="inline-flex items-center gap-2 bg-mjs-red text-white font-bold px-8 py-4 rounded-xl text-sm hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20">
                  Create Account <ArrowRight className="w-4 h-4" />
                </a>
                <a href="/" className="inline-flex items-center gap-2 bg-white/10 text-white font-bold px-8 py-4 rounded-xl text-sm hover:bg-white/20 transition-colors">
                  Browse Products
                </a>
              </>
            )}
          </div>
          <div className="mt-4 inline-flex items-center gap-1.5 text-[10px] text-gray-600">
            <Clock className="w-3 h-3" />
            Gift cards delivered within 72 hours of order
          </div>
          <div className="mt-3 text-xs text-gray-600">Questions? Call us at <a href="tel:7147792640" className="text-mjs-red font-semibold">(714) 779-2640</a></div>
        </div>
      </div>

      {/* ═══ CSS Marquee Animations ═══ */}
      <style jsx>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}
