import { NextRequest, NextResponse } from "next/server";
import { getCustomerById } from "@/lib/bigcommerce";
import { isPendingTerms } from "@/lib/customer-terms";

// GET — live check of whether a customer is still awaiting Net-30 approval.
// Read fresh from BigCommerce so an approval takes effect without re-logging in.
export async function GET(req: NextRequest) {
  const customerId = Number(req.nextUrl.searchParams.get("customerId"));
  if (!customerId) return NextResponse.json({ pending: false, requested: false });

  const customer = await getCustomerById(customerId);
  if (!customer) return NextResponse.json({ pending: false, requested: false });

  return NextResponse.json({
    pending: isPendingTerms(customer.customer_group_id),
    requested: (customer.notes || "").includes("[TERMS_REQUESTED"),
  });
}
