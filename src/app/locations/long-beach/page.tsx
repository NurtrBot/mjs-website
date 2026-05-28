import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import Footer from "@/components/Footer";
import { MapPin, Truck, DollarSign, Clock, Phone, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Janitorial Supply Long Beach | Wholesale Cleaning Products Delivered",
  description:
    "Wholesale janitorial supplies for Long Beach businesses. 25 minutes from our Anaheim warehouse. Serving the port district, downtown, and all LB neighborhoods. Free delivery on $399+.",
  keywords:
    "janitorial supply Long Beach, cleaning products Long Beach CA, wholesale cleaning Long Beach",
  alternates: { canonical: "https://www.mobilejanitorialsupply.com/locations/long-beach" },
  openGraph: {
    title: "Janitorial Supply Long Beach | Wholesale Cleaning Products Delivered",
    description:
      "Wholesale janitorial supplies for Long Beach. 25 min from our warehouse. Free delivery on $399+ orders.",
    url: "https://www.mobilejanitorialsupply.com/locations/long-beach",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Mobile Janitorial Supply",
  address: {
    "@type": "PostalAddress",
    streetAddress: "3066 E. La Palma Ave.",
    addressLocality: "Anaheim",
    addressRegion: "CA",
    postalCode: "92806",
  },
  telephone: "+1-714-779-2640",
  areaServed: { "@type": "City", name: "Long Beach" },
  url: "https://www.mobilejanitorialsupply.com/locations/long-beach",
};

const categories = [
  { name: "Paper Products", href: "/category/paper-products" },
  { name: "Cleaning Chemicals", href: "/category/cleaning-chemicals" },
  { name: "Trash Liners", href: "/category/trash-liners" },
  { name: "Gloves & Safety", href: "/category/gloves-safety" },
  { name: "Packaging & Film", href: "/category/packaging-film" },
  { name: "Breakroom Supplies", href: "/category/breakroom" },
  { name: "Equipment & Tools", href: "/category/equipment" },
  { name: "Floor Care", href: "/category/floor-care" },
  { name: "Car Detailing", href: "/category/car-detailing" },
];

export default function LongBeachPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TopBar />
      <Header />
      <CategoryNav />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-mjs-dark via-mjs-charcoal to-mjs-dark py-20 text-center text-white">
          <div className="max-w-4xl mx-auto px-4">
            <span className="inline-block bg-mjs-red/20 text-mjs-red-light text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">Port City</span>
            <h1 className="text-4xl sm:text-5xl font-black mb-4">Janitorial Supply in Long Beach</h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Long Beach sits at the crossroads of Orange County and Los Angeles — a major port city with a
              thriving downtown, convention district, and one of the busiest harbors on Earth. Our Anaheim
              warehouse is just 25 minutes east on the 22/405, delivering over 10,000 wholesale cleaning
              products with free shipping on orders $399+.
            </p>
          </div>
        </section>

        {/* Service Area Details */}
        <section className="py-14 bg-white">
          <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl font-black text-mjs-dark mb-3">25 Minutes to Long Beach&apos;s Business Districts</h2>
              <p className="text-sm text-mjs-gray-500 leading-relaxed mb-4">
                From our Anaheim warehouse, we reach downtown Long Beach in about 25 minutes via the 22 west
                to the 405 south. We deliver to the entire city — the port-adjacent industrial zone, the
                revitalized East Village Arts District, Belmont Shore, Bixby Knolls, and the North Long Beach
                commercial corridor along Atlantic Avenue.
              </p>
              <p className="text-sm text-mjs-gray-500 leading-relaxed">
                Long Beach straddles the LA/OC county line, and many of our customers here appreciate having a
                nearby Orange County distributor as an alternative to the crowded LA supply chain. We offer the
                same $399 minimum as our OC deliveries because Long Beach falls within our standard delivery radius.
              </p>
            </div>
            <div className="bg-mjs-gray-50 rounded-2xl p-6">
              <h3 className="font-bold text-mjs-dark mb-4">Long Beach Delivery Details</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3"><Truck className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Free delivery</strong> on orders $399+</span></li>
                <li className="flex items-start gap-3"><Clock className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>1–2 business day</strong> delivery to Long Beach</span></li>
                <li className="flex items-start gap-3"><MapPin className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>25 minutes</strong> from our Anaheim warehouse</span></li>
                <li className="flex items-start gap-3"><DollarSign className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Wholesale pricing</strong> — same rates as OC customers</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* Product Categories */}
        <section className="py-14 bg-mjs-gray-50">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-black text-mjs-dark mb-2 text-center">What We Deliver to Long Beach</h2>
            <p className="text-sm text-mjs-gray-500 text-center mb-8">Industrial, commercial, and hospitality products — all from one warehouse.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categories.map((c) => (
                <a key={c.name} href={c.href} className="bg-white border border-gray-200 rounded-xl px-5 py-4 text-sm font-bold text-mjs-dark hover:border-mjs-red hover:text-mjs-red transition-all text-center">
                  {c.name}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Why MJS */}
        <section className="py-14 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-black text-mjs-dark mb-8 text-center">Why Long Beach Businesses Choose MJS</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { icon: MapPin, title: "25 Min Away", desc: "Closer than most LA distributors — with easier freeway access and less traffic." },
                { icon: Truck, title: "Free LB Delivery", desc: "Every order $399+ delivered free to any Long Beach address." },
                { icon: DollarSign, title: "Port-Town Pricing", desc: "Industrial-volume pricing for port facilities and downtown high-rises alike." },
                { icon: Clock, title: "1–2 Day Delivery", desc: "Regular Long Beach routes mean consistent, reliable restocking." },
              ].map((v) => (
                <div key={v.title} className="bg-mjs-gray-50 rounded-xl p-5 text-center">
                  <v.icon className="w-8 h-8 text-mjs-red mx-auto mb-3" />
                  <h3 className="font-bold text-mjs-dark text-sm mb-1">{v.title}</h3>
                  <p className="text-xs text-mjs-gray-500">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="py-12 bg-mjs-dark text-white">
          <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { stat: "10,000+", label: "Products" },
              { stat: "1–2 Days", label: "LB Delivery" },
              { stat: "$399", label: "Free Delivery Min." },
              { stat: "25 Min", label: "From Warehouse" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-black text-mjs-gold">{s.stat}</div>
                <div className="text-xs text-gray-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Industries */}
        <section className="py-14 bg-mjs-gray-50">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-black text-mjs-dark mb-3 text-center">Industries We Serve in Long Beach</h2>
            <p className="text-sm text-mjs-gray-500 text-center max-w-2xl mx-auto mb-8">
              Long Beach&apos;s port-driven economy, convention trade, and growing downtown create cleaning supply demands at every scale.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: "Port & Logistics", desc: "The Port of Long Beach is the second-busiest in the U.S. — terminal operators and logistics firms need industrial-grade cleaning supplies." },
                { title: "Hotels & Convention Center", desc: "The Long Beach Convention Center and surrounding hotels need high-volume housekeeping supplies year-round." },
                { title: "Restaurants & Nightlife", desc: "2nd Street in Belmont Shore, Pine Ave. downtown, and Retro Row restaurants burn through chemicals, liners, and paper goods daily." },
                { title: "Higher Education", desc: "Cal State Long Beach and Long Beach City College maintain sprawling campuses requiring bulk floor care, paper, and restroom products." },
                { title: "Healthcare", desc: "Long Beach Memorial, VA Medical Center, and clinics citywide rely on medical-grade gloves, disinfectants, and PPE." },
                { title: "Property Management", desc: "Downtown condos, Bixby Knolls apartments, and commercial landlords depend on us for affordable recurring supply orders." },
              ].map((ind) => (
                <div key={ind.title} className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="font-bold text-mjs-dark text-sm mb-1">{ind.title}</h3>
                  <p className="text-xs text-mjs-gray-500">{ind.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-mjs-red to-mjs-red-dark py-14 text-center text-white">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-black mb-3">Wholesale Cleaning Products for Long Beach</h2>
            <p className="text-sm text-white/80 mb-6">Get a quote for your Long Beach business or call to start your first order.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/quote" className="inline-flex items-center justify-center gap-2 bg-white text-mjs-red font-bold px-8 py-3 rounded-xl text-sm hover:bg-gray-100 transition-colors">
                Request a Quote <ArrowRight className="w-4 h-4" />
              </a>
              <a href="tel:+17147792640" className="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-bold px-8 py-3 rounded-xl text-sm hover:bg-white/10 transition-colors">
                <Phone className="w-4 h-4" /> (714) 779-2640
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
