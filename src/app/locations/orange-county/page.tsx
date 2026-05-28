import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import Footer from "@/components/Footer";
import { MapPin, Truck, DollarSign, Clock, Phone, ArrowRight, ShieldCheck, Package, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Janitorial Supply Orange County | Free Delivery on $399+ Orders",
  description:
    "Orange County's #1 wholesale janitorial supplier. Based in Anaheim, we deliver cleaning products, chemicals, paper goods, and equipment to all 34 OC cities. Free delivery on orders $399+.",
  keywords:
    "janitorial supply Orange County, cleaning products OC, wholesale cleaning supplies Orange County, janitorial distributor OC",
  alternates: { canonical: "https://www.mobilejanitorialsupply.com/locations/orange-county" },
  openGraph: {
    title: "Janitorial Supply Orange County | Free Delivery on $399+ Orders",
    description:
      "Orange County's #1 wholesale janitorial supplier. Based in Anaheim, we deliver cleaning products, chemicals, paper goods, and equipment to all 34 OC cities.",
    url: "https://www.mobilejanitorialsupply.com/locations/orange-county",
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
  areaServed: { "@type": "AdministrativeArea", name: "Orange County, CA" },
  url: "https://www.mobilejanitorialsupply.com/locations/orange-county",
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

export default function OrangeCountyPage() {
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
            <span className="inline-block bg-mjs-red/20 text-mjs-red-light text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">Our Home Turf</span>
            <h1 className="text-4xl sm:text-5xl font-black mb-4">Janitorial Supply in Orange County</h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Our Anaheim warehouse sits at the heart of Orange County, giving every OC business fast access to
              over 10,000 wholesale cleaning products. From Newport Beach resorts to Brea corporate parks, we
              deliver to all 34 cities — free on orders $399 and up.
            </p>
          </div>
        </section>

        {/* Service Area Details */}
        <section className="py-14 bg-white">
          <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl font-black text-mjs-dark mb-3">Serving All 34 OC Cities</h2>
              <p className="text-sm text-mjs-gray-500 leading-relaxed mb-4">
                Orange County is our home base. Our warehouse at 3066 E. La Palma Ave. in Anaheim puts us within
                a 30-minute drive of virtually every business in the county — from San Clemente in the south
                to La Habra in the north, and from Seal Beach on the coast to Yorba Linda in the foothills.
              </p>
              <p className="text-sm text-mjs-gray-500 leading-relaxed">
                The Disneyland Resort corridor, South Coast Plaza shopping district, John Wayne Airport business
                parks, and the Irvine Spectrum tech hub all count on us for reliable, wholesale-priced janitorial supplies.
              </p>
            </div>
            <div className="bg-mjs-gray-50 rounded-2xl p-6">
              <h3 className="font-bold text-mjs-dark mb-4">Orange County Delivery Details</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3"><Truck className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Free delivery</strong> on orders $399+</span></li>
                <li className="flex items-start gap-3"><Clock className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>1–2 business day</strong> delivery across OC</span></li>
                <li className="flex items-start gap-3"><MapPin className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Walk-in pickup</strong> available at our Anaheim warehouse</span></li>
                <li className="flex items-start gap-3"><DollarSign className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Wholesale pricing</strong> — no membership fees</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* Product Categories */}
        <section className="py-14 bg-mjs-gray-50">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-black text-mjs-dark mb-2 text-center">What We Deliver to Orange County</h2>
            <p className="text-sm text-mjs-gray-500 text-center mb-8">Browse our full catalog — everything ships from Anaheim.</p>
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
            <h2 className="text-2xl font-black text-mjs-dark mb-8 text-center">Why OC Businesses Choose Mobile Janitorial Supply</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { icon: MapPin, title: "Local Warehouse", desc: "Right here in Anaheim — no cross-country freight delays." },
                { icon: Truck, title: "Free OC Delivery", desc: "Every order $399+ delivered free to any OC address." },
                { icon: DollarSign, title: "Wholesale Pricing", desc: "Distributor-direct prices with no membership or markup." },
                { icon: Clock, title: "1–2 Day Turnaround", desc: "Order today, restock tomorrow. Hospitality and healthcare rely on our speed." },
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
              { stat: "1–2 Days", label: "OC Delivery" },
              { stat: "$399", label: "Free Delivery Min." },
              { stat: "34", label: "OC Cities Served" },
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
            <h2 className="text-2xl font-black text-mjs-dark mb-3 text-center">Industries We Serve Across Orange County</h2>
            <p className="text-sm text-mjs-gray-500 text-center max-w-2xl mx-auto mb-8">
              From Disneyland-area hotels to Irvine tech campuses, we supply the cleaning products that keep OC businesses spotless.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: "Hotels & Hospitality", desc: "Resort corridor hotels near Disneyland, Dana Point boutique inns, and Laguna Beach vacation rentals." },
                { title: "Corporate Offices", desc: "High-rise towers in Irvine, Newport Center, and the Platinum Triangle in Anaheim." },
                { title: "Medical & Dental", desc: "Hospitals, urgent cares, and dental offices across south and central OC." },
                { title: "Restaurants & Food Service", desc: "Fine dining in Laguna, fast-casual chains in Tustin, and food halls in Anaheim Packing District." },
                { title: "Property Management", desc: "HOAs, apartment complexes, and commercial landlords throughout the county." },
                { title: "Education", desc: "School districts, private schools, and community colleges from Fullerton to Mission Viejo." },
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
            <h2 className="text-3xl font-black mb-3">Ready to Stock Up?</h2>
            <p className="text-sm text-white/80 mb-6">Get a custom quote for your OC business or call us to order now.</p>
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
