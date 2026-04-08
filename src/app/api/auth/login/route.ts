import { NextRequest, NextResponse } from "next/server";
import { getCustomerByEmail } from "@/lib/bigcommerce";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const customer = await getCustomerByEmail(email);
    if (!customer) {
      return NextResponse.json({ error: "No account found with that email" }, { status: 404 });
    }

    return NextResponse.json({
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
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
