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

    // ── BILL-TO-ACCOUNT / CASH: Create directly via V2 Orders API (bypasses EverEye) ──
    if (paymentMethod === "bill" || paymentMethod === "cash") {
      const billAddr = billingAddress && billingAddress.address1 ? billingAddress : shippingAddress;
      const v2Addr = {
        first_name: shippingAddress.firstName,
        last_name: shippingAddress.lastName,
        email: shippingAddress.email || "order@mobilejanitorialsupply.com",
        company: shippingAddress.company || "",
        street_1: shippingAddress.address1,
        street_2: shippingAddress.address2 || "",
        city: shippingAddress.city,
        state: shippingAddress.state,
        zip: shippingAddress.zip,
        country: "United States",
        country_iso2: "US",
        phone: shippingAddress.phone || "",
      };
      const v2BillAddr = {
        first_name: billAddr.firstName || shippingAddress.firstName,
        last_name: billAddr.lastName || shippingAddress.lastName,
        email: billAddr.email || shippingAddress.email || "order@mobilejanitorialsupply.com",
        company: billAddr.company || shippingAddress.company || "",
        street_1: billAddr.address1 || shippingAddress.address1,
        street_2: (billAddr as Record<string, unknown>).address2 as string || shippingAddress.address2 || "",
        city: billAddr.city || shippingAddress.city,
        state: billAddr.state || shippingAddress.state,
        zip: billAddr.zip || shippingAddress.zip,
        country: "United States",
        country_iso2: "US",
        phone: billAddr.phone || shippingAddress.phone || "",
      };

      const staffNotes = `[New Website] Payment: ${paymentMethod}. Fulfillment: ${fulfillment}.${notes ? ` ${notes}` : ""}`;

      // Resolve product variants/options for V2 API (required for products with mandatory options)
      const v2Products = await Promise.all(
        lineItems.map(async (li) => {
          const variants = await getProductVariants(li.product_id);
          if (variants.length > 0) {
            const variant = variants[0]; // Use first/default variant
            return {
              product_id: li.product_id,
              quantity: li.quantity,
              product_options: variant.option_values.map((ov) => ({
                id: ov.option_id,
                value: String(ov.id),
              })),
            };
          }
          return { product_id: li.product_id, quantity: li.quantity };
        })
      );

      const order = await createV2Order({
        customer_id: customerId,
        billing_address: v2BillAddr,
        shipping_addresses: [v2Addr],
        products: v2Products,
        status_id: 1, // Pending — triggers BC order notification emails
        staff_notes: staffNotes,
        customer_message: notes || "",
      });

      const orderId = order.id;

      // Now update to Awaiting Payment (7) for bill-to-account tracking
      await updateOrderStatus(orderId, 7);

      return NextResponse.json({
        success: true,
        orderId,
        orderNumber: `MJS-${orderId}`,
        shippingMethod: fulfillment === "pickup" ? "In-Store Pickup" : "Delivery",
        shippingCost: 0,
        paymentMethod,
        fulfillment,
      });
    }

    // ── CREDIT CARD: Use full checkout pipeline (Cart → Consignment → Order → Payment) ──
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

    // 8. Process credit card payment
    if (card) {
      const paymentToken = await getPaymentAccessToken(orderId);

      // Get the correct payment method ID for this order
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
    }

    // 9. Add order notes
    try {
      await updateOrder(orderId, {
        staff_notes: `[New Website] Payment: card. Fulfillment: ${fulfillment}.${notes ? ` ${notes}` : ""}`,
        customer_message: notes || "",
      });
    } catch {
      // Non-critical, don't fail the order
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
