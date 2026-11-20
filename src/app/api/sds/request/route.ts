import { NextRequest, NextResponse } from "next/server";
import { sendStaffEmail, staffEmailHtml, staffRecipients } from "@/lib/staff-notify";
import { SITE } from "@/lib/sds";

/*
 * POST /api/sds/request  { sku, productName, slug?, customerId?, email?, name?, company? }
 * One-click "Request SDS" from the binder or the order email. Emails the team
 * (STAFF_NOTIFY_EMAIL / TAX_ID_NOTIFY_EMAIL recipients) so a verified sheet
 * gets linked; reply-to is the customer.
 *
 * GET /api/sds/request?preview=1&secret=CRON_SECRET  → renders a sample (HTML)
 */

function buildRequestEmail(b: Record<string, unknown>) {
  const sku = String(b.sku || "").slice(0, 40);
  const productName = String(b.productName || sku).slice(0, 160);
  const name = String(b.name || "").trim();
  const company = String(b.company || "").trim();
  const email = String(b.email || "").trim();
  const customerId = b.customerId ? String(b.customerId) : "";
  const rows: [string, string][] = [
    ["Product", productName],
    ["Item number", sku],
    ["Requested by", name || "Signed-in customer"],
  ];
  if (company) rows.push(["Company", company]);
  if (email) rows.push(["Email", email]);
  if (customerId) rows.push(["Customer #", customerId]);
  rows.push(["Requested", new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) + " PT"]);
  const subject = `SDS request: ${productName} (${sku})`;
  const html = staffEmailHtml({
    heading: "SDS REQUEST",
    intro: `${name || "A customer"}${company ? ` at ${company}` : ""} asked for the safety data sheet for a chemical they bought, and we don't have a verified sheet linked to it yet.`,
    rows,
    button: b.slug ? { label: "Open product page", url: `${SITE}/product/${String(b.slug)}` } : undefined,
    footnote: `To close this out: save the manufacturer's PDF as public/sds/${sku}.PDF, add it to src/data/sds-index.ts, and deploy. It will then show in the customer's SDS Binder and in future order emails. Reply to this email to send the sheet to the customer directly in the meantime.`,
  });
  return { subject, html, replyTo: email || undefined };
}

export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => ({}));
  if (!b.sku) return NextResponse.json({ error: "sku required" }, { status: 400 });
  const { subject, html, replyTo } = buildRequestEmail(b);
  const sent = await sendStaffEmail({ subject, html, replyTo });
  if (!sent) console.log("[SDS] request logged (email not configured)", { sku: b.sku, productName: b.productName, customerId: b.customerId });
  return NextResponse.json({ ok: true, recipients: staffRecipients().length });
}

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.nextUrl.searchParams.get("secret") !== secret) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { html } = buildRequestEmail({
    sku: "41212EA", productName: "Janitors Finest Shower Sauce Bathroom Cleaner, 32 OZ", slug: "janitors-finest-shower-sauce-bathroom-cleaner-32-oz-41212ea",
    name: "Maria Lopez", company: "Bright Side Cleaning", email: "maria@brightsidecleaning.com", customerId: 4171,
  });
  return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
