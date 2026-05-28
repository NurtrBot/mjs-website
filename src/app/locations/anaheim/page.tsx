import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import Footer from "@/components/Footer";
import { MapPin, Truck, DollarSign, Clock, Phone, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Janitorial Supply Anaheim | Visit Our Warehouse or Get Free Delivery",
  description:
    "Anaheim's local janitorial supply warehouse. Walk in for same-day pickup or get free delivery on $399+ orders. 10,000+ cleaning products at wholesale prices — right on La Palma Ave.",
  keywords:
    "janitorial supply Anaheim, cleaning products Anaheim CA, janitorial distributor Anaheim, cleaning supply store Anaheim",
  alternates: { canonical: "https://www.mobilejanitorialsupply.com/locations/anaheim" },
  openGraph: {
    title: "Janitorial Supply Anaheim | Visit Our Warehouse or Get Free Delivery",
    description:
      "Anaheim's local janitorial supply warehouse. Walk in for same-day pickup or get free delivery on $399+ orders.",
    url: "https://www.mobilejanitorialsupply.com/locations/anaheim",
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
  areaServed: { "@type": "City", name: "Anaheim" },
  url: "https://www.mobilejanitorialsupply.com/locations/anaheim",
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

export default function AnaheimPage() {
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
            <span className="inline-block bg-mjs-gold/20 text-mjs-gold text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">Our Home City</span>
            <h1 className="text-4xl sm:text-5xl font-black mb-4">Janitorial Supply in Anaheim</h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              This is where it all happens. Our warehouse at 3066 E. La Palma Ave. is open for walk-in
              purchases and same-day pickup, making us the only janitorial supplier in Anaheim where you
              can browse 10,000+ products in person and drive away with your order the same day.
            </p>
          </div>
        </section>

        {/* Service Area Details */}
        <section className="py-14 bg-white">
          <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl font-black text-mjs-dark mb-3">Walk In, Pick Up, or Get It Delivered</h2>
              <p className="text-sm text-mjs-gray-500 leading-relaxed mb-4">
                Located right off the 57 freeway near the intersection of La Palma and Kraemer, our
                warehouse is easy to reach from anywhere in Anaheim. Whether you manage a hotel on Harbor
                Boulevard near the Disneyland Resort, run a restaurant in the Anaheim Packing District, or
                maintain a building in the Platinum Triangle, we are minutes away.
              </p>
              <p className="text-sm text-mjs-gray-500 leading-relaxed">
                Prefer delivery? Anaheim orders on $399+ ship free and typically arrive the next business
                day — because the truck is literally driving across town. The Anaheim Convention Center,
                Angel Stadium, and Honda Center are all within a 10-minute radius of our door.
              </p>
            </div>
            <div className="bg-mjs-gray-50 rounded-2xl p-6">
              <h3 className="font-bold text-mjs-dark mb-4">Anaheim Service Options</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3"><MapPin className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Walk-in warehouse</strong> — browse and buy in person</span></li>
                <li className="flex items-start gap-3"><Clock className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Same-day pickup</strong> — order online, grab it today</span></li>
                <li className="flex items-start gap-3"><Truck className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Free delivery</strong> on orders $399+ (next business day)</span></li>
                <li className="flex items-start gap-3"><DollarSign className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Wholesale pricing</strong> — no membership or fees</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* Product Categories */}
        <section className="py-14 bg-mjs-gray-50">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-black text-mjs-dark mb-2 text-center">What We Stock in Anaheim</h2>
            <p className="text-sm text-mjs-gray-500 text-center mb-8">Every product below is in stock and ready for pickup or delivery.</p>
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
            <h2 className="text-2xl font-black text-mjs-dark mb-8 text-center">Why Anaheim Businesses Come to Us First</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { icon: MapPin, title: "Right Here in Town", desc: "3066 E. La Palma Ave. — no shipping delays, no freight surcharges." },
                { icon: Truck, title: "Same-Day Pickup", desc: "Order online and pick it up at our warehouse within hours." },
                { icon: DollarSign, title: "True Wholesale", desc: "Distributor-direct prices without a Costco-style membership." },
                { icon: Clock, title: "Next-Day Delivery", desc: "Free delivery on $399+ — your order arrives the next business day." },
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
              { stat: "10,000+", label: "Products In Stock" },
              { stat: "Same Day", label: "Pickup Available" },
              { stat: "$399", label: "Free Delivery Min." },
              { stat: "0 Miles", label: "From Our Warehouse" },
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
            <h2 className="text-2xl font-black text-mjs-dark mb-3 text-center">Who We Serve in Anaheim</h2>
            <p className="text-sm text-mjs-gray-500 text-center max-w-2xl mx-auto mb-8">
              Anaheim&apos;s economy revolves around tourism, conventions, and a thriving local business scene — and we supply them all.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: "Disneyland Resort Hotels", desc: "Dozens of hotels along Harbor Blvd and Katella Ave need high-volume paper, liners, and housekeeping chemicals." },
                { title: "Convention Center Events", desc: "The Anaheim Convention Center hosts millions of visitors — event cleanups require fast, bulk supply runs." },
                { title: "Restaurants & Food Halls", desc: "Anaheim Packing District, Center Street, and hundreds of dining spots rely on us for daily essentials." },
                { title: "Sports & Entertainment", desc: "Angel Stadium and Honda Center — plus the bars and restaurants around them — keep our delivery trucks busy." },
                { title: "Platinum Triangle Offices", desc: "Anaheim's growing urban core of high-rise offices and mixed-use buildings needs professional cleaning supplies." },
                { title: "Automotive & Industrial", desc: "Auto shops and light manufacturing along La Palma and Ball Rd use our degreasers, gloves, and towels." },
              ].map((ind) => (
                <div key={ind.title} className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="font-bold text-mjs-dark text-sm mb-1">{ind.title}</h3>
                  <p className="text-xs text-mjs-gray-500">{ind.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Map / Directions CTA */}
        <section className="py-12 bg-white">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-black text-mjs-dark mb-2">Visit Our Anaheim Warehouse</h2>
            <p className="text-sm text-mjs-gray-500 mb-4">3066 E. La Palma Ave., Anaheim, CA 92806 — Open Mon–Fri</p>
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=3066+E+La+Palma+Ave+Anaheim+CA+92806"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-mjs-dark text-white font-bold px-6 py-3 rounded-xl text-sm hover:bg-mjs-charcoal transition-colors"
            >
              <MapPin className="w-4 h-4" /> Get Directions
            </a>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-mjs-red to-mjs-red-dark py-14 text-center text-white">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-black mb-3">Your Anaheim Cleaning Supply Headquarters</h2>
            <p className="text-sm text-white/80 mb-6">Walk in, call, or request a quote online — however you want to order, we make it easy.</p>
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
