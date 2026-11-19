import { NextRequest, NextResponse } from "next/server";

const STORE_HASH = process.env.BIGCOMMERCE_STORE_HASH!;
const ACCESS_TOKEN = process.env.BIGCOMMERCE_ACCESS_TOKEN!;

export async function POST(req: NextRequest) {
  try {
    const { firstName, email } = await req.json();

    // First name is optional (the homepage signup is email-only; the modal still sends it)
    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    // Add to BigCommerce Subscribers list
    const res = await fetch(
      `https://api.bigcommerce.com/stores/${STORE_HASH}/v3/customers/subscribers`,
      {
        method: "POST",
        headers: {
          "X-Auth-Token": ACCESS_TOKEN,
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          ...(firstName ? { first_name: String(firstName).trim() } : {}),
          source: "website-newsletter",
          channel_id: 1,
        }),
      }
    );

    if (res.status === 409) {
      // Already subscribed — treat as success
      return NextResponse.json({ success: true, alreadySubscribed: true });
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("BigCommerce subscriber error:", res.status, errorData);
      return NextResponse.json(
        { error: "Unable to subscribe at this time. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter subscribe error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
