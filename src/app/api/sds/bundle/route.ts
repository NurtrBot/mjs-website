import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { findSds, zipStore, safeFileName } from "@/lib/sds";

/*
 * GET /api/sds/bundle?skus=12520EA,3158EA&name=Anaheim%20Warehouse
 * "Download all sheets": a ZIP of the matched SDS PDFs for those SKUs.
 */
export async function GET(req: NextRequest) {
  const skus = (req.nextUrl.searchParams.get("skus") || "").split(",").map(s => s.trim().toUpperCase()).filter(Boolean).slice(0, 80);
  const name = safeFileName(req.nextUrl.searchParams.get("name") || "SDS binder");
  const seen = new Set<string>();
  const files: { name: string; data: Uint8Array }[] = [];
  for (const sku of skus) {
    const m = findSds(sku);
    if (!m || seen.has(m.file)) continue;
    const base = path.basename(m.file);
    if (!/^[\w.-]+\.PDF$/i.test(base)) continue; // index-controlled, but never read outside public/sds
    try {
      const data = await readFile(path.join(process.cwd(), "public", "sds", base));
      files.push({ name: `${sku}${m.revised ? ` (rev ${m.revised})` : ""}.pdf`, data });
      seen.add(m.file);
    } catch {}
  }
  if (files.length === 0) return NextResponse.json({ error: "No sheets found for those items" }, { status: 404 });
  const zip = zipStore(files);
  return new NextResponse(new Uint8Array(zip), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${name} - SDS.zip"`,
      "Cache-Control": "private, no-store",
    },
  });
}
