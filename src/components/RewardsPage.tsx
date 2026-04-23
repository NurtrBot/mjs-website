"use client";

import { Gift, Star, ArrowRight, ShoppingCart, CheckCircle, Crown, Zap } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const GIFTS = [
  { name: "Carhartt Watch Hat", description: "Acrylic knit beanie — Carhartt Brown", image: "/images/rewards/carhartt-beanie.webp" },
  { name: "Arctic Tumbler 20oz", description: "Matte black insulated tumbler with straw", image: "/images/rewards/arctic-tumbler.webp" },
  { name: "JBL Charge Essential", description: "Waterproof Bluetooth speaker", image: "/images/rewards/jbl-speaker.avif" },
];

const TIERS = [
  { points: 500, label: "Bronze", color: "from-amber-600 to-amber-800" },
  { points: 1000, label: "Silver", color: "from-gray-400 to-gray-600" },
  { points: 2500, label: "Gold", color: "from-yellow-400 to-amber-500" },
  { points: 3500, label: "Platinum", color: "from-indigo-500 to-purple-600" },
  { points: 5000, label: "Diamond", color: "from-mjs-red to-red-700" },
];

export default function RewardsPage() {
  const { isLoggedIn } = useAuth();

  return (
    <section className="bg-gray-50 min-h-screen">
      {/* ═══ HERO ═══ */}
      <div className="bg-mjs-dark relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-[-200px] right-[-100px] w-[600px] h-[600px] bg-mjs-red/5 rounded-full" />
          <div className="absolute bottom-[-300px] left-[-200px] w-[800px] h-[800px] bg-mjs-red/3 rounded-full" />
          <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] bg-white/[0.02] rounded-full" />
        </div>

        <div className="max-w-[1100px] mx-auto px-4 pt-20 pb-28 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-mjs-red/10 border border-mjs-red/20 rounded-full px-5 py-2 mb-8">
              <Gift className="w-4 h-4 text-mjs-red" />
              <span className="text-xs font-bold text-mjs-red uppercase tracking-widest">MJS Rewards</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black text-white leading-[1.1] tracking-tight">
              Get rewarded for<br />
              <span className="text-mjs-red">every order.</span>
            </h1>

            <p className="text-lg text-gray-400 mt-6 leading-relaxed max-w-xl mx-auto">
              Every order you place unlocks a free premium gift. No points to track, no waiting. Just meet the minimum and choose your reward.
            </p>

            {/* Value prop */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 flex items-center gap-4 backdrop-blur-sm">
                <div className="w-14 h-14 bg-mjs-red/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl font-black text-mjs-red">$500</span>
                </div>
                <div className="text-left">
                  <div className="text-white font-bold">Minimum Order</div>
                  <div className="text-xs text-gray-500">to unlock your first free gift</div>
                </div>
              </div>
              <div className="text-2xl text-gray-600">&rarr;</div>
              <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 flex items-center gap-4 backdrop-blur-sm">
                <div className="w-14 h-14 bg-mjs-red/20 rounded-xl flex items-center justify-center">
                  <Gift className="w-7 h-7 text-mjs-red" />
                </div>
                <div className="text-left">
                  <div className="text-white font-bold">Pick Your Gift</div>
                  <div className="text-xs text-gray-500">choose 1 of 3 premium items</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ THE GIFTS — Full Showcase ═══ */}
      <div className="max-w-[1100px] mx-auto px-4 -mt-16 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="text-center px-6 pt-10 pb-2">
            <div className="text-[10px] font-bold uppercase tracking-[3px] text-mjs-red mb-2">Your Rewards</div>
            <h2 className="text-3xl font-black text-mjs-dark">Choose Your Free Gift</h2>
            <p className="text-sm text-mjs-gray-500 mt-2 max-w-md mx-auto">Every qualifying order lets you pick one of these premium items — on us.</p>
          </div>

          {/* Gift Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:divide-x divide-gray-100 px-6 md:px-0 py-8">
            {GIFTS.map((gift, i) => (
              <div key={i} className="flex flex-col items-center text-center px-8 py-6">
                <div className="w-full max-w-[220px] h-[200px] flex items-center justify-center mb-6">
                  <img src={gift.image} alt={gift.name} className="max-w-full max-h-full object-contain drop-shadow-lg" />
                </div>
                <h3 className="text-lg font-black text-mjs-dark">{gift.name}</h3>
                <p className="text-sm text-mjs-gray-500 mt-1">{gift.description}</p>
                <div className="mt-4 inline-flex items-center gap-1.5 bg-mjs-red/5 text-mjs-red text-xs font-bold px-4 py-2 rounded-full">
                  <Gift className="w-3.5 h-3.5" />
                  FREE with qualifying order
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ HOW IT WORKS ═══ */}
      <div className="max-w-[1100px] mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <div className="text-[10px] font-bold uppercase tracking-[3px] text-mjs-red mb-2">Simple as 1-2-3</div>
          <h2 className="text-3xl font-black text-mjs-dark">How It Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[900px] mx-auto">
          {[
            {
              step: "1",
              icon: ShoppingCart,
              title: "Place Your Order",
              desc: "Shop from our full catalog of 10,000+ cleaning products. Build your cart as you normally would.",
            },
            {
              step: "2",
              icon: Star,
              title: "Hit a Tier",
              desc: "When your order total reaches $500 or more, you automatically qualify for a free gift at checkout.",
            },
            {
              step: "3",
              icon: Gift,
              title: "Pick Your Gift",
              desc: "A selection of premium gifts appears. Choose one and we'll include it with your order — completely free.",
            },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="relative inline-block mb-5">
                <div className="w-20 h-20 bg-mjs-dark rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <item.icon className="w-9 h-9 text-mjs-red" />
                </div>
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-mjs-red rounded-full flex items-center justify-center text-white text-xs font-black shadow-md">
                  {item.step}
                </div>
              </div>
              <h3 className="text-base font-black text-mjs-dark mb-2">{item.title}</h3>
              <p className="text-sm text-mjs-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ TIER BREAKDOWN ═══ */}
      <div className="bg-mjs-dark">
        <div className="max-w-[1100px] mx-auto px-4 py-20">
          <div className="text-center mb-14">
            <div className="text-[10px] font-bold uppercase tracking-[3px] text-mjs-red mb-2">Reward Tiers</div>
            <h2 className="text-3xl font-black text-white">The More You Order,<br />The Better It Gets</h2>
            <p className="text-sm text-gray-500 mt-3 max-w-md mx-auto">Every tier gives you access to the same premium gifts. Higher tiers unlock on bigger orders.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {TIERS.map((tier, i) => (
              <div key={i} className="relative group">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 hover:border-white/20 transition-all">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tier.color} flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    {i === 0 && <Star className="w-7 h-7 text-white" />}
                    {i === 1 && <Star className="w-7 h-7 text-white" />}
                    {i === 2 && <Crown className="w-7 h-7 text-white" />}
                    {i === 3 && <Zap className="w-7 h-7 text-white" />}
                    {i === 4 && <Gift className="w-7 h-7 text-white" />}
                  </div>
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{tier.label}</div>
                  <div className="text-2xl font-black text-white">${tier.points.toLocaleString()}</div>
                  <div className="text-[10px] text-gray-500 mt-1">order minimum</div>
                  <div className="mt-4 text-[10px] font-bold text-mjs-red">1 Free Gift</div>
                </div>
              </div>
            ))}
          </div>

          {/* Tier visual strip */}
          <div className="mt-10 flex items-center gap-2 max-w-[700px] mx-auto">
            <div className="text-[10px] text-gray-600 font-bold">$0</div>
            <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden relative">
              <div className="h-full bg-gradient-to-r from-amber-600 via-yellow-400 via-indigo-500 to-mjs-red rounded-full w-full" />
              {TIERS.map((tier) => {
                const pct = (tier.points / 5000) * 100;
                return (
                  <div key={tier.points} className="absolute top-1/2 -translate-y-1/2" style={{ left: `${pct}%` }}>
                    <div className="w-3 h-3 bg-white rounded-full border-2 border-mjs-dark -ml-1.5" />
                  </div>
                );
              })}
            </div>
            <div className="text-[10px] text-gray-600 font-bold">$5,000+</div>
          </div>
        </div>
      </div>

      {/* ═══ GIFT SPOTLIGHT ═══ */}
      <div className="bg-white">
        <div className="max-w-[1100px] mx-auto px-4 py-20">
          <div className="text-center mb-14">
            <div className="text-[10px] font-bold uppercase tracking-[3px] text-mjs-red mb-2">Up Close</div>
            <h2 className="text-3xl font-black text-mjs-dark">Premium Brands, Premium Quality</h2>
            <p className="text-sm text-mjs-gray-500 mt-2">We picked gifts that working professionals actually want.</p>
          </div>

          {/* Large feature cards */}
          <div className="space-y-6">
            {GIFTS.map((gift, i) => (
              <div key={i} className={`rounded-2xl border border-gray-100 overflow-hidden flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                <div className="md:w-1/2 bg-gray-50 flex items-center justify-center p-10">
                  <img src={gift.image} alt={gift.name} className="max-h-[250px] object-contain drop-shadow-xl" />
                </div>
                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-1.5 bg-mjs-red/5 text-mjs-red text-[10px] font-bold px-3 py-1 rounded-full mb-4 w-fit">
                    <Gift className="w-3 h-3" />
                    FREE REWARD
                  </div>
                  <h3 className="text-2xl font-black text-mjs-dark">{gift.name}</h3>
                  <p className="text-sm text-mjs-gray-500 mt-2 leading-relaxed">{gift.description}</p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, si) => (
                        <Star key={si} className="w-4 h-4 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs text-mjs-gray-400">Top rated by our customers</span>
                  </div>
                  <div className="mt-5 text-xs text-mjs-gray-400">
                    Available at all reward tiers &middot; Orders $500+
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ FAQ ═══ */}
      <div className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-[800px] mx-auto px-4 py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black text-mjs-dark">Common Questions</h2>
          </div>
          <div className="space-y-3">
            {[
              { q: "How do I get a free gift?", a: "When your order total is $500 or more, a gift selection will appear during checkout. Pick one and it's included with your order." },
              { q: "Can I get a gift on every order?", a: "Yes! Every qualifying order ($500+) earns a gift. Place 10 qualifying orders, get 10 gifts." },
              { q: "What if I don't want a gift right now?", a: "No problem. You can skip the gift and save your reward points for a future order." },
              { q: "Do I get better gifts with bigger orders?", a: "The same premium gifts are available at every tier. Higher order totals unlock higher tiers for future perks." },
              { q: "Do I need an account?", a: "Guest orders qualify too, but we recommend creating an account so we can track your rewards history." },
              { q: "When will I receive my gift?", a: "Your gift ships with your order, or you can pick it up at our Anaheim warehouse." },
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-shadow">
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
        </div>
        <div className="max-w-[800px] mx-auto px-4 py-16 text-center relative">
          <div className="text-5xl mb-4">&#127873;</div>
          <div className="text-3xl font-black text-white mb-3">Your next order could<br />come with a <span className="text-mjs-red">free gift.</span></div>
          <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto">
            Place an order of $500 or more and choose from our selection of premium rewards. It&apos;s that simple.
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
          <div className="mt-6 text-xs text-gray-600">Questions? Call us at <a href="tel:7147792640" className="text-mjs-red font-semibold">(714) 779-2640</a></div>
        </div>
      </div>
    </section>
  );
}
