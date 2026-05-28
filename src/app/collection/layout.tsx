import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collections | Best Sellers, New Arrivals & Ready to Ship",
  description: "Browse curated collections from Mobile Janitorial Supply: best-selling products, new arrivals, and in-stock ready-to-ship items. Wholesale prices with free local delivery.",
  keywords: "best selling cleaning products, new janitorial supplies, in stock cleaning products, ready to ship janitorial supplies",
};

export default function CollectionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
