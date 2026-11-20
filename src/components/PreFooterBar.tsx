import { Truck, Tag } from "lucide-react";

/*
 * Thin strip directly above the footer (desktop/tablet). Replaced the navy
 * "Ready to save on supplies?" panel and the desktop value-props row
 * (2026-11-20). Left: the two promises. Right: four quiet utility links.
 */

const LINKS = [
  { label: "My Account", href: "/account" },
  { label: "Order Status", href: "/track" },
  { label: "Rewards", href: "/rewards" },
  { label: "SDS Sheets", href: "/resources" },
];

export default function PreFooterBar() {
  return (
    <section className="hidden md:block bg-white pt-4 pb-6">
      <div className="max-w-[1400px] mx-auto px-4">
        <div
          className="flex items-center justify-between gap-6 rounded-2xl px-6 lg:px-8 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
          style={{ background: "linear-gradient(180deg, #f9fafb 0%, #eceff3 100%)" }}
        >
          <ul className="flex items-center gap-6 lg:gap-8 list-none m-0 p-0">
            <li className="flex items-center gap-2.5 text-[13.5px] lg:text-[14.5px] font-black tracking-tight text-mjs-dark whitespace-nowrap">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-mjs-red shadow-[0_1px_2px_rgba(23,32,52,0.08)]"><Tag className="h-4 w-4" strokeWidth={2.4} /></span>
              Wholesale Prices
            </li>
            <li aria-hidden="true" className="h-5 w-px bg-mjs-dark/10" />
            <li className="flex items-center gap-2.5 text-[13.5px] lg:text-[14.5px] font-black tracking-tight text-mjs-dark whitespace-nowrap">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-mjs-red shadow-[0_1px_2px_rgba(23,32,52,0.08)]"><Truck className="h-4 w-4" strokeWidth={2.4} /></span>
              Ships Nationwide
            </li>
          </ul>

          <nav aria-label="Account and resources">
            <ul className="flex items-center gap-5 lg:gap-8 list-none m-0 p-0">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-[13px] lg:text-[13.5px] font-semibold text-mjs-dark/70 hover:text-mjs-red transition-colors whitespace-nowrap">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
}
