"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  Package,
  Loader2,
  Navigation,
  ChevronDown,
  ChevronUp,
  Phone,
} from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import Footer from "@/components/Footer";

const TrackingMap = dynamic(() => import("@/components/TrackingMap"), { ssr: false });

interface OrderItem {
  name: string;
  qty: number;
  price: number;
  sku?: string;
}

interface TrackingData {
  orderId: string;
  invoiceNumber: string;
  customerName: string;
  deliveryAddress: string;
  deliveryLat: number;
  deliveryLng: number;
  driverName: string;
  driverPhoto?: string;
  driverLat: number;
  driverLng: number;
  vehicleName?: string;
  status: "en_route" | "nearby" | "arrived" | "delivered";
  updatedAt: number;
  createdAt: number;
  estimatedMinutes?: number;
  stopsAway?: number;
  items?: OrderItem[];
  routeCoords?: [number, number][];
}

function timeAgo(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 30) return "Just now";
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

function estimateArrivalRange(minutes?: number): { start: string; end: string } {
  if (!minutes) return { start: "--:--", end: "--:--" };
  const fmt = (d: Date) => d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  const arrival = new Date(Date.now() + minutes * 60 * 1000);
  const buffer = new Date(arrival.getTime() + 5 * 60 * 1000); // +5 min buffer
  return { start: fmt(arrival), end: fmt(buffer) };
}

function estimateDistance(lat1: number, lng1: number, lat2: number, lng2: number): string {
  const R = 3959;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  const d = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return d < 0.1 ? "< 0.1 mi" : `${d.toFixed(1)} mi`;
}

function TrackingContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [data, setData] = useState<TrackingData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showItems, setShowItems] = useState(true);

  const fetchTracking = () => {
    if (!token) return;
    fetch(`/api/delivery/track?token=${token}`)
      .then((r) => {
        if (!r.ok) throw new Error(r.status === 404 ? "not_found" : "error");
        return r.json();
      })
      .then((d) => { setData(d); setError(null); setLoading(false); })
      .catch((e) => { setError(e.message === "not_found" ? "not_found" : "error"); setLoading(false); });
  };

  useEffect(() => {
    fetchTracking();
    const interval = setInterval(fetchTracking, 15000);
    return () => clearInterval(interval);
  }, [token]);

  // Empty states
  if (!token) {
    return (
      <>
        <TopBar /><Header /><CategoryNav />
        <main className="min-h-[60vh] bg-mjs-gray-50 flex items-center justify-center p-4">
          <div className="text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h1 className="text-lg font-bold text-mjs-dark mb-1">No tracking link</h1>
            <p className="text-sm text-gray-500">Check your email for a tracking link from MJS.</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <TopBar /><Header /><CategoryNav />
        <main className="min-h-[60vh] bg-mjs-gray-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-mjs-red animate-spin" />
        </main>
        <Footer />
      </>
    );
  }

  if (error === "not_found" || !data) {
    return (
      <>
        <TopBar /><Header /><CategoryNav />
        <main className="min-h-[60vh] bg-mjs-gray-50 flex items-center justify-center p-4">
          <div className="text-center max-w-sm">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h1 className="text-lg font-bold text-mjs-dark mb-1">Tracking expired</h1>
            <p className="text-sm text-gray-500 mb-4">This delivery has been completed or the link has expired.</p>
            <a href="/" className="text-sm font-semibold text-mjs-red">Back to Home</a>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const isDelivered = data.status === "delivered";
  const etaMinutes = data.estimatedMinutes || Math.round(
    parseFloat(estimateDistance(data.driverLat, data.driverLng, data.deliveryLat, data.deliveryLng)) * 3.5
  );
  const distance = estimateDistance(data.driverLat, data.driverLng, data.deliveryLat, data.deliveryLng);

  return (
    <>
      <TopBar />
      <Header />
      <CategoryNav />
      <main className="bg-mjs-gray-50">
        <div className="max-w-[1400px] mx-auto">
          {/* ══ LAYOUT ══ */}
          <div className="flex flex-col lg:flex-row lg:min-h-[75vh] md:p-4 md:gap-4 pb-6 md:pb-8">

            {/* ── LEFT PANEL ── */}
            <div className="order-2 lg:order-1 lg:w-[400px] lg:overflow-y-auto bg-white md:rounded-2xl md:border md:border-gray-200 md:shadow-sm">
              <div className="p-5 space-y-5">

                {/* ETA Card */}
                {isDelivered ? (
                  <div className="rounded-2xl p-5 bg-green-600">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <div className="text-white text-xl font-black">Delivered</div>
                        <div className="text-white/70 text-xs font-semibold">Your order has been completed</div>
                      </div>
                    </div>
                    <div className="bg-white/15 rounded-xl px-4 py-2.5">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white/60 text-[10px] font-semibold uppercase">Completed at</div>
                          <div className="text-white text-sm font-bold">
                            {new Date(data.updatedAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white/60 text-[10px] font-semibold uppercase">Date</div>
                          <div className="text-white text-sm font-bold">
                            {new Date(data.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl p-4 md:p-5 bg-mjs-red/90">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-white/60 text-[11px] font-semibold">On the way</div>
                      <div className="flex items-center gap-1 bg-white/15 rounded-full px-2 py-0.5">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                        <span className="text-[9px] font-bold text-white/80">98% On-Time</span>
                      </div>
                    </div>

                    <div className="text-white/50 text-[10px] font-semibold uppercase tracking-wide mb-0.5">Estimated Arrival</div>
                    <div className="text-white text-xl md:text-2xl font-black mb-0.5">
                      {estimateArrivalRange(etaMinutes).start} – {estimateArrivalRange(etaMinutes).end}
                    </div>
                    <div className="text-white/50 text-xs font-semibold mb-2">
                      {etaMinutes} Minutes Away
                    </div>

                    <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full transition-all duration-1000"
                        style={{ width: `${Math.max(10, 100 - (etaMinutes / 60) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Invoice */}
                <div className="bg-mjs-gray-50 rounded-xl px-4 py-3 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Invoice</div>
                    <div className="text-lg font-black text-mjs-dark">#{data.invoiceNumber}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Updated</div>
                    <div className="text-xs font-semibold text-gray-500">{timeAgo(data.updatedAt)}</div>
                  </div>
                </div>

                {/* Driver */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
                    {data.driverPhoto ? (
                      <img src={data.driverPhoto} alt={data.driverName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-mjs-dark flex items-center justify-center text-white font-black text-lg">
                        {data.driverName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-[11px] text-gray-400 font-medium">Your Driver</div>
                    <div className="text-base font-black text-mjs-dark">{data.driverName}</div>
                  </div>
                </div>

                {/* Vehicle */}
                <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-3">
                  <div className="w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-white">
                    <Image src="/images/mjs-truck.png" alt="MJS Truck" width={160} height={100} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-[11px] text-gray-400 font-medium">Vehicle</div>
                    <div className="text-sm font-bold text-mjs-dark">MJS Truck</div>
                  </div>
                </div>

                <div className="h-px bg-gray-100" />

                {/* Route: Warehouse → Customer */}
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Delivery Route</h3>
                  <div className="space-y-0">
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 bg-mjs-red rounded-full flex items-center justify-center">
                          <Package className="w-3 h-3 text-white" />
                        </div>
                        <div className="w-px h-8 bg-gray-200" />
                      </div>
                      <div className="pt-0.5">
                        <div className="text-xs font-bold text-mjs-dark">MJS Warehouse</div>
                        <div className="text-[11px] text-gray-500">3066 E. La Palma Ave, Anaheim</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-mjs-dark rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-3 h-3 text-white" />
                      </div>
                      <div className="pt-0.5">
                        <div className="text-xs font-bold text-mjs-dark">{data.customerName}</div>
                        <div className="text-[11px] text-gray-500">{data.deliveryAddress}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                {data.items && data.items.length > 0 && (
                  <>
                    <div className="h-px bg-gray-100" />
                    <div>
                      <button
                        onClick={() => setShowItems(!showItems)}
                        className="w-full flex items-center justify-between py-1"
                      >
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                          Order Items ({data.items.length})
                        </h3>
                        {showItems ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                      </button>
                      {showItems && (
                        <div className="mt-2 border border-gray-100 rounded-xl overflow-hidden max-h-[200px] overflow-y-auto">
                          {data.items.map((item, i) => (
                            <div key={i} className={`flex items-center justify-between px-4 py-2.5 ${i > 0 ? "border-t border-gray-50" : ""}`}>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium text-mjs-dark truncate">{item.name}</div>
                                <div className="text-[10px] text-gray-400">Qty: {item.qty}{item.sku ? ` · ${item.sku}` : ""}</div>
                              </div>
                              <div className="text-xs font-bold text-mjs-dark ml-3">${(item.price * item.qty).toFixed(2)}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Call */}
                <a
                  href="tel:7147792640"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-mjs-dark text-white font-semibold text-sm rounded-xl active:bg-gray-800 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Questions? Call (714) 779-2640
                </a>
              </div>
            </div>

            {/* ── MAP ── */}
            <div className="order-1 lg:order-2 flex-1 relative md:rounded-2xl md:overflow-hidden md:border md:border-gray-200 md:shadow-sm" style={{ minHeight: "50vh" }}>
              <TrackingMap
                driverLat={data.driverLat}
                driverLng={data.driverLng}
                deliveryLat={data.deliveryLat}
                deliveryLng={data.deliveryLng}
                status={data.status}
                routeCoords={data.routeCoords}
                driverName={data.driverName}
                driverPhoto={data.driverPhoto}
                customerName={data.customerName}
                deliveryAddress={data.deliveryAddress}
              />

              {/* Floating ETA + Distance bar */}
              {!isDelivered && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[500]">
                  <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 px-3 md:px-5 py-2 md:py-3 flex items-center gap-3 md:gap-6">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-mjs-red flex-shrink-0" />
                      <div>
                        <div className="text-[8px] md:text-[10px] text-gray-400 font-semibold uppercase">ETA</div>
                        <div className="text-[11px] md:text-sm font-black text-mjs-dark whitespace-nowrap">{estimateArrivalRange(etaMinutes).start}–{estimateArrivalRange(etaMinutes).end}</div>
                      </div>
                    </div>
                    <div className="w-px h-7 bg-gray-200" />
                    <div className="flex items-center gap-1.5">
                      <Navigation className="w-4 h-4 text-mjs-red flex-shrink-0" />
                      <div>
                        <div className="text-[8px] md:text-[10px] text-gray-400 font-semibold uppercase">Distance</div>
                        <div className="text-[11px] md:text-sm font-black text-mjs-dark">{distance}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-mjs-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-mjs-red animate-spin" />
      </div>
    }>
      <TrackingContent />
    </Suspense>
  );
}
