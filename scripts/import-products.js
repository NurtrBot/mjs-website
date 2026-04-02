const fs = require('fs');
const path = require('path');

// ── CSV Parser (handles quoted fields with commas) ──────────────────────────
function parseCSV(text) {
  const lines = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      if (inQuotes && text[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === '\n' && !inQuotes) {
      if (current.endsWith('\r')) current = current.slice(0, -1);
      lines.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  if (current.trim()) lines.push(current);

  const rows = [];
  for (const line of lines) {
    const fields = [];
    let field = '';
    let q = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (q && line[i + 1] === '"') { field += '"'; i++; }
        else q = !q;
      } else if (ch === ',' && !q) {
        fields.push(field);
        field = '';
      } else {
        field += ch;
      }
    }
    fields.push(field);

    // CSV format: ID, SKU, Name, Price, Stock (5 cols)
    // Many rows have unquoted Name fields containing commas.
    // Strategy: first 2 fields are always ID & SKU.
    // We need to find Price (float) and Stock (int) as the last two comma-separated values.
    if (fields.length === 5) {
      rows.push(fields);
      continue;
    }

    if (fields.length > 5) {
      // More than 5 fields: try last 2 as price & stock
      const stock = fields[fields.length - 1];
      const price = fields[fields.length - 2];
      if (/^\s*[\d.]+\s*$/.test(price) && /^\s*[\d.]+\s*$/.test(stock)) {
        const name = fields.slice(2, fields.length - 2).join(',');
        rows.push([fields[0], fields[1], name, price, stock]);
        continue;
      }
    }

    if (fields.length < 5 && fields.length >= 3) {
      // Fewer than 5 fields: the last field likely contains embedded commas with price,stock at end.
      // Try to extract ",price,stock" from the end of the combined remaining text.
      const combined = fields.slice(2).join(',');
      // Match: ...text,price,stock at the end where price is a decimal and stock is an integer
      const m = combined.match(/^(.+),(\d+(?:\.\d+)?),(\d+)$/);
      if (m) {
        rows.push([fields[0], fields[1], m[1], m[2], m[3]]);
        continue;
      }
    }

    rows.push(fields);
  }
  return rows;
}

// ── Known brands ────────────────────────────────────────────────────────────
const KNOWN_BRANDS = [
  'Janitors Finest',
  'Genuine Joe',
  'SunnyCare',
  'Alpine Industries',
  'Chase Products',
  'Platinum Knight',
  'Soft Touch',
  'Wonder Wafers',
  'Simple Green',
  'Chemcor',
  'Oasis',
  'IPC Eagle',
  'Ettore',
  'Sandia',
  'Mercury',
  'Rubbermaid',
  'Purell',
  'Durable Packaging',
  'Procell',
  "LA's Totally Awesome",
  'Stone Pro',
  'Foam-eeze',
  'Strike Bac',
  'Purox',
  'Johnny\'s Choice',
];

// ── Category rules ──────────────────────────────────────────────────────────
const CATEGORY_RULES = [
  {
    category: 'Car Detailing',
    keywords: ['car wash', 'auto ', 'ceramic coat', 'detail', 'wax shield', 'platinum knight', 'car shampoo', 'auto air freshener', 'auto freshener', 'wonder wafer'],
    subcategoryRules: [
      { sub: 'Coatings', kw: ['ceramic', 'coat', 'wax shield', 'platinum knight'] },
      { sub: 'Car Wash', kw: ['car wash', 'shampoo'] },
      { sub: 'Air Fresheners', kw: ['freshener', 'wafer'] },
      { sub: 'Detailing', kw: ['detail'] },
    ],
    defaultSub: 'General',
  },
  {
    category: 'Trash Liners',
    keywords: ['liner', 'trash', 'can liner', 'garbage', 'trash bag'],
    subcategoryRules: [
      { sub: 'Compostable Liners', kw: ['compostable', 'compost'] },
      { sub: 'High Density Liners', kw: ['high density', 'hd ', 'hi density', 'hdpe'] },
      { sub: 'Low Density Liners', kw: ['low density', 'ld ', 'ldpe'] },
    ],
    defaultSub: 'Can Liners',
  },
  {
    category: 'Gloves & Safety',
    keywords: ['glove', 'nitrile', 'latex glove', 'vinyl glove', 'safety', ' mask', 'goggle', 'latex exam', 'nitrile exam'],
    subcategoryRules: [
      { sub: 'Nitrile Gloves', kw: ['nitrile'] },
      { sub: 'Latex Gloves', kw: ['latex'] },
      { sub: 'Vinyl Gloves', kw: ['vinyl'] },
      { sub: 'Safety Equipment', kw: ['mask', 'goggle', 'safety'] },
    ],
    defaultSub: 'Gloves',
  },
  {
    category: 'Paper & Restroom',
    keywords: ['towel', 'tissue', 'toilet', 'napkin', 'seat cover', 'facial', 'paper towel', 'roll towel', 'bath tissue', 'bathroom tissue', 'toilet paper', 'c-fold', 'multifold', 'center pull'],
    subcategoryRules: [
      { sub: 'Seat Covers', kw: ['seat cover'] },
      { sub: 'Toilet Tissue', kw: ['toilet', 'bath tissue', 'bathroom tissue'] },
      { sub: 'Roll Towels', kw: ['roll towel', 'hardwound', 'center pull'] },
      { sub: 'Multifolds', kw: ['multifold', 'c-fold', 'multi-fold'] },
      { sub: 'Paper Towels', kw: ['towel'] },
      { sub: 'Facial Tissue', kw: ['facial'] },
      { sub: 'Napkins', kw: ['napkin'] },
    ],
    defaultSub: 'Paper Products',
  },
  {
    category: 'Cleaning Chemicals',
    keywords: ['cleaner', 'degreaser', 'disinfect', 'sanitiz', 'soap', 'detergent', 'bleach', 'chemical', ' wipe', 'wipes', 'freshener', 'scent', 'odor', 'deodoriz', 'hand wash', 'dish wash', 'dishwash', 'ammonia', 'stripper', 'floor finish', 'floor seal', 'floor wax', 'carpet', 'spray buff', 'extraction', 'shampoo', 'spot remov', 'defoam', 'laundry', 'oven', 'grill clean', 'glass clean', 'lime', 'rust remov', 'air freshener', 'hand clean', 'lotion soap', 'foam soap', 'liquid soap', 'hand sanitiz', 'restroom clean', 'bowl clean', 'tile clean', 'grout clean', 'stainless steel clean', 'multi purpose', 'all purpose', 'concentrated clean', 'lime away', 'cream clean', 'scouring', 'pine clean', 'disinfecting wipe', 'germicid', 'antibacter', 'toss-in'],
    subcategoryRules: [
      { sub: 'Floor Care Chemicals', kw: ['floor finish', 'floor seal', 'floor wax', 'spray buff', 'strip', 'burnish'] },
      { sub: 'Carpet Care', kw: ['carpet', 'extraction', 'defoam'] },
      { sub: 'Disinfectants', kw: ['disinfect', 'germicid', 'antibacter', 'sanitiz'] },
      { sub: 'Hand Soap & Sanitizer', kw: ['soap', 'hand wash', 'hand clean', 'hand sanitiz', 'lotion soap', 'foam soap', 'liquid soap', 'purell'] },
      { sub: 'Air Fresheners', kw: ['freshener', 'odor', 'deodoriz', 'scent'] },
      { sub: 'Degreasers', kw: ['degreaser', 'concentrated clean', 'industrial clean', 'all purpose'] },
      { sub: 'Restroom Cleaners', kw: ['restroom', 'bowl clean', 'toilet clean', 'tile clean', 'grout clean', 'toss-in'] },
      { sub: 'Laundry', kw: ['laundry', 'detergent'] },
      { sub: 'Kitchen Chemicals', kw: ['dish', 'oven', 'grill'] },
      { sub: 'Glass Cleaners', kw: ['glass clean'] },
      { sub: 'Bleach', kw: ['bleach'] },
      { sub: 'Wipes', kw: ['wipe'] },
    ],
    defaultSub: 'General Cleaners',
  },
  {
    category: 'Packaging & Shipping',
    keywords: ['stretch', 'film', 'wrap', ' tape', 'box ', 'packaging', 'bubble', 'shipping', 'shrink'],
    subcategoryRules: [
      { sub: 'Stretch Film', kw: ['stretch', 'film'] },
      { sub: 'Tape', kw: ['tape'] },
      { sub: 'Boxes', kw: ['box'] },
      { sub: 'Bubble Wrap', kw: ['bubble'] },
    ],
    defaultSub: 'Packaging Supplies',
  },
  {
    category: 'Breakroom',
    keywords: [' cup', 'cups', 'plate', ' fork', 'spoon', 'knife', 'straw', ' lid', 'food container', 'foam cup', 'foam plate', 'cutlery', 'cater tray', 'aluminum tray', 'food service'],
    subcategoryRules: [
      { sub: 'Cups & Lids', kw: ['cup', 'lid'] },
      { sub: 'Plates & Bowls', kw: ['plate', 'bowl', 'tray'] },
      { sub: 'Cutlery', kw: ['fork', 'spoon', 'knife', 'cutlery'] },
      { sub: 'Straws', kw: ['straw'] },
      { sub: 'Food Containers', kw: ['container', 'food'] },
    ],
    defaultSub: 'Breakroom Supplies',
  },
  {
    category: 'Floor Care',
    keywords: ['floor brush', 'floor pad', 'floor machine', 'burnish', 'rotary floor', 'bonnet', 'floor scrub', 'carpet bonnet'],
    subcategoryRules: [
      { sub: 'Floor Pads', kw: ['pad', 'bonnet'] },
      { sub: 'Floor Brushes', kw: ['brush', 'rotary'] },
      { sub: 'Floor Machines', kw: ['machine', 'burnish', 'scrub'] },
    ],
    defaultSub: 'Floor Care',
  },
  {
    category: 'Equipment & Tools',
    keywords: ['mop', 'bucket', 'broom', 'squeegee', 'vacuum', 'dispenser', 'cart', ' pad', 'brush', 'handle', 'dust pan', 'dustpan', 'machine', 'scrubber', 'duster', 'spray bottle', 'trigger', 'pole', 'extension pole', 'wringer', 'sign', 'wet floor', 'caddy', 'rack', 'shelf', 'hook', 'battery', 'extractor', 'air mover', 'window', 'washer scrub'],
    subcategoryRules: [
      { sub: 'Mops & Handles', kw: ['mop', 'handle', 'wringer'] },
      { sub: 'Brooms & Dustpans', kw: ['broom', 'dust pan', 'dustpan', 'sweep'] },
      { sub: 'Buckets & Wringers', kw: ['bucket', 'wringer'] },
      { sub: 'Vacuums', kw: ['vacuum', 'vac'] },
      { sub: 'Carpet Extractors', kw: ['extractor'] },
      { sub: 'Dusters', kw: ['duster', 'dusting'] },
      { sub: 'Squeegees', kw: ['squeegee'] },
      { sub: 'Spray Bottles', kw: ['spray bottle'] },
      { sub: 'Dispensers', kw: ['dispenser'] },
      { sub: 'Carts & Shelving', kw: ['cart', 'shelf', 'rack'] },
      { sub: 'Window Cleaning', kw: ['window', 'washer scrub'] },
      { sub: 'Safety Signs', kw: ['sign', 'wet floor'] },
      { sub: 'Air Movers', kw: ['air mover', 'carpet dryer'] },
      { sub: 'Batteries', kw: ['battery', 'batteries'] },
      { sub: 'Brushes & Pads', kw: ['brush', 'pad'] },
    ],
    defaultSub: 'General Equipment',
  },
];

// ── Helpers ─────────────────────────────────────────────────────────────────

function categorize(name) {
  const lower = name.toLowerCase();

  // ── Priority overrides: catch mismatches before general rules ──
  // Dispensers are ALWAYS Equipment & Tools (soap, towel, tissue dispensers)
  if (lower.includes('dispenser')) {
    let sub = 'Dispensers';
    if (lower.includes('soap') || lower.includes('sanitiz')) sub = 'Soap Dispensers';
    else if (lower.includes('towel')) sub = 'Towel Dispensers';
    else if (lower.includes('tissue') || lower.includes('toilet')) sub = 'Tissue Dispensers';
    else if (lower.includes('seat cover')) sub = 'Seat Cover Dispensers';
    return { category: 'Equipment & Tools', subcategory: sub };
  }

  // Wipes go to Cleaning Chemicals
  if (lower.includes('wipe') || lower.includes('wipes')) {
    return { category: 'Cleaning Chemicals', subcategory: 'Wipes' };
  }

  for (const rule of CATEGORY_RULES) {
    const matched = rule.keywords.some(kw => lower.includes(kw));
    if (!matched) continue;

    let subcategory = rule.defaultSub;
    for (const sr of rule.subcategoryRules) {
      if (sr.kw.some(k => lower.includes(k))) {
        subcategory = sr.sub;
        break;
      }
    }
    return { category: rule.category, subcategory };
  }

  return { category: 'Equipment & Tools', subcategory: 'General Equipment' };
}

function slugify(name, sku) {
  const base = name
    .toLowerCase()
    .replace(/[®™©]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
  return `${base}-${sku.toLowerCase()}`;
}

// Words that should NOT be treated as brand names
const NON_BRAND_WORDS = new Set([
  'latex', 'nitrile', 'vinyl', 'stretch', 'foam', 'paper', 'drink', 'napkin',
  'towel', 'tissue', 'toilet', 'trash', 'liner', 'cup', 'plate', 'glove',
  'mop', 'broom', 'bucket', 'bleach', 'soap', 'wipe', 'tape', 'bubble',
  'box', 'bag', 'can', 'floor', 'dust', 'open', 'machine', 'super', 'nylon',
  'white', 'black', 'blue', 'green', 'red', 'yellow', 'grey', 'gray',
  'heavy', 'light', 'large', 'small', 'medium', 'premium', 'economy',
  'industrial', 'professional', 'commercial', 'standard', 'traditional',
  'tradition', 'disinfecting', 'enriched', 'bouffant', 'retractable', 'quick',
  'carton', 'manual', 'automatic', 'clear', 'round', 'classic', 'micro',
  'carpet', 'shelf', 'nifty', 'bowl', 'temporary', 'cut-end', 'freshprod',
  'smartrags', 'sample', 'jumbo', 'looped', 'lifeguard', 'life', 'universal',
]);

function extractBrand(name) {
  const upper = name.toUpperCase();
  // Check known brands (case-insensitive)
  for (const brand of KNOWN_BRANDS) {
    if (upper.includes(brand.toUpperCase())) return brand;
  }
  // Try extracting first word/phrase before comma or space
  const firstPart = name.split(/[,]/)[0].trim();
  const words = firstPart.split(/\s+/);
  // If first word looks like a brand (starts with capital, not a number, not a size, not a common product word)
  if (words[0] && /^[A-Z]/.test(words[0]) && !/^\d/.test(words[0]) && !/^#/.test(words[0])) {
    const candidate = words[0].replace(/[®™©"]/g, '');
    if (!NON_BRAND_WORDS.has(candidate.toLowerCase()) && candidate.length > 1) {
      return candidate;
    }
  }
  return 'MJS';
}

function extractPack(name) {
  const lower = name.toLowerCase();
  // Look for common pack patterns
  const patterns = [
    /(\d+)\s*\/\s*cas?e/i,
    /(\d+)\s*\/\s*carton/i,
    /(\d+)\s*\/\s*pack/i,
    /(\d+)\s*\/\s*box/i,
    /(\d+)\s*\/\s*ct/i,
    /(\d+)\s*rolls?\s*\/\s*cas?e/i,
    /(\d+)\s*rolls?\s*\/\s*carton/i,
    /case\s+of\s+(\d+)/i,
    /(\d+)\s*per\s*case/i,
    /(\d+)\s*count/i,
  ];

  // Try to find pack info from the name directly
  const packPatterns = [
    /(\d+[\s,]*\d*\s*\/\s*(?:case|carton|pack|box|ct))/i,
    /(\d+\s*rolls?\s*\/\s*(?:case|carton))/i,
    /(\d+\s*(?:rolls?|sheets?|ct|count|pk|pack)\s*\/\s*(?:case|carton))/i,
    /(\d+)\s*(?:ct|count)\b/i,
    /\beach\b/i,
    /\bgallon\b/i,
    /\bgal\b/i,
  ];

  for (const pat of packPatterns) {
    const m = name.match(pat);
    if (m) {
      let result = m[1] || m[0];
      result = result.replace(/^\s*,\s*/, '').trim();
      // Capitalize
      if (/each/i.test(result)) return 'Each';
      if (/gal/i.test(result)) return 'Gallon';
      return result;
    }
  }

  if (lower.includes('gallon') || lower.includes(', gal') || lower.includes(' gal ') || lower.endsWith(' gal')) return 'Gallon';
  if (lower.includes('each') || lower.endsWith('ea)') || lower.includes('/ea')) return 'Each';
  if (lower.includes('1 gal bottle') || lower.includes('1 gal ')) return 'Gallon';

  return 'Each';
}

function makeCardTitle(name) {
  // Remove brand prefixes, SKUs in parens, and shorten
  let title = name
    .replace(/\([\w-]+\)\s*$/, '')  // remove trailing SKU in parens
    .replace(/^(JANITORS FINEST|GENUINE JOE|SUNNYCARE|ALPINE INDUSTRIES|CHEMCOR|CHASE PRODUCTS|PLATINUM KNIGHT|SOFT TOUCH|WONDER WAFERS|FOAM-EEZE|STRIKE BAC|PUROX)[®™,\s]*/i, '')
    .replace(/^(IPC Eagle|Simple Green|Sandia|Mercury|Ettore|Rubbermaid|Durable Packaging|Procell|Stone Pro|Formula 409|Clorox|Wave|Gold|Clean-Up)[®™,\s]*/i, '')
    .replace(/\(IMPACT\)\s*/i, '')
    .trim();

  // Only take the FIRST comma segment — the core product name
  const parts = title.split(',').map(p => p.trim());
  title = parts[0];

  // Remove sizes, dimensions, counts from the title
  title = title
    .replace(/\d+\s*fl\s*oz/i, '')
    .replace(/\d+\s*oz/i, '')
    .replace(/\d+\s*ml/i, '')
    .replace(/\d+\s*gal(lon)?/i, '')
    .replace(/\d+\s*[""x×]\s*\d+/g, '')
    .replace(/\d+\/\w+/g, '')  // 12/Case etc
    .replace(/\d+\s*(rolls?|sheets?|packs?|count|ct|pk|bx|cs)\b/gi, '')
    .replace(/\s+-\s*$/, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Cap at 40 chars
  if (title.length > 40) title = title.slice(0, 37) + '...';
  return title;
}

function generateDescription(name, brand, category) {
  const cleanName = name.replace(/\([\w-]+\)\s*$/, '').trim();
  return `${brand !== 'MJS' ? brand + ' ' : ''}${cleanName}. Professional-grade ${category.toLowerCase()} product for commercial and industrial use. Trusted by janitorial professionals for quality and value.`;
}

function generateHighlights(name, category, pack) {
  const highlights = [];
  const lower = name.toLowerCase();

  // Size/dimension info
  const sizeMatch = name.match(/(\d+(?:\.\d+)?)\s*(?:x\s*\d+(?:\.\d+)?)/i);
  if (sizeMatch) highlights.push(`Size: ${sizeMatch[0].trim()}`);

  const ozMatch = name.match(/(\d+(?:\.\d+)?)\s*(?:fl\s*)?oz\b/i);
  if (ozMatch) highlights.push(`${ozMatch[0].trim()} capacity`);

  const galMatch = name.match(/(\d+(?:\.\d+)?)\s*gal(?:lon)?\b/i);
  if (galMatch) highlights.push(`${galMatch[0].trim()} size`);

  // Pack info
  if (pack !== 'Each') highlights.push(`Pack: ${pack}`);

  // Category-specific
  if (lower.includes('white')) highlights.push('White color');
  if (lower.includes('black')) highlights.push('Black color');
  if (lower.includes('concentrated')) highlights.push('Concentrated formula');
  if (lower.includes('heavy duty') || lower.includes('heavy-duty')) highlights.push('Heavy-duty construction');
  if (lower.includes('epa')) highlights.push('EPA registered');
  if (lower.includes('compostable')) highlights.push('Compostable / BPI Certified');
  if (lower.includes('2-ply') || lower.includes('2 ply')) highlights.push('2-ply for extra softness');
  if (lower.includes('1-ply') || lower.includes('1 ply')) highlights.push('1-ply economical option');

  highlights.push(`Category: ${category}`);
  highlights.push('Professional-grade quality');

  return highlights.slice(0, 4);
}

function generateSpecs(sku, brand, name) {
  const specs = { SKU: sku, Brand: brand };

  const colorMatch = name.match(/\b(White|Black|Blue|Green|Red|Gray|Grey|Chrome|Stainless|Silver|Smoke|Yellow|Clear|Pink)\b/i);
  if (colorMatch) specs['Color'] = colorMatch[1];

  const sizeMatch = name.match(/(\d+(?:\.\d+)?"\s*(?:x\s*\d+(?:\.\d+)?")?)/);
  if (sizeMatch) specs['Size'] = sizeMatch[1];

  const ozMatch = name.match(/(\d+(?:\.\d+)?)\s*(?:fl\s*)?oz\b/i);
  if (ozMatch) specs['Volume'] = ozMatch[0].trim();

  const galMatch = name.match(/(\d+(?:\.\d+)?)\s*gal(?:lon)?\b/i);
  if (galMatch) specs['Volume'] = galMatch[0].trim();

  const milMatch = name.match(/(\d+(?:\.\d+)?)\s*mil\b/i);
  if (milMatch) specs['Thickness'] = milMatch[0].trim();

  const plyMatch = name.match(/(\d)-?\s*ply/i);
  if (plyMatch) specs['Ply'] = plyMatch[1];

  return specs;
}

// ── Main ────────────────────────────────────────────────────────────────────

const csvPath = '/Users/jarvis/Downloads/active_products.csv';
const outputPath = '/Users/jarvis/Projects/mjs-website/src/data/imported-products.ts';
const aiCategoriesPath = path.join(__dirname, '../src/data/ai-categories.json');

// Load AI categories if available
let aiCategories = {};
try {
  aiCategories = JSON.parse(fs.readFileSync(aiCategoriesPath, 'utf-8'));
  console.log(`Loaded AI categories for ${Object.keys(aiCategories).length} products`);
} catch (e) {
  console.log('No AI categories found, using keyword-based categorization');
}

const raw = fs.readFileSync(csvPath, 'utf-8');
const rows = parseCSV(raw);

// Skip header
const header = rows[0];
console.log('Header:', header);
console.log(`Total data rows: ${rows.length - 1}`);

const products = [];
const categoryCount = {};

for (let i = 1; i < rows.length; i++) {
  const row = rows[i];
  if (row.length < 5) {
    console.warn(`Skipping row ${i}: insufficient columns`, row);
    continue;
  }

  const [idStr, sku, name, priceStr, stockStr] = row;
  const price = parseFloat(priceStr) || 0;
  const stockQty = parseInt(stockStr) || 0;

  if (!name || !sku) {
    console.warn(`Skipping row ${i}: missing name or sku`);
    continue;
  }

  // Skip products with no price
  if (price <= 0) {
    continue;
  }

  // Use AI categories if available, fallback to keyword-based
  const aiCat = aiCategories[sku];
  const { category, subcategory } = aiCat || categorize(name);
  categoryCount[category] = (categoryCount[category] || 0) + 1;

  const brand = extractBrand(name);
  const pack = extractPack(name);
  const slug = slugify(name, sku);

  products.push({
    slug,
    sku,
    name,
    brand,
    price,
    rating: 4.5,
    reviewCount: 0,
    images: '["/images/placeholder-product.svg"]',
    inStock: stockQty > 0,
    stockQty,
    description: generateDescription(name, brand, category),
    highlights: generateHighlights(name, category, pack),
    specs: generateSpecs(sku, brand, name),
    category,
    subcategory,
    cardTitle: makeCardTitle(name),
    pack,
    imageFit: 'contain',
    quickBuy: '[]',
  });
}

console.log('\nCategory distribution:');
for (const [cat, count] of Object.entries(categoryCount).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${cat}: ${count}`);
}
console.log(`\nTotal products: ${products.length}`);

// ── Generate TypeScript output ──────────────────────────────────────────────

function escapeStr(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
}

let ts = `import type { ProductData } from './products';

// Auto-generated from active_products.csv on ${new Date().toISOString().split('T')[0]}
// ${products.length} products imported

export const importedProducts: ProductData[] = [\n`;

for (const p of products) {
  ts += `  {\n`;
  ts += `    slug: '${escapeStr(p.slug)}',\n`;
  ts += `    sku: '${escapeStr(p.sku)}',\n`;
  ts += `    name: '${escapeStr(p.name)}',\n`;
  ts += `    brand: '${escapeStr(p.brand)}',\n`;
  ts += `    price: ${p.price},\n`;
  ts += `    rating: ${p.rating},\n`;
  ts += `    reviewCount: ${p.reviewCount},\n`;
  ts += `    images: ${p.images},\n`;
  ts += `    inStock: ${p.inStock},\n`;
  ts += `    stockQty: ${p.stockQty},\n`;
  ts += `    description: '${escapeStr(p.description)}',\n`;
  ts += `    highlights: [${p.highlights.map(h => `'${escapeStr(h)}'`).join(', ')}],\n`;
  ts += `    specs: { ${Object.entries(p.specs).map(([k, v]) => `'${escapeStr(k)}': '${escapeStr(String(v))}'`).join(', ')} },\n`;
  ts += `    category: '${escapeStr(p.category)}',\n`;
  ts += `    subcategory: '${escapeStr(p.subcategory)}',\n`;
  ts += `    cardTitle: '${escapeStr(p.cardTitle)}',\n`;
  ts += `    pack: '${escapeStr(p.pack)}',\n`;
  ts += `    imageFit: 'contain',\n`;
  ts += `    quickBuy: [],\n`;
  ts += `  },\n`;
}

ts += `];\n`;

fs.writeFileSync(outputPath, ts, 'utf-8');
console.log(`\nWrote ${outputPath}`);
