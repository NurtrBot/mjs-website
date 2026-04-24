import { NextRequest, NextResponse } from "next/server";
import { getCustomerByEmail } from "@/lib/bigcommerce";
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
  // Rate limit: 5 attempts per 15 minutes per IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "unknown";
  const { allowed, retryAfterMs } = rateLimit(ip, "login", 5, 15 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: `Too many login attempts. Please try again in ${Math.ceil(retryAfterMs / 60000)} minutes.` },
      { status: 429 }
    );
  }

  try {
    const { email, password } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }

    // Validate credentials against BC
    const storeHash = process.env.BIGCOMMERCE_STORE_HASH!;
    const validationResult = await nativeRequest(
      "POST",
      `https://api.bigcommerce.com/stores/${storeHash}/v3/customers/validate-credentials`,
      { email, password }
    ) as { is_valid?: boolean; customer_id?: number } | null;

    if (!validationResult?.is_valid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Credentials valid — fetch full customer data
    const customer = await getCustomerByEmail(email);
    if (!customer) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    // Get price list ID from customer group
    let priceListId: number | null = null;
    if (customer.customer_group_id) {
      try {
        const token = process.env.BIGCOMMERCE_ACCESS_TOKEN!;
        const groupRes = await fetch(
          `https://api.bigcommerce.com/stores/${storeHash}/v2/customer_groups/${customer.customer_group_id}`,
          { headers: { "X-Auth-Token": token, "Accept": "application/json" } }
        );
        if (groupRes.ok) {
          const group = await groupRes.json();
          const plRule = group.discount_rules?.find((r: { type: string }) => r.type === "price_list");
          if (plRule) priceListId = plRule.price_list_id;
        }
      } catch {}
    }

    return NextResponse.json({
      customer: {
        id: customer.id,
        firstName: customer.first_name,
        lastName: customer.last_name,
        email: customer.email,
        company: customer.company || "",
        phone: customer.phone || "",
        customerGroupId: customer.customer_group_id || 0,
        priceListId,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
