"use client";

const promoCards = [
  {
    title: "Paper & Restroom",
    subtitle: "Toilet paper, towels, liners & soap",
    gradient: "from-sky-500 to-blue-600",
    image: "/images/promo-paper-restroom.png",
    href: "/category/paper-products",
  },
  {
    title: "Cleaning Chemicals",
    subtitle: "Degreasers, disinfectants & floor care",
    gradient: "from-emerald-500 to-green-600",
    image: "/images/promo-chemicals.png",
    href: "/category/cleaning-chemicals",
  },
  {
    title: "Gloves & Safety",
    subtitle: "Nitrile, latex, vinyl & PPE supplies",
    gradient: "from-violet-500 to-purple-600",
    image: "/images/promo-gloves-safety.png",
    href: "/category/gloves-safety",
  },
  {
    title: "Equipment & Tools",
    subtitle: "Mops, carts, machines & janitorial gear",
    gradient: "from-amber-500 to-orange-600",
    image: "/images/promo-equipment.png",
    imagePosition: "center 40%",
    href: "/category/equipment",
  },
];

export default function PromoCards() {
  return (
    <section className="bg-mjs-gray-50 py-4">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {promoCards.map((card) => (
            <a
              key={card.title}
              href={card.href}
              className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${card.gradient} p-4 md:p-5 group hover:shadow-lg transition-all min-h-[110px] flex flex-col justify-center items-center`}
            >
              {!card.image && <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full" />}
              {!card.image && <div className="absolute -right-2 -bottom-2 w-14 h-14 bg-white/5 rounded-full" />}

              {card.image && (
                <>
                  <img src={card.image} alt={card.title} className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: card.imagePosition || "center 70%" }} />
                  <div className="absolute inset-0 bg-black/50" />
                </>
              )}

              <div className="relative z-10 text-center flex flex-col items-center justify-center h-full">
                <div className="text-white font-extrabold text-base md:text-lg drop-shadow-lg leading-tight">
                  {card.title}
                </div>
                <div className="text-white/90 text-xs mt-1 leading-snug drop-shadow-md">
                  {card.subtitle}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
