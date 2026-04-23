import { NextRequest, NextResponse } from "next/server";

// Generates and sends a gift card via Tremendous API
export async function POST(req: NextRequest) {
  const apiKey = process.env.TREMENDOUS_API_KEY;
  const campaignId = process.env.TREMENDOUS_CAMPAIGN_ID;
  const fundingSourceId = process.env.TREMENDOUS_FUNDING_SOURCE_ID;
  const baseUrl = apiKey?.startsWith("TEST_")
    ? "https://testflight.tremendous.com"
    : "https://api.tremendous.com";

  if (!apiKey) {
    return NextResponse.json({ error: "Rewards not configured" }, { status: 500 });
  }

  try {
    const { recipientName, recipientEmail, productId, amount, orderId } = await req.json();

    if (!recipientEmail || !productId || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create the reward order via Tremendous API
    const body: Record<string, unknown> = {
      payment: {
        funding_source_id: fundingSourceId || "BALANCE",
      },
      rewards: [
        {
          value: {
            denomination: amount,
            currency_code: "USD",
          },
          delivery: {
            method: "EMAIL",
          },
          recipient: {
            name: recipientName || "Valued Customer",
            email: recipientEmail,
          },
          products: [productId],
          ...(campaignId ? { campaign_id: campaignId } : {}),
        },
      ],
    };

    const res = await fetch(`${baseUrl}/api/v2/orders`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("[TREMENDOUS] Error:", JSON.stringify(data));
      return NextResponse.json({
        error: data.errors?.[0]?.message || "Failed to generate gift card",
      }, { status: 400 });
    }

    // Extract reward details from response
    const reward = data.order?.rewards?.[0] || {};
    const redeemLink = reward.delivery?.link || "";

    return NextResponse.json({
      success: true,
      rewardId: reward.id || "",
      redeemLink,
      recipientEmail,
      amount,
      orderId,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[TREMENDOUS] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
