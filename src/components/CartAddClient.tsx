"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { ProductData } from "@/data/products";

// Parses "5602:2,CL404814:1" (quantity optional, defaults to 1)
function parseItems(raw: string): { sku: string; qty: number }[] {
  return raw.split(",").map(part => {
    const [sku, q] = part.split(":");
    const qty = Math.max(1, Math.min(99, parseInt(q || "1", 10) || 1));
    return { sku: (sku || "").trim(), qty };
  }).filter(i => i.sku).slice(0, 40);
}

export default function CartAddClient() {
  const params = useSearchParams();
  const router = useRouter();
  const { addItem } = useCart();
  const [status, setStatus] = useState("Adding items to your cart…");
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    const items = parseItems(params.get("items") || "");
    if (items.length === 0) { router.replace("/cart"); return; }

    fetch(`/api/products/by-skus?skus=${encodeURIComponent(items.map(i => i.sku).join(","))}`)
      .then(r => r.json())
      .then(data => {
        const bySku = new Map<string, ProductData>((data.products || []).map((p: ProductData) => [p.sku.toUpperCase(), p]));
        let added = 0;
        for (const { sku, qty } of items) {
          const p = bySku.get(sku.toUpperCase());
          if (!p) continue;
          addItem({ slug: p.slug, sku: p.sku, name: p.cardTitle || p.name, brand: p.brand, price: p.price, image: p.images[0], pack: p.pack }, qty);
          added++;
        }
        setStatus(added > 0 ? `Added ${added} item${added === 1 ? "" : "s"}. Taking you to your cart…` : "Those items aren't available right now. Taking you to your cart…");
        setTimeout(() => router.replace("/cart"), 600);
      })
      .catch(() => router.replace("/cart"));
  }, [params, router, addItem]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-mjs-gray-50">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-mjs-red animate-spin mx-auto mb-3" />
        <p className="text-sm font-semibold text-mjs-dark">{status}</p>
      </div>
    </div>
  );
}
