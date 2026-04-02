"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import type { ProductData } from "@/data/products";

/* ── Site category slug → display name ── */
const categoryNames: Record<string, string> = {
  "paper-products": "Paper Products",
  "cleaning-chemicals": "Cleaning Chemicals",
  "trash-liners": "Trash Liners",
  "gloves-safety": "Gloves & Safety",
  "packaging-film": "Packaging & Film",
  "breakroom": "Breakroom",
  "equipment": "Equipment & Tools",
  "floor-care": "Floor Care",
  "car-detailing": "Car Detailing",
};

/* ── Quick filter config per category ── */
const quickFilters: Record<string, { label: string; subcategories: string[] }[]> = {
  "paper-products": [
    { label: "Roll Towels", subcategories: ["Roll Towels"] },
    { label: "Multifolds", subcategories: ["Multifolds"] },
    { label: "Toilet Tissue", subcategories: ["Toilet Tissue"] },
    { label: "Center-Pull", subcategories: ["Center-Pull Towels"] },
    { label: "Facial Tissue", subcategories: ["Facial Tissue"] },
    { label: "Napkins", subcategories: ["Napkins"] },
    { label: "Copy Paper", subcategories: ["Copy Paper"] },
  ],
  "cleaning-chemicals": [
    { label: "Degreasers", subcategories: ["Degreasers"] },
    { label: "All Purpose", subcategories: ["All Purpose Cleaners", "Bathroom Cleaners", "Oven Cleaners"] },
    { label: "Specialty", subcategories: ["Specialty Cleaners", "Polishes"] },
    { label: "Disinfectants", subcategories: ["Disinfectants", "Wipes", "Bleach"] },
    { label: "Hand Soap", subcategories: ["Hand Soap & Sanitizer"] },
    { label: "Glass Cleaners", subcategories: ["Glass Cleaners"] },
    { label: "Air Fresheners", subcategories: ["Air Fresheners", "Restroom Deodorizers"] },
    { label: "Floor Care", subcategories: ["Floor Care", "Floor Strippers", "Floor Finishes"] },
    { label: "Carpet Care", subcategories: ["Carpet Care"] },
    { label: "Dish & Laundry", subcategories: ["Dish Soap", "Laundry"] },
    { label: "Drain Cleaners", subcategories: ["Drain Cleaners"] },
  ],
  "trash-liners": [
    { label: "Can Liners", subcategories: ["Can Liners"] },
  ],
  "gloves-safety": [
    { label: "Nitrile", subcategories: ["Nitrile Gloves"] },
    { label: "Latex", subcategories: ["Latex Gloves"] },
    { label: "Vinyl", subcategories: ["Vinyl Gloves"] },
    { label: "Face Masks", subcategories: ["Face Masks"] },
    { label: "Hair & Beard", subcategories: ["Hair Protection", "Beard Covers"] },
    { label: "Aprons & Sleeves", subcategories: ["Aprons", "Arm Sleeves"] },
    { label: "Eye & Ear", subcategories: ["Eye Protection", "Ear Plugs"] },
  ],
  "packaging-film": [
    { label: "Stretch Film", subcategories: ["Stretch Film"] },
    { label: "Tape", subcategories: ["Tape"] },
    { label: "Tape Guns", subcategories: ["Tape Dispensers"] },
    { label: "Bubble Wrap", subcategories: ["Bubble Wrap"] },
    { label: "Packing Peanuts", subcategories: ["Packing Peanuts"] },
    { label: "Steel Strapping", subcategories: ["Steel Strapping"] },
    { label: "Cable Ties", subcategories: ["Cable Ties"] },
    { label: "Labels", subcategories: ["Labels"] },
  ],
  "breakroom": [
    { label: "Cups & Lids", subcategories: ["Cups & Lids"] },
    { label: "Plates & Bowls", subcategories: ["Plates & Bowls"] },
    { label: "Cutlery", subcategories: ["Cutlery"] },
    { label: "Napkins", subcategories: ["Napkins"] },
    { label: "Batteries", subcategories: ["Batteries"] },
    { label: "Beverages", subcategories: ["Beverages"] },
    { label: "Food Storage", subcategories: ["Food Storage"] },
    { label: "Coffee", subcategories: ["Coffee & Supplies"] },
  ],
  "equipment": [
    { label: "Dispensers", subcategories: ["Dispensers"] },
    { label: "Mops", subcategories: ["Mops & Handles", "Dust Mops"] },
    { label: "Brooms", subcategories: ["Brooms & Dustpans"] },
    { label: "Buckets", subcategories: ["Buckets & Wringers"] },
    { label: "Vacuums", subcategories: ["Vacuums"] },
    { label: "Trash Cans", subcategories: ["Trash Cans", "Carts & Dollies"] },
    { label: "Window", subcategories: ["Window Equipment"] },
    { label: "Sprayers", subcategories: ["Sprayers & Bottles"] },
    { label: "Microfiber", subcategories: ["Microfiber"] },
    { label: "Rags & Wipers", subcategories: ["Rags & Wipers"] },
    { label: "Brushes & Pads", subcategories: ["Brushes & Pads", "Pad Drivers"] },
    { label: "Dusters", subcategories: ["Dusters"] },
    { label: "Floor Machines", subcategories: ["Floor Machines", "Air Movers"] },
  ],
  "floor-care": [
    { label: "Floor Pads", subcategories: ["Floor Pads", "Stripping Pads", "Buffing Pads", "Polishing Pads", "Scrubbing Pads"] },
    { label: "Bonnets", subcategories: ["Bonnets"] },
    { label: "Carpet Care", subcategories: ["Carpet Care"] },
  ],
  "car-detailing": [
    { label: "Air Fresheners", subcategories: ["Air Fresheners"] },
    { label: "Wash & Foam", subcategories: ["Wash"] },
    { label: "Glass Care", subcategories: ["Glass"] },
    { label: "Wax & Protection", subcategories: ["Wax & Protection"] },
  ],
};

export default function CategoryPage({ slug }: { slug: string }) {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<number | null>(null);

  const categoryName = categoryNames[slug];
  const filters = quickFilters[slug] || [];

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products/category?slug=${slug}&limit=250`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (!categoryName) {
    return (
      <section className="bg-mjs-gray-50 min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-mjs-dark">Category Not Found</h1>
          <p className="text-mjs-gray-500 mt-2">The category you&apos;re looking for doesn&apos;t exist.</p>
          <a href="/" className="inline-block mt-4 bg-mjs-red text-white font-semibold px-6 py-2.5 rounded-lg text-sm hover:bg-red-700 transition-colors">
            Back to Home
          </a>
        </div>
      </section>
    );
  }

  const filtered = activeFilter !== null && filters[activeFilter]
    ? products.filter((p) => filters[activeFilter].subcategories.includes(p.subcategory))
    : products;

  return (
    <section className="bg-mjs-gray-50 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-xs text-mjs-gray-400 mb-3">
            <a href="/" className="hover:text-mjs-red transition-colors">Home</a>
            <span>/</span>
            <span className="text-mjs-dark font-medium">{categoryName}</span>
            {activeFilter !== null && filters[activeFilter] && (
              <>
                <span>/</span>
                <span className="text-mjs-dark font-medium">{filters[activeFilter].label}</span>
              </>
            )}
          </div>
          <h1 className="text-2xl font-bold text-mjs-dark">{categoryName}</h1>
          <p className="text-sm text-mjs-gray-500 mt-1">
            {loading ? "Loading..." : `${filtered.length} products available`}
          </p>
        </div>

        {/* Quick Filter Buttons */}
        {filters.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 px-6 py-4 mb-6">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => setActiveFilter(null)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeFilter === null
                    ? "bg-mjs-red text-white shadow-md shadow-red-200"
                    : "bg-mjs-gray-50 text-mjs-gray-600 hover:bg-red-50 hover:text-mjs-red"
                }`}
              >
                All Products
              </button>
              {filters.map((filter, i) => (
                <button
                  key={filter.label}
                  onClick={() => setActiveFilter(activeFilter === i ? null : i)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                    activeFilter === i
                      ? "bg-mjs-red text-white shadow-md shadow-red-200"
                      : "bg-mjs-gray-50 text-mjs-gray-600 hover:bg-red-50 hover:text-mjs-red"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-mjs-red animate-spin" />
          </div>
        )}

        {/* Product Grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="bg-white rounded-xl p-12 text-center">
            <p className="text-mjs-gray-500">No products in this category yet. Check back soon!</p>
            <a href="/" className="inline-block mt-4 bg-mjs-red text-white font-semibold px-6 py-2.5 rounded-lg text-sm hover:bg-red-700 transition-colors">
              Back to Home
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
