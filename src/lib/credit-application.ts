// Net-30 credit application — mirrors the fields in public/forms/credit-application.pdf

export interface CreditApplication {
  initialOrder: string;
  requestedLimit: string;
  legalName: string;
  dba: string;
  contact: string;
  phone: string;
  email: string;
  startDate: string;
  ein: string;
  duns: string;
  registeredAddress: string;
  billingAddress: string;
  shipAddress: string;
  apContact: string;
  apEmail: string;
  apPhone: string;
  structure: string;
  bankName: string;
  bankPhone: string;
  bankAddress: string;
  refs: { name: string; contact: string; email: string; phone: string; account: string }[];
  signer: string;
  signerTitle: string;
  certified: boolean;
}

export const EMPTY_REFERENCE = { name: "", contact: "", email: "", phone: "", account: "" };

export function emptyApplication(defaults?: Partial<CreditApplication>): CreditApplication {
  return {
    initialOrder: "", requestedLimit: "", legalName: "", dba: "", contact: "", phone: "", email: "",
    startDate: "", ein: "", duns: "", registeredAddress: "", billingAddress: "", shipAddress: "",
    apContact: "", apEmail: "", apPhone: "", structure: "", bankName: "", bankPhone: "", bankAddress: "",
    refs: [{ ...EMPTY_REFERENCE }, { ...EMPTY_REFERENCE }, { ...EMPTY_REFERENCE }],
    signer: "", signerTitle: "", certified: false,
    ...defaults,
  };
}

// Returns a list of problems; empty means valid
export function validateApplication(app: CreditApplication): string[] {
  const problems: string[] = [];
  const need = (v: string, label: string) => { if (!v || !v.trim()) problems.push(`${label} is required`); };
  need(app.legalName, "Legal business name");
  need(app.contact, "Primary contact");
  need(app.phone, "Phone");
  need(app.email, "Email");
  need(app.ein, "Federal tax ID / EIN");
  need(app.registeredAddress, "Registered business address");
  need(app.apContact, "Accounts payable contact");
  need(app.apEmail, "AP email");
  need(app.structure, "Business structure");
  const filledRefs = app.refs.filter(r => r.name.trim() && (r.phone.trim() || r.email.trim()));
  if (filledRefs.length < 2) problems.push("At least two trade references with a phone or email are required");
  need(app.signer, "Authorized signer name");
  need(app.signerTitle, "Signer title");
  if (!app.certified) problems.push("You must certify the application");
  return problems;
}

// Sanitize incoming JSON into a CreditApplication (strings trimmed and capped)
export function normalizeApplication(input: unknown): CreditApplication {
  const src = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const s = (v: unknown, max = 300) => String(v ?? "").trim().slice(0, max);
  const refsIn = Array.isArray(src.refs) ? src.refs.slice(0, 3) : [];
  const refs = [0, 1, 2].map(i => {
    const r = (refsIn[i] && typeof refsIn[i] === "object" ? refsIn[i] : {}) as Record<string, unknown>;
    return { name: s(r.name), contact: s(r.contact), email: s(r.email), phone: s(r.phone), account: s(r.account) };
  });
  return {
    initialOrder: s(src.initialOrder, 50), requestedLimit: s(src.requestedLimit, 50),
    legalName: s(src.legalName), dba: s(src.dba), contact: s(src.contact), phone: s(src.phone, 40), email: s(src.email),
    startDate: s(src.startDate, 50), ein: s(src.ein, 40), duns: s(src.duns, 40),
    registeredAddress: s(src.registeredAddress), billingAddress: s(src.billingAddress), shipAddress: s(src.shipAddress),
    apContact: s(src.apContact), apEmail: s(src.apEmail), apPhone: s(src.apPhone, 40),
    structure: s(src.structure, 100), bankName: s(src.bankName), bankPhone: s(src.bankPhone, 40), bankAddress: s(src.bankAddress),
    refs, signer: s(src.signer), signerTitle: s(src.signerTitle), certified: src.certified === true,
  };
}

// Staff-readable summary stored in the BigCommerce customer notes
export function applicationNotesSummary(app: CreditApplication, date: string): string {
  const refs = app.refs.filter(r => r.name).map((r, i) => `  Ref ${i + 1}: ${r.name} / ${r.contact} / ${r.phone} / ${r.email}${r.account ? ` / acct ${r.account}` : ""}`).join("\n");
  return [
    `--- CREDIT APPLICATION (${date}) ---`,
    `Legal name: ${app.legalName}${app.dba ? ` (DBA ${app.dba})` : ""}`,
    `Structure: ${app.structure} | EIN: ${app.ein}${app.duns ? ` | DUNS: ${app.duns}` : ""} | Started: ${app.startDate || "n/a"}`,
    `Contact: ${app.contact} / ${app.phone} / ${app.email}`,
    `AP: ${app.apContact} / ${app.apPhone} / ${app.apEmail}`,
    `Registered: ${app.registeredAddress}`,
    app.billingAddress ? `Billing: ${app.billingAddress}` : "",
    app.shipAddress ? `Ship: ${app.shipAddress}` : "",
    `Requested limit: ${app.requestedLimit || "n/a"} | Initial order: ${app.initialOrder || "n/a"}`,
    app.bankName ? `Bank: ${app.bankName} / ${app.bankPhone} / ${app.bankAddress}` : "",
    refs,
    `Signed: ${app.signer}, ${app.signerTitle}`,
    `--- END CREDIT APPLICATION ---`,
  ].filter(Boolean).join("\n");
}

// Fill the fillable PDF with the application. `template` is the raw PDF bytes.
export async function fillCreditApplicationPdf(template: ArrayBuffer | Uint8Array, app: CreditApplication, date: string): Promise<Uint8Array> {
  const { PDFDocument } = await import("pdf-lib");
  const doc = await PDFDocument.load(template);
  const form = doc.getForm();
  const set = (name: string, value: string) => {
    try { form.getTextField(name).setText(value || ""); } catch { /* field missing in template */ }
  };
  set("ca_date", date);
  set("ca_initial_order", app.initialOrder);
  set("ca_requested_limit", app.requestedLimit);
  set("ca_legal_name", app.legalName);
  set("ca_dba", app.dba);
  set("ca_contact", app.contact);
  set("ca_phone", app.phone);
  set("ca_email", app.email);
  set("ca_start", app.startDate);
  set("ca_ein", app.ein);
  set("ca_duns", app.duns);
  set("ca_registered", app.registeredAddress);
  set("ca_billing", app.billingAddress);
  set("ca_ship", app.shipAddress);
  set("ca_ap_contact", app.apContact);
  set("ca_ap_email", app.apEmail);
  set("ca_ap_phone", app.apPhone);
  set("ca_structure", app.structure);
  set("ca_bank", app.bankName);
  set("ca_bank_phone", app.bankPhone);
  set("ca_bank_address", app.bankAddress);
  app.refs.forEach((r, i) => {
    const n = i + 1;
    set(`ca_ref${n}_name`, r.name);
    set(`ca_ref${n}_contact`, r.contact);
    set(`ca_ref${n}_email`, r.email);
    set(`ca_ref${n}_phone`, r.phone);
    set(`ca_ref${n}_account`, r.account);
  });
  set("ca_signer", `${app.signer} (e-signed via website)`);
  set("ca_signer_title", app.signerTitle);
  set("ca_sign_date", date);
  form.updateFieldAppearances();
  return doc.save();
}
