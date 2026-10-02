import { createHmac, timingSafeEqual } from "crypto";

// New website signups land in this BigCommerce customer group (see createCustomer in bigcommerce.ts).
// While a customer is in it, checkout offers credit card only — no Bill to Account.
export const PENDING_TERMS_GROUP_ID = 708;

// Group a customer moves to when terms are approved (0 = no group; staff can assign pricing later)
export const APPROVED_TERMS_GROUP_ID = 0;

export function isPendingTerms(customerGroupId: number | null | undefined): boolean {
  return customerGroupId === PENDING_TERMS_GROUP_ID;
}

// Signed one-click approval links in the staff email
function approvalSecret(): string {
  return process.env.TERMS_APPROVAL_SECRET || process.env.BIGCOMMERCE_CLIENT_SECRET || process.env.BIGCOMMERCE_ACCESS_TOKEN || "";
}

export function approvalSignature(customerId: number): string {
  return createHmac("sha256", approvalSecret()).update(`terms-approve:${customerId}`).digest("hex");
}

export function verifyApprovalSignature(customerId: number, sig: string): boolean {
  const expected = Buffer.from(approvalSignature(customerId));
  const given = Buffer.from(sig || "");
  return expected.length === given.length && timingSafeEqual(expected, given);
}
