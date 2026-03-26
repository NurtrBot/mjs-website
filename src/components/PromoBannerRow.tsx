import { ArrowRight, Percent, Users, Truck } from "lucide-react";

export default function PromoBannerRow() {
  return (
    <section className="bg-mjs-gray-50 py-4">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Bulk Savings */}
          <a
            href="#"
            className="relative overflow-hidden rounded-xl bg-gradient-to-r from-mjs-dark to-mjs-charcoal p-5 flex items-center gap-4 group hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 bg-mjs-red/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Percent className="w-6 h-6 text-mjs-red-light" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-white">Bulk Order Savings</div>
              <div className="text-xs text-gray-400 mt-0.5">
                Save up to 30% on volume orders
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0" />
          </a>

          {/* Business Account */}
          <a
            href="#"
            className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-900 to-blue-800 p-5 flex items-center gap-4 group hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-blue-300" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-white">Business Accounts</div>
              <div className="text-xs text-blue-200/70 mt-0.5">
                Exclusive pricing &amp; net-30 terms
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-blue-400 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0" />
          </a>

          {/* Track Order */}
          <a
            href="#"
            className="relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-700 p-5 flex items-center gap-4 group hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Truck className="w-6 h-6 text-emerald-300" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-white">Track Your Order</div>
              <div className="text-xs text-emerald-200/70 mt-0.5">
                Real-time delivery updates
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0" />
          </a>
        </div>
      </div>
    </section>
  );
}
