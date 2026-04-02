import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/bigcommerce";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 50;
  const category_id = searchParams.get("category_id") ? Number(searchParams.get("category_id")) : undefined;
  const keyword = searchParams.get("keyword") || undefined;

  try {
    const result = await getProducts({ page, limit, category_id, is_visible: true, keyword });
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
