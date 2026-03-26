"use client";

import {
  Droplets,
  Hand,
  Package,
  Coffee,
  ScrollText,
  SprayCan,
  ChevronRight,
  ChevronLeft,
  Wrench,
  Sparkles,
} from "lucide-react";
import { useRef } from "react";

const categories = [
  {
    name: "Toilet Tissue",
    icon: ScrollText,
    startingFrom: "$36.99",
    color: "from-sky-400 to-sky-600",
    bg: "bg-sky-50",
  },
  {
    name: "Paper Towels",
    icon: ScrollText,
    startingFrom: "$28.99",
    color: "from-blue-400 to-blue-600",
    bg: "bg-blue-50",
  },
  {
    name: "Chemicals",
    icon: Droplets,
    startingFrom: "$11.50",
    color: "from-emerald-400 to-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    name: "Nitrile Gloves",
    icon: Hand,
    startingFrom: "$5.99",
    color: "from-violet-400 to-violet-600",
    bg: "bg-violet-50",
  },
  {
    name: "Stretch Film",
    icon: Package,
    startingFrom: "$39.99",
    color: "from-amber-400 to-amber-600",
    bg: "bg-amber-50",
  },
  {
    name: "Floor Care",
    icon: Sparkles,
    startingFrom: "$18.95",
    color: "from-teal-400 to-teal-600",
    bg: "bg-teal-50",
  },
  {
    name: "Cleaning Tools",
    icon: SprayCan,
    startingFrom: "$12.50",
    color: "from-cyan-400 to-cyan-600",
    bg: "bg-cyan-50",
  },
  {
    name: "Equipment",
    icon: Wrench,
    startingFrom: "$149.00",
    color: "from-gray-400 to-gray-600",
    bg: "bg-gray-50",
  },
  {
    name: "Breakroom",
    icon: Coffee,
    startingFrom: "$8.99",
    color: "from-rose-400 to-rose-600",
    bg: "bg-rose-50",
  },
];

export default function CategoryGrid() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="bg-white py-6">
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-mjs-dark">
            Shop by Category
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-mjs-gray-600" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-mjs-gray-600" />
            </button>
          </div>
        </div>

        {/* Horizontal Scroll */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide pb-2"
        >
          {categories.map((cat) => (
            <a
              key={cat.name}
              href="#"
              className={`flex-shrink-0 w-[140px] ${cat.bg} rounded-xl p-4 text-center group hover:shadow-lg transition-all border border-transparent hover:border-gray-200`}
            >
              <div
                className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform shadow-md`}
              >
                <cat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-xs font-semibold text-mjs-gray-800 group-hover:text-mjs-red transition-colors">
                {cat.name}
              </div>
              <div className="text-[10px] font-bold text-mjs-red mt-1">
                Starting From {cat.startingFrom}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
