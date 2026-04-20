import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = (req.nextUrl.searchParams.get("code") || "").trim().toUpperCase();
  const subtotal = Number(req.nextUrl.searchParams.get("subtotal")) || 0;

  if (!code) {
    return NextResponse.json({ valid: false, error: "No code provided" }, { status: 400 });
  }

  try {
    const storeHash = process.env.BIGCOMMERCE_STORE_HASH!;
    const token = process.env.BIGCOMMERCE_ACCESS_TOKEN!;

    // Look up coupon in BC
    const res = await fetch(
      `https://api.bigcommerce.com/stores/${storeHash}/v2/coupons?code=${encodeURIComponent(code)}`,
      { headers: { "X-Auth-Token": token, "Accept": "application/json" } }
    );

    if (!res.ok) {
      return NextResponse.json({ valid: false, error: "Invalid promo code" });
    }

    const coupons = await res.json();
    if (!Array.isArray(coupons) || coupons.length === 0) {
      return NextResponse.json({ valid: false, error: "Invalid promo code" });
    }

    const coupon = coupons[0];

    if (!coupon.enabled) {
      return NextResponse.json({ valid: false, error: "This code has expired" });
    }

    // Check expiry
    if (coupon.expires) {
      const expDate = new Date(coupon.expires);
      if (expDate < new Date()) {
        return NextResponse.json({ valid: false, error: "This code has expired" });
      }
    }

    // Check min purchase
    if (coupon.min_purchase && Number(coupon.min_purchase) > subtotal) {
      return NextResponse.json({
        valid: false,
        error: `Minimum order of $${Number(coupon.min_purchase).toFixed(2)} required`,
      });
    }

    // Calculate discount based on coupon type
    let discount = 0;
    const amount = Number(coupon.amount);

    switch (coupon.type) {
      case "per_item_discount":
      case "dollar_discount":
        // Fixed dollar amount off
        discount = amount;
        break;
      case "per_total_discount":
        // Fixed dollar off total
        discount = amount;
        break;
      case "percentage_discount":
      case "promotion":
        // Percentage off — use the percentage from the coupon name or amount
        // BC "promotion" type with 0 amount often means it's linked to a promotion rule
        if (amount > 0) {
          discount = Math.round(subtotal * (amount / 100) * 100) / 100;
        } else {
          // Try to extract percentage from coupon name (e.g. "5 Off Trash Liners")
          const match = coupon.name.match(/(\d+)\s*(off|%)/i);
          if (match) {
            const pct = Number(match[1]);
            discount = Math.round(subtotal * (pct / 100) * 100) / 100;
          }
        }
        break;
      case "shipping_discount":
        // Free shipping — handled separately
        discount = 0;
        break;
      default:
        if (amount > 0) {
          discount = amount;
        }
    }

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      name: coupon.name,
      type: coupon.type,
      discount: Math.round(discount * 100) / 100,
    });
  } catch {
    return NextResponse.json({ valid: false, error: "Failed to validate code" }, { status: 500 });
  }
}
