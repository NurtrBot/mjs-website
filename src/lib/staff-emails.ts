import { staffEmailHtml } from "@/lib/staff-notify";
import { SITE } from "@/lib/sds";

/*
 * Builders for the emails the office receives from the website. Each returns
 * { subject, html, replyTo } for sendStaffEmail. /api/staff-email/preview
 * renders samples of all of them.
 */

const bcCustomerUrl = (customerId: number | string) =>
  `https://store-${process.env.BIGCOMMERCE_STORE_HASH}.mybigcommerce.com/manage/customers/${customerId}/edit`;

/* ── Tax ID submitted ── */
export function taxIdEmail(info: { customerId: number; customerName: string; customerEmail: string; companyName: string; taxIdNumber: string; uploadDate: string }) {
  const who = info.companyName || info.customerName;
  return {
    subject: `Tax ID submitted: ${who}`,
    replyTo: info.customerEmail || undefined,
    html: staffEmailHtml({
      eyebrow: "TAX ID SUBMITTED",
      headline: `${who} is now tax exempt.`,
      intro: `${info.customerName}${info.companyName ? ` at ${info.companyName}` : ""} entered a tax ID on the website. Their account has been marked tax exempt, so please verify the resale certificate.`,
      rows: [
        ["Company", info.companyName || "—"],
        ["Customer", info.customerName],
        ["Email", info.customerEmail || "—"],
        ["Tax ID", info.taxIdNumber],
        ["Submitted", info.uploadDate],
        ["Customer #", String(info.customerId)],
      ],
      action: { text: "Verify the certificate on the customer record", label: "Open in BigCommerce", url: bcCustomerUrl(info.customerId) },
    }),
  };
}

/* ── SDS request ── */
export function sdsRequestEmail(b: { sku: string; productName?: string; image?: string | null; slug?: string | null; customerId?: number | string; email?: string; name?: string; company?: string }) {
  const sku = String(b.sku || "").slice(0, 40);
  const productName = String(b.productName || sku).slice(0, 160);
  const name = String(b.name || "").trim();
  const firstName = name.split(" ")[0] || "This customer";
  const company = String(b.company || "").trim();
  const email = String(b.email || "").trim();
  const rows: [string, string][] = [["Requested by", name || "Signed-in customer"]];
  if (company) rows.push(["Company", company]);
  if (email) rows.push(["Email", email]);
  if (b.customerId) rows.push(["Customer #", String(b.customerId)]);
  return {
    subject: `SDS request: ${productName} (${sku})`,
    replyTo: email || undefined,
    html: staffEmailHtml({
      eyebrow: "SDS REQUEST",
      headline: `${firstName} needs a sheet.`,
      intro: `${name || "A customer"}${company ? ` at ${company}` : ""} asked for the safety data sheet for a chemical they bought. We don't have a verified sheet linked to it yet.`,
      rows,
      item: {
        image: b.image || `${SITE}/images/placeholder-product.svg`,
        title: productName,
        subtitle: `Item ${sku} &middot; <span style="color:#B01A20;font-weight:700;">No sheet on file</span>`,
        button: b.slug ? { label: "Open product", url: `${SITE}/product/${b.slug}` } : undefined,
      },
      action: email
        ? { text: `Send ${firstName} the sheet at ${email}`, label: `Reply to ${firstName}`, url: `mailto:${email}?subject=${encodeURIComponent(`Your SDS for ${productName}`)}` }
        : undefined,
      footnote: `Once the PDF is saved as public/sds/${sku}.PDF and added to the SDS index, it shows in the customer's SDS Binder and in every future order email.`,
    }),
  };
}

/* ── Net-30 credit application ── */
export interface CreditApplicationSummary {
  legalName: string; dba?: string; structure: string; ein: string; contact: string; phone: string; email: string;
  apContact: string; apEmail: string; requestedLimit?: string; initialOrder?: string;
  refs: { name: string; contact: string; phone?: string; email?: string }[];
  signer: string; signerTitle: string;
}
export function creditApplicationEmail(app: CreditApplicationSummary, customerId: number, approveUrl: string, taxIdOnFile: boolean) {
  const refs = app.refs.filter(r => r.name);
  return {
    subject: `Credit application: ${app.legalName}`,
    replyTo: app.email || undefined,
    html: staffEmailHtml({
      eyebrow: "NET-30 CREDIT APPLICATION",
      headline: `${app.legalName} applied for terms.`,
      intro: `${app.contact} completed the credit application on the website. The filled PDF is attached, and the full details are saved in the customer's notes in BigCommerce. Approving moves them out of the New Customer group so Bill to Account appears at checkout.`,
      rows: [
        ["Legal name", app.legalName + (app.dba ? ` (DBA ${app.dba})` : "")],
        ["Structure", app.structure],
        ["EIN", app.ein],
        ["Tax ID on file", taxIdOnFile ? "Yes" : "No"],
        ["Contact", `${app.contact} · ${app.phone}`],
        ["Email", app.email],
        ["AP contact", `${app.apContact} · ${app.apEmail}`],
        ["Requested limit", app.requestedLimit || "—"],
        ["Initial order", app.initialOrder || "—"],
        ...refs.map((r, i) => [`Reference ${i + 1}`, `${r.name} · ${r.contact} · ${r.phone || r.email || ""}`] as [string, string]),
        ["Signed by", `${app.signer}, ${app.signerTitle}`],
        ["Customer #", String(customerId)],
      ],
      action: { text: "Everything checks out?", label: "Approve Net-30 terms", url: approveUrl },
      footnote: `To review first, open the customer in BigCommerce (${bcCustomerUrl(customerId)}) or change their Customer Group there to approve manually.`,
    }),
  };
}
