import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import Footer from "@/components/Footer";
import { MapPin, Truck, DollarSign, Clock, Phone, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Janitorial Supply San Diego | Wholesale Cleaning Products Delivered",
  description:
    "Wholesale janitorial supplies delivered to San Diego County. 10,000+ cleaning products at distributor-direct prices. Free delivery on orders $699+ from our Anaheim warehouse.",
  keywords:
    "janitorial supply San Diego, cleaning products SD, wholesale cleaning supplies San Diego, janitorial delivery San Diego",
  alternates: { canonical: "https://www.mobilejanitorialsupply.com/locations/san-diego" },
  openGraph: {
    title: "Janitorial Supply San Diego | Wholesale Cleaning Products Delivered",
    description:
      "Wholesale janitorial supplies delivered to San Diego County. 10,000+ products, free delivery on $699+ orders.",
    url: "https://www.mobilejanitorialsupply.com/locations/san-diego",
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
  areaServed: { "@type": "AdministrativeArea", name: "San Diego County, CA" },
  url: "https://www.mobilejanitorialsupply.com/locations/san-diego",
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

export default function SanDiegoPage() {
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
            <span className="inline-block bg-mjs-red/20 text-mjs-red-light text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">San Diego County</span>
            <h1 className="text-4xl sm:text-5xl font-black mb-4">Janitorial Supply in San Diego</h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              From the Gaslamp Quarter to Oceanside, we deliver wholesale cleaning products across San Diego County.
              Our Anaheim warehouse is roughly 90 minutes up the I-5, stocking over 10,000 products at prices
              that undercut local retail — with free delivery on orders $699 and above.
            </p>
          </div>
        </section>

        {/* Service Area Details */}
        <section className="py-14 bg-white">
          <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl font-black text-mjs-dark mb-3">SoCal Pricing, Delivered to San Diego</h2>
              <p className="text-sm text-mjs-gray-500 leading-relaxed mb-4">
                San Diego businesses often pay a premium because distributors treat the market as a secondary route.
                We treat it as a priority. Weekly delivery runs cover the entire county — from Carlsbad and Escondido
                in the north to Chula Vista and National City in the south, plus east to El Cajon and Santee.
              </p>
              <p className="text-sm text-mjs-gray-500 leading-relaxed">
                The $699 minimum for San Diego deliveries reflects the added distance, but it still comes with free
                shipping and the same wholesale pricing our Orange County customers enjoy. Many SD customers consolidate
                orders biweekly to maximize value.
              </p>
            </div>
            <div className="bg-mjs-gray-50 rounded-2xl p-6">
              <h3 className="font-bold text-mjs-dark mb-4">San Diego Delivery Details</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3"><Truck className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Free delivery</strong> on orders $699+</span></li>
                <li className="flex items-start gap-3"><Clock className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>2–3 business day</strong> delivery to SD County</span></li>
                <li className="flex items-start gap-3"><MapPin className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>~90 minutes</strong> from our Anaheim warehouse</span></li>
                <li className="flex items-start gap-3"><DollarSign className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Same wholesale prices</strong> as our OC customers</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* Product Categories */}
        <section className="py-14 bg-mjs-gray-50">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-black text-mjs-dark mb-2 text-center">What We Deliver to San Diego</h2>
            <p className="text-sm text-mjs-gray-500 text-center mb-8">Full catalog available — consolidate your order to hit the $699 minimum easily.</p>
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
            <h2 className="text-2xl font-black text-mjs-dark mb-8 text-center">Why San Diego Businesses Choose MJS</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { icon: MapPin, title: "SoCal Based", desc: "90 min away — not shipping from a Midwest warehouse with week-long lead times." },
                { icon: Truck, title: "Free SD Delivery", desc: "Orders $699+ delivered free to any San Diego County address." },
                { icon: DollarSign, title: "Distributor Pricing", desc: "Same wholesale rates our local OC customers pay. No markups for distance." },
                { icon: Clock, title: "Reliable Schedule", desc: "Consistent weekly routes so you can plan your inventory confidently." },
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
              { stat: "2–3 Days", label: "SD Delivery" },
              { stat: "$699", label: "Free Delivery Min." },
              { stat: "90 Min", label: "From Warehouse" },
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
            <h2 className="text-2xl font-black text-mjs-dark mb-3 text-center">Industries We Serve in San Diego</h2>
            <p className="text-sm text-mjs-gray-500 text-center max-w-2xl mx-auto mb-8">
              San Diego&apos;s unique mix of defense, biotech, and hospitality creates specialized cleaning needs we&apos;re equipped to fill.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: "Military & Defense", desc: "Contractors near Marine Corps Base Camp Pendleton, Naval Base San Diego, and MCAS Miramar keep facilities inspection-ready." },
                { title: "Biotech & Pharma", desc: "Torrey Pines and Sorrento Valley labs need specialty gloves, disinfectants, and contamination-control supplies." },
                { title: "Hotels & Tourism", desc: "Hotel Circle, the Gaslamp, and beachfront resorts in Coronado and La Jolla rely on consistent hospitality-grade supplies." },
                { title: "Restaurants & Breweries", desc: "San Diego's 150+ craft breweries and thousands of restaurants need liners, chemicals, and paper in volume." },
                { title: "Property Management", desc: "Large complexes in Mission Valley, Hillcrest, and North Park depend on affordable bulk janitorial products." },
                { title: "Universities & Research", desc: "UC San Diego, San Diego State, and dozens of research institutes require reliable supply chains for facility maintenance." },
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
            <h2 className="text-3xl font-black mb-3">Wholesale Cleaning Supplies for San Diego</h2>
            <p className="text-sm text-white/80 mb-6">Get a custom quote or call us to set up recurring deliveries to your SD location.</p>
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
