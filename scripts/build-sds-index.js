const fs = require('fs');
const path = require('path');

const SDS_DIR = path.join(__dirname, '../public/sds');
const CSV_PATH = '/Users/jarvis/Downloads/active_products.csv';
const OUTPUT_PATH = path.join(__dirname, '../src/data/sds-index.ts');

// Parse CSV
function parseCSV(text) {
  const lines = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      if (inQuotes && text[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === '\n' && !inQuotes) {
      if (current.endsWith('\r')) current = current.slice(0, -1);
      lines.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  if (current.trim()) lines.push(current);
  return lines.map(line => {
    const fields = [];
    let field = '';
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQ && line[i + 1] === '"') { field += '"'; i++; }
        else inQ = !inQ;
      } else if (ch === ',' && !inQ) {
        fields.push(field); field = '';
      } else {
        field += ch;
      }
    }
    fields.push(field);
    return fields;
  });
}

// Get all SDS filenames (without extension), mapped to actual filename
const sdsFiles = {};
for (const f of fs.readdirSync(SDS_DIR)) {
  if (f.toLowerCase().endsWith('.pdf')) {
    const base = f.replace(/\.PDF$/i, '');
    sdsFiles[base.toUpperCase()] = f;
  }
}
console.log(`Found ${Object.keys(sdsFiles).length} SDS files`);

// Parse products from CSV
const csv = fs.readFileSync(CSV_PATH, 'utf-8');
const rows = parseCSV(csv);
const products = [];

for (let i = 1; i < rows.length; i++) {
  const row = rows[i];
  if (row.length < 5) continue;

  let sku, name, price;
  if (row.length === 5) {
    sku = row[1].trim();
    name = row[2].trim();
    price = parseFloat(row[3]) || 0;
  } else if (row.length > 5) {
    sku = row[1].trim();
    name = row.slice(2, row.length - 2).join(',').trim();
    price = parseFloat(row[row.length - 2]) || 0;
  } else continue;

  if (!sku || !name) continue;
  products.push({ sku, name, price });
}

console.log(`Found ${products.length} products in CSV`);

// Match products to SDS files
const matches = [];
let matched = 0;

for (const product of products) {
  const skuUpper = product.sku.toUpperCase();

  // Try exact match
  let sdsFile = sdsFiles[skuUpper];

  // Try with EA suffix
  if (!sdsFile) sdsFile = sdsFiles[skuUpper + 'EA'];

  // Try without EA suffix
  if (!sdsFile && skuUpper.endsWith('EA')) {
    sdsFile = sdsFiles[skuUpper.slice(0, -2)];
  }

  // Try removing common prefixes
  if (!sdsFile) {
    const stripped = skuUpper.replace(/^(JF|MJS|SC|GJO|BOB|IMP)/, '');
    sdsFile = sdsFiles[stripped] || sdsFiles[stripped + 'EA'];
  }

  if (sdsFile) {
    matched++;
    matches.push({
      sku: product.sku,
      name: product.name,
      file: `/sds/${sdsFile}`,
    });
  }
}

console.log(`Matched ${matched}/${products.length} products to SDS files`);

// Build deduplicated SDS index — one entry per base SKU
// Prefer product-matched entries over bare "SDS - XXX" entries
// Prefer EA versions (which have product names) over base versions
const entryMap = new Map(); // baseKey -> entry

for (const [key, filename] of Object.entries(sdsFiles)) {
  const productMatch = matches.find(m => m.file === `/sds/${filename}`);
  const entry = productMatch || { sku: key, name: `SDS - ${key}`, file: `/sds/${filename}` };

  // Normalize to base SKU (strip trailing EA for dedup)
  const baseKey = key.replace(/EA$/i, '');

  const existing = entryMap.get(baseKey);
  if (!existing) {
    entryMap.set(baseKey, entry);
  } else {
    // Prefer product-matched over generic
    const existingIsGeneric = existing.name.startsWith('SDS - ');
    const newIsGeneric = entry.name.startsWith('SDS - ');
    if (existingIsGeneric && !newIsGeneric) {
      entryMap.set(baseKey, entry);
    }
  }
}

const allSdsEntries = Array.from(entryMap.values());
allSdsEntries.sort((a, b) => a.sku.localeCompare(b.sku));

console.log(`Total SDS entries: ${allSdsEntries.length}`);

// Generate TypeScript
let ts = `// Auto-generated SDS index - ${allSdsEntries.length} entries\n`;
ts += `// Product-matched: ${matched}, Standalone: ${allSdsEntries.length - matched}\n\n`;
ts += `export interface SDSEntry {\n  sku: string;\n  name: string;\n  file: string;\n}\n\n`;
ts += `export const sdsIndex: SDSEntry[] = [\n`;

for (const entry of allSdsEntries) {
  const safeName = entry.name.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  ts += `  { sku: '${entry.sku}', name: '${safeName}', file: '${entry.file}' },\n`;
}

ts += `];\n`;

fs.writeFileSync(OUTPUT_PATH, ts);
console.log(`Wrote ${OUTPUT_PATH}`);
