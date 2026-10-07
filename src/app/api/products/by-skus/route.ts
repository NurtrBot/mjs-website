import { NextRequest, NextResponse } from "next/server";
import { fetchProductsBySkus } from "@/lib/products-api";

// GET /api/products/by-skus?skus=5602,CL404814 — exact SKU lookups (used by /cart/add deep links)
export async function GET(req: NextRequest) {
  const skus = (req.nextUrl.searchParams.get("skus") || "").split(",").map(s => s.trim()).filter(Boolean).slice(0, 40);
  if (skus.length === 0) return NextResponse.json({ products: [] });
  try {
    const products = await fetchProductsBySkus(skus);
    return NextResponse.json({ products });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message, products: [] }, { status: 500 });
  }
}
