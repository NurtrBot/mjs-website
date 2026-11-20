"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Download, FileText, ChevronDown, ChevronUp, Building2, Check, Loader2, AlertCircle } from "lucide-react";
import type { Binder, BinderChemical } from "@/lib/sds";

/*
 * My SDS Binder (account dashboard tab). One row per chemical the customer
 * has bought, with the matched sheet, its revision date, and a "View purchases"
 * expander showing dates, order numbers, quantities and buildings.
 * Filter by building, search by name or item number, download all sheets.
 */

interface Props {
  customerId: number;
  customer?: { email?: string; firstName?: string; lastName?: string; company?: string };
  initialBuilding?: string | null;
  requestSku?: string | null; // ?request=SKU from the email → auto-open the request for that item
}

const fmt = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const fmtRev = (iso: string | null) => (iso ? new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : null);

export default function SdsBinderTab({ customerId, customer, initialBuilding, requestSku }: Props) {
  const [binder, setBinder] = useState<Binder | null>(null);
  const [loading, setLoading] = useState(true);
  const [building, setBuilding] = useState<string>(initialBuilding || "All buildings");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<Set<string>>(new Set());
  const [requested, setRequested] = useState<Set<string>>(new Set());
  const [requesting, setRequesting] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/customers/sds-binder?customerId=${customerId}`)
      .then(r => r.json())
      .then((d: Binder) => setBinder({ chemicals: d.chemicals || [], buildings: d.buildings || [] }))
      .catch(() => setBinder({ chemicals: [], buildings: [] }))
      .finally(() => setLoading(false));
  }, [customerId]);

  useEffect(() => { if (initialBuilding) setBuilding(initialBuilding); }, [initialBuilding]);

  const rows = useMemo(() => {
    if (!binder) return [];
    const needle = q.trim().toLowerCase();
    return binder.chemicals
      .filter(c => building === "All buildings" || c.buildings.includes(building))
      .filter(c => !needle || c.name.toLowerCase().includes(needle) || c.sku.toLowerCase().includes(needle));
  }, [binder, building, q]);

  const withSheets = rows.filter(r => r.sds);
  const bundleUrl = withSheets.length
    ? `/api/sds/bundle?skus=${encodeURIComponent(withSheets.map(r => r.sku).join(","))}&name=${encodeURIComponent(building === "All buildings" ? "All buildings" : building)}`
    : null;

  async function requestSds(c: BinderChemical) {
    setRequesting(c.sku);
    try {
      await fetch("/api/sds/request", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sku: c.sku, productName: c.name, customerId, email: customer?.email, name: [customer?.firstName, customer?.lastName].filter(Boolean).join(" "), company: customer?.company }),
      });
      setRequested(prev => new Set(prev).add(c.sku));
    } finally { setRequesting(null); }
  }

  // Deep link from the email: /account?tab=sds&request=SKU
  useEffect(() => {
    if (!requestSku || !binder) return;
    const c = binder.chemicals.find(x => x.sku === requestSku.toUpperCase());
    if (c && !c.sds && !requested.has(c.sku)) requestSds(c);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestSku, binder]);

  const toggle = (sku: string) => setOpen(prev => { const n = new Set(prev); if (n.has(sku)) n.delete(sku); else n.add(sku); return n; });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
        <div className="mr-auto">
          <h2 className="text-sm font-bold text-mjs-dark flex items-center gap-2"><FileText className="w-4 h-4 text-mjs-red" /> My SDS Binder</h2>
          <p className="text-xs text-mjs-gray-400 mt-0.5">Safety data sheets for every chemical you&rsquo;ve purchased, matched to the exact product.</p>
        </div>
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-mjs-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Product name or item #" className="h-9 w-56 rounded-lg border border-gray-200 pl-8 pr-3 text-xs outline-none focus:border-mjs-red" />
        </div>
        <div className="relative">
          <Building2 className="w-3.5 h-3.5 text-mjs-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select value={building} onChange={e => setBuilding(e.target.value)} className="h-9 appearance-none rounded-lg border border-gray-200 bg-white pl-8 pr-8 text-xs font-semibold text-mjs-dark outline-none focus:border-mjs-red">
            <option>All buildings</option>
            {(binder?.buildings || []).map(b => <option key={b}>{b}</option>)}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-mjs-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        {bundleUrl ? (
          <a href={bundleUrl} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-mjs-red px-3.5 text-xs font-bold text-white hover:bg-mjs-red-dark transition-colors whitespace-nowrap">
            <Download className="w-3.5 h-3.5" /> Download all sheets ({withSheets.length})
          </a>
        ) : (
          <span className="inline-flex h-9 items-center rounded-lg bg-mjs-gray-100 px-3.5 text-xs font-bold text-mjs-gray-400 whitespace-nowrap">Download all sheets</span>
        )}
      </div>

      {loading ? (
        <div className="divide-y divide-gray-50" aria-hidden="true">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="px-6 py-4 flex items-center gap-4 animate-pulse">
              <div className="h-12 w-12 rounded-lg bg-mjs-gray-100" />
              <div className="flex-1 space-y-2"><div className="h-3 w-2/5 rounded bg-mjs-gray-100" /><div className="h-3 w-1/4 rounded bg-mjs-gray-100" /></div>
              <div className="h-8 w-28 rounded-lg bg-mjs-gray-100" />
            </div>
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="px-6 py-16 text-center">
          <FileText className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-sm font-semibold text-mjs-gray-600">{binder?.chemicals.length ? "No chemicals match that filter" : "No chemicals purchased yet"}</p>
          <p className="text-xs text-mjs-gray-400 mt-1 max-w-sm mx-auto">Sheets appear here automatically after you order a chemical. Need one now? Browse the full library under Forms &amp; SDS.</p>
          <a href="/resources" className="inline-block mt-4 text-xs font-bold text-mjs-red hover:underline">Browse all SDS sheets &rarr;</a>
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {rows.map(c => {
            const isOpen = open.has(c.sku);
            const rev = fmtRev(c.sds?.revised || null);
            return (
              <div key={c.sku}>
                <div className="px-6 py-3.5 flex items-center gap-4 hover:bg-mjs-gray-50/50 transition-colors">
                  <div className="h-12 w-12 shrink-0 rounded-lg bg-mjs-gray-50 overflow-hidden flex items-center justify-center">
                    {c.image ? <img src={c.image} alt="" className="h-full w-full object-contain" /> : <FileText className="w-5 h-5 text-mjs-gray-300" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-mjs-dark truncate">{c.slug ? <a href={`/product/${c.slug}`} className="hover:text-mjs-red">{c.name}</a> : c.name}</div>
                    <div className="text-[11.5px] text-mjs-gray-400 mt-0.5 flex flex-wrap items-center gap-x-2">
                      <span>Item {c.sku}</span><span className="text-gray-200">|</span>
                      <span>Last purchased {fmt(c.lastDate)}</span>
                      {rev && <><span className="text-gray-200">|</span><span>Sheet revised {rev}</span></>}
                      {!c.sds && <><span className="text-gray-200">|</span><span className="inline-flex items-center gap-1 text-amber-600 font-semibold"><AlertCircle className="w-3 h-3" /> Sheet not linked yet</span></>}
                    </div>
                  </div>
                  <button onClick={() => toggle(c.sku)} className="text-xs text-mjs-gray-400 hover:text-mjs-dark font-medium inline-flex items-center gap-1 whitespace-nowrap">
                    {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />} {c.purchases.length} purchase{c.purchases.length === 1 ? "" : "s"}
                  </button>
                  {c.sds ? (
                    <a href={c.sds.url} target="_blank" rel="noopener noreferrer" className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-mjs-red px-3 text-xs font-bold text-white hover:bg-mjs-red-dark transition-colors whitespace-nowrap">
                      <Download className="w-3.5 h-3.5" /> Download SDS
                    </a>
                  ) : requested.has(c.sku) ? (
                    <span className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-green-50 px-3 text-xs font-bold text-green-700 whitespace-nowrap"><Check className="w-3.5 h-3.5" /> Requested</span>
                  ) : (
                    <button onClick={() => requestSds(c)} disabled={requesting === c.sku} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-gray-200 px-3 text-xs font-bold text-mjs-dark hover:border-mjs-red hover:text-mjs-red transition-colors whitespace-nowrap disabled:opacity-60">
                      {requesting === c.sku ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null} Request SDS
                    </button>
                  )}
                </div>
                {isOpen && (
                  <div className="px-6 pb-4">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-[10.5px] font-semibold text-mjs-gray-400 uppercase tracking-wider">
                          <th className="text-left py-2 pl-16">Date</th><th className="text-left py-2">Order #</th><th className="text-right py-2">Qty</th><th className="text-left py-2 pl-6">Building</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {c.purchases.map((p, i) => (
                          <tr key={`${p.orderId}-${i}`}>
                            <td className="py-2 pl-16 text-mjs-gray-600">{fmt(p.date)}</td>
                            <td className="py-2 font-semibold text-mjs-dark">{p.orderId}</td>
                            <td className="py-2 text-right text-mjs-gray-600">{p.qty}</td>
                            <td className="py-2 pl-6 text-mjs-gray-600">{p.building}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
