import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Products",
  description: "Search 10,000+ janitorial, cleaning, and facility supplies at Mobile Janitorial Supply. Find products by name, SKU, brand, or category.",
  robots: { index: false, follow: true }, // Don't index search result pages
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
