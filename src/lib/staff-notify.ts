// Staff notification emails via Resend. Recipients: STAFF_NOTIFY_EMAIL (comma-separated),
// falling back to TAX_ID_NOTIFY_EMAIL.

export const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function staffRecipients(): string[] {
  const raw = process.env.STAFF_NOTIFY_EMAIL || process.env.TAX_ID_NOTIFY_EMAIL || "";
  return raw.split(",").map(s => s.trim()).filter(Boolean);
}

// Renders a simple branded email with a heading, intro, key/value rows and an optional button.
export function staffEmailHtml(opts: {
  heading: string;
  intro: string;
  rows: [string, string][];
  button?: { label: string; url: string };
  footnote?: string;
}) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;background:#ffffff;">
    <tr>
      <td style="background:#1a1a2e;padding:20px 32px;">
        <h1 style="margin:0;color:#ffffff;font-size:16px;font-weight:800;letter-spacing:0.5px;">${escapeHtml(opts.heading)}</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:28px 32px;">
        <p style="margin:0 0 20px;color:#666;font-size:14px;line-height:1.6;">${escapeHtml(opts.intro)}</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:10px;">
          ${opts.rows.map(([k, v]) => `<tr><td style="padding:8px 16px;font-size:13px;color:#6b7280;">${escapeHtml(k)}</td><td align="right" style="padding:8px 16px;font-size:13px;font-weight:700;color:#1a1a2e;">${escapeHtml(v)}</td></tr>`).join("")}
        </table>
        ${opts.button ? `
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align:center;padding:24px 0 0;">
              <a href="${opts.button.url}" style="display:inline-block;background:#dc2626;color:#ffffff;font-weight:700;font-size:14px;padding:12px 32px;border-radius:8px;text-decoration:none;">${escapeHtml(opts.button.label)}</a>
            </td>
          </tr>
        </table>` : ""}
        ${opts.footnote ? `<p style="margin:20px 0 0;color:#9ca3af;font-size:12px;line-height:1.5;">${escapeHtml(opts.footnote)}</p>` : ""}
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendStaffEmail(opts: { subject: string; html: string; replyTo?: string }): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const recipients = staffRecipients();
  if (!apiKey || recipients.length === 0) {
    console.warn(`[STAFF_NOTIFY] Skipped "${opts.subject}" — RESEND_API_KEY or STAFF_NOTIFY_EMAIL not set`);
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "MJS Website <orders@updates.mobilejanitorialsupply.com>",
        to: recipients,
        reply_to: opts.replyTo || undefined,
        subject: opts.subject,
        html: opts.html,
      }),
    });
    if (!res.ok) {
      console.error(`[STAFF_NOTIFY] Email failed: ${res.status} ${await res.text()}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[STAFF_NOTIFY] Email error:", err);
    return false;
  }
}
