import { sdsIndex } from "@/data/sds-index";
import revisions from "@/data/sds-revisions.json";
import type { ProductData } from "@/data/products";

/* ─────────────────────────────────────────────────────────────
   SDS engine: one place that answers "which safety data sheet goes
   with this SKU?" and turns a customer's order history into their
   SDS binder. Used by the dashboard binder, order history, the
   post-order SDS email and the Request-SDS flow.

   Sheets live in public/sds/*.PDF and are indexed in sds-index.ts
   (SKU → file). sds-revisions.json holds the revision / issue date
   pulled from each PDF (scratchpad script sds-dates.py).
   ───────────────────────────────────────────────────────────── */

export interface SdsMatch {
  file: string;           // "/sds/12520EA.PDF"
  url: string;            // absolute, works without signing in
  revised: string | null; // "2023-05-11" when the PDF states one
}

export const SITE = "https://www.mobilejanitorialsupply.com";
const REVISED = revisions as Record<string, string>;

// SKU → file, with the common "EA" suffix tolerated in either direction.
// When one SKU has several files (e.g. 10101.PDF and 10101EA.PDF) prefer the
// one whose name carries the full SKU, then the most recently revised.
const bySku = new Map<string, string[]>();
for (const e of sdsIndex) {
  const key = e.sku.toUpperCase();
  const list = bySku.get(key) || [];
  list.push(e.file);
  bySku.set(key, list);
}
function pick(sku: string, files: string[]): string {
  const exact = files.find(f => f.toUpperCase().endsWith(`/${sku}.PDF`));
  if (exact) return exact;
  return [...files].sort((a, b) => (REVISED[b] || "").localeCompare(REVISED[a] || ""))[0];
}

export function findSds(sku: string): SdsMatch | null {
  const key = (sku || "").toUpperCase().trim();
  if (!key) return null;
  const candidates = [key, key.endsWith("EA") ? key.slice(0, -2) : `${key}EA`];
  for (const k of candidates) {
    const files = bySku.get(k);
    if (files?.length) {
      const file = pick(k, files);
      return { file, url: `${SITE}${file}`, revised: REVISED[file] || null };
    }
  }
  return null;
}

// Products that should carry a sheet even when we haven't linked one yet
const CHEMICAL_WORDS = /\b(cleaner|disinfect\w*|degreaser|deodor\w*|sanitiz\w*|bleach|polish|stripper|floor finish|sealer|wax|detergent|solvent|acid|descaler|drain|enzyme|odor|freshener|glass cleaner|hand soap|lotion soap|shampoo|spot remover|dish ?soap|pot .*pan|all[- ]purpose|multi[- ]surface|disinfecting wipes|urinal (block|screen)|toss[- ]ins)\b/i;
export function isChemical(p: { name: string; category?: string; subcategory?: string }): boolean {
  const cat = `${p.category || ""} ${p.subcategory || ""}`.toLowerCase();
  if (cat.includes("chemical") || cat.includes("restroom deodor") || cat.includes("car detailing")) return true;
  return CHEMICAL_WORDS.test(p.name || "");
}

/* ── Buildings ──
   A building is the order's ship-to: the company on the shipping address, or
   its street line. Orders without a shipping address (pickup) are "Unassigned". */
export const UNASSIGNED = "Unassigned";
export function buildingFromAddress(addr?: { company?: string; street_1?: string; city?: string } | null): string {
  if (!addr) return UNASSIGNED;
  const company = (addr.company || "").trim();
  if (company) return company;
  const street = (addr.street_1 || "").trim();
  if (street) return addr.city ? `${street}, ${addr.city.trim()}` : street;
  return UNASSIGNED;
}

/* ── Binder ── */
export interface BinderPurchase { orderId: number; date: string; qty: number; building: string }
export interface BinderChemical {
  sku: string;
  name: string;
  image: string | null;
  slug: string | null;
  sds: SdsMatch | null;   // null → show "Request SDS"
  purchases: BinderPurchase[]; // newest first
  lastDate: string;
  buildings: string[];
}
export interface Binder { chemicals: BinderChemical[]; buildings: string[] }

export interface OrderForBinder { id: number; date: string; building: string; lines: { sku?: string; name?: string; quantity?: number }[] }

export function buildBinder(orders: OrderForBinder[], products: Map<string, ProductData>): Binder {
  const map = new Map<string, BinderChemical>();
  for (const o of [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())) {
    for (const line of o.lines) {
      const sku = (line.sku || "").toUpperCase();
      if (!sku) continue;
      const product = products.get(sku);
      const sds = findSds(sku);
      if (!sds && !isChemical({ name: product?.name || line.name || "", category: product?.category, subcategory: product?.subcategory })) continue;
      let c = map.get(sku);
      if (!c) {
        c = { sku, name: product?.cardTitle || product?.name || line.name || sku, image: product?.images?.[0] || null, slug: product?.slug || null, sds, purchases: [], lastDate: o.date, buildings: [] };
        map.set(sku, c);
      }
      c.purchases.push({ orderId: o.id, date: o.date, qty: Math.max(1, Number(line.quantity) || 1), building: o.building });
      if (!c.buildings.includes(o.building)) c.buildings.push(o.building);
    }
  }
  const chemicals = [...map.values()].sort((a, b) => new Date(b.lastDate).getTime() - new Date(a.lastDate).getTime());
  const buildings = [...new Set(orders.map(o => o.building))].filter(b => b !== UNASSIGNED).sort();
  if (orders.some(o => o.building === UNASSIGNED)) buildings.push(UNASSIGNED);
  return { chemicals, buildings };
}

/* ── Store-only ZIP (no compression; PDFs are already compressed) ── */
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; }
  return t;
})();
function crc32(buf: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
export function zipStore(files: { name: string; data: Uint8Array }[]): Buffer {
  const locals: Buffer[] = []; const centrals: Buffer[] = [];
  let offset = 0;
  const now = new Date();
  const dosTime = ((now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1)) & 0xffff;
  const dosDate = (((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate()) & 0xffff;
  for (const f of files) {
    const name = Buffer.from(f.name, "utf8"); const crc = crc32(f.data); const size = f.data.length;
    const lh = Buffer.alloc(30);
    lh.writeUInt32LE(0x04034b50, 0); lh.writeUInt16LE(20, 4); lh.writeUInt16LE(0x0800, 6); lh.writeUInt16LE(0, 8);
    lh.writeUInt16LE(dosTime, 10); lh.writeUInt16LE(dosDate, 12); lh.writeUInt32LE(crc, 14); lh.writeUInt32LE(size, 18); lh.writeUInt32LE(size, 22);
    lh.writeUInt16LE(name.length, 26); lh.writeUInt16LE(0, 28);
    const ch = Buffer.alloc(46);
    ch.writeUInt32LE(0x02014b50, 0); ch.writeUInt16LE(20, 4); ch.writeUInt16LE(20, 6); ch.writeUInt16LE(0x0800, 8); ch.writeUInt16LE(0, 10);
    ch.writeUInt16LE(dosTime, 12); ch.writeUInt16LE(dosDate, 14); ch.writeUInt32LE(crc, 16); ch.writeUInt32LE(size, 20); ch.writeUInt32LE(size, 24);
    ch.writeUInt16LE(name.length, 28); ch.writeUInt16LE(0, 30); ch.writeUInt16LE(0, 32); ch.writeUInt16LE(0, 34); ch.writeUInt16LE(0, 36); ch.writeUInt32LE(0, 38); ch.writeUInt32LE(offset, 42);
    locals.push(lh, name, Buffer.from(f.data)); centrals.push(ch, name);
    offset += lh.length + name.length + size;
  }
  const cdSize = centrals.reduce((n, b) => n + b.length, 0);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(0, 4); end.writeUInt16LE(0, 6); end.writeUInt16LE(files.length, 8); end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(cdSize, 12); end.writeUInt32LE(offset, 16); end.writeUInt16LE(0, 20);
  return Buffer.concat([...locals, ...centrals, end]);
}

export const safeFileName = (s: string) => s.replace(/[^\w\- .]+/g, "").replace(/\s+/g, " ").trim().slice(0, 60) || "sds";
