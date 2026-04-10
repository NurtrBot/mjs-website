"use client";

import { FileText, Download, ExternalLink } from "lucide-react";

const catalogs = [
  { name: "Alpine Industries", file: "/catalogs/alpine-industries-catalog.pdf", category: "Equipment" },
  { name: "Bobrick Washroom Accessories", file: "/catalogs/bobrick-washroom-accessories.pdf", category: "Restroom" },
  { name: "Chase Aerosols", file: "/catalogs/chase-aerosols.pdf", category: "Chemicals" },
  { name: "Dart Container", file: "/catalogs/dart-container-catalog.pdf", category: "Breakroom" },
  { name: "Eco Food Services", file: "/catalogs/eco-food-services-catalog.pdf", category: "Breakroom" },
  { name: "Ettore Window Cleaning", file: "/catalogs/Ettore-Catalog.pdf", category: "Equipment" },
  { name: "Fall Protection", file: "/catalogs/fall-protection-catalog.pdf", category: "Safety" },
  { name: "Floor Mats", file: "/catalogs/floor-mat-catalog.pdf", category: "Floor Care" },
  { name: "Food Service & Maintenance", file: "/catalogs/food-service-maintenance.pdf", category: "Breakroom" },
  { name: "Gloves & Safety", file: "/catalogs/glove-safety-catalog.pdf", category: "Safety" },
  { name: "GOJO Industries", file: "/catalogs/gojo-industries.pdf", category: "Chemicals" },
  { name: "Hand Dryers", file: "/catalogs/hand-dryer-catalog.pdf", category: "Restroom" },
  { name: "Janitors Finest Backpack Vacuums", file: "/catalogs/jf-backpack-vacuums.pdf", category: "Equipment" },
  { name: "Mercury Floor Equipment", file: "/catalogs/mercury-floor-equipment.pdf", category: "Equipment" },
  { name: "Mopping Equipment", file: "/catalogs/mopping-equipment.pdf", category: "Equipment" },
  { name: "Packaging", file: "/catalogs/packaging-catalog.pdf", category: "Packaging" },
  { name: "Pacific Handy Cutter", file: "/catalogs/2021-pacific-handy-cutter-industrial-catalog.pdf", category: "Safety" },
  { name: "Restaurant Supply", file: "/catalogs/restaurant-supply-catalog.pdf", category: "Breakroom" },
  { name: "Sandia Equipment", file: "/catalogs/sandia-equipment.pdf", category: "Equipment" },
  { name: "Sandia Parts & Accessories", file: "/catalogs/sandia-parts-accessories.pdf", category: "Equipment" },
  { name: "Sanitaire Vacuums", file: "/catalogs/sanitaire-vacuum-catalog.pdf", category: "Equipment" },
];

const categoryColors: Record<string, string> = {
  Equipment: "bg-blue-50 text-blue-600",
  Chemicals: "bg-emerald-50 text-emerald-600",
  Safety: "bg-amber-50 text-amber-600",
  Breakroom: "bg-rose-50 text-rose-600",
  Restroom: "bg-violet-50 text-violet-600",
  "Floor Care": "bg-teal-50 text-teal-600",
  Packaging: "bg-orange-50 text-orange-600",
};

export default function CatalogsPage() {
  return (
    <section className="bg-mjs-gray-50 min-h-screen">
      {/* Hero */}
      <div className="bg-mjs-dark">
        <div className="max-w-[1400px] mx-auto px-4 py-16 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-6">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span>/</span>
            <span className="text-gray-400">Catalogs</span>
          </div>
          <span className="inline-block bg-white/10 text-mjs-gold text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
            Product Catalogs
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Browse Our Catalogs</h1>
          <p className="text-gray-400 mt-3 max-w-lg mx-auto">
            Download product catalogs from our top brands and suppliers. View the full product lines and specifications.
          </p>
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="max-w-[1400px] mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {catalogs.map((catalog) => (
            <a
              key={catalog.file}
              href={catalog.file}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-lg hover:border-gray-200 transition-all group flex flex-col"
            >
              <div className="text-center mb-3">
                <h3 className="text-sm font-bold text-mjs-dark group-hover:text-mjs-red transition-colors leading-snug">
                  {catalog.name}
                </h3>
                <span className={`inline-block text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded mt-2 ${categoryColors[catalog.category] || "bg-gray-50 text-gray-600"}`}>
                  {catalog.category}
                </span>
              </div>
              <div className="mt-auto pt-3 border-t border-gray-100 text-center">
                <span className="text-xs font-semibold text-mjs-red group-hover:text-red-700 transition-colors">
                  View Catalog
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
