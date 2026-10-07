import { Resend } from "resend";

export const FROM_ADDRESS = "Mobile Janitorial Supply <orders@updates.mobilejanitorialsupply.com>";

export async function sendPasswordResetEmail(to: string, firstName: string, resetUrl: string) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: FROM_ADDRESS,
      to,
      subject: "Reset your Mobile Janitorial Supply password",
      html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;">
<tr><td align="center" style="padding:24px 12px;">
<table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;">

<tr><td style="background-color:#1a1a2e;border-radius:14px 14px 0 0;padding:28px 32px;text-align:center;">
<div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#dc2626;margin-bottom:8px;">Mobile Janitorial Supply</div>
<div style="font-size:24px;font-weight:900;color:#ffffff;line-height:1.25;">Reset your password</div>
</td></tr>

<tr><td style="background-color:#ffffff;padding:28px 32px;">
<p style="margin:0 0 16px;font-size:14px;color:#374151;line-height:1.6;">Hi ${firstName || "there"},</p>
<p style="margin:0 0 20px;font-size:14px;color:#374151;line-height:1.6;">We received a request to reset the password for your account. Click the button below to choose a new one. This link works for <strong>1 hour</strong>.</p>
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:4px 0 20px;">
<a href="${resetUrl}" style="display:inline-block;background:#dc2626;color:#ffffff;font-weight:700;font-size:15px;padding:14px 40px;border-radius:8px;text-decoration:none;">Choose a New Password</a>
</td></tr></table>
<p style="margin:0 0 8px;font-size:12px;color:#6b7280;line-height:1.6;">If the button doesn't work, copy this link into your browser:</p>
<p style="margin:0 0 20px;font-size:11px;color:#9ca3af;word-break:break-all;">${resetUrl}</p>
<p style="margin:0;font-size:12px;color:#6b7280;line-height:1.6;">If you didn't request this, you can ignore this email — your password won't change. Questions? Call us at (714) 779-2640.</p>
</td></tr>

<tr><td style="background-color:#1a1a2e;border-radius:0 0 14px 14px;padding:16px 32px;text-align:center;">
<a href="https://www.mobilejanitorialsupply.com" style="font-size:10px;color:#dc2626;text-decoration:none;font-weight:600;">mobilejanitorialsupply.com</a>
</td></tr>

</table>
</td></tr></table>
</body>
</html>`,
    });
    return true;
  } catch (error) {
    console.error("[RESEND] Password reset email failed:", error);
    return false;
  }
}

export async function sendWelcomeEmail(to: string, firstName: string, lastName: string, email: string) {
  const site = "https://www.mobilejanitorialsupply.com";
  const font = "font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;";
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: FROM_ADDRESS,
      to,
      subject: `Welcome to Mobile Janitorial Supply, ${firstName} — your account is ready`,
      html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Welcome to Mobile Janitorial Supply</title></head>
<body style="margin:0;padding:0;background-color:#eef0f3;${font}">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#eef0f3;">
<tr><td align="center" style="padding:0;">
<table width="720" cellpadding="0" cellspacing="0" role="presentation" style="max-width:720px;width:100%;background:#ffffff;">

<!-- HEADER: red wedge background, headline left -->
<tr><td background="${site}/images/email-welcome-header-bg.jpg" bgcolor="#ffffff" style="background:#ffffff url('${site}/images/email-welcome-header-bg.jpg') no-repeat right top;background-size:100% 100%;padding:0;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td style="padding:22px 0 0 0;text-align:right;padding-right:28px;${font}font-size:12px;font-weight:800;letter-spacing:2px;color:#ffffff;">YOU&apos;RE IN.</td>
    </tr>
    <tr><td style="padding:34px 40px 40px 40px;">
      <div style="${font}font-size:13px;font-weight:800;letter-spacing:2.5px;color:#e4282f;margin-bottom:14px;">WELCOME TO THE FAMILY</div>
      <div style="${font}font-size:62px;line-height:0.98;font-weight:900;letter-spacing:-2.5px;color:#1a2340;">Good things.<br>Fully stocked.</div>
      <div style="${font}font-size:22px;font-weight:700;color:#1a2340;margin-top:26px;">Welcome, ${firstName}. Your account is ready.</div>
      <div style="${font}font-size:16px;color:#6b7280;line-height:1.45;margin-top:6px;max-width:440px;">Wholesale pricing, order tracking, and fast reordering&mdash;all in one place.</div>
      <table cellpadding="0" cellspacing="0" role="presentation" style="margin-top:26px;"><tr>
        <td bgcolor="#e4282f" style="border-radius:4px;"><a href="${site}/shop" style="display:inline-block;${font}font-size:18px;font-weight:700;color:#ffffff;text-decoration:none;padding:15px 30px;">Start shopping &rarr;</a></td>
      </tr></table>
    </td></tr>
  </table>
</td></tr>

<!-- TRUCK HERO -->
<tr><td style="padding:0;line-height:0;font-size:0;" bgcolor="#1a2340">
  <img src="${site}/images/email-welcome-truck.jpg" width="720" height="384" alt="Mobile Janitorial Supply delivery truck — Your business. Our next stop. Serving Southern California since 1990." style="display:block;width:100%;height:auto;border:0;outline:none;">
</td></tr>

<!-- ACCOUNT CONFIRMED -->
<tr><td style="padding:28px 40px 26px 40px;border-bottom:1px solid #e5e7eb;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr>
    <td style="vertical-align:middle;">
      <div style="${font}font-size:12px;font-weight:800;letter-spacing:2px;color:#e4282f;">ACCOUNT CONFIRMED</div>
      <div style="${font}font-size:34px;font-weight:900;letter-spacing:-1px;color:#1a2340;line-height:1.05;margin-top:4px;">${firstName} ${lastName}</div>
      <div style="${font}font-size:15px;color:#1a2340;margin-top:2px;">${email}</div>
    </td>
    <td align="right" style="vertical-align:middle;white-space:nowrap;${font}font-size:18px;font-weight:700;color:#16a34a;">&#10004;&nbsp; Active</td>
  </tr></table>
</td></tr>

<!-- MORE THAN SUPPLIES (navy band) -->
<tr><td bgcolor="#1a2340" style="background:#1a2340;padding:34px 40px;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr>
    <td width="46%" style="vertical-align:middle;border-right:1px solid #3a4461;padding-right:20px;">
      <div style="${font}font-size:52px;line-height:0.98;font-weight:900;letter-spacing:-2px;color:#ffffff;">More than<br>supplies.</div>
    </td>
    <td style="vertical-align:middle;padding-left:34px;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        ${[
          ["Wholesale pricing", "Best prices on 10K+ products", "/shop"],
          ["Free delivery", "On qualifying orders in SoCal", "/faq"],
          ["Net-30 terms", "For qualified businesses", "/account"],
          ["Easy reorder", "One click from your dashboard", "/account"],
        ].map(([t, d, href], i, arr) => `
        <tr><td style="padding:11px 0;${i < arr.length - 1 ? "border-bottom:1px solid #3a4461;" : ""}">
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr>
            <td><div style="${font}font-size:16px;font-weight:700;color:#ffffff;">${t}</div><div style="${font}font-size:13px;color:#c3c9d6;margin-top:1px;">${d}</div></td>
            <td align="right" style="white-space:nowrap;"><a href="${site}${href}" style="${font}font-size:22px;color:#e4282f;text-decoration:none;font-weight:700;">&rarr;</a></td>
          </tr></table>
        </td></tr>`).join("")}
      </table>
    </td>
  </tr></table>
</td></tr>

<!-- MAKE YOURSELF AT HOME -->
<tr><td style="padding:34px 40px 30px 40px;">
  <div style="${font}font-size:40px;font-weight:900;letter-spacing:-1.5px;color:#1a2340;line-height:1;">Make yourself at home.</div>
  <div style="${font}font-size:17px;color:#6b7280;margin-top:8px;">Three quick steps to get started.</div>
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:22px;"><tr>
    ${[
      ["01", "Add your address", "Set up delivery locations for faster checkout.", `<a href="${site}/account" style="${font}font-size:14px;font-weight:700;color:#e4282f;text-decoration:underline;">Set up my account &rarr;</a>`],
      ["02", "Upload your Tax ID", "If applicable, submit your resale certificate for tax-exempt purchasing.", ""],
      ["03", "Place your first order", "Explore the catalog and start saving.", ""],
    ].map(([n, t, d, link]) => `
    <td width="33%" style="vertical-align:top;padding-right:18px;">
      <div style="${font}font-size:58px;font-weight:900;letter-spacing:-2px;color:#f6c4c6;line-height:1;">${n}</div>
      <div style="${font}font-size:17px;font-weight:700;color:#1a2340;margin-top:6px;">${t}</div>
      <div style="${font}font-size:14px;color:#6b7280;line-height:1.45;margin-top:4px;">${d}</div>
      ${link ? `<div style="margin-top:14px;">${link}</div>` : ""}
    </td>`).join("")}
  </tr></table>
</td></tr>

<!-- TEAM -->
<tr><td bgcolor="#f3f4f6" style="background:#f3f4f6;padding:30px 40px 28px 40px;">
  <div style="${font}font-size:38px;font-weight:900;letter-spacing:-1.5px;color:#1a2340;line-height:1;">You have a team here.</div>
  <div style="${font}font-size:17px;color:#6b7280;margin-top:6px;">Real people. One call away.</div>
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:18px;"><tr>
    ${[["Ryan Bergman", "ryan@mobilejanitorialsupply.com"], ["Zack Bergman", "zack@mobilejanitorialsupply.com"], ["Nick Bergman", "nick@mobilejanitorialsupply.com"]].map(([n, e], i) => `
    <td width="33%" style="vertical-align:top;${i > 0 ? "border-left:1px solid #d1d5db;padding-left:18px;" : ""}padding-right:12px;">
      <div style="${font}font-size:14px;font-weight:700;color:#1a2340;">${n}</div>
      <div style="${font}font-size:12px;color:#6b7280;margin-top:2px;">${e}</div>
    </td>`).join("")}
  </tr></table>
</td></tr>

<!-- PHONE BAR -->
<tr><td bgcolor="#e4282f" style="background:#e4282f;padding:18px 40px;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr>
    <td style="vertical-align:middle;white-space:nowrap;"><a href="tel:7147792640" style="${font}font-size:36px;font-weight:900;letter-spacing:-1px;color:#ffffff;text-decoration:none;">&#9742;&nbsp; (714) 779-2640</a></td>
    <td style="vertical-align:middle;padding-left:24px;border-left:1px solid rgba(255,255,255,0.45);${font}font-size:13px;color:#ffffff;">Mon&ndash;Fri &middot; 6:30 AM &ndash; 3:00 PM PT</td>
  </tr></table>
</td></tr>

<!-- FOOTER -->
<tr><td style="padding:30px 40px 26px 40px;text-align:center;">
  <img src="${site}/images/email-welcome-logo.png" width="200" alt="When supplies are running low… call Mobile Janitorial Supply! 714-779-2640" style="display:block;width:200px;height:auto;border:0;margin:0 auto 14px auto;">
  <div style="${font}font-size:20px;font-weight:800;color:#1a2340;">Mobile Janitorial Supply</div>
  <div style="${font}font-size:14px;color:#1a2340;margin-top:4px;">Serving Southern California since 1990</div>
  <div style="${font}font-size:14px;color:#1a2340;margin-top:18px;">3066 E. La Palma Ave, Anaheim, CA 92806</div>
  <div style="${font}font-size:14px;color:#6b7280;margin-top:4px;">orders@mobilejanitorialsupply.com</div>
  <div style="margin-top:16px;"><a href="${site}" style="${font}font-size:16px;font-weight:800;color:#e4282f;text-decoration:none;">mobilejanitorialsupply.com</a></div>
  <div style="border-top:1px solid #e5e7eb;margin:24px 0 14px 0;"></div>
  <div style="${font}font-size:11px;color:#9ca3af;">Google&apos;s #1 Rated &middot; Serving SoCal Since 1990</div>
</td></tr>

</table>
</td></tr></table>
</body>
</html>`,
    });
    return true;
  } catch (error) {
    console.error("[RESEND] Welcome email failed:", error);
    return false;
  }
}

/* ─────────────────────────────────────────────────────────────
   Replenishment ("Ready for a refill?") email
   ───────────────────────────────────────────────────────────── */
export interface ReplenishmentItem {
  sku: string;
  name: string;
  detail: string;      // e.g. "500 sheets per roll · 96 rolls per case"
  qty: number;
  unit: string;        // "case" / "each" / "gallon"
  image: string;
  slug: string;
}

export interface ReplenishmentEmailData {
  to: string;
  firstName: string;
  daysSince: number;
  lastOrderDate: string;      // "September 16, 2026"
  items: ReplenishmentItem[];
  reorderUrl: string;         // /cart/add?items=…
  itemUrl: (item: ReplenishmentItem) => string;
  unsubscribeUrl: string;
  preferencesUrl: string;
}

const esc = (s: string) => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const plural = (n: number, unit: string) => {
  if (unit === "each") return `Qty ${n}`;
  if (n === 1) return `1 ${unit}`;
  return `${n} ${unit === "box" ? "boxes" : unit + "s"}`;
};

export function renderReplenishmentEmail(d: ReplenishmentEmailData): { subject: string; html: string } {
  const site = "https://www.mobilejanitorialsupply.com";
  const font = "font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;";
  const subject = `Ready for a refill, ${d.firstName}? It's been ${d.daysSince} days`;

  const itemRows = d.items.slice(0, 8).map((it, i, arr) => `
<tr><td style="padding:12px 40px;${i < arr.length - 1 ? "border-bottom:1px solid #e5e7eb;" : ""}">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr>
    <td width="130" style="vertical-align:middle;padding-right:18px;">
      <a href="${site}/product/${esc(it.slug)}"><img src="${esc(it.image)}" width="130" alt="${esc(it.name)}" style="display:block;width:130px;height:auto;border:0;border-radius:4px;background:#f3f4f6;"></a>
    </td>
    <td style="vertical-align:middle;padding-right:16px;">
      <div style="${font}font-size:16px;font-weight:800;letter-spacing:-0.3px;color:#1a2340;line-height:1.2;">${esc(it.name)}</div>
      ${it.detail ? `<div style="${font}font-size:13px;color:#4a6ea0;margin-top:3px;">${esc(it.detail)}</div>` : ""}
      <div style="${font}font-size:13px;color:#6b7280;margin-top:6px;">Last ordered: <span style="font-weight:800;color:#1a2340;">${esc(plural(it.qty, it.unit))}</span></div>
    </td>
    <td width="150" align="right" style="vertical-align:middle;white-space:nowrap;">
      <table cellpadding="0" cellspacing="0" role="presentation" align="right"><tr>
        <td style="border:2px solid #e4282f;border-radius:3px;"><a href="${d.itemUrl(it)}" style="display:inline-block;${font}font-size:13px;font-weight:700;color:#e4282f;text-decoration:none;padding:8px 14px;">Reorder &rarr;</a></td>
      </tr></table>
    </td>
  </tr></table>
</td></tr>`).join("");

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background-color:#eef0f3;${font}">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#eef0f3;">
<tr><td align="center" style="padding:0;">
<table width="720" cellpadding="0" cellspacing="0" role="presentation" style="max-width:720px;width:100%;background:#ffffff;">

<!-- HEADER -->
<tr><td background="${site}/images/email-welcome-header-bg.jpg" bgcolor="#ffffff" style="background:#ffffff url('${site}/images/email-welcome-header-bg.jpg') no-repeat right top;background-size:100% 100%;padding:0;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr><td style="padding:22px 28px 0 0;text-align:right;${font}font-size:12px;font-weight:800;letter-spacing:2px;color:#ffffff;">TIME TO RESTOCK?</td></tr>
    <tr><td style="padding:14px 40px 34px 40px;">
      <div style="${font}font-size:13px;font-weight:800;letter-spacing:2.5px;color:#e4282f;margin-bottom:10px;">YOUR NEXT ORDER, MADE EASY</div>
      <div style="${font}font-size:66px;line-height:0.96;font-weight:900;letter-spacing:-2.5px;color:#1a2340;">Ready for<br>a refill?</div>
      <div style="${font}font-size:22px;font-weight:700;color:#1a2340;margin-top:22px;max-width:430px;line-height:1.2;">Hi ${esc(d.firstName)}, how&rsquo;s your supply holding up?</div>
      <div style="${font}font-size:16px;color:#6b7280;line-height:1.45;margin-top:6px;max-width:440px;">It&rsquo;s been ${d.daysSince} days since your last order.<br>Here&rsquo;s what you stocked up on.</div>
    </td></tr>
  </table>
</td></tr>

<!-- DAYS BAND -->
<tr><td style="padding:0 40px;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" bgcolor="#1a2340" style="background:#1a2340;"><tr>
    <td width="50%" style="padding:22px 28px;border-right:1px solid #3a4461;">
      <div style="${font}font-size:46px;font-weight:900;letter-spacing:-1.5px;color:#ffffff;line-height:1;">${d.daysSince} DAYS</div>
      <div style="${font}font-size:18px;color:#ffffff;margin-top:4px;">since your last order</div>
    </td>
    <td style="padding:22px 28px;">
      <div style="${font}font-size:12px;font-weight:800;letter-spacing:2px;color:#ffffff;">LAST ORDER</div>
      <div style="${font}font-size:24px;font-weight:700;color:#ffffff;margin-top:4px;">${esc(d.lastOrderDate)}</div>
    </td>
  </tr></table>
  <table cellpadding="0" cellspacing="0" role="presentation" style="margin-top:14px;"><tr>
    <td bgcolor="#e4282f" style="border-radius:3px;"><a href="${d.reorderUrl}" style="display:inline-block;${font}font-size:18px;font-weight:700;color:#ffffff;text-decoration:none;padding:13px 30px;">Review &amp; reorder &rarr;</a></td>
  </tr></table>
  <div style="${font}font-size:14px;color:#4a6ea0;margin-top:8px;">Adjust quantities before checkout.</div>
</td></tr>

<!-- LAST ORDER -->
<tr><td style="padding:30px 40px 6px 40px;">
  <div style="${font}font-size:40px;font-weight:900;letter-spacing:-1.5px;color:#1a2340;line-height:1;">Your last order.</div>
  <div style="${font}font-size:17px;color:#6b7280;margin-top:6px;">A familiar lineup. Ready when you are.</div>
</td></tr>
${itemRows}

<!-- KEEP STOCKED -->
<tr><td style="height:14px;line-height:14px;font-size:0;">&nbsp;</td></tr>
<tr><td bgcolor="#1a2340" style="background:#1a2340;padding:32px 40px;">
  <div style="${font}font-size:38px;font-weight:900;letter-spacing:-1.5px;color:#ffffff;line-height:1;">Keep your business stocked.</div>
  <div style="${font}font-size:17px;color:#ffffff;margin-top:8px;">Bring your previous items into a new order and update what you need.</div>
  <table cellpadding="0" cellspacing="0" role="presentation" style="margin-top:18px;"><tr>
    <td bgcolor="#e4282f" style="border-radius:3px;"><a href="${d.reorderUrl}" style="display:inline-block;${font}font-size:18px;font-weight:700;color:#ffffff;text-decoration:none;padding:12px 30px;">Review &amp; reorder &rarr;</a></td>
  </tr></table>
  <div style="${font}font-size:14px;color:#c3c9d6;margin-top:10px;">Nothing is ordered until you check out.</div>
</td></tr>

<!-- NEED A HAND -->
<tr><td style="padding:26px 40px 18px 40px;">
  <div style="${font}font-size:34px;font-weight:900;letter-spacing:-1.2px;color:#1a2340;line-height:1;">Need a hand with your next order?</div>
  <div style="${font}font-size:17px;color:#6b7280;margin-top:6px;">Your team is one call away.</div>
</td></tr>
<tr><td bgcolor="#e4282f" style="background:#e4282f;padding:16px 40px;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr>
    <td style="vertical-align:middle;white-space:nowrap;"><a href="tel:7147792640" style="${font}font-size:34px;font-weight:900;letter-spacing:-1px;color:#ffffff;text-decoration:none;">&#9742;&nbsp; (714) 779-2640</a></td>
    <td style="vertical-align:middle;padding-left:24px;border-left:1px solid rgba(255,255,255,0.45);${font}font-size:13px;color:#ffffff;">Mon&ndash;Fri &middot; 6:30 AM &ndash; 3:00 PM PT</td>
  </tr></table>
</td></tr>

<!-- FOOTER -->
<tr><td style="padding:26px 40px 24px 40px;text-align:center;">
  <img src="${site}/images/email-welcome-logo.png" width="200" alt="When supplies are running low… call Mobile Janitorial Supply! 714-779-2640" style="display:block;width:200px;height:auto;border:0;margin:0 auto 12px auto;">
  <div style="${font}font-size:20px;font-weight:800;color:#1a2340;">Mobile Janitorial Supply</div>
  <div style="${font}font-size:14px;color:#1a2340;margin-top:4px;">Serving Southern California since 1990</div>
  <div style="${font}font-size:14px;color:#1a2340;margin-top:10px;">3066 E. La Palma Ave, Anaheim, CA 92806</div>
  <div style="${font}font-size:14px;color:#6b7280;margin-top:2px;">orders@mobilejanitorialsupply.com</div>
  <div style="margin-top:8px;"><a href="${site}" style="${font}font-size:16px;font-weight:800;color:#e4282f;text-decoration:none;">mobilejanitorialsupply.com</a></div>
  <div style="border-top:1px solid #e5e7eb;margin:20px 0 12px 0;"></div>
  <div style="${font}font-size:11px;color:#9ca3af;">
    <a href="${d.preferencesUrl}" style="color:#6b7280;text-decoration:none;">Manage email preferences</a> &middot; <a href="${d.unsubscribeUrl}" style="color:#6b7280;text-decoration:none;">Unsubscribe</a>
  </div>
  <div style="${font}font-size:11px;color:#9ca3af;margin-top:6px;">You&rsquo;re receiving this because you have an account with Mobile Janitorial Supply.</div>
</td></tr>

</table>
</td></tr></table>
</body>
</html>`;
  return { subject, html };
}

export async function sendReplenishmentEmail(d: ReplenishmentEmailData): Promise<boolean> {
  const { subject, html } = renderReplenishmentEmail(d);
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const res = await resend.emails.send({
      from: FROM_ADDRESS,
      to: d.to,
      replyTo: "orders@mobilejanitorialsupply.com",
      subject,
      html,
      headers: { "List-Unsubscribe": `<${d.unsubscribeUrl}>` },
    });
    if (res.error) { console.error("[RESEND] Replenishment email failed:", res.error); return false; }
    return true;
  } catch (error) {
    console.error("[RESEND] Replenishment email failed:", error);
    return false;
  }
}
