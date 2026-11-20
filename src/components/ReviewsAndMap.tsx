"use client";

import Image from "next/image";
import { Star, MapPin, ArrowUpRight } from "lucide-react";
import { BUSINESS, GOOGLE_REVIEWS } from "@/lib/business";

/*
 * Homepage "Customer reviews" + "Visit our Anaheim showroom" block (desktop/tablet).
 * Replaces the boxed review summary + horizontal marquee (Testimonials.tsx, kept on disk).
 *
 *   left  — rating, Google reviews count, then a slow vertical auto-scroll of
 *           real Google reviews (pauses on hover)
 *   right — static light map centred on the warehouse (OpenStreetMap data,
 *           rendered once to public/images/map-anaheim-light.webp so there is no
 *           third-party iframe or script), MJS pin at the centre, and a floating
 *           address / hours / Get directions bar over the bottom edge
 */

const ADDRESS = `${BUSINESS.address.street}, ${BUSINESS.address.city}, ${BUSINESS.address.state} ${BUSINESS.address.zip}`;
const DIRECTIONS = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${BUSINESS.name}, ${ADDRESS}`)}`;

const REVIEWS = [
  { name: "Doug N.", text: "David and Zack are the best. Can always count on them to deliver quality products at a great price. Can't recommend them enough!" },
  { name: "Theresa A.", text: "I can count on Mobile Janitorial Supply for good prices and quality products! Best customer service!" },
  { name: "Chris M.", text: "Excellent service (prompt, friendly, informative), very competitive pricing and orders are fulfilled next day. Very happy with Nick and his team." },
  { name: "Brianda L.", text: "I order supplies for our school, and they consistently provide the best products along with excellent service. David has been a real gem." },
  { name: "Slavic T.", text: "Orders are always delivered on time, and the staff is super friendly and knowledgeable. They carry everything I need to keep my business clean and stocked." },
  { name: "Deanna B.", text: "Great pricing and quick delivery time, along with excellent customer service makes Mobile Janitorial the best! Nick and Dave are awesome to work with." },
  { name: "Larissa T.", text: "Excellent service, good prices. They have sold their products to me for over 10 years and I have never had any problems." },
  { name: "Matt S.", text: "Not only did they have TP during the pandemic but they never price gouge like so many others. I wish I could give them more than 5 stars." },
  { name: "Clever C.", text: "They respond quickly to email questions and orders. Their pricing is competitive and orders are fulfilled next day. We've been using them for years." },
  { name: "Michelle H.", text: "Great prices! Great bunch of guys! Quick shippers!" },
  { name: "Sharon G.", text: "Great customer service, which is hard to find nowadays. Deliveries are made in a timely manner. They surely go above and beyond!" },
  { name: "D Bros Portables", text: "David, Nick and Zack, it is our pleasure to do business with you and your team. You have been providing all that we need." },
];

const AVATAR = ["#2563eb", "#7c3aed", "#059669", "#dc2626", "#d97706", "#0891b2", "#db2777", "#4f46e5"];

function Stars({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => <Star key={i} className={`${className} text-[#f5b301] fill-[#f5b301]`} />)}
    </span>
  );
}

function GoogleG({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-2.8-.4-4H24v7.3h12.1c-.3 2-1.6 5-4.5 7l6.9 5.3c4.2-3.8 6.6-9.4 6.6-15.6z" />
      <path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.3l-6.9-5.3c-1.9 1.3-4.4 2.2-7.6 2.2-5.8 0-10.7-3.8-12.5-9.1l-7.2 5.5C7.9 41 15.3 46 24 46z" />
      <path fill="#FBBC05" d="M11.5 28.5c-.5-1.4-.8-2.9-.8-4.5s.3-3.1.8-4.5l-7.2-5.5C2.9 16.8 2 20.3 2 24s.9 7.2 2.3 10z" />
      <path fill="#EA4335" d="M24 10.4c3.3 0 5.5 1.4 6.8 2.6l5-4.9C32.7 5.2 28.9 3 24 3c-8.7 0-16.1 5-19.7 12.3l7.2 5.5c1.8-5.3 6.7-9.1 12.5-9.1z" />
    </svg>
  );
}

export default function ReviewsAndMap() {
  const feed = [...REVIEWS, ...REVIEWS]; // doubled so the loop is seamless

  return (
    <section className="hidden md:block bg-white py-6">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] gap-4 h-[440px] lg:h-[480px]">

          {/* ── Customer reviews ── */}
          <div className="rounded-2xl px-6 lg:px-8 pt-6 flex flex-col min-w-0 overflow-hidden" style={{ background: "linear-gradient(180deg, #f7f8fa 0%, #e9ecf0 100%)" }}>
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 lg:gap-4">
              <div>
                <h2 className="text-[24px] lg:text-[28px] leading-none font-black tracking-tight text-mjs-dark">Customer reviews</h2>
                <div className="mt-2.5 flex items-end gap-3">
                  <span className="text-[48px] lg:text-[54px] leading-none font-black tracking-tight text-mjs-dark">{GOOGLE_REVIEWS.rating}</span>
                  <Stars className="w-6 h-6 lg:w-7 lg:h-7 mb-1.5" />
                </div>
              </div>
              <a href={GOOGLE_REVIEWS.url} target="_blank" rel="noopener noreferrer" className="shrink-0 lg:mt-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-[13px] font-bold text-mjs-dark hover:text-mjs-red transition-colors whitespace-nowrap">
                <GoogleG className="w-4 h-4" /> {GOOGLE_REVIEWS.count} reviews <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Slow vertical auto-scroll; hover to pause */}
            <div className="relative mt-4 flex-1 min-h-0 overflow-hidden review-fade">
              <ul className="review-scroll list-none m-0 p-0 space-y-4 pr-2">
                {feed.map((r, i) => (
                  <li key={`${r.name}-${i}`} className="flex gap-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-black text-white" style={{ background: AVATAR[r.name.charCodeAt(0) % AVATAR.length] }}>{r.name[0]}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2"><span className="text-[13.5px] font-black text-mjs-dark">{r.name}</span><Stars className="w-3.5 h-3.5" /></div>
                      <p className="mt-0.5 text-[13.5px] leading-snug text-mjs-dark/75">&ldquo;{r.text}&rdquo;</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Map ── */}
          <div className="relative rounded-2xl overflow-hidden min-w-0 bg-[#eceef1]">
            <Image src="/images/map-anaheim-light.webp" alt={`Map of ${BUSINESS.name} at ${ADDRESS}`} fill sizes="(max-width: 1400px) 60vw, 830px" quality={85} className="object-cover" />

            {/* MJS pin on the building (image is centred on the address) */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full flex flex-col items-center">
              <span className="rounded-xl bg-[#fecd02] px-3.5 py-1.5 text-[16px] font-black tracking-tight text-mjs-dark shadow-[0_8px_20px_rgba(0,0,0,0.22)]">MJS</span>
              <span className="-mt-px h-0 w-0 border-x-[9px] border-t-[11px] border-x-transparent border-t-[#fecd02]" />
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-mjs-red ring-4 ring-white shadow" />
            </div>

            <span className="absolute right-3 top-2 text-[10px] text-mjs-dark/45">© OpenStreetMap contributors</span>

            {/* Floating visit bar */}
            <div className="absolute inset-x-4 bottom-4 flex items-center gap-4 rounded-xl bg-white/92 backdrop-blur px-4 lg:px-5 py-3 shadow-[0_10px_30px_rgba(23,32,52,0.14)]">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mjs-red text-white"><MapPin className="w-5 h-5" strokeWidth={2.3} /></span>
              <div className="min-w-0 flex-1">
                <div className="text-[16px] lg:text-[17px] font-black leading-tight text-mjs-dark whitespace-nowrap">Visit our Anaheim showroom</div>
                <div className="mt-0.5 text-[12.5px] lg:text-[13px] text-mjs-dark/70 truncate">{ADDRESS} <span className="mx-1.5 text-mjs-dark/30">|</span> {BUSINESS.hours.replace(" PT", "")}</div>
              </div>
              <a href={DIRECTIONS} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-mjs-red px-4 py-2.5 text-[13.5px] font-bold text-white hover:bg-mjs-red-dark transition-colors whitespace-nowrap">
                Get directions <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        .review-fade {
          mask-image: linear-gradient(to bottom, transparent, #000 10%, #000 86%, transparent);
          -webkit-mask-image: linear-gradient(to bottom, transparent, #000 10%, #000 86%, transparent);
        }
        .review-scroll { animation: reviewScroll 70s linear infinite; }
        .review-fade:hover .review-scroll { animation-play-state: paused; }
        @keyframes reviewScroll { from { transform: translateY(0); } to { transform: translateY(-50%); } }
        @media (prefers-reduced-motion: reduce) { .review-scroll { animation: none; } }
      `}</style>
    </section>
  );
}
