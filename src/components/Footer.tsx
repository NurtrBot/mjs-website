import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-mjs-dark text-gray-400">
      <div className="max-w-[1400px] mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          {/* Logo + Name */}
          <div className="flex items-center gap-2.5">
            <img
              src="/images/mjs-logo.png"
              alt="Mobile Janitorial Supply"
              className="h-12 w-auto"
            />
            <div>
              <div className="text-sm font-extrabold text-white tracking-tight leading-none">
                MOBILE JANITORIAL SUPPLY
              </div>
              <div className="text-[10px] text-gray-500 mt-0.5">
                Google&apos;s #1 Rated &amp; Reviewed
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row items-center gap-6 text-sm">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 text-mjs-red flex-shrink-0" />
              <span className="text-center sm:text-left">
                3066 E. La Palma Ave,<br />
                Anaheim, CA 92806
              </span>
            </div>
            <div className="h-8 w-px bg-white/10 hidden sm:block" />
            <a
              href="tel:7147792640"
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <Phone className="w-4 h-4 text-mjs-red" />
              (714) 779-2640
            </a>
            <div className="h-8 w-px bg-white/10 hidden sm:block" />
            <a
              href="mailto:orders@mobilejanitorialsupply.com"
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <Mail className="w-4 h-4 text-mjs-red" />
              orders@mobilejanitorialsupply.com
            </a>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-4 py-4 flex flex-wrap items-center justify-center gap-4 text-xs">
          <a href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</a>
          <span className="text-white/10">|</span>
          <a href="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</a>
          <span className="text-white/10">|</span>
          <a href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</a>
          <span className="text-white/10">|</span>
          <a href="/quote" className="text-gray-400 hover:text-white transition-colors">Get a Quote</a>
          <span className="text-white/10">|</span>
          <a href="/return-policy" className="text-gray-400 hover:text-white transition-colors">Return Policy</a>
          <span className="text-white/10">|</span>
          <a href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
          <span className="text-white/10">|</span>
          <a href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms &amp; Conditions</a>
          <span className="text-white/10">|</span>
          <a href="/resources" className="text-gray-400 hover:text-white transition-colors">Forms &amp; SDS</a>
          <span className="text-white/10">|</span>
          <a href="/auth" className="text-gray-400 hover:text-white transition-colors">Create Account</a>
          <span className="text-white/10">|</span>
          <a href="/account" className="text-gray-400 hover:text-white transition-colors">My Account</a>
          <span className="text-white/10">|</span>
          <a href="/cart" className="text-gray-400 hover:text-white transition-colors">Cart</a>
          <span className="text-white/10">|</span>
          <a href="/category/paper-products" className="text-gray-400 hover:text-white transition-colors">Paper Products</a>
          <span className="text-white/10">|</span>
          <a href="/category/cleaning-chemicals" className="text-gray-400 hover:text-white transition-colors">Chemicals</a>
          <span className="text-white/10">|</span>
          <a href="/category/gloves-safety" className="text-gray-400 hover:text-white transition-colors">Gloves</a>
        </div>
      </div>

      {/* Secure Checkout */}
      <div className="border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-4 py-4 flex flex-col items-center gap-2">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Checkout Securely With</span>
          <div className="flex items-center gap-2">
            <img src="/images/master-card.png" alt="MasterCard" className="h-7" />
            <img src="/images/visa.png" alt="Visa" className="h-7" />
            <img src="/images/american-express.png" alt="American Express" className="h-7" />
            <img src="/images/discover.png" alt="Discover" className="h-7" />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-4 py-4">
          <div className="text-center text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Mobile Janitorial Supply. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
