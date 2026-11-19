"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Download, FileText, Search } from "lucide-react";
import { sdsIndex, type SDSEntry } from "@/data/sds-index";
import { GuideSection, Callout, GuideCta, Eyebrow } from "@/components/guides/GuideKit";

const TINT = "#dae2fd";

const FORMS = [
  { name: "Credit application", file: "/forms/credit-application.pdf", blurb: "Apply for net-30 terms." },
  { name: "Credit card authorization", file: "/forms/credit-card-authorization-form.pdf", blurb: "Keep a card on file for phone orders." },
  { name: "Customer order form", file: "/forms/customer-order-form.pdf", blurb: "Fax or email a written order." },
  { name: "New customer contact form", file: "/forms/new-customer-contact-form.pdf", blurb: "Set up a new account." },
  { name: "California resale certificate", file: "/forms/Resale-certificate-california.pdf", blurb: "For tax-exempt resale purchases." },
];

// One row per product name; some sheets exist as two files
function groupSheets(list: SDSEntry[]) {
  const map = new Map<string, { name: string; sku: string; files: string[] }>();
  for (const s of list) {
    const k = s.name.trim().toLowerCase();
    const g = map.get(k) || { name: s.name, sku: s.sku, files: [] };
    if (!g.files.includes(s.file)) g.files.push(s.file);
    map.set(k, g);
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export default function ResourcesPage() {
  const [q, setQ] = useState("");
  const [letter, setLetter] = useState("");
  const all = useMemo(() => groupSheets(sdsIndex), []);
  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (t.length < 2) return [];
    return all.filter((s) => s.name.toLowerCase().includes(t) || s.sku.toLowerCase().includes(t)).slice(0, 24);
  }, [q, all]);
  const firstLetter = (n: string) => (/[A-Z]/i.test(n[0]) ? n[0].toUpperCase() : "#");
  const letters = useMemo(() => Array.from(new Set(all.map((s) => firstLetter(s.name)))).sort(), [all]);
  const byLetter = all.filter((s) => firstLetter(s.name) === letter);
  const searching = q.trim().length >= 2;

  return (
    <article className="bg-white">
      {/* ── Simple centred search ─────────────────────────────── */}
      <header style={{ background: TINT }}>
        <div className="max-w-[760px] mx-auto px-4 pt-10 pb-14 md:pt-14 md:pb-20 text-center">
          <div className="relative mx-auto w-[120px] h-[90px] md:w-[150px] md:h-[112px]">
            <Image src="/images/guides/sds-icon.webp" alt="" fill priority sizes="150px" className="object-contain" />
          </div>
          <h1 className="mt-4 text-[2.2rem] md:text-[3rem] leading-[1.02] font-black tracking-tight text-mjs-dark text-balance">Safety Data Sheets</h1>
          <p className="mt-3 text-[16px] md:text-[17px] text-mjs-dark/70">Search {all.length} sheets by product name or the part number on the label.</p>

          <label className="relative block mt-7 text-left">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-mjs-dark/40" />
            <input
              id="sds-search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="e.g. Strike Bac, 91101, degreaser"
              autoComplete="off"
              className="w-full rounded-full bg-white py-4 pr-5 text-[17px] font-semibold text-mjs-dark shadow-[0_6px_24px_rgba(23,32,52,0.10)] outline-none focus:ring-2 focus:ring-mjs-dark/30"
              style={{ paddingLeft: 52 }}
            />
            {searching && (
              <ul className="absolute left-0 right-0 top-full mt-2 z-20 max-h-[360px] overflow-y-auto rounded-2xl bg-white shadow-[0_12px_40px_rgba(23,32,52,0.18)] divide-y divide-mjs-dark/8 list-none m-0 p-0">
                {results.map((s) => (
                  <li key={s.name} className="flex flex-wrap items-center gap-3 px-4 py-3">
                    <FileText className="w-5 h-5 text-mjs-dark/40 shrink-0" />
                    <div className="min-w-0 flex-1"><p className="text-[14.5px] font-black text-mjs-dark leading-snug">{s.name}</p><p className="text-[12px] text-mjs-dark/55">Part # {s.sku}</p></div>
                    {s.files.map((f, i) => <a key={f} href={f} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-mjs-dark px-3.5 py-1.5 text-[12.5px] font-black text-white hover:bg-black"><Download className="w-3.5 h-3.5" /> {s.files.length > 1 ? `PDF ${i + 1}` : "Download"}</a>)}
                  </li>
                ))}
                {results.length === 0 && <li className="px-4 py-6 text-center text-[14.5px] text-mjs-dark/60">Nothing matches “{q}”. Try fewer words, or the part number from the label.</li>}
                {results.length === 24 && <li className="px-4 py-2 text-[12px] text-mjs-dark/50 text-center">Showing the first 24. Keep typing to narrow it down.</li>}
              </ul>
            )}
          </label>
          <p className="mt-4 text-[13px] text-mjs-dark/55">Can&apos;t find one? Call (714) 779-2640 and we&apos;ll email it the same day.</p>
        </div>
      </header>

      {/* ── Browse by letter (nothing listed until a letter is tapped) ── */}
      <section id="browse" className="scroll-mt-14">
        <div className="max-w-[1100px] mx-auto px-4 py-14 md:py-20 text-center">
          <h2 className="text-[1.9rem] md:text-[2.4rem] font-black tracking-tight text-mjs-dark">Browse every sheet, A to Z</h2>
          <p className="mt-3 mx-auto text-[16px] md:text-[17px] text-mjs-dark/70 leading-relaxed">
            Cal/OSHA requires a current SDS for every hazardous chemical on site, where workers can reach it.<br className="hidden md:block" />
            Print the sheets for what you stock and keep them in one binder.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {letters.map((l) => (
              <button key={l} type="button" onClick={() => setLetter(letter === l ? "" : l)} aria-pressed={letter === l}
                className={`h-11 min-w-11 rounded-full px-4 text-[14px] font-black transition-colors ${letter === l ? "bg-mjs-dark text-white" : "bg-white text-mjs-dark shadow-[0_2px_10px_rgba(23,32,52,0.08)] hover:bg-mjs-gray-100"}`}>
                {l}
              </button>
            ))}
          </div>
          {letter ? (
            <ul className="mt-8 flex flex-wrap justify-center gap-2 list-none m-0 p-0">
              {byLetter.map((s) => (
                <li key={s.name}>
                  <a href={s.files[0]} target="_blank" rel="noopener noreferrer" title={`Part # ${s.sku}`}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[13.5px] font-bold text-mjs-dark shadow-[0_2px_10px_rgba(23,32,52,0.08)] hover:text-mjs-red hover:shadow-[0_4px_16px_rgba(23,32,52,0.14)] transition-shadow">
                    <FileText className="w-3.5 h-3.5 text-mjs-dark/40" />
                    <span className="max-w-[44ch] truncate">{s.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 text-[13px] text-mjs-dark/50">Tap a letter to see those sheets.</p>
          )}
        </div>
      </section>

      {/* ── Forms ─────────────────────────────────────────────── */}
      <GuideSection id="forms" title="Customer forms" intro="Download, fill in, and email or bring them to the counter." tint="#f7f8fa">
        <ul className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 list-none m-0 p-0">
          {FORMS.map((f) => (
            <li key={f.file}><a href={f.file} download className="group flex h-full flex-col rounded-3xl bg-white p-5">
              <Eyebrow>PDF</Eyebrow>
              <span className="text-[16px] font-black leading-snug text-mjs-dark group-hover:text-mjs-red">{f.name}</span>
              <span className="mt-1 text-[13px] text-mjs-dark/60">{f.blurb}</span>
              <span className="mt-auto pt-4 inline-flex items-center gap-1.5 text-[13px] font-black text-mjs-dark"><Download className="w-4 h-4" /> Download</span>
            </a></li>
          ))}
        </ul>
        <div className="mt-5"><Callout kind="tip" title="Need a sheet we don't list?">If a product you bought from us isn&apos;t here, call and we&apos;ll email the SDS the same day.</Callout></div>
      </GuideSection>

      <GuideCta title="Opening an account?" text="Send the credit application and resale certificate together and we'll set up net-30 terms and tax-exempt purchasing at the same time." href="/contact" label="Contact us" />
    </article>
  );
}
