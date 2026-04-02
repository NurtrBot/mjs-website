import { NextRequest, NextResponse } from "next/server";
import { getProducts, type BCProduct } from "@/lib/bigcommerce";
import { transformProduct } from "@/lib/products-api";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug") || "";

  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  try {
    // Try to find by custom URL match
    const keyword = slug.replace(/-/g, " ").slice(0, 50);
    const res = await getProducts({ keyword, limit: 10, is_visible: true });

    // Find best match by comparing slugs
    let bestMatch: BCProduct | null = null;
    for (const p of res.data) {
      const pSlug = p.custom_url?.url?.replace(/^\/|\/$/g, "") || "";
      if (pSlug === slug) {
        bestMatch = p;
        break;
      }
    }

    // Fallback: use first result
    if (!bestMatch && res.data.length > 0) {
      bestMatch = res.data[0];
    }

    if (bestMatch && bestMatch.price > 0) {
      return NextResponse.json({ product: transformProduct(bestMatch) });
    }

    return NextResponse.json({ product: null }, { status: 404 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
