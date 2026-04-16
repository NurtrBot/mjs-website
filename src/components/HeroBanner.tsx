"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, Percent, Truck, Star } from "lucide-react";

/* ── Carousel Slides ── */
const slides: {
  id: number;
  headline: string;
  sub: string;
  cta: string;
  href: string;
  gradient: string;
  accent: string;
  image: string;
  isBanner?: boolean;
}[] = [
  {
    id: 1,
    headline: "",
    sub: "",
    cta: "Shop Now",
    href: "/shop/paper-restroom",
    gradient: "from-[#0a1628] via-[#0a1628] to-[#0a1628]",
    accent: "bg-mjs-gold",
    image: "/banner-01.jpg",
    isBanner: true,
  },
  {
    id: 2,
    headline: "",
    sub: "",
    cta: "Shop Now",
    href: "/shop/packaging-film",
    gradient: "from-[#0a1628] via-[#0a1628] to-[#0a1628]",
    accent: "bg-mjs-gold",
    image: "/banner-02.jpg",
    isBanner: true,
  },
  {
    id: 3,
    headline: "",
    sub: "",
    cta: "Shop Now",
    href: "/shop/cleaning-chemicals",
    gradient: "from-[#0a1628] via-[#0a1628] to-[#0a1628]",
    accent: "bg-blue-600",
    image: "/banner-03.jpg",
    isBanner: true,
  },
  {
    id: 4,
    headline: "",
    sub: "",
    cta: "Shop Now",
    href: "/shop/breakroom-food",
    gradient: "from-[#0a1628] via-[#0a1628] to-[#0a1628]",
    accent: "bg-mjs-gold",
    image: "/banner-04.jpg",
    isBanner: true,
  },
  {
    id: 5,
    headline: "",
    sub: "",
    cta: "Shop Now",
    href: "/shop/gloves-safety",
    gradient: "from-[#0a1628] via-[#0a1628] to-[#0a1628]",
    accent: "bg-mjs-gold",
    image: "/banner-05.jpg",
    isBanner: true,
  },
  {
    id: 6,
    headline: "",
    sub: "",
    cta: "Shop Now",
    href: "/shop/cleaning-chemicals",
    gradient: "from-[#87CEEB] via-[#87CEEB] to-[#87CEEB]",
    accent: "bg-blue-600",
    image: "/banner-tossins.png",
    isBanner: true,
  },
];

/* ── Deal Tabs (below carousel) ── */
const dealTabs = [
  { label: "PAPER PRODUCTS", sub: "Upto 25% OFF", active: false, href: "/shop/paper-restroom" },
  { label: "CHEMICALS", sub: "Best Prices", active: false, href: "/shop/cleaning-chemicals" },
  { label: "GLOVES", sub: "Upto 30% OFF", active: false, href: "/shop/gloves-safety" },
  { label: "PACKAGING", sub: "Upto 20% OFF", active: false, href: "/category/packaging-film" },
  { label: "WEEKLY DEALS", sub: "Limited Time", active: true, href: "/search?q=deals" },
];


export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const goTo = (index: number) => {
    setCurrent(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const slide = slides[current];

  return (
    <section className="bg-mjs-gray-50">
      <div className="max-w-[1400px] mx-auto px-4 pt-4">
        {/* ═══ MAIN CAROUSEL ═══ */}
        <div className="relative rounded-2xl overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0">
            <img
              src={slide.image}
              alt=""
              className={`w-full h-full ${slide.isBanner ? "object-contain" : "object-cover"}`}
            />
            {!slide.isBanner && (
              <>
                <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} opacity-85`} />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
              </>
            )}
          </div>

          {/* Content */}
          <div className={`relative min-h-[240px] sm:min-h-[280px] md:min-h-[320px] flex items-center px-8 md:px-14 py-10 ${slide.isBanner ? "pointer-events-none" : ""}`}>
            {!slide.isBanner && (
              <>
                <div className="max-w-md">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight tracking-tight mb-2">
                    {slide.headline}
                  </h2>
                  <p className="text-sm text-white/70 mb-5 leading-relaxed">
                    {slide.sub}
                  </p>
                  <a
                    href={slide.href}
                    className={`inline-flex items-center gap-2 ${slide.accent} hover:opacity-90 text-white font-bold px-5 py-2.5 rounded-lg text-sm transition-all shadow-lg pointer-events-auto`}
                  >
                    {slide.cta}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>

                {/* Right Side - Floating Badge */}
                <div className="hidden md:flex items-center gap-3 ml-auto">
                  <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl px-5 py-4 text-center">
                    <div className="flex items-center justify-center gap-0.5 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-mjs-gold fill-mjs-gold" />
                      ))}
                    </div>
                    <div className="text-white font-bold text-sm">4.9 Rating</div>
                    <div className="text-white/50 text-[10px]">229 Google Reviews</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl px-5 py-4 text-center">
                    <div className="text-2xl font-black text-white">10K+</div>
                    <div className="text-white/50 text-[10px]">Products</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl px-5 py-4 text-center">
                    <div className="text-2xl font-black text-white">35+</div>
                    <div className="text-white/50 text-[10px]">Years</div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Nav Arrows */}
          <button
            onClick={() => goTo((current - 1 + slides.length) % slides.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={() => goTo((current + 1) % slides.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>

          {/* Progress Bars */}
          <div className="absolute bottom-0 left-0 right-0 flex h-1">
            {slides.map((_, i) => (
              <div key={i} className="flex-1 bg-black/20">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    i === current ? "bg-mjs-red w-full" : "bg-transparent w-0"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ═══ DEAL TABS (Moglix caption bar) ═══ */}
        <div className="flex border border-gray-200 rounded-xl overflow-hidden mt-3 bg-white">
          {dealTabs.map((tab, i) => (
            <a
              key={tab.label}
              href={tab.href}
              className={`flex-1 text-center py-2.5 px-2 transition-all hover:bg-gray-50 ${
                i < dealTabs.length - 1 ? "border-r border-gray-200" : ""
              } ${tab.active ? "bg-red-50" : ""}`}
            >
              <div
                className={`text-[11px] font-bold ${
                  tab.active ? "text-mjs-red" : "text-mjs-gray-700"
                }`}
              >
                {tab.label}
              </div>
              <div
                className={`text-[10px] mt-0.5 ${
                  tab.active
                    ? "text-mjs-red font-semibold"
                    : "text-mjs-gray-400"
                }`}
              >
                {tab.sub}
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
