"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import {
  X,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ShieldCheck,
  Truck,
  ArrowRight,
} from "lucide-react";

export default function CartPanel() {
  const {
    items,
    isOpen,
    closeCart,
    updateQty,
    removeItem,
    clearCart,
    itemCount,
    subtotal,
  } = useCart();

  const freeDeliveryThreshold = 399;
  const remaining = freeDeliveryThreshold - subtotal;
  const freeDeliveryProgress = Math.min(
    (subtotal / freeDeliveryThreshold) * 100,
    100
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity"
        onClick={closeCart}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-[420px] bg-white z-[70] shadow-2xl flex flex-col animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-mjs-dark" />
            <h2 className="text-base font-bold text-mjs-dark">Your Cart</h2>
            {itemCount > 0 && (
              <span className="bg-mjs-red text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-mjs-gray-500" />
          </button>
        </div>

        {/* Empty State */}
        {items.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
            <div className="w-16 h-16 bg-mjs-gray-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="w-7 h-7 text-mjs-gray-400" />
            </div>
            <div className="text-base font-bold text-mjs-gray-800 mb-1">
              Your cart is empty
            </div>
            <p className="text-sm text-mjs-gray-400 mb-6">
              Add items to get started
            </p>
            <button
              onClick={closeCart}
              className="inline-flex items-center gap-2 bg-mjs-red hover:bg-mjs-red-dark text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors"
            >
              Continue Shopping
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Cart Items */}
        {items.length > 0 && (
          <>
            {/* Free Delivery Progress */}
            <div className="px-5 py-3 bg-mjs-gray-50 border-b border-gray-100">
              {remaining > 0 ? (
                <>
                  <div className="text-xs text-mjs-gray-600 mb-1.5">
                    Add{" "}
                    <span className="font-bold text-mjs-dark">
                      ${remaining.toFixed(2)}
                    </span>{" "}
                    more for{" "}
                    <span className="font-bold text-mjs-green">
                      FREE delivery
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-mjs-green rounded-full transition-all duration-500"
                      style={{ width: `${freeDeliveryProgress}%` }}
                    />
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 text-xs font-semibold text-mjs-green">
                  <Truck className="w-4 h-4" />
                  You qualify for FREE delivery!
                </div>
              )}
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto">
              {items.map((item) => (
                <div
                  key={item.slug}
                  className="flex gap-3 px-5 py-4 border-b border-gray-100"
                >
                  {/* Image */}
                  <a
                    href={`/product/${item.slug}`}
                    onClick={closeCart}
                    className="w-[72px] h-[72px] bg-mjs-gray-50 rounded-xl overflow-hidden flex-shrink-0"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </a>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <a
                      href={`/product/${item.slug}`}
                      onClick={closeCart}
                      className="text-sm font-semibold text-mjs-gray-800 hover:text-mjs-red transition-colors line-clamp-1"
                    >
                      {item.name}
                    </a>
                    <div className="text-[11px] text-mjs-gray-400 mt-0.5">
                      {item.brand} &middot; {item.pack}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Qty Controls */}
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQty(item.slug, item.qty - 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                          <Minus className="w-3 h-3 text-mjs-gray-600" />
                        </button>
                        <span className="w-8 h-7 flex items-center justify-center text-xs font-semibold text-mjs-dark border-x border-gray-200">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item.slug, item.qty + 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                          <Plus className="w-3 h-3 text-mjs-gray-600" />
                        </button>
                      </div>

                      {/* Price + Remove */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-mjs-dark">
                          ${(item.price * item.qty).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeItem(item.slug)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-mjs-gray-400 hover:text-mjs-red" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-5 py-4 bg-white">
              {/* Subtotal */}
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-mjs-gray-500">Subtotal</span>
                <span className="text-sm font-semibold text-mjs-gray-700">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-mjs-gray-500">Shipping</span>
                <span className="text-sm font-semibold text-mjs-gray-700">
                  {subtotal >= freeDeliveryThreshold ? (
                    <span className="text-mjs-green">FREE</span>
                  ) : (
                    "Calculated at checkout"
                  )}
                </span>
              </div>
              <div className="h-px bg-gray-200 mb-3" />
              <div className="flex items-center justify-between mb-4">
                <span className="text-base font-bold text-mjs-dark">
                  Estimated Total
                </span>
                <span className="text-xl font-black text-mjs-dark">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              {/* CTA */}
              <Link
                href="/cart"
                onClick={closeCart}
                className="w-full bg-mjs-red hover:bg-mjs-red-dark text-white font-bold py-3 rounded-lg text-sm transition-all hover:shadow-lg hover:shadow-red-500/20 flex items-center justify-center gap-2 mb-2"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={closeCart}
                className="w-full text-sm font-medium text-mjs-gray-500 hover:text-mjs-gray-700 py-2 transition-colors"
              >
                Continue Shopping
              </button>

              {/* Trust */}
              <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1 text-[10px] text-mjs-gray-400">
                  <ShieldCheck className="w-3 h-3" />
                  Secure Checkout
                </div>
                <div className="flex items-center gap-1 text-[10px] text-mjs-gray-400">
                  <Truck className="w-3 h-3" />
                  Free Delivery $399+
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </>
  );
}
