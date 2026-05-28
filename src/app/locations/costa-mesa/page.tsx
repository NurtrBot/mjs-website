import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import Footer from "@/components/Footer";
import { MapPin, Truck, DollarSign, Clock, Phone, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Janitorial Supply Costa Mesa | Wholesale Pricing + Free Delivery",
  description:
    "Wholesale janitorial supplies for Costa Mesa businesses. 15 minutes from our Anaheim warehouse to South Coast Plaza, The Lab, and the OC performing arts district. Free delivery on $399+.",
  keywords:
    "janitorial supply Costa Mesa, cleaning products Costa Mesa CA, wholesale cleaning Costa Mesa",
  alternates: { canonical: "https://www.mobilejanitorialsupply.com/locations/costa-mesa" },
  openGraph: {
    title: "Janitorial Supply Costa Mesa | Wholesale Pricing + Free Delivery",
    description:
      "Wholesale janitorial supplies for Costa Mesa. 15 min from our warehouse. Free delivery on $399+ orders.",
    url: "https://www.mobilejanitorialsupply.com/locations/costa-mesa",
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
  areaServed: { "@type": "City", name: "Costa Mesa" },
  url: "https://www.mobilejanitorialsupply.com/locations/costa-mesa",
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

export default function CostaMesaPage() {
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
            <span className="inline-block bg-mjs-red/20 text-mjs-red-light text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">City of the Arts</span>
            <h1 className="text-4xl sm:text-5xl font-black mb-4">Janitorial Supply in Costa Mesa</h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Costa Mesa packs world-class retail, performing arts, and a booming restaurant scene into a
              compact, high-energy city. South Coast Plaza alone draws over 22 million visitors annually.
              We keep Costa Mesa businesses spotless with wholesale cleaning products delivered free from
              our Anaheim warehouse — just 15 minutes up the 55 freeway.
            </p>
          </div>
        </section>

        {/* Service Area Details */}
        <section className="py-14 bg-white">
          <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl font-black text-mjs-dark mb-3">15 Minutes to Costa Mesa&apos;s Commercial Core</h2>
              <p className="text-sm text-mjs-gray-500 leading-relaxed mb-4">
                Hop on the 55 south from our Anaheim warehouse and you hit Costa Mesa in about 15 minutes.
                We regularly deliver to the South Coast Plaza area, the SoBeCa arts district, 17th Street
                dining corridor, and the industrial pocket along Harbor Boulevard near the 405.
              </p>
              <p className="text-sm text-mjs-gray-500 leading-relaxed">
                Costa Mesa&apos;s mix of luxury retail, performing arts venues like the Segerstrom Center, and a
                dense restaurant scene means properties here often need premium restroom products, high-capacity
                dispensers, and quality cleaning chemicals that match the upscale customer experience.
              </p>
            </div>
            <div className="bg-mjs-gray-50 rounded-2xl p-6">
              <h3 className="font-bold text-mjs-dark mb-4">Costa Mesa Delivery Details</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3"><Truck className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Free delivery</strong> on orders $399+</span></li>
                <li className="flex items-start gap-3"><Clock className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Next business day</strong> delivery standard</span></li>
                <li className="flex items-start gap-3"><MapPin className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>15 minutes</strong> from our Anaheim warehouse</span></li>
                <li className="flex items-start gap-3"><DollarSign className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Wholesale pricing</strong> — no annual contracts</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* Product Categories */}
        <section className="py-14 bg-mjs-gray-50">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-black text-mjs-dark mb-2 text-center">What We Deliver to Costa Mesa</h2>
            <p className="text-sm text-mjs-gray-500 text-center mb-8">Premium and commercial-grade products for retail, dining, and office spaces.</p>
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
            <h2 className="text-2xl font-black text-mjs-dark mb-8 text-center">Why Costa Mesa Businesses Choose MJS</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { icon: MapPin, title: "15 Min Away", desc: "Quick access from our Anaheim warehouse via the 55 freeway." },
                { icon: Truck, title: "Free Delivery", desc: "Orders $399+ delivered at no charge to any Costa Mesa address." },
                { icon: DollarSign, title: "Wholesale Savings", desc: "Upscale product quality at distributor-direct wholesale prices." },
                { icon: Clock, title: "Next-Day Restock", desc: "Never run low — order today, receive products tomorrow morning." },
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
              { stat: "Next Day", label: "CM Delivery" },
              { stat: "$399", label: "Free Delivery Min." },
              { stat: "15 Min", label: "From Warehouse" },
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
            <h2 className="text-2xl font-black text-mjs-dark mb-3 text-center">Industries We Serve in Costa Mesa</h2>
            <p className="text-sm text-mjs-gray-500 text-center max-w-2xl mx-auto mb-8">
              Costa Mesa&apos;s arts, retail, and culinary scenes demand cleaning supplies that match a premium standard.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: "Luxury Retail", desc: "South Coast Plaza's 250+ stores and The Camp/Lab anti-malls need floor care, glass cleaners, and high-end restroom products." },
                { title: "Performing Arts Venues", desc: "The Segerstrom Center for the Arts and South Coast Repertory maintain immaculate facilities with our chemicals and paper." },
                { title: "Restaurants & Dining", desc: "17th Street and Triangle Square restaurants burn through liners, chemicals, and paper goods — we keep them stocked." },
                { title: "Hotels & Hospitality", desc: "Hotels near South Coast Plaza and the 405 corridor need housekeeping supplies at wholesale pricing." },
                { title: "Creative Studios", desc: "Design firms, photography studios, and galleries in the SoBeCa district maintain clean creative spaces with our products." },
                { title: "Commercial Offices", desc: "Office buildings along Bristol Street and the 55 corridor rely on our breakroom and restroom supply deliveries." },
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
            <h2 className="text-3xl font-black mb-3">Premium Cleaning Supplies at Wholesale Prices</h2>
            <p className="text-sm text-white/80 mb-6">Get a custom quote for your Costa Mesa property or call to place an order today.</p>
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
