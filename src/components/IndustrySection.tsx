"use client";

const industries = [
  { name: "Commercial Offices", image: "/images/industry-commercial-offices.jpg", href: "/industries/offices" },
  { name: "Schools & Education", image: "/images/industry-schools.jpg", href: "/industries/schools" },
  { name: "Hospitality", image: "/images/industry-hospitality.jpg", href: "/industries/property-management" },
  { name: "Healthcare", image: "/images/industry-healthcare.jpg", href: "/industries/healthcare" },
  { name: "Industrial", image: "/images/industry-industrial.jpg", href: "/industries/warehouses" },
  { name: "Food Service", image: "/images/industry-food-service.jpg", href: "/industries/restaurants" },
];

export default function IndustrySection() {
  return (
    <section className="hidden md:block bg-mjs-gray-50 py-6 border-t border-gray-100">
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
              href={ind.href}
              className="rounded-xl overflow-hidden relative aspect-[4/3] block group"
            >
              <img
                src={ind.image}
                alt={ind.name}
                loading="lazy"
                decoding="async"
                width={800}
                height={533}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-sm font-extrabold text-white drop-shadow-lg text-center px-2 group-hover:underline">
                  {ind.name}
                </h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
