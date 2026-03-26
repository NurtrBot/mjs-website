"use client";

const cities = [
  "Aliso Viejo", "Anaheim", "Brea", "Buena Park", "Costa Mesa", "Cypress",
  "Dana Point", "Fountain Valley", "Fullerton", "Garden Grove",
  "Huntington Beach", "Irvine", "La Habra", "La Palma", "Laguna Beach",
  "Laguna Hills", "Laguna Niguel", "Laguna Woods", "Lake Forest",
  "Los Alamitos", "Mission Viejo", "Newport Beach", "Orange", "Placentia",
  "Rancho Santa Margarita", "San Clemente", "San Juan Capistrano",
  "Santa Ana", "Seal Beach", "Stanton", "Tustin", "Villa Park",
  "Westminster", "Yorba Linda",
];

export default function DeliveryZone() {
  return (
    <section className="bg-mjs-dark py-3">
      <div className="max-w-[1400px] mx-auto px-4 flex items-center gap-3 overflow-hidden">
        <span className="text-white text-xs font-bold whitespace-nowrap tracking-wide uppercase flex-shrink-0">
          1–2 Day Delivery
        </span>
        <span className="text-white/20 flex-shrink-0">|</span>
        <div className="overflow-hidden relative">
          <div className="flex items-center gap-1.5 animate-marquee-cities whitespace-nowrap">
            {[...cities, ...cities].map((city, i) => (
              <span key={`${city}-${i}`} className="inline-flex items-center gap-1.5">
                <span className="text-[12px] text-gray-300 font-medium">{city}</span>
                {i < cities.length * 2 - 1 && (
                  <span className="text-white/15 text-[10px]">&bull;</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marqueeCities {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-cities {
          animation: marqueeCities 60s linear infinite;
        }
      `}</style>
    </section>
  );
}
