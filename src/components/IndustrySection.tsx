"use client";

import { ArrowRight } from "lucide-react";

interface Industry {
  name: string;
  products: string;
  image: string;
}

const industries: Industry[] = [
  { name: "Commercial Offices", products: "2,400+", image: "/images/industry-commercial-offices.png" },
  { name: "Schools & Education", products: "1,800+", image: "/images/industry-schools.png" },
  { name: "Hospitality", products: "2,100+", image: "/images/industry-hospitality.png" },
  { name: "Healthcare", products: "1,200+", image: "/images/industry-healthcare.png" },
  { name: "Industrial", products: "1,600+", image: "/images/industry-industrial.png" },
  { name: "Food Service", products: "900+", image: "/images/industry-food-service.png" },
];

export default function IndustrySection() {
  return (
    <section className="bg-mjs-gray-50 py-6 border-t border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-mjs-dark">
            Solutions for Every Industry
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {industries.map((ind) => (
            <a
              key={ind.name}
              href="#"
              className="rounded-xl overflow-hidden relative group aspect-[4/3]"
            >
              {/* Background Image */}
              <img
                src={ind.image}
                alt={ind.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-4">
                <h3 className="text-sm font-bold text-white drop-shadow-sm leading-tight mb-1">
                  {ind.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-white/80">
                    {ind.products} products
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-white">
                    Shop Now
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
