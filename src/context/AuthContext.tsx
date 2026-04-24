"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

export interface UserData {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  phone?: string;
  customerGroupId?: number;
  priceListId?: number | null;
}

interface StoredSession {
  user: UserData;
  expiresAt: number; // timestamp
}

// Session expires after 7 days
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

// Minimal data stored — no sensitive fields like passwords or tokens
function sanitizeUser(user: UserData): UserData {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    company: user.company,
    phone: user.phone,
    customerGroupId: user.customerGroupId,
    priceListId: user.priceListId,
  };
}

interface AuthContextType {
  user: UserData | null;
  isLoggedIn: boolean;
  login: (user: UserData) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);

  // Restore session from localStorage on mount — check expiry
  useEffect(() => {
    try {
      const stored = localStorage.getItem("mjs_session");
      if (stored) {
        const session: StoredSession = JSON.parse(stored);
        if (Date.now() < session.expiresAt) {
          setUser(session.user);
        } else {
          // Session expired — clean up
          localStorage.removeItem("mjs_session");
          localStorage.removeItem("mjs_user");
          localStorage.removeItem("mjs_tax_exempt");
        }
      } else {
        // Migrate old format (mjs_user) to new format (mjs_session)
        const oldStored = localStorage.getItem("mjs_user");
        if (oldStored) {
          const userData = JSON.parse(oldStored);
          const session: StoredSession = {
            user: sanitizeUser(userData),
            expiresAt: Date.now() + SESSION_TTL_MS,
          };
          localStorage.setItem("mjs_session", JSON.stringify(session));
          localStorage.removeItem("mjs_user");
          setUser(session.user);
        }
      }
    } catch {}
  }, []);

  const login = useCallback((userData: UserData) => {
    const clean = sanitizeUser(userData);
    setUser(clean);
    try {
      const session: StoredSession = {
        user: clean,
        expiresAt: Date.now() + SESSION_TTL_MS,
      };
      localStorage.setItem("mjs_session", JSON.stringify(session));
      // Remove old format if exists
      localStorage.removeItem("mjs_user");
    } catch {}
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem("mjs_session");
      localStorage.removeItem("mjs_user");
      localStorage.removeItem("mjs_tax_exempt");
      localStorage.removeItem("mjs_coupon_claimed_trash-liners");
    } catch {}
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
