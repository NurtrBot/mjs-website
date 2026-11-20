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
    // Mobile only: on tablet/desktop the pre-footer bar carries these promises
    <section className="bg-white md:hidden">
      <div className="max-w-[1400px] mx-auto px-4 py-3">
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
