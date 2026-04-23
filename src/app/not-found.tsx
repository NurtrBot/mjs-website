import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Search, ArrowRight, Home, Phone } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-[70vh]">
        <div className="max-w-[800px] mx-auto px-4 py-20 text-center">
          {/* Big 404 */}
          <div className="text-[120px] sm:text-[160px] font-black text-mjs-dark/5 leading-none select-none">
            404
          </div>

          <div className="-mt-16 sm:-mt-20 relative">
            <h1 className="text-2xl sm:text-3xl font-black text-mjs-dark mb-3">
              Page Not Found
            </h1>
            <p className="text-sm text-mjs-gray-500 max-w-md mx-auto leading-relaxed">
              The page you're looking for doesn't exist or has been moved. Try searching for what you need or browse our categories below.
            </p>

            {/* Search Bar */}
            <form action="/search" method="GET" className="mt-8 max-w-lg mx-auto">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mjs-gray-400" />
                  <input
                    type="text"
                    name="q"
                    placeholder="Search products, SKUs, brands..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-mjs-red focus:ring-2 focus:ring-mjs-red/10 transition-all"
                  />
                </div>
                <button type="submit" className="bg-mjs-red text-white font-bold px-5 py-3 rounded-xl text-sm hover:bg-red-700 transition-colors">
                  Search
                </button>
              </div>
            </form>

            {/* Quick Links */}
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto">
              {[
                { label: "Paper Products", href: "/shop/paper-restroom" },
                { label: "Chemicals", href: "/shop/cleaning-chemicals" },
                { label: "Trash Liners", href: "/shop/trash-liners" },
                { label: "Gloves & Safety", href: "/shop/gloves-safety" },
                { label: "Equipment", href: "/shop/equipment-tools" },
                { label: "Packaging", href: "/shop/packaging-film" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-mjs-dark hover:border-mjs-red hover:text-mjs-red transition-all text-center"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <a href="/" className="inline-flex items-center gap-2 bg-mjs-dark text-white font-bold px-6 py-3 rounded-xl text-sm hover:bg-gray-800 transition-colors">
                <Home className="w-4 h-4" />
                Back to Home
              </a>
              <a href="/contact" className="inline-flex items-center gap-2 bg-white border border-gray-200 text-mjs-dark font-bold px-6 py-3 rounded-xl text-sm hover:border-mjs-red hover:text-mjs-red transition-colors">
                <Phone className="w-4 h-4" />
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
