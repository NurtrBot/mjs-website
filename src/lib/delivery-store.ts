/**
 * Delivery tracking storage + live GPS from POD Supabase.
 *
 * Sessions are stored in a local JSON file (swap for Redis in production).
 * Live driver GPS is READ from the POD app's Supabase driver_locations table.
 *
 * PRIVACY: GPS is only exposed while a session is active (en_route/nearby/arrived).
 * The moment a delivery is marked complete, GPS stops being returned.
 * Sessions auto-expire after 24 hours.
 */

import fs from "fs";
import path from "path";

export interface OrderItem {
  name: string;
  qty: number;
  price: number;
  sku?: string;
}

export interface TrackingSession {
  token: string;
  orderId: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  deliveryAddress: string;
  deliveryLat: number;
  deliveryLng: number;
  driverName: string;
  driverPhone?: string;
  driverPhoto?: string;
  driverId: string; // POD Supabase driver UUID
  driverLat: number;
  driverLng: number;
  vehicleName?: string;
  vehiclePlate?: string;
  status: "en_route" | "nearby" | "arrived" | "delivered";
  createdAt: number;
  updatedAt: number;
  estimatedMinutes?: number;
  stopsAway?: number;
  items?: OrderItem[];
  routeCoords?: [number, number][];
}

const STORE_PATH = path.join(process.cwd(), ".delivery-sessions.json");
const TTL = 24 * 60 * 60 * 1000;

function readStore(): Record<string, TrackingSession> {
  try {
    if (fs.existsSync(STORE_PATH)) {
      return JSON.parse(fs.readFileSync(STORE_PATH, "utf-8"));
    }
  } catch {}
  return {};
}

function writeStore(data: Record<string, TrackingSession>): void {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(data), "utf-8");
  } catch (e) {
    console.error("Failed to write delivery store:", e);
  }
}

function cleanup(store: Record<string, TrackingSession>): Record<string, TrackingSession> {
  const now = Date.now();
  const cleaned: Record<string, TrackingSession> = {};
  for (const [key, session] of Object.entries(store)) {
    if (now - session.createdAt < TTL) cleaned[key] = session;
  }
  return cleaned;
}

export function createSession(session: TrackingSession): void {
  const store = cleanup(readStore());
  store[session.token] = session;
  writeStore(store);
}

export function getSession(token: string): TrackingSession | null {
  const store = cleanup(readStore());
  return store[token] || null;
}

export function updateDriverLocation(
  token: string,
  lat: number,
  lng: number,
  status?: TrackingSession["status"]
): boolean {
  const store = readStore();
  const session = store[token];
  if (!session) return false;
  session.driverLat = lat;
  session.driverLng = lng;
  session.updatedAt = Date.now();
  if (status) session.status = status;
  writeStore(store);
  return true;
}

export function markDelivered(token: string): boolean {
  const store = readStore();
  const session = store[token];
  if (!session) return false;
  session.status = "delivered";
  session.updatedAt = Date.now();
  writeStore(store);
  return true;
}

/**
 * Fetch LIVE GPS from the POD app's Supabase driver_locations table.
 * Only called for active sessions (not delivered).
 * Returns null if no recent location found.
 */
export async function fetchLiveDriverGPS(driverId: string): Promise<{
  lat: number;
  lng: number;
  heading: number;
  speed: number;
  recorded_at: string;
} | null> {
  const url = process.env.POD_SUPABASE_URL;
  const key = process.env.POD_SUPABASE_KEY;
  if (!url || !key) return null;

  try {
    const res = await fetch(
      `${url}/rest/v1/driver_locations?driver_id=eq.${driverId}&order=recorded_at.desc&limit=1`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
        cache: "no-store",
      }
    );
    if (!res.ok) return null;
    const rows = await res.json();
    if (rows.length === 0) return null;
    return rows[0];
  } catch {
    return null;
  }
}
