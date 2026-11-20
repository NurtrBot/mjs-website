// Staff notification emails via Resend. Recipients: STAFF_NOTIFY_EMAIL (comma-separated),
// falling back to TAX_ID_NOTIFY_EMAIL.

export const escapeHtml = (s: string | number | null | undefined) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function staffRecipients(): string[] {
  const raw = process.env.STAFF_NOTIFY_EMAIL || process.env.TAX_ID_NOTIFY_EMAIL || "";
  return raw.split(",").map(s => s.trim()).filter(Boolean);
}

/*
 * Shared layout for every email that goes to the office (tax ID, credit
 * application, SDS request, …). Same look as the customer SDS email: white
 * card on grey, logo + timestamp header, red eyebrow, big headline, intro,
 * grey facts band, optional product/attachment row, slim navy action bar,
 * centred footer.
 */
export interface StaffEmailOptions {
  eyebrow?: string;           // "TAX ID SUBMITTED"
  heading?: string;           // legacy alias for eyebrow
  headline?: string;          // "Bright Side Cleaning is now tax exempt."
  intro: string;              // one or two sentences; plain text
  rows: [string, string][];   // facts band
  item?: { image?: string; title: string; subtitle?: string; button?: { label: string; url: string } };
  action?: { text: string; label: string; url: string }; // slim navy bar
  button?: { label: string; url: string };               // legacy: becomes the action bar
  footnote?: string;
}

const SITE = "https://www.mobilejanitorialsupply.com";
const FONT = "font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;";

export function staffEmailHtml(opts: StaffEmailOptions) {
  const esc = escapeHtml;
  const eyebrow = (opts.eyebrow || opts.heading || "STAFF NOTICE").toUpperCase();
  const headline = opts.headline || opts.heading || "New request from the website";
  const action = opts.action || (opts.button ? { text: "Next step", label: opts.button.label, url: opts.button.url } : undefined);
  const when = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles", month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
  const link = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? `<a href="mailto:${esc(v)}" style="color:#1a1a2e;text-decoration:none;">${esc(v)}</a>` : esc(v);

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${esc(headline)}</title></head>
<body style="margin:0;padding:0;background-color:#eef0f3;${FONT}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${esc(opts.intro)}</div>
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#eef0f3;">
<tr><td align="center" style="padding:24px 12px;">
<table width="640" cellpadding="0" cellspacing="0" role="presentation" style="max-width:640px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;">

<tr><td style="padding:26px 32px 8px 32px;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr>
    <td style="vertical-align:middle;"><a href="${SITE}"><img src="${SITE}/images/email-welcome-logo.png" width="118" alt="Mobile Janitorial Supply" style="display:block;width:118px;height:auto;border:0;"></a></td>
    <td align="right" style="vertical-align:middle;${FONT}font-size:12px;color:#6b7280;line-height:18px;">Staff notice<br>${esc(when)} PT</td>
  </tr></table>
</td></tr>

<tr><td style="padding:18px 32px 0 32px;">
  <div style="${FONT}font-size:12px;font-weight:800;letter-spacing:2px;color:#D42027;">${esc(eyebrow)}</div>
  <div style="${FONT}font-size:30px;line-height:34px;font-weight:900;letter-spacing:-1px;color:#1a1a2e;margin-top:8px;">${esc(headline)}</div>
  <div style="${FONT}font-size:15px;color:#4b5563;line-height:23px;margin-top:10px;">${esc(opts.intro)}</div>
</td></tr>

<tr><td style="padding:18px 32px 6px 32px;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:linear-gradient(180deg,#f9fafb 0%,#eceff3 100%);background-color:#f3f4f6;border-radius:12px;">
    <tr><td colspan="2" style="height:8px;line-height:8px;font-size:0;">&nbsp;</td></tr>
    ${opts.rows.map(([k, v]) => `<tr><td style="padding:5px 18px;${FONT}font-size:13px;color:#6b7280;vertical-align:top;white-space:nowrap;">${esc(k)}</td><td align="right" style="padding:5px 18px;${FONT}font-size:13px;font-weight:800;color:#1a1a2e;">${link(v)}</td></tr>`).join("")}
    <tr><td colspan="2" style="height:8px;line-height:8px;font-size:0;">&nbsp;</td></tr>
  </table>
</td></tr>

${opts.item ? `<tr><td style="padding:14px 32px 4px 32px;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr>
    ${opts.item.image ? `<td width="88" style="vertical-align:middle;padding-right:16px;"><div style="width:88px;height:88px;border-radius:10px;background:#f3f4f6;overflow:hidden;text-align:center;"><img src="${esc(opts.item.image)}" width="88" height="88" alt="" style="display:block;width:88px;height:88px;object-fit:contain;border:0;"></div></td>` : ""}
    <td style="vertical-align:middle;padding-right:16px;">
      <div style="${FONT}font-size:15px;font-weight:800;letter-spacing:-0.2px;color:#1a1a2e;line-height:19px;">${esc(opts.item.title)}</div>
      ${opts.item.subtitle ? `<div style="${FONT}font-size:12.5px;color:#6b7280;margin-top:4px;">${opts.item.subtitle}</div>` : ""}
    </td>
    ${opts.item.button ? `<td width="150" align="right" style="vertical-align:middle;white-space:nowrap;"><table cellpadding="0" cellspacing="0" role="presentation" align="right"><tr><td bgcolor="#D42027" style="border-radius:8px;"><a href="${esc(opts.item.button.url)}" style="display:inline-block;${FONT}font-size:13px;font-weight:700;color:#ffffff;text-decoration:none;padding:9px 14px;">${esc(opts.item.button.label)}</a></td></tr></table></td>` : ""}
  </tr></table>
</td></tr>` : ""}

${action ? `<tr><td style="padding:14px 32px 8px 32px;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" bgcolor="#1a1a2e" style="background:#1a1a2e;border-radius:12px;"><tr>
    <td style="padding:14px 20px;${FONT}font-size:14px;font-weight:700;color:#ffffff;">${esc(action.text)}</td>
    <td align="right" style="padding:10px 12px 10px 0;white-space:nowrap;vertical-align:middle;"><table cellpadding="0" cellspacing="0" role="presentation" align="right"><tr><td bgcolor="#fecd02" style="border-radius:8px;"><a href="${esc(action.url)}" style="display:inline-block;${FONT}font-size:13.5px;font-weight:800;color:#1a1a2e;text-decoration:none;padding:9px 16px;">${esc(action.label)}</a></td></tr></table></td>
  </tr></table>
</td></tr>` : ""}

${opts.footnote ? `<tr><td style="padding:6px 32px 10px 32px;${FONT}font-size:12.5px;color:#6b7280;line-height:19px;">${esc(opts.footnote)}</td></tr>` : ""}

<tr><td style="padding:22px 32px 24px 32px;border-top:1px solid #eceff3;text-align:center;">
  <div style="${FONT}font-size:14px;font-weight:800;color:#1a1a2e;">Mobile Janitorial Supply</div>
  <div style="${FONT}font-size:12.5px;color:#6b7280;margin-top:3px;">3066 E. La Palma Ave, Anaheim, CA 92806</div>
  <div style="${FONT}font-size:12.5px;color:#6b7280;margin-top:3px;"><a href="tel:7147792640" style="color:#6b7280;text-decoration:none;">(714) 779-2640</a> &middot; <a href="${SITE}" style="color:#D42027;font-weight:700;text-decoration:none;">mobilejanitorialsupply.com</a></div>
  <div style="${FONT}font-size:11px;color:#9ca3af;margin-top:16px;">Internal notice from the website</div>
</td></tr>

</table>
</td></tr></table>
</body>
</html>`;
}

export async function sendStaffEmail(opts: {
  subject: string;
  html: string;
  replyTo?: string;
  attachments?: { filename: string; content: string }[]; // content is base64
}): Promise<boolean> {
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
        attachments: opts.attachments,
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
