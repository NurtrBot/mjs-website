import { NextRequest, NextResponse } from "next/server";
import { createSession, getSession } from "@/lib/delivery-store";
import crypto from "crypto";

const RESEND_KEY = process.env.RESEND_API_KEY;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.714supply.com";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      orderId,
      invoiceNumber,
      customerName,
      customerEmail,
      deliveryAddress,
      deliveryLat,
      deliveryLng,
      driverName,
      driverId,
      driverPhone,
      driverPhoto,
      driverLat,
      driverLng,
      vehicleName,
      vehiclePlate,
      estimatedMinutes,
      stopsAway,
      items,
    } = body;

    if (!orderId || !customerEmail || !driverName || !deliveryAddress) {
      return NextResponse.json({ error: "Missing required fields: orderId, customerEmail, driverName, deliveryAddress" }, { status: 400 });
    }

    // Generate unique tracking token
    const token = crypto.randomBytes(16).toString("hex");
    const now = Date.now();

    createSession({
      token,
      orderId,
      invoiceNumber: invoiceNumber || orderId,
      customerName: customerName || "Customer",
      customerEmail,
      deliveryAddress,
      deliveryLat: deliveryLat || 0,
      deliveryLng: deliveryLng || 0,
      driverName,
      driverId: driverId || "",
      driverPhone: driverPhone || "",
      driverPhoto: driverPhoto || "",
      driverLat: driverLat || 0,
      driverLng: driverLng || 0,
      vehicleName: vehicleName || "MJS Delivery Van",
      vehiclePlate: vehiclePlate || "",
      status: "en_route",
      createdAt: now,
      updatedAt: now,
      estimatedMinutes: estimatedMinutes || undefined,
      stopsAway: stopsAway ?? undefined,
      items: items || [],
    });

    const trackingUrl = `${SITE_URL}/track?token=${token}`;

    // Send email via Resend
    if (RESEND_KEY) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Mobile Janitorial Supply <orders@updates.mobilejanitorialsupply.com>",
          to: [customerEmail],
          subject: `Your MJS order is on the way! 🚛`,
          html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;background:#ffffff;">
    <!-- Header -->
    <tr>
      <td style="background:#1a1a2e;padding:24px 32px;text-align:center;">
        <h1 style="margin:0;color:#ffffff;font-size:18px;font-weight:800;letter-spacing:0.5px;">MOBILE JANITORIAL SUPPLY</h1>
      </td>
    </tr>
    <!-- Body -->
    <tr>
      <td style="padding:32px;">
        <h2 style="margin:0 0 8px;color:#1a1a2e;font-size:22px;font-weight:800;">Your order is on the way!</h2>
        <p style="margin:0 0 24px;color:#666;font-size:14px;line-height:1.6;">
          Hi ${customerName || "there"}, <strong>${driverName}</strong> is headed your way with your delivery.
        </p>

        <!-- Track Button -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align:center;padding:0 0 24px;">
              <a href="${trackingUrl}" style="display:inline-block;background:#dc2626;color:#ffffff;font-weight:700;font-size:15px;padding:14px 40px;border-radius:8px;text-decoration:none;">
                Track Your Delivery Live
              </a>
            </td>
          </tr>
        </table>

        <!-- Order Details -->
        <table width="100%" style="background:#f8f8f8;border-radius:8px;padding:16px;" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:12px 16px;border-bottom:1px solid #eee;">
              <span style="color:#999;font-size:11px;text-transform:uppercase;letter-spacing:1px;">Order</span><br>
              <span style="color:#1a1a2e;font-size:14px;font-weight:600;">#${invoiceNumber || orderId}</span>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 16px;border-bottom:1px solid #eee;">
              <span style="color:#999;font-size:11px;text-transform:uppercase;letter-spacing:1px;">Driver</span><br>
              <span style="color:#1a1a2e;font-size:14px;font-weight:600;">${driverName}</span>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 16px;">
              <span style="color:#999;font-size:11px;text-transform:uppercase;letter-spacing:1px;">Delivering To</span><br>
              <span style="color:#1a1a2e;font-size:14px;font-weight:600;">${deliveryAddress}</span>
            </td>
          </tr>
        </table>

        <p style="margin:24px 0 0;color:#999;font-size:12px;text-align:center;">
          Questions? Call us at <a href="tel:7147792640" style="color:#dc2626;text-decoration:none;font-weight:600;">(714) 779-2640</a>
        </p>
      </td>
    </tr>
    <!-- Footer -->
    <tr>
      <td style="background:#f8f8f8;padding:16px 32px;text-align:center;border-top:1px solid #eee;">
        <p style="margin:0;color:#999;font-size:11px;">Mobile Janitorial Supply &middot; 3066 E. La Palma Ave, Anaheim, CA 92806</p>
      </td>
    </tr>
  </table>
</body>
</html>`,
        }),
      });
    }

    return NextResponse.json({
      success: true,
      token,
      trackingUrl,
    });
  } catch (error: unknown) {
    console.error("Enroute error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
