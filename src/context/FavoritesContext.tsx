"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useAuth } from "./AuthContext";

export interface FavoriteItem {
  slug: string;
  sku: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  pack: string;
  addedAt: number;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  isFavorite: (sku: string) => boolean;
  toggleFavorite: (item: Omit<FavoriteItem, "addedAt">) => void;
  removeFavorite: (sku: string) => void;
}

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  isFavorite: () => false,
  toggleFavorite: () => {},
  removeFavorite: () => {},
});

function getStorageKey(userId?: number) {
  return userId ? `mjs_favorites_${userId}` : "mjs_favorites_guest";
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  // Load favorites from localStorage
  useEffect(() => {
    try {
      const key = getStorageKey(user?.id);
      const stored = localStorage.getItem(key);
      if (stored) setFavorites(JSON.parse(stored));
      else setFavorites([]);
    } catch {}
  }, [user?.id]);

  // Save to localStorage whenever favorites change
  const save = useCallback((items: FavoriteItem[]) => {
    setFavorites(items);
    try {
      const key = getStorageKey(user?.id);
      localStorage.setItem(key, JSON.stringify(items));
    } catch {}
  }, [user?.id]);

  const isFavorite = useCallback((sku: string) => {
    return favorites.some(f => f.sku.toUpperCase() === sku.toUpperCase());
  }, [favorites]);

  const toggleFavorite = useCallback((item: Omit<FavoriteItem, "addedAt">) => {
    if (isFavorite(item.sku)) {
      save(favorites.filter(f => f.sku.toUpperCase() !== item.sku.toUpperCase()));
    } else {
      save([{ ...item, addedAt: Date.now() }, ...favorites]);
    }
  }, [favorites, isFavorite, save]);

  const removeFavorite = useCallback((sku: string) => {
    save(favorites.filter(f => f.sku.toUpperCase() !== sku.toUpperCase()));
  }, [favorites, save]);

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
