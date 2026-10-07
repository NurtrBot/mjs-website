import { NextRequest, NextResponse } from "next/server";
import { getCustomerById } from "@/lib/bigcommerce";
import { buildEmail, type DueOrder } from "@/lib/review-request";
import { renderReviewRequestEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

/**
 * GET /api/reviews/preview?secret=…                 — render with a sample name
 * GET /api/reviews/preview?secret=…&customerId=4171 — render for a real customer
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.nextUrl.searchParams.get("secret") !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const customerId = Number(req.nextUrl.searchParams.get("customerId")) || 0;
  const order: DueOrder = { orderId: 0, customerId, orderDate: new Date(), hoursSince: 72 };

  let customer = { first_name: "Zack", email: "preview@example.com" };
  if (customerId) {
    const found = await getCustomerById(customerId);
    if (!found) return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    customer = { first_name: found.first_name, email: found.email };
  }

  const data = buildEmail(order, customer);
  if (!data) return NextResponse.json({ error: "Could not build the email" }, { status: 404 });

  const { html } = renderReviewRequestEmail(data);
  return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
