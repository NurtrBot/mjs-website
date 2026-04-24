import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
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
  // Rate limit: 3 attempts per 15 minutes per IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "unknown";
  const { allowed, retryAfterMs } = rateLimit(ip, "change-password", 3, 15 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: `Too many attempts. Please try again in ${Math.ceil(retryAfterMs / 60000)} minutes.` },
      { status: 429 }
    );
  }

  try {
    const { customerId, newPassword } = await req.json();

    if (!customerId || !newPassword) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (newPassword.length < 7) {
      return NextResponse.json({ error: "Password must be at least 7 characters" }, { status: 400 });
    }

    const storeHash = process.env.BIGCOMMERCE_STORE_HASH!;

    // Update password via V3 Customers API
    const result = await nativeRequest(
      "PUT",
      `https://api.bigcommerce.com/stores/${storeHash}/v3/customers`,
      [{
        id: customerId,
        authentication: {
          new_password: newPassword,
        },
      }]
    );

    const data = result as { data?: Record<string, unknown>[] };
    if (!data?.data?.[0]) {
      return NextResponse.json({ error: "Failed to update password" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
