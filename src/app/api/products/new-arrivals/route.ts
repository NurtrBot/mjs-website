import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/products-api";

export async function GET() {
  try {
    const brandSearches = ["clorox", "simple green", "3M", "rubbermaid", "genuine joe", "ettore", "procell", "chase products", "sunnycare"];

    const results = await Promise.all(
      brandSearches.map(b => searchProducts(b, 15).catch(() => []))
    );

    const seen = new Set<string>();
    const products = [];
    for (const batch of results) {
      for (const p of batch) {
        if (!seen.has(p.sku) && p.images?.[0] && !p.images[0].includes("placeholder")) {
          seen.add(p.sku);
          products.push(p);
        }
      }
    }

    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ products: [] });
  }
}
