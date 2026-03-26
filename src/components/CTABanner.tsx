import { ArrowRight, Phone } from "lucide-react";

export default function CTABanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-mjs-red via-mjs-red-dark to-mjs-red">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-16 relative">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Ready to Save on Supplies?
            </h2>
            <p className="text-red-100 mt-2 text-sm md:text-base max-w-lg">
              Open a free business account today and get exclusive pricing,
              dedicated support, and free local delivery.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/auth"
              className="inline-flex items-center gap-2 bg-white text-mjs-red font-bold px-6 py-3 rounded-lg hover:bg-gray-50 transition-all shadow-lg shadow-red-900/30 text-sm"
            >
              Create Free Account
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="tel:7147792640"
              className="inline-flex items-center gap-2 bg-mjs-gold text-mjs-dark font-bold px-6 py-3 rounded-lg hover:brightness-110 transition-all text-sm"
            >
              <Phone className="w-4 h-4" />
              (714) 779-2640
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
