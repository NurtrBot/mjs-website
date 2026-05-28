import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import Footer from "@/components/Footer";
import { MapPin, Truck, DollarSign, Clock, Phone, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Janitorial Supply Los Angeles | Wholesale Cleaning Products + Free Delivery",
  description:
    "Wholesale janitorial supplies delivered across Los Angeles County. From Downtown LA to the San Fernando Valley, get 10,000+ cleaning products with free delivery on $399+ orders.",
  keywords:
    "janitorial supply Los Angeles, cleaning supplies LA, wholesale janitorial LA County, cleaning products delivery Los Angeles",
  alternates: { canonical: "https://www.mobilejanitorialsupply.com/locations/los-angeles" },
  openGraph: {
    title: "Janitorial Supply Los Angeles | Wholesale Cleaning Products + Free Delivery",
    description:
      "Wholesale janitorial supplies delivered across Los Angeles County from our Anaheim warehouse. Free delivery on $399+ orders.",
    url: "https://www.mobilejanitorialsupply.com/locations/los-angeles",
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
  areaServed: { "@type": "AdministrativeArea", name: "Los Angeles County, CA" },
  url: "https://www.mobilejanitorialsupply.com/locations/los-angeles",
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

export default function LosAngelesPage() {
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
            <span className="inline-block bg-mjs-red/20 text-mjs-red-light text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">LA County Delivery</span>
            <h1 className="text-4xl sm:text-5xl font-black mb-4">Janitorial Supply in Los Angeles</h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Serving the largest county in the nation from just 30 minutes away. Our Anaheim warehouse stocks
              over 10,000 cleaning products ready to ship across LA — from Hollywood studios to Long Beach
              industrial parks, with free delivery on every order over $399.
            </p>
          </div>
        </section>

        {/* Service Area Details */}
        <section className="py-14 bg-white">
          <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl font-black text-mjs-dark mb-3">30–45 Minutes from Our Warehouse to LA</h2>
              <p className="text-sm text-mjs-gray-500 leading-relaxed mb-4">
                We sit right off the 91 and 57 freeways in Anaheim, placing us 30 minutes from Downtown LA and
                under 45 minutes from the San Fernando Valley. Our delivery trucks run daily routes through LA County,
                covering everything from Pasadena and Glendale to Torrance and Cerritos.
              </p>
              <p className="text-sm text-mjs-gray-500 leading-relaxed">
                Unlike freight-based distributors that ship from out of state, we are a local operation. That means
                lower costs, faster turnaround, and a team that actually knows the traffic patterns and loading dock
                realities of doing business in Los Angeles.
              </p>
            </div>
            <div className="bg-mjs-gray-50 rounded-2xl p-6">
              <h3 className="font-bold text-mjs-dark mb-4">LA County Delivery Details</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3"><Truck className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Free delivery</strong> on orders $399+</span></li>
                <li className="flex items-start gap-3"><Clock className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>1–2 business day</strong> delivery across LA County</span></li>
                <li className="flex items-start gap-3"><MapPin className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>88 cities</strong> served throughout the county</span></li>
                <li className="flex items-start gap-3"><DollarSign className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Wholesale pricing</strong> — no contracts or fees</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* Product Categories */}
        <section className="py-14 bg-mjs-gray-50">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-black text-mjs-dark mb-2 text-center">What We Deliver to Los Angeles</h2>
            <p className="text-sm text-mjs-gray-500 text-center mb-8">Every product ships next-day from our Anaheim warehouse.</p>
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
            <h2 className="text-2xl font-black text-mjs-dark mb-8 text-center">Why LA Businesses Choose Mobile Janitorial Supply</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { icon: MapPin, title: "SoCal Warehouse", desc: "30 min from DTLA — not a fulfillment center in Texas or Ohio." },
                { icon: Truck, title: "Free LA Delivery", desc: "Orders $399+ delivered free anywhere in LA County." },
                { icon: DollarSign, title: "Real Wholesale", desc: "Distributor-direct prices with zero membership or annual fees." },
                { icon: Clock, title: "Next-Day Restock", desc: "Place your order by 2 PM, receive it the next business day." },
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
              { stat: "1–2 Days", label: "LA Delivery" },
              { stat: "$399", label: "Free Delivery Min." },
              { stat: "88", label: "LA Cities Reached" },
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
            <h2 className="text-2xl font-black text-mjs-dark mb-3 text-center">Industries We Serve in Los Angeles</h2>
            <p className="text-sm text-mjs-gray-500 text-center max-w-2xl mx-auto mb-8">
              LA&apos;s economy is the most diverse in the country. We supply cleaning products to every sector.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: "Film & Entertainment", desc: "Production studios in Burbank, Culver City, and Hollywood rely on bulk cleaning supplies for sound stages and back lots." },
                { title: "Restaurants & Nightlife", desc: "From Koreatown to Silver Lake, LA's 30,000+ restaurants need a dependable source for chemicals, liners, and paper goods." },
                { title: "Commercial Offices", desc: "DTLA high-rises, Century City towers, and El Segundo tech campuses keep clean with our wholesale chemicals and paper products." },
                { title: "Property Management", desc: "Thousands of multifamily buildings across LA depend on affordable, bulk janitorial supplies delivered on schedule." },
                { title: "Healthcare & Clinics", desc: "Hospitals, dental offices, and outpatient clinics throughout LA County trust us for medical-grade gloves and disinfectants." },
                { title: "Schools & Universities", desc: "LAUSD facilities, community colleges, and private schools source paper, liners, and floor care products from MJS." },
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
            <h2 className="text-3xl font-black mb-3">Supplying LA, One Delivery at a Time</h2>
            <p className="text-sm text-white/80 mb-6">Get a custom quote for your Los Angeles business or call to place an order.</p>
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
