import { NextRequest, NextResponse } from "next/server";
import { sendStaffEmail } from "@/lib/staff-notify";

/*
 * POST /api/sds/request  { sku, productName, customerId?, email?, name?, company? }
 * One-click "Request SDS": emails the team so a verified sheet gets linked.
 */
export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => ({}));
  const sku = String(b.sku || "").slice(0, 40);
  const productName = String(b.productName || "").slice(0, 160);
  if (!sku) return NextResponse.json({ error: "sku required" }, { status: 400 });
  const esc = (s: unknown) => String(s ?? "").replace(/[<>&]/g, c => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c] as string));
  const who = [b.name, b.company, b.email].filter(Boolean).map(esc).join(" · ") || "a signed-in customer";
  const html = `<div style="font-family:Helvetica,Arial,sans-serif;font-size:14px;color:#1a1a2e;line-height:1.5">
    <p><strong>SDS requested</strong> by ${who}${b.customerId ? ` (customer #${esc(b.customerId)})` : ""}.</p>
    <p><strong>${esc(productName || sku)}</strong><br>Item number: ${esc(sku)}</p>
    <p>Drop the PDF into <code>public/sds/${esc(sku)}.PDF</code> and add it to the SDS index so it appears in the customer's binder and future order emails.</p>
  </div>`;
  const sent = await sendStaffEmail({ subject: `SDS request: ${productName || sku} (${sku})`, html, replyTo: b.email ? String(b.email) : undefined });
  if (!sent) console.log("[SDS] request logged (email not configured)", { sku, productName, customerId: b.customerId });
  return NextResponse.json({ ok: true });
}
