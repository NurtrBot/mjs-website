import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const priceListId = Number(req.nextUrl.searchParams.get("priceListId"));
  const productId = Number(req.nextUrl.searchParams.get("productId"));

  if (!priceListId || !productId) {
    return NextResponse.json({ price: null });
  }

  try {
    const storeHash = process.env.BIGCOMMERCE_STORE_HASH!;
    const token = process.env.BIGCOMMERCE_ACCESS_TOKEN!;

    const res = await fetch(
      `https://api.bigcommerce.com/stores/${storeHash}/v3/pricelists/${priceListId}/records?product_id:in=${productId}`,
      { headers: { "X-Auth-Token": token, "Accept": "application/json" } }
    );

    if (!res.ok) return NextResponse.json({ price: null });

    const data = await res.json();
    const record = data.data?.[0];

    if (!record) return NextResponse.json({ price: null });

    return NextResponse.json({
      price: Number(record.price) || null,
      salePrice: record.sale_price ? Number(record.sale_price) : null,
      retailPrice: record.retail_price ? Number(record.retail_price) : null,
    });
  } catch {
    return NextResponse.json({ price: null });
  }
}
