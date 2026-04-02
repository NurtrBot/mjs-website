import { NextRequest, NextResponse } from "next/server";
import { fetchProductsByCategory } from "@/lib/products-api";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug") || "";
  const page = Number(req.nextUrl.searchParams.get("page")) || 1;
  const limit = Number(req.nextUrl.searchParams.get("limit")) || 50;

  try {
    const result = await fetchProductsByCategory(slug, page, limit);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
