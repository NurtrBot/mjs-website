"use client";

import { useState } from "react";
import { FileText, ScrollText, ShieldAlert, Scale, AlertTriangle, CheckCircle, Link2, RefreshCw, Gavel, ChevronDown, Mail } from "lucide-react";

interface TermsSection {
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
}

const sections: TermsSection[] = [
  {
    icon: <ScrollText className="w-5 h-5" />,
    title: "Terms",
    content: (
      <p className="text-sm text-mjs-gray-600 leading-relaxed">By accessing the website at mobilejanitorialsupply.com, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law.</p>
    ),
  },
  {
    icon: <CheckCircle className="w-5 h-5" />,
    title: "Use License",
    content: (
      <div className="space-y-3">
        <p className="text-sm text-mjs-gray-600 leading-relaxed">Permission is granted to temporarily download one copy of the materials (information or software) on Mobile Janitorial Supply&apos;s website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
        <ul className="space-y-2">
          {[
            "Modify or copy the materials;",
            "Use the materials for any commercial purpose, or for any public display (commercial or non-commercial);",
            "Attempt to decompile or reverse engineer any software contained on Mobile Janitorial Supply\u2019s website;",
            "Remove any copyright or other proprietary notations from the materials; or",
            "Transfer the materials to another person or \u201cmirror\u201d the materials on any other server.",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-mjs-gray-600 leading-relaxed">
              <div className="w-1.5 h-1.5 rounded-full bg-mjs-red flex-shrink-0 mt-2" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-sm text-mjs-gray-600 leading-relaxed">This license shall automatically terminate if you violate any of these restrictions and may be terminated by Mobile Janitorial Supply at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.</p>
      </div>
    ),
  },
  {
    icon: <ShieldAlert className="w-5 h-5" />,
    title: "Disclaimer",
    content: (
      <div className="space-y-3">
        <p className="text-sm text-mjs-gray-600 leading-relaxed">The materials on Mobile Janitorial Supply&apos;s website are provided on an &ldquo;as is&rdquo; basis. Mobile Janitorial Supply makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
        <p className="text-sm text-mjs-gray-600 leading-relaxed">Further, Mobile Janitorial Supply does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.</p>
      </div>
    ),
  },
  {
    icon: <Scale className="w-5 h-5" />,
    title: "Limitations",
    content: (
      <p className="text-sm text-mjs-gray-600 leading-relaxed">In no event shall Mobile Janitorial Supply or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Mobile Janitorial Supply&apos;s website, even if Mobile Janitorial Supply or a Mobile Janitorial Supply authorized representative has been notified orally or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.</p>
    ),
  },
  {
    icon: <AlertTriangle className="w-5 h-5" />,
    title: "Accuracy of Materials",
    content: (
      <p className="text-sm text-mjs-gray-600 leading-relaxed">The materials appearing on Mobile Janitorial Supply&apos;s website could include technical, typographical, or photographic errors. Mobile Janitorial Supply does not warrant that any of the materials on its website are accurate, complete or current. Mobile Janitorial Supply may make changes to the materials contained on its website at any time without notice. However Mobile Janitorial Supply does not make any commitment to update the materials.</p>
    ),
  },
  {
    icon: <Link2 className="w-5 h-5" />,
    title: "Links",
    content: (
      <p className="text-sm text-mjs-gray-600 leading-relaxed">Mobile Janitorial Supply has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Mobile Janitorial Supply of the site. Use of any such linked website is at the user&apos;s own risk.</p>
    ),
  },
  {
    icon: <RefreshCw className="w-5 h-5" />,
    title: "Modifications",
    content: (
      <p className="text-sm text-mjs-gray-600 leading-relaxed">Mobile Janitorial Supply may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.</p>
    ),
  },
  {
    icon: <Gavel className="w-5 h-5" />,
    title: "Governing Law",
    content: (
      <p className="text-sm text-mjs-gray-600 leading-relaxed">These terms and conditions are governed by and construed in accordance with the laws of California and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.</p>
    ),
  },
];

function Accordion({ section, isOpen, toggle }: { section: TermsSection; isOpen: boolean; toggle: () => void }) {
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

export default function TermsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-mjs-gray-50 min-h-screen">
      {/* Hero */}
      <div className="bg-mjs-dark">
        <div className="max-w-[1400px] mx-auto px-4 py-16">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span>/</span>
            <span className="text-gray-400">Terms &amp; Conditions</span>
          </div>
          <div className="text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <FileText className="w-8 h-8 text-mjs-gold" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Terms &amp; Conditions</h1>
            <p className="text-gray-400 mt-3">
              Please read these terms of service carefully before using the Mobile Janitorial Supply website.
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
          <h2 className="text-xl font-bold text-white mb-2">Questions About Our Terms?</h2>
          <p className="text-sm text-gray-400 mb-6 max-w-md mx-auto">
            If you have any questions about these terms and conditions, please don&apos;t hesitate to contact us.
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
