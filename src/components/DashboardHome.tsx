"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  Search, ShoppingCart, Check, Plus, Minus, ChevronRight, Package, ClipboardList, FileText, Gift,
  Phone, Mail, Truck, AlertCircle, Clock, BadgeCheck, MapPin, ArrowRight, Sparkles, Download,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { getTierPrice } from "@/lib/tier-pricing";
import { getRewardTier, getRewardTiers } from "@/lib/reward-tiers";
import { loadHistory, type History } from "@/components/PersonalStrips";
import type { HistoryItem } from "@/app/api/customers/history/route";
import type { SupplyList } from "@/app/api/customers/lists/route";
import type { ProductData } from "@/data/products";

/*
 * Account dashboard, top of page + Overview tab (2026-11-20 revamp).
 *
 *   <DashboardHero>     greeting, command bar ("What are you restocking?"),
 *                       attention chips, account card with your rep
 *   <DashboardOverview> Reorder list (due first), open orders, quick actions,
 *                       rewards, account team, forms
 *
 * Both read the same cached /api/customers/history request the homepage uses.
 * Rollback point: git tag dashboard-v1-2026-11-20.
 */

export interface DashOrder {
  id: string; date: string; dateRaw: string; items: number; total: number; rewardSubtotal: number; status: string; statusColor: string; building?: string;
}
export interface DashUser { id?: number; firstName?: string; lastName?: string; company?: string; email?: string; customerGroupId?: number }

interface Shared {
  user: DashUser;
  orders: DashOrder[];
  ordersLoading: boolean;
  termsPending: boolean;
  taxIdUploaded: boolean;
  addressCount: number;
  pricingTier: string;
  go: (tab: string) => void;
  openOrder: (order: DashOrder) => void;
  newOrder: () => void;
  addAddress: () => void;
  addTaxId: () => void;
}

const OPEN_STATUSES = new Set(["Awaiting Shipment", "Awaiting Pickup", "Awaiting Fulfillment", "Pending", "Partially Shipped", "Awaiting Payment"]);
// Order statuses are not maintained in BigCommerce after fulfilment, so "on the way" means open AND recent
const isOnTheWay = (o: DashOrder) => OPEN_STATUSES.has(o.status) && Date.now() - new Date(o.dateRaw).getTime() < 14 * 86400000;
/* Account team shown in the team bar. ACCOUNT_REP is who every customer sees as their rep. */
const REPS = [
  { initials: "ZB", name: "Zack Bergman", email: "zack@mobilejanitorialsupply.com" },
  { initials: "RB", name: "Ryan Bergman", email: "ryan@mobilejanitorialsupply.com" },
  { initials: "NB", name: "Nick Bergman", email: "nick@mobilejanitorialsupply.com" },
];
const ACCOUNT_REP = REPS[2]; // Nick Bergman, always

/* Custom dashboard glyphs (public/icons/dash/*.png, alpha-only) rendered as a CSS mask so they take currentColor. */
const Glyph = ({ name, className = "w-7 h-7" }: { name: string; className?: string }) => (
  <span aria-hidden className={`inline-block bg-current ${className}`} style={{ WebkitMaskImage: `url(/icons/dash/${name}.png)`, maskImage: `url(/icons/dash/${name}.png)`, WebkitMaskSize: "contain", maskSize: "contain", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskPosition: "center", maskPosition: "center" }} />
);
const greeting = () => { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"; };
const shortDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
const money = (n: number) => `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
function cadenceLabel(gapDays: number | null): string | null {
  if (!gapDays) return null;
  if (gapDays < 11) return "about weekly";
  if (gapDays < 45) return `every ${Math.round(gapDays / 7)} wks`;
  const m = Math.max(1, Math.round(gapDays / 30));
  return m === 1 ? "about monthly" : `every ${m} mo`;
}
function median(nums: number[]) { const s = [...nums].sort((a, b) => a - b); const m = Math.floor(s.length / 2); return s.length ? (s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2) : 0; }

/* ── shared data: history (cached), lists, SDS pending ── */
function useDashData(customerId?: number) {
  const [history, setHistory] = useState<History | null>(null);
  const [lists, setLists] = useState<SupplyList[]>([]);
  const [sdsPending, setSdsPending] = useState<number | null>(null);
  useEffect(() => {
    if (!customerId) return;
    let live = true;
    loadHistory(customerId).then(h => { if (live) setHistory(h); });
    fetch(`/api/customers/lists?customerId=${customerId}`).then(r => r.json()).then(d => { if (live) setLists(d.lists || []); }).catch(() => {});
    fetch(`/api/customers/sds-binder?customerId=${customerId}`).then(r => r.json()).then(d => { if (live) setSdsPending((d.chemicals || []).filter((c: { sds: unknown }) => !c.sds).length); }).catch(() => {});
    return () => { live = false; };
  }, [customerId]);
  return { history, lists, sdsPending };
}

/* ═══════════════════════════ HERO ═══════════════════════════ */

export function DashboardHero(p: Shared) {
  const { history, lists, sdsPending } = useDashData(p.user.id);
  const firstName = p.user.firstName || "there";

  // Account facts
  const dates = p.orders.map(o => new Date(o.dateRaw).getTime()).filter(n => !isNaN(n)).sort((a, b) => a - b);
  const since = dates.length ? new Date(dates[0]).getFullYear() : null;
  const gap = dates.length >= 3 ? median(dates.slice(1).map((d, i) => (d - dates[i]) / 86400000)) : null;
  const cadence = cadenceLabel(gap && gap >= 5 ? Math.min(gap, 180) : null);
  const openOrders = p.orders.filter(isOnTheWay);
  const rewardsOnWay = p.orders.filter(o => getRewardTier(o.rewardSubtotal, true) && Date.now() - new Date(o.dateRaw).getTime() < 72 * 3600 * 1000);
  const termsApproved = !p.termsPending && p.user.customerGroupId !== undefined && p.user.customerGroupId !== 708 && p.orders.length > 0;

  // Attention chips: only the ones that are true
  const chips: { key: string; icon: ReactNode; text: string; tone: "red" | "amber" | "green" | "blue" | "grey"; onClick: () => void }[] = [];
  if (history?.due.length) chips.push({ key: "due", icon: <Clock className="w-3.5 h-3.5" />, text: `${history.due.length} item${history.due.length === 1 ? "" : "s"} due for a restock`, tone: "red", onClick: () => document.getElementById("dash-reorder")?.scrollIntoView({ behavior: "smooth", block: "start" }) });
  if (openOrders.length) chips.push({ key: "open", icon: <Truck className="w-3.5 h-3.5" />, text: `${openOrders.length} order${openOrders.length === 1 ? "" : "s"} on the way`, tone: "blue", onClick: () => p.go("Orders") });
  if (rewardsOnWay.length) chips.push({ key: "reward", icon: <Gift className="w-3.5 h-3.5" />, text: `Gift card on the way`, tone: "green", onClick: () => p.go("Rewards") });
  if (sdsPending) chips.push({ key: "sds", icon: <AlertCircle className="w-3.5 h-3.5" />, text: `${sdsPending} SDS sheet${sdsPending === 1 ? "" : "s"} pending`, tone: "amber", onClick: () => p.go("My SDS Binder") });
  if (p.termsPending) chips.push({ key: "terms", icon: <Clock className="w-3.5 h-3.5" />, text: "Net-30 application under review", tone: "grey", onClick: () => p.go("Account Info") });
  if (!p.taxIdUploaded) chips.push({ key: "tax", icon: <BadgeCheck className="w-3.5 h-3.5" />, text: "Add your tax ID to buy tax-free", tone: "grey", onClick: p.addTaxId });
  if (p.addressCount === 0) chips.push({ key: "addr", icon: <MapPin className="w-3.5 h-3.5" />, text: "Add a delivery address", tone: "grey", onClick: p.addAddress });
  const tone = { red: "bg-red-50 text-mjs-red", amber: "bg-amber-50 text-amber-700", green: "bg-green-50 text-green-700", blue: "bg-blue-50 text-blue-700", grey: "bg-mjs-gray-100 text-mjs-gray-600" };

  return (
    <div className="rounded-2xl px-6 lg:px-8 py-6 lg:py-7 mb-6 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 lg:gap-8" style={{ background: "linear-gradient(180deg, #ffffff 0%, #f1f3f6 100%)" }}>
      <div className="min-w-0">
        <div className="text-[13px] font-semibold text-mjs-gray-500">{greeting()}, {firstName}.</div>
        <h1 className="mt-1 text-[26px] lg:text-[34px] leading-[1.05] font-black tracking-tight text-mjs-dark">What are you restocking today?</h1>
        <CommandBar history={history} lists={lists} orders={p.orders} go={p.go} openOrder={p.openOrder} />
        {chips.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {chips.map(c => (
              <button key={c.key} onClick={c.onClick} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-bold transition-opacity hover:opacity-80 ${tone[c.tone]}`}>
                {c.icon} {c.text} <ChevronRight className="w-3 h-3 opacity-60" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Account card */}
      <div className="rounded-xl bg-white px-5 py-4 shadow-[0_1px_2px_rgba(23,32,52,0.06)] self-start">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[15px] font-black text-mjs-dark truncate">{p.user.company || `${p.user.firstName || ""} ${p.user.lastName || ""}`.trim() || "Your account"}</div>
            <div className="mt-0.5 text-[11.5px] text-mjs-gray-500 truncate">{p.user.email}</div>
          </div>
          <span className="shrink-0 rounded-full bg-[#fecd02] px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-mjs-dark">{p.pricingTier}</span>
        </div>
        <ul className="mt-3 space-y-1.5 text-[12.5px] text-mjs-gray-600 list-none m-0 p-0">
          <li className="flex items-center gap-2"><span className={`h-1.5 w-1.5 rounded-full ${termsApproved ? "bg-mjs-green" : p.termsPending ? "bg-amber-400" : "bg-mjs-gray-300"}`} />{termsApproved ? "Net-30 account" : p.termsPending ? "Net-30 pending approval" : "Prepaid account"}</li>
          <li className="flex items-center gap-2"><span className={`h-1.5 w-1.5 rounded-full ${p.taxIdUploaded ? "bg-mjs-green" : "bg-mjs-gray-300"}`} />{p.taxIdUploaded ? "Tax exempt" : "Sales tax applies"}</li>
          <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-mjs-gray-300" />{since ? `Customer since ${since}` : "New customer"}{p.orders.length ? ` · ${p.orders.length} order${p.orders.length === 1 ? "" : "s"}` : ""}{cadence ? ` · ${cadence}` : ""}</li>
        </ul>
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mjs-red text-[11px] font-black text-white">{ACCOUNT_REP.initials}</span>
          <div className="min-w-0 flex-1">
            <div className="text-[12.5px] font-bold text-mjs-dark leading-tight">{ACCOUNT_REP.name}</div>
            <div className="text-[11px] text-mjs-gray-500">Your account rep</div>
          </div>
          <a href="tel:7147792640" className="flex h-8 w-8 items-center justify-center rounded-full bg-mjs-gray-100 text-mjs-dark hover:bg-mjs-red hover:text-white transition-colors" aria-label="Call"><Phone className="w-3.5 h-3.5" /></a>
          <a href={`mailto:${ACCOUNT_REP.email}`} className="flex h-8 w-8 items-center justify-center rounded-full bg-mjs-gray-100 text-mjs-dark hover:bg-mjs-red hover:text-white transition-colors" aria-label="Email"><Mail className="w-3.5 h-3.5" /></a>
        </div>
      </div>
    </div>
  );
}

/* ── Command bar: your products first, then lists, orders, SDS, catalog, actions ── */
type Hit =
  | { kind: "product"; item: HistoryItem }
  | { kind: "catalog"; product: ProductData }
  | { kind: "list"; list: SupplyList }
  | { kind: "order"; order: DashOrder }
  | { kind: "sds"; item: HistoryItem }
  | { kind: "action"; label: string; hint: string; run: () => void };

function CommandBar({ history, lists, orders, go, openOrder }: { history: History | null; lists: SupplyList[]; orders: DashOrder[]; go: (t: string) => void; openOrder: (o: DashOrder) => void }) {
  const { addItem } = useCart();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [catalog, setCatalog] = useState<ProductData[]>([]);
  const [added, setAdded] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  // "/" focuses the bar from anywhere on the page
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName) && !t.isContentEditable) { e.preventDefault(); inputRef.current?.focus(); }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const onClick = (e: MouseEvent) => { if (!boxRef.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", onClick);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("mousedown", onClick); };
  }, []);

  // Catalog fallback (debounced)
  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) { setCatalog([]); return; }
    const t = setTimeout(() => {
      fetch(`/api/products/search?q=${encodeURIComponent(term)}&limit=5`).then(r => r.json()).then(d => setCatalog(d.products || [])).catch(() => {});
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  const hits = useMemo<Hit[]>(() => {
    const term = q.trim().toLowerCase();
    const out: Hit[] = [];
    const items = history?.items || [];
    if (!term) {
      // Empty state: what they probably want
      for (const it of (history?.due.length ? history.due : items).slice(0, 4)) out.push({ kind: "product", item: it });
      if (orders[0]) out.push({ kind: "action", label: "Reorder my last order", hint: `${orders[0].id} · ${orders[0].items} items`, run: () => openOrder(orders[0]) });
      for (const l of lists.slice(0, 2)) out.push({ kind: "list", list: l });
      return out;
    }
    const words = term.split(/\s+/).filter(Boolean);
    const match = (s: string) => { const l = s.toLowerCase(); return words.every(w => l.includes(w)); };
    // Actions by keyword
    if (/^(reorder|last order|again)/.test(term) && orders[0]) out.push({ kind: "action", label: "Reorder my last order", hint: `${orders[0].id} · ${orders[0].items} items`, run: () => openOrder(orders[0]) });
    if (/^(sds|safety|data sheet|binder)/.test(term)) out.push({ kind: "action", label: "Open My SDS Binder", hint: "Every sheet for every chemical you've bought", run: () => go("My SDS Binder") });
    if (/^(list|supply list|route)/.test(term)) out.push({ kind: "action", label: "Open Supply Lists", hint: `${lists.length} saved list${lists.length === 1 ? "" : "s"}`, run: () => go("Supply Lists") });
    if (/^(invoice|order history|orders)/.test(term)) out.push({ kind: "action", label: "Open Order History", hint: "Invoices, tracking and reorders", run: () => go("Orders") });
    if (/^(reward|gift)/.test(term)) out.push({ kind: "action", label: "Open Rewards", hint: "Gift cards earned on orders", run: () => go("Rewards") });
    // Orders by number
    const digits = term.replace(/\D/g, "");
    if (digits.length >= 4) for (const o of orders.filter(o => o.id.includes(digits)).slice(0, 3)) out.push({ kind: "order", order: o });
    // Your products
    for (const it of items.filter(it => match(`${it.product.name} ${it.product.sku}`)).slice(0, 5)) out.push({ kind: "product", item: it });
    // Lists
    for (const l of lists.filter(l => match(`${l.name} ${l.building}`)).slice(0, 2)) out.push({ kind: "list", list: l });
    // SDS for chemicals they own
    for (const it of items.filter(it => it.product.sdsSheet && match(`${it.product.name} ${it.product.sku} sds`)).slice(0, 2)) if (/sds|sheet|safety/.test(term)) out.push({ kind: "sds", item: it });
    // Catalog fallback
    const own = new Set(items.map(i => i.product.sku.toUpperCase()));
    for (const p of catalog.filter(p => !own.has(p.sku.toUpperCase())).slice(0, 4)) out.push({ kind: "catalog", product: p });
    return out;
  }, [q, history, lists, orders, catalog, go, openOrder]);

  const add = (product: ProductData, qty: number) => {
    addItem({ slug: product.slug, sku: product.sku, name: product.cardTitle, brand: product.brand, price: getTierPrice(product, qty), image: product.images[0], pack: product.pack }, qty);
    setAdded(product.sku); setTimeout(() => setAdded(null), 1500);
  };

  const group = (label: string, nodes: unknown[]) => nodes.length ? <li className="px-4 pt-2.5 pb-1 text-[10.5px] font-bold uppercase tracking-wider text-mjs-gray-400">{label}</li> : null;
  const products = hits.filter(h => h.kind === "product") as Extract<Hit, { kind: "product" }>[];
  const actions = hits.filter(h => h.kind === "action") as Extract<Hit, { kind: "action" }>[];
  const orderHits = hits.filter(h => h.kind === "order") as Extract<Hit, { kind: "order" }>[];
  const listHits = hits.filter(h => h.kind === "list") as Extract<Hit, { kind: "list" }>[];
  const sdsHits = hits.filter(h => h.kind === "sds") as Extract<Hit, { kind: "sds" }>[];
  const catalogHits = hits.filter(h => h.kind === "catalog") as Extract<Hit, { kind: "catalog" }>[];

  return (
    <div ref={boxRef} className="relative mt-4 max-w-[720px]">
      <div className="flex items-center rounded-xl bg-white shadow-[0_1px_2px_rgba(23,32,52,0.08),0_8px_24px_rgba(23,32,52,0.06)] focus-within:shadow-[0_0_0_2px_#D42027,0_8px_24px_rgba(23,32,52,0.08)] transition-shadow">
        <Search className="ml-4 w-5 h-5 shrink-0 text-mjs-gray-400" />
        <input
          ref={inputRef}
          value={q}
          onChange={e => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          placeholder="Product, item #, order #, list, or try “reorder”"
          className="h-12 lg:h-14 flex-1 bg-transparent px-3 text-[15px] text-mjs-dark placeholder:text-mjs-gray-400 outline-none"
          aria-label="Search your account"
        />
        <kbd className="mr-3 hidden sm:inline-flex h-6 items-center rounded-md bg-mjs-gray-100 px-2 text-[11px] font-bold text-mjs-gray-500">/</kbd>
      </div>

      {open && hits.length > 0 && (
        <ul className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 max-h-[440px] overflow-y-auto rounded-xl bg-white py-1 shadow-[0_18px_50px_rgba(23,32,52,0.18)] list-none m-0">
          {group(q.trim() ? "Your products" : (history?.due.length ? "Due for a restock" : "Your usual products"), products)}
          {products.map(({ item }) => (
            <li key={item.product.sku}>
              <ProductHit product={item.product} qty={item.usualQty} meta={`Last ordered ${shortDate(item.lastDate)}${item.due ? " · due now" : ""}`} added={added === item.product.sku} onAdd={q => add(item.product, q)} />
            </li>
          ))}
          {group("Actions", actions)}
          {actions.map(a => (
            <li key={a.label}><button onClick={() => { a.run(); setOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-mjs-gray-50">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-mjs-red"><Sparkles className="w-4 h-4" /></span>
              <span className="min-w-0 flex-1"><span className="block text-[13.5px] font-bold text-mjs-dark">{a.label}</span><span className="block text-[11.5px] text-mjs-gray-500">{a.hint}</span></span>
              <ArrowRight className="w-4 h-4 text-mjs-gray-300" />
            </button></li>
          ))}
          {group("Orders", orderHits)}
          {orderHits.map(({ order }) => (
            <li key={order.id}><button onClick={() => { openOrder(order); setOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-mjs-gray-50">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-mjs-gray-100 text-mjs-gray-500"><Package className="w-4 h-4" /></span>
              <span className="min-w-0 flex-1"><span className="block text-[13.5px] font-bold text-mjs-dark">{order.id}</span><span className="block text-[11.5px] text-mjs-gray-500">{order.date} · {order.items} items · {money(order.total)}</span></span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${order.statusColor}`}>{order.status}</span>
            </button></li>
          ))}
          {group("Supply lists", listHits)}
          {listHits.map(({ list }) => (
            <li key={list.id}><button onClick={() => { go("Supply Lists"); setOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-mjs-gray-50">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-mjs-gray-100 text-mjs-gray-500"><ClipboardList className="w-4 h-4" /></span>
              <span className="min-w-0 flex-1"><span className="block text-[13.5px] font-bold text-mjs-dark">{list.name}</span><span className="block text-[11.5px] text-mjs-gray-500">{list.building || "No building"} · {list.items.length} items</span></span>
              <ArrowRight className="w-4 h-4 text-mjs-gray-300" />
            </button></li>
          ))}
          {group("Safety data sheets", sdsHits)}
          {sdsHits.map(({ item }) => (
            <li key={`sds-${item.product.sku}`}><a href={item.product.sdsSheet} target="_blank" rel="noopener noreferrer" className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-mjs-gray-50">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-mjs-gray-100 text-mjs-gray-500"><FileText className="w-4 h-4" /></span>
              <span className="min-w-0 flex-1"><span className="block text-[13.5px] font-bold text-mjs-dark">SDS · {item.product.cardTitle || item.product.name}</span><span className="block text-[11.5px] text-mjs-gray-500">Item {item.product.sku} · opens the PDF</span></span>
              <Download className="w-4 h-4 text-mjs-gray-300" />
            </a></li>
          ))}
          {group("From the catalog", catalogHits)}
          {catalogHits.map(({ product }) => (
            <li key={`cat-${product.sku}`}><ProductHit product={product} qty={1} meta={`Item ${product.sku}${product.pack ? ` · ${product.pack}` : ""}`} added={added === product.sku} onAdd={q => add(product, q)} /></li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ProductHit({ product, qty: initial, meta, added, onAdd }: { product: ProductData; qty: number; meta: string; added: boolean; onAdd: (qty: number) => void }) {
  const [qty, setQty] = useState(initial);
  return (
    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 hover:bg-mjs-gray-50">
      <a href={`/product/${product.slug}`} className="h-10 w-10 shrink-0 rounded-lg bg-mjs-gray-50 overflow-hidden">{product.images?.[0] && <img src={product.images[0]} alt="" className="h-full w-full object-contain" />}</a>
      <div className="min-w-0 flex-1 basis-[calc(100%-52px)] sm:basis-auto">
        <a href={`/product/${product.slug}`} className="block text-[13.5px] font-bold text-mjs-dark truncate hover:text-mjs-red">{product.cardTitle || product.name}</a>
        <div className="text-[11.5px] text-mjs-gray-500 truncate">{money(product.price)} · {meta}</div>
      </div>
      <div className="ml-auto flex items-center border border-gray-200 rounded-lg overflow-hidden">
        <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-6 h-7 flex items-center justify-center hover:bg-gray-100" aria-label="Less"><Minus className="w-2.5 h-2.5 text-mjs-gray-500" /></button>
        <input value={qty} onChange={e => setQty(Math.max(1, parseInt(e.target.value.replace(/\D/g, "") || "1")))} className="w-8 h-7 text-center text-[11px] font-bold text-mjs-dark border-x border-gray-200 bg-mjs-gray-50 outline-none" aria-label="Quantity" />
        <button onClick={() => setQty(qty + 1)} className="w-6 h-7 flex items-center justify-center hover:bg-gray-100" aria-label="More"><Plus className="w-2.5 h-2.5 text-mjs-gray-500" /></button>
      </div>
      <button onClick={() => onAdd(qty)} className={`inline-flex h-8 items-center gap-1 rounded-lg px-3 text-[11.5px] font-bold text-white transition-colors ${added ? "bg-mjs-green" : "bg-mjs-red hover:bg-mjs-red-dark"}`}>
        {added ? <><Check className="w-3 h-3" /> Added</> : <><ShoppingCart className="w-3 h-3" /> Add</>}
      </button>
    </div>
  );
}

/* ═══════════════════════════ ORDER CHART ═══════════════════════════ */

const DEAD_STATUSES = new Set(["Cancelled", "Declined", "Refunded", "Disputed"]);
const CHART_MAX = 24;

/* One bar per order, oldest on the left. Hover or focus a bar and the readout
 * above shows that order, its total and the change from the one before it. */
function OrderChart({ orders, loading, openOrder }: { orders: DashOrder[]; loading: boolean; openOrder: (o: DashOrder) => void }) {
  const [hover, setHover] = useState<number | null>(null);
  const live = useMemo(() => {
    const ok = orders.filter(o => !DEAD_STATUSES.has(o.status) && !isNaN(new Date(o.dateRaw).getTime()));
    ok.sort((a, b) => new Date(a.dateRaw).getTime() - new Date(b.dateRaw).getTime());
    return ok.slice(-CHART_MAX);
  }, [orders]);
  const max = Math.max(...live.map(o => o.total), 1);
  const lifetime = live.reduce((s, o) => s + o.total, 0);
  const avg = live.length ? lifetime / live.length : 0;
  const idx = hover ?? live.length - 1;
  const cur = live[idx];
  const prev = idx > 0 ? live[idx - 1] : undefined;
  const delta = cur && prev && prev.total > 0 ? (cur.total - prev.total) / prev.total : null;
  const span = live.length > 1
    ? `${new Date(live[0].dateRaw).toLocaleDateString("en-US", { month: "short", year: "numeric" })} – ${new Date(live[live.length - 1].dateRaw).toLocaleDateString("en-US", { month: "short", year: "numeric" })}`
    : "";

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="h-3.5 w-28 rounded bg-mjs-gray-100 animate-pulse" />
        <div className="mt-2 h-3 w-40 rounded bg-mjs-gray-100 animate-pulse" />
        <div className="mt-5 flex h-32 items-end gap-[3px]">
          {Array.from({ length: 16 }).map((_, i) => <div key={i} className="flex-1 rounded-t bg-mjs-gray-100 animate-pulse" style={{ height: `${20 + ((i * 37) % 70)}%` }} />)}
        </div>
      </div>
    );
  }
  if (live.length < 2) {
    return (
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-sm font-bold text-mjs-dark">Order history</h2>
        <p className="mt-1 text-[12px] text-mjs-gray-500">Your order chart fills in after your first few orders. Each bar is one order, sized by its total.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-mjs-dark">Order history</h2>
          <p className="text-[11.5px] text-mjs-gray-500">Last {live.length} orders · {span}</p>
        </div>
      </div>

      {/* Readout: the hovered order, or the latest */}
      <div className="mt-4 flex items-end justify-between gap-3" aria-live="polite">
        <div className="min-w-0">
          <div className="text-[22px] font-black leading-none text-mjs-dark tabular-nums">{money(cur.total)}</div>
          <div className="mt-1.5 text-[11.5px] leading-snug text-mjs-gray-500">
            <span className="font-bold text-mjs-dark">{cur.id}</span> · {cur.date} · {cur.items} item{cur.items === 1 ? "" : "s"}
          </div>
        </div>
        {delta !== null ? (
          <span className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums ${delta >= 0 ? "bg-green-50 text-green-700" : "bg-mjs-gray-100 text-mjs-gray-600"}`}>
            {delta >= 0 ? "▲" : "▼"} {Math.abs(Math.round(delta * 100))}% <span className="font-medium text-mjs-gray-500">vs previous</span>
          </span>
        ) : (
          <span className="shrink-0 rounded-full bg-mjs-gray-100 px-2 py-0.5 text-[11px] font-bold text-mjs-gray-600">First order</span>
        )}
      </div>

      {/* Bars */}
      <div className="relative mt-4 h-32" onMouseLeave={() => setHover(null)}>
        {/* average line */}
        <div className="pointer-events-none absolute inset-x-0 z-10 flex items-center gap-1.5" style={{ bottom: `${(avg / max) * 100}%` }}>
          <div className="h-px flex-1 border-t border-dashed border-mjs-gray-300" />
          <span className="w-[64px] text-[10px] font-semibold leading-none text-mjs-gray-500 tabular-nums">avg {money(avg)}</span>
        </div>
        <div className="absolute inset-y-0 left-0 right-[70px] flex items-end gap-[3px]">
          {live.map((o, i) => {
            const active = i === idx;
            const h = Math.max((o.total / max) * 100, 2.5);
            return (
              <button
                key={o.id}
                type="button"
                onMouseEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                onClick={() => openOrder(o)}
                aria-label={`${o.id}, ${o.date}, ${money(o.total)}`}
                className="group relative flex h-full flex-1 items-end outline-none"
              >
                <span className={`block w-full rounded-t-[4px] transition-colors ${active ? "bg-mjs-red" : "bg-mjs-dark/80 group-hover:bg-mjs-dark"}`} style={{ height: `${h}%` }} />
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-1.5 flex items-center justify-between pr-[70px] text-[10.5px] text-mjs-gray-400">
        <span>Oldest</span>
        <span className="text-mjs-gray-500">Tap a bar to open the order</span>
        <span>Latest</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-mjs-gray-100 pt-3">
        <div>
          <div className="text-[10.5px] font-semibold uppercase tracking-wide text-mjs-gray-400">Total</div>
          <div className="text-[14px] font-black text-mjs-dark tabular-nums">{money(lifetime)}</div>
        </div>
        <div>
          <div className="text-[10.5px] font-semibold uppercase tracking-wide text-mjs-gray-400">Average order</div>
          <div className="text-[14px] font-black text-mjs-dark tabular-nums">{money(avg)}</div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════ OVERVIEW ═══════════════════════════ */

export function DashboardOverview(p: Shared & { reordered: string | null; reorder: (o: DashOrder) => void; downloadInvoice: (o: DashOrder) => void }) {
  const { history, lists } = useDashData(p.user.id);
  const { addItem } = useCart();
  const [added, setAdded] = useState<string | null>(null);
  const [qtys, setQtys] = useState<Record<string, number>>({});

  const reorderItems = useMemo(() => {
    if (!history) return [];
    const due = history.due;
    const rest = history.items.filter(i => !i.due);
    return [...due, ...rest].slice(0, 6);
  }, [history]);

  const open = p.orders.filter(isOnTheWay);
  const recent = (open.length ? open : p.orders).slice(0, 4);
  const tiers = getRewardTiers(true);
  const earned = p.orders.filter(o => getRewardTier(o.rewardSubtotal, true)).length;
  const firstTier = tiers[0];

  const add = (it: HistoryItem) => {
    const q = qtys[it.product.sku] || it.usualQty;
    addItem({ slug: it.product.slug, sku: it.product.sku, name: it.product.cardTitle, brand: it.product.brand, price: getTierPrice(it.product, q), image: it.product.images[0], pack: it.product.pack }, q);
    setAdded(it.product.sku); setTimeout(() => setAdded(null), 1500);
  };
  const addAllDue = () => { for (const it of history?.due || []) add(it); };

  return (
    <div className="space-y-6">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Reorder */}
        <div id="dash-reorder" className="bg-white rounded-2xl shadow-sm overflow-hidden scroll-mt-24">
          <div className="px-6 py-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-mjs-dark">{history?.due.length ? "Due for a restock" : "Your usual products"}</h2>
              <p className="text-[11.5px] text-mjs-gray-400 mt-0.5">{history?.due.length ? "Based on how often you usually reorder" : "Usual quantities filled in. Adjust and add."}</p>
            </div>
            {history?.due.length ? (
              <button onClick={addAllDue} className="inline-flex items-center gap-1.5 rounded-lg bg-mjs-red px-3.5 py-2 text-xs font-bold text-white hover:bg-mjs-red-dark"><ShoppingCart className="w-3.5 h-3.5" /> Add all {history.due.length}</button>
            ) : (
              <button onClick={() => p.go("Supply Lists")} className="text-xs font-semibold text-mjs-red hover:underline">Supply lists &rarr;</button>
            )}
          </div>
          {!history ? (
            <div className="divide-y divide-gray-50 animate-pulse" aria-hidden="true">{[0, 1, 2, 3].map(i => <div key={i} className="px-6 py-3.5 flex items-center gap-4"><div className="h-11 w-11 rounded-lg bg-mjs-gray-100" /><div className="flex-1 space-y-2"><div className="h-3 w-2/5 rounded bg-mjs-gray-100" /><div className="h-3 w-1/4 rounded bg-mjs-gray-100" /></div><div className="h-8 w-24 rounded-lg bg-mjs-gray-100" /></div>)}</div>
          ) : reorderItems.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Package className="w-10 h-10 text-gray-200 mx-auto mb-2" />
              <p className="text-sm font-semibold text-mjs-gray-600">Nothing to reorder yet</p>
              <p className="text-xs text-mjs-gray-400 mt-1">Your products show up here after your first order.</p>
              <button onClick={p.newOrder} className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-mjs-red px-4 py-2 text-xs font-bold text-white hover:bg-mjs-red-dark">Start an order <ArrowRight className="w-3.5 h-3.5" /></button>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {reorderItems.map(it => {
                const q = qtys[it.product.sku] || it.usualQty;
                return (
                  <div key={it.product.sku} className="px-4 sm:px-6 py-3 flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 hover:bg-mjs-gray-50/50">
                    <a href={`/product/${it.product.slug}`} className="h-11 w-11 shrink-0 rounded-lg bg-mjs-gray-50 overflow-hidden">{it.product.images?.[0] && <img src={it.product.images[0]} alt="" className="h-full w-full object-contain" />}</a>
                    <div className="min-w-0 flex-1 basis-[calc(100%-56px)] sm:basis-auto">
                      <a href={`/product/${it.product.slug}`} className="block text-[13.5px] font-semibold text-mjs-dark truncate hover:text-mjs-red">{it.product.cardTitle || it.product.name}</a>
                      <div className="text-[11.5px] text-mjs-gray-500 flex items-center gap-1.5 flex-wrap">
                        <span>{money(it.product.price)} · {it.product.pack}</span><span className="text-gray-200">|</span>
                        <span>Last ordered {shortDate(it.lastDate)}</span>
                        {cadenceLabel(it.gapDays) && <><span className="text-gray-200">|</span><span>{cadenceLabel(it.gapDays)}</span></>}
                        {it.due && <span className={`ml-1 rounded-full px-2 py-0.5 text-[10px] font-bold text-white ${it.due === "overdue" ? "bg-mjs-red" : "bg-amber-500"}`}>{it.due === "overdue" ? "Overdue" : "Due now"}</span>}
                      </div>
                    </div>
                    <div className="ml-auto flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button onClick={() => setQtys(s => ({ ...s, [it.product.sku]: Math.max(1, q - 1) }))} className="w-6 h-7 flex items-center justify-center hover:bg-gray-100" aria-label="Less"><Minus className="w-2.5 h-2.5 text-mjs-gray-500" /></button>
                      <input value={q} onChange={e => setQtys(s => ({ ...s, [it.product.sku]: Math.max(1, parseInt(e.target.value.replace(/\D/g, "") || "1")) }))} className="w-8 h-7 text-center text-[11px] font-bold text-mjs-dark border-x border-gray-200 bg-mjs-gray-50 outline-none" aria-label="Quantity" />
                      <button onClick={() => setQtys(s => ({ ...s, [it.product.sku]: q + 1 }))} className="w-6 h-7 flex items-center justify-center hover:bg-gray-100" aria-label="More"><Plus className="w-2.5 h-2.5 text-mjs-gray-500" /></button>
                    </div>
                    <button onClick={() => add(it)} className={`inline-flex h-8 w-[84px] items-center justify-center gap-1 rounded-lg text-[11.5px] font-bold transition-colors border ${added === it.product.sku ? "bg-mjs-green border-mjs-green text-white" : "bg-white border-mjs-red text-mjs-red hover:bg-mjs-red hover:text-white"}`}>
                      {added === it.product.sku ? <><Check className="w-3 h-3" /> Added</> : <><ShoppingCart className="w-3 h-3" /> Add</>}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Orders */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-mjs-dark">{open.length ? "On the way" : "Recent orders"}</h2>
              <p className="text-[11.5px] text-mjs-gray-400 mt-0.5">{open.length ? `${open.length} open order${open.length === 1 ? "" : "s"} · tap one for details and the invoice` : "Tap an order for details, invoice and reorder"}</p>
            </div>
            <button onClick={() => p.go("Orders")} className="text-xs font-semibold text-mjs-red hover:underline">All orders &rarr;</button>
          </div>
          <div className="divide-y divide-gray-50">
            {p.ordersLoading ? (
              <div className="px-6 py-10 text-center"><div className="w-6 h-6 border-2 border-gray-200 border-t-mjs-red rounded-full animate-spin mx-auto" /></div>
            ) : recent.length === 0 ? (
              <div className="px-6 py-10 text-center"><Package className="w-10 h-10 text-gray-200 mx-auto mb-2" /><p className="text-sm font-semibold text-mjs-gray-600">No orders yet</p></div>
            ) : recent.map(o => (
              <div key={o.id} className="px-4 sm:px-6 py-3 flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 hover:bg-mjs-gray-50/50">
                <button onClick={() => p.openOrder(o)} className="flex min-w-0 flex-1 basis-full sm:basis-auto items-center gap-4 text-left">
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${isOnTheWay(o) ? "bg-blue-50 text-blue-600" : "bg-mjs-gray-50 text-mjs-gray-400"}`}>{isOnTheWay(o) ? <Truck className="w-4 h-4" /> : <Package className="w-4 h-4" />}</span>
                  <span className="min-w-0">
                    <span className="block text-[13.5px] font-semibold text-mjs-dark">{o.id}{o.building && o.building !== "Unassigned" ? <span className="font-normal text-mjs-gray-500"> · {o.building}</span> : null}</span>
                    <span className="block text-[11.5px] text-mjs-gray-500">{o.date} · {o.items} item{o.items === 1 ? "" : "s"} · {money(o.total)}</span>
                  </span>
                </button>
                <span className={`hidden sm:inline text-[10px] font-bold px-2 py-0.5 rounded-full ${o.statusColor}`}>{o.status}</span>
                <button onClick={() => p.downloadInvoice(o)} className="ml-auto sm:ml-0 text-xs text-mjs-gray-400 hover:text-mjs-dark font-medium inline-flex items-center gap-1" title="Invoice"><Download className="w-3.5 h-3.5" /><span className="hidden lg:inline">Invoice</span></button>
                <button onClick={() => p.reorder(o)} className="text-xs font-semibold text-mjs-red hover:underline inline-flex items-center gap-1">{p.reordered === o.id ? <><Check className="w-3.5 h-3.5 text-green-500" /><span className="text-green-500">Added</span></> : "Reorder"}</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Side */}
      <div className="space-y-6">
        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "New order", sub: "Start from scratch", icon: <Glyph name="new-order" />, on: p.newOrder, primary: true },
            { label: "Supply lists", sub: `${lists.length} saved`, icon: <Glyph name="supply-lists" />, on: () => p.go("Supply Lists") },
            { label: "SDS binder", sub: "Safety sheets", icon: <Glyph name="sds-binder" />, on: () => p.go("My SDS Binder") },
            { label: "Browse", sub: "Full catalog", icon: <Glyph name="browse" />, on: () => { window.location.href = "/"; } },
          ].map(a => (
            <button key={a.label} onClick={a.on} className={`flex flex-col items-center rounded-2xl px-4 py-5 text-center shadow-sm transition-colors ${a.primary ? "bg-mjs-red text-white hover:bg-mjs-red-dark" : "bg-white text-mjs-dark hover:bg-mjs-gray-50"}`}>
              <span className={`flex h-9 w-9 items-center justify-center ${a.primary ? "text-white" : "text-mjs-red"}`}>{a.icon}</span>
              <span className="mt-3 block text-[13.5px] font-black">{a.label}</span>
              <span className={`block text-[11px] ${a.primary ? "text-white/75" : "text-mjs-gray-500"}`}>{a.sub}</span>
            </button>
          ))}
        </div>

        {/* Rewards */}
        <button onClick={() => p.go("Rewards")} className="w-full rounded-2xl bg-mjs-dark px-5 py-4 text-left text-white shadow-sm hover:bg-black transition-colors">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-[#fecd02]"><Glyph name="rewards" className="w-4 h-4" /> Rewards</span>
            <ChevronRight className="w-4 h-4 text-white/50" />
          </div>
          <div className="mt-2 text-[22px] font-black leading-none">{earned} gift card{earned === 1 ? "" : "s"} earned</div>
          {firstTier && <div className="mt-1.5 text-[12px] text-white/70">Orders of ${firstTier.minSpend.toLocaleString()}+ earn a ${firstTier.amount} gift card. Bigger orders earn more.</div>}
        </button>

        {/* Forms & documents: three square cards */}
        <div>
          <h2 className="text-sm font-bold text-mjs-dark mb-3">Forms &amp; documents</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Contact form", sub: "New customer · PDF", href: "/forms/new-customer-contact-form.pdf", icon: <Glyph name="contact-form" /> },
              { label: "Card on file", sub: "Authorization · PDF", href: "/forms/credit-card-authorization-form.pdf", icon: <Glyph name="card-on-file" /> },
              { label: "All forms & SDS", sub: "Browse the library", href: "/resources", icon: <Glyph name="all-forms" /> },
            ].map(f => (
              <a key={f.href} href={f.href} target={f.href.endsWith(".pdf") ? "_blank" : undefined} rel="noopener noreferrer" className="group flex aspect-square flex-col items-center justify-center gap-3 rounded-2xl bg-white p-3 text-center shadow-sm hover:bg-mjs-gray-50 transition-colors">
                <span className="flex h-9 w-9 items-center justify-center text-mjs-red">{f.icon}</span>
                <span className="min-w-0">
                  <span className="block text-[12.5px] font-black leading-tight text-mjs-dark group-hover:text-mjs-red transition-colors">{f.label}</span>
                  <span className="mt-0.5 block text-[10.5px] leading-tight text-mjs-gray-500">{f.sub}</span>
                </span>
              </a>
            ))}
          </div>
        </div>

        <OrderChart orders={p.orders} loading={p.ordersLoading} openOrder={p.openOrder} />
      </div>
    </div>

    {/* Account team: heading above, then one bar with names and emails in plain sight */}
    <div>
      <div className="mb-3">
        <h2 className="text-sm font-bold text-mjs-dark">Your account team</h2>
        <p className="text-[11.5px] text-mjs-gray-500 mt-0.5">Real people, Mon–Fri 6:30 AM – 3:00 PM</p>
      </div>
    <div className="rounded-2xl px-5 lg:px-6 py-4 shadow-[0_1px_2px_rgba(23,32,52,0.06)] flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6" style={{ background: "linear-gradient(180deg, #f9fafb 0%, #e9ecf0 100%)" }}>
      <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 list-none m-0 p-0">
        {REPS.map(r => (
          <li key={r.email} className="flex items-center gap-3 rounded-xl bg-white px-3.5 py-2.5 shadow-[0_1px_2px_rgba(23,32,52,0.05)] min-w-0">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mjs-red text-[11px] font-black text-white">{r.initials}</span>
            <span className="min-w-0">
              <span className="block text-[13px] font-bold text-mjs-dark leading-tight">{r.name}</span>
              <a href={`mailto:${r.email}`} className="block text-[11.5px] text-mjs-gray-500 truncate hover:text-mjs-red">{r.email}</a>
            </span>
          </li>
        ))}
      </ul>
      <a href="tel:7147792640" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-mjs-dark px-4 py-2.5 text-[13px] font-bold text-white hover:bg-black transition-colors whitespace-nowrap"><Phone className="w-4 h-4 text-[#fecd02]" /> (714) 779-2640</a>
    </div>
    </div>

    </div>
  );
}
