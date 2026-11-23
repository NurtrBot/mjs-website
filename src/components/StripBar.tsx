"use client";

// Slim header bar for product strips: title on the left, optional subtitle after a divider,
// "View all" and the scroll arrows on the right. Same grey-white gradient as the site's
// pre-footer bar so every strip reads as one family.

import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function StripBar({ title, subtitle, action, onLeft, onRight }: { title: ReactNode; subtitle?: string; action?: ReactNode; onLeft: () => void; onRight: () => void }) {
  return (
    <div className="flex min-h-14 items-center gap-3 sm:gap-4 px-4 sm:px-5 pt-3 pb-2" style={{ background: "linear-gradient(180deg, #edeff2 0%, #f6f7f9 100%)" }}>
      <h2 className="flex shrink-0 items-center gap-2 text-[17px] font-black tracking-tight text-mjs-dark">{title}</h2>
      {subtitle && (
        <>
          <span className="hidden md:block h-5 w-px bg-mjs-gray-300/80" aria-hidden />
          <p className="hidden md:block min-w-0 truncate text-[13px] text-mjs-gray-500">{subtitle}</p>
        </>
      )}
      <div className="ml-auto flex shrink-0 items-center gap-2">
        {action}
        <button type="button" onClick={onLeft} className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-mjs-gray-600 shadow-sm hover:text-mjs-dark hover:bg-mjs-gray-50 transition-colors" aria-label="Scroll left">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button type="button" onClick={onRight} className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-mjs-gray-600 shadow-sm hover:text-mjs-dark hover:bg-mjs-gray-50 transition-colors" aria-label="Scroll right">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
