"use client";

import Image from "next/image";

const categories = [
  { name: "Paper Products", image: "/images/cat-paper-products.png", href: "/category/paper-products" },
  { name: "Cleaning Chemicals", image: "/images/cat-chemicals.png", href: "/category/cleaning-chemicals" },
  { name: "Trash Liners", image: "/images/cat-trash-liners.png", href: "/category/trash-liners" },
  { name: "Gloves & Safety", image: "/images/cat-gloves-safety.png", href: "/category/gloves-safety" },
  { name: "Packaging & Film", image: "/images/cat-packaging.png", href: "/category/packaging-film" },
  { name: "Breakroom", image: "/images/cat-breakroom.png", href: "/category/breakroom" },
  { name: "Equipment", image: "/images/cat-equipment.png", href: "/category/equipment" },
  { name: "Floor Care", image: "/images/cat-floor-care.png", href: "/category/floor-care" },
  { name: "Car Detailing", image: "/images/cat-car-detailing.png", href: "/category/car-detailing" },
];

export default function MobileCategoryGrid() {
  return (
    <div className="md:hidden bg-white px-3 py-4">
      <div className="grid grid-cols-3 gap-2">
        {categories.map((cat) => (
          <a
            key={cat.name}
            href={cat.href}
            className="flex flex-col items-center text-center"
          >
            <div className="relative w-full aspect-square bg-mjs-gray-50 rounded-lg overflow-hidden mb-1">
              <Image src={cat.image} alt={cat.name} fill sizes="33vw" className="object-contain p-2" />
            </div>
            <span className="text-[10px] font-semibold text-mjs-gray-700 leading-tight">
              {cat.name}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
