import { NextRequest, NextResponse } from "next/server";
import { searchProducts } from "@/lib/products-api";
import { explainSearch } from "@/lib/search";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const keyword = (req.nextUrl.searchParams.get("q") || "").trim().slice(0, 100);
  const limit = Number(req.nextUrl.searchParams.get("limit")) || 20;

  if (!keyword || keyword.length < 2) {
    return NextResponse.json({ products: [] });
  }

  try {
    // ?debug=1 shows the phrasings tried and the top scores (handy for tuning synonyms)
    if (req.nextUrl.searchParams.get("debug") === "1") {
      return NextResponse.json(await explainSearch(keyword, limit));
    }
    const products = await searchProducts(keyword, limit);
    return NextResponse.json({ products }, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
