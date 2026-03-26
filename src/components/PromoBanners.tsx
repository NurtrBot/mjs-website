import { ArrowRight, Percent, Users, Clock } from "lucide-react";

export default function PromoBanners() {
  return (
    <section className="bg-mjs-gray-50 py-12 md:py-16">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          {/* Banner 1 - Bulk Savings */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-mjs-dark to-mjs-charcoal p-6 md:p-8 group cursor-pointer">
            <div className="absolute top-0 right-0 w-32 h-32 bg-mjs-red/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <div className="w-10 h-10 bg-mjs-red/20 rounded-xl flex items-center justify-center mb-4">
                <Percent className="w-5 h-5 text-mjs-red-light" />
              </div>
              <h3 className="text-xl font-extrabold text-white mb-2">
                Bulk Order Savings
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Save up to 30% when you buy in bulk. The more you order, the
                more you save.
              </p>
              <span className="inline-flex items-center gap-1.5 text-mjs-red-light font-semibold text-sm group-hover:gap-3 transition-all">
                Learn More <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Banner 2 - Business Account */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 to-blue-800 p-6 md:p-8 group cursor-pointer">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-5 h-5 text-blue-300" />
              </div>
              <h3 className="text-xl font-extrabold text-white mb-2">
                Open a Business Account
              </h3>
              <p className="text-blue-200/70 text-sm leading-relaxed mb-4">
                Get exclusive pricing, dedicated support, and net-30 terms for
                qualified businesses.
              </p>
              <span className="inline-flex items-center gap-1.5 text-blue-300 font-semibold text-sm group-hover:gap-3 transition-all">
                Apply Now <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Banner 3 - Weekly Deals */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-700 to-orange-700 p-6 md:p-8 group cursor-pointer">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-5 h-5 text-yellow-300" />
              </div>
              <h3 className="text-xl font-extrabold text-white mb-2">
                Weekly Deals
              </h3>
              <p className="text-amber-100/70 text-sm leading-relaxed mb-4">
                New deals every week on top-selling products. Don&apos;t miss out on
                limited-time offers.
              </p>
              <span className="inline-flex items-center gap-1.5 text-yellow-300 font-semibold text-sm group-hover:gap-3 transition-all">
                See This Week&apos;s Deals <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
