import { MapPin, Phone, Mail, Clock, Truck, Star, ShieldCheck, Package, Users } from "lucide-react";

const deliveryMinimums = [
  { area: "Orange County", code: "OC", minimum: "$399", color: "bg-mjs-red" },
  { area: "Los Angeles County", code: "LA", minimum: "$399", color: "bg-mjs-gold" },
  { area: "Inland Empire", code: "IE", minimum: "$399", color: "bg-mjs-gold" },
  { area: "San Diego County", code: "SD", minimum: "$699", color: "bg-gray-700" },
];

const offerings = [
  "Janitorial Supplies",
  "Paper Products",
  "Cleaning Chemicals",
  "Trash Liners",
  "Safety & Gloves",
  "Packaging Supplies",
  "Food Service",
  "Equipment & Tools",
];

export default function AboutPage() {
  return (
    <section className="bg-mjs-gray-50">
      {/* Hero */}
      <div className="relative h-[380px] overflow-hidden">
        <img
          src="/images/mjs-storefront.jpg"
          alt="Mobile Janitorial Supply Storefront"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex items-center gap-2 text-xs text-white/60 mb-3">
              <a href="/" className="hover:text-white transition-colors">Home</a>
              <span>/</span>
              <span className="text-white font-medium">About Us</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">About Us</h1>
            <p className="text-white/80 mt-2 text-lg">Southern California&apos;s #1 Rated Janitorial Supply Company</p>
          </div>
        </div>
      </div>

      {/* Google Rating Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-4 flex flex-wrap items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-mjs-gold fill-mjs-gold" />
              ))}
            </div>
            <span className="text-2xl font-black text-mjs-dark">5.0</span>
          </div>
          <span className="text-sm text-mjs-gray-500">Google&apos;s #1 Rated and Reviewed Janitorial Supply Company in Southern California</span>
        </div>
      </div>

      {/* Logos + Intro */}
      <div className="max-w-[1400px] mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Left - Logos */}
          <div className="lg:w-1/3 flex flex-col items-center gap-10">
            <img src="/images/mjs-logo.png" alt="Mobile Janitorial Supply" className="h-32 object-contain" />
            <img src="/images/janitors-finest-logo.png" alt="Janitors Finest" className="h-32 object-contain" />
          </div>

          {/* Right - Content */}
          <div className="lg:w-2/3">
            <h2 className="text-3xl font-extrabold text-mjs-dark mb-4">Who We Are</h2>
            <p className="text-mjs-gray-600 leading-relaxed mb-4">
              Mobile Janitorial Supply is a trusted partner for maintenance professionals, delivering the products businesses need to keep their facilities clean, safe, and running smoothly. From dispensers, paper products, and trash liners to cleaning chemicals, equipment, safety supplies, packaging products, vacuums, accessories, and more, we provide a complete selection of essential facility solutions.
            </p>
            <p className="text-mjs-gray-600 leading-relaxed mb-4">
              We pride ourselves on being a one-stop shop for janitorial and miscellaneous supply needs, with a focus on making the ordering process easy, convenient, and hassle-free. Our goal is to save our customers time while delivering the dependable service they deserve.
            </p>
            <p className="text-mjs-gray-600 leading-relaxed mb-8">
              With over <strong>40,000 products</strong> available and delivery in as little as 1&#8211;3 business days, we are equipped to meet the demands of businesses that rely on speed and consistency. Every member of our team is committed to excellent customer service, and with a typical turnaround time of 24&#8211;48 hours, we work hard to ensure prompt delivery, including free delivery on qualifying orders.
            </p>

            {/* What We Offer */}
            <h3 className="text-xl font-bold text-mjs-dark mb-4">What We Offer</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8">
              {offerings.map((item) => (
                <div key={item} className="bg-white rounded-lg border border-gray-100 px-3 py-2.5 text-center">
                  <span className="text-sm font-medium text-mjs-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Minimums */}
      <div className="bg-mjs-dark">
        <div className="max-w-[1400px] mx-auto px-4 py-16">
          <div className="text-center mb-10">
            <span className="inline-block bg-white/10 text-mjs-gold text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
              Delivery Info
            </span>
            <h2 className="text-3xl font-extrabold text-white">Delivery Minimums by Area</h2>
            <p className="text-gray-400 mt-2 max-w-xl mx-auto">
              Free delivery on qualifying orders. In-stock items delivered within 1-3 business days across Southern California.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {deliveryMinimums.map((zone) => (
              <div key={zone.code} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${zone.color} text-white font-extrabold text-sm mb-3`}>
                  {zone.code}
                </div>
                <div className="text-2xl font-black text-white mb-1">{zone.minimum}</div>
                <div className="text-sm text-gray-400">{zone.area}</div>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-gray-500 mt-8 max-w-2xl mx-auto">
            <strong className="text-gray-400">PLEASE NOTE:</strong> Several thousand of our most popular items are also available for in-store pick up. Some items may require an extra day or possibly be shipped in from another state requiring more lead time, or you can order for a UPS shipment.
          </p>
        </div>
      </div>

      {/* Value Props */}
      <div className="max-w-[1400px] mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Truck className="w-6 h-6 text-mjs-red" />
            </div>
            <h3 className="font-bold text-mjs-dark mb-1">1-3 Day Delivery</h3>
            <p className="text-sm text-mjs-gray-500">Fast delivery across all of Southern California</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Package className="w-6 h-6 text-mjs-red" />
            </div>
            <h3 className="font-bold text-mjs-dark mb-1">40,000+ Items</h3>
            <p className="text-sm text-mjs-gray-500">Huge inventory of janitorial &amp; cleaning supplies</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-mjs-red" />
            </div>
            <h3 className="font-bold text-mjs-dark mb-1">35+ Years</h3>
            <p className="text-sm text-mjs-gray-500">Trusted by thousands of SoCal businesses</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-6 h-6 text-mjs-red" />
            </div>
            <h3 className="font-bold text-mjs-dark mb-1">Wholesale Pricing</h3>
            <p className="text-sm text-mjs-gray-500">Competitive prices that beat the big box stores</p>
          </div>
        </div>
      </div>

      {/* Visit Us / Contact */}
      <div className="bg-white border-t border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-16">
          <div className="bg-mjs-gray-50 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h2 className="text-2xl font-extrabold text-mjs-dark mb-4">Visit Our Showroom</h2>
              <p className="text-mjs-gray-600 leading-relaxed mb-6">
                Come visit our warehouse and showroom in Anaheim. We&apos;re open to the public for cash &amp; carry purchases. See our full range of products in person.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-mjs-red flex-shrink-0" />
                  <span className="text-sm text-mjs-gray-700">3066 E. La Palma Ave, Anaheim, CA 92806</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-mjs-red flex-shrink-0" />
                  <a href="tel:7147792640" className="text-sm text-mjs-gray-700 hover:text-mjs-red transition-colors">(714) 779-2640</a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-mjs-red flex-shrink-0" />
                  <a href="mailto:orders@mobilejanitorialsupply.com" className="text-sm text-mjs-gray-700 hover:text-mjs-red transition-colors">orders@mobilejanitorialsupply.com</a>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-mjs-red flex-shrink-0" />
                  <span className="text-sm text-mjs-gray-700">Mon - Fri: 6:30 AM - 5:00 PM</span>
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <img
                src="/images/mjs-storefront.jpg"
                alt="MJS Storefront"
                className="w-full rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
