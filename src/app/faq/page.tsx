import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import FAQPage from "@/components/FAQPage";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "FAQ | Frequently Asked Questions",
  description:
    "Answers to common questions about Mobile Janitorial Supply: delivery areas, minimum orders, pricing, payment options, returns, and more. Serving Orange County, LA, Inland Empire & San Diego.",
  keywords:
    "Mobile Janitorial Supply FAQ, janitorial supply delivery, wholesale cleaning supply questions, minimum order requirements, SoCal janitorial delivery, free delivery cleaning supplies",
  alternates: {
    canonical: "https://www.mobilejanitorialsupply.com/faq",
  },
};

/**
 * FAQPage JSON-LD — generates expandable FAQ rich snippets
 * directly in Google search results. Each Q&A pair appears
 * as a dropdown under your listing.
 */
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Who is Mobile Janitorial Supply?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Mobile Janitorial Supply is a wholesale distributor of Janitorial, Equipment, Packaging, Safety and Foodservice supplies that sells direct to businesses and other distributors.",
      },
    },
    {
      "@type": "Question",
      name: "Where is Mobile Janitorial Supply located and what are your business hours?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our offices and warehouse are located at 3066 E. La Palma Ave., Anaheim, CA 92806. We are open Monday through Friday from 6:30 AM to 3:00 PM.",
      },
    },
    {
      "@type": "Question",
      name: "Can anyone buy products from Mobile Janitorial Supply?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, we have a beautiful outlet store located in front of our warehouse that services all businesses in every industry along with the general public. We specialize in wholesale distribution direct to business.",
      },
    },
    {
      "@type": "Question",
      name: "What area does Mobile Janitorial Supply service?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We service the counties of Orange, Los Angeles, Riverside, San Bernardino, San Diego, along with surrounding counties. We also ship out of state.",
      },
    },
    {
      "@type": "Question",
      name: "Does Mobile Janitorial Supply have a minimum order requirement?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Orange County has a minimum order requirement of $399.00. Los Angeles County has $399.00. Riverside and San Bernardino County have $399.00 and San Diego County has a minimum order requirement of $699.00.",
      },
    },
    {
      "@type": "Question",
      name: "Does Mobile Janitorial Supply provide delivery service and how long does it take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, we offer free delivery on qualifying orders. Orange County, Los Angeles, and Inland Empire orders over $399 ship free. San Diego orders over $699 ship free. All other orders ship via UPS Ground. Orders usually ship in 1-2 days.",
      },
    },
    {
      "@type": "Question",
      name: "Can Mobile Janitorial Supply beat prices or price match?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, we are volume buyers of every product we sell and we are a true wholesale company. Save yourself some time and let us know what we need to beat and we will get it done.",
      },
    },
    {
      "@type": "Question",
      name: "Does Mobile Janitorial Supply offer payment options?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, we offer all credit cards and also payment by ongoing credit card authorization, cash, business check, in addition to credit terms for businesses. Credit terms only considered if $500.00 per month is spent.",
      },
    },
    {
      "@type": "Question",
      name: "How can I place an order?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can place an order by calling us at (714) 779-2640, faxing at (714) 779-7789, emailing orders@mobilejanitorialsupply.com, or ordering online at mobilejanitorialsupply.com.",
      },
    },
    {
      "@type": "Question",
      name: "What is the return policy at Mobile Janitorial Supply?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Any returns must be made within 7 days of receipt of the order. Returns due to customer error are subject to a 15% restocking charge, and the customer will be responsible for return freight. No returns or credit on any equipment that has been used or opened.",
      },
    },
  ],
};

export default function FAQ() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <TopBar />
      <Header />
      <CategoryNav />
      <main>
        <FAQPage />
      </main>
      <Footer />
    </>
  );
}
