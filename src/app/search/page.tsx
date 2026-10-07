import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchResults from "@/components/SearchResults";
import { searchProducts } from "@/lib/products-api";
import type { ProductData } from "@/data/products";

type SearchParams = Promise<{ q?: string | string[] }>;

const hasRealImage = (p: ProductData) => p.images.length > 0 && !p.images[0].includes("placeholder");

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const { q } = await searchParams;
  const query = (Array.isArray(q) ? q[0] : q || "").trim();
  return {
    title: query ? `"${query}" — Search Results | Mobile Janitorial Supply` : "Search Products | Mobile Janitorial Supply",
    description: query
      ? `Products matching "${query}" at Mobile Janitorial Supply. Wholesale janitorial supplies with free local delivery in Southern California.`
      : "Search 10,000+ janitorial, cleaning, and facility supplies. Find products by name, SKU, brand, or category.",
    robots: { index: false, follow: true },
  };
}

// Server-rendered search: results are in the HTML, so crawlers and AI agents can read them.
export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const { q } = await searchParams;
  const query = (Array.isArray(q) ? q[0] : q || "").trim().slice(0, 100);

  let results: ProductData[] = [];
  if (query.length >= 2) {
    try {
      results = (await searchProducts(query, 250)).filter(hasRealImage);
    } catch {
      results = [];
    }
  }

  return (
    <>
      <Header />
      <main className="bg-mjs-gray-50 min-h-screen">
        <SearchResults query={query} results={results} />
      </main>
      <Footer />
    </>
  );
}
