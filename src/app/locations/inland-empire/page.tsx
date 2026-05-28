import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import Footer from "@/components/Footer";
import { MapPin, Truck, DollarSign, Clock, Phone, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Janitorial Supply Inland Empire | Riverside & San Bernardino Delivery",
  description:
    "Wholesale janitorial supplies delivered to the Inland Empire. Serving Riverside and San Bernardino counties with 10,000+ cleaning products. Free delivery on $399+ orders from our Anaheim warehouse.",
  keywords:
    "janitorial supply Inland Empire, cleaning products Riverside, wholesale janitorial San Bernardino, warehouse cleaning supplies IE",
  alternates: { canonical: "https://www.mobilejanitorialsupply.com/locations/inland-empire" },
  openGraph: {
    title: "Janitorial Supply Inland Empire | Riverside & San Bernardino Delivery",
    description:
      "Wholesale janitorial supplies delivered to Riverside and San Bernardino counties. Free delivery on $399+ orders.",
    url: "https://www.mobilejanitorialsupply.com/locations/inland-empire",
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
  areaServed: [
    { "@type": "AdministrativeArea", name: "Riverside County, CA" },
    { "@type": "AdministrativeArea", name: "San Bernardino County, CA" },
  ],
  url: "https://www.mobilejanitorialsupply.com/locations/inland-empire",
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

export default function InlandEmpirePage() {
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
            <span className="inline-block bg-mjs-red/20 text-mjs-red-light text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">Riverside &amp; San Bernardino</span>
            <h1 className="text-4xl sm:text-5xl font-black mb-4">Janitorial Supply in the Inland Empire</h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              The IE is booming with warehouses, distribution centers, and new commercial developments — and every
              one of them needs cleaning supplies. We deliver over 10,000 wholesale products from our Anaheim warehouse
              to Riverside and San Bernardino counties, free on orders $399+.
            </p>
          </div>
        </section>

        {/* Service Area Details */}
        <section className="py-14 bg-white">
          <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl font-black text-mjs-dark mb-3">Covering Two Counties from One Warehouse</h2>
              <p className="text-sm text-mjs-gray-500 leading-relaxed mb-4">
                Our Anaheim location is just 35 minutes from downtown Riverside via the 91 freeway and about 45 minutes
                from Ontario and Rancho Cucamonga along the 57. We reach as far east as Redlands and as far south as
                Temecula and Murrieta on regular delivery runs.
              </p>
              <p className="text-sm text-mjs-gray-500 leading-relaxed">
                The Inland Empire&apos;s explosive growth in logistics and warehousing means massive demand for cleaning
                chemicals, floor care equipment, trash liners, and safety supplies. We understand the scale these
                facilities operate at and stock case quantities ready to ship.
              </p>
            </div>
            <div className="bg-mjs-gray-50 rounded-2xl p-6">
              <h3 className="font-bold text-mjs-dark mb-4">IE Delivery Details</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3"><Truck className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Free delivery</strong> on orders $399+</span></li>
                <li className="flex items-start gap-3"><Clock className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>1–3 business day</strong> delivery across the IE</span></li>
                <li className="flex items-start gap-3"><MapPin className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>35–60 min</strong> from our Anaheim warehouse</span></li>
                <li className="flex items-start gap-3"><DollarSign className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Wholesale pricing</strong> — no membership required</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* Product Categories */}
        <section className="py-14 bg-mjs-gray-50">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-black text-mjs-dark mb-2 text-center">What We Deliver to the Inland Empire</h2>
            <p className="text-sm text-mjs-gray-500 text-center mb-8">Bulk-ready inventory for warehouses, offices, and every facility in between.</p>
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
            <h2 className="text-2xl font-black text-mjs-dark mb-8 text-center">Why IE Facilities Trust Mobile Janitorial Supply</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { icon: MapPin, title: "Nearby Warehouse", desc: "35 min to Riverside, 45 min to Ontario — faster than any national distributor." },
                { icon: Truck, title: "Free IE Delivery", desc: "Every order $399+ delivered at no charge to Riverside and San Bernardino counties." },
                { icon: DollarSign, title: "Bulk-Friendly Pricing", desc: "Case-quantity pricing built for high-volume warehouse and logistics operations." },
                { icon: Clock, title: "Quick Turnaround", desc: "Most IE orders delivered within 1–2 business days of placement." },
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
              { stat: "1–3 Days", label: "IE Delivery" },
              { stat: "$399", label: "Free Delivery Min." },
              { stat: "2", label: "Counties Served" },
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
            <h2 className="text-2xl font-black text-mjs-dark mb-3 text-center">Industries We Serve in the Inland Empire</h2>
            <p className="text-sm text-mjs-gray-500 text-center max-w-2xl mx-auto mb-8">
              The IE&apos;s logistics corridor and rapidly growing commercial sector demand reliable supply partners.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: "Warehouses & Distribution", desc: "Over 1 billion sq ft of warehouse space in the IE needs floor care chemicals, trash liners, and safety gear." },
                { title: "Manufacturing", desc: "Factories in Ontario, Fontana, and Corona count on us for degreasers, gloves, and industrial cleaning products." },
                { title: "Logistics & 3PL", desc: "Third-party logistics hubs along the I-10 and I-15 corridors keep facilities spotless with our bulk supplies." },
                { title: "Restaurants & Retail", desc: "Victoria Gardens, Riverside Plaza, and hundreds of dining spots rely on our paper products and chemicals." },
                { title: "Healthcare Facilities", desc: "Loma Linda University Medical Center and clinics across both counties trust our gloves and disinfectants." },
                { title: "New Construction", desc: "Post-construction cleanup for new homes and commercial builds from Eastvale to Beaumont." },
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
            <h2 className="text-3xl font-black mb-3">Keep Your IE Facility Stocked</h2>
            <p className="text-sm text-white/80 mb-6">Request a quote tailored to your warehouse, office, or facility needs.</p>
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
