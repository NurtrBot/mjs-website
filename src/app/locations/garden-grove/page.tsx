import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import Footer from "@/components/Footer";
import { MapPin, Truck, DollarSign, Clock, Phone, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Janitorial Supply Garden Grove | Your Neighbor in Anaheim",
  description:
    "Wholesale janitorial supplies for Garden Grove businesses. Just 5 minutes from our Anaheim warehouse. Serving Little Saigon restaurants, shopping centers, and local businesses. Free delivery on $399+.",
  keywords:
    "janitorial supply Garden Grove, cleaning products Garden Grove CA, janitorial distributor Garden Grove",
  alternates: { canonical: "https://www.mobilejanitorialsupply.com/locations/garden-grove" },
  openGraph: {
    title: "Janitorial Supply Garden Grove | Your Neighbor in Anaheim",
    description:
      "Wholesale janitorial supplies for Garden Grove. 5 min from our warehouse. Free delivery on $399+ orders.",
    url: "https://www.mobilejanitorialsupply.com/locations/garden-grove",
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
  areaServed: { "@type": "City", name: "Garden Grove" },
  url: "https://www.mobilejanitorialsupply.com/locations/garden-grove",
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

export default function GardenGrovePage() {
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
            <span className="inline-block bg-mjs-gold/20 text-mjs-gold text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">5 Minutes Away</span>
            <h1 className="text-4xl sm:text-5xl font-black mb-4">Janitorial Supply in Garden Grove</h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Garden Grove is our next-door neighbor — literally five minutes from our Anaheim warehouse.
              Home to the vibrant Little Saigon business district and hundreds of locally owned restaurants,
              shops, and commercial properties, Garden Grove businesses enjoy the fastest deliveries and
              easiest pickup access of any city we serve.
            </p>
          </div>
        </section>

        {/* Service Area Details */}
        <section className="py-14 bg-white">
          <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl font-black text-mjs-dark mb-3">Five Minutes — That&apos;s All It Takes</h2>
              <p className="text-sm text-mjs-gray-500 leading-relaxed mb-4">
                Garden Grove wraps around Anaheim&apos;s western and southern borders. Our warehouse on La Palma
                Ave. is so close that many Garden Grove business owners simply drive over to pick up supplies
                during their lunch break. For those who prefer delivery, orders placed by early afternoon
                typically arrive the very next morning.
              </p>
              <p className="text-sm text-mjs-gray-500 leading-relaxed">
                The Little Saigon corridor along Bolsa Avenue and Brookhurst Street is one of the most
                concentrated dining and retail districts in Orange County. Hundreds of restaurants, bakeries,
                and grocery markets need a constant flow of cleaning chemicals, paper towels, trash liners,
                and food-service supplies — and we are right around the corner.
              </p>
            </div>
            <div className="bg-mjs-gray-50 rounded-2xl p-6">
              <h3 className="font-bold text-mjs-dark mb-4">Garden Grove Delivery Details</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3"><Truck className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Free delivery</strong> on orders $399+</span></li>
                <li className="flex items-start gap-3"><Clock className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Next business day</strong> delivery — lightning fast from 5 min away</span></li>
                <li className="flex items-start gap-3"><MapPin className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>5 minutes</strong> from our Anaheim warehouse</span></li>
                <li className="flex items-start gap-3"><DollarSign className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Wholesale pricing</strong> — perfect for high-volume restaurants</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* Product Categories */}
        <section className="py-14 bg-mjs-gray-50">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-black text-mjs-dark mb-2 text-center">What We Deliver to Garden Grove</h2>
            <p className="text-sm text-mjs-gray-500 text-center mb-8">Restaurant-ready, office-ready, and everything in between.</p>
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
            <h2 className="text-2xl font-black text-mjs-dark mb-8 text-center">Why Garden Grove Businesses Choose MJS</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { icon: MapPin, title: "Next-Door Neighbor", desc: "Our warehouse is literally 5 minutes from Garden Grove's busiest corridors." },
                { icon: Truck, title: "Free Delivery", desc: "Orders $399+ delivered free — or just drive over and pick up." },
                { icon: DollarSign, title: "Restaurant Pricing", desc: "Bulk case pricing built for the hundreds of restaurants in Little Saigon." },
                { icon: Clock, title: "Fastest Restock", desc: "Closest wholesale janitorial supplier to Garden Grove — period." },
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
              { stat: "Next Day", label: "GG Delivery" },
              { stat: "$399", label: "Free Delivery Min." },
              { stat: "5 Min", label: "From Warehouse" },
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
            <h2 className="text-2xl font-black text-mjs-dark mb-3 text-center">Industries We Serve in Garden Grove</h2>
            <p className="text-sm text-mjs-gray-500 text-center max-w-2xl mx-auto mb-8">
              Garden Grove&apos;s diverse, entrepreneurial business community needs a supplier that understands high-volume, cost-conscious operations.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: "Restaurants & Bakeries", desc: "Little Saigon's dense concentration of pho shops, banh mi cafes, and bakeries consume massive quantities of paper, liners, and chemicals." },
                { title: "Grocery & Specialty Markets", desc: "Asian supermarkets and specialty grocers along Bolsa Ave. need floor care products, sanitizers, and packaging supplies." },
                { title: "Nail & Beauty Salons", desc: "Garden Grove has hundreds of salons requiring sanitizers, paper towels, trash liners, and ventilation-safe cleaning products." },
                { title: "Property Management", desc: "Dense residential neighborhoods and apartment communities rely on affordable bulk supplies for common-area maintenance." },
                { title: "Dental & Medical", desc: "Clinics and dental offices throughout the city use our medical-grade gloves, disinfectants, and disposable supplies." },
                { title: "Shopping Centers", desc: "Asian Garden Mall, Phước Lộc Thọ, and strip malls along Brookhurst need restroom and floor care supplies for heavy foot traffic." },
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
            <h2 className="text-3xl font-black mb-3">Your Neighborhood Wholesale Supplier</h2>
            <p className="text-sm text-white/80 mb-6">Request a quote or stop by our warehouse — we are just five minutes away.</p>
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
