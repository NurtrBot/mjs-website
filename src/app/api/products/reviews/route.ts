import { NextRequest, NextResponse } from "next/server";
import { getProducts, getProductReviews } from "@/lib/bigcommerce";

export async function GET(req: NextRequest) {
  const sku = req.nextUrl.searchParams.get("sku") || "";

  if (!sku) {
    return NextResponse.json({ error: "Missing sku" }, { status: 400 });
  }

  try {
    // Find the BC product ID by SKU
    const res = await getProducts({ keyword: sku, limit: 5, is_visible: true });
    const product = res.data.find((p) => p.sku.toUpperCase() === sku.toUpperCase());

    if (!product) {
      return NextResponse.json({ reviews: [], rating: 0, count: 0 });
    }

    const reviews = await getProductReviews(product.id);

    const avgRating = reviews.length > 0
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
      : 0;

    return NextResponse.json({
      reviews: reviews.map((r) => ({
        id: r.id,
        title: r.title,
        text: r.text,
        rating: r.rating,
        name: r.name,
        date: r.date_reviewed || r.date_created,
      })),
      rating: avgRating,
      count: reviews.length,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
