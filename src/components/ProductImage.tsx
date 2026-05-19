"use client";

import { useState, useRef } from "react";
import Image from "next/image";

// SKU → video file path mapping
const PRODUCT_VIDEOS: Record<string, string> = {
  "6342EA": "/videos/6342EA.mp4",
  "6343EA": "/videos/6342EA.mp4",
  "6344EA": "/videos/6342EA.mp4",
  "6345EA": "/videos/6342EA.mp4",
  "VCPF-48SEA": "/videos/VCPF-48.mp4",
  "VCPF-48MEA": "/videos/VCPF-48.mp4",
  "VCPF-48LEA": "/videos/VCPF-48.mp4",
  "VCPF-48XLEA": "/videos/VCPF-48.mp4",
  "LPF-56SEA": "/videos/LPF-56.mp4",
  "LPF-56MEA": "/videos/LPF-56.mp4",
  "LPF-56LEA": "/videos/LPF-56.mp4",
  "LPF-56XLEA": "/videos/LPF-56.mp4",
  "6302EA": "/videos/nitrile-blue.mp4",
  "6303EA": "/videos/nitrile-blue.mp4",
  "6304EA": "/videos/nitrile-blue.mp4",
  "6305EA": "/videos/nitrile-blue.mp4",
  "8601": "/videos/nitrile-blue.mp4",
  "5602": "/videos/5602.mp4",
  "5603P": "/videos/5602.mp4",
  "5604P": "/videos/5602.mp4",
  "5200": "/videos/5200.mp4",
  "8036": "/videos/8036.mp4",
  "5135": "/videos/5135.mp4",
};

export function getVideoForSku(sku: string): string | undefined {
  return PRODUCT_VIDEOS[sku];
}

interface ProductImageProps {
  src: string;
  alt: string;
  sku?: string;
  imageFit?: "contain" | "cover";
  sizes?: string;
  className?: string;
}

export default function ProductImage({ src, alt, sku, imageFit = "contain", sizes = "200px", className }: ProductImageProps) {
  const [hovering, setHovering] = useState(false);
  const hoverTimer = useRef<NodeJS.Timeout | null>(null);
  const videoId = sku ? PRODUCT_VIDEOS[sku] : undefined;

  return (
    <div
      className={`relative w-full h-full ${className || ""}`}
      onMouseEnter={() => {
        if (videoId) {
          hoverTimer.current = setTimeout(() => setHovering(true), 300);
        }
      }}
      onMouseLeave={() => {
        if (hoverTimer.current) clearTimeout(hoverTimer.current);
        setHovering(false);
      }}
    >
      {/* Video on hover */}
      {videoId && hovering ? (
        <video
          src={videoId}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-contain bg-white"
        />
      ) : src?.startsWith("http") ? (
        <Image
          src={src}
          alt={alt}
          fill
          unoptimized
          sizes={sizes}
          className={imageFit === "contain" ? "object-contain p-4" : "object-cover"}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <svg className="w-8 h-8 text-mjs-red animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
        </div>
      )}
    </div>
  );
}
