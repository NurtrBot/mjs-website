"use client";

import { useState } from "react";
import { Shield, Database, UserCheck, Globe, Cookie, RefreshCw, Link2, FileEdit, ChevronDown, Mail } from "lucide-react";

interface PolicySection {
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
}

const sections: PolicySection[] = [
  {
    icon: <Database className="w-5 h-5" />,
    title: "Information We Collect",
    content: (
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-mjs-dark text-sm mb-1">Log Data</h4>
          <p className="text-sm text-mjs-gray-600 leading-relaxed">When you visit our website, our servers may automatically log the standard data provided by your web browser. It may include your computer&apos;s Internet Protocol (IP) address, your browser type and version, the pages you visit, the time and date of your visit, the time spent on each page, and other details.</p>
        </div>
        <div>
          <h4 className="font-semibold text-mjs-dark text-sm mb-1">Device Data</h4>
          <p className="text-sm text-mjs-gray-600 leading-relaxed">We may also collect data about the device you&apos;re using to access our website. This data may include the device type, operating system, unique device identifiers, device settings, and geo-location data. What we collect can depend on the individual settings of your device and software. We recommend checking the policies of your device manufacturer or software provider to learn what information they make available to us.</p>
        </div>
        <div>
          <h4 className="font-semibold text-mjs-dark text-sm mb-1">Personal Information</h4>
          <p className="text-sm text-mjs-gray-600 leading-relaxed mb-2">We may ask for personal information, such as your:</p>
          <div className="grid grid-cols-2 gap-1.5">
            {["Name", "Email", "Social media profiles", "Date of birth", "Phone/mobile number", "Home/Mailing address", "Work address", "Payment information"].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-mjs-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-mjs-red flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Legal Bases for Processing",
    content: (
      <div className="space-y-3">
        <p className="text-sm text-mjs-gray-600 leading-relaxed">We will process your personal information lawfully, fairly and in a transparent manner. We collect and process information about you only where we have legal bases for doing so. These legal bases depend on the services you use and how you use them, meaning we collect and use your information only where:</p>
        <ul className="space-y-2">
          {[
            "It\u2019s necessary for the performance of a contract to which you are a party or to take steps at your request before entering into such a contract (for example, when we provide a service you request from us);",
            "It satisfies a legitimate interest (which is not overridden by your data protection interests), such as for research and development, to market and promote our services, and to protect our legal rights and interests;",
            "You give us consent to do so for a specific purpose (for example, you might consent to us sending you our newsletter); or",
            "We need to process your data to comply with a legal obligation.",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-mjs-gray-600 leading-relaxed">
              <div className="w-1.5 h-1.5 rounded-full bg-mjs-red flex-shrink-0 mt-2" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-sm text-mjs-gray-600 leading-relaxed">Where you consent to our use of information about you for a specific purpose, you have the right to change your mind at any time (but this will not affect any processing that has already taken place).</p>
        <p className="text-sm text-mjs-gray-600 leading-relaxed">We don&apos;t keep personal information for longer than is necessary. While we retain this information, we will protect it within commercially acceptable means to prevent loss and theft, as well as unauthorised access, disclosure, copying, use or modification. That said, we advise that no method of electronic transmission or storage is 100% secure and cannot guarantee absolute data security.</p>
      </div>
    ),
  },
  {
    icon: <FileEdit className="w-5 h-5" />,
    title: "Collection and Use of Information",
    content: (
      <div className="space-y-3">
        <p className="text-sm text-mjs-gray-600 leading-relaxed">We may collect, hold, use and disclose information for the following purposes and personal information will not be further processed in a manner that is incompatible with these purposes:</p>
        <ul className="space-y-2">
          {[
            "To enable you to customise or personalise your experience of our website;",
            "To enable you to access and use our website, associated applications and associated social media platforms;",
            "To contact and communicate with you;",
            "For internal record keeping and administrative purposes;",
            "For analytics, market research and business development, including to operate and improve our website;",
            "To run competitions and/or offer additional benefits to you;",
            "For advertising and marketing, including to send you promotional information about our products and services;",
            "To comply with our legal obligations and resolve any disputes that we may have; and",
            "To consider your employment application.",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-mjs-gray-600 leading-relaxed">
              <div className="w-1.5 h-1.5 rounded-full bg-mjs-red flex-shrink-0 mt-2" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    icon: <Globe className="w-5 h-5" />,
    title: "Disclosure to Third Parties",
    content: (
      <div className="space-y-3">
        <p className="text-sm text-mjs-gray-600 leading-relaxed">We may disclose personal information to:</p>
        <ul className="space-y-2">
          {[
            "Third party service providers for the purpose of enabling them to provide their services, including IT service providers, data storage, hosting and server providers, ad networks, analytics, error loggers, debt collectors, maintenance or problem-solving providers, marketing or advertising providers, professional advisors and payment systems operators;",
            "Our employees, contractors and/or related entities;",
            "Sponsors or promoters of any competition we run;",
            "Credit reporting agencies, courts, tribunals and regulatory authorities, in the event you fail to pay for goods or services we have provided to you;",
            "Courts, tribunals, regulatory authorities and law enforcement officers, as required by law;",
            "Third parties, including agents or sub-contractors, who assist us in providing information, products, services or direct marketing to you; and",
            "Third parties to collect and process data.",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-mjs-gray-600 leading-relaxed">
              <div className="w-1.5 h-1.5 rounded-full bg-mjs-red flex-shrink-0 mt-2" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    icon: <Globe className="w-5 h-5" />,
    title: "International Transfers of Personal Information",
    content: (
      <div className="space-y-3">
        <p className="text-sm text-mjs-gray-600 leading-relaxed">The personal information we collect is stored and processed in United States, or where we or our partners, affiliates and third-party providers maintain facilities. By providing us with your personal information, you consent to the disclosure to these overseas third parties.</p>
        <p className="text-sm text-mjs-gray-600 leading-relaxed">We will ensure that any transfer of personal information from countries in the European Economic Area (EEA) to countries outside the EEA will be protected by appropriate safeguards, for example by using standard data protection clauses approved by the European Commission, or the use of binding corporate rules or other legally accepted means.</p>
        <p className="text-sm text-mjs-gray-600 leading-relaxed">Where we transfer personal information from a non-EEA country to another country, you acknowledge that third parties in other jurisdictions may not be subject to similar data protection laws to the ones in our jurisdiction.</p>
      </div>
    ),
  },
  {
    icon: <UserCheck className="w-5 h-5" />,
    title: "Your Rights and Controlling Your Personal Information",
    content: (
      <div className="space-y-4">
        {[
          { label: "Choice and Consent", text: "By providing personal information to us, you consent to us collecting, holding, using and disclosing your personal information in accordance with this privacy policy. If you are under 16 years of age, you must have, and warrant to the extent permitted by law, that you have your parent or legal guardian\u2019s permission to access and use the website." },
          { label: "Information from Third Parties", text: "If we receive personal information about you from a third party, we will protect it as set out in this privacy policy. If you are a third party providing personal information about somebody else, you represent and warrant that you have such person\u2019s consent to provide the personal information to us." },
          { label: "Restrict", text: "You may choose to restrict the collection or use of your personal information. If you have previously agreed to us using your personal information for direct marketing purposes, you may change your mind at any time by contacting us." },
          { label: "Access and Data Portability", text: "You may request details of the personal information that we hold about you. You may request a copy in CSV format or other easily readable machine format. You may request that we erase the personal information we hold about you at any time. You may also request that we transfer this personal information to another third party." },
          { label: "Correction", text: "If you believe that any information we hold about you is inaccurate, out of date, incomplete, irrelevant or misleading, please contact us. We will take reasonable steps to correct any information found to be inaccurate, incomplete, misleading or out of date." },
          { label: "Notification of Data Breaches", text: "We will comply with laws applicable to us in respect of any data breach." },
          { label: "Complaints", text: "If you believe that we have breached a relevant data protection law and wish to make a complaint, please contact us and provide us with full details of the alleged breach. We will promptly investigate your complaint and respond to you, in writing, setting out the outcome of our investigation. You also have the right to contact a regulatory body or data protection authority." },
          { label: "Unsubscribe", text: "To unsubscribe from our e-mail database or opt-out of communications (including marketing communications), please contact us or opt-out using the opt-out facilities provided in the communication." },
        ].map((item) => (
          <div key={item.label}>
            <h4 className="font-semibold text-mjs-dark text-sm mb-1">{item.label}</h4>
            <p className="text-sm text-mjs-gray-600 leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: <Cookie className="w-5 h-5" />,
    title: "Cookies",
    content: (
      <p className="text-sm text-mjs-gray-600 leading-relaxed">We use &ldquo;cookies&rdquo; to collect information about you and your activity across our site. A cookie is a small piece of data that our website stores on your computer, and accesses each time you visit, so we can understand how you use our site. This helps us serve you content based on preferences you have specified. Please refer to our Cookie Policy for more information.</p>
    ),
  },
  {
    icon: <RefreshCw className="w-5 h-5" />,
    title: "Business Transfers",
    content: (
      <p className="text-sm text-mjs-gray-600 leading-relaxed">If we or our assets are acquired, or in the unlikely event that we go out of business or enter bankruptcy, we would include data among the assets transferred to any parties who acquire us. You acknowledge that such transfers may occur, and that any parties who acquire us may continue to use your personal information according to this policy.</p>
    ),
  },
  {
    icon: <Link2 className="w-5 h-5" />,
    title: "Limits of Our Policy",
    content: (
      <p className="text-sm text-mjs-gray-600 leading-relaxed">Our website may link to external sites that are not operated by us. Please be aware that we have no control over the content and policies of those sites, and cannot accept responsibility or liability for their respective privacy practices.</p>
    ),
  },
  {
    icon: <FileEdit className="w-5 h-5" />,
    title: "Changes to This Policy",
    content: (
      <div className="space-y-3">
        <p className="text-sm text-mjs-gray-600 leading-relaxed">At our discretion, we may change our privacy policy to reflect current acceptable practices. We will take reasonable steps to let users know about changes via our website. Your continued use of this site after any changes to this policy will be regarded as acceptance of our practices around privacy and personal information.</p>
        <p className="text-sm text-mjs-gray-600 leading-relaxed">If we make a significant change to this privacy policy, for example changing a lawful basis on which we process your personal information, we will ask you to re-consent to the amended privacy policy.</p>
      </div>
    ),
  },
];

function Accordion({ section, isOpen, toggle }: { section: PolicySection; isOpen: boolean; toggle: () => void }) {
  return (
    <div className={`bg-white rounded-xl border transition-all ${isOpen ? "border-mjs-red/20 shadow-md shadow-red-100/50" : "border-gray-100"}`}>
      <button onClick={toggle} className="w-full flex items-center gap-4 px-6 py-5 text-left">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${isOpen ? "bg-mjs-red text-white" : "bg-mjs-gray-50 text-mjs-gray-400"}`}>
          {section.icon}
        </div>
        <h3 className={`flex-1 font-semibold text-sm transition-colors ${isOpen ? "text-mjs-red" : "text-mjs-dark"}`}>
          {section.title}
        </h3>
        <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 text-mjs-red" : "text-mjs-gray-400"}`} />
      </button>
      {isOpen && (
        <div className="px-6 pb-6 pl-20">
          {section.content}
        </div>
      )}
    </div>
  );
}

export default function PrivacyPolicyPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-mjs-gray-50 min-h-screen">
      {/* Hero */}
      <div className="bg-mjs-dark">
        <div className="max-w-[1400px] mx-auto px-4 py-16">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span>/</span>
            <span className="text-gray-400">Privacy Policy</span>
          </div>
          <div className="text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Shield className="w-8 h-8 text-mjs-gold" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Privacy Policy</h1>
            <p className="text-gray-400 mt-3">
              Your privacy is important to us. It is Mobile Janitorial Supply&apos;s policy to respect your privacy regarding any information we may collect from you across our website and other sites we own and operate.
            </p>
          </div>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="max-w-[900px] mx-auto px-4 -mt-5">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {sections.map((s, i) => (
              <button
                key={s.title}
                onClick={() => setOpenIndex(i)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all ${
                  openIndex === i
                    ? "bg-mjs-red text-white shadow-sm"
                    : "bg-mjs-gray-50 text-mjs-gray-500 hover:bg-red-50 hover:text-mjs-red"
                }`}
              >
                {s.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Accordion Sections */}
      <div className="max-w-[900px] mx-auto px-4 py-10">
        <div className="space-y-3">
          {sections.map((section, i) => (
            <Accordion
              key={section.title}
              section={section}
              isOpen={openIndex === i}
              toggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>

      {/* Contact CTA */}
      <div className="max-w-[900px] mx-auto px-4 pb-16">
        <div className="bg-mjs-dark rounded-2xl p-8 md:p-10 text-center">
          <h2 className="text-xl font-bold text-white mb-2">Questions About Your Privacy?</h2>
          <p className="text-sm text-gray-400 mb-6 max-w-md mx-auto">
            If you have any questions or concerns about our privacy practices, don&apos;t hesitate to reach out.
          </p>
          <a
            href="mailto:orders@mobilejanitorialsupply.com"
            className="inline-flex items-center gap-2 bg-mjs-red text-white font-semibold px-8 py-3 rounded-lg text-sm hover:bg-red-700 transition-colors"
          >
            <Mail className="w-4 h-4" />
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
}
