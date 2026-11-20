import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { getCustomerById, updateCustomer } from "@/lib/bigcommerce";
import { approvalSignature, isPendingTerms } from "@/lib/customer-terms";
import { sendStaffEmail } from "@/lib/staff-notify";
import { creditApplicationEmail } from "@/lib/staff-emails";
import { rateLimit } from "@/lib/rate-limit";
import {
  applicationNotesSummary,
  fillCreditApplicationPdf,
  normalizeApplication,
  validateApplication,
} from "@/lib/credit-application";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.mobilejanitorialsupply.com";

async function loadPdfTemplate(): Promise<Uint8Array | null> {
  try {
    return new Uint8Array(await readFile(path.join(process.cwd(), "public", "forms", "credit-application.pdf")));
  } catch {}
  try {
    const res = await fetch(`${SITE_URL}/forms/credit-application.pdf`);
    if (res.ok) return new Uint8Array(await res.arrayBuffer());
  } catch {}
  return null;
}

// POST — a pending-terms customer submits the Net-30 credit application.
// Records a summary on the customer, fills the PDF, and emails staff with a one-click approve link.
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const limit = rateLimit(ip, "terms-request", 5, 60 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  try {
    const body = await req.json();
    const customerId = Number(body.customerId);
    if (!customerId) return NextResponse.json({ error: "Missing customer ID" }, { status: 400 });

    const app = normalizeApplication(body.application);
    const problems = validateApplication(app);
    if (problems.length > 0) {
      return NextResponse.json({ error: problems[0], problems }, { status: 400 });
    }

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
    await updateCustomer(customerId, {
      notes: `${notes}\n[TERMS_REQUESTED:${today}]\n${applicationNotesSummary(app, today)}`.trim(),
    });

    // Filled PDF for staff (best effort — the email still goes out without it)
    let attachments: { filename: string; content: string }[] | undefined;
    try {
      const template = await loadPdfTemplate();
      if (template) {
        const pdf = await fillCreditApplicationPdf(template, app, today);
        const safeName = (app.legalName || "customer").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").slice(0, 60);
        attachments = [{ filename: `credit-application-${safeName}.pdf`, content: Buffer.from(pdf).toString("base64") }];
      }
    } catch (err) {
      console.error("[TERMS] PDF fill failed:", err);
    }

    const approveUrl = `${SITE_URL}/api/customers/terms-approve?customerId=${customerId}&sig=${approvalSignature(customerId)}`;
    const taxId = notes.match(/\[TAX_ID_NUMBER:(.*?)\]/)?.[1];
    const { subject, html, replyTo } = creditApplicationEmail(app, customerId, approveUrl, !!taxId);
    const emailed = await sendStaffEmail({ subject, replyTo: replyTo || customer.email, attachments, html });

    return NextResponse.json({ success: true, emailed });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
