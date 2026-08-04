"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface TrackingMapProps {
  driverLat: number;
  driverLng: number;
  deliveryLat: number;
  deliveryLng: number;
  status: string;
  routeCoords?: [number, number][];
  driverName?: string;
  driverPhoto?: string;
  customerName?: string;
  deliveryAddress?: string;
}

// MJS Warehouse location (always shown)
// 3066 E La Palma Ave, Anaheim, CA 92806 — exact geocoded coordinates
const WAREHOUSE = { lat: 33.8508, lng: -117.8582 };

const driverIcon = L.divIcon({
  className: "",
  html: `<div style="position:relative;width:72px;height:48px;">
    <div class="truck-pulse" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:60px;height:60px;border-radius:50%;background:rgba(220,38,38,0.15);animation:truckPulse 2s ease-in-out infinite;"></div>
    <img src="/images/mjs-truck-pin.png" style="position:relative;width:64px;height:auto;filter:drop-shadow(0 4px 8px rgba(0,0,0,0.25));z-index:2;" />
  </div>`,
  iconSize: [72, 48],
  iconAnchor: [36, 24],
});

const deliveryIcon = L.divIcon({
  className: "",
  html: `<div style="display:flex;flex-direction:column;align-items:center;">
    <div style="width:36px;height:36px;background:#1a1a2e;border:3px solid white;border-radius:50%;box-shadow:0 3px 12px rgba(0,0,0,0.25);display:flex;align-items:center;justify-content:center;">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
    </div>
  </div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

const warehouseIcon = L.divIcon({
  className: "",
  html: `<div style="position:relative;">
    <img src="/images/mjs-warehouse-pin.png" style="width:56px;height:auto;filter:drop-shadow(0 3px 6px rgba(0,0,0,0.2));border-radius:6px;" />
  </div>`,
  iconSize: [56, 40],
  iconAnchor: [28, 20],
});

const mapStyles = `
  .tracking-popup .leaflet-popup-content-wrapper {
    border-radius: 12px;
    padding: 0;
    box-shadow: 0 4px 20px rgba(0,0,0,0.12);
    border: 1px solid #f0f0f0;
  }
  .tracking-popup .leaflet-popup-content {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  .tracking-popup .leaflet-popup-tip {
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }
  @keyframes truckPulse {
    0%, 100% { transform: translate(-50%,-50%) scale(0.8); opacity: 0.6; }
    50% { transform: translate(-50%,-50%) scale(1.4); opacity: 0; }
  }
  @keyframes routeFlow {
    from { stroke-dashoffset: 24; }
    to { stroke-dashoffset: 0; }
  }
`;

export default function TrackingMap({
  driverLat, driverLng, deliveryLat, deliveryLng, status, routeCoords,
  driverName, driverPhoto, customerName, deliveryAddress,
}: TrackingMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const driverMarkerRef = useRef<L.Marker | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current || initializedRef.current) return;
    initializedRef.current = true;

    const styleEl = document.createElement("style");
    styleEl.textContent = mapStyles;
    document.head.appendChild(styleEl);

    const centerLat = driverLat || WAREHOUSE.lat;
    const centerLng = driverLng || WAREHOUSE.lng;

    const map = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView([centerLat, centerLng], 13);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
      subdomains: "abcd",
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);
    mapRef.current = map;

    // Warehouse pin (always shown)
    const warehousePopupHtml = `
      <div style="padding:10px 12px;text-align:center;">
        <div style="font-size:11px;font-weight:800;color:#1a1a2e;">MJS Warehouse</div>
        <div style="font-size:10px;color:#999;margin-top:2px;">3066 E. La Palma Ave, Anaheim</div>
      </div>
    `;
    L.marker([WAREHOUSE.lat, WAREHOUSE.lng], { icon: warehouseIcon })
      .bindPopup(warehousePopupHtml, { className: "tracking-popup", closeButton: false, offset: [0, -6] })
      .addTo(map);

    // Delivery marker
    if (deliveryLat && deliveryLng) {
      const deliveryPopupHtml = `
        <div style="padding:12px 14px;min-width:160px;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
            <div style="width:28px;height:28px;background:#1a1a2e;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            </div>
            <div>
              <div style="font-size:11px;color:#999;font-weight:600;">Delivering to</div>
              <div style="font-size:13px;font-weight:800;color:#1a1a2e;">${customerName || "Customer"}</div>
            </div>
          </div>
          <div style="font-size:11px;color:#666;line-height:1.4;padding-left:36px;">${deliveryAddress || ""}</div>
        </div>
      `;
      L.marker([deliveryLat, deliveryLng], { icon: deliveryIcon })
        .bindPopup(deliveryPopupHtml, { className: "tracking-popup", closeButton: false, offset: [0, -8] })
        .addTo(map);
    }

    // Driver marker
    if (driverLat && driverLng) {
      const driverAvatarHtml = driverPhoto
        ? `<img src="${driverPhoto}" style="width:56px;height:56px;border-radius:50%;object-fit:cover;margin:0 auto 8px;display:block;border:2px solid #eee;" />`
        : `<div style="width:56px;height:56px;background:#1a1a2e;border-radius:50%;margin:0 auto 8px;display:flex;align-items:center;justify-content:center;"><span style="color:white;font-weight:800;font-size:22px;">${(driverName || "D").charAt(0)}</span></div>`;
      const driverPopupHtml = `
        <div style="padding:14px 16px;min-width:150px;text-align:center;">
          ${driverAvatarHtml}
          <div style="font-size:11px;color:#999;font-weight:600;">Your Driver</div>
          <div style="font-size:16px;font-weight:800;color:#1a1a2e;margin-top:2px;">${driverName || "Driver"}</div>
          <div style="font-size:10px;color:#dc2626;font-weight:700;margin-top:4px;">● En Route</div>
        </div>
      `;
      driverMarkerRef.current = L.marker([driverLat, driverLng], { icon: driverIcon })
        .bindPopup(driverPopupHtml, { className: "tracking-popup", closeButton: false, offset: [0, -12] })
        .addTo(map);
    }

    // Route line — solid with glow + animated flow
    if (driverLat && driverLng && deliveryLat && deliveryLng) {
      const coords = (routeCoords && routeCoords.length > 1)
        ? routeCoords
        : [[driverLat, driverLng], [deliveryLat, deliveryLng]] as [number, number][];

      // Glow layer
      L.polyline(coords, {
        color: "#dc2626",
        weight: 12,
        opacity: 0.1,
        lineCap: "round",
        lineJoin: "round",
      }).addTo(map);

      // Main solid line
      routeLineRef.current = L.polyline(coords, {
        color: "#dc2626",
        weight: 4,
        opacity: 0.85,
        lineCap: "round",
        lineJoin: "round",
      }).addTo(map);

      // Animated flow line on top
      const flowLine = L.polyline(coords, {
        color: "#ffffff",
        weight: 2,
        opacity: 0.5,
        lineCap: "round",
        lineJoin: "round",
        dashArray: "6, 18",
      }).addTo(map);

      // Animate the dash
      const el = (flowLine as unknown as { _path?: SVGPathElement })._path;
      if (el) {
        el.style.animation = "routeFlow 1.5s linear infinite";
      }

      // Fit bounds to show warehouse, driver, and delivery
      const allPoints: [number, number][] = [
        [WAREHOUSE.lat, WAREHOUSE.lng],
        [driverLat, driverLng],
      ];
      if (deliveryLat && deliveryLng) allPoints.push([deliveryLat, deliveryLng]);
      map.fitBounds(L.latLngBounds(allPoints), { padding: [50, 50], maxZoom: 13 });
    }

    return () => {
      map.remove();
      mapRef.current = null;
      driverMarkerRef.current = null;
      routeLineRef.current = null;
      initializedRef.current = false;
      styleEl.remove();
    };
  }, []);

  // Update driver position
  useEffect(() => {
    if (!mapRef.current || !driverLat || !driverLng) return;
    if (driverMarkerRef.current) {
      driverMarkerRef.current.setLatLng([driverLat, driverLng]);
    }
    if (routeLineRef.current && deliveryLat && deliveryLng) {
      if (routeCoords && routeCoords.length > 1) {
        routeLineRef.current.setLatLngs(routeCoords);
      } else {
        routeLineRef.current.setLatLngs([[driverLat, driverLng], [deliveryLat, deliveryLng]]);
      }
    }
  }, [driverLat, driverLng, routeCoords]);

  return <div ref={containerRef} className="w-full h-full" style={{ background: "#f0f0f0" }} />;
}
