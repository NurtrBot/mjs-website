"use client";

import { useState, useEffect } from "react";
import { X, Star } from "lucide-react";

const STORAGE_KEY = "mjs_survey_done";
const VISIT_KEY = "mjs_has_visited";

export default function ReturnVisitorSurvey() {
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Don't show if survey already completed or dismissed
    if (localStorage.getItem(STORAGE_KEY)) return;

    const hasVisited = localStorage.getItem(VISIT_KEY);
    if (!hasVisited) {
      // First visit — mark it and don't show survey
      localStorage.setItem(VISIT_KEY, Date.now().toString());
      return;
    }

    // Returning visitor who hasn't seen survey — show after 5 seconds
    const timer = setTimeout(() => setShow(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setShow(false);
    localStorage.setItem(STORAGE_KEY, "dismissed");
  };

  const submit = (rating: number) => {
    setSelected(rating);
    setSubmitted(true);
    localStorage.setItem(STORAGE_KEY, `rated-${rating}`);

    // Track in Google Analytics
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w = window as any;
      if (w.gtag) {
        w.gtag("event", "survey_response", {
          event_category: "feedback",
          event_label: "new_website_rating",
          value: rating,
        });
      }
    } catch {}

    // Auto-close after showing thank you
    setTimeout(() => setShow(false), 2500);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9998] animate-in slide-in-from-bottom-5">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-[320px] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-mjs-gold fill-mjs-gold" />
            <span className="text-[10px] font-bold text-mjs-gray-400 uppercase tracking-wider">Quick Feedback</span>
          </div>
          <button
            onClick={dismiss}
            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-3.5 h-3.5 text-gray-400" />
          </button>
        </div>

        {submitted ? (
          /* ── Thank You State ── */
          <div className="px-5 pb-5 pt-2 text-center">
            <div className="text-2xl mb-2">🎉</div>
            <p className="text-sm font-bold text-mjs-dark">Thanks for the feedback!</p>
            <p className="text-xs text-mjs-gray-400 mt-1">
              {selected! >= 8 ? "We're glad you're enjoying it!" : "We appreciate your honesty — we're always improving."}
            </p>
          </div>
        ) : (
          /* ── Rating State ── */
          <div className="px-5 pb-5 pt-1">
            <p className="text-sm font-bold text-mjs-dark mb-1">
              How&apos;s the new shopping experience?
            </p>
            <p className="text-[11px] text-mjs-gray-400 mb-4">
              Rate your experience on our new website.
            </p>

            {/* 1-10 Scale */}
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <button
                  key={n}
                  onClick={() => submit(n)}
                  onMouseEnter={() => setSelected(n)}
                  onMouseLeave={() => setSelected(null)}
                  className={`
                    flex-1 aspect-square rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer
                    ${selected !== null && n <= selected
                      ? n <= 3 ? "bg-red-500 text-white scale-105"
                        : n <= 6 ? "bg-amber-400 text-white scale-105"
                        : "bg-emerald-500 text-white scale-105"
                      : "bg-mjs-gray-50 text-mjs-gray-500 hover:bg-gray-100"
                    }
                  `}
                >
                  {n}
                </button>
              ))}
            </div>

            {/* Scale labels */}
            <div className="flex justify-between mt-1.5">
              <span className="text-[9px] text-mjs-gray-400">Not great</span>
              <span className="text-[9px] text-mjs-gray-400">Love it!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
