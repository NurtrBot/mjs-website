import { NextRequest, NextResponse } from "next/server";

const STORE_HASH = process.env.BIGCOMMERCE_STORE_HASH!;
const ACCESS_TOKEN = process.env.BIGCOMMERCE_ACCESS_TOKEN!;

export async function GET(req: NextRequest) {
  const customerId = Number(req.nextUrl.searchParams.get("customerId"));
  if (!customerId) {
    return NextResponse.json({ error: "Missing customerId" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.bigcommerce.com/stores/${STORE_HASH}/v3/customers/addresses?customer_id:in=${customerId}&limit=50`,
      {
        headers: {
          "X-Auth-Token": ACCESS_TOKEN,
          Accept: "application/json",
        },
      }
    );

    if (!res.ok) {
      return NextResponse.json({ addresses: [] });
    }

    const data = await res.json();
    const addresses = (data.data || []).map((a: Record<string, unknown>) => ({
      id: a.id,
      company: a.company || "",
      firstName: a.first_name,
      lastName: a.last_name,
      address1: a.address1,
      address2: a.address2 || "",
      city: a.city,
      state: a.state_or_province,
      zip: a.postal_code,
      country: a.country_code,
      phone: a.phone || "",
    }));

    return NextResponse.json({ addresses });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
