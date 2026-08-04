import { NextRequest, NextResponse } from "next/server";
import { getSession, fetchLiveDriverGPS } from "@/lib/delivery-store";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const session = getSession(token);

  if (!session) {
    return NextResponse.json({ error: "Tracking session not found or expired" }, { status: 404 });
  }

  let driverLat = session.driverLat;
  let driverLng = session.driverLng;
  let updatedAt = session.updatedAt;

  // PRIVACY: Only fetch live GPS if the delivery is still active
  if (session.status !== "delivered" && session.driverId) {
    const liveGPS = await fetchLiveDriverGPS(session.driverId);
    if (liveGPS) {
      driverLat = liveGPS.lat;
      driverLng = liveGPS.lng;
      updatedAt = new Date(liveGPS.recorded_at).getTime();
    }
  }

  return NextResponse.json({
    orderId: session.orderId,
    invoiceNumber: session.invoiceNumber,
    customerName: session.customerName,
    deliveryAddress: session.deliveryAddress,
    deliveryLat: session.deliveryLat,
    deliveryLng: session.deliveryLng,
    driverName: session.driverName,
    driverPhoto: session.driverPhoto,
    driverLat,
    driverLng,
    vehicleName: session.vehicleName,
    status: session.status,
    updatedAt,
    createdAt: session.createdAt,
    estimatedMinutes: session.estimatedMinutes,
    stopsAway: session.stopsAway,
    items: session.items,
    routeCoords: session.routeCoords,
  }, {
    headers: { "Cache-Control": "no-store" },
  });
}
