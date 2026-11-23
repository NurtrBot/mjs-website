"use client";

// One-time "first time here" intro cards for dashboard areas with new features.
// Each card shows once per customer (keyed by customer id in localStorage) and is gone for good
// after Got it. Used on the Overview, Supply Lists and My SDS Binder tabs.

import { useEffect, useState } from "react";
import { Glyph } from "@/components/DashboardHome";
import { trackEvent } from "@/lib/analytics";

const TIP_KEY = (id: string, uid: number) => `mjs_dash_tip_v1:${id}:${uid}`;
const seen = (k: string) => { try { return localStorage.getItem(k) === "1"; } catch { return true; } };
const mark = (k: string) => { try { localStorage.setItem(k, "1"); } catch {} };

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
