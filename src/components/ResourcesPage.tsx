"use client";

import { useState, useRef, useEffect } from "react";
import { FileText, CreditCard, ClipboardList, UserPlus, FileCheck, Search, Loader2, Download, FlaskConical } from "lucide-react";
import { sdsIndex, type SDSEntry } from "@/data/sds-index";

const forms = [
  { name: "Credit Application", file: "/forms/credit-application.pdf", icon: CreditCard, color: "bg-blue-500" },
  { name: "Credit Card Authorization", file: "/forms/credit-card-authorization-form.pdf", icon: FileCheck, color: "bg-emerald-500" },
  { name: "Customer Order Form", file: "/forms/customer-order-form.pdf", icon: ClipboardList, color: "bg-amber-500" },
  { name: "New Customer Contact", file: "/forms/new-customer-contact-form.pdf", icon: UserPlus, color: "bg-purple-500" },
  { name: "Resale Certificate (CA)", file: "/forms/Resale-certificate-california.pdf", icon: FileText, color: "bg-mjs-red" },
];

export default function ResourcesPage() {
  const [query, setQuery] = useState("");
  const [selectedSheet, setSelectedSheet] = useState<SDSEntry | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filtered = query.length >= 2
    ? sdsIndex.filter(
        (s) =>
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.sku.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 15)
    : [];

  const handleSelect = (sheet: SDSEntry) => {
    setQuery(sheet.name);
    setShowDropdown(false);
    setLoading(true);
    setSelectedSheet(null);
    setTimeout(() => {
      setLoading(false);
      setSelectedSheet(sheet);
    }, 800);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <section className="bg-mjs-gray-50 min-h-screen">
      {/* Hero */}
      <div className="bg-mjs-dark">
        <div className="max-w-[1400px] mx-auto px-4 py-16">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span>/</span>
            <span className="text-gray-400">Forms &amp; SDS</span>
          </div>
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Forms &amp; SDS Sheets</h1>
            <p className="text-gray-400 mt-3">
              Download new customer forms and search our library of {sdsIndex.length.toLocaleString()} Safety Data Sheets.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-4 -mt-8">
        {/* ═══ NEW CUSTOMER FORMS ═══ */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="text-center mb-6">
            <span className="inline-block bg-red-50 text-mjs-red text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2">
              Downloads
            </span>
            <h2 className="text-xl font-bold text-mjs-dark">New Customer Forms</h2>
            <p className="text-sm text-mjs-gray-400 mt-1">Download, print, fill out and submit to get started.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {forms.map((form) => (
              <a
                key={form.file}
                href={form.file}
                download
                className="group flex flex-col items-center gap-3 bg-mjs-gray-50 rounded-xl p-5 hover:bg-white hover:shadow-lg hover:border-mjs-red/20 border border-transparent transition-all text-center"
              >
                <div className={`w-12 h-12 rounded-xl ${form.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <form.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-semibold text-mjs-dark group-hover:text-mjs-red transition-colors leading-tight">{form.name}</span>
                <span className="text-[10px] text-mjs-gray-400 font-medium">PDF Download</span>
              </a>
            ))}
          </div>
        </div>

        {/* ═══ SDS SHEET FINDER ═══ */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-12">
          <div className="text-center mb-8">
            <span className="inline-block bg-blue-50 text-blue-600 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2">
              {sdsIndex.length.toLocaleString()} Sheets Available
            </span>
            <h2 className="text-xl font-bold text-mjs-dark">SDS Sheet Finder</h2>
            <p className="text-sm text-mjs-gray-400 mt-1">Search by product name or part number to find and download safety data sheets.</p>
          </div>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <div className="relative">
              <Search className="w-5 h-5 text-mjs-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setShowDropdown(true); setSelectedSheet(null); }}
                onFocus={() => query.length >= 2 && setShowDropdown(true)}
                placeholder="Search by product name or part number..."
                className="w-full pl-12 pr-4 py-4 text-sm bg-mjs-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-mjs-red/20 focus:border-mjs-red transition-all"
              />
            </div>

            {/* Dropdown Suggestions */}
            {showDropdown && filtered.length > 0 && (
              <div ref={dropdownRef} className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-20 max-h-[350px] overflow-y-auto">
                {filtered.map((sheet, i) => (
                  <button
                    key={`${sheet.sku}-${i}`}
                    onClick={() => handleSelect(sheet)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-left border-b border-gray-50 last:border-0"
                  >
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <FlaskConical className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-mjs-dark truncate">{sheet.name}</div>
                      <div className="text-[11px] text-mjs-gray-400">Part #: {sheet.sku}</div>
                    </div>
                  </button>
                ))}
                {filtered.length === 15 && (
                  <div className="px-4 py-2 text-[10px] text-mjs-gray-400 text-center bg-mjs-gray-50">
                    Showing top 15 results — type more to narrow down
                  </div>
                )}
              </div>
            )}

            {showDropdown && query.length >= 2 && filtered.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-6 text-center z-20">
                <p className="text-sm text-mjs-gray-400">No matching SDS sheets found for &ldquo;{query}&rdquo;. Try a different search term or part number.</p>
              </div>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center gap-3 mt-8">
              <Loader2 className="w-5 h-5 text-mjs-red animate-spin" />
              <span className="text-sm text-mjs-gray-500 font-medium">Loading SDS sheet...</span>
            </div>
          )}

          {/* Result */}
          {selectedSheet && !loading && (
            <div className="max-w-xl mx-auto mt-8">
              <div className="bg-mjs-gray-50 rounded-xl border border-gray-200 p-5 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-blue-500 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-mjs-dark">{selectedSheet.name}</div>
                  <div className="text-xs text-mjs-gray-400 mt-0.5">Part #: {selectedSheet.sku}</div>
                </div>
                <a
                  href={selectedSheet.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-mjs-red text-white font-semibold px-5 py-2.5 rounded-lg text-sm hover:bg-red-700 transition-colors flex-shrink-0"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
