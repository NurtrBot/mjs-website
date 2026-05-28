import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import Footer from "@/components/Footer";
import { MapPin, Truck, DollarSign, Clock, Phone, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Janitorial Supply Irvine | Wholesale Cleaning Products for Business",
  description:
    "Wholesale janitorial supplies for Irvine businesses. 15 minutes from our Anaheim warehouse to the Spectrum, Great Park, and Irvine Business Complex. Free delivery on $399+ orders.",
  keywords:
    "janitorial supply Irvine, cleaning products Irvine CA, office cleaning supplies Irvine, wholesale janitorial Irvine",
  alternates: { canonical: "https://www.mobilejanitorialsupply.com/locations/irvine" },
  openGraph: {
    title: "Janitorial Supply Irvine | Wholesale Cleaning Products for Business",
    description:
      "Wholesale janitorial supplies for Irvine businesses. 15 minutes from our Anaheim warehouse. Free delivery on $399+.",
    url: "https://www.mobilejanitorialsupply.com/locations/irvine",
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
  areaServed: { "@type": "City", name: "Irvine" },
  url: "https://www.mobilejanitorialsupply.com/locations/irvine",
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

export default function IrvinePage() {
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
            <span className="inline-block bg-mjs-red/20 text-mjs-red-light text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">15 Min from Our Warehouse</span>
            <h1 className="text-4xl sm:text-5xl font-black mb-4">Janitorial Supply in Irvine</h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Irvine is one of the largest employment centers in Orange County, home to hundreds of tech
              firms, healthcare campuses, and corporate headquarters. Our Anaheim warehouse is a quick
              15-minute drive down the 5 or 57, keeping your office stocked with wholesale cleaning
              products and free delivery on orders $399+.
            </p>
          </div>
        </section>

        {/* Service Area Details */}
        <section className="py-14 bg-white">
          <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl font-black text-mjs-dark mb-3">From Our Warehouse to Your Irvine Office — Fast</h2>
              <p className="text-sm text-mjs-gray-500 leading-relaxed mb-4">
                Whether your building is in the Irvine Business Complex off Jamboree, near the Irvine Spectrum
                Center, or in the newer Great Park neighborhoods, our delivery trucks reach you within one
                business day. We run Irvine routes daily because so many of our customers are clustered in
                the city&apos;s commercial corridors.
              </p>
              <p className="text-sm text-mjs-gray-500 leading-relaxed">
                Irvine&apos;s master-planned layout means loading docks are well-organized and accessible, which lets
                us handle large pallet drops efficiently. Many of our Irvine clients are multi-floor office
                buildings that need recurring deliveries of paper products, liners, and restroom supplies.
              </p>
            </div>
            <div className="bg-mjs-gray-50 rounded-2xl p-6">
              <h3 className="font-bold text-mjs-dark mb-4">Irvine Delivery Details</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3"><Truck className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Free delivery</strong> on orders $399+</span></li>
                <li className="flex items-start gap-3"><Clock className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Next business day</strong> delivery standard</span></li>
                <li className="flex items-start gap-3"><MapPin className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>15 minutes</strong> from our Anaheim warehouse</span></li>
                <li className="flex items-start gap-3"><DollarSign className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Wholesale pricing</strong> — no contracts needed</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* Product Categories */}
        <section className="py-14 bg-mjs-gray-50">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-black text-mjs-dark mb-2 text-center">What We Deliver to Irvine</h2>
            <p className="text-sm text-mjs-gray-500 text-center mb-8">Office-ready and facility-grade products, shipped next day.</p>
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
            <h2 className="text-2xl font-black text-mjs-dark mb-8 text-center">Why Irvine Companies Choose Mobile Janitorial Supply</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { icon: MapPin, title: "15 Min Away", desc: "Our Anaheim warehouse is a short hop down the 5 freeway." },
                { icon: Truck, title: "Daily Irvine Routes", desc: "We deliver to Irvine every business day — no waiting for weekly runs." },
                { icon: DollarSign, title: "Corporate Pricing", desc: "Wholesale rates that beat office supply stores and Amazon Business." },
                { icon: Clock, title: "Next-Day Restock", desc: "Order by 2 PM today, receive your products tomorrow." },
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
              { stat: "Next Day", label: "Irvine Delivery" },
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
            <h2 className="text-2xl font-black text-mjs-dark mb-3 text-center">Industries We Serve in Irvine</h2>
            <p className="text-sm text-mjs-gray-500 text-center max-w-2xl mx-auto mb-8">
              Irvine&apos;s economy is built on technology, healthcare, and corporate services — all sectors that demand clean facilities.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: "Tech & Software", desc: "Companies along the Irvine Spectrum and Jamboree corridor need consistent restroom and breakroom supplies for large campuses." },
                { title: "Medical & Biotech", desc: "Hoag Hospital Irvine, Kaiser, and biotech firms require medical-grade gloves, disinfectants, and specialty cleaning products." },
                { title: "Corporate Offices", desc: "Class-A office towers in the Irvine Business Complex depend on paper products, liners, and floor care chemicals." },
                { title: "Retail & Shopping", desc: "Irvine Spectrum Center, the Marketplace, and surrounding retail rely on high-traffic restroom supplies." },
                { title: "Education", desc: "UC Irvine, Concordia University, and Irvine Unified school facilities use our bulk paper and chemical products." },
                { title: "Restaurants & Dining", desc: "Hundreds of restaurants along Culver, Barranca, and the Spectrum area need daily cleaning essentials." },
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
            <h2 className="text-3xl font-black mb-3">Keep Your Irvine Facility Stocked</h2>
            <p className="text-sm text-white/80 mb-6">Request a custom quote or call us — we know Irvine&apos;s commercial landscape inside and out.</p>
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
