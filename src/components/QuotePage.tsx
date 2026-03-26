"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Send, CheckCircle, FileText, Truck, DollarSign } from "lucide-react";

export default function QuotePage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [frequency, setFrequency] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputClass =
    "w-full bg-mjs-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-mjs-red/20 focus:border-mjs-red transition-all";

  return (
    <section className="bg-mjs-gray-50 min-h-screen">
      {/* Hero */}
      <div className="bg-mjs-dark">
        <div className="max-w-[1400px] mx-auto px-4 pt-12 pb-28">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span>/</span>
            <span className="text-gray-400">Get a Quote</span>
          </div>
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-block bg-white/10 text-mjs-gold text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
              Free Quote
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Get a Quote</h1>
            <p className="text-gray-400 mt-3 text-lg leading-relaxed">
              Tell us what you need and we&apos;ll put together competitive wholesale pricing tailored to your business.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
              <a href="mailto:orders@mobilejanitorialsupply.com" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-mjs-red" />
                orders@mobilejanitorialsupply.com
              </a>
              <a href="tel:7147792640" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-mjs-red" />
                (714) 779-2640
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - overlapping the hero */}
      <div className="max-w-[1200px] mx-auto px-4 -mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left - Quote Form (spans 2 cols) */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-10">
            <h2 className="text-xl font-bold text-mjs-dark mb-1">Request a Quote</h2>
            <p className="text-sm text-mjs-gray-400 mb-6">Provide your details and product needs. We&apos;ll respond with pricing within 24 hours.</p>

            {submitted ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-mjs-dark mb-2">Quote Request Received!</h3>
                <p className="text-sm text-mjs-gray-500 max-w-sm mx-auto">Thank you! A member of our sales team will review your request and get back to you within 24 hours with competitive pricing.</p>
                <button onClick={() => setSubmitted(false)} className="mt-6 text-sm text-mjs-red font-semibold hover:underline">
                  Submit another request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-mjs-gray-600 mb-1.5 uppercase tracking-wide">Full Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your full name" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-mjs-gray-600 mb-1.5 uppercase tracking-wide">Company Name</label>
                    <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} required placeholder="Your business name" className={inputClass} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-mjs-gray-600 mb-1.5 uppercase tracking-wide">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@company.com" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-mjs-gray-600 mb-1.5 uppercase tracking-wide">Phone Number</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="(555) 123-4567" className={inputClass} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-mjs-gray-600 mb-1.5 uppercase tracking-wide">Delivery Address</label>
                  <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street address, city, zip" className={inputClass} />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-mjs-gray-600 mb-1.5 uppercase tracking-wide">Order Frequency</label>
                  <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className={inputClass}>
                    <option value="">How often do you order?</option>
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Every 2 Weeks</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="onetime">One-Time Order</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-mjs-gray-600 mb-1.5 uppercase tracking-wide">Products &amp; Quantities Needed</label>
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={6} placeholder="List the products, quantities, and any specific requirements. The more detail, the faster we can get you accurate pricing." className={`${inputClass} resize-none`} />
                </div>

                <button type="submit" className="mx-auto flex items-center gap-2 bg-mjs-red text-white font-semibold px-8 py-3 rounded-lg text-sm hover:bg-red-700 transition-colors">
                  <Send className="w-4 h-4" />
                  Submit Quote Request
                </button>
              </form>
            )}
          </div>

          {/* Right - Info Cards */}
          <div className="space-y-4">
            {/* Why Get a Quote */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xs font-bold text-mjs-gray-400 uppercase tracking-wider mb-4">Why Get a Quote?</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-4 h-4 text-mjs-red" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-mjs-dark">Volume Discounts</div>
                    <div className="text-xs text-mjs-gray-500 mt-0.5">Bigger orders mean bigger savings. We&apos;ll find the best price for your volume.</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-mjs-red" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-mjs-dark">Price Match</div>
                    <div className="text-xs text-mjs-gray-500 mt-0.5">Found a lower price? Let us know and we&apos;ll beat it.</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                    <Truck className="w-4 h-4 text-mjs-red" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-mjs-dark">Free Delivery</div>
                    <div className="text-xs text-mjs-gray-500 mt-0.5">Free delivery on qualifying orders across SoCal.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xs font-bold text-mjs-gray-400 uppercase tracking-wider mb-4">Contact Information</h3>
              <div className="space-y-4">
                <a href="tel:7147792640" className="flex items-start gap-3 group">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-mjs-red" />
                  </div>
                  <div>
                    <div className="text-xs text-mjs-gray-400 font-medium">Phone</div>
                    <div className="text-sm font-semibold text-mjs-dark group-hover:text-mjs-red transition-colors">(714) 779-2640</div>
                  </div>
                </a>
                <a href="mailto:orders@mobilejanitorialsupply.com" className="flex items-start gap-3 group">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-mjs-red" />
                  </div>
                  <div>
                    <div className="text-xs text-mjs-gray-400 font-medium">Email</div>
                    <div className="text-sm font-semibold text-mjs-dark group-hover:text-mjs-red transition-colors break-all">orders@mobilejanitorialsupply.com</div>
                  </div>
                </a>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-mjs-red" />
                  </div>
                  <div>
                    <div className="text-xs text-mjs-gray-400 font-medium">Address</div>
                    <div className="text-sm font-semibold text-mjs-dark">3066 E. La Palma Ave.<br />Anaheim, CA 92806</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Minimums */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xs font-bold text-mjs-gray-400 uppercase tracking-wider mb-4">Delivery Minimums</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-mjs-dark">Orange County</span>
                  <span className="text-sm font-bold text-mjs-red">$399</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-mjs-dark">Los Angeles</span>
                  <span className="text-sm font-bold text-mjs-red">$399</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-mjs-dark">Inland Empire</span>
                  <span className="text-sm font-bold text-mjs-red">$399</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-mjs-dark">San Diego</span>
                  <span className="text-sm font-bold text-mjs-red">$699</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="mt-8 pb-12">
          <a
            href="https://www.google.com/maps?sca_esv=0693a25b4e112fe7&output=search&q=mobile+janitorial+supply+anaheim&source=lnms&fbs=ADc_l-aN0CWEZBOHjofHoaMMDiKp9lEhFAN_4ain3HSNQWw-mOdEry7qMdvK9DVYTQhhmGPzdLibceP-axzNRyypn83aX8fPPrVpY6YpAKaMzVviQSsqn4kQ6fPYTVH_WBb9RKjN3Pbr0feFWTMXbAIL6OzDDW2wfEmj2IChE03jlrCwTE9gOcyRHMHJsO78OjPswr3g3lvRdZIG5P_4gSv0bLwof40tGg&entry=mc&ved=1t:200715&ictx=111"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
          >
            <img
              src="/images/mjs-map.png"
              alt="Mobile Janitorial Supply - 3066 E. La Palma Ave, Anaheim, CA 92806"
              className="w-full h-[350px] object-cover"
            />
          </a>
          <div className="flex items-center justify-center gap-6 mt-4">
            <a
              href="https://www.google.com/maps/dir//Mobile+Janitorial+Supply,+3066+E+La+Palma+Ave,+Anaheim,+CA+92806"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-mjs-red hover:underline"
            >
              <MapPin className="w-4 h-4" />
              Get Directions
            </a>
            <span className="text-gray-300">|</span>
            <a
              href="https://www.google.com/maps?sca_esv=0693a25b4e112fe7&output=search&q=mobile+janitorial+supply+anaheim&source=lnms&fbs=ADc_l-aN0CWEZBOHjofHoaMMDiKp9lEhFAN_4ain3HSNQWw-mOdEry7qMdvK9DVYTQhhmGPzdLibceP-axzNRyypn83aX8fPPrVpY6YpAKaMzVviQSsqn4kQ6fPYTVH_WBb9RKjN3Pbr0feFWTMXbAIL6OzDDW2wfEmj2IChE03jlrCwTE9gOcyRHMHJsO78OjPswr3g3lvRdZIG5P_4gSv0bLwof40tGg&entry=mc&ved=1t:200715&ictx=111"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-mjs-red hover:underline"
            >
              View on Google Maps
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
