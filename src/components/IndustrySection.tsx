import Image from "next/image";

/*
 * Homepage promo row (desktop/tablet): five square offer cards, replacing the
 * "Solutions for Every Industry" photo strip (2026-11-19). The price, terms and
 * coupon live in the artwork; the alt text repeats them for screen readers.
 * Cards are click-through only: no overlay text, no hover motion.
 */
const CARDS = [
  { key: "proteam", href: "/product/super-coach-pro-6-6-qt-backpack-vacuum-w-xover-multi-surface-telescoping-wand-tool-kit-107310", alt: "ProTeam Super Coach Pro 6 backpack vacuum, $548.50. Coupon: 5% off with code PROTEAM5." },
  { key: "toss-ins", href: "/product/johnny-s-choice-toss-ins-aebi?qty=5", alt: "Johnny's Choice Toss-Ins, $109.95 per case when you buy 5 cases or more. Grape scent, 5 packs per case." },
  { key: "copy-paper", href: "/product/supreme-copy-paper-20-lb-high-whiteness-8-5-x-11-white-5000-sheets-40-cartons-pallet-202310plt", alt: "Supreme copy paper, $39.50 per case by the pallet. 10 reams per case, 500 sheets per ream." },
  { key: "bath-tissue", href: "/product/janitors-finest-2-ply-toilet-tissue-4-3-x-3-5-500-sheets-per-roll-96-rolls-per-case-5602?qty=25", alt: "Janitors Finest bath tissue, $39.99 per case with a full pallet purchase. 25 cases per pallet, 96 rolls per case, 2-ply, 500 sheets per roll." },
  { key: "nitrile", href: "/product/blue-nitrile-gloves-powder-free-x-large-100-bx?qty=10", alt: "Blue nitrile gloves, $79.90 per case. 10 boxes of 100, 1,000 gloves per case." },
];

export default function IndustrySection() {
  return (
    <section data-track="industries" className="hidden md:block bg-white py-6">
      <div className="max-w-[1400px] mx-auto px-4">
        <ul className="grid grid-cols-5 gap-4 list-none m-0 p-0">
          {CARDS.map((c) => (
            <li key={c.key} className="min-w-0">
              <a href={c.href} className="relative block aspect-square overflow-hidden rounded-2xl">
                <Image src={`/images/promo-cards/${c.key}.webp`} alt={c.alt} fill sizes="(max-width: 1400px) 20vw, 270px" quality={84} className="object-cover" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
