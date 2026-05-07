#!/usr/bin/env node
/**
 * sync-bc.js — Sync all BigCommerce product data into local files
 *
 * Fetches every visible product from BC including:
 * - Full-res zoom images
 * - Bulk pricing tiers
 * - Live prices, stock, descriptions
 *
 * Writes to: src/data/products.ts (curated) and src/data/imported-products.ts
 *
 * Usage: npm run sync-bc
 */

// Load .env.local manually
const envPath = require("path").join(__dirname, "../.env.local");
const envContent = require("fs").readFileSync(envPath, "utf-8");
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx > 0) process.env[trimmed.slice(0, eqIdx)] = trimmed.slice(eqIdx + 1);
}
const https = require("https");
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const STORE_HASH = process.env.BIGCOMMERCE_STORE_HASH;
const ACCESS_TOKEN = process.env.BIGCOMMERCE_ACCESS_TOKEN;

if (!STORE_HASH || !ACCESS_TOKEN) {
  console.error("Missing BIGCOMMERCE_STORE_HASH or BIGCOMMERCE_ACCESS_TOKEN in .env.local");
  process.exit(1);
}

function bcFetch(endpoint, params = {}) {
  return new Promise((resolve, reject) => {
    const qs = new URLSearchParams(params).toString();
    const urlPath = `/stores/${STORE_HASH}/v3/catalog${endpoint}${qs ? "?" + qs : ""}`;
    const req = https.request({
      hostname: "api.bigcommerce.com",
      path: urlPath,
      method: "GET",
      headers: {
        "X-Auth-Token": ACCESS_TOKEN,
        "Accept": "application/json",
        "Accept-Encoding": "gzip",
      },
    }, (res) => {
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => {
        let buffer = Buffer.concat(chunks);
        if (res.headers["content-encoding"] === "gzip") {
          try { buffer = zlib.gunzipSync(buffer); } catch {}
        }
        try { resolve(JSON.parse(buffer.toString("utf-8"))); }
        catch { reject(new Error("Failed to parse BC response")); }
      });
    });
    req.on("error", reject);
    req.end();
  });
}

async function getAllProducts() {
  const all = [];
  let page = 1;
  const maxPages = 50;

  while (page <= maxPages) {
    process.stdout.write(`  Fetching page ${page}...`);
    const res = await bcFetch("/products", {
      limit: "250",
      page: String(page),
      include: "images,bulk_pricing_rules",
      is_visible: "true",
    });

    const products = res.data || [];
    all.push(...products);
    process.stdout.write(` ${products.length} products (${all.length} total)\n`);

    if (page >= (res.meta?.pagination?.total_pages || 1)) break;
    page++;
  }

  return all;
}

// --- Category mapping (same as products-api.ts) ---
const BC_CATEGORY_MAP = {};
async function loadCategories() {
  let page = 1;
  while (page <= 10) {
    const res = await bcFetch("/categories", { limit: "250", page: String(page) });
    for (const cat of (res.data || [])) {
      BC_CATEGORY_MAP[cat.id] = cat;
    }
    if (page >= (res.meta?.pagination?.total_pages || 1)) break;
    page++;
  }
  console.log(`  Loaded ${Object.keys(BC_CATEGORY_MAP).length} categories`);
}

const SITE_CATEGORIES = {
  "paper-restroom": ["Paper & Restroom", [1100, 1101, 1102, 1103, 1104, 1105, 1106, 1126, 1127, 1203]],
  "cleaning-chemicals": ["Cleaning Chemicals", [1107, 1108, 1109, 1110, 1111, 1112, 1113, 1114, 1115, 1200, 1201, 1202, 1204, 1205, 1206, 1207, 1208, 1250, 1251, 1252, 1253, 1254, 1255, 1256, 1257, 1258, 1259, 1260, 1263, 1319, 1320, 1321, 1322, 1323, 1324, 1332]],
  "trash-liners": ["Trash Liners", [1116, 1117, 1118, 1119, 1120, 1121]],
  "gloves-safety": ["Gloves & Safety", [1122, 1123, 1124, 1125, 1128, 1209]],
  "packaging-film": ["Packaging & Shipping", [1129, 1130, 1131]],
  "breakroom": ["Breakroom", [1132, 1133, 1134, 1135, 1136, 1137, 1138, 1139, 1140, 1210, 1211, 1306, 1307, 1308, 1309]],
  "equipment": ["Equipment", [1092, 1093, 1094, 1095, 1096, 1097, 1141, 1142, 1143, 1144, 1145, 1146, 1147, 1148, 1149, 1150, 1151, 1152, 1212, 1213, 1214, 1270, 1271, 1272, 1273, 1274, 1275, 1310, 1311, 1312, 1313, 1314, 1315, 1316, 1317, 1318, 1326, 1327, 1328, 1329, 1330, 1334]],
  "floor-care": ["Floor Care", [1153, 1154, 1155, 1156, 1157, 1158, 1159, 1160, 1161, 1162, 1163, 1164, 1165, 1166, 1167, 1276, 1277, 1278, 1279, 1280, 1281, 1282, 1283, 1284, 1285, 1286, 1287, 1288, 1289, 1290, 1291, 1331]],
  "car-detailing": ["Car Detailing", [1168, 1169, 1170, 1171, 1172, 1173, 1174, 1175, 1176, 1177, 1178, 1179, 1180, 1293, 1294, 1295, 1296, 1297, 1298, 1299, 1300, 1301, 1302, 1303, 1304, 1305, 1325]],
};

function getSiteCategory(bcCategoryIds) {
  for (const [key, [, ids]] of Object.entries(SITE_CATEGORIES)) {
    if (bcCategoryIds.some(id => ids.includes(id))) return key;
  }
  return "equipment";
}

function getSiteCategoryName(key) {
  return SITE_CATEGORIES[key]?.[0] || "Equipment";
}

function getSubcategory(bc) {
  const catIds = bc.categories || [];
  for (const id of catIds) {
    const cat = BC_CATEGORY_MAP[id];
    if (cat && cat.parent_id && cat.parent_id > 0) {
      const name = cat.name.split(/[,/]/)[0].trim();
      return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    }
  }
  return "General";
}

function getUnit(name, subcategory) {
  const n = name.toLowerCase();
  const s = subcategory.toLowerCase();
  if (s.includes("liner") || s.includes("trash") || n.includes("can liner") || n.includes("trash bag")) return "Case";
  if (s.includes("glove") || n.includes("glove")) return "Box";
  if (n.includes("32 oz") || n.includes("32oz") || n.includes("quart") || n.includes("qt.") || n.includes("qt ")) return "Quart";
  if (n.includes("gallon") || n.includes("gal ") || n.includes("gal.") || n.includes("1 gal")) return "Gallon";
  if (s.includes("vacuum") || s.includes("machine") || s.includes("dispenser")) return "Unit";
  if (s.includes("roll towel") || s.includes("tissue")) return "Carton";
  return "Case";
}

function makeCardTitle(name) {
  let title = name
    .replace(/\([\w-]+\)\s*$/, "")
    .replace(/^(JANITORS FINEST|GENUINE JOE|SUNNYCARE|ALPINE INDUSTRIES|CHEMCOR|CHASE PRODUCTS|PLATINUM KNIGHT|SOFT TOUCH)[®™,\s]*/i, "")
    .trim();
  if (title.length > 45) title = title.slice(0, 42) + "...";
  return title;
}

function extractBrand(name) {
  const brands = ["Janitors Finest", "Genuine Joe", "SunnyCare", "Alpine Industries", "ChemCor", "Chase Products", "Platinum Knight", "Soft Touch", "Mosquito", "GoFit", "ProTeam"];
  for (const b of brands) {
    if (name.toLowerCase().includes(b.toLowerCase())) return b;
  }
  return "MJS";
}

function extractPack(name) {
  const m = name.match(/(\d+)\s*\/?\s*(cs|ct|case|carton|pk|pack|bx|box|roll|each|gallon|gal|dz|ea)/i);
  if (m) return m[0];
  if (/each/i.test(name)) return "Each";
  return "Each";
}

function transformBCProduct(bc) {
  const siteCategory = getSiteCategory(bc.categories || []);
  const siteCategoryName = getSiteCategoryName(siteCategory);
  const subcategory = getSubcategory(bc);

  // Images — zoom (full res) with standard fallback
  const images = (bc.images || [])
    .sort((a, b) => (a.is_thumbnail ? -1 : 1) - (b.is_thumbnail ? -1 : 1))
    .map((img) => img.url_zoom || img.url_standard)
    .filter(Boolean);

  const slug = bc.custom_url?.url
    ? bc.custom_url.url.replace(/^\/|\/$/g, "").replace(/\//g, "-").replace(/-{2,}/g, "-").replace(/^-|-$/g, "")
    : `product-${bc.id}`;

  const basePrice = Math.round((bc.calculated_price || bc.price) * 100) / 100;
  const unit = getUnit(bc.name, subcategory);
  const plural = unit === "Box" ? "Boxes" : unit + "s";

  // Build tier pricing
  const quickBuy = [{ label: `1 ${unit}`, qty: 1, unitPrice: basePrice }];
  const rules = bc.bulk_pricing_rules || [];
  if (rules.length > 0) {
    const sorted = [...rules].sort((a, b) => a.quantity_min - b.quantity_min);
    for (const rule of sorted) {
      let tierPrice = basePrice;
      if (rule.type === "percent") tierPrice = basePrice * (1 - rule.amount / 100);
      else if (rule.type === "price") tierPrice = basePrice - rule.amount;
      else if (rule.type === "fixed") tierPrice = rule.amount;
      tierPrice = Math.round(tierPrice * 100) / 100;
      const savings = Math.round((basePrice - tierPrice) * 100) / 100;
      quickBuy.push({
        label: `${rule.quantity_min}+ ${plural}`,
        qty: rule.quantity_min,
        unitPrice: tierPrice,
        ...(savings > 0 ? { savings: `Save $${savings.toFixed(2)}/${unit.toLowerCase()}` } : {}),
      });
    }
  }

  const brand = extractBrand(bc.name);
  const description = bc.description
    ? bc.description.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 500)
    : `${bc.name}. Professional-grade product for commercial and industrial use.`;

  return {
    slug,
    sku: bc.sku || `BC-${bc.id}`,
    name: bc.name,
    brand,
    price: basePrice,
    rating: bc.reviews_count > 0 && bc.reviews_rating_sum
      ? Math.round((bc.reviews_rating_sum / bc.reviews_count) * 10) / 10 : 0,
    reviewCount: bc.reviews_count || 0,
    images: images.length > 0 ? images : ["/images/placeholder-product.svg"],
    inStock: bc.availability === "available" && (bc.inventory_tracking === "none" || bc.inventory_level > 0),
    stockQty: bc.inventory_level || 0,
    description,
    highlights: [`SKU: ${bc.sku}`, ...(bc.weight > 0 ? [`Weight: ${bc.weight} lbs`] : []), "Professional grade quality"],
    specs: {
      SKU: bc.sku || "",
      Brand: brand,
      ...(bc.weight > 0 ? { Weight: `${bc.weight} lbs` } : {}),
    },
    category: siteCategoryName,
    subcategory,
    cardTitle: makeCardTitle(bc.name),
    pack: extractPack(bc.name),
    imageFit: "contain",
    quickBuy,
  };
}

function serializeProduct(p) {
  const lines = [];
  lines.push(`  {`);
  lines.push(`    slug: ${JSON.stringify(p.slug)},`);
  lines.push(`    sku: ${JSON.stringify(p.sku)},`);
  lines.push(`    name: ${JSON.stringify(p.name)},`);
  lines.push(`    brand: ${JSON.stringify(p.brand)},`);
  lines.push(`    price: ${p.price},`);
  lines.push(`    rating: ${p.rating},`);
  lines.push(`    reviewCount: ${p.reviewCount},`);
  lines.push(`    images: ${JSON.stringify(p.images)},`);
  lines.push(`    inStock: ${p.inStock},`);
  lines.push(`    stockQty: ${p.stockQty},`);
  lines.push(`    description: ${JSON.stringify(p.description)},`);
  lines.push(`    highlights: ${JSON.stringify(p.highlights)},`);
  lines.push(`    specs: ${JSON.stringify(p.specs)},`);
  lines.push(`    category: ${JSON.stringify(p.category)},`);
  lines.push(`    subcategory: ${JSON.stringify(p.subcategory)},`);
  lines.push(`    cardTitle: ${JSON.stringify(p.cardTitle)},`);
  lines.push(`    pack: ${JSON.stringify(p.pack)},`);
  lines.push(`    imageFit: 'contain',`);
  lines.push(`    quickBuy: ${JSON.stringify(p.quickBuy)},`);
  lines.push(`  }`);
  return lines.join("\n");
}

async function main() {
  console.log("=== MJS BigCommerce Sync ===\n");

  // Load categories for subcategory mapping
  console.log("1. Loading BC categories...");
  await loadCategories();

  // Fetch all products
  console.log("\n2. Fetching all visible products from BC...");
  const bcProducts = await getAllProducts();
  console.log(`   Total: ${bcProducts.length} products\n`);

  // Load existing curated products to preserve their SKUs
  console.log("3. Loading curated product SKUs...");
  const productsPath = path.join(__dirname, "../src/data/products.ts");
  const productsContent = fs.readFileSync(productsPath, "utf-8");
  const curatedSkus = new Set();
  const skuMatches = productsContent.matchAll(/sku:\s*"([^"]+)"/g);
  for (const m of skuMatches) curatedSkus.add(m[1]);
  console.log(`   ${curatedSkus.size} curated SKUs found\n`);

  // Transform and filter
  console.log("4. Transforming products...");
  const SKIP_SKUS = new Set(["10712", "143133", "143136", "1426410", "166778", "4385163EA", "1672", "9290", "315855", "83201"]);
  const transformed = [];
  const skippedNoPrice = [];
  const seen = new Set();

  for (const bc of bcProducts) {
    if (!bc.sku || SKIP_SKUS.has(bc.sku)) continue;
    if (bc.price <= 0 && bc.calculated_price <= 0) { skippedNoPrice.push(bc.sku); continue; }
    if (seen.has(bc.sku)) continue;
    seen.add(bc.sku);

    const product = transformBCProduct(bc);
    if (product) transformed.push(product);
  }
  console.log(`   Transformed: ${transformed.length}`);
  console.log(`   Skipped (no price): ${skippedNoPrice.length}`);

  // Split into curated updates and imported
  const curatedUpdates = {};
  const imported = [];
  for (const p of transformed) {
    if (curatedSkus.has(p.sku)) {
      curatedUpdates[p.sku] = p;
    } else {
      imported.push(p);
    }
  }
  console.log(`   Curated updates: ${Object.keys(curatedUpdates).length}`);
  console.log(`   Imported products: ${imported.length}\n`);

  // Update curated products — only update images, price, quickBuy, stockQty, inStock, description
  console.log("5. Updating curated products...");
  let updatedContent = productsContent;
  let curatedUpdated = 0;
  for (const [sku, bcData] of Object.entries(curatedUpdates)) {
    // Update images
    const imgPattern = new RegExp(
      `(sku:\\s*"${sku.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[\\s\\S]*?images:\\s*)\\[[^\\]]*\\]`
    );
    if (imgPattern.test(updatedContent) && bcData.images[0] !== "/images/placeholder-product.svg") {
      updatedContent = updatedContent.replace(imgPattern, `$1${JSON.stringify(bcData.images)}`);
    }
    // Update price
    const pricePattern = new RegExp(
      `(sku:\\s*"${sku.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[\\s\\S]*?price:\\s*)([\\d.]+)`
    );
    if (pricePattern.test(updatedContent)) {
      updatedContent = updatedContent.replace(pricePattern, `$1${bcData.price}`);
    }
    // Update quickBuy — find the quickBuy array for this SKU by locating it and matching balanced brackets
    if (bcData.quickBuy && bcData.quickBuy.length > 0) {
      const skuIdx = updatedContent.indexOf(`sku: "${sku}"`);
      if (skuIdx > -1) {
        const qbMarker = "quickBuy: [";
        const qbStart = updatedContent.indexOf(qbMarker, skuIdx);
        // Make sure this quickBuy belongs to this product (before next product's sku:)
        const nextSkuIdx = updatedContent.indexOf('sku: "', skuIdx + 10);
        if (qbStart > -1 && (nextSkuIdx === -1 || qbStart < nextSkuIdx)) {
          // Find the matching closing bracket
          let depth = 0;
          let qbEnd = qbStart + qbMarker.length - 1; // position of opening [
          for (let i = qbEnd; i < updatedContent.length; i++) {
            if (updatedContent[i] === '[') depth++;
            else if (updatedContent[i] === ']') { depth--; if (depth === 0) { qbEnd = i + 1; break; } }
          }
          updatedContent = updatedContent.slice(0, qbStart) + "quickBuy: " + JSON.stringify(bcData.quickBuy) + updatedContent.slice(qbEnd);
        }
      }
    }
    curatedUpdated++;
  }
  fs.writeFileSync(productsPath, updatedContent);
  console.log(`   Updated ${curatedUpdated} curated products\n`);

  // Write imported products
  console.log("6. Writing imported products...");
  const importedPath = path.join(__dirname, "../src/data/imported-products.ts");
  const importedLines = [
    `import type { ProductData } from './product-types';`,
    ``,
    `// Auto-synced from BigCommerce on ${new Date().toISOString().split("T")[0]}`,
    `// ${imported.length} products`,
    ``,
    `export const importedProducts: ProductData[] = [`,
    imported.map(p => serializeProduct(p)).join(",\n"),
    `];`,
  ];
  fs.writeFileSync(importedPath, importedLines.join("\n") + "\n");
  console.log(`   Wrote ${imported.length} imported products\n`);

  console.log("=== Sync complete! ===");
  console.log(`Total: ${transformed.length} products (${curatedUpdated} curated + ${imported.length} imported)`);
  console.log("\nNext steps:");
  console.log("  1. npm run build   (verify it compiles)");
  console.log("  2. git add -A && git commit -m 'sync BC data'");
  console.log("  3. git push        (Vercel auto-deploys)");
}

main().catch((err) => {
  console.error("Sync failed:", err);
  process.exit(1);
});
