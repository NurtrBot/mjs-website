import { buildOpenAIFeed } from "@/lib/openai-feed";

// Which products the ChatGPT feed leaves out, and why. Same hourly cache as the feed.
export const dynamic = "force-static";
export const revalidate = 3600;
export const maxDuration = 60;

export async function GET() {
  const { rows, skipped } = await buildOpenAIFeed();
  const byReason: Record<string, number> = {};
  for (const s of skipped) byReason[s.reason] = (byReason[s.reason] || 0) + 1;
  return Response.json({
    generatedAt: new Date().toISOString(),
    included: rows.length,
    skipped: skipped.length,
    skippedByReason: byReason,
    skippedProducts: skipped,
  });
}
