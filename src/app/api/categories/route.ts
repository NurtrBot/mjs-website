import { NextResponse } from "next/server";
import { getCategories } from "@/lib/bigcommerce";

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json({ data: categories });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
