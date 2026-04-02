const fs = require('fs');
const path = require('path');

const API_KEY = process.env.ANTHROPIC_API_KEY;
const CSV_PATH = '/Users/jarvis/Downloads/active_products.csv';
const OUTPUT_PATH = path.join(__dirname, '../src/data/ai-categories.json');

const CATEGORIES = {
  "Paper & Restroom": ["Roll Towels", "Multifolds", "Toilet Tissue", "Facial Tissue", "Napkins", "Seat Covers", "Paper Products"],
  "Cleaning Chemicals": ["Degreasers", "Disinfectants", "All-Purpose Cleaners", "Glass Cleaners", "Restroom Cleaners", "Air Fresheners", "Hand Soap & Sanitizer", "Bleach", "Wipes", "Floor Care Chemicals", "Carpet Care", "Kitchen Chemicals", "Laundry", "General Cleaners"],
  "Trash Liners": ["High Density Liners", "Low Density Liners", "Can Liners", "Compostable Liners"],
  "Gloves & Safety": ["Nitrile Gloves", "Latex Gloves", "Vinyl Gloves", "Safety Equipment", "Bouffant Caps", "Shoe Covers"],
  "Packaging & Shipping": ["Stretch Film", "Tape", "Boxes", "Bubble Wrap", "Packaging Supplies"],
  "Breakroom": ["Cups & Lids", "Plates & Bowls", "Cutlery", "Straws", "Food Containers", "Breakroom Supplies"],
  "Equipment & Tools": ["Dispensers", "Soap Dispensers", "Towel Dispensers", "Tissue Dispensers", "Mops & Handles", "Brooms & Dustpans", "Buckets & Wringers", "Vacuums", "Squeegees", "Spray Bottles", "Carts & Shelving", "Window Cleaning", "Safety Signs", "Air Movers", "Brushes & Pads", "Dusters", "General Equipment"],
  "Floor Care": ["Floor Pads", "Floor Brushes", "Floor Machines", "Floor Care"],
  "Car Detailing": ["Wash", "Glass", "Wax & Protection", "Accessories", "Air Fresheners"]
};

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

async function callClaude(products) {
  const categoryList = Object.entries(CATEGORIES)
    .map(([cat, subs]) => `${cat}: ${subs.join(', ')}`)
    .join('\n');

  const productList = products.map((p, i) => `${i + 1}. [${p.sku}] ${p.name}`).join('\n');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: `You are categorizing janitorial supply products for a wholesale distributor website. Categorize each product into EXACTLY one category and one subcategory.

CATEGORIES AND THEIR SUBCATEGORIES:
${categoryList}

STRICT RULES — follow these exactly:
1. "Paper & Restroom" = ONLY consumable paper products: paper towels (roll towels, multifold, c-fold, center-pull), toilet tissue, facial tissue, napkins, toilet seat covers. NEVER put dispensers here.
2. "Equipment & Tools" = ALL dispensers (soap dispensers, towel dispensers, tissue dispensers, seat cover dispensers), mops, brooms, buckets, vacuums, carts, squeegees, spray bottles, signs, machines, handles, brushes, dusters, air movers.
3. "Cleaning Chemicals" = Liquid/spray cleaners, degreasers, disinfectants, sanitizers, bleach, soaps (hand soap, dish soap), wipes, air fresheners/deodorizers, floor finish/sealer/stripper chemicals, carpet chemicals. If it's a LIQUID or CHEMICAL product, it goes here.
4. "Trash Liners" = ONLY trash bags, can liners, garbage bags.
5. "Gloves & Safety" = Gloves (nitrile, latex, vinyl), bouffant caps, shoe covers, masks, goggles, safety equipment.
6. "Breakroom" = Cups, lids, plates, bowls, cutlery (forks, spoons, knives), straws, food containers, aluminum trays/pans.
7. "Packaging & Shipping" = Stretch film/wrap, tape, boxes, bubble wrap.
8. "Floor Care" = Floor pads, floor brushes, bonnets, floor machines — the PHYSICAL tools, not chemicals.
9. "Car Detailing" = Auto/car wash products, car wax, auto air fresheners, wonder wafers, detailing supplies.

PRODUCTS:
${productList}

Respond ONLY with a JSON array. Format:
[{"sku":"SKU","category":"Category Name","subcategory":"Subcategory Name"},...]

No explanation. No markdown. ONLY the raw JSON array.`
      }],
    }),
  });

  const data = await response.json();
  if (data.error) throw new Error(JSON.stringify(data.error));
  const text = data.content[0].text.trim();
  // Extract JSON from response
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error('No JSON array found in response: ' + text.slice(0, 200));
  return JSON.parse(jsonMatch[0]);
}

async function main() {
  console.log('Reading CSV...');
  const csv = fs.readFileSync(CSV_PATH, 'utf-8');
  const rows = parseCSV(csv);
  const header = rows[0];
  const dataRows = rows.slice(1).filter(r => r.length >= 5 && r[0].trim());

  // Better extraction: find price and stock from the END of each row (last two numeric fields)
  const products = [];
  for (const r of dataRows) {
    let sku, name, price;
    if (r.length === 5) {
      sku = r[1].trim();
      name = r[2].trim();
      price = parseFloat(r[3]) || 0;
    } else if (r.length > 5) {
      // Commas in unquoted name caused extra fields — price+stock are always last 2
      sku = r[1].trim();
      name = r.slice(2, r.length - 2).join(',').trim();
      price = parseFloat(r[r.length - 2]) || 0;
    } else {
      continue;
    }
    if (price > 0 && sku && name) {
      products.push({ sku, name });
    }
  }

  console.log(`Total products: ${products.length}`);

  const BATCH_SIZE = 50;
  const results = {};
  const batches = Math.ceil(products.length / BATCH_SIZE);

  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const batch = products.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    console.log(`Processing batch ${batchNum}/${batches} (${batch.length} products)...`);

    try {
      const categorized = await callClaude(batch);
      for (const item of categorized) {
        results[item.sku] = { category: item.category, subcategory: item.subcategory };
      }
      console.log(`  ✓ Got ${categorized.length} results`);
    } catch (err) {
      console.error(`  ✗ Batch ${batchNum} failed: ${err.message}`);
      // Retry once
      try {
        console.log(`  Retrying batch ${batchNum}...`);
        const categorized = await callClaude(batch);
        for (const item of categorized) {
          results[item.sku] = { category: item.category, subcategory: item.subcategory };
        }
        console.log(`  ✓ Retry got ${categorized.length} results`);
      } catch (err2) {
        console.error(`  ✗ Retry failed: ${err2.message}`);
      }
    }

    // Rate limit pause
    if (i + BATCH_SIZE < products.length) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  console.log(`\nCategorized ${Object.keys(results).length}/${products.length} products`);

  // Save results
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(results, null, 2));
  console.log(`Saved to ${OUTPUT_PATH}`);

  // Show distribution
  const dist = {};
  for (const v of Object.values(results)) {
    dist[v.category] = (dist[v.category] || 0) + 1;
  }
  console.log('\nCategory distribution:');
  for (const [cat, count] of Object.entries(dist).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${cat}: ${count}`);
  }
}

main().catch(console.error);
