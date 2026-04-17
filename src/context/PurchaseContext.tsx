"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useAuth } from "./AuthContext";

interface PurchaseContextType {
  purchases: Record<string, string>; // SKU → date string
  getPurchaseDate: (sku: string) => string | null;
}

const PurchaseContext = createContext<PurchaseContextType>({
  purchases: {},
  getPurchaseDate: () => null,
});

export function PurchaseProvider({ children }: { children: ReactNode }) {
  const { user, isLoggedIn } = useAuth();
  const [purchases, setPurchases] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isLoggedIn || !user?.id) {
      setPurchases({});
      return;
    }

    fetch(`/api/customers/purchases?customerId=${user.id}`)
      .then(r => r.json())
      .then(data => setPurchases(data.purchases || {}))
      .catch(() => {});
  }, [isLoggedIn, user?.id]);

  const getPurchaseDate = (sku: string): string | null => {
    const date = purchases[sku.toUpperCase()];
    if (!date) return null;
    const d = new Date(date);
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const yy = String(d.getFullYear()).slice(-2);
    return `${mm}-${dd}-${yy}`;
  };

  return (
    <PurchaseContext.Provider value={{ purchases, getPurchaseDate }}>
      {children}
    </PurchaseContext.Provider>
  );
}

export function usePurchases() {
  return useContext(PurchaseContext);
}
