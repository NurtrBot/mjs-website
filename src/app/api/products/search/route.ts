import { NextRequest, NextResponse } from "next/server";
import { searchProducts } from "@/lib/products-api";

export async function GET(req: NextRequest) {
  const keyword = req.nextUrl.searchParams.get("q") || "";
  const limit = Number(req.nextUrl.searchParams.get("limit")) || 20;

  if (!keyword || keyword.length < 2) {
    return NextResponse.json({ products: [] });
  }

  try {
    const products = await searchProducts(keyword, limit);
    return NextResponse.json({ products });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
