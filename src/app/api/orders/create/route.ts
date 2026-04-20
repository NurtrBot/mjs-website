import { NextRequest, NextResponse } from "next/server";
import {
  createCart,
  addConsignment,
  selectShippingOption,
  setBillingAddress,
  createOrderFromCheckout,
  updateOrderStatus,
  getProductIdBySku,
  getProducts,
  getPaymentAccessToken,
  processCardPayment,
  getAcceptedPaymentMethods,
  createV2Order,
  getProductVariants,
  applyCouponToCheckout,
  updateOrder,
  type ShippingAddress,
} from "@/lib/bigcommerce";

/*
  Full order pipeline:
  1. Resolve SKUs → product IDs
  2. Create BC cart
  3. Add shipping consignment (get shipping options)
  4. Select shipping option (cheapest, or pickup)
  5. Set billing address
  6. Create order from checkout
  7. Update order status for bill-to-account / cash
*/

interface OrderItem {
  sku: string;
  productId?: number;
  quantity: number;
}

interface OrderRequest {
  items: OrderItem[];
  customerId?: number;
  paymentMethod: "bill" | "card" | "cash";
  fulfillment: "delivery" | "pickup";
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    company?: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zip: string;
    phone?: string;
  };
  billingAddress?: {
    firstName: string;
    lastName: string;
    email: string;
    company?: string;
    address1: string;
    city: string;
    state: string;
    zip: string;
    phone?: string;
  };
  notes?: string;
  couponCode?: string;
  card?: {
    cardName: string;
    cardNumber: string;
    expiry: string;
    cvv: string;
  };
}

export async function POST(req: NextRequest) {
  try {
    const body: OrderRequest = await req.json();
    const { items, customerId, paymentMethod, fulfillment, shippingAddress, billingAddress, notes, couponCode, card } = body;

    if (!items?.length) {
      return NextResponse.json({ error: "No items in order" }, { status: 400 });
    }
    if (!shippingAddress?.address1) {
      return NextResponse.json({ error: "Shipping address is required" }, { status: 400 });
    }

    // 1. Resolve SKUs/slugs to product IDs
    const lineItems: { product_id: number; quantity: number }[] = [];
    for (const item of items) {
      let productId = item.productId;
      const sku = item.sku || "";

      // Try by SKU first (works for clean SKUs like "5200")
      if (!productId && sku) {
        productId = await getProductIdBySku(sku) ?? undefined;
      }

      // If SKU looks like a slug, try extracting potential SKU segments from it
      if (!productId && sku.includes("-")) {
        const segments = sku.split("-");
        // Try each segment as a potential SKU (e.g. "5200" from "janitors-finest-5200-...")
        for (const seg of segments) {
          if (seg.length >= 3 && seg.length <= 15) {
            const found = await getProductIdBySku(seg) ?? undefined;
            if (found) { productId = found; break; }
          }
        }
        // Also try last segment (common pattern: slug ends with SKU)
        if (!productId) {
          const lastSeg = segments[segments.length - 1].toUpperCase();
          if (lastSeg.length >= 3) {
            productId = await getProductIdBySku(lastSeg) ?? undefined;
          }
        }
      }

      // Fallback: search by keywords from the slug
      if (!productId && sku) {
        try {
          const words = sku.replace(/-/g, " ").split(" ").filter((w: string) => w.length > 2);
          // Try progressively shorter keyword searches
          const attempts = [
            words.slice(0, 4).join(" "),
            words.slice(0, 3).join(" "),
            words.slice(0, 2).join(" "),
          ].filter(Boolean);

          for (const keyword of attempts) {
            const res = await getProducts({ keyword, limit: 10, is_visible: true });
            if (res.data.length === 0) continue;

            // Try slug match
            const normalizedSku = sku.replace(/\//g, "-").replace(/-{2,}/g, "-").replace(/^-|-$/g, "");
            const slugMatch = res.data.find((p: { custom_url?: { url: string } }) => {
              const pSlug = (p.custom_url?.url || "").replace(/^\/|\/$/g, "").replace(/\//g, "-").replace(/-{2,}/g, "-");
              return pSlug === normalizedSku || pSlug.includes(normalizedSku) || normalizedSku.includes(pSlug);
            });
            if (slugMatch) { productId = slugMatch.id; break; }

            // Use first result as fallback
            if (res.data[0]?.id) { productId = res.data[0].id; break; }
          }
        } catch {}
      }

      if (!productId) {
        return NextResponse.json({ error: `Product not found: ${sku}. Please remove it from your cart and try again.` }, { status: 400 });
      }
      lineItems.push({ product_id: productId, quantity: item.quantity });
    }

    // ── ALL ORDERS: Use checkout pipeline (triggers BC email notifications) ──
    // 2. Create cart
    const cart = await createCart(lineItems, customerId);
    const cartId = cart.id;

    // 2b. Apply coupon code if provided
    if (couponCode) {
      await applyCouponToCheckout(cartId, couponCode);
    }

    // 3. Build shipping address
    const shipAddr: ShippingAddress = {
      first_name: shippingAddress.firstName,
      last_name: shippingAddress.lastName,
      email: shippingAddress.email,
      company: shippingAddress.company || "",
      address1: shippingAddress.address1,
      address2: shippingAddress.address2 || "",
      city: shippingAddress.city,
      state_or_province: shippingAddress.state,
      state_or_province_code: shippingAddress.state,
      postal_code: shippingAddress.zip,
      country_code: "US",
      phone: shippingAddress.phone || "",
    };

    // 4. Add consignment to get shipping options
    const physicalItems = cart.line_items.physical_items.map((i: { id: string; quantity: number }) => ({
      item_id: i.id,
      quantity: i.quantity,
    }));

    const checkoutWithConsignment = await addConsignment(cartId, shipAddr, physicalItems);
    const consignment = checkoutWithConsignment.consignments?.[0];
    if (!consignment) {
      return NextResponse.json({ error: "Failed to create shipping consignment" }, { status: 500 });
    }

    // 5. Select shipping option
    const shippingOptions = consignment.available_shipping_options || [];
    let selectedOption;

    if (fulfillment === "pickup") {
      selectedOption = shippingOptions.find((o: { type: string }) => o.type === "pickupinstore" || o.type === "pickup");
      if (!selectedOption) selectedOption = shippingOptions.find((o: { description: string }) => o.description.toLowerCase().includes("pick up"));
    } else {
      const deliveryOptions = shippingOptions.filter((o: { type: string }) => o.type !== "pickupinstore" && o.type !== "pickup");
      selectedOption = deliveryOptions.sort((a: { cost: number }, b: { cost: number }) => a.cost - b.cost)[0];
    }

    if (!selectedOption) selectedOption = shippingOptions[0];

    if (!selectedOption) {
      return NextResponse.json({ error: "No shipping options available for this address" }, { status: 400 });
    }

    await selectShippingOption(cartId, String(consignment.id), selectedOption.id);

    // 6. Set billing address
    const billAddr = billingAddress && billingAddress.address1 ? billingAddress : shippingAddress;
    const billingEmail = billAddr.email || shippingAddress.email || "order@mobilejanitorialsupply.com";
    await setBillingAddress(cartId, {
      first_name: billAddr.firstName || shippingAddress.firstName || "Customer",
      last_name: billAddr.lastName || shippingAddress.lastName || "Order",
      email: billingEmail,
      company: billAddr.company || shippingAddress.company || "",
      address1: billAddr.address1 || shippingAddress.address1,
      address2: (billAddr as Record<string, unknown>).address2 as string || (shippingAddress as Record<string, unknown>).address2 as string || "",
      city: billAddr.city || shippingAddress.city,
      state_or_province: billAddr.state || shippingAddress.state,
      state_or_province_code: billAddr.state || shippingAddress.state,
      postal_code: billAddr.zip || shippingAddress.zip,
      country_code: "US",
      phone: billAddr.phone || shippingAddress.phone || "",
    });

    // 7. Create order from checkout
    const order = await createOrderFromCheckout(cartId);
    const orderId = order.id;

    // 8. Handle payment based on method
    if (paymentMethod === "card" && card) {
      // Credit card: process through BC Payments API
      const paymentToken = await getPaymentAccessToken(orderId);

      const methods = await getAcceptedPaymentMethods(orderId);
      const cardMethod = methods.find((m: { id: string }) => m.id.includes("card") || m.id.includes("qbms"));
      const paymentMethodId = cardMethod?.id || "qbmsv2.card";

      const expiryParts = card.expiry.replace(/\s/g, "").split("/");
      const expiryMonth = parseInt(expiryParts[0]) || 1;
      let expiryYear = parseInt(expiryParts[1]) || 2026;
      if (expiryYear < 100) expiryYear += 2000;

      const paymentResult = await processCardPayment(paymentToken, {
        cardholderName: card.cardName,
        number: card.cardNumber,
        expiryMonth,
        expiryYear,
        verificationValue: card.cvv,
      }, paymentMethodId);

      if (paymentResult.status !== "success") {
        return NextResponse.json({ error: "Payment was declined. Please check your card details and try again." }, { status: 400 });
      }
    } else {
      // Bill-to-account or cash: set status to Awaiting Payment (7) — no payment processed
      await updateOrderStatus(orderId, 7);
    }

    // 9. Add order notes
    try {
      await updateOrder(orderId, {
        staff_notes: `[New Website] Payment: ${paymentMethod}. Fulfillment: ${fulfillment}.${notes ? ` ${notes}` : ""}`,
        customer_message: notes || "",
      });
    } catch {
      // Non-critical, don't fail the order
    }

    // 10. Fetch actual order totals from BC
    let bcTotals = { subtotal: 0, tax: 0, shipping: 0, discount: 0, total: 0 };
    try {
      const storeHash = process.env.BIGCOMMERCE_STORE_HASH!;
      const token = process.env.BIGCOMMERCE_ACCESS_TOKEN!;
      const orderRes = await fetch(
        `https://api.bigcommerce.com/stores/${storeHash}/v2/orders/${orderId}`,
        { headers: { "X-Auth-Token": token, "Accept": "application/json" } }
      );
      if (orderRes.ok) {
        const od = await orderRes.json();
        bcTotals = {
          subtotal: Number(od.subtotal_inc_tax) || 0,
          tax: Number(od.total_tax) || 0,
          shipping: Number(od.shipping_cost_inc_tax) || 0,
          discount: Number(od.discount_amount) || 0,
          total: Number(od.total_inc_tax) || 0,
        };
      }
    } catch {}

    return NextResponse.json({
      success: true,
      orderId,
      orderNumber: `MJS-${orderId}`,
      shippingMethod: selectedOption.description,
      shippingCost: bcTotals.shipping || selectedOption.cost,
      paymentMethod,
      fulfillment,
      bcTotals,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Order creation error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
