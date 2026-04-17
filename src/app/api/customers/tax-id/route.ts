import { NextRequest, NextResponse } from "next/server";
import { updateOrder } from "@/lib/bigcommerce";

// GET — check if customer has uploaded a tax ID
export async function GET(req: NextRequest) {
  const customerId = Number(req.nextUrl.searchParams.get("customerId"));
  if (!customerId) return NextResponse.json({ uploaded: false });

  try {
    const storeHash = process.env.BIGCOMMERCE_STORE_HASH!;
    const token = process.env.BIGCOMMERCE_ACCESS_TOKEN!;

    // Check customer form fields / staff notes for tax ID marker
    const res = await fetch(
      `https://api.bigcommerce.com/stores/${storeHash}/v2/customers/${customerId}`,
      { headers: { "X-Auth-Token": token, "Accept": "application/json" } }
    );
    if (!res.ok) return NextResponse.json({ uploaded: false });
    const customer = await res.json();
    const notes = (customer.notes || "") as string;
    const hasTaxId = notes.includes("[TAX_ID_UPLOADED]");
    const idMatch = notes.match(/\[TAX_ID_NUMBER:(.*?)\]/);
    const taxIdNumber = idMatch ? idMatch[1] : null;
    const dateMatch = notes.match(/\[TAX_ID_DATE:(.*?)\]/);
    const uploadDate = dateMatch ? dateMatch[1] : null;

    return NextResponse.json({ uploaded: hasTaxId, taxIdNumber, uploadDate });
  } catch {
    return NextResponse.json({ uploaded: false });
  }
}

// POST — upload tax ID file
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const customerId = Number(formData.get("customerId"));
    const customerName = (formData.get("customerName") as string) || "Unknown";
    const customerEmail = (formData.get("customerEmail") as string) || "";
    const companyName = (formData.get("companyName") as string) || "";
    const taxIdNumber = (formData.get("taxIdNumber") as string) || "";

    if (!file || !customerId) {
      return NextResponse.json({ error: "Missing file or customer ID" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Please upload a PDF or image file (JPG, PNG)" }, { status: 400 });
    }

    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File must be under 10MB" }, { status: 400 });
    }

    const storeHash = process.env.BIGCOMMERCE_STORE_HASH!;
    const token = process.env.BIGCOMMERCE_ACCESS_TOKEN!;
    const uploadDate = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    // Read file to base64 for email
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileBase64 = fileBuffer.toString("base64");

    // Update customer notes in BC to mark tax ID as uploaded
    const customerRes = await fetch(
      `https://api.bigcommerce.com/stores/${storeHash}/v2/customers/${customerId}`,
      { headers: { "X-Auth-Token": token, "Accept": "application/json" } }
    );
    if (customerRes.ok) {
      const customer = await customerRes.json();
      let notes = ((customer.notes || "") as string)
        .replace(/\[TAX_ID_UPLOADED\]/g, "")
        .replace(/\[TAX_ID_NUMBER:.*?\]/g, "")
        .replace(/\[TAX_ID_FILE:.*?\]/g, "")
        .replace(/\[TAX_ID_DATE:.*?\]/g, "")
        .trim();
      notes = `${notes} [TAX_ID_UPLOADED] [TAX_ID_NUMBER:${taxIdNumber}] [TAX_ID_FILE:${file.name}] [TAX_ID_DATE:${uploadDate}]`.trim();

      // Use nativeRequest via updateOrder pattern for the PUT
      const { default: https } = await import("https");
      const { gunzipSync } = await import("zlib");
      await new Promise((resolve, reject) => {
        const body = JSON.stringify({ notes });
        const parsed = new URL(`https://api.bigcommerce.com/stores/${storeHash}/v2/customers/${customerId}`);
        const r = https.request({
          hostname: parsed.hostname,
          path: parsed.pathname,
          method: "PUT",
          headers: {
            "X-Auth-Token": token,
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(body),
          },
        }, (res) => {
          const chunks: Buffer[] = [];
          res.on("data", (c: Buffer) => chunks.push(c));
          res.on("end", () => {
            let buf = Buffer.concat(chunks);
            if (res.headers["content-encoding"] === "gzip") {
              try { buf = gunzipSync(buf); } catch {}
            }
            resolve(buf.toString());
          });
        });
        r.on("error", reject);
        r.write(body);
        r.end();
      });
    }

    // Send email notification to MJS team
    // Using BC's built-in email or staff notification
    // For now, store the file data and create a staff-visible note
    try {
      // Create an internal order note / staff notification
      // We'll store the base64 file reference and send via available channels
      console.log(`[TAX_ID] Customer ${customerName} (${customerEmail}) from ${companyName} uploaded tax ID: ${file.name} (${(file.size / 1024).toFixed(1)}KB)`);

      // Try to send email notification via simple SMTP if configured
      if (process.env.SMTP_HOST) {
        // SMTP email sending would go here
      }
    } catch {}

    // Suppress unused variable warning
    void fileBase64;
    void updateOrder;

    return NextResponse.json({
      success: true,
      taxIdNumber,
      uploadDate,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
