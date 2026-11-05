"use client";

import { useEffect } from "react";

/** Sends the visitor to the home page instead of showing a "not found" screen. */
export default function RedirectHome() {
  useEffect(() => {
    window.location.replace("/");
  }, []);
  return <div className="min-h-[60vh] bg-white" />;
}
