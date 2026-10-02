import { NextRequest, NextResponse } from "next/server";
import { getCustomerByEmail } from "@/lib/bigcommerce";
import { createResetToken } from "@/lib/password-reset";
import { sendPasswordResetEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.mobilejanitorialsupply.com";

// POST { email } — emails a signed reset link. Always responds success so the form
// can't be used to discover which emails have accounts.
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  const { allowed, retryAfterMs } = rateLimit(ip, "forgot-password", 5, 15 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: `Too many attempts. Please try again in ${Math.ceil(retryAfterMs / 60000)} minutes.` },
      { status: 429 }
    );
  }

  try {
    const { email } = await req.json();
    const cleanEmail = String(email || "").trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
    }

    const customer = await getCustomerByEmail(cleanEmail) as { id: number; first_name?: string; email: string; date_modified: string } | null;
    if (customer?.id) {
      const token = createResetToken(customer.id, customer.date_modified);
      const resetUrl = `${SITE_URL}/auth/reset?token=${encodeURIComponent(token)}`;
      const sent = await sendPasswordResetEmail(customer.email, customer.first_name || "", resetUrl);
      if (!sent) console.error(`[FORGOT_PASSWORD] Email failed for customer ${customer.id}`);
    } else {
      console.log(`[FORGOT_PASSWORD] No account for ${cleanEmail}`);
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
