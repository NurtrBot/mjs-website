"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

export interface UserData {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  phone?: string;
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

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("mjs_user");
      if (stored) setUser(JSON.parse(stored));
    } catch {}
  }, []);

  const login = useCallback((userData: UserData) => {
    setUser(userData);
    try { localStorage.setItem("mjs_user", JSON.stringify(userData)); } catch {}
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try { localStorage.removeItem("mjs_user"); } catch {}
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
