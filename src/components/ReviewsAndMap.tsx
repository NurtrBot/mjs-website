"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Star, MapPin, ArrowUpRight, Clock, Phone, X, CornerDownRight } from "lucide-react";
import { BUSINESS, GOOGLE_REVIEWS } from "@/lib/business";

/*
 * Homepage "Customer reviews" + "Visit our Anaheim showroom" block (desktop/tablet).
 * Replaces the boxed review summary + horizontal marquee (Testimonials.tsx, kept on disk).
 *
 *   left  — rating, Google reviews count, then a slow vertical auto-scroll of
 *           real Google reviews (pauses on hover). Star-only reviews show the
 *           owner's reply instead of a quote.
 *   right — static Apple-Maps-style map centred on the warehouse (OpenStreetMap
 *           data via OpenFreeMap vector tiles, restyled and rendered once to
 *           public/images/map-anaheim-v2.webp, so there is no third-party
 *           iframe or script). The pin is a storefront photo; clicking it opens
 *           a card with the photo, hours, address, phone and directions.
 */

const ADDRESS = `${BUSINESS.address.street}, ${BUSINESS.address.city}, ${BUSINESS.address.state} ${BUSINESS.address.zip}`;
const DIRECTIONS = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${BUSINESS.name}, ${ADDRESS}`)}`;
const HOURS = BUSINESS.hours.replace(" PT", "");

type Review = { name: string; text?: string; reply?: string };

// Newest first. `text` is the customer's own words; `reply` is our owner response
// on Google (shown for star-only reviews so the feed still has something to say).
const REVIEWS: Review[] = [
  { name: "Cleaning Service", reply: "Thanks for stopping by! We're glad you liked the showroom and our prices." },
  { name: "Doug N.", text: "David and Zack are the best. Can always count on them to deliver quality products at a great price. Can't recommend them enough!" },
  { name: "Norma N.", reply: "Thank you for the five stars, Norma! We look forward to seeing you again." },
  { name: "Theresa A.", text: "I can count on Mobile Janitorial Supply for good prices and quality products! Best customer service!" },
  { name: "Danny C.", reply: "Thanks, Danny! We'll pass your kind words along to the team." },
  { name: "Chris M.", text: "Excellent service (prompt, friendly, informative), very competitive pricing and orders are fulfilled next day. Very happy with Nick and his team." },
  { name: "El Verbo De La Palabra", reply: "Thanks for giving us a try! We're glad our team made your first visit easy and that our pricing worked for you." },
  { name: "Brianda L.", text: "I order supplies for our school, and they consistently provide the best products along with excellent service. David has been a real gem." },
  { name: "Keith D.", reply: "Thanks, Keith! We take pride in keeping the showroom clean and well stocked. It's great to hear our team was helpful, too." },
  { name: "Slavic T.", text: "Orders are always delivered on time, and the staff is super friendly and knowledgeable. They carry everything I need to keep my business clean and stocked." },
  { name: "Mauricio P.", reply: "Thanks for recommending us, Mauricio! It means a lot to our family business." },
  { name: "Deanna B.", text: "Great pricing and quick delivery time, along with excellent customer service makes Mobile Janitorial the best! Nick and Dave are awesome to work with." },
  { name: "Ray L.", reply: "Always good to see you, Ray! Glad you're finding great prices when you stop by." },
  { name: "Larissa T.", text: "Excellent service, good prices. They have sold their products to me for over 10 years and I have never had any problems." },
  { name: "Fanny S.", reply: "Thanks for the five stars, Fanny! We appreciate your support." },
  { name: "Matt S.", text: "Not only did they have TP during the pandemic but they never price gouge like so many others. I wish I could give them more than 5 stars." },
  { name: "Erum S.", reply: "Thanks for coming by, Erum, and for taking a moment to rate your visit!" },
  { name: "Clever C.", text: "They respond quickly to email questions and orders. Their pricing is competitive and orders are fulfilled next day. We've been using them for years." },
  { name: "Patricia C.", reply: "Thank you for shopping with us, Patricia! We're happy you had a five-star visit." },
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
  const [cardOpen, setCardOpen] = useState(false);

  useEffect(() => {
    if (!cardOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setCardOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [cardOpen]);

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
                      {r.text ? (
                        <p className="mt-0.5 text-[13.5px] leading-snug text-mjs-dark/75">&ldquo;{r.text}&rdquo;</p>
                      ) : (
                        <p className="mt-0.5 text-[13px] leading-snug text-mjs-dark/50">Rated 5 stars on Google</p>
                      )}
                      {r.reply && (
                        <p className="mt-1 flex gap-1.5 text-[12.5px] leading-snug text-mjs-dark/60">
                          <CornerDownRight className="mt-[3px] h-3 w-3 shrink-0 text-mjs-dark/40" />
                          <span><span className="font-bold text-mjs-dark/70">MJS</span> {r.reply}</span>
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Map ── */}
          <div className="relative rounded-2xl overflow-hidden min-w-0 bg-[#f4f2ec]">
            <Image src="/images/map-anaheim-v2.webp" alt={`Map of ${BUSINESS.name} at ${ADDRESS}`} fill sizes="(max-width: 1400px) 60vw, 830px" quality={85} className="object-cover" />

            {/* click-away layer while the card is open */}
            {cardOpen && <button type="button" aria-label="Close" onClick={() => setCardOpen(false)} className="absolute inset-0 z-10 cursor-default" />}

            {/* Storefront pin on the building (map is centred on the address) */}
            <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-full flex flex-col items-center">
              <button
                type="button"
                onClick={() => setCardOpen((o) => !o)}
                aria-expanded={cardOpen}
                aria-label={cardOpen ? "Hide showroom details" : "Show showroom details"}
                className="group flex flex-col items-center focus:outline-none"
              >
                <span className="relative block h-[58px] w-[58px] lg:h-[64px] lg:w-[64px] overflow-hidden rounded-2xl ring-[3px] ring-white shadow-[0_10px_24px_rgba(0,0,0,0.28)] transition-transform group-hover:scale-105">
                  <Image src="/images/mjs-storefront-v2.webp" alt="" fill sizes="128px" quality={80} className="object-cover" />
                </span>
                <span className="-mt-px h-0 w-0 border-x-[8px] border-t-[10px] border-x-transparent border-t-white drop-shadow" />
                <span className="mt-1 h-3 w-3 rounded-full bg-mjs-red ring-4 ring-white shadow transition-transform group-hover:scale-110" />
              </button>
            </div>

            {/* Place card, Apple-Maps style, anchored to the top-left of the map */}
            {cardOpen && (
              <div className="absolute right-4 top-4 z-30 w-[310px] lg:w-[340px] overflow-hidden rounded-2xl bg-white shadow-[0_18px_50px_rgba(23,32,52,0.28)] animate-[pinCard_180ms_cubic-bezier(0.16,1,0.3,1)]">
                <div className="relative aspect-[16/9] w-full">
                  <Image src="/images/mjs-storefront-v2.webp" alt={`${BUSINESS.name} showroom in Anaheim`} fill sizes="340px" quality={80} className="object-cover" />
                  <button type="button" onClick={() => setCardOpen(false)} aria-label="Close" className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur hover:bg-black/75">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="px-4 pt-3 pb-4">
                  <div className="text-[15px] font-black leading-tight text-mjs-dark">{BUSINESS.name}</div>
                  <div className="mt-0.5 text-[12px] font-semibold text-mjs-dark/55">Showroom &amp; warehouse · Open to the public</div>
                  <ul className="mt-2.5 space-y-1.5 list-none m-0 p-0 text-[12.5px] text-mjs-dark/80">
                    <li className="flex items-start gap-2"><MapPin className="mt-[2px] h-3.5 w-3.5 shrink-0 text-mjs-red" strokeWidth={2.3} /><span>{ADDRESS}</span></li>
                    <li className="flex items-start gap-2"><Clock className="mt-[2px] h-3.5 w-3.5 shrink-0 text-mjs-red" strokeWidth={2.3} /><span>{HOURS}</span></li>
                    <li className="flex items-start gap-2"><Phone className="mt-[2px] h-3.5 w-3.5 shrink-0 text-mjs-red" strokeWidth={2.3} /><a href={BUSINESS.phoneHref} className="hover:text-mjs-red">{BUSINESS.phone}</a></li>
                  </ul>
                  <a href={DIRECTIONS} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-mjs-red px-4 py-2 text-[13px] font-bold text-white hover:bg-mjs-red-dark transition-colors">
                    Get directions <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}

            <span className="absolute left-3 top-2 text-[10px] text-mjs-dark/45">© OpenStreetMap contributors</span>

            {/* Floating visit bar */}
            <div className="absolute inset-x-0 bottom-0 flex items-center gap-4 px-5 lg:px-6 py-3.5 shadow-[0_-8px_24px_rgba(23,32,52,0.10)]" style={{ background: "linear-gradient(180deg, #f9fafb 0%, #eceff3 100%)" }}>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mjs-red text-white"><MapPin className="w-5 h-5" strokeWidth={2.3} /></span>
              <div className="min-w-0 flex-1">
                <div className="text-[16px] lg:text-[17px] font-black leading-tight text-mjs-dark whitespace-nowrap">Visit our Anaheim showroom</div>
                <div className="mt-0.5 text-[12.5px] lg:text-[13px] text-mjs-dark/70 truncate">{ADDRESS} <span className="mx-1.5 text-mjs-dark/30">|</span> {HOURS}</div>
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
        .review-scroll { animation: reviewScroll 110s linear infinite; }
        .review-fade:hover .review-scroll { animation-play-state: paused; }
        @keyframes reviewScroll { from { transform: translateY(0); } to { transform: translateY(-50%); } }
        @keyframes pinCard { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .review-scroll { animation: none; } }
      `}</style>
    </section>
  );
}
