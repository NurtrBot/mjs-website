import { NextRequest, NextResponse } from "next/server";
import { getCustomerById, updateCustomer } from "@/lib/bigcommerce";
import { approvalSignature, isPendingTerms } from "@/lib/customer-terms";
import { sendStaffEmail, staffEmailHtml } from "@/lib/staff-notify";
import { rateLimit } from "@/lib/rate-limit";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.mobilejanitorialsupply.com";

// POST — a pending-terms customer asks for Net-30. Marks the customer record and emails staff
// with a one-click approve link.
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const limit = rateLimit(ip, "terms-request", 5, 60 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  try {
    const body = await req.json();
    const customerId = Number(body.customerId);
    const message = String(body.message || "").slice(0, 500);
    if (!customerId) return NextResponse.json({ error: "Missing customer ID" }, { status: 400 });

    const customer = await getCustomerById(customerId);
    if (!customer) return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    if (!isPendingTerms(customer.customer_group_id)) {
      return NextResponse.json({ success: true, alreadyApproved: true });
    }

    const notes = customer.notes || "";
    if (notes.includes("[TERMS_REQUESTED")) {
      return NextResponse.json({ success: true, alreadyRequested: true });
    }

    const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    await updateCustomer(customerId, { notes: `${notes} [TERMS_REQUESTED:${today}]`.trim() });

    const storeHash = process.env.BIGCOMMERCE_STORE_HASH!;
    const approveUrl = `${SITE_URL}/api/customers/terms-approve?customerId=${customerId}&sig=${approvalSignature(customerId)}`;
    const hasTaxId = notes.includes("[TAX_ID_UPLOADED]");
    const taxId = notes.match(/\[TAX_ID_NUMBER:(.*?)\]/)?.[1];

    const emailed = await sendStaffEmail({
      subject: `Net-30 terms request: ${customer.company || `${customer.first_name} ${customer.last_name}`}`,
      replyTo: customer.email,
      html: staffEmailHtml({
        heading: "NET-30 TERMS REQUEST",
        intro: "A new website customer is asking for Bill to Account terms. Approving moves them out of the New Customer group so Bill to Account appears at checkout.",
        rows: [
          ["Company", customer.company || "—"],
          ["Customer", `${customer.first_name} ${customer.last_name}`],
          ["Email", customer.email],
          ["Phone", customer.phone || "—"],
          ["Tax ID on file", hasTaxId ? (taxId || "Yes") : "No"],
          ["Account created", new Date(customer.date_created).toLocaleDateString("en-US")],
          ["Customer ID", String(customerId)],
          ...(message ? [["Message", message] as [string, string]] : []),
        ],
        button: { label: "Approve Net-30 Terms", url: approveUrl },
        footnote: `To review first, open the customer in BigCommerce: https://store-${storeHash}.mybigcommerce.com/manage/customers/${customerId}/edit — or change their Customer Group there to approve manually.`,
      }),
    });

    return NextResponse.json({ success: true, emailed });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
