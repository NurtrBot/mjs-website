import Image from "next/image";

/*
 * Six illustrated products standing together inside ONE
 * card on a soft grey gradient. The card is the same width as the industry tab bar above it and
 * sits flush on the bottom edge of the grey hero band, where it meets the
 * white Best Sellers section. Static by design: not clickable, no hover motion, no shadows.
 * Desktop/tablet only (the hero band is white on phones).
 *
 * Artwork: public/images/favorites/{key}-v2.webp (transparent, trimmed to the
 * product's solid base). `h` is each product's height as a share of the
 * tallest one, so the row reads like real products of different sizes.
 */
const SHELF = [
  { key: "fabuloso", name: "Fabuloso Lavender", href: "/product/fabuloso-multi-use-cleaner-lavender-scent-1-gal-bottle-4-carton-cpc53058", w: 437, h: 0.91 },
  { key: "dawn", name: "Dawn Professional", href: "/product/dawn-pro-manual-pot-pan-dish-detergent-38-oz-bottle-8-carton-pgc45112ct", w: 434, h: 0.91 },
  { key: "clorox-bowl", name: "Clorox Bowl Cleaner", href: "/search?q=toilet+bowl+cleaner", w: 343, h: 0.91 },
  // sink 0.16 = cut just above the "CRISP LEMON" line on the canister
  { key: "clorox-wipes", name: "Clorox Disinfecting Wipes", href: "/search?q=clorox+disinfecting+wipes", w: 439, h: 0.99, sink: 0.16 },
  { key: "windex", name: "Windex Glass Cleaner", href: "/search?q=windex", w: 331, h: 0.98 },
];

// Tallest product: scales with the viewport, capped so it never dwarfs the banner above
const TALLEST = "clamp(200px, 24vw, 380px)";
// Every product is sunk this far below the card edge and clipped, so all six end on one
// straight line instead of six different rounded bases. An item can override it (`sink`).
const SINK = 0.1;

export default function ProductShelf() {
  return (
    <div className="hidden md:block pt-3">
      {/* Products stand on the card's bottom edge (no bottom padding) */}
      <div
        className="rounded-t-2xl px-0 pt-4 pb-0 overflow-hidden"
        // Soft neutral gradient: white at the top, settling into a cool light grey floor.
        style={{
          background:
            "radial-gradient(120% 70% at 50% 100%, rgba(23,32,52,0.10) 0%, rgba(23,32,52,0) 65%), " +
            "linear-gradient(172deg, #ffffff 0%, #f3f4f6 45%, #e2e5ea 100%)",
        }}
      >
        {/* space-evenly: every gap, including the two outer edges, is the same width */}
        <ul className="flex items-end justify-evenly list-none m-0 p-0">
          {SHELF.map((item) => (
            <li key={item.key} className="flex-none">
              <div className="block">
                <Image
                  src={`/images/favorites/${item.key}-v2.webp`}
                  alt={item.name}
                  width={item.w}
                  height={800}
                  sizes="(max-width: 1024px) 14vw, 240px"
                  quality={80}
                  style={{
                    height: `calc(${TALLEST} * ${item.h})`,
                    width: `calc(${TALLEST} * ${item.h} * ${(item.w / 800).toFixed(4)})`,
                    maxWidth: "none",
                    marginBottom: `calc(${TALLEST} * ${item.h} * -${"sink" in item ? item.sink : SINK})`,
                  }}
                  className="block"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
