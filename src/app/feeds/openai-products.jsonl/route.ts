import { buildOpenAIFeed } from "@/lib/openai-feed";

// ChatGPT product feed (OpenAI Commerce, JSONL — one product per line).
// Full snapshot of the live BigCommerce catalog.
// Cached and rebuilt at most once an hour, so visits (or bots) never hit the
// BigCommerce API directly — checkout shares that API's rate limit.
export const dynamic = "force-static";
export const revalidate = 3600;
export const maxDuration = 60;

export async function GET() {
  const { rows } = await buildOpenAIFeed();
  return new Response(rows.map((r) => JSON.stringify(r)).join("\n") + "\n", {
    headers: { "Content-Type": "application/jsonl; charset=utf-8" },
  });
}
