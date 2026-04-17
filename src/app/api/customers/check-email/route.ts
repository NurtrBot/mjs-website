import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email") || "";

  if (!email || !email.includes("@")) {
    return NextResponse.json({ guestOrders: 0 });
  }

  try {
    const storeHash = process.env.BIGCOMMERCE_STORE_HASH!;
    const token = process.env.BIGCOMMERCE_ACCESS_TOKEN!;

    // Search for orders by billing email with customer_id=0 (guest orders)
    const res = await fetch(
      `https://api.bigcommerce.com/stores/${storeHash}/v2/orders?email=${encodeURIComponent(email)}&customer_id=0&limit=50`,
      { headers: { "X-Auth-Token": token, "Accept": "application/json" } }
    );

    if (!res.ok) {
      return NextResponse.json({ guestOrders: 0 });
    }

    const orders = await res.json();
    const count = Array.isArray(orders) ? orders.length : 0;

    return NextResponse.json({ guestOrders: count });
  } catch {
    return NextResponse.json({ guestOrders: 0 });
  }
}
