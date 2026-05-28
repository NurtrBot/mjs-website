import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import Footer from "@/components/Footer";
import { MapPin, Truck, DollarSign, Clock, Phone, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Janitorial Supply Santa Ana | Next-Day Delivery from Anaheim",
  description:
    "Wholesale janitorial supplies for Santa Ana businesses. Adjacent to our Anaheim warehouse — get next-day delivery on 10,000+ cleaning products. Free shipping on $399+ orders.",
  keywords:
    "janitorial supply Santa Ana, cleaning products Santa Ana CA, wholesale cleaning Santa Ana",
  alternates: { canonical: "https://www.mobilejanitorialsupply.com/locations/santa-ana" },
  openGraph: {
    title: "Janitorial Supply Santa Ana | Next-Day Delivery from Anaheim",
    description:
      "Wholesale janitorial supplies for Santa Ana. Adjacent to our Anaheim warehouse. Free delivery on $399+ orders.",
    url: "https://www.mobilejanitorialsupply.com/locations/santa-ana",
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
  areaServed: { "@type": "City", name: "Santa Ana" },
  url: "https://www.mobilejanitorialsupply.com/locations/santa-ana",
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

export default function SantaAnaPage() {
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
            <span className="inline-block bg-mjs-red/20 text-mjs-red-light text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">OC County Seat</span>
            <h1 className="text-4xl sm:text-5xl font-black mb-4">Janitorial Supply in Santa Ana</h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Santa Ana is the governmental and civic heart of Orange County — and one of our closest delivery
              zones. The county courthouse district, downtown business corridor, and surrounding neighborhoods
              are just 10 minutes from our Anaheim warehouse, making next-day delivery virtually guaranteed.
            </p>
          </div>
        </section>

        {/* Service Area Details */}
        <section className="py-14 bg-white">
          <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl font-black text-mjs-dark mb-3">Practically Next Door to Our Warehouse</h2>
              <p className="text-sm text-mjs-gray-500 leading-relaxed mb-4">
                Santa Ana borders Anaheim directly to the south and east. Our warehouse on La Palma Ave. is a
                straight shot down the 5 or 57 — about 10 minutes in normal traffic. That proximity means
                we can handle urgent restock requests faster than any competitor shipping from a remote fulfillment center.
              </p>
              <p className="text-sm text-mjs-gray-500 leading-relaxed">
                The city&apos;s blend of government buildings, a thriving downtown arts and dining district, dense
                residential neighborhoods, and light industrial zones near the Santa Ana River creates varied
                cleaning supply needs. We stock products for all of them — from heavy-duty degreasers for
                auto shops on South Main Street to elegant restroom dispensers for the Bowers Museum.
              </p>
            </div>
            <div className="bg-mjs-gray-50 rounded-2xl p-6">
              <h3 className="font-bold text-mjs-dark mb-4">Santa Ana Delivery Details</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3"><Truck className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Free delivery</strong> on orders $399+</span></li>
                <li className="flex items-start gap-3"><Clock className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Next business day</strong> delivery standard</span></li>
                <li className="flex items-start gap-3"><MapPin className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>10 minutes</strong> from our Anaheim warehouse</span></li>
                <li className="flex items-start gap-3"><DollarSign className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Wholesale pricing</strong> — no membership fees</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* Product Categories */}
        <section className="py-14 bg-mjs-gray-50">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-black text-mjs-dark mb-2 text-center">What We Deliver to Santa Ana</h2>
            <p className="text-sm text-mjs-gray-500 text-center mb-8">Government offices, restaurants, and commercial buildings — we supply them all.</p>
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
            <h2 className="text-2xl font-black text-mjs-dark mb-8 text-center">Why Santa Ana Businesses Rely on MJS</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { icon: MapPin, title: "10 Min Away", desc: "Our Anaheim warehouse is practically in your backyard." },
                { icon: Truck, title: "Free Delivery", desc: "Orders $399+ ship free — next business day, every time." },
                { icon: DollarSign, title: "Budget-Friendly", desc: "Wholesale pricing helps city agencies and small businesses stretch budgets." },
                { icon: Clock, title: "Fastest Restock", desc: "Closest major janitorial supplier to downtown Santa Ana." },
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
              { stat: "Next Day", label: "SA Delivery" },
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
            <h2 className="text-2xl font-black text-mjs-dark mb-3 text-center">Industries We Serve in Santa Ana</h2>
            <p className="text-sm text-mjs-gray-500 text-center max-w-2xl mx-auto mb-8">
              As the county seat and one of OC&apos;s most densely populated cities, Santa Ana has a wide range of cleaning supply needs.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: "Government & Civic", desc: "The OC Superior Court, county offices on Civic Center Dr., and city hall all require institutional-grade cleaning products." },
                { title: "Restaurants & Cafes", desc: "Downtown Santa Ana's East End dining scene, 4th Street Market, and neighborhood taquerias need paper, liners, and chemicals." },
                { title: "Property Management", desc: "Dense apartment communities throughout Santa Ana rely on bulk trash liners, floor care chemicals, and restroom supplies." },
                { title: "Arts & Culture", desc: "The Bowers Museum, OCMA, and gallery spaces along Artist Village need careful, non-damaging cleaning products." },
                { title: "Medical & Dental", desc: "Clinics, dental practices, and urgent care centers along Main and Bristol streets trust our gloves and disinfectants." },
                { title: "Auto & Industrial", desc: "Repair shops and light manufacturers along Grand Ave. and South Main use our degreasers, towels, and safety gear." },
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
            <h2 className="text-3xl font-black mb-3">Santa Ana&apos;s Nearest Wholesale Supplier</h2>
            <p className="text-sm text-white/80 mb-6">Get a quote for your business or call our team — we deliver to Santa Ana every day.</p>
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
