"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

interface ShippingContextType {
  zip: string;
  setZip: (zip: string) => void;
  shippingCost: number | null; // null = not calculated yet
  setShippingCost: (cost: number | null) => void;
  shippingMethod: string;
  setShippingMethod: (method: string) => void;
}

const ShippingContext = createContext<ShippingContextType | null>(null);

export function ShippingProvider({ children }: { children: ReactNode }) {
  const [zip, setZipState] = useState("");
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [shippingMethod, setShippingMethod] = useState("");

  // Restore from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("mjs_ship_zip");
      if (stored) setZipState(stored);
    } catch {}
  }, []);

  const setZip = useCallback((z: string) => {
    setZipState(z);
    setShippingCost(null); // Reset cost when zip changes
    setShippingMethod("");
    try { localStorage.setItem("mjs_ship_zip", z); } catch {}
  }, []);

  return (
    <ShippingContext.Provider value={{ zip, setZip, shippingCost, setShippingCost, shippingMethod, setShippingMethod }}>
      {children}
    </ShippingContext.Provider>
  );
}

export function useShipping() {
  const ctx = useContext(ShippingContext);
  if (!ctx) throw new Error("useShipping must be used within ShippingProvider");
  return ctx;
}
