"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

export interface OrderSetup {
  paymentMethod: "bill" | "card" | "cash" | "";
  fulfillment: "delivery" | "pickup" | "";
  billTo: {
    company: string;
    name: string;
    email: string;
    phone: string;
  };
  shipTo: {
    label: string;
    company: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  } | null;
}

interface OrderContextType {
  orderSetup: OrderSetup | null;
  setOrderSetup: (setup: OrderSetup) => void;
  clearOrderSetup: () => void;
}

const OrderContext = createContext<OrderContextType | null>(null);

const EMPTY: OrderSetup = {
  paymentMethod: "",
  fulfillment: "",
  billTo: { company: "", name: "", email: "", phone: "" },
  shipTo: null,
};

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orderSetup, setOrderSetupState] = useState<OrderSetup | null>(null);

  // Restore from sessionStorage on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("mjs_order_setup");
      if (stored) setOrderSetupState(JSON.parse(stored));
    } catch {}
  }, []);

  const setOrderSetup = useCallback((setup: OrderSetup) => {
    setOrderSetupState(setup);
    try { sessionStorage.setItem("mjs_order_setup", JSON.stringify(setup)); } catch {}
  }, []);

  const clearOrderSetup = useCallback(() => {
    setOrderSetupState(null);
    try { sessionStorage.removeItem("mjs_order_setup"); } catch {}
  }, []);

  return (
    <OrderContext.Provider value={{ orderSetup, setOrderSetup, clearOrderSetup }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrderSetup() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrderSetup must be used within OrderProvider");
  return ctx;
}
