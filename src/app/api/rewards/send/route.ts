import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

// Valid gift card amounts per tier (prevents tampering)
const VALID_AMOUNTS = new Set([10, 20, 25, 50, 75, 100, 125]);

// Generates and sends a gift card via Tremendous API
export async function POST(req: NextRequest) {
  // Rate limit: 1 reward per 5 minutes per IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "unknown";
  const { allowed } = rateLimit(ip, "reward", 1, 5 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

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

    // Validate amount is a legitimate tier value (prevents tampering)
    if (!VALID_AMOUNTS.has(amount)) {
      return NextResponse.json({ error: "Invalid reward amount" }, { status: 400 });
    }

    // Verify the order exists in BC and has sufficient total
    if (orderId && orderId !== 0) {
      try {
        const storeHash = process.env.BIGCOMMERCE_STORE_HASH!;
        const token = process.env.BIGCOMMERCE_ACCESS_TOKEN!;
        const orderRes = await fetch(
          `https://api.bigcommerce.com/stores/${storeHash}/v2/orders/${orderId}`,
          { headers: { "X-Auth-Token": token, "Accept": "application/json" } }
        );
        if (orderRes.ok) {
          const order = await orderRes.json();
          const orderSubtotal = Number(order.subtotal_ex_tax) || 0;
          // Minimum $500 order to qualify for any reward
          if (orderSubtotal < 500) {
            return NextResponse.json({ error: "Order does not qualify for a reward" }, { status: 400 });
          }
        }
      } catch {}
    }

    // Schedule delivery 3 days from now (fraud review window)
    // Tremendous only accepts YYYY-MM-DD and delivers at 12PM ET on that date
    const deliveryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    const deliverAt = deliveryDate.toISOString().split("T")[0];

    // Create the reward order via Tremendous API with delayed delivery
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
          deliver_at: deliverAt,
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
