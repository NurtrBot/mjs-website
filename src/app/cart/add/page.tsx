import { Suspense } from "react";
import type { Metadata } from "next";
import CartAddClient from "@/components/CartAddClient";

export const metadata: Metadata = {
  title: "Adding to your cart…",
  robots: { index: false, follow: false },
};

/**
 * Cart deep link: /cart/add?items=5602:2,CL404814:1
 * Adds the listed SKUs (with quantities) to the cart and continues to /cart.
 * Used by replenishment emails and documented in llms.txt for AI agents.
 */
export default function CartAddPage() {
  return (
    <Suspense fallback={null}>
      <CartAddClient />
    </Suspense>
  );
}
