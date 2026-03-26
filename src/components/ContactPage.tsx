"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Fax, Send, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
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
            <span className="text-gray-400">Contact Us</span>
          </div>
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Contact Us</h1>
            <p className="text-gray-400 mt-3 text-lg leading-relaxed">
              Have questions? Need a quote? Our team is ready to help. Reach out via phone, email, or the form below.
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

          {/* Left - Contact Form (spans 2 cols) */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-10">
            <h2 className="text-xl font-bold text-mjs-dark mb-1">Get in Touch</h2>
            <p className="text-sm text-mjs-gray-400 mb-6">Fill out the form and we&apos;ll get back to you within 24 hours.</p>

            {submitted ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-mjs-dark mb-2">Message Sent!</h3>
                <p className="text-sm text-mjs-gray-500 max-w-sm mx-auto">Thank you for reaching out. A member of our team will get back to you within 24 hours.</p>
                <button onClick={() => setSubmitted(false)} className="mt-6 text-sm text-mjs-red font-semibold hover:underline">
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-mjs-gray-600 mb-1.5 uppercase tracking-wide">Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your full name" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-mjs-gray-600 mb-1.5 uppercase tracking-wide">Company</label>
                    <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company name (optional)" className={inputClass} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-mjs-gray-600 mb-1.5 uppercase tracking-wide">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@company.com" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-mjs-gray-600 mb-1.5 uppercase tracking-wide">Phone Number</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(555) 123-4567" className={inputClass} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-mjs-gray-600 mb-1.5 uppercase tracking-wide">Subject</label>
                  <select value={subject} onChange={(e) => setSubject(e.target.value)} className={inputClass}>
                    <option value="">Select a topic...</option>
                    <option value="general">General Inquiry</option>
                    <option value="quote">Request a Quote</option>
                    <option value="order">Order Question</option>
                    <option value="delivery">Delivery Information</option>
                    <option value="returns">Returns</option>
                    <option value="credit">Credit Application</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-mjs-gray-600 mb-1.5 uppercase tracking-wide">Your Message</label>
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={5} placeholder="How can we help you?" className={`${inputClass} resize-none`} />
                </div>

                <button type="submit" className="mx-auto flex items-center gap-2 bg-mjs-red text-white font-semibold px-8 py-3 rounded-lg text-sm hover:bg-red-700 transition-colors">
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Right - Contact Info Cards */}
          <div className="space-y-4">
            {/* Contact Methods */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xs font-bold text-mjs-gray-400 uppercase tracking-wider mb-4">Contact Methods</h3>
              <div className="space-y-3">
                <a href="tel:7147792640" className="flex items-center gap-3 group">
                  <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-mjs-red" />
                  </div>
                  <div>
                    <div className="text-[10px] text-mjs-gray-400 font-medium uppercase">Work</div>
                    <div className="text-sm font-semibold text-mjs-dark group-hover:text-mjs-red transition-colors">(714) 779-2640</div>
                  </div>
                </a>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-mjs-red" />
                  </div>
                  <div>
                    <div className="text-[10px] text-mjs-gray-400 font-medium uppercase">Fax</div>
                    <div className="text-sm font-semibold text-mjs-dark">(714) 779-7789</div>
                  </div>
                </div>
                <a href="mailto:orders@mobilejanitorialsupply.com" className="flex items-center gap-3 group">
                  <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-mjs-red" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-mjs-dark group-hover:text-mjs-red transition-colors break-all">orders@mobilejanitorialsupply.com</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Addresses */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xs font-bold text-mjs-gray-400 uppercase tracking-wider mb-4">Addresses</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-mjs-red" />
                  </div>
                  <div>
                    <div className="text-[10px] text-mjs-gray-400 font-bold uppercase tracking-wider">Mailing</div>
                    <div className="text-sm text-mjs-gray-600 mt-0.5">Mobile Janitorial Supply<br />21520-G Yorba Linda Blvd.<br />Suite 215<br />Yorba Linda, CA 92886</div>
                  </div>
                </div>
                <div className="border-t border-gray-100" />
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-mjs-red" />
                  </div>
                  <div>
                    <div className="text-[10px] text-mjs-gray-400 font-bold uppercase tracking-wider">Warehouse</div>
                    <div className="text-sm text-mjs-gray-600 mt-0.5">3066 E. La Palma Ave.<br />Anaheim, CA 92806</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hours of Operation */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xs font-bold text-mjs-gray-400 uppercase tracking-wider mb-4">Hours of Operation</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-mjs-gray-50 rounded-lg px-4 py-3">
                  <div>
                    <div className="text-xs font-bold text-mjs-dark uppercase">Business Hours</div>
                    <div className="text-[10px] text-mjs-gray-400 mt-0.5">Mon - Fri</div>
                  </div>
                  <div className="text-sm font-bold text-mjs-red">6:30 AM - 3:00 PM</div>
                </div>
                <div className="flex items-center justify-between bg-mjs-gray-50 rounded-lg px-4 py-3">
                  <div>
                    <div className="text-xs font-bold text-mjs-dark uppercase">Will Call</div>
                    <div className="text-[10px] text-mjs-gray-400 mt-0.5">Mon - Fri</div>
                  </div>
                  <div className="text-sm font-bold text-mjs-red">6:30 AM - 2:45 PM</div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-mjs-gray-400">
                <Clock className="w-3.5 h-3.5" />
                Saturday &amp; Sunday: Closed
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
