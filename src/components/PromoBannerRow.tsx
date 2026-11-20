"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { trackSignUp } from "@/lib/analytics";

/*
 * Two side-by-side panels under Ready to Ship (desktop/tablet only):
 *   left  — Business Accounts: three illustrated perks + Create account / Sign in
 *   right — Deals & Promotions: inline email signup (BigCommerce subscriber list)
 * Replaces the old three dark strip cards (Deals / Business / Track).
 */

const PERKS = [
  { img: "gift", w: 511, label: "Earn rewards" },
  { img: "cart", w: 487, label: "Order online" },
  { img: "truck", w: 739, label: "Track orders" },
];

export default function PromoBannerRow() {
  const { isLoggedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function subscribe(e: FormEvent) {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setStatus("error"); setMessage("Please enter a valid email address."); return;
    }
    setStatus("sending"); setMessage("");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Unable to subscribe right now.");
      setStatus("done");
      setMessage(data.alreadySubscribed ? "You're already on the list." : "You're in! Watch your inbox for case specials.");
      trackSignUp("newsletter_home");
    } catch (err) {
      setStatus("error"); setMessage(err instanceof Error ? err.message : "Unable to subscribe right now.");
    }
  }

  return (
    <section className="hidden md:block bg-white py-4">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="grid grid-cols-2 gap-4">

          {/* ── Business Accounts ── */}
          <div className="rounded-2xl bg-[#dcefff] px-5 lg:px-7 py-5 flex flex-col min-w-0">
            <h3 className="text-[1.5rem] lg:text-[2rem] leading-none font-black tracking-tight text-mjs-dark">Business Accounts</h3>

            <ul className="mt-3 grid grid-cols-3 gap-2 lg:gap-3 list-none m-0 p-0">
              {PERKS.map((p) => (
                <li key={p.img} className="flex flex-col items-center text-center min-w-0">
                  <div className="h-[64px] lg:h-[88px] flex items-end justify-center">
                    <Image src={`/images/promo/${p.img}.webp`} alt="" width={p.w} height={480} sizes="160px" className="h-full w-auto max-w-[160px] object-contain" />
                  </div>
                  <span className="mt-2 text-[13px] lg:text-[15px] font-bold text-mjs-dark">{p.label}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-4 flex items-center gap-4 lg:gap-5">
              {isLoggedIn ? (
                <a href="/account" className="inline-flex items-center rounded-lg bg-mjs-dark px-5 lg:px-6 py-2.5 lg:py-3 text-sm font-bold text-white hover:bg-black transition-colors whitespace-nowrap">
                  My account
                </a>
              ) : (
                <>
                  <a href="/auth?mode=signup" className="inline-flex items-center rounded-lg bg-mjs-dark px-5 lg:px-6 py-2.5 lg:py-3 text-sm font-bold text-white hover:bg-black transition-colors whitespace-nowrap">
                    Create an account
                  </a>
                  <a href="/auth" className="text-sm font-bold text-mjs-dark underline underline-offset-4 hover:text-mjs-red transition-colors">
                    Sign in
                  </a>
                </>
              )}
            </div>
          </div>

          {/* ── Deals & Promotions ── */}
          <div className="rounded-2xl bg-[#fff2b8] px-5 lg:px-7 py-5 flex flex-col min-w-0 overflow-hidden">
            <div className="flex items-start justify-between gap-4 lg:gap-6">
              <div className="min-w-0">
                <h3 className="text-[1.5rem] lg:text-[2rem] leading-none font-black tracking-tight text-mjs-dark lg:whitespace-nowrap">Deals &amp; Promotions</h3>
                <p className="mt-2 text-[14px] lg:text-[15px] leading-snug text-mjs-dark/85 lg:whitespace-nowrap">Get case specials and new arrivals in your inbox.</p>
              </div>
              <Image src="/images/promo/coupon.webp" alt="" width={424} height={480} sizes="180px" className="h-[84px] lg:h-[125px] w-auto flex-shrink-0 object-contain -mt-1" />
            </div>

            <form onSubmit={subscribe} className="mt-auto pt-4">
              <label htmlFor="promo-email" className="block text-sm font-bold text-mjs-dark mb-2">Email address</label>
              {status === "done" ? (
                <div className="rounded-lg bg-white px-4 py-3 text-sm font-semibold text-emerald-700">{message}</div>
              ) : (
                <div className="flex rounded-lg overflow-hidden border border-mjs-dark/20 bg-white focus-within:border-mjs-dark">
                  <input
                    id="promo-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle"); }}
                    className="min-w-0 flex-1 px-4 py-3 text-sm text-mjs-dark placeholder:text-gray-400 outline-none"
                  />
                  <button type="submit" disabled={status === "sending"} className="bg-mjs-dark px-6 text-sm font-bold text-white hover:bg-black transition-colors disabled:opacity-60 whitespace-nowrap">
                    {status === "sending" ? "Sending…" : "Sign me up"}
                  </button>
                </div>
              )}
              {status === "error" && <p className="mt-2 text-xs font-semibold text-red-600">{message}</p>}
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
