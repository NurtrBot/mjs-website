"use client";

const industries = [
  { name: "Commercial Offices", image: "/images/industry-commercial-offices.png" },
  { name: "Schools & Education", image: "/images/industry-schools.png" },
  { name: "Hospitality", image: "/images/industry-hospitality.png" },
  { name: "Healthcare", image: "/images/industry-healthcare.png" },
  { name: "Industrial", image: "/images/industry-industrial.png" },
  { name: "Food Service", image: "/images/industry-food-service.png" },
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
            <div
              key={ind.name}
              className="rounded-xl overflow-hidden relative aspect-[4/3]"
            >
              <img
                src={ind.image}
                alt={ind.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-sm font-extrabold text-white drop-shadow-lg text-center px-2">
                  {ind.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
