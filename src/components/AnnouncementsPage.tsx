"use client";

import { useState } from "react";
import { Megaphone, TrendingUp, FileText, AlertTriangle, Calendar, ChevronRight, Filter } from "lucide-react";

type AnnouncementType = "all" | "price" | "vendor" | "notice";

interface Announcement {
  id: string;
  type: "price" | "vendor" | "notice";
  date: string;
  title: string;
  summary: string;
  body: string;
  vendor?: string;
  products?: string[];
  urgent?: boolean;
  pdf?: string;
}

// Announcements data — update this array to add/remove announcements
const announcements: Announcement[] = [
  {
    id: "1",
    type: "vendor",
    date: "Mar 27, 2026",
    title: "Sigma Commercial Bag — Resin Price Increase",
    summary: "Sigma Commercial Bag has issued a letter regarding upcoming resin cost increases affecting can liner and bag pricing.",
    body: "Sigma Commercial Bag has notified us of an upcoming price increase due to rising resin costs. This will affect can liners and commercial bag products. Please review the attached vendor letter for full details on the pricing adjustments and effective dates. We recommend placing orders at current pricing to lock in rates before the increase takes effect.",
    vendor: "Sigma Commercial Bag",
    products: ["Can Liners", "Trash Liners", "Commercial Bags"],
    urgent: true,
    pdf: "/announcements/sigma-resin-increase-032726.pdf",
  },
];

const typeConfig = {
  price: { label: "Price Update", icon: TrendingUp, color: "bg-amber-50 text-amber-700 border-amber-200", iconBg: "bg-amber-100", iconColor: "text-amber-600" },
  vendor: { label: "Vendor Letter", icon: FileText, color: "bg-blue-50 text-blue-700 border-blue-200", iconBg: "bg-blue-100", iconColor: "text-blue-600" },
  notice: { label: "Customer Notice", icon: Megaphone, color: "bg-purple-50 text-purple-700 border-purple-200", iconBg: "bg-purple-100", iconColor: "text-purple-600" },
};

export default function AnnouncementsPage() {
  const [filter, setFilter] = useState<AnnouncementType>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = filter === "all" ? announcements : announcements.filter(a => a.type === filter);

  return (
    <section className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <div className="bg-mjs-dark">
        <div className="max-w-[1100px] mx-auto px-4 pt-14 pb-24">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span>/</span>
            <span className="text-gray-400">Announcements</span>
          </div>
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-mjs-red/10 border border-mjs-red/20 rounded-full px-5 py-2 mb-6">
              <Megaphone className="w-4 h-4 text-mjs-red" />
              <span className="text-xs font-bold text-mjs-red uppercase tracking-widest">Announcements</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              Stay Informed
            </h1>
            <p className="text-gray-400 mt-4 text-lg leading-relaxed">
              Price updates, vendor letters, and important notices for our customers.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[900px] mx-auto px-4 -mt-12">
        {/* Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 mb-8 flex flex-wrap items-center gap-2">
          <Filter className="w-4 h-4 text-mjs-gray-400 mr-1" />
          {[
            { key: "all" as AnnouncementType, label: "All" },
            { key: "price" as AnnouncementType, label: "Price Updates" },
            { key: "vendor" as AnnouncementType, label: "Vendor Letters" },
            { key: "notice" as AnnouncementType, label: "Notices" },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs font-bold transition-all ${
                filter === f.key
                  ? "bg-mjs-red text-white"
                  : "bg-gray-50 text-mjs-gray-600 hover:bg-gray-100"
              }`}
            >
              {f.label}
            </button>
          ))}
          <span className="ml-auto text-[10px] text-mjs-gray-400">{filtered.length} announcement{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {filtered.map((a) => {
            const config = typeConfig[a.type];
            const TypeIcon = config.icon;
            const isExpanded = expandedId === a.id;

            return (
              <div
                key={a.id}
                className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
                  a.urgent ? "border-amber-300 ring-1 ring-amber-200" : "border-gray-100"
                }`}
              >
                {/* Urgent Banner */}
                {a.urgent && (
                  <div className="bg-amber-50 px-5 py-1.5 flex items-center gap-2 border-b border-amber-200">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Action Recommended</span>
                  </div>
                )}

                {/* Header — always visible */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : a.id)}
                  className="w-full flex items-start gap-4 p-5 text-left hover:bg-gray-50/50 transition-colors"
                >
                  <div className={`w-11 h-11 rounded-xl ${config.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <TypeIcon className={`w-5 h-5 ${config.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${config.color}`}>
                        {config.label}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-mjs-gray-400">
                        <Calendar className="w-3 h-3" />
                        {a.date}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-mjs-dark">{a.title}</h3>
                    <p className="text-xs text-mjs-gray-500 mt-1 leading-relaxed">{a.summary}</p>
                  </div>
                  <div className={`w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center flex-shrink-0 transition-transform ${isExpanded ? "rotate-90" : ""}`}>
                    <ChevronRight className="w-3.5 h-3.5 text-mjs-gray-400" />
                  </div>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-0">
                    <div className="border-t border-gray-100 pt-4 ml-15">
                      <div className="text-sm text-mjs-gray-600 leading-relaxed whitespace-pre-line">
                        {a.body}
                      </div>
                      {a.vendor && (
                        <div className="mt-4 flex items-center gap-2">
                          <span className="text-[10px] font-bold text-mjs-gray-400 uppercase">Vendor:</span>
                          <span className="text-xs font-semibold text-mjs-dark">{a.vendor}</span>
                        </div>
                      )}
                      {a.products && a.products.length > 0 && (
                        <div className="mt-3">
                          <span className="text-[10px] font-bold text-mjs-gray-400 uppercase block mb-1.5">Affected Products:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {a.products.map((p, i) => (
                              <span key={i} className="text-[10px] font-semibold bg-gray-50 border border-gray-200 text-mjs-gray-600 px-2.5 py-1 rounded-full">
                                {p}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {a.pdf && (
                        <div className="mt-5">
                          <a
                            href={a.pdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-mjs-red text-white font-bold text-xs px-5 py-2.5 rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <FileText className="w-4 h-4" />
                            View Vendor Letter (PDF)
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Megaphone className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <div className="text-sm font-bold text-mjs-gray-500">No announcements in this category</div>
            <button onClick={() => setFilter("all")} className="mt-3 text-xs text-mjs-red font-semibold hover:underline">View all announcements</button>
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-10 mb-12 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
          <div className="text-sm font-bold text-mjs-dark mb-1">Have questions about an announcement?</div>
          <p className="text-xs text-mjs-gray-500 mb-4">Our team is happy to help with pricing, availability, or product substitutions.</p>
          <div className="flex items-center justify-center gap-3">
            <a href="tel:7147792640" className="inline-flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2.5 text-xs font-bold text-mjs-dark hover:bg-gray-50 transition-colors">
              (714) 779-2640
            </a>
            <a href="/contact" className="inline-flex items-center gap-2 bg-mjs-red text-white rounded-lg px-4 py-2.5 text-xs font-bold hover:bg-red-700 transition-colors">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
