import { NextRequest, NextResponse } from "next/server";
import { getCustomerById } from "@/lib/bigcommerce";
import { parseResetToken, verifyResetToken } from "@/lib/password-reset";
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

async function lookup(token: string) {
  const parsed = parseResetToken(token);
  if (!parsed) return { error: "This reset link is not valid.", status: 400 } as const;
  const customer = await getCustomerById(parsed.customerId);
  if (!customer) return { error: "This reset link is not valid.", status: 400 } as const;
  const v = verifyResetToken(token, (customer as unknown as { date_modified: string }).date_modified);
  if (!v.ok) {
    return {
      error: v.reason === "expired"
        ? "This reset link has expired. Please request a new one."
        : "This reset link is no longer valid. If you already reset your password, just log in — otherwise request a new link.",
      status: 400,
    } as const;
  }
  return { customer } as const;
}

// GET ?token= — lets the reset page check the link before showing the form
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") || "";
  const r = await lookup(token);
  if ("error" in r) return NextResponse.json({ valid: false, error: r.error });
  return NextResponse.json({ valid: true, email: r.customer.email, firstName: r.customer.first_name });
}

// POST { token, newPassword } — sets the new password
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  const { allowed, retryAfterMs } = rateLimit(ip, "reset-password", 5, 15 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: `Too many attempts. Please try again in ${Math.ceil(retryAfterMs / 60000)} minutes.` },
      { status: 429 }
    );
  }

  try {
    const { token, newPassword } = await req.json();
    if (!newPassword || String(newPassword).length < 7) {
      return NextResponse.json({ error: "Password must be at least 7 characters" }, { status: 400 });
    }

    const r = await lookup(String(token || ""));
    if ("error" in r) return NextResponse.json({ error: r.error }, { status: r.status });

    const storeHash = process.env.BIGCOMMERCE_STORE_HASH!;
    const result = await nativeRequest(
      "PUT",
      `https://api.bigcommerce.com/stores/${storeHash}/v3/customers`,
      [{ id: r.customer.id, authentication: { new_password: String(newPassword) } }]
    );
    const data = result as { data?: Record<string, unknown>[] };
    if (!data?.data?.[0]) {
      return NextResponse.json({ error: "Failed to update password. Please call (714) 779-2640." }, { status: 500 });
    }

    return NextResponse.json({ success: true, email: r.customer.email });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
