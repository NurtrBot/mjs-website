"use client";

import { useEffect } from "react";
import { Search } from "lucide-react";
import type { ProductData } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { trackSearch } from "@/lib/analytics";

// Results are fetched on the server (see app/search/page.tsx) so the page is readable
// without JavaScript; this component only adds analytics and the interactive cards.
export default function SearchResults({ query, results }: { query: string; results: ProductData[] }) {
  useEffect(() => {
    if (query.length >= 2) trackSearch(query, results.length);
  }, [query, results.length]);

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-xl font-bold text-mjs-dark">
            {query ? (
              <>Search results for &ldquo;<span className="text-mjs-red">{query}</span>&rdquo;</>
            ) : (
              "Search Products"
            )}
          </h1>
          {query && (
            <p className="text-sm text-mjs-gray-400 mt-1">
              {results.length} product{results.length !== 1 ? "s" : ""} found
            </p>
          )}
        </div>
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-0 sm:gap-3">
          {results.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : query.length > 1 ? (
        <div className="text-center py-20">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-mjs-gray-700 mb-2">No products found</h2>
          <p className="text-sm text-mjs-gray-400 max-w-md mx-auto">
            We couldn&apos;t find any products matching &ldquo;{query}&rdquo;. Try a different search term or browse our categories.
          </p>
          <a href="/shop" className="inline-block mt-6 bg-mjs-red text-white font-semibold px-6 py-2.5 rounded-lg text-sm hover:bg-red-700 transition-colors">
            Browse All Categories
          </a>
        </div>
      ) : (
        <div className="text-center py-20">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-mjs-gray-700 mb-2">Search for products</h2>
          <p className="text-sm text-mjs-gray-400">Use the search bar above to find products by name, SKU, brand, or category.</p>
        </div>
      )}
    </div>
  );
}
