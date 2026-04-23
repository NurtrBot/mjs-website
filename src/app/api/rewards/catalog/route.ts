import { NextResponse } from "next/server";

// Fetches available gift card brands from Tremendous
export async function GET() {
  const apiKey = process.env.TREMENDOUS_API_KEY;
  const baseUrl = apiKey?.startsWith("TEST_")
    ? "https://testflight.tremendous.com"
    : "https://api.tremendous.com";

  if (!apiKey) {
    return NextResponse.json({ products: [] });
  }

  try {
    const res = await fetch(`${baseUrl}/api/v2/products`, {
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return NextResponse.json({ products: [] });
    }

    const data = await res.json();

    // Filter to gift cards only, with images, USD denomination
    const giftCards = (data.products || [])
      .filter((p: Record<string, unknown>) => {
        const countries = p.countries as Record<string, unknown>[] || [];
        const hasUS = countries.some((c: Record<string, unknown>) => c.abbr === "US");
        return hasUS && p.images && (p.category === "merchant_card" || p.category === "visa" || p.category === "mastercard");
      })
      .map((p: Record<string, unknown>) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        image: (p.images as Record<string, unknown>)?.[0] || (p.images as Record<string, string>)?.url || "",
        minValue: (p.min_value as number) || 0,
        maxValue: (p.max_value as number) || 0,
      }))
      .slice(0, 20);

    return NextResponse.json({ products: giftCards });
  } catch {
    return NextResponse.json({ products: [] });
  }
}
