import { Truck, ShieldCheck, Headphones, DollarSign, RotateCcw } from "lucide-react";

const props = [
  { icon: Truck, text: "Ships Nationwide" },
  { icon: DollarSign, text: "Wholesale Prices" },
  { icon: ShieldCheck, text: "Quality Guaranteed" },
  { icon: Headphones, text: "Expert Support" },
  { icon: RotateCcw, text: "Easy Returns" },
];

export default function ValueProps() {
  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4 py-3">
        {/* Desktop: all 5 in a row */}
        <div className="hidden md:flex items-center justify-between gap-4">
          {props.map((prop) => (
            <div key={prop.text} className="flex items-center flex-shrink-0">
              <div className="flex items-center gap-2">
                <prop.icon className="w-4 h-4 text-mjs-red flex-shrink-0" />
                <span className="text-xs font-semibold text-mjs-gray-700 whitespace-nowrap">
                  {prop.text}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: 3 props in one centered row */}
        <div className="md:hidden flex items-center justify-center gap-3">
          {[props[0], props[2], props[1]].map((prop) => (
            <div key={prop.text} className="flex items-center gap-1">
              <prop.icon className="w-3.5 h-3.5 text-mjs-red flex-shrink-0" />
              <span className="text-[10.5px] font-semibold text-mjs-gray-700 whitespace-nowrap">
                {prop.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
