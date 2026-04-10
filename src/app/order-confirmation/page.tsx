"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CheckCircle, Package, Truck, Store, ArrowRight, Phone } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function ConfirmationContent() {
  const params = useSearchParams();
  const orderId = params.get("order") || "";
  const method = params.get("method") || "bill";
  const fulfillment = params.get("fulfillment") || "delivery";
  const shipping = params.get("shipping") || "";
  const shippingCost = params.get("shippingCost") || "0";

  return (
    <>
      <Header />
      <main className="bg-mjs-gray-50 min-h-[70vh]">
        <div className="max-w-[600px] mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>

            <h1 className="text-2xl font-black text-mjs-dark mb-2">Order Placed!</h1>
            <p className="text-sm text-mjs-gray-500 mb-6">
              Thank you for your order. Your order number is:
            </p>

            <div className="bg-mjs-gray-50 rounded-xl px-6 py-4 mb-6 inline-block">
              <span className="text-2xl font-black text-mjs-red">{orderId}</span>
            </div>

            {/* Order Details */}
            <div className="space-y-3 mb-8 text-left">
              <div className="flex items-center gap-3 bg-mjs-gray-50 rounded-xl p-4">
                {fulfillment === "pickup" ? (
                  <Store className="w-5 h-5 text-green-600 flex-shrink-0" />
                ) : (
                  <Truck className="w-5 h-5 text-blue-600 flex-shrink-0" />
                )}
                <div>
                  <div className="text-sm font-semibold text-mjs-dark">
                    {fulfillment === "pickup" ? "Will Call — Anaheim Warehouse" : shipping}
                  </div>
                  <div className="text-xs text-mjs-gray-500">
                    {fulfillment === "pickup"
                      ? "3066 E. La Palma Ave, Anaheim, CA 92806"
                      : Number(shippingCost) === 0 ? "FREE Shipping" : `Shipping: $${Number(shippingCost).toFixed(2)}`
                    }
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-mjs-gray-50 rounded-xl p-4">
                <Package className="w-5 h-5 text-mjs-gray-400 flex-shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-mjs-dark">
                    {method === "bill" ? "Bill to Account — Net 30"
                      : method === "cash" ? "Cash on Pickup"
                      : "Credit Card"}
                  </div>
                  <div className="text-xs text-mjs-gray-500">
                    {method === "bill" ? "Invoice will be sent to your company"
                      : method === "cash" ? "Payment collected at pickup"
                      : "Payment processed"}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <a
                href="/account"
                className="w-full bg-mjs-red hover:bg-red-700 text-white font-semibold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
              >
                View My Orders
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="/"
                className="w-full bg-mjs-gray-50 hover:bg-gray-100 text-mjs-dark font-semibold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
              >
                Continue Shopping
              </a>
            </div>

            {/* Support */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-xs text-mjs-gray-400 mb-2">Questions about your order?</p>
              <a href="tel:7147792640" className="inline-flex items-center gap-1.5 text-sm font-semibold text-mjs-red hover:text-red-700">
                <Phone className="w-4 h-4" />
                (714) 779-2640
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin" /></div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
