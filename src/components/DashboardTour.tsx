"use client";

// One-time walkthrough of the dashboard for each customer, plus one-time intro notes inside
// the Supply Lists and SDS Binder tabs. Seen-state is stored per customer id in localStorage.

import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { Glyph } from "@/components/DashboardHome";
import { trackEvent } from "@/lib/analytics";

const TOUR_KEY = (uid: number) => `mjs_dash_tour_v1:${uid}`;
const TIP_KEY = (id: string, uid: number) => `mjs_dash_tip_v1:${id}:${uid}`;
const seen = (k: string) => { try { return localStorage.getItem(k) === "1"; } catch { return true; } };
const mark = (k: string) => { try { localStorage.setItem(k, "1"); } catch {} };

type Step = { target: string; eyebrow: string; title: string; body: string; icon?: string };

const STEPS: Step[] = [
  {
    target: '[data-track="search"]',
    eyebrow: "Search",
    title: "One bar finds everything",
    body: "Type a product, an item #, an order #, or a supply list name. Try “reorder” to pull up what you usually buy, or “invoice” to grab a past invoice. Press / anywhere on the page to jump here.",
  },
  {
    target: "#dash-reorder",
    eyebrow: "Due for a restock",
    title: "We spot the pattern so you don’t have to",
    body: "This list is built from what you’ve ordered before and how often you order it. Anything running late gets a red Overdue tag, with your usual quantity already filled in, so a restock is one tap.",
  },
  {
    target: '[data-track="order-chart"]',
    eyebrow: "Order history",
    title: "Every order, side by side",
    body: "Each bar is one order, sized by its total. Hover a bar for the date, item count and how it compares to the order before it. Tap a bar to open that order. The dashed line is your average, so you can see at a glance whether you’re staying on track.",
  },
  {
    target: '[data-track="tabs"]',
    eyebrow: "Supply Lists · My SDS Binder",
    title: "Two more tools up here",
    body: "Supply Lists save the items each building needs so reordering is one click. My SDS Binder collects the safety data sheet for every chemical you order, automatically. Open either tab and we’ll walk you through it.",
  },
];

const PAD = 10;

export function DashboardTour({ userId, active }: { userId?: number; active: boolean }) {
  const [steps, setSteps] = useState<Step[] | null>(null);
  const [i, setI] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [mobile, setMobile] = useState(false);
  const [cardH, setCardH] = useState(220);
  const cardRef = useRef<HTMLDivElement>(null);

  const finish = (how: "done" | "skip") => {
    if (userId) mark(TOUR_KEY(userId));
    trackEvent("dashboard_tour", { action: how, step: i + 1 });
    setSteps(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const next = () => { if (!steps) return; if (i >= steps.length - 1) finish("done"); else { trackEvent("dashboard_tour", { action: "next", step: i + 1 }); setI(i + 1); setRect(null); } };
  const back = () => { if (i > 0) { setI(i - 1); setRect(null); } };

  // Wait for the dashboard's data-driven cards to exist, then start with whatever targets are present
  useEffect(() => {
    if (!userId || !active || seen(TOUR_KEY(userId))) return;
    let tries = 0;
    const t = setInterval(() => {
      tries++;
      const ready = document.querySelector(STEPS[2].target) || tries > 25;
      if (!ready) return;
      clearInterval(t);
      const live = STEPS.filter(s => document.querySelector(s.target));
      if (live.length) { setSteps(live); trackEvent("dashboard_tour", { action: "start", steps: live.length }); }
      else mark(TOUR_KEY(userId));
    }, 400);
    return () => clearInterval(t);
  }, [userId, active]);

  // Position the spotlight on the current step and keep it there on scroll/resize
  const measure = useCallback(() => {
    if (!steps) return;
    const el = document.querySelector(steps[i].target);
    if (!el) return;
    setRect(el.getBoundingClientRect());
    setMobile(window.innerWidth < 720);
    if (cardRef.current) setCardH(cardRef.current.offsetHeight);
  }, [steps, i]);

  useEffect(() => {
    if (!steps) return;
    const el = document.querySelector(steps[i].target);
    if (!el) return;
    el.scrollIntoView({ block: "center", behavior: "smooth" });
    const t = setTimeout(measure, 450);
    const onMove = () => measure();
    window.addEventListener("scroll", onMove, true);
    window.addEventListener("resize", onMove);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") finish("skip"); if (e.key === "ArrowRight" || e.key === "Enter") next(); };
    window.addEventListener("keydown", onKey);
    return () => { clearTimeout(t); window.removeEventListener("scroll", onMove, true); window.removeEventListener("resize", onMove); window.removeEventListener("keydown", onKey); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps, i, measure]);

  if (!steps || !active) return null;
  const step = steps[i];
  const last = i === steps.length - 1;

  // Card placement: below the target when there is room, otherwise above; full-width sheet on phones
  let cardStyle: React.CSSProperties = { opacity: 0 };
  if (rect) {
    if (mobile) cardStyle = { left: 12, right: 12, bottom: 12 };
    else {
      const w = 360, h = cardH;
      const below = rect.bottom + PAD + 14 + h < window.innerHeight;
      const top = below ? rect.bottom + PAD + 14 : Math.max(12, rect.top - PAD - 14 - h);
      const left = Math.min(Math.max(12, rect.left), window.innerWidth - w - 12);
      cardStyle = { top, left, width: w };
    }
  }

  return (
    <div className="fixed inset-0 z-[10000]" role="dialog" aria-modal="true" aria-label="Dashboard tour">
      {/* Spotlight: the cut-out is the target; everything else is dimmed by the giant shadow */}
      {rect ? (
        <div
          className="fixed rounded-2xl transition-all duration-300 pointer-events-none"
          style={{ top: rect.top - PAD, left: rect.left - PAD, width: rect.width + PAD * 2, height: rect.height + PAD * 2, boxShadow: "0 0 0 9999px rgba(26,26,46,0.62), 0 0 0 3px #fecd02" }}
        />
      ) : (
        <div className="fixed inset-0 bg-[#1A1A2E]/60" />
      )}

      <div ref={cardRef} className="fixed rounded-2xl bg-white p-5 shadow-2xl transition-opacity duration-200" style={cardStyle}>
        <button type="button" onClick={() => finish("skip")} aria-label="Skip tour" className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-mjs-gray-400 hover:bg-mjs-gray-50 hover:text-mjs-dark transition-colors">
          <X className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2 text-[10.5px] font-black uppercase tracking-wider text-mjs-red">
          <span className="rounded-full bg-[#fecd02] px-1.5 py-0.5 text-mjs-dark">New</span>
          <span>{step.eyebrow}</span>
        </div>
        <h3 className="mt-2 text-[17px] font-black leading-tight text-mjs-dark pr-6">{step.title}</h3>
        <p className="mt-2 text-[13px] leading-relaxed text-mjs-gray-600">{step.body}</p>
        <div className="mt-4 flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {steps.map((_, k) => <span key={k} className={`h-1.5 rounded-full transition-all ${k === i ? "w-5 bg-mjs-red" : "w-1.5 bg-mjs-gray-200"}`} />)}
          </div>
          <span className="text-[11px] font-semibold text-mjs-gray-400">{i + 1} of {steps.length}</span>
          <div className="ml-auto flex items-center gap-2">
            {i > 0 && <button type="button" onClick={back} className="rounded-lg px-3 py-2 text-[12.5px] font-semibold text-mjs-gray-500 hover:bg-mjs-gray-50 hover:text-mjs-dark transition-colors">Back</button>}
            <button type="button" onClick={next} className="rounded-lg bg-mjs-red px-4 py-2 text-[12.5px] font-bold text-white hover:bg-mjs-red-dark transition-colors">{last ? "Got it" : "Next"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// One-time intro card at the top of a tab. Disappears for good once dismissed.
export function FirstVisitNote({ id, userId, icon, title, body, points }: { id: string; userId?: number; icon: string; title: string; body: string; points: string[] }) {
  const [show, setShow] = useState(false);
  useEffect(() => { if (userId && !seen(TIP_KEY(id, userId))) { setShow(true); trackEvent("dashboard_tip", { action: "show", tip: id }); } }, [id, userId]);
  if (!show) return null;
  const dismiss = () => { if (userId) mark(TIP_KEY(id, userId)); trackEvent("dashboard_tip", { action: "dismiss", tip: id }); setShow(false); };
  return (
    <div className="relative mb-6 rounded-2xl px-5 py-5 lg:px-6 shadow-[0_1px_2px_rgba(23,32,52,0.06)] flex flex-col sm:flex-row sm:items-start gap-4 lg:gap-5" style={{ background: "linear-gradient(180deg, #ffffff 0%, #f1f3f6 100%)" }}>
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-mjs-red shadow-sm"><Glyph name={icon} className="w-7 h-7" /></span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-[10.5px] font-black uppercase tracking-wider text-mjs-red">
          <span className="rounded-full bg-[#fecd02] px-1.5 py-0.5 text-mjs-dark">New</span>
          <span>First time here</span>
        </div>
        <h3 className="mt-1 text-[16px] font-black text-mjs-dark">{title}</h3>
        <p className="mt-1 text-[13px] leading-relaxed text-mjs-gray-600">{body}</p>
        <ul className="mt-2.5 grid gap-1.5 sm:grid-cols-3 list-none m-0 p-0">
          {points.map(pt => <li key={pt} className="flex items-start gap-2 text-[12.5px] text-mjs-gray-700"><span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-mjs-red" />{pt}</li>)}
        </ul>
      </div>
      <button type="button" onClick={dismiss} className="self-start shrink-0 rounded-lg bg-mjs-dark px-4 py-2 text-[12.5px] font-bold text-white hover:bg-mjs-red transition-colors">Got it</button>
    </div>
  );
}
