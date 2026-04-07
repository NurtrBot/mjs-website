import { NextResponse } from "next/server";
import { getProducts } from "@/lib/bigcommerce";
import { transformProduct } from "@/lib/products-api";

export async function GET() {
  try {
    // Fetch top sellers directly from BigCommerce sorted by total_sold
    const res = await getProducts({
      sort: "total_sold",
      direction: "desc",
      limit: 30,
      is_visible: true,
    });

    const products = res.data
      .filter((p) => p.price > 0 && p.images && p.images.length > 0)
      .map(transformProduct);

    return NextResponse.json({ products });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
