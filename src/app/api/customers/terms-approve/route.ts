import { NextRequest, NextResponse } from "next/server";
import { getCustomerById, updateCustomer } from "@/lib/bigcommerce";
import { APPROVED_TERMS_GROUP_ID, isPendingTerms, verifyApprovalSignature } from "@/lib/customer-terms";
import { escapeHtml } from "@/lib/staff-notify";

function page(title: string, body: string, ok: boolean) {
  return new NextResponse(
    `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:40px 16px;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:480px;margin:0 auto;background:#fff;border-radius:14px;padding:32px;text-align:center;">
<div style="font-size:40px;margin-bottom:12px;">${ok ? "&#9989;" : "&#10060;"}</div>
<h1 style="font-size:20px;color:#1a1a2e;margin:0 0 10px;">${escapeHtml(title)}</h1>
<p style="font-size:14px;color:#666;line-height:1.6;margin:0;">${body}</p>
</div></body></html>`,
    { status: ok ? 200 : 400, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}

// GET — one-click approval link from the staff email. Signed so it can't be guessed.
export async function GET(req: NextRequest) {
  const customerId = Number(req.nextUrl.searchParams.get("customerId"));
  const sig = req.nextUrl.searchParams.get("sig") || "";

  if (!customerId || !verifyApprovalSignature(customerId, sig)) {
    return page("Invalid approval link", "This link is not valid. Open the customer in BigCommerce and change their Customer Group instead.", false);
  }

  const customer = await getCustomerById(customerId);
  if (!customer) return page("Customer not found", `No customer with ID ${customerId} exists in BigCommerce.`, false);

  const name = escapeHtml(customer.company || `${customer.first_name} ${customer.last_name}`);
  if (!isPendingTerms(customer.customer_group_id)) {
    return page("Already approved", `${name} is no longer in the New Customer group. Bill to Account is available to them at checkout.`, true);
  }

  const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  try {
    await updateCustomer(customerId, {
      customer_group_id: APPROVED_TERMS_GROUP_ID,
      notes: `${customer.notes || ""} [TERMS_APPROVED:${today}]`.trim(),
    });
  } catch (err) {
    console.error(`[TERMS] Failed to approve customer ${customerId}:`, err);
    return page("Approval failed", "BigCommerce rejected the update. Open the customer in BigCommerce and change their Customer Group manually.", false);
  }

  return page("Net-30 terms approved", `${name} can now choose Bill to Account at checkout. You can assign their pricing group in BigCommerce whenever you're ready.`, true);
}
