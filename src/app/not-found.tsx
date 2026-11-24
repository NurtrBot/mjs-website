import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import Footer from "@/components/Footer";
import { SITE_CATEGORY_NAMES } from "@/lib/category-map";

/*
 * Real 404 page. Rendered whenever a route calls notFound(), which makes the
 * server answer with HTTP 404 (and a noindex tag) instead of a redirect to the
 * home page. Search engines then drop the dead URL rather than treating the
 * home page as its replacement.
 */
export const metadata: Metadata = {
  title: "Page not found",
  description: "That page isn't here. Search the catalog or browse by category to find what you need.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <TopBar />
      <Header />
      <CategoryNav />
      <main className="bg-mjs-gray-50 min-h-[60vh]">
        <div className="max-w-[1400px] mx-auto px-4 py-10 sm:py-16">
          <div
            className="mx-auto max-w-2xl rounded-2xl px-6 py-10 sm:px-12 sm:py-14 text-center shadow-sm"
            style={{ background: "linear-gradient(180deg, #ffffff 0%, #f1f3f6 100%)" }}
          >
            <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-mjs-gray-400">Error 404</p>
            <h1 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight text-mjs-dark">
              We couldn&apos;t find that page
            </h1>
            <p className="mt-3 text-sm sm:text-[15px] leading-relaxed text-mjs-gray-500">
              The link may be out of date, or the product may have moved. Search the catalog
              or start from the homepage.
            </p>

            <form action="/search" method="get" role="search" className="mt-6 flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
              <Search className="h-4 w-4 shrink-0 text-mjs-gray-400" aria-hidden />
              <input
                type="text"
                name="q"
                placeholder="Search products, item numbers, brands"
                className="min-w-0 flex-1 bg-transparent text-sm text-mjs-dark outline-none placeholder:text-mjs-gray-400"
                aria-label="Search products"
              />
              <button type="submit" className="rounded-full bg-mjs-red px-4 py-1.5 text-[13px] font-bold text-white transition-colors hover:bg-red-700">
                Search
              </button>
            </form>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link href="/" className="rounded-full bg-mjs-dark px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90">
                Go to the homepage
              </Link>
              <Link href="/shop" className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-mjs-dark shadow-sm transition-colors hover:bg-mjs-gray-100">
                Browse all categories
              </Link>
            </div>

            <ul className="mt-8 flex flex-wrap justify-center gap-x-4 gap-y-2 text-[13px] font-semibold text-mjs-gray-500">
              {Object.entries(SITE_CATEGORY_NAMES).map(([slug, name]) => (
                <li key={slug}>
                  <Link href={`/category/${slug}`} className="hover:text-mjs-dark">
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
