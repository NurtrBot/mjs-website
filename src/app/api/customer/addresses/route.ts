import { NextRequest, NextResponse } from "next/server";
import https from "https";
import { gunzipSync } from "zlib";

const STORE_HASH = process.env.BIGCOMMERCE_STORE_HASH!;
const ACCESS_TOKEN = process.env.BIGCOMMERCE_ACCESS_TOKEN!;

function nativeRequest(method: string, url: string, body?: unknown): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const postData = body ? JSON.stringify(body) : undefined;
    const req = https.request({
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method,
      headers: {
        "X-Auth-Token": ACCESS_TOKEN,
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

// GET — Fetch customer addresses
export async function GET(req: NextRequest) {
  const customerId = Number(req.nextUrl.searchParams.get("customerId"));
  if (!customerId) {
    return NextResponse.json({ error: "Missing customerId" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.bigcommerce.com/stores/${STORE_HASH}/v3/customers/addresses?customer_id:in=${customerId}&limit=50`,
      { headers: { "X-Auth-Token": ACCESS_TOKEN, Accept: "application/json" } }
    );

    if (!res.ok) return NextResponse.json({ addresses: [] });

    const data = await res.json();
    const addresses = (data.data || []).map((a: Record<string, unknown>) => ({
      id: a.id,
      company: a.company || "",
      firstName: a.first_name,
      lastName: a.last_name,
      address1: a.address1,
      address2: a.address2 || "",
      city: a.city,
      state: a.state_or_province,
      zip: a.postal_code,
      country: a.country_code,
      phone: a.phone || "",
    }));

    return NextResponse.json({ addresses });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST — Create a new address
export async function POST(req: NextRequest) {
  try {
    const { customerId, company, firstName, lastName, address, city, state, zip, phone } = await req.json();

    if (!customerId || !address || !city || !zip) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await nativeRequest(
      "POST",
      `https://api.bigcommerce.com/stores/${STORE_HASH}/v3/customers/addresses`,
      [{
        customer_id: customerId,
        first_name: firstName || "",
        last_name: lastName || "",
        company: company || "",
        address1: address,
        city,
        state_or_province: state || "CA",
        postal_code: zip,
        country_code: "US",
        phone: phone || "",
      }]
    );

    const data = result as { data?: Record<string, unknown>[] };
    const created = data?.data?.[0];
    if (!created) {
      return NextResponse.json({ error: "Failed to create address" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      address: {
        id: created.id,
        company: created.company || "",
        firstName: created.first_name,
        lastName: created.last_name,
        address1: created.address1,
        city: created.city,
        state: created.state_or_province,
        zip: created.postal_code,
        phone: created.phone || "",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT — Update an existing address
export async function PUT(req: NextRequest) {
  try {
    const { addressId, company, firstName, lastName, address, city, state, zip, phone } = await req.json();

    if (!addressId) {
      return NextResponse.json({ error: "Missing address ID" }, { status: 400 });
    }

    const result = await nativeRequest(
      "PUT",
      `https://api.bigcommerce.com/stores/${STORE_HASH}/v3/customers/addresses`,
      [{
        id: addressId,
        first_name: firstName || "",
        last_name: lastName || "",
        company: company || "",
        address1: address,
        city,
        state_or_province: state || "CA",
        postal_code: zip,
        country_code: "US",
        phone: phone || "",
      }]
    );

    const data = result as { data?: Record<string, unknown>[] };
    const updated = data?.data?.[0];
    if (!updated) {
      return NextResponse.json({ error: "Failed to update address" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE — Remove an address
export async function DELETE(req: NextRequest) {
  try {
    const { addressId } = await req.json();

    if (!addressId) {
      return NextResponse.json({ error: "Missing address ID" }, { status: 400 });
    }

    await fetch(
      `https://api.bigcommerce.com/stores/${STORE_HASH}/v3/customers/addresses?id:in=${addressId}`,
      {
        method: "DELETE",
        headers: { "X-Auth-Token": ACCESS_TOKEN, Accept: "application/json" },
      }
    );

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
