import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { orderId, customerName, companyName, email, paymentMethod, fulfillment, itemCount, notes } = await req.json();

    // Check if SMTP is configured
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = Number(process.env.SMTP_PORT) || 587;
    const notifyEmail = process.env.NOTIFY_EMAIL || "orders@mobilejanitorialsupply.com";

    if (!smtpUser || !smtpPass) {
      console.log(`[NEW ORDER EMAIL] SMTP not configured. Order MJS-${orderId} from ${customerName} (${email})`);
      return NextResponse.json({ sent: false, reason: "SMTP not configured" });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });

    const paymentLabel = paymentMethod === "bill" ? "Bill to Account" : paymentMethod === "cash" ? "Cash on Pickup" : "Credit Card";
    const fulfillmentLabel = fulfillment === "pickup" ? "Will Call Pickup" : "Delivery";

    await transporter.sendMail({
      from: `"MJS Website" <${smtpUser}>`,
      to: notifyEmail,
      subject: `New Order MJS-${orderId} — ${customerName}${companyName ? ` (${companyName})` : ""}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1a1a2e; color: white; padding: 20px 24px; border-radius: 12px 12px 0 0;">
            <h1 style="margin: 0; font-size: 20px;">New Order Received</h1>
            <p style="margin: 4px 0 0; color: #ccc; font-size: 14px;">From your website — MobileJanitorialSupply.com</p>
          </div>
          <div style="background: white; border: 1px solid #eee; padding: 24px; border-radius: 0 0 12px 12px;">
            <div style="background: #f8f9fa; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
              <h2 style="margin: 0 0 4px; color: #dc2626; font-size: 24px;">MJS-${orderId}</h2>
              <p style="margin: 0; color: #666; font-size: 13px;">${new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
            </div>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 8px 0; color: #888; width: 140px;">Customer</td>
                <td style="padding: 8px 0; font-weight: 600;">${customerName}</td>
              </tr>
              ${companyName ? `<tr><td style="padding: 8px 0; color: #888;">Company</td><td style="padding: 8px 0; font-weight: 600;">${companyName}</td></tr>` : ""}
              <tr>
                <td style="padding: 8px 0; color: #888;">Email</td>
                <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #dc2626;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #888;">Payment</td>
                <td style="padding: 8px 0; font-weight: 600;">${paymentLabel}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #888;">Fulfillment</td>
                <td style="padding: 8px 0; font-weight: 600;">${fulfillmentLabel}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #888;">Items</td>
                <td style="padding: 8px 0; font-weight: 600;">${itemCount} product${itemCount !== 1 ? "s" : ""}</td>
              </tr>
              ${notes ? `<tr><td style="padding: 8px 0; color: #888;">Notes</td><td style="padding: 8px 0;">${notes}</td></tr>` : ""}
            </table>
            <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #eee; text-align: center;">
              <a href="https://store-wujf5nuxy5.mybigcommerce.com/manage/orders/${orderId}" style="display: inline-block; background: #dc2626; color: white; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">View in BigCommerce</a>
            </div>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ sent: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[NEW ORDER EMAIL] Failed:", message);
    return NextResponse.json({ sent: false, error: message });
  }
}
