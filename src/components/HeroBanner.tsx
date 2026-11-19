"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import ProductShelf from "@/components/ProductShelf";
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, Percent, Truck, Star } from "lucide-react";
import { DELIVERY_BANNER, GOOGLE_REVIEWS } from "@/lib/business";

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
  /** true = always crop to fill; "lg" = fill from 1024px up, letterbox below (keeps edge text visible on tablets) */
  coverBanner?: boolean | "lg";
  /** Fills any letterbox space around a contained banner (matches the banner's own background) */
  bgColor?: string;
  /** Real HTML button drawn on top of a banner slide, positioned in % of the slide box */
  ctaOverlay?: { left: string; top: string };
}[] = [
  {
    id: 10,
    headline: "",
    sub: "",
    cta: "Shop bath tissue",
    href: "/product/janitors-finest-2-ply-toilet-tissue-4-3-x-3-5-500-sheets-per-roll-96-rolls-per-case-5602",
    gradient: "from-[#f3f6f9] via-[#f3f6f9] to-[#f3f6f9]",
    accent: "bg-mjs-red",
    image: "/banner-5602-tissue.jpg",
    isBanner: true,
    // Art runs edge to edge, so never crop it: letterbox on the art's own background colour instead
    bgColor: "#f6f7f9",
    // Button sits under "the big pack." — positioned relative to the artwork's centre in units of
    // its rendered height (--hh, set on the overlay button), so it tracks the art at every width.
    ctaOverlay: { left: "calc(50% - 1.84 * var(--hh))", top: "calc(50% + 0.185 * var(--hh))" },
  },
  {
    id: 1,
    headline: "",
    sub: "",
    cta: "Shop Now",
    href: "/category/paper-products",
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
    href: "/category/trash-liners",
    gradient: "from-[#0a1628] via-[#0a1628] to-[#0a1628]",
    accent: "bg-mjs-gold",
    image: "/banner-02.jpg",
    isBanner: true,
    coverBanner: true,
  },
  {
    id: 3,
    headline: "",
    sub: "",
    cta: "Shop Now",
    href: "/category/cleaning-chemicals",
    gradient: "from-[#0a1628] via-[#0a1628] to-[#0a1628]",
    accent: "bg-blue-600",
    image: "/banner-03.jpg",
    isBanner: true,
    coverBanner: true,
  },
  {
    id: 4,
    headline: "",
    sub: "",
    cta: "Shop Now",
    href: "/category/breakroom",
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
    href: "/category/gloves-safety",
    gradient: "from-[#0a1628] via-[#0a1628] to-[#0a1628]",
    accent: "bg-mjs-gold",
    image: "/banner-05.jpg",
    isBanner: true,
  },
  {
    id: 8,
    headline: "",
    sub: "",
    cta: "Shop Johnny's Choice",
    href: "/brands/johnnys-choice",
    gradient: "from-[#1a1f2e] via-[#1a1f2e] to-[#1a1f2e]",
    accent: "bg-mjs-red",
    image: "/banner-shop-by-workspace.jpg",
    isBanner: true,
  },
];

/* ── Deal Tabs (below carousel) ── */
const dealTabs = [
  { label: "SCHOOLS", sub: "Restroom & Classroom Supplies", active: false, href: "/industries/schools", featured: false },
  { label: "HOSPITALITY", sub: "Hotels & Restaurants", active: false, href: "/category/breakroom", featured: false },
  { label: "PORTABLE RESTROOM SUPPLIES", sub: "Deodorizers, Paper & More", active: true, href: "/industries/portable-restroom", featured: true },
  { label: "MANUFACTURING", sub: "Industrial & Warehouse", active: false, href: "/category/packaging-film", featured: false },
  { label: "HEALTHCARE", sub: "Medical & Facilities", active: false, href: "/category/gloves-safety", featured: false },
];


/*
 * Desktop slide carousel is HIDDEN for now (2026-11-19) and the Local Delivery
 * "Restock in 1–3 days" banner takes its slot. The slides, arrows and progress
 * bars are all still here — flip this to true to bring the carousel back.
 * The mobile hero and the industry tabs are unaffected.
 */
const SHOW_CAROUSEL = false;

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || !SHOW_CAROUSEL) return;
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
    <section className="bg-white">
      <div className="max-w-[1400px] mx-auto px-0 md:px-4 pt-0 md:pt-4">
        {/* ═══ MOBILE: Delivery strip + Star Seller banner ═══ */}
        <div className="md:hidden">
          <div className="bg-gradient-to-r from-mjs-red via-red-600 to-mjs-red-dark py-3 text-center shadow-sm">
            <div className="text-[9px] sm:text-[11px] font-bold text-white tracking-wide">
              {DELIVERY_BANNER} <span className="text-white/70 font-normal">(Before Tax)</span>
            </div>
          </div>
          <a href="/product/janitors-finest-2-ply-toilet-tissue-4-3-x-3-5-500-sheets-per-roll-96-rolls-per-case-5602">
            {/* Mobile LCP: resized AVIF/WebP, fetched first */}
            <Image
              src="/images/mobile-hero-star-seller.jpg"
              alt="Star Seller — Janitors Finest Premium Plus 96 Rolls as low as $39.99"
              width={1200}
              height={600}
              sizes="100vw"
              quality={85}
              loading="eager"
              fetchPriority="high"
              className="w-full h-auto block"
            />
          </a>
        </div>

        {/* ═══ DESKTOP: Local Delivery banner (in the carousel's slot while it's hidden) ═══ */}
        {SHOW_CAROUSEL ? (
          /* ═══ DESKTOP: Full Carousel ═══ */
        <div className="relative rounded-2xl overflow-hidden hidden md:block">
          {/* Clickable banner link */}
          {slide.isBanner && (
            <a href={slide.href} className="absolute inset-0 z-[5] cursor-pointer" />
          )}

          {/* Background */}
          <div className="absolute inset-0" style={{ containerType: "size", ...(slide.bgColor ? { backgroundColor: slide.bgColor } : {}) }}>
            {/* Desktop-only carousel: phones get a 1×1 blank so they never download these banners */}
            <picture>
              <source media="(max-width: 767px)" srcSet="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" />
              <img
                src={slide.image}
                alt=""
                className={`w-full h-full ${slide.coverBanner === "lg" ? "object-contain lg:object-cover" : slide.coverBanner ? "object-cover" : slide.isBanner ? "object-contain" : "object-cover"}`}
              />
            </picture>
            {/* Real button on top of banner artwork that leaves space for one (sized in cqh = % of slide height) */}
            {slide.isBanner && slide.ctaOverlay && (
              <a
                href={slide.href}
                style={{ left: slide.ctaOverlay.left, top: slide.ctaOverlay.top, fontSize: "calc(0.06 * var(--hh))", padding: "calc(0.022 * var(--hh)) calc(0.048 * var(--hh))", gap: "calc(0.018 * var(--hh))" }}
                // --hh = rendered height of the 2800×640 art: object-contain is width-bound (min), object-cover height-bound (max)
                className={`absolute z-[6] inline-flex items-center whitespace-nowrap rounded-full bg-[#fecd02] text-[#1b1b1b] font-bold shadow-md hover:bg-[#ffd836] transition-colors ${
                  slide.coverBanner === true ? "[--hh:max(100cqh,22.857cqw)]"
                  : slide.coverBanner === "lg" ? "[--hh:min(100cqh,22.857cqw)] lg:[--hh:max(100cqh,22.857cqw)]"
                  : "[--hh:min(100cqh,22.857cqw)]"}`}
              >
                {slide.cta}
                <ArrowRight style={{ width: "1.1em", height: "1.1em" }} />
              </a>
            )}
            {!slide.isBanner && (
              <>
                <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} opacity-85`} />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
              </>
            )}
          </div>

          {/* Content */}
          <div className={`relative min-h-[160px] sm:min-h-[200px] md:min-h-[320px] flex items-center px-4 md:px-14 py-4 md:py-10 ${slide.isBanner ? "pointer-events-none" : ""}`}>
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
                    <div className="text-white font-bold text-sm">{GOOGLE_REVIEWS.rating} Rating</div>
                    <div className="text-white/50 text-[10px]">{GOOGLE_REVIEWS.count} Google Reviews</div>
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
            className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-md hidden md:flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={() => goTo((current + 1) % slides.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-md hidden md:flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>

          {/* Progress Bars — desktop only */}
          <div className="absolute bottom-0 left-0 right-0 hidden md:flex h-1">
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
        ) : (
          <div className="hidden md:block overflow-hidden rounded-3xl">
            <Image
              src="/banner-local-delivery-v4.jpg"
              alt="Local delivery: restock in 1–3 days across Orange, Riverside and Los Angeles counties. Free delivery on a $399+ subtotal; some ZIP codes excluded."
              width={2800}
              height={792}
              sizes="(max-width: 1400px) 100vw, 1400px"
              quality={85}
              loading="eager"
              fetchPriority="high"
              className="block h-auto w-full"
            />
          </div>
        )}

        {/* ═══ DEAL TABS (hidden on mobile, shown on md+) ═══ */}
        {/* Same navy as the top delivery bar (bg-mjs-dark) */}
        <div className="hidden md:flex rounded-xl overflow-hidden mt-3 bg-mjs-dark">
          {dealTabs.map((tab, i) => (
            <a
              key={tab.label}
              href={tab.href}
              className={`text-center py-1.5 px-1 md:py-3 md:px-2 transition-all hover:bg-white/10 ${
                tab.featured ? "flex-[1.4]" : "flex-1"
              } ${
                i < dealTabs.length - 1 ? "border-r border-white/15" : ""
              } ${tab.active ? "bg-white/10" : ""}`}
            >
              <div
                className="text-[9px] md:text-[13px] font-black tracking-wide text-white"
              >
                {tab.label}
              </div>
              <div
                className="text-[7px] md:text-[11px] mt-0.5 font-semibold text-white/75"
              >
                {tab.sub}
              </div>
            </a>
          ))}
        </div>

        {/* ═══ Illustrated product shelf standing on the grey/white edge, same width as the tab bar ═══ */}
        <ProductShelf />
      </div>
    </section>
  );
}
