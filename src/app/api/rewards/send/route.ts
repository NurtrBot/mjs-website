import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { updateOrder } from "@/lib/bigcommerce";
import {
  getRewardTier,
  isGiftCardId,
  GIFT_CARDS,
  qualifyingSubtotalFromOrder,
  REWARD_SENT_MARKER,
  rewardSentNote,
} from "@/lib/reward-tiers";

/*
 * Claim the gift-card reward for an order (used by the confirmation page).
 *
 * Everything that matters is decided from the real BigCommerce order:
 *   - the tier comes from the order's merchandise subtotal (before tax and
 *     shipping, after promo discount), account vs guest from the order's
 *     customer_id; bill-to-account, card and cash orders all qualify
 *   - the card goes to the email ON THE ORDER, never one typed by the browser
 *   - an order can only claim once (marker in the order's staff notes)
 *   - cancelled / declined / refunded / incomplete orders, and orders older
 *     than 30 days, cannot claim
 * The browser only picks the brand of card.
 */

// BC order status ids that can never earn a reward
const BLOCKED_STATUS = new Set([0 /* Incomplete */, 4 /* Refunded */, 5 /* Cancelled */, 6 /* Declined */, 13 /* Disputed */, 14 /* Partially Refunded */]);
const CLAIM_WINDOW_DAYS = 30;

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
    const body = await req.json();
    const orderId = Number(String(body.orderId ?? "").replace(/^MJS-/i, ""));
    const productId = body.productId;

    if (!Number.isInteger(orderId) || orderId <= 0) {
      return NextResponse.json({ error: "An order number is required to claim a reward" }, { status: 400 });
    }
    if (!isGiftCardId(productId)) {
      return NextResponse.json({ error: "Please choose a gift card from the list" }, { status: 400 });
    }

    // Look up the real order
    const storeHash = process.env.BIGCOMMERCE_STORE_HASH!;
    const token = process.env.BIGCOMMERCE_ACCESS_TOKEN!;
    const orderRes = await fetch(
      `https://api.bigcommerce.com/stores/${storeHash}/v2/orders/${orderId}`,
      { headers: { "X-Auth-Token": token, "Accept": "application/json" }, cache: "no-store" }
    );
    if (!orderRes.ok) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    const order = await orderRes.json();

    if (BLOCKED_STATUS.has(Number(order.status_id))) {
      return NextResponse.json({ error: "This order is not eligible for a reward" }, { status: 400 });
    }
    const ageDays = (Date.now() - new Date(order.date_created).getTime()) / 86400000;
    if (!(ageDays >= 0 && ageDays <= CLAIM_WINDOW_DAYS)) {
      return NextResponse.json({ error: `Rewards must be claimed within ${CLAIM_WINDOW_DAYS} days of the order` }, { status: 400 });
    }
    const staffNotes: string = order.staff_notes || "";
    if (staffNotes.includes(REWARD_SENT_MARKER)) {
      return NextResponse.json({ error: "The reward for this order has already been sent" }, { status: 409 });
    }

    const isAccountHolder = Number(order.customer_id) > 0;
    const qualifying = qualifyingSubtotalFromOrder(order);
    const tier = getRewardTier(qualifying, isAccountHolder);
    if (!tier) {
      return NextResponse.json({ error: "Order does not qualify for a reward" }, { status: 400 });
    }

    const recipientEmail: string = order.billing_address?.email || "";
    if (!recipientEmail) {
      return NextResponse.json({ error: "No email on this order" }, { status: 400 });
    }
    const recipientName =
      `${order.billing_address?.first_name || ""} ${order.billing_address?.last_name || ""}`.trim() || "Valued Customer";
    const cardName = GIFT_CARDS.find((g) => g.id === productId)?.name || "Gift card";

    // Schedule delivery 3 days from now (fraud review window)
    // Tremendous only accepts YYYY-MM-DD and delivers at 12PM ET on that date
    const deliveryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    const deliverAt = deliveryDate.toISOString().split("T")[0];

    const tBody = {
      payment: { funding_source_id: fundingSourceId || "BALANCE" },
      external_id: `mjs-order-${orderId}`,
      rewards: [
        {
          value: { denomination: tier.amount, currency_code: "USD" },
          deliver_at: deliverAt,
          delivery: { method: "EMAIL" },
          recipient: { name: recipientName, email: recipientEmail },
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
      body: JSON.stringify(tBody),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("[TREMENDOUS] Error:", JSON.stringify(data));
      return NextResponse.json({
        error: data.errors?.[0]?.message || "Failed to generate gift card",
      }, { status: 400 });
    }

    const reward = data.order?.rewards?.[0] || {};
    const redeemLink = reward.delivery?.link || "";
    console.log(`[TREMENDOUS] Sent $${tier.amount} ${cardName} for order ${orderId} (${tier.label}, qualifying $${qualifying.toFixed(2)}) to ${recipientEmail}`);

    // Mark the order as claimed
    try {
      await updateOrder(orderId, {
        staff_notes: `${staffNotes} ${rewardSentNote(tier.amount, reward.id || "")}`.trim(),
      });
    } catch (err) {
      console.error(`[TREMENDOUS] Failed to write reward marker on order ${orderId}:`, err);
    }

    return NextResponse.json({
      success: true,
      rewardId: reward.id || "",
      redeemLink,
      recipientEmail,
      amount: tier.amount,
      tier: tier.label,
      name: cardName,
      orderId,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[TREMENDOUS] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
