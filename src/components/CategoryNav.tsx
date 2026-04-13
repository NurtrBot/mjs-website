"use client";

import {
  ScrollText,
  Droplets,
  SprayCan,
  Hand,
  Package,
  Coffee,
  Truck,
  Wrench,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

const categories = [
  { name: "1-2 Day Delivery", icon: Truck, highlight: true, image: "/images/cat-delivery.png", href: "/" },
  { name: "Paper Products", icon: ScrollText, image: "/images/cat-paper-products.png", href: "/category/paper-products" },
  { name: "Cleaning Chemicals", icon: Droplets, image: "/images/cat-chemicals.png", href: "/category/cleaning-chemicals" },
  { name: "Trash Liners", icon: SprayCan, image: "/images/cat-trash-liners.png", href: "/category/trash-liners" },
  { name: "Gloves & Safety", icon: Hand, image: "/images/cat-gloves-safety.png", href: "/category/gloves-safety" },
  { name: "Packaging & Film", icon: Package, image: "/images/cat-packaging.png", href: "/category/packaging-film" },
  { name: "Breakroom", icon: Coffee, image: "/images/cat-breakroom.png", href: "/category/breakroom" },
  { name: "Equipment", icon: Wrench, image: "/images/cat-equipment.png", href: "/category/equipment" },
  { name: "Floor Care", icon: Sparkles, image: "/images/cat-floor-care.png", href: "/category/floor-care" },
  { name: "Car Detailing", icon: Sparkles, image: "/images/cat-car-detailing.png", href: "/category/car-detailing" },
];

export default function CategoryNav() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex items-end justify-between overflow-x-auto scrollbar-hide">
          {categories.map((cat) => {
            const isActive = active === cat.name;
            return (
              <a
                key={cat.name}
                href={cat.href}
                onMouseEnter={() => setActive(cat.name)}
                onMouseLeave={() => setActive(null)}
                className={`flex flex-col items-center gap-1 px-3 py-2.5 flex-1 min-w-[100px] border-b-[3px] transition-all overflow-hidden relative ${
                  isActive
                    ? "border-mjs-red"
                    : "border-transparent"
                }`}
              >
                {cat.image ? (
                  <div className="w-full h-[80px] flex items-center justify-center overflow-hidden">
                    <img src={cat.image} alt={cat.name} className="max-w-full max-h-[80px] object-contain" />
                  </div>
                ) : (
                  <div className={`w-8 h-8 flex items-center justify-center transition-colors ${
                    cat.highlight ? "text-mjs-red" : isActive ? "text-mjs-red" : "text-mjs-gray-500"
                  }`}>
                    <cat.icon className="w-6 h-6" strokeWidth={1.5} />
                  </div>
                )}
                <span
                  className={`text-[11px] font-semibold whitespace-nowrap transition-colors ${
                    cat.highlight
                      ? "text-mjs-red"
                      : isActive
                      ? "text-mjs-dark"
                      : "text-mjs-gray-600"
                  }`}
                >
                  {cat.name}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
