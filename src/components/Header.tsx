"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Package,
  Phone,
} from "lucide-react";
import { LogOut, Globe } from "lucide-react";
import type { ProductData } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { trackSearch, trackClickCTA } from "@/lib/analytics";

export default function Header() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const { itemCount, toggleCart } = useCart();
  const { user, isLoggedIn, logout } = useAuth();
  const [isSpanish, setIsSpanish] = useState(false);

  // Restore language preference on mount and re-apply on navigation
  useEffect(() => {
    const saved = localStorage.getItem("mjs_lang");
    if (saved === "es") {
      setIsSpanish(true);
      applyTranslation("es");
    }
  }, []);

  // Re-apply translation when route changes (Next.js client navigation)
  useEffect(() => {
    if (isSpanish) {
      const timer = setTimeout(() => applyTranslation("es"), 300);
      return () => clearTimeout(timer);
    }
  });

  const applyTranslation = (lang: string) => {
    const existing = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (existing) {
      existing.value = lang;
      existing.dispatchEvent(new Event("change"));
      return;
    }
    // Init Google Translate if not loaded
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;
    win.googleTranslateElementInit = () => {
      new win.google.translate.TranslateElement(
        { pageLanguage: "en", includedLanguages: "en,es", autoDisplay: false },
        "google_translate_element"
      );
      setTimeout(() => {
        const select = document.querySelector(".goog-te-combo") as HTMLSelectElement;
        if (select) { select.value = lang; select.dispatchEvent(new Event("change")); }
      }, 500);
    };
    if (!document.querySelector('script[src*="translate.google.com"]')) {
      const script = document.createElement("script");
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      document.body.appendChild(script);
    } else if (win.google?.translate) {
      win.googleTranslateElementInit();
    }
  };

  const toggleLanguage = () => {
    const newLang = isSpanish ? "en" : "es";
    setIsSpanish(!isSpanish);
    localStorage.setItem("mjs_lang", newLang);
    applyTranslation(newLang);
    trackClickCTA(newLang === "es" ? "Switch to Spanish" : "Switch to English", "header");
  };

  const handleSearch = (query: string) => {
    if (query.trim().length > 0) {
      trackSearch(query.trim(), filteredProducts.length);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setSearchFocused(false);
    }
  };
  const [profileOpen, setProfileOpen] = useState(false);

  const [bcSearchResults, setBcSearchResults] = useState<ProductData[]>([]);
  const searchTimer = useRef<NodeJS.Timeout | null>(null);

  // Only show products with a real image (not the placeholder)
  const hasRealImage = (p: ProductData) =>
    p.images.length > 0 && !p.images[0].includes("placeholder");

  // BigCommerce search with debounce — live data with current descriptions
  useEffect(() => {
    if (searchQuery.length < 2) { setBcSearchResults([]); return; }
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}&limit=10`)
        .then(res => res.json())
        .then(data => {
          const results = (data.products || []) as ProductData[];
          setBcSearchResults(results.filter(hasRealImage));
        })
        .catch(() => {});
    }, 300);
    return () => { if (searchTimer.current) clearTimeout(searchTimer.current); };
  }, [searchQuery]);

  const filteredProducts = bcSearchResults.slice(0, 6);
  const showSuggestions = searchFocused && filteredProducts.length > 0;

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      {/* Main Header Row */}
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex items-center h-[60px] gap-4">
          {/* Mobile Menu */}
          <button
            className="lg:hidden p-1.5 -ml-1 hover:bg-gray-100 rounded-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <img
              src="/images/mjs-logo.png"
              alt="Mobile Janitorial Supply"
              className="h-[52px] w-auto"
            />
            <div className="hidden md:block">
              <div className="text-[14px] font-black tracking-tight text-mjs-dark leading-none whitespace-nowrap">
                MOBILE JANITORIAL SUPPLY
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-2.5 h-2.5 text-mjs-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-[9px] font-bold text-mjs-gray-400 uppercase tracking-wide">
                  #1 Rated
                </span>
              </div>
            </div>
          </a>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="notranslate hidden lg:flex items-center gap-2 flex-shrink-0 ml-2 bg-gradient-to-r from-mjs-red to-red-600 hover:from-red-600 hover:to-red-700 rounded-full px-3.5 py-2 transition-all shadow-sm hover:shadow-md group"
          >
            <span className="text-base leading-none">{isSpanish ? "🇺🇸" : "🇲🇽"}</span>
            <span className="text-xs text-white font-semibold">
              {isSpanish ? "English" : "Español"}
            </span>
            <div className="flex items-center bg-white/20 rounded-full p-0.5">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-all ${isSpanish ? "bg-white text-mjs-red" : "text-white/60"}`}>
                EN
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-all ${!isSpanish ? "bg-white text-mjs-red" : "text-white/60"}`}>
                ES
              </span>
            </div>
          </button>

          {/* Search Bar — centered */}
          <div className="hidden md:block flex-1 mx-4 relative z-50">
            <div className="max-w-2xl mx-auto">
              <div
                className={`flex w-full rounded-lg transition-all ${
                  searchFocused ? "ring-2 ring-mjs-red/30" : ""
                } border border-gray-300 hover:border-gray-400 bg-white`}
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSearch(searchQuery); }}
                  placeholder="Search Product, Category, Brand..."
                  className="flex-1 px-4 py-2.5 text-sm rounded-l-lg outline-none bg-transparent"
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                />
                <button onClick={() => handleSearch(searchQuery)} className="bg-mjs-red hover:bg-mjs-red-dark text-white px-5 rounded-r-md transition-colors">
                  <Search className="w-5 h-5" />
                </button>
              </div>

              {/* Search Suggestions */}
              {showSuggestions && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden z-50 max-w-2xl mx-auto">
                  {filteredProducts.map((p) => (
                    <a
                      key={p.slug}
                      href={`/product/${p.slug}`}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-mjs-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="w-12 h-12 bg-mjs-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={p.images[0]} alt={p.cardTitle} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-mjs-gray-800 line-clamp-2 leading-snug">{p.name}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {(() => {
                          const prices = p.quickBuy?.filter(q => q.unitPrice).map(q => q.unitPrice!) || [];
                          const lowestPrice = prices.length > 0 ? Math.min(...prices) : p.price;
                          const hasDiscount = lowestPrice < p.price;
                          return (
                            <>
                              {hasDiscount && <div className="text-[10px] text-mjs-gray-400 line-through">${p.price.toFixed(2)}</div>}
                              <div className="text-sm font-bold text-mjs-dark">{hasDiscount ? "As low as " : ""}${lowestPrice.toFixed(2)}</div>
                            </>
                          );
                        })()}
                      </div>
                    </a>
                  ))}
                  <a
                    href={`/search?q=${encodeURIComponent(searchQuery)}`}
                    className="block px-4 py-2 bg-mjs-gray-50 text-center hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-xs text-mjs-gray-500">
                      Press Enter to see all results for &ldquo;<span className="font-semibold text-mjs-gray-700">{searchQuery}</span>&rdquo;
                    </span>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1 ml-auto flex-shrink-0">
            {isLoggedIn ? (
              <div className="hidden lg:block relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-mjs-red text-white flex items-center justify-center text-xs font-bold">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                  <span className="text-sm font-medium text-mjs-gray-600">Hi, {user?.firstName}</span>
                </button>
                {profileOpen && (
                  <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg w-56 z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="text-sm font-semibold text-mjs-dark">{user?.firstName} {user?.lastName}</div>
                      <div className="text-xs text-mjs-gray-400 mt-0.5">{user?.email}</div>
                      {user?.company && (
                        <div className="text-xs text-mjs-gray-400">{user.company}</div>
                      )}
                    </div>
                    <a href="/account" className="flex items-center gap-2 px-4 py-2.5 text-sm text-mjs-gray-600 hover:bg-gray-50 transition-colors">
                      <User className="w-4 h-4" />
                      My Account
                    </a>
                    <a href="/account" className="flex items-center gap-2 px-4 py-2.5 text-sm text-mjs-gray-600 hover:bg-gray-50 transition-colors">
                      <Package className="w-4 h-4" />
                      My Orders
                    </a>
                    <button
                      onClick={() => { logout(); setProfileOpen(false); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-mjs-red hover:bg-red-50 transition-colors border-t border-gray-100"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <a href="/auth" className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 hover:bg-gray-50 rounded-lg transition-colors">
                <User className="w-[18px] h-[18px] text-mjs-gray-500" />
                <span className="text-sm font-medium text-mjs-gray-600">Login Now</span>
              </a>
            )}
            <a href="tel:7147792640" className="hidden lg:flex items-center gap-1.5 bg-mjs-red hover:bg-red-700 text-white px-4 py-1.5 rounded-lg transition-colors">
              <Phone className="w-4 h-4" />
              <span className="text-sm font-semibold">(714) 779-2640</span>
            </a>
            <button onClick={toggleCart} className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-gray-50 rounded-lg transition-colors relative">
              <div className="relative">
                <ShoppingCart className="w-[18px] h-[18px] text-mjs-gray-500" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-mjs-red text-white text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="hidden lg:inline text-sm font-medium text-mjs-gray-600">Cart</span>
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-3">
          <div className="flex rounded-lg border border-gray-300">
            <input
              type="text"
              value={mobileSearchQuery}
              onChange={(e) => setMobileSearchQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSearch(mobileSearchQuery); }}
              placeholder="Search products..."
              className="flex-1 px-4 py-2 text-sm rounded-l-lg outline-none"
            />
            <button onClick={() => handleSearch(mobileSearchQuery)} className="bg-mjs-red text-white px-4 rounded-r-md">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t shadow-xl max-h-[70vh] overflow-y-auto">
          <div className="py-2">
            {[
              { label: "Paper & Restroom", href: "/shop/paper-restroom" },
              { label: "Cleaning Chemicals", href: "/shop/cleaning-chemicals" },
              { label: "Tools & Equipment", href: "/shop/equipment-tools" },
              { label: "Gloves & Safety", href: "/shop/gloves-safety" },
              { label: "Packaging & Film", href: "/category/packaging-film" },
              { label: "Breakroom", href: "/category/breakroom" },
              { label: "Car Detailing", href: "/category/car-detailing" },
            ].map((cat) => (
              <a
                key={cat.label}
                href={cat.href}
                className="block px-4 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50 border-b border-gray-100"
              >
                {cat.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
