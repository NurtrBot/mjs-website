import { NextRequest, NextResponse } from "next/server";
import { taxIdEmail, sdsRequestEmail, creditApplicationEmail } from "@/lib/staff-emails";

/*
 * GET /api/staff-email/preview?kind=tax|sds|credit&secret=CRON_SECRET
 * Renders a sample of each office notification (HTML, nothing is sent).
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.nextUrl.searchParams.get("secret") !== secret) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const kind = req.nextUrl.searchParams.get("kind") || "tax";
  let html = "";
  if (kind === "tax") {
    html = taxIdEmail({ customerId: 4171, customerName: "Maria Lopez", customerEmail: "maria@brightsidecleaning.com", companyName: "Bright Side Cleaning", taxIdNumber: "SR KH 97-123456", uploadDate: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) }).html;
  } else if (kind === "sds") {
    html = sdsRequestEmail({
      sku: "41212EA", productName: "Shower Sauce Bathroom Cleaner, 32 OZ", slug: "janitors-finest-shower-sauce-bathroom-cleaner-32-oz-41212ea",
      image: "https://cdn11.bigcommerce.com/s-wujf5nuxy5/products/12111/images/371490/3158__89980.1777928596.1280.1280.png?c=1",
      name: "Maria Lopez", company: "Bright Side Cleaning", email: "maria@brightsidecleaning.com", customerId: 4171,
    }).html;
  } else if (kind === "credit") {
    html = creditApplicationEmail({
      legalName: "Bright Side Cleaning LLC", dba: "Bright Side", structure: "LLC", ein: "12-3456789", contact: "Maria Lopez", phone: "(714) 555-0142", email: "maria@brightsidecleaning.com",
      apContact: "Luis Ortega", apEmail: "ap@brightsidecleaning.com", requestedLimit: "$5,000", initialOrder: "$1,200",
      refs: [{ name: "Waxie Sanitary Supply", contact: "Dan Reyes", phone: "(949) 555-0190" }, { name: "Uline", contact: "Accounts", email: "ar@uline.com" }],
      signer: "Maria Lopez", signerTitle: "Owner",
    }, 4171, "https://www.mobilejanitorialsupply.com/api/customers/terms-approve?customerId=4171&sig=sample", true).html;
  } else {
    return NextResponse.json({ error: "kind must be tax, sds or credit" }, { status: 400 });
  }
  return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
