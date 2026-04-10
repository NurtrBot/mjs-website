import { NextRequest, NextResponse } from "next/server";
import {
  createCart,
  addConsignment,
  deleteCart,
  getProductIdBySku,
  getProducts,
} from "@/lib/bigcommerce";

/*
  Shipping rate estimator:
  1. Create a temporary BC cart with the items
  2. Add a consignment with the destination zip
  3. Get shipping options from ShipperHQ
  4. Delete the temporary cart
  5. Return the rates
*/

interface EstimateItem {
  sku?: string;
  slug?: string;
  productId?: number;
  quantity: number;
}

export async function POST(req: NextRequest) {
  let cartId: string | null = null;

  try {
    const body = await req.json();
    const { items, zip, state, city } = body as {
      items: EstimateItem[];
      zip: string;
      state?: string;
      city?: string;
    };

    if (!items?.length || !zip) {
      return NextResponse.json({ error: "Items and zip code are required" }, { status: 400 });
    }

    // 1. Resolve items to product IDs
    const lineItems: { product_id: number; quantity: number }[] = [];
    for (const item of items) {
      let productId = item.productId;
      if (!productId && item.sku) {
        productId = await getProductIdBySku(item.sku) ?? undefined;
      }
      if (!productId && (item.sku || item.slug)) {
        const keyword = (item.sku || item.slug || "").replace(/-/g, " ").split(" ").filter((w: string) => w.length > 2).slice(0, 4).join(" ");
        try {
          const res = await getProducts({ keyword, limit: 3, is_visible: true });
          if (res.data.length > 0) productId = res.data[0].id;
        } catch {}
      }
      if (productId) {
        lineItems.push({ product_id: productId, quantity: item.quantity });
      }
    }

    if (lineItems.length === 0) {
      return NextResponse.json({ error: "No valid products found" }, { status: 400 });
    }

    // 2. Create temporary cart
    const cart = await createCart(lineItems);
    cartId = cart.id;

    // 3. Add consignment with destination address
    const physicalItems = cart.line_items.physical_items.map((i: { id: string; quantity: number }) => ({
      item_id: i.id,
      quantity: i.quantity,
    }));

    const checkoutData = await addConsignment(cartId!, {
      first_name: "Shipping",
      last_name: "Estimate",
      email: "estimate@mjs.com",
      address1: "123 Main St",
      city: city || "Anytown",
      state_or_province: state || "CA",
      state_or_province_code: state || "CA",
      postal_code: zip,
      country_code: "US",
    }, physicalItems);

    const consignment = checkoutData.consignments?.[0];
    const options = consignment?.available_shipping_options || [];

    // 4. Format shipping options
    const rates = options.map((o: { id: string; description: string; cost: number; type: string; transit_time?: string }) => ({
      id: o.id,
      name: o.description,
      cost: o.cost,
      type: o.type,
      transitTime: o.transit_time || "",
    }));

    // 5. Cleanup
    try { await deleteCart(cartId!); } catch {}
    cartId = null;

    return NextResponse.json({ rates });
  } catch (error: unknown) {
    // Cleanup on error
    if (cartId) { try { await deleteCart(cartId); } catch {} }
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
