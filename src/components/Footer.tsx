"use client";

import { MapPin, Phone, Mail, Globe, Clock } from "lucide-react";
import { useState } from "react";

export default function Footer() {
  const [translating, setTranslating] = useState(false);

  const toggleSpanish = () => {
    // Use Google Translate API
    const existing = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (existing) {
      existing.value = translating ? "en" : "es";
      existing.dispatchEvent(new Event("change"));
      setTranslating(!translating);
      return;
    }
    // Init Google Translate
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;
    win.googleTranslateElementInit = () => {
      new win.google.translate.TranslateElement(
        { pageLanguage: "en", includedLanguages: "en,es", autoDisplay: false },
        "google_translate_element"
      );
      setTimeout(() => {
        const select = document.querySelector(".goog-te-combo") as HTMLSelectElement;
        if (select) { select.value = "es"; select.dispatchEvent(new Event("change")); }
      }, 500);
    };
    const script = document.createElement("script");
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.body.appendChild(script);
    setTranslating(true);
  };

  return (
    <footer className="bg-mjs-dark text-gray-400">
      {/* Main Footer */}
      <div className="max-w-[1400px] mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Logo + Contact */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/images/mjs-logo.png" alt="Mobile Janitorial Supply" className="h-10 w-auto" />
              <div>
                <div className="text-sm font-extrabold text-white tracking-tight leading-none">MOBILE JANITORIAL SUPPLY</div>
                <div className="text-[10px] text-gray-500 mt-0.5">Google&apos;s #1 Rated &amp; Reviewed</div>
              </div>
            </div>
            <div className="space-y-3 text-[13px]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 text-mjs-red flex-shrink-0" />
                <span>3066 E. La Palma Ave, Anaheim, CA 92806</span>
              </div>
              <a href="tel:7147792640" className="flex items-center gap-2.5 hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-mjs-red flex-shrink-0" />
                (714) 779-2640
              </a>
              <a href="mailto:orders@mobilejanitorialsupply.com" className="flex items-center gap-2.5 hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-mjs-red flex-shrink-0" />
                orders@mobilejanitorialsupply.com
              </a>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-mjs-red flex-shrink-0" />
                <span>Mon — Fri, 6:30 AM — 3:00 PM</span>
              </div>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/shop/paper-restroom" className="hover:text-white transition-colors">Paper Products</a></li>
              <li><a href="/shop/cleaning-chemicals" className="hover:text-white transition-colors">Chemicals</a></li>
              <li><a href="/category/trash-liners" className="hover:text-white transition-colors">Trash Liners</a></li>
              <li><a href="/shop/gloves-safety" className="hover:text-white transition-colors">Gloves &amp; Safety</a></li>
              <li><a href="/category/packaging-film" className="hover:text-white transition-colors">Packaging</a></li>
              <li><a href="/shop/equipment-tools" className="hover:text-white transition-colors">Equipment</a></li>
              <li><a href="/category/breakroom" className="hover:text-white transition-colors">Breakroom</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="/faq" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="/quote" className="hover:text-white transition-colors">Get a Quote</a></li>
              <li><a href="/catalogs" className="hover:text-white transition-colors">Catalogs</a></li>
              <li><a href="/rewards" className="hover:text-white transition-colors">Rewards Program</a></li>
              <li><a href="/resources" className="hover:text-white transition-colors">Forms &amp; SDS</a></li>
            </ul>
          </div>

          {/* Account + Legal */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Account</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/auth" className="hover:text-white transition-colors">Create Account</a></li>
              <li><a href="/account" className="hover:text-white transition-colors">My Account</a></li>
              <li><a href="/cart" className="hover:text-white transition-colors">Cart</a></li>
            </ul>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 mt-6">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/return-policy" className="hover:text-white transition-colors">Return Policy</a></li>
              <li><a href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-white transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Language + Payment + Copyright */}
      <div className="border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-4 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Language Toggle */}
            <button
              onClick={toggleSpanish}
              className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full px-4 py-2 transition-all group"
            >
              <Globe className="w-4 h-4 text-mjs-red" />
              <span className="text-sm text-gray-300 group-hover:text-white font-medium">
                {translating ? "English" : "Espa\u00f1ol"}
              </span>
              <div className="flex items-center bg-white/10 rounded-full p-0.5">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-all ${!translating ? "bg-white text-mjs-dark" : "text-gray-500"}`}>
                  EN
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-all ${translating ? "bg-mjs-red text-white" : "text-gray-500"}`}>
                  ES
                </span>
              </div>
            </button>

            {/* Payment Icons */}
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Secure Checkout</span>
              <div className="flex items-center gap-1.5">
                <img src="/images/master-card.png" alt="MasterCard" className="h-6" />
                <img src="/images/visa.png" alt="Visa" className="h-6" />
                <img src="/images/american-express.png" alt="Amex" className="h-6" />
                <img src="/images/discover.png" alt="Discover" className="h-6" />
              </div>
            </div>

            {/* Copyright */}
            <div className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} Mobile Janitorial Supply
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Google Translate element */}
      <div id="google_translate_element" style={{ display: "none" }} />
    </footer>
  );
}
