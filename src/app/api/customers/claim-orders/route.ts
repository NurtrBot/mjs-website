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
          reject(new Error(`BC ${method}: ${res.statusCode}`));
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
    const { email, customerId } = await req.json();

    if (!email || !customerId) {
      return NextResponse.json({ error: "Missing email or customerId" }, { status: 400 });
    }

    const storeHash = process.env.BIGCOMMERCE_STORE_HASH!;
    const token = process.env.BIGCOMMERCE_ACCESS_TOKEN!;

    // Find all guest orders (customer_id=0) with this email
    const res = await fetch(
      `https://api.bigcommerce.com/stores/${storeHash}/v2/orders?email=${encodeURIComponent(email)}&customer_id=0&limit=50`,
      { headers: { "X-Auth-Token": token, "Accept": "application/json" } }
    );

    if (!res.ok) {
      return NextResponse.json({ claimed: 0 });
    }

    const orders = await res.json();
    if (!Array.isArray(orders) || orders.length === 0) {
      return NextResponse.json({ claimed: 0 });
    }

    // Update each guest order to assign the new customer ID
    let claimed = 0;
    for (const order of orders) {
      try {
        await nativeRequest(
          "PUT",
          `https://api.bigcommerce.com/stores/${storeHash}/v2/orders/${order.id}`,
          { customer_id: customerId }
        );
        claimed++;
      } catch {
        // Skip failed ones, don't block
      }
    }

    return NextResponse.json({ claimed });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
