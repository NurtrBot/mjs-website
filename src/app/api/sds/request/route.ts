import { NextRequest, NextResponse } from "next/server";
import { sendStaffEmail, staffRecipients } from "@/lib/staff-notify";
import { sdsRequestEmail } from "@/lib/staff-emails";

/*
 * POST /api/sds/request  { sku, productName, image?, slug?, customerId?, email?, name?, company? }
 * One-click "Request SDS" from the binder or the order email. Emails the office
 * (STAFF_NOTIFY_EMAIL / TAX_ID_NOTIFY_EMAIL recipients) with reply-to set to
 * the customer. Preview: /api/staff-email/preview?kind=sds
 */
export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => ({}));
  if (!b.sku) return NextResponse.json({ error: "sku required" }, { status: 400 });
  const { subject, html, replyTo } = sdsRequestEmail(b);
  const sent = await sendStaffEmail({ subject, html, replyTo });
  if (!sent) console.log("[SDS] request logged (email not configured)", { sku: b.sku, productName: b.productName, customerId: b.customerId });
  return NextResponse.json({ ok: true, recipients: staffRecipients().length });
}
