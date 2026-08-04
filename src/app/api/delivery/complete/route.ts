import { NextRequest, NextResponse } from "next/server";
import { markDelivered } from "@/lib/delivery-store";

/**
 * POST /api/delivery/complete
 *
 * Called by the POD app when a driver marks a stop as completed.
 * Immediately stops GPS tracking for this session.
 */
export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const success = markDelivered(token);

    if (!success) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, status: "delivered" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
