"use client";

import Image from "next/image";
import { ArrowRight, Phone, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { BUSINESS, DELIVERY } from "@/lib/business";

/*
 * Homepage closing call-to-action (desktop/tablet): one navy panel in the same
 * rounded-card language as the sections above it. Copy + perks on the left,
 * the MJS delivery truck (public/images/cta-truck.webp, cut out from
 * mjs-truck.png) parked on the right. Signed-in visitors get "My account"
 * instead of the sign-up button.
 */

const PERKS = [
  "Wholesale pricing",
  `Free local delivery over $${DELIVERY.localMinimum}`,
  "Tax-exempt checkout",
  "Dedicated support",
];

export default function CTABanner() {
  const { isLoggedIn } = useAuth();

  return (
    <section className="hidden md:block bg-white py-6">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl bg-mjs-dark px-8 lg:px-12 py-9 lg:py-11">
          {/* soft warm glow behind the truck */}
          <div className="pointer-events-none absolute -right-24 -top-48 h-[560px] w-[560px] rounded-full bg-[#fecd02]/10 blur-3xl" />

          <div className="relative z-10 max-w-[430px] lg:max-w-[600px]">
            <div className="text-[11px] lg:text-[12px] font-black uppercase tracking-[0.18em] text-[#fecd02]">Business accounts</div>
            <h2 className="mt-2 text-[32px] lg:text-[44px] leading-[1.02] font-black tracking-tight text-white text-balance">
              Ready to save on supplies?
            </h2>
            <p className="mt-3 text-[14.5px] lg:text-[16px] leading-relaxed text-white/70 max-w-[520px]">
              Open a free business account and get wholesale pricing, dedicated support, and free local delivery on orders over ${DELIVERY.localMinimum}.
            </p>

            <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2.5 list-none m-0 p-0 max-w-[460px]">
              {PERKS.map((p) => (
                <li key={p} className="flex items-center gap-2 text-[13.5px] lg:text-[14.5px] font-bold text-white whitespace-nowrap">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#fecd02] text-mjs-dark"><Check className="h-3 w-3" strokeWidth={3.5} /></span>
                  {p}
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              {isLoggedIn ? (
                <a href="/account" className="inline-flex items-center gap-2 rounded-xl bg-[#fecd02] px-6 py-3 text-[14.5px] font-black text-mjs-dark hover:bg-[#ffd83a] transition-colors whitespace-nowrap">
                  My account <ArrowRight className="h-4 w-4" />
                </a>
              ) : (
                <a href="/auth?mode=signup" className="inline-flex items-center gap-2 rounded-xl bg-[#fecd02] px-6 py-3 text-[14.5px] font-black text-mjs-dark hover:bg-[#ffd83a] transition-colors whitespace-nowrap">
                  Create free account <ArrowRight className="h-4 w-4" />
                </a>
              )}
              <a href={BUSINESS.phoneHref} className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-[14.5px] font-bold text-white hover:bg-white/15 transition-colors whitespace-nowrap">
                <Phone className="h-4 w-4 text-[#fecd02]" /> {BUSINESS.phone}
              </a>
            </div>
          </div>

          {/* delivery truck, parked on the right edge */}
          <Image
            src="/images/cta-truck.webp"
            alt="Mobile Janitorial Supply delivery truck"
            width={1100}
            height={537}
            sizes="(max-width: 1024px) 400px, 600px"
            quality={82}
            className="pointer-events-none absolute right-[-24px] lg:right-[4px] bottom-[-4px] lg:bottom-[-2px] w-[400px] lg:w-[600px] h-auto drop-shadow-[0_28px_36px_rgba(0,0,0,0.5)]"
          />
        </div>
      </div>
    </section>
  );
}
