import { NextRequest, NextResponse } from "next/server";
import { markOptOut, verifyUnsubscribeSig } from "@/lib/review-request";

export const dynamic = "force-dynamic";

function page(title: string, body: string) {
  return new NextResponse(
    `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head>
<body style="margin:0;padding:40px 16px;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:480px;margin:0 auto;background:#fff;border-radius:14px;padding:32px;text-align:center;">
<h1 style="font-size:20px;color:#1a1a2e;margin:0 0 10px;">${title}</h1>
<p style="font-size:14px;color:#666;line-height:1.6;margin:0;">${body}</p>
<p style="margin-top:22px;"><a href="https://www.mobilejanitorialsupply.com" style="color:#dc2626;font-weight:700;text-decoration:none;">Back to mobilejanitorialsupply.com</a></p>
</div></body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}

// One-click unsubscribe from review requests (signed link from the email)
export async function GET(req: NextRequest) {
  const customerId = Number(req.nextUrl.searchParams.get("customerId"));
  const sig = req.nextUrl.searchParams.get("sig") || "";
  if (!customerId || !verifyUnsubscribeSig(customerId, sig)) {
    return page("Link not valid", "This unsubscribe link isn't valid. Email orders@mobilejanitorialsupply.com and we'll take care of it.");
  }
  const ok = await markOptOut(customerId);
  return ok
    ? page("You're unsubscribed", "We won't ask you for a review again. Order confirmations and delivery updates are unaffected.")
    : page("Something went wrong", "We couldn't update your preferences. Email orders@mobilejanitorialsupply.com and we'll take care of it.");
}

// RFC 8058 one-click unsubscribe (mail clients POST to the List-Unsubscribe URL)
export async function POST(req: NextRequest) {
  return GET(req);
}
