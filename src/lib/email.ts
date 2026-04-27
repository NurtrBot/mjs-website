import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(to: string, firstName: string, lastName: string, email: string) {
  try {
    await resend.emails.send({
      from: "Mobile Janitorial Supply <onboarding@resend.dev>",
      to,
      subject: `Welcome to Mobile Janitorial Supply, ${firstName}!`,
      html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;">
<tr><td align="center" style="padding:24px 12px;">
<table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;">

<!-- HERO -->
<tr><td style="background-color:#1a1a2e;border-radius:14px 14px 0 0;padding:36px 32px 30px;text-align:center;">
<div style="font-size:40px;margin-bottom:8px;">&#127881;</div>
<div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#dc2626;margin-bottom:8px;">Welcome to the Family</div>
<div style="font-size:28px;font-weight:900;color:#ffffff;line-height:1.25;">Welcome, ${firstName}!</div>
<div style="font-size:14px;color:#d1d5db;margin-top:10px;line-height:1.6;font-weight:600;max-width:440px;margin-left:auto;margin-right:auto;">Your account at Mobile Janitorial Supply is all set. You now have access to wholesale pricing, order tracking, and fast reordering.</div>
</td></tr>

<!-- ACCOUNT DETAILS -->
<tr><td style="background-color:#ffffff;padding:24px 32px;border-bottom:1px solid #eee;">
<div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;color:#dc2626;margin-bottom:14px;">
<span style="display:inline-block;width:3px;height:12px;background:#dc2626;border-radius:2px;vertical-align:middle;margin-right:5px;"></span>Your Account</div>
<table cellpadding="0" cellspacing="0" style="width:100%;background:#f9fafb;border-radius:10px;padding:16px;">
<tr><td style="padding:12px 16px;">
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td style="font-size:12px;color:#6b7280;padding:4px 0;">Name</td><td align="right" style="font-size:12px;font-weight:700;color:#1a1a2e;padding:4px 0;">${firstName} ${lastName}</td></tr>
<tr><td style="font-size:12px;color:#6b7280;padding:4px 0;">Email</td><td align="right" style="font-size:12px;font-weight:700;color:#1a1a2e;padding:4px 0;">${email}</td></tr>
<tr><td style="font-size:12px;color:#6b7280;padding:4px 0;">Account Status</td><td align="right" style="font-size:12px;font-weight:700;color:#059669;padding:4px 0;">&#10003; Active</td></tr>
</table>
</td></tr></table>
</td></tr>

<!-- WHAT YOU GET -->
<tr><td style="background-color:#ffffff;padding:24px 32px;border-bottom:1px solid #eee;">
<div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;color:#dc2626;margin-bottom:16px;">
<span style="display:inline-block;width:3px;height:12px;background:#dc2626;border-radius:2px;vertical-align:middle;margin-right:5px;"></span>What You Get</div>
<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center" width="25%" style="padding:8px;vertical-align:top;">
<div style="width:44px;height:44px;background:#fef2f2;border-radius:12px;text-align:center;line-height:44px;margin:0 auto 8px;font-size:20px;">&#128176;</div>
<div style="font-size:11px;font-weight:700;color:#1a1a2e;">Wholesale Pricing</div>
<div style="font-size:9px;color:#9ca3af;margin-top:2px;">Best prices on 10K+ products</div>
</td>
<td align="center" width="25%" style="padding:8px;vertical-align:top;">
<div style="width:44px;height:44px;background:#fef2f2;border-radius:12px;text-align:center;line-height:44px;margin:0 auto 8px;font-size:20px;">&#128666;</div>
<div style="font-size:11px;font-weight:700;color:#1a1a2e;">Free Delivery</div>
<div style="font-size:9px;color:#9ca3af;margin-top:2px;">On orders $399+ in SoCal</div>
</td>
<td align="center" width="25%" style="padding:8px;vertical-align:top;">
<div style="width:44px;height:44px;background:#fef2f2;border-radius:12px;text-align:center;line-height:44px;margin:0 auto 8px;font-size:20px;">&#128203;</div>
<div style="font-size:11px;font-weight:700;color:#1a1a2e;">Net-30 Terms</div>
<div style="font-size:9px;color:#9ca3af;margin-top:2px;">For qualified businesses</div>
</td>
<td align="center" width="25%" style="padding:8px;vertical-align:top;">
<div style="width:44px;height:44px;background:#fef2f2;border-radius:12px;text-align:center;line-height:44px;margin:0 auto 8px;font-size:20px;">&#128260;</div>
<div style="font-size:11px;font-weight:700;color:#1a1a2e;">Easy Reorder</div>
<div style="font-size:9px;color:#9ca3af;margin-top:2px;">One-click from dashboard</div>
</td>
</tr></table>
</td></tr>

<!-- GET STARTED -->
<tr><td style="background-color:#ffffff;padding:24px 32px;border-bottom:1px solid #eee;">
<div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;color:#dc2626;margin-bottom:16px;">
<span style="display:inline-block;width:3px;height:12px;background:#dc2626;border-radius:2px;vertical-align:middle;margin-right:5px;"></span>Get Started in 3 Steps</div>
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td style="padding:10px 0;border-bottom:1px solid #f5f5f5;">
<table cellpadding="0" cellspacing="0"><tr>
<td style="width:28px;vertical-align:top;"><div style="width:24px;height:24px;background:#dc2626;border-radius:50%;text-align:center;line-height:24px;color:#fff;font-size:11px;font-weight:800;">1</div></td>
<td style="padding-left:10px;"><div style="font-size:13px;font-weight:700;color:#1a1a2e;">Add your shipping address</div><div style="font-size:11px;color:#6b7280;">Set up delivery locations for faster checkout</div></td>
</tr></table></td></tr>
<tr><td style="padding:10px 0;border-bottom:1px solid #f5f5f5;">
<table cellpadding="0" cellspacing="0"><tr>
<td style="width:28px;vertical-align:top;"><div style="width:24px;height:24px;background:#dc2626;border-radius:50%;text-align:center;line-height:24px;color:#fff;font-size:11px;font-weight:800;">2</div></td>
<td style="padding-left:10px;"><div style="font-size:13px;font-weight:700;color:#1a1a2e;">Upload your Tax ID (if applicable)</div><div style="font-size:11px;color:#6b7280;">Submit your resale certificate for tax-exempt purchasing</div></td>
</tr></table></td></tr>
<tr><td style="padding:10px 0;">
<table cellpadding="0" cellspacing="0"><tr>
<td style="width:28px;vertical-align:top;"><div style="width:24px;height:24px;background:#dc2626;border-radius:50%;text-align:center;line-height:24px;color:#fff;font-size:11px;font-weight:800;">3</div></td>
<td style="padding-left:10px;"><div style="font-size:13px;font-weight:700;color:#1a1a2e;">Place your first order</div><div style="font-size:11px;color:#6b7280;">Browse our catalog and start saving</div></td>
</tr></table></td></tr>
</table>
</td></tr>

<!-- CTA -->
<tr><td style="background-color:#dc2626;padding:28px 32px;text-align:center;">
<div style="font-size:16px;font-weight:800;color:#ffffff;margin-bottom:18px;">Start shopping at wholesale prices</div>
<table cellpadding="0" cellspacing="0" style="margin:0 auto;">
<tr><td style="background:#ffffff;border-radius:8px;padding:12px 32px;">
<a href="https://www.mobilejanitorialsupply.com" style="color:#dc2626;font-weight:700;font-size:14px;text-decoration:none;">Start Shopping &rarr;</a>
</td></tr></table>
</td></tr>

<!-- ACCOUNT TEAM -->
<tr><td style="background-color:#ffffff;padding:24px 32px;text-align:center;border-top:1px solid #eee;">
<div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;color:#dc2626;margin-bottom:12px;">Your Account Team</div>
<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center" width="33%" style="padding:6px;">
<div style="width:40px;height:40px;background:#dc2626;border-radius:50%;text-align:center;line-height:40px;margin:0 auto 6px;color:#fff;font-size:14px;font-weight:800;">RB</div>
<div style="font-size:11px;font-weight:700;color:#1a1a2e;">Ryan Bergman</div>
<div style="font-size:9px;color:#9ca3af;">ryan@mobilejanitorialsupply.com</div>
</td>
<td align="center" width="33%" style="padding:6px;">
<div style="width:40px;height:40px;background:#dc2626;border-radius:50%;text-align:center;line-height:40px;margin:0 auto 6px;color:#fff;font-size:14px;font-weight:800;">ZB</div>
<div style="font-size:11px;font-weight:700;color:#1a1a2e;">Zack Bergman</div>
<div style="font-size:9px;color:#9ca3af;">zack@mobilejanitorialsupply.com</div>
</td>
<td align="center" width="33%" style="padding:6px;">
<div style="width:40px;height:40px;background:#dc2626;border-radius:50%;text-align:center;line-height:40px;margin:0 auto 6px;color:#fff;font-size:14px;font-weight:800;">NB</div>
<div style="font-size:11px;font-weight:700;color:#1a1a2e;">Nick Bergman</div>
<div style="font-size:9px;color:#9ca3af;">nick@mobilejanitorialsupply.com</div>
</td>
</tr></table>
</td></tr>

<!-- NEED HELP -->
<tr><td style="background-color:#ffffff;padding:22px 32px;text-align:center;border-top:1px solid #eee;">
<div style="font-size:14px;font-weight:800;color:#1a1a2e;margin-bottom:5px;">We're here for you</div>
<div style="font-size:11px;color:#6b7280;margin-bottom:14px;">Questions? Give us a call.</div>
<table cellpadding="0" cellspacing="0" style="margin:0 auto;">
<tr><td style="border:1px solid #e5e7eb;border-radius:8px;padding:9px 24px;">
<a href="tel:7147792640" style="color:#1a1a2e;font-weight:700;font-size:13px;text-decoration:none;">&#9742; (714) 779-2640</a>
</td></tr></table>
<div style="font-size:9px;color:#9ca3af;margin-top:6px;">Mon-Fri &middot; 6:30 AM - 3:00 PM PST</div>
</td></tr>

<!-- FOOTER -->
<tr><td style="background-color:#1a1a2e;padding:20px 32px;border-radius:0 0 14px 14px;text-align:center;">
<div style="font-size:12px;font-weight:800;color:#ffffff;">MOBILE JANITORIAL SUPPLY</div>
<div style="font-size:9px;color:#6b7280;margin-top:2px;margin-bottom:10px;">Google's #1 Rated &middot; Serving SoCal Since 1990</div>
<div style="font-size:10px;color:#6b7280;line-height:1.5;">3066 E. La Palma Ave, Anaheim, CA 92806<br>(714) 779-2640 &middot; orders@mobilejanitorialsupply.com</div>
<div style="margin-top:12px;border-top:1px solid rgba(255,255,255,0.08);padding-top:10px;">
<a href="https://www.mobilejanitorialsupply.com" style="font-size:10px;color:#dc2626;text-decoration:none;font-weight:600;">mobilejanitorialsupply.com</a>
</div>
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
