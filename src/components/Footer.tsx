"use client";

import { MapPin, Phone, Mail, Globe, Clock, ChevronDown } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const RESOURCE_SECTIONS = [
  {
    title: "Buying Guides",
    links: [
      { label: "Trash Bag Size Guide", href: "/guides/trash-bag-size-guide" },
      { label: "Glove Guide: Nitrile vs Vinyl vs Latex", href: "/guides/disposable-glove-guide" },
      { label: "How to Strip & Wax Floors", href: "/guides/how-to-strip-and-wax-floors" },
      { label: "Chemical Dilution Chart", href: "/guides/cleaning-chemical-dilution-chart" },
      { label: "Paper Towel Guide", href: "/guides/paper-towel-guide" },
      { label: "Janitorial Supply Checklist", href: "/guides/janitorial-supply-checklist" },
      { label: "Car Detailing Supply Guide", href: "/guides/car-detailing-supply-guide" },
      { label: "Mop Buying Guide", href: "/guides/mop-buying-guide" },
      { label: "Carpet Cleaning Guide", href: "/guides/commercial-carpet-cleaning-guide" },
      { label: "Stretch Wrap Guide", href: "/guides/stretch-wrap-guide" },
      { label: "N95 & Respirator Guide", href: "/guides/respirator-mask-guide" },
      { label: "Restroom Cleaning Checklist", href: "/guides/restroom-cleaning-checklist" },
      { label: "Food Service Disposables", href: "/guides/food-service-disposables-guide" },
      { label: "How to Bid a Cleaning Job", href: "/guides/how-to-bid-a-cleaning-job" },
      { label: "Soap & Dispenser Guide", href: "/guides/soap-dispenser-guide" },
      { label: "Shipping Supplies Guide", href: "/guides/shipping-supplies-guide" },
      { label: "Green Cleaning Guide", href: "/guides/green-cleaning-guide" },
    ],
  },
  {
    title: "Industries We Serve",
    links: [
      { label: "Restaurants & Food Service", href: "/industries/restaurants" },
      { label: "Healthcare & Medical", href: "/industries/healthcare" },
      { label: "Schools & Education", href: "/industries/schools" },
      { label: "Property Management", href: "/industries/property-management" },
      { label: "Offices & Commercial", href: "/industries/offices" },
      { label: "Warehouses & Industrial", href: "/industries/warehouses" },
    ],
  },
  {
    title: "Service Areas",
    links: [
      { label: "Orange County", href: "/locations/orange-county" },
      { label: "Los Angeles", href: "/locations/los-angeles" },
      { label: "Inland Empire", href: "/locations/inland-empire" },
      { label: "San Diego", href: "/locations/san-diego" },
      { label: "Anaheim", href: "/locations/anaheim" },
      { label: "Irvine", href: "/locations/irvine" },
      { label: "Santa Ana", href: "/locations/santa-ana" },
      { label: "Huntington Beach", href: "/locations/huntington-beach" },
      { label: "Fullerton", href: "/locations/fullerton" },
      { label: "Costa Mesa", href: "/locations/costa-mesa" },
      { label: "Garden Grove", href: "/locations/garden-grove" },
      { label: "Long Beach", href: "/locations/long-beach" },
    ],
  },
];

export default function Footer() {
  const [translating, setTranslating] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);

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
              <Image src="/images/mjs-logo.png" alt="Mobile Janitorial Supply" width={120} height={40} className="h-10 w-auto" />
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

      {/* Resources Toggle */}
      <div className="max-w-[1400px] mx-auto px-4 py-2">
        <button
          onClick={() => setOpenSection(openSection === "resources" ? null : "resources")}
          className="w-full flex items-center gap-4 py-4 group cursor-pointer"
        >
          <div className="flex-1 h-px bg-white/20" />
          <div className={`flex items-center gap-2.5 px-6 py-2.5 rounded-full border transition-all ${
            openSection === "resources"
              ? "border-mjs-red bg-mjs-red/15 text-white"
              : "border-white/20 bg-white/5 text-gray-300 group-hover:border-mjs-red/50 group-hover:bg-white/10 group-hover:text-white"
          }`}>
            <span className="text-[11px] font-bold uppercase tracking-widest">Resources</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${openSection === "resources" ? "rotate-180 text-mjs-red" : "text-gray-400"}`} />
          </div>
          <div className="flex-1 h-px bg-white/20" />
        </button>

        {/* Expanded Resources Panel */}
        {openSection === "resources" && (
          <div className="pb-6">
            <div className="grid md:grid-cols-3 gap-6">
              {RESOURCE_SECTIONS.map((section) => (
                <div key={section.title}>
                  <h5 className="text-[10px] font-bold text-mjs-red uppercase tracking-widest mb-3">{section.title}</h5>
                  <div className="space-y-1">
                    {section.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block text-[12px] text-gray-500 hover:text-white transition-colors py-0.5"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
                <Image src="/images/master-card.png" alt="MasterCard" width={38} height={24} className="h-6 w-auto" />
                <Image src="/images/visa.png" alt="Visa" width={38} height={24} className="h-6 w-auto" />
                <Image src="/images/american-express.png" alt="Amex" width={38} height={24} className="h-6 w-auto" />
                <Image src="/images/discover.png" alt="Discover" width={38} height={24} className="h-6 w-auto" />
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
