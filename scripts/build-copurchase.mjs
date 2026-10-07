#!/usr/bin/env node
/**
 * Build the "frequently bought together" table from real BigCommerce orders.
 *
 *   node scripts/build-copurchase.mjs            # pull the last 3 years of orders and rebuild
 *   node scripts/build-copurchase.mjs --months 18
 *
 * Writes src/data/copurchase.json:
 *   { generatedAt, orders, pairs: { [sku]: [{ sku, orders, conf, lift }] } }
 *
 * conf = share of orders containing A that also contain B
 * lift = how much more often A and B appear together than chance (corrects for staples)
 * Re-run monthly (or add to the sync-bc routine) so recommendations track current buying.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const env = Object.fromEntries(
  fs.readFileSync(path.join(root, ".env.local"), "utf8").split("\n")
    .filter(l => l.includes("=") && !l.startsWith("#"))
    .map(l => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, "")]; })
);
const STORE = env.BIGCOMMERCE_STORE_HASH, TOKEN = env.BIGCOMMERCE_ACCESS_TOKEN;
const H = { "X-Auth-Token": TOKEN, Accept: "application/json" };

const monthsArg = process.argv.indexOf("--months");
const months = monthsArg > -1 ? Number(process.argv[monthsArg + 1]) : 36;
const since = new Date(); since.setMonth(since.getMonth() - months);

const MIN_PAIR_ORDERS = 3;   // ignore pairs seen fewer times than this
const TOP_PER_SKU = 15;
// incomplete, pending, refunded, cancelled, declined, disputed
const SKIP_STATUS = new Set([0, 1, 4, 5, 6, 13]);

async function get(url) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const r = await fetch(url, { headers: H });
    if (r.status === 429) { await new Promise(s => setTimeout(s, 5000 * (attempt + 1))); continue; }
    if (r.status === 204) return [];
    if (!r.ok) throw new Error(`${r.status} ${url}`);
    return r.json();
  }
  return [];
}

async function main() {
  console.log(`Pulling orders since ${since.toISOString().slice(0, 10)}…`);
  const orders = [];
  for (let page = 1; ; page++) {
    const r = await get(`https://api.bigcommerce.com/stores/${STORE}/v2/orders?limit=250&page=${page}&min_date_created=${since.toISOString()}&sort=date_created:desc`);
    if (!Array.isArray(r) || r.length === 0) break;
    orders.push(...r);
    if (r.length < 250) break;
  }
  const keep = orders.filter(o => !SKIP_STATUS.has(o.status_id) && o.items_total >= 1);
  console.log(`${orders.length} orders, ${keep.length} completed`);

  const baskets = [];
  let done = 0;
  const queue = [...keep];
  const worker = async () => {
    while (queue.length) {
      const o = queue.shift();
      const ps = await get(`https://api.bigcommerce.com/stores/${STORE}/v2/orders/${o.id}/products?limit=250`);
      const skus = [...new Set((Array.isArray(ps) ? ps : []).map(p => (p.sku || "").trim()).filter(Boolean))];
      if (skus.length) baskets.push(skus);
      if (++done % 250 === 0) console.log(`  ${done}/${keep.length}`);
    }
  };
  await Promise.all([worker(), worker(), worker(), worker()]);

  const N = baskets.length;
  const freq = {}, pair = {};
  for (const skus of baskets) {
    for (const s of skus) freq[s] = (freq[s] || 0) + 1;
    for (const a of skus) for (const b of skus) if (a < b) { const k = `${a}|${b}`; pair[k] = (pair[k] || 0) + 1; }
  }

  const pairs = {};
  for (const [k, c] of Object.entries(pair)) {
    if (c < MIN_PAIR_ORDERS) continue;
    const [a, b] = k.split("|");
    const lift = (c / N) / ((freq[a] / N) * (freq[b] / N));
    (pairs[a] ||= []).push({ sku: b, orders: c, conf: +(c / freq[a]).toFixed(3), lift: +lift.toFixed(2) });
    (pairs[b] ||= []).push({ sku: a, orders: c, conf: +(c / freq[b]).toFixed(3), lift: +lift.toFixed(2) });
  }
  const score = r => r.conf * Math.log(1 + r.lift);
  for (const sku of Object.keys(pairs)) pairs[sku] = pairs[sku].sort((x, y) => score(y) - score(x)).slice(0, TOP_PER_SKU);

  const out = { generatedAt: new Date().toISOString(), orders: N, skusWithPairs: Object.keys(pairs).length, pairs };
  const dest = path.join(root, "src", "data", "copurchase.json");
  fs.writeFileSync(dest, JSON.stringify(out));
  console.log(`Wrote ${dest}: ${N} baskets, ${Object.keys(pairs).length} SKUs with pairings`);
}

main().catch(err => { console.error(err); process.exit(1); });
