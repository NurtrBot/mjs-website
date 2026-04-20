import { NextRequest, NextResponse } from "next/server";

// Category-restricted coupons: code → which categories/subcategories it applies to
const COUPON_RESTRICTIONS: Record<string, { categories?: string[]; subcategories?: string[] }> = {
  "TRASH5": { categories: ["Trash Liners & Bags"], subcategories: ["Can Liners", "Clear Can Liners", "Black Can Liners", "Trash Liners"] },
};

interface CartItem {
  price: number;
  qty: number;
  name?: string;
  sku?: string;
  category?: string;
  subcategory?: string;
}

// Detect if an item is a trash liner by name/SKU patterns
function isTrashLiner(item: CartItem): boolean {
  const name = (item.name || "").toLowerCase();
  const sku = (item.sku || "").toUpperCase();
  // SKU patterns: CL, LD, BL prefixes are can liners
  if (/^(CL|LD|BL)\d/.test(sku)) return true;
  // Name patterns
  if (name.includes("can liner") || name.includes("trash liner") || name.includes("garbage bag")) return true;
  if (name.includes("liner") && (name.includes("gallon") || name.includes("mil") || name.includes("micron"))) return true;
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const { code: rawCode, subtotal, items } = await req.json() as {
      code: string;
      subtotal: number;
      items: CartItem[];
    };

    const code = (rawCode || "").trim().toUpperCase();

    if (!code) {
      return NextResponse.json({ valid: false, error: "No code provided" }, { status: 400 });
    }

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

    if (coupon.expires) {
      const expDate = new Date(coupon.expires);
      if (expDate < new Date()) {
        return NextResponse.json({ valid: false, error: "This code has expired" });
      }
    }

    if (coupon.min_purchase && Number(coupon.min_purchase) > subtotal) {
      return NextResponse.json({
        valid: false,
        error: `Minimum order of $${Number(coupon.min_purchase).toFixed(2)} required`,
      });
    }

    // Determine which items the coupon applies to
    const restriction = COUPON_RESTRICTIONS[code];
    let eligibleSubtotal = subtotal;

    if (restriction && items?.length > 0) {
      eligibleSubtotal = 0;
      for (const item of items) {
        const catMatch = restriction.categories?.some(c => item.category?.includes(c));
        const subMatch = restriction.subcategories?.some(s => item.subcategory === s);
        // Also detect by name/SKU patterns for items without category data
        const nameMatch = code === "TRASH5" && isTrashLiner(item);
        if (catMatch || subMatch || nameMatch) {
          eligibleSubtotal += item.price * item.qty;
        }
      }

      if (eligibleSubtotal === 0) {
        return NextResponse.json({
          valid: false,
          error: "This code only applies to Trash Liner products. Add liners to your cart to use it.",
        });
      }
    }

    // Calculate discount
    let discount = 0;
    const amount = Number(coupon.amount);

    switch (coupon.type) {
      case "per_item_discount":
      case "dollar_discount":
        discount = Math.min(amount, eligibleSubtotal);
        break;
      case "per_total_discount":
        discount = Math.min(amount, eligibleSubtotal);
        break;
      case "percentage_discount":
        if (amount > 0) {
          discount = Math.round(eligibleSubtotal * (amount / 100) * 100) / 100;
        }
        break;
      case "promotion":
        if (amount > 0) {
          discount = Math.round(eligibleSubtotal * (amount / 100) * 100) / 100;
        } else {
          const match = coupon.name.match(/(\d+)\s*(off|%)/i);
          if (match) {
            const pct = Number(match[1]);
            discount = Math.round(eligibleSubtotal * (pct / 100) * 100) / 100;
          }
        }
        break;
      case "shipping_discount":
        discount = 0;
        break;
      default:
        if (amount > 0) discount = Math.min(amount, eligibleSubtotal);
    }

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      name: coupon.name,
      type: coupon.type,
      discount: Math.round(discount * 100) / 100,
      eligibleSubtotal: Math.round(eligibleSubtotal * 100) / 100,
      appliesTo: restriction ? "select items" : "entire order",
    });
  } catch {
    return NextResponse.json({ valid: false, error: "Failed to validate code" }, { status: 500 });
  }
}

// Keep GET for backward compatibility
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code") || "";
  const subtotal = Number(req.nextUrl.searchParams.get("subtotal")) || 0;

  // Redirect to POST logic with empty items
  const fakeReq = new NextRequest(req.url, {
    method: "POST",
    body: JSON.stringify({ code, subtotal, items: [] }),
    headers: { "Content-Type": "application/json" },
  });
  return POST(fakeReq);
}
