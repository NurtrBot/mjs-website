/*
 * Catalog search.
 *
 * BigCommerce's keyword search only matches whole words in the product name, so
 * "car wash" found nothing and "proteam" missed the ProTeam vacuums (the brand only
 * appears in their descriptions). This module instead keeps the whole visible catalog
 * (≈800 products) in memory and searches it directly:
 *
 *   - every field is indexed: name, SKU, brand, BigCommerce category names, our own
 *     category/subcategory, and the description
 *   - misspellings are tolerated (edit distance 1, or 2 for long words)
 *   - compound words work both ways ("proteam" ↔ "pro team", "multifold" ↔ "multi fold")
 *   - the last word matches as a prefix, so results appear while typing
 *   - synonyms and model aliases expand the query ("windex" → glass cleaner,
 *     "proteam" → super coach / gofree / provac)
 *   - every word in the query has to match somewhere (AND), falling back to
 *     most-words-match only when nothing satisfies all of them
 *   - accessories (dispensers, replacement bags, filters) rank under the product
 *     itself unless the shopper asked for them
 *
 * The catalog is rebuilt at most every 10 minutes; the underlying BigCommerce fetches
 * are also cached by Next for 5 minutes, so a cold start is a handful of cached reads.
 * Stock and price come straight from the live product records.
 */

import { getProducts, getCategories, type BCProduct, type BCCategory } from "./bigcommerce";
import { loadBrandMap, transformProduct, SEARCH_SYNONYMS } from "./products-api";
import type { ProductData } from "@/data/products";

/* ── Query-side aliases: manufacturers, models and shopper words that never appear in a name ── */
const ALIASES: Record<string, string[]> = {
  proteam: ["super coach", "gofree", "provac", "megavac", "quartervac", "backpack vacuum"],
  "pro team": ["proteam", "super coach", "backpack vacuum"],
  windex: ["glass cleaner"],
  "window cleaner": ["glass cleaner"],
  clorox: ["bleach", "disinfecting wipes"],
  lysol: ["disinfectant"],
  purell: ["hand sanitizer"],
  "simple green": ["degreaser"],
  "dish soap": ["dishwashing", "pot and pan", "dawn"],
  "garbage bags": ["can liners"],
  "trash bags": ["can liners"],
  "trash can": ["waste receptacle", "waste container"],
  "paper towels": ["roll towel", "multifold towel", "center-pull towel", "kitchen roll towel"],
  "paper towel": ["roll towel", "multifold towel", "center-pull towel"],
  "toilet paper": ["toilet tissue", "bath tissue"],
  tp: ["toilet tissue"],
  sanitiser: ["sanitizer"],
  "floor cleaner": ["neutral floor cleaner"],
  vac: ["vacuum"],
  hoover: ["vacuum"],
  "car wash": ["wash and wax", "car soap", "car shampoo", "foam cannon", "wash mitt"],
  "car soap": ["car wash", "car shampoo"],
  detailing: ["car detailing"],
  squeege: ["squeegee"],
  "shop towels": ["wipers", "rags"],
  rags: ["wipers", "cloth"],
  "wet floor sign": ["caution sign"],
  "garbage can": ["waste receptacle"],
  "bin liner": ["can liner"],
  "bin liners": ["can liners"],
  urinal: ["urinal screen", "urinal block", "urinal mat"],
  deodorizer: ["air freshener", "odor"],
  "all purpose cleaner": ["all-purpose cleaner", "multi-surface cleaner", "multi-purpose"],
  "multi purpose cleaner": ["all-purpose cleaner", "multi-surface cleaner"],
  "stretch wrap": ["stretch film"],
  "pallet wrap": ["stretch film"],
  "bubble wrap": ["bubble"],
  "packing tape": ["carton sealing tape", "packaging tape"],
  "face mask": ["mask"],
  "seat cover": ["toilet seat cover"],
  "seat covers": ["toilet seat covers"],
  kleenex: ["facial tissue"],
  "foaming soap": ["foam soap"],
  "hand wash": ["hand soap"],
  "dust pan": ["dustpan"],
};

const STOP = new Set(["the", "a", "an", "and", "or", "of", "for", "with", "to", "in", "on", "by", "per", "w"]);

/* Words that mark an accessory or part (dispenser for the paper, bags for the vacuum). If the
   query doesn't ask for one, the real product ranks first. Equipment names often list what is
   included ("w/ wand, tool kit"), so only words that name the item itself are used here. */
const ACCESSORY = /\b(dispensers?|replacement|refills?|filters?|belts?|bags? for|designed to fit|fits|covers? for|liners? for)\b/i;
const WANTS_ACCESSORY = /\b(dispensers?|replacement|refills?|filters?|belts?|bags?|covers?|liners?|parts?)\b/i;

/* ── Text normalisation ── */
function stem(t: string): string {
  if (t.length <= 4 || /^\d/.test(t)) return t;
  if (t.endsWith("ies")) return t.slice(0, -3) + "y";
  if (t.endsWith("sses")) return t.slice(0, -2);
  if (/[sxz]es$|[cs]hes$/.test(t)) return t.slice(0, -2);
  if (t.endsWith("s") && !t.endsWith("ss") && !t.endsWith("us")) return t.slice(0, -1);
  return t;
}

const words = (text: string) => text.toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, " ").trim().split(" ").filter(t => t && !STOP.has(t));

/* Document tokens: raw word, its stem, and the parts of mixed tokens ("32oz" → "32", "oz") */
export function tokenize(text: string): string[] {
  const out: string[] = [];
  for (const t of words(text)) {
    out.push(t);
    const s = stem(t); if (s !== t) out.push(s);
    const m = t.match(/^(\d+)([a-z]+)$/) || t.match(/^([a-z]+)(\d+)$/);
    if (m) { out.push(m[1]); out.push(m[2]); }
  }
  return out;
}

/* Tokens plus every adjacent pair joined, so "pro team" indexes "proteam" and vice versa */
function withJoins(text: string): string[] {
  const w = words(text);
  const out = tokenize(text);
  for (let i = 0; i < w.length - 1; i++) {
    if (/^\d+$/.test(w[i]) && /^\d+$/.test(w[i + 1])) continue;
    out.push(w[i] + w[i + 1]);
    out.push(stem(w[i] + w[i + 1]));
  }
  return out;
}

/* ── Damerau-Levenshtein (optimal string alignment), capped ── */
function editDistance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let p2: number[] = [];
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = new Array<number>(b.length + 1);
    cur[0] = i; let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, p2[j - 2] + 1);
      cur[j] = v; if (v < rowMin) rowMin = v;
    }
    if (rowMin > max) return max + 1;
    p2 = prev; prev = cur;
  }
  return prev[b.length];
}

/* ── Index ── */
type Field = "sku" | "name" | "brand" | "category" | "desc";
const FIELD_WEIGHT: Record<Field, number> = { sku: 12, name: 10, brand: 9, category: 7, desc: 2 };
const FIELDS: Field[] = ["sku", "name", "brand", "category", "desc"];
const STRONG: Field[] = ["sku", "name", "brand", "category"];

interface Doc {
  product: ProductData;
  fields: Record<Field, Set<string>>;
  nameWords: string[];
  categoryText: string;
  skuCompact: string;
  accessory: boolean;
}

interface Index {
  docs: Doc[];
  vocabList: string[];               // strong-field tokens (for prefix / fuzzy)
  byToken: Map<string, Set<number>>; // token → doc ids (any field)
  builtAt: number;
}

const TTL_MS = 10 * 60 * 1000;
let index: Index | null = null;
let building: Promise<Index> | null = null;

function categoryNames(ids: number[], cats: Map<number, BCCategory>): string[] {
  const out = new Set<string>();
  for (const id of ids) {
    let c = cats.get(id); let hops = 0;
    while (c && hops < 4) {
      if (!/customer specific/i.test(c.name)) out.add(c.name);
      c = c.parent_id ? cats.get(c.parent_id) : undefined; hops++;
    }
  }
  return [...out];
}

async function fetchVisibleCatalog(): Promise<{ bc: BCProduct[]; cats: Map<number, BCCategory> }> {
  await loadBrandMap();
  const first = await getProducts({ page: 1, limit: 250, is_visible: true });
  const pages = first.meta.pagination.total_pages;
  const rest = await Promise.all(Array.from({ length: Math.max(0, pages - 1) }, (_, i) => getProducts({ page: i + 2, limit: 250, is_visible: true })));
  const bc = [first, ...rest].flatMap(r => r.data);
  let cats = new Map<number, BCCategory>();
  try { cats = new Map((await getCategories()).map(c => [c.id, c])); } catch {}
  return { bc, cats };
}

async function build(): Promise<Index> {
  const { bc, cats } = await fetchVisibleCatalog();
  const docs: Doc[] = [];
  const vocab = new Set<string>();
  const byToken = new Map<string, Set<number>>();
  const seenSku = new Set<string>();

  for (const raw of bc) {
    if (!raw || raw.price <= 0) continue;
    const p = transformProduct(raw);
    if (!p || seenSku.has(p.sku)) continue;
    seenSku.add(p.sku);
    const catNames = [...categoryNames(raw.categories || [], cats), p.category, p.subcategory].join(" ");
    const skuLower = p.sku.toLowerCase();
    const fields: Record<Field, Set<string>> = {
      sku: new Set([skuLower, skuLower.replace(/[^a-z0-9]/g, "")]),
      name: new Set(withJoins(p.name)),
      brand: new Set(withJoins(p.brand)),
      category: new Set(withJoins(catNames)),
      desc: new Set(tokenize(p.description)),
    };
    const id = docs.length;
    docs.push({
      product: p, fields,
      nameWords: words(p.name),
      categoryText: " " + words(catNames).join(" ") + " ",
      skuCompact: skuLower.replace(/[^a-z0-9]/g, ""),
      accessory: ACCESSORY.test(p.name),
    });
    for (const f of FIELDS) for (const t of fields[f]) {
      if (!byToken.has(t)) byToken.set(t, new Set());
      byToken.get(t)!.add(id);
      if (f !== "desc") vocab.add(t);
    }
  }
  return { docs, vocabList: [...vocab], byToken, builtAt: Date.now() };
}

export async function getIndex(): Promise<Index> {
  if (index && Date.now() - index.builtAt < TTL_MS) return index;
  if (!building) building = build().then(i => { index = i; building = null; return i; }).catch(e => { building = null; throw e; });
  return index ?? building; // stale copy serves immediately while the rebuild runs
}

/* ── Query expansion (phrases matched on word boundaries) ──
   Alias phrasings (brand/model names, "windex" → glass cleaner) are trusted like the
   shopper's own words; the broad synonym list is not, so its added words count half. */
interface Alt { text: string; trusted: boolean }
function expand(query: string): Alt[] {
  const q = words(query).join(" ");
  const alts = new Map<string, boolean>([[q, true]]);
  const padded = ` ${q} `;
  const add = (phrase: string, replacements: string[], trusted: boolean) => {
    const p = ` ${words(phrase).join(" ")} `;
    if (!p.trim() || !padded.includes(p)) return;
    for (const r of replacements) {
      const t = padded.replace(p, ` ${words(r).join(" ")} `).trim().replace(/\s+/g, " ");
      if (t && !alts.has(t)) alts.set(t, trusted);
    }
  };
  for (const [k, v] of Object.entries(ALIASES)) add(k, v, true);
  for (const [k, v] of Object.entries(SEARCH_SYNONYMS)) add(k, v, false);
  return [...alts].slice(0, 14).map(([text, trusted]) => ({ text, trusted }));
}

/* ── Matching ── */
interface Cand { token: string; quality: number }

/* Every index token a query word may stand for: exact (raw or stem), prefix, fuzzy */
function candidatesFor(raw: string, isLast: boolean, idx: Index): Cand[] {
  const out = new Map<string, number>();
  const put = (t: string, q: number) => { if (idx.byToken.has(t) && (out.get(t) ?? 0) < q) out.set(t, q); };
  put(raw, 1);
  put(stem(raw), 1);
  const m = raw.match(/^(\d+)([a-z]+)$/) || raw.match(/^([a-z]+)(\d+)$/);
  if (m) { put(m[1], 0.9); put(m[2], 0.9); }
  if (raw.length >= 3 && (isLast || raw.length >= 4)) {
    for (const v of idx.vocabList) if (v !== raw && v.startsWith(raw) && v.length - raw.length <= 6) put(v, 0.8);
  }
  if (raw.length >= 4 && !/^\d+$/.test(raw)) {
    const max = raw.length >= 8 ? 2 : 1;
    for (const v of idx.vocabList) {
      if (v === raw || /^\d+$/.test(v) || v.length < 4 || Math.abs(v.length - raw.length) > max) continue;
      if (v[0] !== raw[0] && v[1] !== raw[1]) continue;
      const d = editDistance(raw, v, max);
      if (d <= max) put(v, d === 1 ? 0.7 : 0.55);
    }
  }
  return [...out].map(([token, quality]) => ({ token, quality }));
}

interface Hit { score: number; cov: number }

function scoreAlt(alt: string, idx: Index, typing: boolean, fullLength: number, origWords: Set<string>): Map<number, Hit> {
  const scores = new Map<number, Hit>();
  const qw = words(alt).filter((t, i, a) => a.indexOf(t) === i);
  const n = qw.length;
  if (n === 0) return scores;
  // A shortened synonym ("glass cleaner" → "glass") must hit a strong field, not just the description
  const strongOnly = n < fullLength;
  const fields = strongOnly ? STRONG : FIELDS;
  const wantsAccessory = WANTS_ACCESSORY.test(alt);

  // Words a synonym added (e.g. "backpack" for "vacuum") count half as much as the shopper's own
  const own = qw.map(t => origWords.has(t) || origWords.has(stem(t)) ? 1 : 0.5);
  const ownShare = own.reduce((a, b) => a + b, 0) / n;
  const perToken = qw.map((t, i) => candidatesFor(t, typing && i === n - 1, idx));
  const joinOf = new Map<number, Cand[]>();
  for (let i = 0; i < n - 1; i++) {
    const j = qw[i] + qw[i + 1];
    const c: Cand[] = [];
    if (idx.byToken.has(j)) c.push({ token: j, quality: 0.95 });
    if (idx.byToken.has(stem(j))) c.push({ token: stem(j), quality: 0.95 });
    if (c.length) joinOf.set(i, c);
  }

  const docIds = new Set<number>();
  for (const list of perToken) for (const c of list) for (const d of idx.byToken.get(c.token) || []) docIds.add(d);
  for (const list of joinOf.values()) for (const c of list) for (const d of idx.byToken.get(c.token) || []) docIds.add(d);

  for (const id of docIds) {
    const doc = idx.docs[id];
    let matched = 0; let score = 0; let i = 0;
    while (i < n) {
      let best = 0; let extra = 0; let covers = 1;
      const jc = joinOf.get(i);
      if (jc) for (const c of jc) for (const f of fields) if (doc.fields[f].has(c.token)) { const s = FIELD_WEIGHT[f] * c.quality * 2; if (s > best) { best = s; covers = 2; } }
      if (covers === 1) {
        for (const c of perToken[i]) for (const f of fields) if (doc.fields[f].has(c.token)) {
          let s = FIELD_WEIGHT[f] * c.quality;
          if (f === "sku" && c.quality === 1) s += 40;
          if (s > best) { extra += best; best = s; } else extra += s;
        }
      }
      if (best > 0) { matched += covers; score += (best + Math.min(extra, best) * 0.25) * own[i]; i += covers; } else i++;
    }
    if (matched === 0) continue;
    // Phrase bonuses: whole phrase in the name, then any adjacent pair in the name
    const nameText = " " + doc.nameWords.join(" ") + " ";
    const stemmedName = " " + doc.nameWords.map(stem).join(" ") + " ";
    const phrase = " " + qw.join(" ") + " ";
    const stemmedPhrase = " " + qw.map(stem).join(" ") + " ";
    if (nameText.includes(phrase) || stemmedName.includes(stemmedPhrase)) score += 8 * n * ownShare;
    else {
      if (doc.categoryText.includes(phrase)) score += 3 * n * ownShare;
      for (let k = 0; k < n - 1; k++) {
        const pair = " " + stem(qw[k]) + " " + stem(qw[k + 1]) + " ";
        if (stemmedName.includes(pair)) score += 4;
      }
    }
    if (matched === n) score += 6;
    if (doc.accessory && !wantsAccessory) score *= 0.65;
    if (!doc.accessory && wantsAccessory) score *= 0.8;
    if (doc.product.inStock) score += 0.5;
    if (doc.product.images[0] && !doc.product.images[0].includes("placeholder")) score += 0.5;
    scores.set(id, { score, cov: matched / n });
  }
  return scores;
}

/* Best score and best coverage per product across every phrasing of the query */
function merge(query: string, idx: Index, typing: boolean): { alts: Alt[]; best: Map<number, Hit> } {
  const alts = expand(query);
  const origWords = new Set(words(query).flatMap(w => [w, stem(w)]));
  const fullLength = words(query).length;
  // The shopper's own words count in full; synonym and alias phrasings are discounted a
  // little so a product that matches what they actually typed wins ties, and matching the
  // original wording anywhere earns a small bonus on top.
  const best = new Map<number, Hit>();
  const original = new Set<number>();
  alts.forEach((alt, k) => {
    const factor = k === 0 ? 1 : 0.85;
    const trustedWords = alt.trusted ? new Set([...origWords, ...words(alt.text).flatMap(w => [w, stem(w)])]) : origWords;
    for (const [id, h] of scoreAlt(alt.text, idx, typing, fullLength, trustedWords)) {
      if (k === 0 && h.cov >= 0.999) original.add(id);
      const score = h.score * factor;
      const prev = best.get(id);
      if (!prev) best.set(id, { score, cov: h.cov });
      else { if (score > prev.score) prev.score = score; if (h.cov > prev.cov) prev.cov = h.cov; }
    }
  });
  for (const id of original) best.get(id)!.score += 4;
  return { alts, best };
}

export interface SearchOptions { limit?: number; typing?: boolean }

export async function searchCatalog(query: string, opts: SearchOptions = {}): Promise<{ results: ProductData[]; partial: boolean; total: number }> {
  const q = query.trim();
  if (q.length < 2) return { results: [], partial: false, total: 0 };
  const idx = await getIndex();
  const limit = opts.limit ?? 250;

  // Exact / compact SKU wins outright
  const compact = q.toLowerCase().replace(/[^a-z0-9]/g, "");
  const skuHits = idx.docs.filter(d => d.skuCompact === compact).map(d => d.product);

  const { best } = merge(q, idx, opts.typing ?? true);

  // AND: every query word matched (in at least one phrasing). Fall back to partial coverage.
  let ids = [...best.entries()].filter(([, v]) => v.cov >= 0.999);
  let partial = false;
  if (ids.length === 0) { ids = [...best.entries()].filter(([, v]) => v.cov >= 0.5); partial = ids.length > 0; }
  ids.sort((a, b) => b[1].score - a[1].score || a[0] - b[0]);

  const seen = new Set<string>(skuHits.map(p => p.sku));
  const results: ProductData[] = [...skuHits];
  for (const [id] of ids) {
    const p = idx.docs[id].product;
    if (seen.has(p.sku)) continue;
    seen.add(p.sku); results.push(p);
  }
  return { results: results.slice(0, limit), partial, total: results.length };
}

/* Debug view: why a product scored (for /api/products/search?debug=1) */
export async function explainSearch(query: string, limit = 15): Promise<{ alts: string[]; hits: { sku: string; name: string; score: number; cov: number }[] }> {
  const idx = await getIndex();
  const { alts, best } = merge(query.trim(), idx, true);
  const hits = [...best.entries()].sort((a, b) => b[1].score - a[1].score).slice(0, limit).map(([id, v]) => ({ sku: idx.docs[id].product.sku, name: idx.docs[id].product.name.slice(0, 70), score: Math.round(v.score * 10) / 10, cov: Math.round(v.cov * 100) / 100 }));
  return { alts: alts.map(a => a.text), hits };
}
