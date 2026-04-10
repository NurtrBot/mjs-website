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

    return NextResponse.json({
      success: true,
      customer: {
        id: customer.id,
        firstName: customer.first_name,
        lastName: customer.last_name,
        email: customer.email,
        company: customer.company || "",
        phone: customer.phone || "",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Customer creation error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
