"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Truck,
  Lock,
  CreditCard,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function CheckoutPage() {
  const { items, subtotal, itemCount } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [showOrderSummary, setShowOrderSummary] = useState(false);

  const freeDeliveryThreshold = 399;
  const taxRate = 0.0775;
  const tax = subtotal * taxRate;
  const shipping =
    subtotal >= freeDeliveryThreshold ? 0 : subtotal > 0 ? 35.00 : 0;
  const total = subtotal + tax + shipping;

  const [form, setForm] = useState({
    email: user?.email || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    company: user?.company || "",
    address: "",
    apt: "",
    city: "",
    state: "CA",
    zip: "",
    phone: "",
    sameAsBilling: true,
    billingFirstName: user?.firstName || "",
    billingLastName: user?.lastName || "",
    billingCompany: user?.company || "",
    billingAddress: "",
    billingApt: "",
    billingCity: "",
    billingState: "CA",
    billingZip: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardName: "",
    notes: "",
  });

  const update = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const [editBillTo, setEditBillTo] = useState(false);
  const [billTo, setBillTo] = useState({
    company: user?.company || "",
    name: user ? `${user.firstName} ${user.lastName}` : "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "CA",
    zip: "",
  });

  const inputClass =
    "w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mjs-red/20 focus:border-mjs-red/40 transition-colors bg-white";
  const labelClass = "text-xs font-semibold text-mjs-gray-500 mb-1.5 block";

  return (
    <div className="min-h-screen bg-mjs-gray-50">
      {/* Checkout Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[1100px] mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <img
              src="/images/mjs-logo.png"
              alt="Mobile Janitorial Supply"
              className="h-9 w-auto"
            />
            <span className="hidden sm:block text-sm font-black text-mjs-dark tracking-tight">
              MOBILE JANITORIAL SUPPLY
            </span>
          </Link>

          {/* Steps */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-medium">
            {["Cart", "Details", "Payment"].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                {i > 0 && (
                  <div
                    className={`w-8 h-px ${i <= step - 1 ? "bg-mjs-red" : "bg-gray-200"}`}
                  />
                )}
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      i + 1 <= step
                        ? "bg-mjs-red text-white"
                        : "bg-gray-100 text-mjs-gray-400"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span
                    className={
                      i + 1 <= step ? "text-mjs-dark" : "text-mjs-gray-400"
                    }
                  >
                    {s}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-mjs-gray-400">
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Secure Checkout</span>
          </div>
        </div>
      </header>

      <main className="max-w-[1100px] mx-auto px-4 py-8">
        {/* Empty state */}
        {items.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 py-20 text-center">
            <p className="text-mjs-gray-500 mb-4">Your cart is empty.</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-mjs-red text-white font-semibold px-6 py-3 rounded-lg text-sm hover:bg-mjs-red-dark transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>
        )}

        {items.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left — Form */}
            <div className="lg:col-span-3">
              {/* Back to cart */}
              <Link
                href="/cart"
                className="inline-flex items-center gap-1.5 text-sm text-mjs-gray-400 hover:text-mjs-red mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Cart
              </Link>

              {/* Bill To */}
              <section className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-mjs-dark">Bill To</h2>
                  <button
                    onClick={() => setEditBillTo(!editBillTo)}
                    className="text-xs text-mjs-red font-semibold hover:underline"
                  >
                    {editBillTo ? "Done" : "Edit"}
                  </button>
                </div>

                {!editBillTo ? (
                  <div className="bg-mjs-gray-50 rounded-xl p-4">
                    <div className="text-sm font-bold text-mjs-dark">{billTo.company || "Company Name"}</div>
                    <div className="text-xs text-mjs-gray-600 mt-1">{billTo.name || "Contact Name"}</div>
                    <div className="text-xs text-mjs-gray-500 mt-0.5">{billTo.email || "Email"}</div>
                    {billTo.phone && <div className="text-xs text-mjs-gray-500 mt-0.5">{billTo.phone}</div>}
                    {billTo.address && (
                      <div className="text-xs text-mjs-gray-500 mt-0.5">
                        {billTo.address}, {billTo.city}, {billTo.state} {billTo.zip}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className={labelClass}>Company Name</label>
                      <input type="text" value={billTo.company} onChange={(e) => setBillTo({ ...billTo, company: e.target.value })} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Contact Name</label>
                      <input type="text" value={billTo.name} onChange={(e) => setBillTo({ ...billTo, name: e.target.value })} className={inputClass} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>Email</label>
                        <input type="email" value={billTo.email} onChange={(e) => setBillTo({ ...billTo, email: e.target.value })} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Phone Number</label>
                        <input type="tel" value={billTo.phone} onChange={(e) => setBillTo({ ...billTo, phone: e.target.value })} placeholder="(555) 555-5555" className={inputClass} />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Billing Address</label>
                      <input type="text" value={billTo.address} onChange={(e) => setBillTo({ ...billTo, address: e.target.value })} placeholder="Street address" className={inputClass} />
                    </div>
                    <div className="grid grid-cols-6 gap-3">
                      <div className="col-span-3">
                        <label className={labelClass}>City</label>
                        <input type="text" value={billTo.city} onChange={(e) => setBillTo({ ...billTo, city: e.target.value })} className={inputClass} />
                      </div>
                      <div className="col-span-1">
                        <label className={labelClass}>State</label>
                        <input type="text" value={billTo.state} onChange={(e) => setBillTo({ ...billTo, state: e.target.value })} maxLength={2} className={inputClass} />
                      </div>
                      <div className="col-span-2">
                        <label className={labelClass}>ZIP</label>
                        <input type="text" value={billTo.zip} onChange={(e) => setBillTo({ ...billTo, zip: e.target.value })} className={inputClass} />
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* Shipping */}
              <section className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <h2 className="text-base font-bold text-mjs-dark mb-4">
                  Shipping Address
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>First Name</label>
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={(e) => update("firstName", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Last Name</label>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={(e) => update("lastName", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <label className={labelClass}>Company (optional)</label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => update("company", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="mt-3">
                  <label className={labelClass}>Street Address</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => update("address", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="mt-3">
                  <label className={labelClass}>
                    Apt / Suite / Unit (optional)
                  </label>
                  <input
                    type="text"
                    value={form.apt}
                    onChange={(e) => update("apt", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="grid grid-cols-3 gap-3 mt-3">
                  <div>
                    <label className={labelClass}>City</label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => update("city", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>State</label>
                    <input
                      type="text"
                      value={form.state}
                      onChange={(e) => update("state", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>ZIP Code</label>
                    <input
                      type="text"
                      value={form.zip}
                      onChange={(e) => update("zip", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
              </section>

              {/* Billing */}
              <section className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-mjs-dark">
                    Billing Address
                  </h2>
                </div>
                <label className="flex items-center gap-2.5 cursor-pointer mb-4">
                  <input
                    type="checkbox"
                    checked={form.sameAsBilling}
                    onChange={(e) => update("sameAsBilling", e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-mjs-red focus:ring-mjs-red/20"
                  />
                  <span className="text-sm text-mjs-gray-600">
                    Same as shipping address
                  </span>
                </label>

                {!form.sameAsBilling && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>First Name</label>
                        <input
                          type="text"
                          value={form.billingFirstName}
                          onChange={(e) =>
                            update("billingFirstName", e.target.value)
                          }
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Last Name</label>
                        <input
                          type="text"
                          value={form.billingLastName}
                          onChange={(e) =>
                            update("billingLastName", e.target.value)
                          }
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className={labelClass}>Company (optional)</label>
                      <input
                        type="text"
                        value={form.billingCompany}
                        onChange={(e) =>
                          update("billingCompany", e.target.value)
                        }
                        className={inputClass}
                      />
                    </div>
                    <div className="mt-3">
                      <label className={labelClass}>Street Address</label>
                      <input
                        type="text"
                        value={form.billingAddress}
                        onChange={(e) =>
                          update("billingAddress", e.target.value)
                        }
                        className={inputClass}
                      />
                    </div>
                    <div className="mt-3">
                      <label className={labelClass}>
                        Apt / Suite / Unit (optional)
                      </label>
                      <input
                        type="text"
                        value={form.billingApt}
                        onChange={(e) => update("billingApt", e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3 mt-3">
                      <div>
                        <label className={labelClass}>City</label>
                        <input
                          type="text"
                          value={form.billingCity}
                          onChange={(e) =>
                            update("billingCity", e.target.value)
                          }
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>State</label>
                        <input
                          type="text"
                          value={form.billingState}
                          onChange={(e) =>
                            update("billingState", e.target.value)
                          }
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>ZIP Code</label>
                        <input
                          type="text"
                          value={form.billingZip}
                          onChange={(e) => update("billingZip", e.target.value)}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </>
                )}
              </section>

              {/* Payment */}
              <section className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="w-5 h-5 text-mjs-gray-400" />
                  <h2 className="text-base font-bold text-mjs-dark">
                    Payment
                  </h2>
                </div>
                <p className="text-xs text-mjs-gray-400 mb-4">
                  Your credit card billing may reflect our corporate name
                  Bergman Inc.
                </p>
                <div className="mb-3">
                  <label className={labelClass}>Name on Card</label>
                  <input
                    type="text"
                    value={form.cardName}
                    onChange={(e) => update("cardName", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="mb-3">
                  <label className={labelClass}>Card Number</label>
                  <input
                    type="text"
                    value={form.cardNumber}
                    onChange={(e) => update("cardNumber", e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    className={inputClass}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Expiration</label>
                    <input
                      type="text"
                      value={form.expiry}
                      onChange={(e) => update("expiry", e.target.value)}
                      placeholder="MM / YY"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>CVV</label>
                    <input
                      type="text"
                      value={form.cvv}
                      onChange={(e) => update("cvv", e.target.value)}
                      placeholder="123"
                      className={inputClass}
                    />
                  </div>
                </div>
              </section>

              {/* Order Notes */}
              <section className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <h2 className="text-base font-bold text-mjs-dark mb-4">
                  Order Notes (optional)
                </h2>
                <textarea
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  placeholder="Special delivery instructions, PO number, etc."
                  rows={3}
                  className={inputClass + " resize-none"}
                />
              </section>

              {/* Place Order */}
              <button className="w-full bg-mjs-red hover:bg-mjs-red-dark text-white font-bold py-4 rounded-xl text-base transition-all hover:shadow-lg hover:shadow-red-500/20 flex items-center justify-center gap-2 mb-8">
                <Lock className="w-4 h-4" />
                Place Order &mdash; ${total.toFixed(2)}
              </button>
            </div>

            {/* Right — Order Summary */}
            <div className="lg:col-span-2">
              {/* Mobile toggle */}
              <button
                onClick={() => setShowOrderSummary(!showOrderSummary)}
                className="lg:hidden w-full bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between mb-4"
              >
                <span className="text-sm font-semibold text-mjs-dark">
                  Order Summary ({itemCount} items)
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-mjs-dark">
                    ${total.toFixed(2)}
                  </span>
                  {showOrderSummary ? (
                    <ChevronUp className="w-4 h-4 text-mjs-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-mjs-gray-400" />
                  )}
                </div>
              </button>

              <div
                className={`${showOrderSummary ? "block" : "hidden"} lg:block`}
              >
                <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-[80px]">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-bold text-mjs-dark">
                      Order Summary
                    </h2>
                    <Link
                      href="/cart"
                      className="text-xs font-medium text-mjs-red hover:underline"
                    >
                      Edit Cart
                    </Link>
                  </div>

                  <div className="text-xs text-mjs-gray-400 mb-3">
                    {itemCount} {itemCount === 1 ? "Item" : "Items"}
                  </div>

                  {/* Items */}
                  <div className="space-y-3 mb-5 max-h-[320px] overflow-y-auto pt-3 -mt-3">
                    {items.map((item) => (
                      <div key={item.slug} className="flex gap-3 pl-1">
                        <div className="w-14 h-14 flex-shrink-0 relative overflow-visible">
                          <div className="w-full h-full bg-mjs-gray-50 rounded-lg overflow-hidden border border-gray-100">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="absolute -top-2 -right-2 bg-mjs-red text-white text-[9px] font-bold rounded-full flex items-center justify-center min-w-[20px] min-h-[20px] z-10 shadow-sm">
                            {item.qty}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-mjs-gray-700 line-clamp-2">
                            {item.name}
                          </div>
                          <div className="text-[10px] text-mjs-gray-400 mt-0.5">
                            {item.brand}
                          </div>
                        </div>
                        <span className="text-xs font-bold text-mjs-dark flex-shrink-0">
                          ${(item.price * item.qty).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="h-px bg-gray-100 mb-4" />

                  {/* Totals */}
                  <div className="space-y-2.5 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-mjs-gray-500">Subtotal</span>
                      <span className="font-semibold text-mjs-gray-700">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-mjs-gray-500">Shipping</span>
                      <span className="font-semibold text-mjs-gray-700">
                        {shipping === 0 ? (
                          <span className="text-mjs-green">FREE</span>
                        ) : (
                          `$${shipping.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-mjs-gray-500">Sales Tax</span>
                      <span className="font-semibold text-mjs-gray-700">
                        ${tax.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="h-px bg-gray-200 mb-4" />

                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-mjs-dark">
                      Total
                    </span>
                    <span className="text-xl font-black text-mjs-dark">
                      ${total.toFixed(2)}
                    </span>
                  </div>

                  {/* Trust */}
                  <div className="flex flex-col gap-2 mt-5 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-[11px] text-mjs-gray-400">
                      <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
                      256-bit SSL Encrypted Checkout
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-mjs-gray-400">
                      <Truck className="w-3.5 h-3.5 flex-shrink-0" />
                      Free Delivery on Orders $399+
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
