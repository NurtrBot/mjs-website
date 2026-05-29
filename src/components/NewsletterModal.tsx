"use client";

import { useState } from "react";
import { X, Mail, Check, Loader2 } from "lucide-react";

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewsletterModal({ isOpen, onClose }: NewsletterModalProps) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName: firstName.trim(), email: email.trim().toLowerCase() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong.");
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setErrorMsg("Unable to connect. Please try again.");
      setStatus("error");
    }
  };

  const handleClose = () => {
    // Reset form on close
    setFirstName("");
    setEmail("");
    setStatus("idle");
    setErrorMsg("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>

        {status === "success" ? (
          /* ── Success State ── */
          <div className="px-8 py-12 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <Check className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-black text-mjs-dark mb-2">
              You&apos;re In!
            </h2>
            <p className="text-sm text-mjs-gray-500 mb-6 max-w-xs mx-auto">
              Welcome, {firstName}! You&apos;ll be the first to know about exclusive deals,
              new products, and promotions.
            </p>
            <button
              onClick={handleClose}
              className="bg-mjs-red text-white font-bold text-sm px-8 py-3 rounded-lg hover:bg-mjs-red-dark transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          /* ── Form State ── */
          <>
            {/* Header */}
            <div className="bg-gradient-to-r from-mjs-red to-mjs-red-dark px-8 py-8 text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-black text-white mb-1">
                Get Exclusive Deals
              </h2>
              <p className="text-sm text-white/80">
                Join our list for promotions, new products, and insider pricing.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-8 py-6">
              <div className="space-y-3">
                <div>
                  <label htmlFor="nl-firstName" className="block text-xs font-semibold text-mjs-gray-500 uppercase tracking-wider mb-1.5">
                    First Name
                  </label>
                  <input
                    id="nl-firstName"
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Your first name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-mjs-red focus:ring-2 focus:ring-mjs-red/10 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="nl-email" className="block text-xs font-semibold text-mjs-gray-500 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="nl-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-mjs-red focus:ring-2 focus:ring-mjs-red/10 transition-all"
                  />
                </div>
              </div>

              {errorMsg && (
                <p className="text-xs text-red-600 mt-2">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full mt-4 bg-mjs-red text-white font-bold text-sm py-3.5 rounded-lg hover:bg-mjs-red-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  "Subscribe for Deals"
                )}
              </button>

              <p className="text-[10px] text-mjs-gray-400 text-center mt-3">
                No spam, ever. Unsubscribe anytime.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
