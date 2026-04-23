import { NextRequest, NextResponse } from "next/server";
import { createCustomer, getCustomerByEmail } from "@/lib/bigcommerce";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, company, phone, password, address, city, state, zip } = body;

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: "First name, last name, email, and password are required" }, { status: 400 });
    }

    // Check if customer already exists
    const existing = await getCustomerByEmail(email);
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists. Please log in." }, { status: 409 });
    }

    // Create customer in BC
    const customer = await createCustomer({
      first_name: firstName,
      last_name: lastName,
      email,
      company: company || "",
      phone: phone || "",
      password,
      address: address ? {
        address1: address,
        city: city || "",
        state_or_province: state || "CA",
        postal_code: zip || "",
        country_code: "US",
      } : undefined,
    });

    // Claim any guest orders placed with this email
    let claimedOrders = 0;
    try {
      const storeHash = process.env.BIGCOMMERCE_STORE_HASH!;
      const token = process.env.BIGCOMMERCE_ACCESS_TOKEN!;
      const ordersRes = await fetch(
        `https://api.bigcommerce.com/stores/${storeHash}/v2/orders?email=${encodeURIComponent(email)}&customer_id=0&limit=50`,
        { headers: { "X-Auth-Token": token, "Accept": "application/json" } }
      );
      if (ordersRes.ok) {
        const guestOrders = await ordersRes.json();
        if (Array.isArray(guestOrders)) {
          const { updateOrder } = await import("@/lib/bigcommerce");
          for (const order of guestOrders) {
            try {
              await updateOrder(order.id, { customer_id: customer.id });
              claimedOrders++;
            } catch {}
          }
        }
      }
    } catch {}

    return NextResponse.json({
      success: true,
      claimedOrders,
      customer: {
        id: customer.id,
        firstName: customer.first_name,
        lastName: customer.last_name,
        email: customer.email,
        company: customer.company || "",
        phone: customer.phone || "",
        customerGroupId: 0,
        priceListId: null,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Customer creation error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
