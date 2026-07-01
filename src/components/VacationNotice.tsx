"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

const STORAGE_KEY = "mjs_vacation_notice_dismissed";

export default function VacationNotice() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    setShow(true);
  }, []);

  const dismiss = () => {
    setShow(false);
    sessionStorage.setItem(STORAGE_KEY, "1");
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={dismiss}
    >
      <div
        className="relative max-w-xl w-full rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={dismiss}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 shadow-md transition-colors"
        >
          <X className="w-4 h-4 text-white" />
        </button>

        <video
          src="/videos/vacation-notice.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-auto rounded-2xl"
          style={{ display: "block" }}
        />
      </div>
    </div>
  );
}
