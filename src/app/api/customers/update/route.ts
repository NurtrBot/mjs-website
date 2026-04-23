import { NextRequest, NextResponse } from "next/server";
import https from "https";
import { gunzipSync } from "zlib";

function nativeRequest(method: string, url: string, body?: unknown): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const postData = body ? JSON.stringify(body) : undefined;
    const req = https.request({
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method,
      headers: {
        "X-Auth-Token": process.env.BIGCOMMERCE_ACCESS_TOKEN!,
        "Accept": "application/json",
        "Content-Type": "application/json",
        ...(postData ? { "Content-Length": Buffer.byteLength(postData) } : {}),
      },
    }, (res) => {
      const chunks: Buffer[] = [];
      res.on("data", (chunk: Buffer) => chunks.push(chunk));
      res.on("end", () => {
        let buffer = Buffer.concat(chunks);
        if (res.headers["content-encoding"] === "gzip") {
          try { buffer = gunzipSync(buffer); } catch {}
        }
        const text = buffer.toString("utf-8");
        if (res.statusCode && res.statusCode >= 400) {
          reject(new Error(`BC ${method}: ${res.statusCode} ${text.slice(0, 200)}`));
          return;
        }
        if (!text) { resolve(null); return; }
        try { resolve(JSON.parse(text)); } catch { resolve(null); }
      });
    });
    req.on("error", reject);
    if (postData) req.write(postData);
    req.end();
  });
}

export async function POST(req: NextRequest) {
  try {
    const { customerId, firstName, lastName, company, email, phone } = await req.json();

    if (!customerId) {
      return NextResponse.json({ error: "Missing customer ID" }, { status: 400 });
    }

    const storeHash = process.env.BIGCOMMERCE_STORE_HASH!;

    // Update customer via V3 API
    const result = await nativeRequest(
      "PUT",
      `https://api.bigcommerce.com/stores/${storeHash}/v3/customers`,
      [{
        id: customerId,
        first_name: firstName,
        last_name: lastName,
        company: company || "",
        email,
        phone: phone || "",
      }]
    );

    const data = result as { data?: Record<string, unknown>[] };
    const updated = data?.data?.[0];

    if (!updated) {
      return NextResponse.json({ error: "Failed to update customer" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      customer: {
        id: updated.id,
        firstName: updated.first_name,
        lastName: updated.last_name,
        email: updated.email,
        company: updated.company || "",
        phone: updated.phone || "",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
