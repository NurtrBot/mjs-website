import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import Footer from "@/components/Footer";
import { MapPin, Truck, DollarSign, Clock, Phone, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Janitorial Supply Huntington Beach | Wholesale Cleaning Products",
  description:
    "Wholesale janitorial supplies for Huntington Beach businesses. 20 minutes from our Anaheim warehouse to Surf City. Hotels, restaurants, and beach properties get free delivery on $399+ orders.",
  keywords:
    "janitorial supply Huntington Beach, cleaning products HB, wholesale cleaning Huntington Beach CA",
  alternates: { canonical: "https://www.mobilejanitorialsupply.com/locations/huntington-beach" },
  openGraph: {
    title: "Janitorial Supply Huntington Beach | Wholesale Cleaning Products",
    description:
      "Wholesale janitorial supplies for Huntington Beach. 20 min from our warehouse. Free delivery on $399+ orders.",
    url: "https://www.mobilejanitorialsupply.com/locations/huntington-beach",
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
  areaServed: { "@type": "City", name: "Huntington Beach" },
  url: "https://www.mobilejanitorialsupply.com/locations/huntington-beach",
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

export default function HuntingtonBeachPage() {
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
            <span className="inline-block bg-mjs-red/20 text-mjs-red-light text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">Surf City USA</span>
            <h1 className="text-4xl sm:text-5xl font-black mb-4">Janitorial Supply in Huntington Beach</h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Huntington Beach draws millions of visitors a year to its iconic pier, beachfront hotels, and
              Pacific Coast Highway dining strip. Keeping those hospitality properties spotless takes serious
              cleaning power — and we deliver it wholesale from our Anaheim warehouse, just 20 minutes inland.
            </p>
          </div>
        </section>

        {/* Service Area Details */}
        <section className="py-14 bg-white">
          <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl font-black text-mjs-dark mb-3">20 Minutes from Warehouse to Waterfront</h2>
              <p className="text-sm text-mjs-gray-500 leading-relaxed mb-4">
                A quick run west on the 22 freeway connects our Anaheim warehouse to HB&apos;s commercial
                districts. We serve the entire city — from the beachfront hospitality zone and Main Street
                restaurants to the Bella Terra shopping center, Goldenwest business parks, and residential
                neighborhoods in Huntington Harbour.
              </p>
              <p className="text-sm text-mjs-gray-500 leading-relaxed">
                Beach-adjacent properties face unique challenges: sand tracked indoors, salt air corrosion,
                and high guest turnover. Our product specialists can recommend the right floor care chemicals,
                heavy-duty trash liners, and high-capacity paper dispensers built for coastal hospitality.
              </p>
            </div>
            <div className="bg-mjs-gray-50 rounded-2xl p-6">
              <h3 className="font-bold text-mjs-dark mb-4">Huntington Beach Delivery Details</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3"><Truck className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Free delivery</strong> on orders $399+</span></li>
                <li className="flex items-start gap-3"><Clock className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Next business day</strong> delivery standard</span></li>
                <li className="flex items-start gap-3"><MapPin className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>20 minutes</strong> from our Anaheim warehouse</span></li>
                <li className="flex items-start gap-3"><DollarSign className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Wholesale pricing</strong> — no membership required</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* Product Categories */}
        <section className="py-14 bg-mjs-gray-50">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-black text-mjs-dark mb-2 text-center">What We Deliver to Huntington Beach</h2>
            <p className="text-sm text-mjs-gray-500 text-center mb-8">Hospitality-grade and commercial cleaning products, ready next day.</p>
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
            <h2 className="text-2xl font-black text-mjs-dark mb-8 text-center">Why HB Businesses Choose Mobile Janitorial Supply</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { icon: MapPin, title: "20 Min Drive", desc: "Just a quick freeway hop from our Anaheim warehouse to HB." },
                { icon: Truck, title: "Free Delivery", desc: "Orders $399+ delivered free to any Huntington Beach address." },
                { icon: DollarSign, title: "Hospitality Pricing", desc: "Bulk rates that keep hotel and restaurant supply costs low." },
                { icon: Clock, title: "Next-Day Service", desc: "Order today, have products on your loading dock tomorrow." },
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
              { stat: "Next Day", label: "HB Delivery" },
              { stat: "$399", label: "Free Delivery Min." },
              { stat: "20 Min", label: "From Warehouse" },
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
            <h2 className="text-2xl font-black text-mjs-dark mb-3 text-center">Industries We Serve in Huntington Beach</h2>
            <p className="text-sm text-mjs-gray-500 text-center max-w-2xl mx-auto mb-8">
              Surf City&apos;s tourism-driven economy and growing commercial base create steady demand for quality cleaning supplies.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: "Hotels & Vacation Rentals", desc: "Beachfront hotels along PCH, the Hyatt, Hilton Waterfront, and Airbnb properties need high-turnover housekeeping supplies." },
                { title: "Restaurants & Bars", desc: "Main Street eateries, Pacific City dining, and PCH restaurants go through liners, chemicals, and paper at a rapid clip." },
                { title: "Surf & Retail Shops", desc: "Retail stores along Main St. and in Bella Terra need floor care, glass cleaners, and restroom supplies for foot traffic." },
                { title: "Fitness & Wellness", desc: "Gyms, yoga studios, and wellness spas across HB require sanitizers, towels, and dispenser systems." },
                { title: "Office & Industrial Parks", desc: "Business parks along Bolsa Ave. and Edinger Ave. house hundreds of companies needing breakroom and janitorial supplies." },
                { title: "Event & Beach Venues", desc: "Pier-side events, surf competitions, and beach weddings generate cleanup demand for liners, chemicals, and safety gear." },
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
            <h2 className="text-3xl font-black mb-3">Cleaning Supplies for Surf City Businesses</h2>
            <p className="text-sm text-white/80 mb-6">Get a custom quote or call us to set up regular deliveries to Huntington Beach.</p>
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
