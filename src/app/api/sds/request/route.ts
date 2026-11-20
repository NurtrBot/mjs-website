import { NextRequest, NextResponse } from "next/server";
import { sendStaffEmail, staffRecipients, escapeHtml as esc } from "@/lib/staff-notify";
import { SITE } from "@/lib/sds";

/*
 * POST /api/sds/request  { sku, productName, image?, slug?, customerId?, email?, name?, company? }
 * One-click "Request SDS" from the binder or the order email. Emails the team
 * (STAFF_NOTIFY_EMAIL / TAX_ID_NOTIFY_EMAIL recipients) so a verified sheet
 * gets linked; reply-to is the customer. Styled like the customer SDS email.
 *
 * GET /api/sds/request?preview=1&secret=CRON_SECRET  → renders a sample (HTML)
 */

function buildRequestEmail(b: Record<string, unknown>) {
  const site = SITE;
  const font = "font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;";
  const sku = String(b.sku || "").slice(0, 40);
  const productName = String(b.productName || sku).slice(0, 160);
  const image = String(b.image || "").trim() || `${site}/images/placeholder-product.svg`;
  const slug = String(b.slug || "").trim();
  const name = String(b.name || "").trim();
  const firstName = name.split(" ")[0] || "A customer";
  const company = String(b.company || "").trim();
  const email = String(b.email || "").trim();
  const customerId = b.customerId ? String(b.customerId) : "";
  const when = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles", month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
  const subject = `SDS request: ${productName} (${sku})`;

  const facts: [string, string][] = [["Requested by", name || "Signed-in customer"]];
  if (company) facts.push(["Company", company]);
  if (email) facts.push(["Email", email]);
  if (customerId) facts.push(["Customer #", customerId]);

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background-color:#eef0f3;${font}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${esc(`${name || "A customer"} needs the sheet for ${productName}.`)}</div>
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#eef0f3;">
<tr><td align="center" style="padding:24px 12px;">
<table width="640" cellpadding="0" cellspacing="0" role="presentation" style="max-width:640px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;">

<!-- HEADER -->
<tr><td style="padding:26px 32px 8px 32px;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr>
    <td style="vertical-align:middle;"><a href="${site}"><img src="${site}/images/email-welcome-logo.png" width="118" alt="Mobile Janitorial Supply" style="display:block;width:118px;height:auto;border:0;"></a></td>
    <td align="right" style="vertical-align:middle;${font}font-size:12px;color:#6b7280;line-height:18px;">Staff notice<br>${esc(when)} PT</td>
  </tr></table>
</td></tr>

<tr><td style="padding:18px 32px 0 32px;">
  <div style="${font}font-size:12px;font-weight:800;letter-spacing:2px;color:#D42027;">SDS REQUEST</div>
  <div style="${font}font-size:30px;line-height:34px;font-weight:900;letter-spacing:-1px;color:#1a1a2e;margin-top:8px;">${esc(firstName)} needs a sheet.</div>
  <div style="${font}font-size:15px;color:#4b5563;line-height:23px;margin-top:10px;">${esc(name || "A customer")}${company ? ` at <span style="font-weight:800;color:#1a1a2e;">${esc(company)}</span>` : ""} asked for the safety data sheet for a chemical they bought. We don&rsquo;t have a verified sheet linked to it yet.</div>
</td></tr>

<!-- WHO BAND -->
<tr><td style="padding:18px 32px 6px 32px;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:linear-gradient(180deg,#f9fafb 0%,#eceff3 100%);background-color:#f3f4f6;border-radius:12px;">
    ${facts.map(([k, v]) => `<tr><td style="padding:6px 18px;${font}font-size:13px;color:#6b7280;">${esc(k)}</td><td align="right" style="padding:6px 18px;${font}font-size:13px;font-weight:800;color:#1a1a2e;">${k === "Email" ? `<a href="mailto:${esc(v)}" style="color:#1a1a2e;text-decoration:none;">${esc(v)}</a>` : esc(v)}</td></tr>`).join("")}
    <tr><td colspan="2" style="height:8px;line-height:8px;font-size:0;">&nbsp;</td></tr>
  </table>
</td></tr>

<!-- PRODUCT -->
<tr><td style="padding:14px 32px;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr>
    <td width="88" style="vertical-align:middle;padding-right:16px;">
      <div style="width:88px;height:88px;border-radius:10px;background:#f3f4f6;overflow:hidden;text-align:center;"><img src="${esc(image)}" width="88" height="88" alt="" style="display:block;width:88px;height:88px;object-fit:contain;border:0;"></div>
    </td>
    <td style="vertical-align:middle;padding-right:16px;">
      <div style="${font}font-size:15px;font-weight:800;letter-spacing:-0.2px;color:#1a1a2e;line-height:19px;">${esc(productName)}</div>
      <div style="${font}font-size:12.5px;color:#6b7280;margin-top:4px;">Item ${esc(sku)} &middot; <span style="color:#B01A20;font-weight:700;">No sheet on file</span></div>
    </td>
    <td width="150" align="right" style="vertical-align:middle;white-space:nowrap;">
      ${slug ? `<table cellpadding="0" cellspacing="0" role="presentation" align="right"><tr><td bgcolor="#D42027" style="border-radius:8px;"><a href="${site}/product/${esc(slug)}" style="display:inline-block;${font}font-size:13px;font-weight:700;color:#ffffff;text-decoration:none;padding:9px 14px;">Open product</a></td></tr></table>` : ""}
    </td>
  </tr></table>
</td></tr>

<!-- HOW TO CLOSE -->
<tr><td style="padding:6px 32px 26px 32px;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" bgcolor="#1a1a2e" style="background:#1a1a2e;border-radius:12px;"><tr>
    <td style="padding:20px 22px;">
      <div style="${font}font-size:17px;font-weight:800;color:#ffffff;letter-spacing:-0.3px;">How to close this out</div>
      <table cellpadding="0" cellspacing="0" role="presentation" style="margin-top:10px;">
        <tr><td style="${font}font-size:13px;color:#fecd02;font-weight:800;padding:3px 10px 3px 0;vertical-align:top;">1</td><td style="${font}font-size:13px;color:#c3c9d6;line-height:19px;padding:3px 0;">Reply to this email with the manufacturer&rsquo;s PDF so ${esc(firstName)} has it today.</td></tr>
        <tr><td style="${font}font-size:13px;color:#fecd02;font-weight:800;padding:3px 10px 3px 0;vertical-align:top;">2</td><td style="${font}font-size:13px;color:#c3c9d6;line-height:19px;padding:3px 0;">Save it as <span style="color:#ffffff;font-weight:700;">public/sds/${esc(sku)}.PDF</span> and add it to the SDS index.</td></tr>
        <tr><td style="${font}font-size:13px;color:#fecd02;font-weight:800;padding:3px 10px 3px 0;vertical-align:top;">3</td><td style="${font}font-size:13px;color:#c3c9d6;line-height:19px;padding:3px 0;">Deploy. It then shows in their SDS Binder and every future order email.</td></tr>
      </table>
    </td>
    ${email ? `<td align="right" style="padding:20px 22px;white-space:nowrap;vertical-align:middle;"><table cellpadding="0" cellspacing="0" role="presentation" align="right"><tr><td bgcolor="#fecd02" style="border-radius:8px;"><a href="mailto:${esc(email)}?subject=${encodeURIComponent(`Your SDS for ${productName}`)}" style="display:inline-block;${font}font-size:13.5px;font-weight:800;color:#1a1a2e;text-decoration:none;padding:11px 16px;">Reply to ${esc(firstName)}</a></td></tr></table></td>` : ""}
  </tr></table>
</td></tr>

<!-- FOOTER (compact, centred) -->
<tr><td style="padding:22px 32px 24px 32px;border-top:1px solid #eceff3;text-align:center;">
  <a href="${site}"><img src="${site}/images/email-welcome-logo.png" width="96" alt="Mobile Janitorial Supply" style="display:block;width:96px;height:auto;border:0;margin:0 auto 10px auto;"></a>
  <div style="${font}font-size:14px;font-weight:800;color:#1a1a2e;">Mobile Janitorial Supply</div>
  <div style="${font}font-size:12.5px;color:#6b7280;margin-top:3px;">3066 E. La Palma Ave, Anaheim, CA 92806</div>
  <div style="${font}font-size:12.5px;color:#6b7280;margin-top:3px;"><a href="tel:7147792640" style="color:#6b7280;text-decoration:none;">(714) 779-2640</a> &middot; <a href="${site}" style="color:#D42027;font-weight:700;text-decoration:none;">mobilejanitorialsupply.com</a></div>
  <div style="${font}font-size:11px;color:#9ca3af;margin-top:16px;">Internal notice from the website &middot; Request SDS, item ${esc(sku)}</div>
</td></tr>

</table>
</td></tr></table>
</body>
</html>`;
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
    sku: "41212EA", productName: "Shower Sauce Bathroom Cleaner, 32 OZ", slug: "janitors-finest-shower-sauce-bathroom-cleaner-32-oz-41212ea",
    image: "https://cdn11.bigcommerce.com/s-wujf5nuxy5/products/12111/images/371490/3158__89980.1777928596.1280.1280.png?c=1",
    name: "Maria Lopez", company: "Bright Side Cleaning", email: "maria@brightsidecleaning.com", customerId: 4171,
  });
  return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
