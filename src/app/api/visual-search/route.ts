import { NextRequest, NextResponse } from "next/server";
import { searchProducts } from "@/lib/products-api";

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "OpenAI not configured" }, { status: 500 });
  }

  try {
    const { image } = await req.json(); // base64 data URL
    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Step 1: Ask GPT-4o to identify the product
    const visionRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        max_tokens: 300,
        messages: [
          {
            role: "system",
            content: `You are a janitorial and cleaning supply product identifier for Mobile Janitorial Supply (MJS).
When shown a product image, identify what type of commercial/janitorial product it is and provide search terms to find an equivalent in our catalog.

Our catalog includes: paper towels, toilet tissue, hand soap, hand sanitizer, degreasers, all-purpose cleaners, disinfectants, air fresheners, trash liners (can liners), nitrile/latex/vinyl gloves, stretch film, tape, mops, mop buckets, floor pads, floor finish, floor stripper, vacuums, breakroom supplies (cups, plates, cutlery, napkins), and more.

Respond with ONLY a JSON object:
{
  "product_type": "what the product is (e.g. degreaser, paper towels, nitrile gloves)",
  "search_terms": ["term1", "term2", "term3"],
  "description": "Brief 1-sentence description of what you see"
}`,
          },
          {
            role: "user",
            content: [
              { type: "text", text: "What janitorial/cleaning product is this? Find me the MJS equivalent." },
              { type: "image_url", image_url: { url: image, detail: "low" } },
            ],
          },
        ],
      }),
    });

    if (!visionRes.ok) {
      const err = await visionRes.text();
      console.error("OpenAI vision error:", err);
      return NextResponse.json({ error: "Failed to analyze image" }, { status: 500 });
    }

    const visionData = await visionRes.json();
    const content = visionData.choices?.[0]?.message?.content || "";

    // Parse the JSON response
    let parsed: { product_type: string; search_terms: string[]; description: string };
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : content);
    } catch {
      // Fallback: use the raw text as a search term
      parsed = { product_type: content.slice(0, 50), search_terms: [content.slice(0, 30)], description: content };
    }

    // Step 2: Search our catalog with each term, collect unique results
    const seen = new Set<string>();
    const allProducts: Awaited<ReturnType<typeof searchProducts>> = [];

    for (const term of parsed.search_terms.slice(0, 3)) {
      const results = await searchProducts(term, 10);
      for (const p of results) {
        if (!seen.has(p.sku)) {
          seen.add(p.sku);
          allProducts.push(p);
        }
      }
      if (allProducts.length >= 12) break;
    }

    return NextResponse.json({
      description: parsed.description,
      product_type: parsed.product_type,
      search_terms: parsed.search_terms,
      products: allProducts.slice(0, 12),
    });
  } catch (error: unknown) {
    console.error("Visual search error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
