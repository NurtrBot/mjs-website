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
    const { items, customerId, paymentMethod, fulfillment, shippingAddress, billingAddress, notes, card } = body;

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

      // Try by SKU first
      if (!productId && item.sku) {
        productId = await getProductIdBySku(item.sku) ?? undefined;
      }

      // Fallback: search by keyword from the slug
      if (!productId && item.sku) {
        try {
          const keyword = item.sku.replace(/-/g, " ").split(" ").filter((w: string) => w.length > 2).slice(0, 4).join(" ");
          const res = await getProducts({ keyword, limit: 5, is_visible: true });
          // Try exact slug match first
          const slugMatch = res.data.find((p: { custom_url?: { url: string } }) =>
            p.custom_url?.url?.replace(/^\/|\/$/g, "").replace(/--+/g, "-") === item.sku.replace(/--+/g, "-")
          );
          if (slugMatch) {
            productId = slugMatch.id;
          } else if (res.data.length > 0) {
            productId = res.data[0].id;
          }
        } catch {}
      }

      if (!productId) {
        return NextResponse.json({ error: `Product not found: ${item.sku}. Please remove it from your cart and try again.` }, { status: 400 });
      }
      lineItems.push({ product_id: productId, quantity: item.quantity });
    }

    // 2. Create cart
    const cart = await createCart(lineItems, customerId);
    const cartId = cart.id;

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
      // Find pickup option
      selectedOption = shippingOptions.find((o: { type: string }) => o.type === "pickupinstore" || o.type === "pickup");
      if (!selectedOption) selectedOption = shippingOptions.find((o: { description: string }) => o.description.toLowerCase().includes("pick up"));
    } else {
      // Find cheapest delivery option (usually UPS Ground)
      const deliveryOptions = shippingOptions.filter((o: { type: string }) => o.type !== "pickupinstore" && o.type !== "pickup");
      selectedOption = deliveryOptions.sort((a: { cost: number }, b: { cost: number }) => a.cost - b.cost)[0];
    }

    if (!selectedOption) {
      // Fallback: pick the first available option
      selectedOption = shippingOptions[0];
    }

    if (!selectedOption) {
      return NextResponse.json({ error: "No shipping options available for this address" }, { status: 400 });
    }

    await selectShippingOption(cartId, String(consignment.id), selectedOption.id);

    // 6. Set billing address — always ensure all required fields
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

    // 7. Create order
    const order = await createOrderFromCheckout(cartId);
    const orderId = order.id;

    // 8. Handle payment based on method
    if (paymentMethod === "bill" || paymentMethod === "cash") {
      // Bill-to-account or cash: set status to "Awaiting Payment" (7)
      await updateOrderStatus(orderId, 7);
    } else if (paymentMethod === "card" && card) {
      // Credit card: process through BC Payments API → Intuit/QuickBooks
      const paymentToken = await getPaymentAccessToken(orderId);

      // Parse expiry "MM / YY" or "MM/YY"
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
      });

      if (paymentResult.status !== "success") {
        return NextResponse.json({ error: "Payment was declined. Please check your card details and try again." }, { status: 400 });
      }
    }

    // 9. Add order notes if provided
    if (notes) {
      try {
        await fetch(`https://api.bigcommerce.com/stores/${process.env.BIGCOMMERCE_STORE_HASH}/v2/orders/${orderId}`, {
          method: "PUT",
          headers: {
            "X-Auth-Token": process.env.BIGCOMMERCE_ACCESS_TOKEN!,
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            staff_notes: `[New Website] Payment: ${paymentMethod}. Fulfillment: ${fulfillment}. ${notes}`,
          }),
        });
      } catch {
        // Non-critical, don't fail the order
      }
    }

    return NextResponse.json({
      success: true,
      orderId,
      orderNumber: `MJS-${orderId}`,
      shippingMethod: selectedOption.description,
      shippingCost: selectedOption.cost,
      paymentMethod,
      fulfillment,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Order creation error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
