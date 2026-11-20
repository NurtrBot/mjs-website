import Image from "next/image";
import { ArrowRight } from "lucide-react";

/*
 * "Guides & Resources" row (desktop/tablet): five of the most universal
 * resources from /resources and /guides as illustrated cards. Replaced the
 * New Arrivals strip on the homepage (2026-11-19); NewArrivals.tsx is kept.
 *
 * Artwork: public/images/guides/*.webp (3:2 illustrations, each on its own
 * pastel studio background, which also becomes the card's top panel).
 */
const CARDS = [
  { key: "dilution", title: "Chemical Dilution Chart", blurb: "Find the right mix for each cleaner.", cta: "View chart", href: "/guides/cleaning-chemical-dilution-chart" },
  { key: "checklist", title: "Janitorial Supply Checklist", blurb: "Plan your restock, room by room.", cta: "Get checklist", href: "/guides/janitorial-supply-checklist" },
  { key: "trash-bag", title: "Trash Bag Size Guide", blurb: "Match your bin to the right liner.", cta: "Find your size", href: "/guides/trash-bag-size-guide" },
  { key: "bid", title: "How to Bid a Cleaning Job", blurb: "Estimate labor, supplies and margin.", cta: "Read guide", href: "/guides/how-to-bid-a-cleaning-job" },
  { key: "sds", title: "Safety Data Sheets (SDS)", blurb: "Find safety information for your chemicals.", cta: "Browse SDS", href: "/resources" },
];

export default function ResourceCards() {
  return (
    <section className="hidden md:block bg-white py-8">
      <div className="max-w-[1400px] mx-auto px-4">
        <h2 className="text-[22px] lg:text-[26px] font-black tracking-tight text-mjs-dark mb-5 text-center">Guides &amp; Resources for Your Facility</h2>
        <ul className="grid grid-cols-5 gap-3 lg:gap-4 list-none m-0 p-0">
          {CARDS.map((c) => (
            <li key={c.key} className="min-w-0">
              <a href={c.href} className="group flex h-full flex-col overflow-hidden rounded-2xl">
                <div className="relative aspect-[3/2] w-full">
                  <Image src={`/images/guides/${c.key}.webp`} alt="" fill sizes="(max-width: 1400px) 20vw, 270px" quality={82} className="object-cover" />
                </div>
                {/* Text panel: soft grey gradient, no outlines, everything centred */}
                <div className="flex flex-1 flex-col items-center px-3 lg:px-5 pt-3 lg:pt-4 pb-4 lg:pb-5 text-center" style={{ background: "linear-gradient(180deg, #f7f8fa 0%, #e9ecf0 100%)" }}>
                  <h3 className="text-[15px] lg:text-[18px] font-black leading-snug tracking-tight text-mjs-dark text-balance">{c.title}</h3>
                  <p className="mt-1 text-[13px] lg:text-[14px] leading-snug text-mjs-gray-600">{c.blurb}</p>
                  <div className="mt-auto pt-3 lg:pt-4 inline-flex items-center gap-1.5 lg:gap-2 text-[14px] lg:text-[15px] font-bold text-mjs-red group-hover:text-mjs-red-dark whitespace-nowrap">
                    <span className="underline underline-offset-4 decoration-2">{c.cta}</span>
                    <ArrowRight className="h-4 w-4 lg:h-5 lg:w-5 shrink-0 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
