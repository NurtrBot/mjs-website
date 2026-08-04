import { NextRequest, NextResponse } from "next/server";
import { updateDriverLocation, markDelivered } from "@/lib/delivery-store";

export async function POST(req: NextRequest) {
  try {
    const { token, lat, lng, status } = await req.json();

    if (!token || lat === undefined || lng === undefined) {
      return NextResponse.json({ error: "Missing token, lat, or lng" }, { status: 400 });
    }

    if (status === "delivered") {
      markDelivered(token);
      return NextResponse.json({ success: true, status: "delivered" });
    }

    const updated = updateDriverLocation(token, lat, lng, status);

    if (!updated) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
