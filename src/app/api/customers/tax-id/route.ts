import { NextRequest, NextResponse } from "next/server";

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
    // Support both JSON and FormData
    let customerId: number;
    let taxIdNumber: string;
    let customerName: string;
    let customerEmail: string;
    let companyName: string;

    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const body = await req.json();
      customerId = Number(body.customerId);
      taxIdNumber = body.taxIdNumber || "";
      customerName = body.customerName || "Unknown";
      customerEmail = body.customerEmail || "";
      companyName = body.companyName || "";
    } else {
      const formData = await req.formData();
      customerId = Number(formData.get("customerId"));
      taxIdNumber = (formData.get("taxIdNumber") as string) || "";
      customerName = (formData.get("customerName") as string) || "Unknown";
      customerEmail = (formData.get("customerEmail") as string) || "";
      companyName = (formData.get("companyName") as string) || "";
    }

    if (!customerId || !taxIdNumber) {
      return NextResponse.json({ error: "Missing customer ID or Tax ID number" }, { status: 400 });
    }

    const storeHash = process.env.BIGCOMMERCE_STORE_HASH!;
    const token = process.env.BIGCOMMERCE_ACCESS_TOKEN!;
    const uploadDate = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

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
      notes = `${notes} [TAX_ID_UPLOADED] [TAX_ID_NUMBER:${taxIdNumber}] [TAX_ID_DATE:${uploadDate}]`.trim();

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

    console.log(`[TAX_ID] Customer ${customerName} (${customerEmail}) from ${companyName} submitted Tax ID: ${taxIdNumber}`);

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
