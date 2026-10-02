import { NextRequest, NextResponse } from "next/server";

// Avalara entity use code for resale exemptions
const AVATAX_RESALE_CODE = "G";

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Email staff when a customer submits a Tax ID. Recipients come from TAX_ID_NOTIFY_EMAIL (comma-separated).
async function sendTaxIdNotification(info: {
  customerId: number;
  customerName: string;
  customerEmail: string;
  companyName: string;
  taxIdNumber: string;
  uploadDate: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const recipients = (process.env.TAX_ID_NOTIFY_EMAIL || "").split(",").map(s => s.trim()).filter(Boolean);
  if (!apiKey || recipients.length === 0) {
    console.warn("[TAX_ID] Notification skipped — RESEND_API_KEY or TAX_ID_NOTIFY_EMAIL not set");
    return;
  }

  const storeHash = process.env.BIGCOMMERCE_STORE_HASH!;
  const customerUrl = `https://store-${storeHash}.mybigcommerce.com/manage/customers/${info.customerId}/edit`;
  const rows: [string, string][] = [
    ["Company", info.companyName || "—"],
    ["Customer", info.customerName],
    ["Email", info.customerEmail || "—"],
    ["Tax ID", info.taxIdNumber],
    ["Submitted", info.uploadDate],
    ["Customer ID", String(info.customerId)],
  ];

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "MJS Website <orders@updates.mobilejanitorialsupply.com>",
        to: recipients,
        reply_to: info.customerEmail || undefined,
        subject: `Tax ID submitted: ${info.companyName || info.customerName}`,
        html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;background:#ffffff;">
    <tr>
      <td style="background:#1a1a2e;padding:20px 32px;">
        <h1 style="margin:0;color:#ffffff;font-size:16px;font-weight:800;letter-spacing:0.5px;">NEW TAX ID SUBMITTED</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:28px 32px;">
        <p style="margin:0 0 20px;color:#666;font-size:14px;line-height:1.6;">
          A customer submitted a Tax ID on the website and has been marked tax exempt. Please verify the resale certificate.
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:10px;">
          ${rows.map(([k, v]) => `<tr><td style="padding:8px 16px;font-size:13px;color:#6b7280;">${k}</td><td align="right" style="padding:8px 16px;font-size:13px;font-weight:700;color:#1a1a2e;">${escapeHtml(v)}</td></tr>`).join("")}
        </table>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align:center;padding:24px 0 0;">
              <a href="${customerUrl}" style="display:inline-block;background:#dc2626;color:#ffffff;font-weight:700;font-size:14px;padding:12px 32px;border-radius:8px;text-decoration:none;">
                Open Customer in BigCommerce
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
      }),
    });
    if (!res.ok) console.error(`[TAX_ID] Notification email failed: ${res.status} ${await res.text()}`);
  } catch (err) {
    console.error("[TAX_ID] Notification email error:", err);
  }
}

// GET — check if customer has uploaded a tax ID
export async function GET(req: NextRequest) {
  const customerId = Number(req.nextUrl.searchParams.get("customerId"));
  if (!customerId) return NextResponse.json({ uploaded: false });

  try {
    const storeHash = process.env.BIGCOMMERCE_STORE_HASH!;
    const token = process.env.BIGCOMMERCE_ACCESS_TOKEN!;

    // Check customer form fields / staff notes for tax ID marker
    const res = await fetch(
      `https://api.bigcommerce.com/stores/${storeHash}/v2/customers/${customerId}`,
      { headers: { "X-Auth-Token": token, "Accept": "application/json" } }
    );
    if (!res.ok) return NextResponse.json({ uploaded: false });
    const customer = await res.json();
    const notes = (customer.notes || "") as string;
    const hasTaxId = notes.includes("[TAX_ID_UPLOADED]");
    const idMatch = notes.match(/\[TAX_ID_NUMBER:(.*?)\]/);
    const taxIdNumber = idMatch ? idMatch[1] : null;
    const dateMatch = notes.match(/\[TAX_ID_DATE:(.*?)\]/);
    const uploadDate = dateMatch ? dateMatch[1] : null;

    return NextResponse.json({ uploaded: hasTaxId, taxIdNumber, uploadDate });
  } catch {
    return NextResponse.json({ uploaded: false });
  }
}

// POST — upload tax ID file
export async function POST(req: NextRequest) {
  try {
    // Support both JSON and FormData
    let customerId: number;
    let taxIdNumber: string;
    let customerName: string;
    let customerEmail: string;
    let companyName: string;

    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const body = await req.json();
      customerId = Number(body.customerId);
      taxIdNumber = body.taxIdNumber || "";
      customerName = body.customerName || "Unknown";
      customerEmail = body.customerEmail || "";
      companyName = body.companyName || "";
    } else {
      const formData = await req.formData();
      customerId = Number(formData.get("customerId"));
      taxIdNumber = (formData.get("taxIdNumber") as string) || "";
      customerName = (formData.get("customerName") as string) || "Unknown";
      customerEmail = (formData.get("customerEmail") as string) || "";
      companyName = (formData.get("companyName") as string) || "";
    }

    if (!customerId || !taxIdNumber) {
      return NextResponse.json({ error: "Missing customer ID or Tax ID number" }, { status: 400 });
    }

    const storeHash = process.env.BIGCOMMERCE_STORE_HASH!;
    const token = process.env.BIGCOMMERCE_ACCESS_TOKEN!;
    const uploadDate = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    // Update customer notes in BC to mark tax ID as uploaded
    const customerRes = await fetch(
      `https://api.bigcommerce.com/stores/${storeHash}/v2/customers/${customerId}`,
      { headers: { "X-Auth-Token": token, "Accept": "application/json" } }
    );
    if (customerRes.ok) {
      const customer = await customerRes.json();
      let notes = ((customer.notes || "") as string)
        .replace(/\[TAX_ID_UPLOADED\]/g, "")
        .replace(/\[TAX_ID_NUMBER:.*?\]/g, "")
        .replace(/\[TAX_ID_FILE:.*?\]/g, "")
        .replace(/\[TAX_ID_DATE:.*?\]/g, "")
        .trim();
      notes = `${notes} [TAX_ID_UPLOADED] [TAX_ID_NUMBER:${taxIdNumber}] [TAX_ID_DATE:${uploadDate}]`.trim();

      // Use nativeRequest via updateOrder pattern for the PUT
      const { default: https } = await import("https");
      const { gunzipSync } = await import("zlib");
      await new Promise((resolve, reject) => {
        const body = JSON.stringify({ notes });
        const parsed = new URL(`https://api.bigcommerce.com/stores/${storeHash}/v2/customers/${customerId}`);
        const r = https.request({
          hostname: parsed.hostname,
          path: parsed.pathname,
          method: "PUT",
          headers: {
            "X-Auth-Token": token,
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(body),
          },
        }, (res) => {
          const chunks: Buffer[] = [];
          res.on("data", (c: Buffer) => chunks.push(c));
          res.on("end", () => {
            let buf = Buffer.concat(chunks);
            if (res.headers["content-encoding"] === "gzip") {
              try { buf = gunzipSync(buf); } catch {}
            }
            resolve(buf.toString());
          });
        });
        r.on("error", reject);
        r.write(body);
        r.end();
      });
    }

    // Set the tax_exempt_category on the customer record so AvaTax skips tax.
    // AvaTax reads this field as an Avalara entity use code — "G" is Resale.
    // (A free-text value like "TAX EXEMPT" is ignored and tax is still charged.)
    try {
      const { default: https2 } = await import("https");
      const exemptBody = JSON.stringify({ tax_exempt_category: AVATAX_RESALE_CODE });
      await new Promise((resolve, reject) => {
        const parsed2 = new URL(`https://api.bigcommerce.com/stores/${storeHash}/v2/customers/${customerId}`);
        const r2 = https2.request({
          hostname: parsed2.hostname,
          path: parsed2.pathname,
          method: "PUT",
          headers: {
            "X-Auth-Token": token,
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(exemptBody),
          },
        }, (res) => {
          const chunks: Buffer[] = [];
          res.on("data", (c: Buffer) => chunks.push(c));
          res.on("end", () => resolve(Buffer.concat(chunks).toString()));
        });
        r2.on("error", reject);
        r2.write(exemptBody);
        r2.end();
      });
      console.log(`[TAX_ID] Set tax_exempt_category=${AVATAX_RESALE_CODE} for customer ${customerId}`);
    } catch (exemptErr) {
      console.error(`[TAX_ID] Failed to set tax exempt category:`, exemptErr);
    }

    console.log(`[TAX_ID] Customer ${customerName} (${customerEmail}) from ${companyName} submitted Tax ID: ${taxIdNumber}`);

    // Notify staff so the resale certificate can be verified
    await sendTaxIdNotification({ customerId, customerName, customerEmail, companyName, taxIdNumber, uploadDate });

    return NextResponse.json({
      success: true,
      taxIdNumber,
      uploadDate,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
