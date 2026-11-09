"use client";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { rdt, REDDIT_PIXEL_ID } from "@/lib/reddit-pixel";

export default function RedditPixel() {
  const pathname = usePathname();
  const inited = useRef(false);

  useEffect(() => {
    if (!inited.current) {
      rdt("init", REDDIT_PIXEL_ID);
      inited.current = true;
    }
    rdt("track", "PageVisit");
  }, [pathname]);

  return <Script src="https://www.redditstatic.com/ads/pixel.js" strategy="afterInteractive" />;
}
