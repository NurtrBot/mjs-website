"use client";

import { useState } from "react";
import { ChevronDown, MapPin, Phone, Mail, Clock, Truck, CreditCard, RotateCcw, Store, Globe, DollarSign, Package, Users, ShieldCheck } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string | string[];
  icon: React.ReactNode;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: "General",
    icon: <Store className="w-5 h-5" />,
    question: "Who is Mobile Janitorial Supply?",
    answer: "Mobile Janitorial Supply is a wholesale distributor of Janitorial, Equipment, Packaging, Safety and Foodservice supplies that sells direct to businesses and other distributors.",
  },
  {
    category: "General",
    icon: <MapPin className="w-5 h-5" />,
    question: "Where is Mobile Janitorial Supply located and what are your business hours?",
    answer: [
      "Our offices and warehouse are located at 3066 E. La Palma Ave., Anaheim, CA 92806.",
      "We are open Monday through Friday from 6:30 AM to 3:00 PM.",
    ],
  },
  {
    category: "General",
    icon: <Users className="w-5 h-5" />,
    question: "Can anyone buy products from Mobile Janitorial Supply?",
    answer: "Yes, we have a beautiful outlet store located in front of our warehouse that services all businesses in every industry along with the general public. We specialize in wholesale distribution direct to business.",
  },
  {
    category: "Delivery",
    icon: <Globe className="w-5 h-5" />,
    question: "What area does Mobile Janitorial Supply service?",
    answer: "We service the counties of Orange, Los Angeles, Riverside, San Bernardino, San Diego, along with surrounding counties. We also ship out of state.",
  },
  {
    category: "Delivery",
    icon: <DollarSign className="w-5 h-5" />,
    question: "Does Mobile Janitorial Supply have a minimum order requirement?",
    answer: "Yes, Orange County has a minimum order requirement of $399.00. Los Angeles County has $399.00. Riverside and San Bernardino County have $399.00 and San Diego County has a minimum order requirement of $699.00.",
  },
  {
    category: "Delivery",
    icon: <Truck className="w-5 h-5" />,
    question: "Does Mobile Janitorial Supply provide delivery service and how long does it take?",
    answer: "Yes, we offer free delivery with a minimum order. If under a minimum order there is a $35.00 delivery charge for most counties. All orders usually ship in 1-2 days.",
  },
  {
    category: "Products",
    icon: <Package className="w-5 h-5" />,
    question: "Does Mobile Janitorial Supply offer a FREE dispenser program for paper products?",
    answer: "Yes, all free dispenser programs are decided on an individual basis and require approval by management.",
  },
  {
    category: "Products",
    icon: <ShieldCheck className="w-5 h-5" />,
    question: "Can Mobile Janitorial Supply beat prices or price match?",
    answer: "Yes, we are volume buyers of every product we sell and we are a true wholesale company. Save yourself some time and let us know what we need to beat and we will get it done.",
  },
  {
    category: "Orders",
    icon: <CreditCard className="w-5 h-5" />,
    question: "Does Mobile Janitorial Supply offer payment options?",
    answer: "Yes, we offer all credit cards and also payment by ongoing credit card authorization, cash, business check, in addition to credit terms for businesses. Please note: Credit terms only considered if $500.00 per month is spent.",
  },
  {
    category: "Orders",
    icon: <Phone className="w-5 h-5" />,
    question: "How can I place an order?",
    answer: [
      "You can easily place an order by:",
      "\u2022 Calling us at (714) 779-2640",
      "\u2022 Fax at (714) 779-7789",
      "\u2022 Email your order to orders@mobilejanitorialsupply.com",
      "\u2022 Order online at mobilejanitorialsupply.com",
    ],
  },
  {
    category: "Orders",
    icon: <Globe className="w-5 h-5" />,
    question: "Does Mobile Janitorial Supply have a website?",
    answer: "We sure do. We have one of the best websites in our industry. At our website you can not only purchase products but you can also obtain MSDS information, view several catalogs and download forms.",
  },
  {
    category: "Returns",
    icon: <RotateCcw className="w-5 h-5" />,
    question: "What is the return policy at Mobile Janitorial Supply?",
    answer: [
      "Any returns must be made within 7 days of receipt of the order. Returns due to customer error are subject to a 15% restocking charge, and the customer will be responsible for return freight.",
      "Returns made after 7 days are subject to a 15% restocking charge and will be decided at the discretion of Mobile Janitorial Supply.",
      "Credit account purchases: credit will be issued back to your account (no exceptions). Cash credit cannot be issued if original purchase was made on a credit account.",
      "In-store cash purchases: we will issue a cash credit, or you may use the credit in store.",
      "Credit card purchases: credit will be issued back to the card used for that purchase.",
      "NO RETURNS OR CREDIT on any equipment that has been used or opened. Only unopened, non-used equipment may be returned. All warranty work is done through the manufacturer. Mobile Janitorial Supply will gladly assist in warranty repairs.",
    ],
  },
];

const categories = ["All", "General", "Delivery", "Products", "Orders", "Returns"];

function FAQAccordion({ faq, isOpen, toggle }: { faq: FAQItem; isOpen: boolean; toggle: () => void }) {
  return (
    <div className={`bg-white rounded-xl border transition-all ${isOpen ? "border-mjs-red/20 shadow-md shadow-red-100/50" : "border-gray-100 hover:border-gray-200"}`}>
      <button
        onClick={toggle}
        className="w-full flex items-start gap-4 px-6 py-5 text-left"
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${isOpen ? "bg-mjs-red text-white" : "bg-mjs-gray-50 text-mjs-gray-400"}`}>
          {faq.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-sm leading-snug transition-colors ${isOpen ? "text-mjs-red" : "text-mjs-dark"}`}>
            {faq.question}
          </h3>
        </div>
        <ChevronDown className={`w-5 h-5 flex-shrink-0 mt-0.5 transition-transform duration-200 ${isOpen ? "rotate-180 text-mjs-red" : "text-mjs-gray-400"}`} />
      </button>
      {isOpen && (
        <div className="px-6 pb-5 pl-20">
          {Array.isArray(faq.answer) ? (
            <div className="space-y-2">
              {faq.answer.map((line, i) => (
                <p key={i} className="text-sm text-mjs-gray-600 leading-relaxed">{line}</p>
              ))}
            </div>
          ) : (
            <p className="text-sm text-mjs-gray-600 leading-relaxed">{faq.answer}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredFaqs = activeCategory === "All"
    ? faqs
    : faqs.filter((f) => f.category === activeCategory);

  return (
    <section className="bg-mjs-gray-50 min-h-screen">
      {/* Hero */}
      <div className="bg-mjs-dark">
        <div className="max-w-[1400px] mx-auto px-4 py-16 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-6">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span>/</span>
            <span className="text-gray-400">FAQ</span>
          </div>
          <span className="inline-block bg-white/10 text-mjs-gold text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
            Help Center
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Frequently Asked Questions</h1>
          <p className="text-gray-400 mt-3 max-w-lg mx-auto">
            Everything you need to know about ordering, delivery, pricing, and returns.
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-[900px] mx-auto px-4 -mt-5">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3 flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setOpenIndex(0); }}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeCategory === cat
                  ? "bg-mjs-red text-white shadow-md shadow-red-200"
                  : "bg-mjs-gray-50 text-mjs-gray-600 hover:bg-red-50 hover:text-mjs-red"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ List */}
      <div className="max-w-[900px] mx-auto px-4 py-10">
        <div className="space-y-3">
          {filteredFaqs.map((faq, i) => (
            <FAQAccordion
              key={faq.question}
              faq={faq}
              isOpen={openIndex === i}
              toggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>

      {/* Fuel Surcharge Policy */}
      <div className="max-w-[900px] mx-auto px-4 pb-8">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-8 pt-7 pb-6">
            <div className="flex items-center gap-2.5 mb-4">
              <Truck className="w-5 h-5 text-mjs-red" />
              <h2 className="text-lg font-bold text-mjs-dark">Fuel Surcharge Policy <span className="text-mjs-gray-400 font-medium text-sm">(California Deliveries)</span></h2>
            </div>
            <div className="space-y-3 text-sm text-mjs-gray-600 leading-relaxed">
              <p>Mobile Janitorial Supply is committed to transparent and fair delivery pricing throughout California. Due to the volatility of fuel costs within the state, particularly in Southern California, a fuel surcharge may be applied to delivery orders when necessary.</p>
              <p>If the California On-Highway Diesel Fuel Price, as published by the U.S. Energy Information Administration (EIA), exceeds <span className="font-semibold text-mjs-dark">$5.00 per gallon</span>, a fuel surcharge of <span className="font-semibold text-mjs-dark">$6.95</span> will be applied per delivery.</p>
              <p>This surcharge will be clearly itemized on the customer&apos;s invoice as a separate line item labeled &ldquo;Fuel Surcharge.&rdquo;</p>
              <p>If the published California diesel fuel price falls below $5.00 per gallon, the fuel surcharge will be removed accordingly.</p>
              <p className="text-xs text-mjs-gray-400">Mobile Janitorial Supply reserves the right to modify, adjust, or discontinue this policy at any time without prior notice based on changes in fuel costs, operating expenses, or market conditions within California.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Still Have Questions CTA */}
      <div className="max-w-[900px] mx-auto px-4 pb-16">
        <div className="bg-white rounded-2xl border border-gray-100 p-8 md:p-10 text-center">
          <h2 className="text-xl font-bold text-mjs-dark mb-2">Still have questions?</h2>
          <p className="text-sm text-mjs-gray-500 mb-6">Our team is here to help. Reach out and we&apos;ll get back to you right away.</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="tel:7147792640"
              className="inline-flex items-center gap-2 bg-mjs-red text-white font-semibold px-6 py-3 rounded-lg text-sm hover:bg-red-700 transition-colors"
            >
              <Phone className="w-4 h-4" />
              (714) 779-2640
            </a>
            <a
              href="mailto:orders@mobilejanitorialsupply.com"
              className="inline-flex items-center gap-2 bg-mjs-gray-50 text-mjs-dark font-semibold px-6 py-3 rounded-lg text-sm hover:bg-gray-100 transition-colors border border-gray-200"
            >
              <Mail className="w-4 h-4" />
              Email Us
            </a>
          </div>
          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-mjs-gray-400">
            <Clock className="w-3.5 h-3.5" />
            Mon - Fri, 6:30 AM - 3:00 PM
          </div>
        </div>
      </div>
    </section>
  );
}
