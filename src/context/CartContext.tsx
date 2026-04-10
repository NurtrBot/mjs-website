"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { CheckCircle, ShoppingCart } from "lucide-react";

export interface CartItem {
  slug: string;
  sku?: string;
  productId?: number;
  name: string;
  brand: string;
  price: number;
  image: string;
  pack: string;
  qty: number;
}

interface ToastData {
  name: string;
  image: string;
  id: number;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  updateQty: (slug: string, qty: number) => void;
  removeItem: (slug: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Restore cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("mjs_cart");
      if (stored) setItems(JSON.parse(stored));
    } catch {}
    setHydrated(true);
  }, []);

  // Persist cart to localStorage on change
  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem("mjs_cart", JSON.stringify(items)); } catch {}
  }, [items, hydrated]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(timer);
  }, [toast]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);

  const addItem = useCallback(
    (item: Omit<CartItem, "qty">, qty = 1) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.slug === item.slug);
        if (existing) {
          return prev.map((i) =>
            i.slug === item.slug ? { ...i, qty: i.qty + qty } : i
          );
        }
        return [...prev, { ...item, qty }];
      });
      setToast({ name: item.name, image: item.image, id: Date.now() });
    },
    []
  );

  const updateQty = useCallback((slug: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.slug !== slug));
    } else {
      setItems((prev) =>
        prev.map((i) => (i.slug === slug ? { ...i, qty } : i))
      );
    }
  }, []);

  const removeItem = useCallback((slug: string) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = items.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        addItem,
        updateQty,
        removeItem,
        clearCart,
        itemCount,
        subtotal,
      }}
    >
      {children}
      {/* Add to Cart Toast */}
      {toast && (
        <div
          key={toast.id}
          className="fixed top-4 right-4 z-[100] animate-in slide-in-from-right fade-in duration-300"
        >
          <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 flex items-center gap-3 min-w-[280px]">
            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50">
              <img src={toast.image} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                <span className="text-xs font-semibold text-green-600">Added to cart</span>
              </div>
              <p className="text-xs text-mjs-gray-600 truncate mt-0.5">{toast.name}</p>
            </div>
            <button
              onClick={toggleCart}
              className="flex items-center gap-1 text-[10px] font-semibold text-mjs-red hover:text-red-700 flex-shrink-0"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              View
            </button>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
