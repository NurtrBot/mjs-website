import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import Footer from "@/components/Footer";
import { MapPin, Truck, DollarSign, Clock, Phone, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Janitorial Supply Fullerton | Fast Delivery from Our Anaheim Warehouse",
  description:
    "Wholesale janitorial supplies for Fullerton businesses. Just 10 minutes from our Anaheim warehouse. Serving Cal State Fullerton, downtown dining, and local businesses with free delivery on $399+.",
  keywords:
    "janitorial supply Fullerton, cleaning products Fullerton CA, wholesale janitorial Fullerton",
  alternates: { canonical: "https://www.mobilejanitorialsupply.com/locations/fullerton" },
  openGraph: {
    title: "Janitorial Supply Fullerton | Fast Delivery from Our Anaheim Warehouse",
    description:
      "Wholesale janitorial supplies for Fullerton. 10 min from our warehouse. Free delivery on $399+ orders.",
    url: "https://www.mobilejanitorialsupply.com/locations/fullerton",
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
  areaServed: { "@type": "City", name: "Fullerton" },
  url: "https://www.mobilejanitorialsupply.com/locations/fullerton",
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

export default function FullertonPage() {
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
            <span className="inline-block bg-mjs-red/20 text-mjs-red-light text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">10 Min from Our Door</span>
            <h1 className="text-4xl sm:text-5xl font-black mb-4">Janitorial Supply in Fullerton</h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Fullerton is our neighbor to the north — a city known for its walkable downtown, Cal State Fullerton
              campus, and growing mix of restaurants and creative businesses. At just 10 minutes from our Anaheim
              warehouse, Fullerton orders arrive faster than almost anywhere else we deliver.
            </p>
          </div>
        </section>

        {/* Service Area Details */}
        <section className="py-14 bg-white">
          <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl font-black text-mjs-dark mb-3">Your Closest Wholesale Janitorial Supplier</h2>
              <p className="text-sm text-mjs-gray-500 leading-relaxed mb-4">
                Head south on State College Boulevard or hop on the 57 freeway and you&apos;re at our warehouse in
                minutes. Fullerton shares a border with Anaheim along La Palma Avenue — our literal home street.
                That makes us the closest wholesale janitorial distributor to virtually every business in the city.
              </p>
              <p className="text-sm text-mjs-gray-500 leading-relaxed">
                Whether you manage a restaurant on Harbor Blvd., maintain buildings near the Fullerton
                Transportation Center, or keep the CSUF campus stocked, we have the products and the proximity
                to keep your supply closet full without overpaying at retail stores.
              </p>
            </div>
            <div className="bg-mjs-gray-50 rounded-2xl p-6">
              <h3 className="font-bold text-mjs-dark mb-4">Fullerton Delivery Details</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3"><Truck className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Free delivery</strong> on orders $399+</span></li>
                <li className="flex items-start gap-3"><Clock className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Next business day</strong> delivery — often same day for early orders</span></li>
                <li className="flex items-start gap-3"><MapPin className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>10 minutes</strong> from our Anaheim warehouse</span></li>
                <li className="flex items-start gap-3"><DollarSign className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Wholesale pricing</strong> — zero membership fees</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* Product Categories */}
        <section className="py-14 bg-mjs-gray-50">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-black text-mjs-dark mb-2 text-center">What We Deliver to Fullerton</h2>
            <p className="text-sm text-mjs-gray-500 text-center mb-8">From campus facilities to downtown restaurants — full catalog, next-day.</p>
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
            <h2 className="text-2xl font-black text-mjs-dark mb-8 text-center">Why Fullerton Businesses Choose MJS</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { icon: MapPin, title: "Neighbors", desc: "We share a border with Fullerton — no supplier is closer." },
                { icon: Truck, title: "Rapid Delivery", desc: "10-minute proximity means your orders arrive fast, every time." },
                { icon: DollarSign, title: "Wholesale Rates", desc: "Same prices large distributors charge — without the huge minimums." },
                { icon: Clock, title: "Flexible Ordering", desc: "Order online anytime, call during business hours, or drive over to pick up." },
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
              { stat: "Next Day", label: "Fullerton Delivery" },
              { stat: "$399", label: "Free Delivery Min." },
              { stat: "10 Min", label: "From Warehouse" },
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
            <h2 className="text-2xl font-black text-mjs-dark mb-3 text-center">Industries We Serve in Fullerton</h2>
            <p className="text-sm text-mjs-gray-500 text-center max-w-2xl mx-auto mb-8">
              Fullerton&apos;s blend of higher education, vibrant dining, and established businesses creates diverse cleaning supply needs.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: "Higher Education", desc: "Cal State Fullerton and Fullerton College maintain large campuses that consume bulk paper, liners, and floor care products." },
                { title: "Downtown Restaurants", desc: "The bustling downtown strip along Harbor and Commonwealth needs daily restocking of chemicals, liners, and paper goods." },
                { title: "Breweries & Taprooms", desc: "Fullerton's craft beer scene — Bootlegger's, Stereo Brewing, and more — needs floor degreasers, towels, and sanitizers." },
                { title: "Medical Offices", desc: "Clinics and specialist offices along Chapman and Bastanchury rely on medical-grade gloves and disinfecting products." },
                { title: "Churches & Nonprofits", desc: "Houses of worship and community organizations throughout Fullerton maintain large facilities on tight budgets." },
                { title: "Retail & Shopping", desc: "Fullerton Town Center and shops along State College need restroom supplies and floor care for steady foot traffic." },
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
            <h2 className="text-3xl font-black mb-3">Fullerton&apos;s Wholesale Cleaning Supply Neighbor</h2>
            <p className="text-sm text-white/80 mb-6">Request a quote or call our team — we are right down the road.</p>
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
