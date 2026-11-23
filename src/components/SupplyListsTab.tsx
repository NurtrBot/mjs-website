"use client";

import { useEffect, useMemo, useState } from "react";
import { ClipboardList, Plus, Trash2, ShoppingCart, Check, Minus, Building2, Save, Search, FileText, Loader2, X, ChevronDown } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { SupplyList, SupplyListItem } from "@/app/api/customers/lists/route";
import type { ProductData } from "@/data/products";
import { FirstVisitNote } from "@/components/DashboardTour";

/*
 * Supply Lists (account dashboard tab). Named reorder lists tied to a building
 * ("Monday Route" → Anaheim Warehouse). The buyer can change this week's
 * quantities and add the list to the cart without touching the saved usual
 * quantities; "Save changes to list" persists them. Lists live in a
 * BigCommerce customer metafield via /api/customers/lists.
 */

interface Props {
  customerId: number;
  buildings: string[];                       // known ship-to buildings (from order history)
  seed?: { name: string; building: string; items: { sku: string; qty: number }[] } | null; // "Save as list" from an order
  onSeedConsumed?: () => void;
  onViewBinder: (building: string) => void;
}

const newId = () => Math.random().toString(36).slice(2, 10);

export default function SupplyListsTab({ customerId, buildings, seed, onSeedConsumed, onViewBinder }: Props) {
  const { addItem } = useCart();
  const [lists, setLists] = useState<SupplyList[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draftQty, setDraftQty] = useState<Record<string, number>>({}); // this-week quantities, per SKU
  const [dirty, setDirty] = useState(false);
  const [addedAll, setAddedAll] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [q, setQ] = useState("");
  const [results, setResults] = useState<ProductData[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetch(`/api/customers/lists?customerId=${customerId}`)
      .then(r => r.json())
      .then(d => { const ls: SupplyList[] = d.lists || []; setLists(ls); if (ls[0]) setActiveId(ls[0].id); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [customerId]);

  // A list handed in from Order History ("Save as supply list")
  useEffect(() => {
    if (!seed || loading) return;
    const list: SupplyList = { id: newId(), name: seed.name, building: seed.building, items: seed.items.map(i => ({ sku: i.sku, qty: i.qty, name: i.sku })), updatedAt: new Date().toISOString() };
    const next = [list, ...lists];
    persist(next).then(saved => { const l = saved.find(x => x.id === list.id) || saved[0]; if (l) setActiveId(l.id); });
    onSeedConsumed?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed, loading]);

  const active = useMemo(() => lists.find(l => l.id === activeId) || null, [lists, activeId]);

  useEffect(() => {
    if (!active) return;
    setDraftQty(Object.fromEntries(active.items.map(i => [i.sku, i.qty])));
    setDirty(false); setEditingName(false);
  }, [active?.id, active?.updatedAt]); // eslint-disable-line react-hooks/exhaustive-deps

  async function persist(next: SupplyList[]): Promise<SupplyList[]> {
    setSaving(true);
    try {
      const r = await fetch(`/api/customers/lists?customerId=${customerId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lists: next }) });
      const d = await r.json();
      const saved: SupplyList[] = d.lists || next;
      setLists(saved);
      return saved;
    } catch { setLists(next); return next; } finally { setSaving(false); }
  }

  function update(partial: Partial<SupplyList>) {
    if (!active) return;
    const next = lists.map(l => (l.id === active.id ? { ...l, ...partial } : l));
    return persist(next);
  }

  function createList() {
    const list: SupplyList = { id: newId(), name: `New list ${lists.length + 1}`, building: buildings[0] || "", items: [], updatedAt: new Date().toISOString() };
    persist([list, ...lists]).then(() => { setActiveId(list.id); setEditingName(true); });
  }

  function removeList() {
    if (!active || !confirm(`Delete "${active.name}"?`)) return;
    const next = lists.filter(l => l.id !== active.id);
    persist(next).then(() => setActiveId(next[0]?.id || null));
  }

  function setQty(sku: string, qty: number) { setDraftQty(p => ({ ...p, [sku]: Math.max(1, qty) })); setDirty(true); }
  function removeItem(sku: string) { if (!active) return; update({ items: active.items.filter(i => i.sku !== sku) }); }
  function addProduct(p: ProductData) {
    if (!active) return;
    if (active.items.some(i => i.sku.toUpperCase() === p.sku.toUpperCase())) return;
    update({ items: [...active.items, { sku: p.sku, qty: 1, name: p.cardTitle, image: p.images?.[0], slug: p.slug, price: p.price, pack: p.pack }] });
    setQ(""); setResults([]);
  }
  function saveChanges() { if (!active) return; update({ items: active.items.map(i => ({ ...i, qty: draftQty[i.sku] || i.qty })) }); }
  function addListToCart() {
    if (!active) return;
    for (const i of active.items) {
      addItem({ slug: i.slug || "", sku: i.sku, name: i.name || i.sku, brand: "", price: i.price || 0, image: i.image || "", pack: i.pack || "" }, draftQty[i.sku] || i.qty);
    }
    setAddedAll(true); setTimeout(() => setAddedAll(false), 2000);
  }

  // Product search for adding items
  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) { setResults([]); return; }
    const t = setTimeout(() => {
      setSearching(true);
      fetch(`/api/products/search?q=${encodeURIComponent(term)}&limit=6`).then(r => r.json()).then(d => setResults(d.products || [])).catch(() => {}).finally(() => setSearching(false));
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  const total = active ? active.items.reduce((s, i) => s + (i.price || 0) * (draftQty[i.sku] || i.qty), 0) : 0;

  return (
    <div>
    <FirstVisitNote
      id="supply-lists"
      userId={customerId}
      icon="supply-lists"
      title="Supply Lists: your standing order for every building"
      body="Save the products each building needs with the quantities you usually order. Next time, open the list, adjust anything that changed, and send the whole thing to your cart in one click."
      points={["Start a list from any past order or build one from scratch", "One list per building keeps multi-site ordering straight", "Each list links to that building’s SDS binder"]}
    />
    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
      {/* Lists */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden self-start">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-mjs-dark flex items-center gap-2"><ClipboardList className="w-4 h-4 text-mjs-red" /> Supply Lists</h2>
          <button onClick={createList} className="inline-flex items-center gap-1 text-xs font-bold text-mjs-red hover:underline"><Plus className="w-3.5 h-3.5" /> New</button>
        </div>
        {loading ? (
          <div className="p-4 space-y-2 animate-pulse">{[0, 1, 2].map(i => <div key={i} className="h-12 rounded-lg bg-mjs-gray-100" />)}</div>
        ) : lists.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-sm font-semibold text-mjs-gray-600">No lists yet</p>
            <p className="text-xs text-mjs-gray-400 mt-1">Save a past order as a list from Order History, or start one here.</p>
            <button onClick={createList} className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-mjs-red px-4 py-2 text-xs font-bold text-white hover:bg-mjs-red-dark"><Plus className="w-3.5 h-3.5" /> New list</button>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {lists.map(l => (
              <li key={l.id}>
                <button onClick={() => setActiveId(l.id)} className={`w-full text-left px-5 py-3 transition-colors ${l.id === activeId ? "bg-red-50/60" : "hover:bg-mjs-gray-50"}`}>
                  <div className={`text-sm font-semibold ${l.id === activeId ? "text-mjs-red" : "text-mjs-dark"}`}>{l.name}</div>
                  <div className="text-[11px] text-mjs-gray-400 mt-0.5 flex items-center gap-1 truncate"><Building2 className="w-3 h-3 shrink-0" /> {l.building || "No building"} <span className="text-gray-200">|</span> {l.items.length} item{l.items.length === 1 ? "" : "s"}</div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Active list */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {!active ? (
          <div className="px-6 py-20 text-center text-sm text-mjs-gray-400">Pick a list, or create one.</div>
        ) : (
          <>
            <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
              <div className="mr-auto min-w-0">
                {editingName ? (
                  <input autoFocus defaultValue={active.name} onBlur={e => { update({ name: e.target.value.trim() || active.name }); setEditingName(false); }} onKeyDown={e => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); if (e.key === "Escape") setEditingName(false); }} className="h-8 rounded-lg border border-gray-200 px-2 text-sm font-bold text-mjs-dark outline-none focus:border-mjs-red" />
                ) : (
                  <button onClick={() => setEditingName(true)} className="text-base font-black text-mjs-dark hover:text-mjs-red text-left" title="Rename">{active.name}</button>
                )}
                <div className="mt-1 flex items-center gap-2 text-xs text-mjs-gray-500">
                  <Building2 className="w-3.5 h-3.5 text-mjs-gray-400" />
                  <div className="relative">
                    <input list="mjs-buildings" value={active.building} onChange={e => update({ building: e.target.value })} placeholder="Building / site" className="h-7 w-56 rounded-md border border-gray-200 px-2 pr-6 text-xs outline-none focus:border-mjs-red" />
                    <ChevronDown className="w-3 h-3 text-mjs-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <datalist id="mjs-buildings">{buildings.map(b => <option key={b} value={b} />)}</datalist>
                  </div>
                  {active.building && (
                    <button onClick={() => onViewBinder(active.building)} className="inline-flex items-center gap-1 text-xs font-semibold text-mjs-red hover:underline whitespace-nowrap"><FileText className="w-3.5 h-3.5" /> View this building&rsquo;s SDS binder</button>
                  )}
                </div>
              </div>
              <button onClick={removeList} className="text-xs text-mjs-gray-400 hover:text-mjs-red inline-flex items-center gap-1"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
              <button onClick={saveChanges} disabled={!dirty || saving} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 px-3.5 text-xs font-bold text-mjs-dark disabled:opacity-40 hover:border-mjs-dark transition-colors">
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Save changes to list
              </button>
              <button onClick={addListToCart} disabled={active.items.length === 0} className={`inline-flex h-9 items-center gap-1.5 rounded-lg px-4 text-xs font-bold text-white transition-colors disabled:opacity-40 ${addedAll ? "bg-mjs-green" : "bg-mjs-red hover:bg-mjs-red-dark"}`}>
                {addedAll ? <><Check className="w-3.5 h-3.5" /> Added to cart</> : <><ShoppingCart className="w-3.5 h-3.5" /> Add list to cart</>}
              </button>
            </div>

            {/* Add a product */}
            <div className="px-6 py-3 border-b border-gray-50 relative">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-mjs-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input value={q} onChange={e => setQ(e.target.value)} placeholder="Add a product by name or item #" className="h-9 w-full rounded-lg border border-gray-200 pl-8 pr-8 text-xs outline-none focus:border-mjs-red" />
                {q && <button onClick={() => setQ("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-mjs-gray-400 hover:text-mjs-dark"><X className="w-3.5 h-3.5" /></button>}
              </div>
              {(results.length > 0 || searching) && (
                <ul className="absolute left-6 right-6 top-[52px] z-20 rounded-xl border border-gray-100 bg-white shadow-lg overflow-hidden">
                  {searching && results.length === 0 && <li className="px-4 py-3 text-xs text-mjs-gray-400">Searching…</li>}
                  {results.map(p => (
                    <li key={p.sku}>
                      <button onClick={() => addProduct(p)} className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-mjs-gray-50">
                        <span className="h-8 w-8 shrink-0 rounded bg-mjs-gray-50 overflow-hidden">{p.images?.[0] && <img src={p.images[0]} alt="" className="h-full w-full object-contain" />}</span>
                        <span className="min-w-0 flex-1 text-xs font-semibold text-mjs-dark truncate">{p.cardTitle || p.name}</span>
                        <span className="text-[11px] text-mjs-gray-400 whitespace-nowrap">{p.sku} · ${p.price.toFixed(2)}</span>
                        <Plus className="w-3.5 h-3.5 text-mjs-red" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {active.items.length === 0 ? (
              <div className="px-6 py-14 text-center text-xs text-mjs-gray-400">This list is empty. Search above to add products.</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-mjs-gray-50 text-[10.5px] font-semibold text-mjs-gray-400 uppercase tracking-wider">
                    <th className="text-left px-6 py-2.5">Product</th>
                    <th className="text-right px-4 py-2.5">Price</th>
                    <th className="text-center px-4 py-2.5">Usual</th>
                    <th className="text-center px-4 py-2.5">This order</th>
                    <th className="text-right px-6 py-2.5">Line</th>
                    <th className="px-2 py-2.5" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {active.items.map((i: SupplyListItem) => {
                    const qty = draftQty[i.sku] || i.qty;
                    return (
                      <tr key={i.sku} className="hover:bg-mjs-gray-50/50">
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-3">
                            <span className="h-10 w-10 shrink-0 rounded-lg bg-mjs-gray-50 overflow-hidden">{i.image && <img src={i.image} alt="" className="h-full w-full object-contain" />}</span>
                            <div className="min-w-0">
                              <div className="text-sm font-semibold text-mjs-dark truncate">{i.slug ? <a href={`/product/${i.slug}`} className="hover:text-mjs-red">{i.name}</a> : i.name}</div>
                              <div className="text-[11px] text-mjs-gray-400">Item {i.sku}{i.pack && i.pack.toUpperCase() !== i.sku.toUpperCase() ? ` · ${i.pack}` : ""}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-mjs-gray-600">{i.price ? `$${i.price.toFixed(2)}` : "—"}</td>
                        <td className="px-4 py-3 text-sm text-center text-mjs-gray-400">{i.qty}</td>
                        <td className="px-4 py-3">
                          <div className="mx-auto flex w-fit items-center border border-gray-200 rounded-lg overflow-hidden">
                            <button onClick={() => setQty(i.sku, qty - 1)} className="w-7 h-7 flex items-center justify-center hover:bg-gray-100"><Minus className="w-3 h-3 text-mjs-gray-500" /></button>
                            <input value={qty} onChange={e => { const n = parseInt(e.target.value.replace(/\D/g, "") || "1"); setQty(i.sku, n); }} className="w-10 h-7 text-center text-xs font-bold text-mjs-dark border-x border-gray-200 bg-mjs-gray-50 outline-none" />
                            <button onClick={() => setQty(i.sku, qty + 1)} className="w-7 h-7 flex items-center justify-center hover:bg-gray-100"><Plus className="w-3 h-3 text-mjs-gray-500" /></button>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-sm font-bold text-right text-mjs-dark">{i.price ? `$${(i.price * qty).toFixed(2)}` : "—"}</td>
                        <td className="px-2 py-3 text-right"><button onClick={() => removeItem(i.sku)} className="text-mjs-gray-300 hover:text-mjs-red" aria-label="Remove"><X className="w-3.5 h-3.5" /></button></td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-mjs-gray-50/60">
                    <td colSpan={4} className="px-6 py-3 text-xs text-mjs-gray-500">{dirty ? "Quantities changed for this order only. Save changes to list to make them the new usual." : "Usual quantities shown. Adjust for this order without changing the list."}</td>
                    <td className="px-6 py-3 text-sm font-black text-right text-mjs-dark">${total.toFixed(2)}</td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            )}
          </>
        )}
      </div>
    </div>
    </div>
  );
}
