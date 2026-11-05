"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { X, ArrowRight } from "lucide-react";

/*
 * First-visit promo for the AeroBroom Pro. Shows once per browser, shortly
 * after the first page loads. Closes with the X, the Esc key, "No thanks",
 * or a click on the backdrop. Clicking the banner or the button opens the
 * product listing.
 */

const SEEN_KEY = "mjs_aerobroom_popup_seen";
const PRODUCT_URL = "/product/aero-broom-pro";
const SHOW_DELAY_MS = 800;

// Never interrupt these pages (buying, account, or the product itself)
const SKIP_PREFIXES = ["/checkout", "/cart", "/order-confirmation", "/account", "/auth", PRODUCT_URL];

function track(event: string) {
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  w.gtag?.("event", event, { event_category: "promo_popup", event_label: "AEROPRO" });
}

export default function AeroBroomPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Decide once, on the first page of the visit
  useEffect(() => {
    if (SKIP_PREFIXES.some((p) => pathname?.startsWith(p))) return;
    try {
      if (localStorage.getItem(SEEN_KEY)) return;
    } catch {
      return; // storage blocked: don't risk showing it on every page
    }
    const t = setTimeout(() => {
      setOpen(true);
      try { localStorage.setItem(SEEN_KEY, Date.now().toString()); } catch {}
      track("promo_popup_shown");
    }, SHOW_DELAY_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Esc to close, lock page scroll, focus the X
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close("esc");
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function close(how: string) {
    setOpen(false);
    track(`promo_popup_closed_${how}`);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 animate-[aeroFade_200ms_ease-out]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="aero-popup-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => close("backdrop")} />

      {/* Card */}
      <div className="relative w-full max-w-[720px] overflow-hidden rounded-2xl bg-[#0b0f17] shadow-2xl ring-1 ring-white/10 animate-[aeroRise_260ms_cubic-bezier(0.16,1,0.3,1)]">
        <button
          ref={closeBtnRef}
          type="button"
          onClick={() => close("x")}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur transition hover:bg-black/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <X className="h-5 w-5" />
        </button>

        <a href={PRODUCT_URL} onClick={() => track("promo_popup_clicked_image")} className="block">
          <Image
            src="/images/aerobroom-pro-popup.webp"
            alt="AeroBroom Pro — one tool, two ways to clean: sweep and blow"
            width={1083}
            height={540}
            priority
            className="block h-auto w-full"
          />
        </a>

        <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p id="aero-popup-title" className="text-base font-bold text-white">
              New: AeroBroom Pro
            </p>
            <p className="text-sm text-white/60">Push broom + cordless leaf blower in one tool.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => close("no_thanks")}
              className="text-sm font-medium text-white/60 transition hover:text-white"
            >
              No thanks
            </button>
            <a
              href={PRODUCT_URL}
              onClick={() => track("promo_popup_clicked_button")}
              className="inline-flex items-center gap-2 rounded-xl bg-mjs-red px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-700"
            >
              Shop now
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes aeroFade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes aeroRise { from { opacity: 0; transform: translateY(12px) scale(.98) } to { opacity: 1; transform: none } }
        @media (prefers-reduced-motion: reduce) { [class*="animate-[aero"] { animation: none !important } }
      `}</style>
    </div>
  );
}
