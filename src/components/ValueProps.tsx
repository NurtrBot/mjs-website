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
        <div className="flex items-center justify-between overflow-x-auto scrollbar-hide gap-4">
          {props.map((prop, i) => (
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
      </div>
    </section>
  );
}
