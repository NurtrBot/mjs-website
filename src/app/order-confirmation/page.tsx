"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import {
  CheckCircle, Truck, Store, CreditCard, FileText,
  ArrowRight, Phone, UserPlus, Package, Shield, Clock,
  RotateCcw, ShoppingCart, Gift,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { trackPurchase, trackSelectReward } from "@/lib/analytics";

interface OrderItem {
  name: string;
  sku: string;
  qty: number;
  price: number;
  image: string;
  pack: string;
}

interface OrderDetails {
  items: OrderItem[];
  subtotal: number;
  promoCode?: string | null;
  promoDiscount?: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: { name: string; company: string; address: string; city: string; state: string; zip: string; phone: string } | null;
  customerName: string;
  isTaxExempt: boolean;
  rewardTier?: {
    type: "physical" | "giftcard";
    amount: number;
    label: string;
    minSpend: number;
    gifts: { id: string; name: string; image: string; description?: string }[];
  } | null;
}

interface GiftCardResult {
  redeemLink: string;
  amount: number;
  name: string;
  rewardId: string;
  image: string;
}

function ConfirmationContent() {
  const { user, isLoggedIn } = useAuth();
  const params = useSearchParams();
  const orderId = params.get("order") || "";
  const method = params.get("method") || "bill";
  const fulfillment = params.get("fulfillment") || "delivery";
  const shipping = params.get("shipping") || "";
  const shippingCost = Number(params.get("shippingCost") || "0");

  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [showGiftPicker, setShowGiftPicker] = useState(false);
  const [giftLoading, setGiftLoading] = useState(false);
  const [giftCardResult, setGiftCardResult] = useState<GiftCardResult | null>(null);
  const [giftFlipped, setGiftFlipped] = useState(false);
  const [giftClaimed, setGiftClaimed] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("mjs_order_confirm");
      if (stored) {
        const data = JSON.parse(stored);
        setOrderDetails(data);
        sessionStorage.removeItem("mjs_order_confirm");
        // Track purchase in GA4
        if (data.items) {
          trackPurchase(
            orderId,
            data.total || 0,
            data.tax || 0,
            data.shipping || 0,
            data.items.map((i: OrderItem) => ({ sku: i.sku, name: i.name, price: i.price, quantity: i.qty }))
          );
        }
        // Show gift picker after 2 seconds if order qualifies
        if (data.rewardTier) {
          setTimeout(() => setShowGiftPicker(true), 2000);
        }
      }
    } catch {}
  }, []);

  const handleGiftSelect = async (gift: { id: string; name: string; image: string }) => {
    if (!orderDetails?.rewardTier) return;
    setGiftLoading(true);
    const tier = orderDetails.rewardTier;

    if (tier.type === "giftcard") {
      try {
        const email = user?.email || orderDetails?.shippingAddress?.name || "";
        const res = await fetch("/api/rewards/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recipientName: orderDetails.customerName || "Valued Customer",
            recipientEmail: email,
            productId: gift.id,
            amount: tier.amount,
            orderId: orderId,
          }),
        });
        const data = await res.json();
        setGiftCardResult({
          redeemLink: data.redeemLink || "",
          amount: tier.amount,
          name: gift.name,
          rewardId: data.rewardId || "",
          image: gift.image,
        });
      } catch {
        setGiftCardResult({ redeemLink: "", amount: tier.amount, name: gift.name, rewardId: "", image: gift.image });
      }
    }
    // For physical gifts, just record the selection
    trackSelectReward(gift.name, tier.label, tier.amount);
    setGiftLoading(false);
  };

  const isPickup = fulfillment === "pickup";
  const customerName = orderDetails?.customerName || user?.firstName || "there";

  // Estimated delivery dates (3-5 business days)
  const now = new Date();
  const estStart = new Date(now);
  estStart.setDate(estStart.getDate() + 3);
  // Skip weekends
  while (estStart.getDay() === 0 || estStart.getDay() === 6) estStart.setDate(estStart.getDate() + 1);
  const estEnd = new Date(estStart);
  estEnd.setDate(estEnd.getDate() + 2);
  while (estEnd.getDay() === 0 || estEnd.getDay() === 6) estEnd.setDate(estEnd.getDate() + 1);
  const dateFmt = (d: Date) => d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen">
        {/* ═══ Hero Banner ═══ */}
        <div className="bg-mjs-dark text-white">
          <div className="max-w-[1100px] mx-auto px-4 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 bg-mjs-red/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-mjs-red" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-mjs-red">Order Confirmed</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black leading-tight">
                Thanks, {customerName}.<br />
                Your supplies are <span className="italic font-serif font-normal text-mjs-red">on the way.</span>
              </h1>
              <p className="text-sm text-gray-300 font-semibold mt-3 max-w-md leading-relaxed">
                We&apos;ve received your order and our warehouse team is packing it now.
                {!isPickup && " You'll get tracking details as soon as it ships."}
                {isPickup && " We'll notify you when it's ready for pickup."}
              </p>
            </div>
            <div className="bg-white/10 border border-white/15 rounded-2xl px-8 py-5 text-center flex-shrink-0 w-full md:w-auto md:min-w-[220px]">
              <div className="text-[10px] font-bold uppercase tracking-wider text-mjs-red">Order Number</div>
              <div className="text-3xl font-black mt-1 tracking-tight">{orderId}</div>
              <div className="mt-3 text-[11px]">
                <div className="text-gray-500 uppercase text-[9px]">Placed</div>
                <div className="font-bold text-sm text-gray-300">{now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1100px] mx-auto px-4 py-8">
          {/* ═══ Order Progress ═══ */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-bold text-mjs-red uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1 h-4 bg-mjs-red rounded-full" />
                Order Progress
              </h2>
              {!isPickup && (
                <span className="text-xs text-mjs-gray-500">
                  Estimated delivery <span className="font-bold text-mjs-dark">{dateFmt(estStart)} — {dateFmt(estEnd)}</span>
                </span>
              )}
            </div>
            <div className="flex items-start w-full">
              {[
                { label: "Placed", sub: `Today, ${now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`, done: true, pulse: true },
                { label: "Processing", sub: "Up next", done: false, pulse: false },
                { label: isPickup ? "Ready" : "Shipped", sub: "", done: false, pulse: false },
                { label: isPickup ? "Picked Up" : "Delivered", sub: "", done: false, pulse: false },
              ].map((step, i, arr) => (
                <React.Fragment key={i}>
                  <div className="flex flex-col items-center relative flex-shrink-0">
                    {step.pulse && (
                      <div className="absolute w-10 h-10 bg-mjs-red/30 rounded-full animate-ping" />
                    )}
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold relative z-10 ${
                      step.done ? "bg-mjs-red text-white shadow-lg shadow-red-200" : "bg-gray-100 text-mjs-gray-400 border border-gray-200"
                    }`}>
                      {step.done ? <CheckCircle className="w-5 h-5" /> : i + 1}
                    </div>
                    <div className="mt-2.5 text-center">
                      <div className={`text-[11px] font-bold ${step.done ? "text-mjs-dark" : "text-mjs-gray-400"}`}>{step.label}</div>
                      {step.sub && <div className={`text-[9px] mt-0.5 ${step.done ? "text-mjs-gray-500" : "text-mjs-gray-400"}`}>{step.sub}</div>}
                    </div>
                  </div>
                  {i < arr.length - 1 && (
                    <div className={`flex-1 h-1 mt-4 mx-3 rounded-full ${step.done ? "bg-mjs-red" : "bg-gray-200"}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ═══ Left Column — Order Items + Delivery ═══ */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items */}
              {orderDetails && orderDetails.items.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xs font-bold text-mjs-red uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-1 h-4 bg-mjs-red rounded-full" />
                      Your Order &middot; {orderDetails.items.reduce((s, i) => s + i.qty, 0)} Item{orderDetails.items.reduce((s, i) => s + i.qty, 0) !== 1 ? "s" : ""}
                    </h2>
                  </div>

                  <div className="divide-y divide-gray-50">
                    {orderDetails.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-4 py-3">
                        <div className="w-14 h-14 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-mjs-dark truncate">{item.name}</div>
                          <div className="text-[10px] text-mjs-gray-400 mt-0.5">
                            {item.pack} &middot; SKU {item.sku} &middot; Qty {item.qty}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-sm font-bold text-mjs-dark">${(item.price * item.qty).toFixed(2)}</div>
                          <div className="text-[10px] text-mjs-gray-400">${item.price.toFixed(2)} / ea</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Totals — from BigCommerce actual calculations */}
                  <div className="border-t border-gray-100 mt-3 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-mjs-gray-500">Subtotal</span>
                      <span className="font-semibold">${orderDetails.subtotal.toFixed(2)}</span>
                    </div>
                    {(orderDetails.promoDiscount || 0) > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-emerald-600">Discount{orderDetails.promoCode ? ` (${orderDetails.promoCode})` : ""}</span>
                        <span className="font-semibold text-emerald-600">−${(orderDetails.promoDiscount || 0).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-mjs-gray-500">Shipping</span>
                      <span className={`font-semibold ${orderDetails.shipping === 0 ? "text-emerald-600" : ""}`}>
                        {orderDetails.shipping === 0 ? "FREE" : `$${orderDetails.shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-mjs-gray-500">Tax</span>
                      <span className={`font-semibold ${orderDetails.isTaxExempt ? "text-emerald-600" : ""}`}>
                        {orderDetails.isTaxExempt ? "TAX EXEMPT" : `$${orderDetails.tax.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="border-t border-gray-100 pt-2 flex justify-between">
                      <span className="text-sm font-bold text-mjs-dark">Total charged</span>
                      <span className="text-xl font-black text-mjs-dark">${orderDetails.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* ═══ Right Column — Actions ═══ */}
            <div className="space-y-6">
              {/* What's Next */}
              <div className="bg-mjs-red rounded-2xl p-6 text-white">
                <div className="text-[10px] font-bold uppercase tracking-wider text-white/60 mb-1">What&apos;s Next</div>
                <h3 className="text-base font-bold mb-2">Track your order anytime</h3>
                <p className="text-xs text-white/70 leading-relaxed mb-5">
                  Get live updates, download invoices, and manage your deliveries from your account dashboard.
                </p>
                {isLoggedIn ? (
                  <a href="/account" className="block w-full bg-white text-mjs-red font-bold py-3 rounded-xl text-sm text-center hover:bg-gray-50 transition-colors">
                    View my orders &rarr;
                  </a>
                ) : (
                  <a href="/auth" className="block w-full bg-white text-mjs-red font-bold py-3 rounded-xl text-sm text-center hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Sign up to track orders
                  </a>
                )}
                <a href="/" className="block w-full bg-white/15 text-white font-bold py-3 rounded-xl text-sm text-center hover:bg-white/25 transition-colors mt-3">
                  Continue shopping
                </a>
              </div>
            </div>
          </div>

          {/* ═══ Delivery & Payment + Need Help — side by side ═══ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Delivery & Payment */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-xs font-bold text-mjs-red uppercase tracking-wider flex items-center gap-1.5 mb-4">
                <span className="w-1 h-4 bg-mjs-red rounded-full" />
                Delivery & Payment
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {isPickup ? <Store className="w-4 h-4 text-emerald-600" /> : <Truck className="w-4 h-4 text-blue-600" />}
                    <span className="text-xs font-bold text-mjs-dark uppercase">{isPickup ? "Pickup At" : "Shipping To"}</span>
                  </div>
                  {isPickup ? (
                    <div className="text-xs text-mjs-gray-600 leading-relaxed">
                      <div className="font-semibold">Anaheim Warehouse</div>
                      <div>3066 E. La Palma Ave.</div>
                      <div>Anaheim, CA 92806</div>
                      <div className="mt-1 text-emerald-600 font-medium">Mon–Fri, 6:30 AM – 2:45 PM</div>
                    </div>
                  ) : orderDetails?.shippingAddress ? (
                    <div className="text-xs text-mjs-gray-600 leading-relaxed">
                      <div className="font-semibold">{orderDetails.shippingAddress.name}</div>
                      {orderDetails.shippingAddress.company && <div>{orderDetails.shippingAddress.company}</div>}
                      <div>{orderDetails.shippingAddress.address}</div>
                      <div>{orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.zip}</div>
                      {orderDetails.shippingAddress.phone && <div>{orderDetails.shippingAddress.phone}</div>}
                    </div>
                  ) : (
                    <div className="text-xs text-mjs-gray-500">{shipping}</div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {method === "card" ? <CreditCard className="w-4 h-4 text-mjs-gray-500" /> : <FileText className="w-4 h-4 text-mjs-gray-500" />}
                    <span className="text-xs font-bold text-mjs-dark uppercase">Payment</span>
                  </div>
                  <div className="text-xs text-mjs-gray-600 leading-relaxed">
                    <div className="font-semibold">
                      {method === "bill" ? "Bill to Account — Net 30" : method === "cash" ? "Cash on Pickup" : "Credit Card"}
                    </div>
                    <div>
                      {method === "bill" ? "Invoice will be sent to your company"
                        : method === "cash" ? "Payment collected at pickup"
                        : "Payment processed successfully"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Need Help */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
              <div className="text-[10px] font-bold uppercase tracking-wider text-mjs-gray-400 mb-1">Need Help?</div>
              <h3 className="text-sm font-bold text-mjs-dark mb-2">We&apos;re here for you</h3>
              <p className="text-xs text-mjs-gray-500 leading-relaxed mb-4 flex-1">
                Questions about your order, delivery, or need to change something? Our Orange County team is standing by.
              </p>
              <a href="tel:7147792640" className="flex items-center justify-center gap-2 w-full border border-gray-200 rounded-xl py-3 text-sm font-bold text-mjs-dark hover:bg-gray-50 transition-colors">
                <Phone className="w-4 h-4" />
                (714) 779-2640
              </a>
              <div className="text-[10px] text-mjs-gray-400 text-center mt-2">Mon-Fri &middot; 6:30 AM – 3:00 PM PST</div>
            </div>
          </div>

          {/* ═══ Value Props ═══ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {[
              { icon: Truck, title: "Free delivery on $399+", sub: "OC / LA / Inland Empire" },
              { icon: FileText, title: "Net-30 terms available", sub: "Invoice-based billing for qualified accounts" },
              { icon: Truck, title: "1-3 Day Local Delivery", sub: "OC / LA / IE / San Diego" },
            ].map((prop) => (
              <div key={prop.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col items-center text-center">
                <prop.icon className="w-6 h-6 text-mjs-gray-400 mb-2" />
                <div className="text-xs font-bold text-mjs-dark">{prop.title}</div>
                <div className="text-[10px] text-mjs-gray-400 mt-0.5">{prop.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />

      {/* Gift Card / Physical Gift Picker Modal */}
      {showGiftPicker && orderDetails?.rewardTier && !giftCardResult && !giftClaimed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-in fade-in duration-500">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-md" />
          <div className="relative w-full max-w-[95vw] sm:max-w-[620px] rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="bg-mjs-dark px-6 py-8 text-center relative overflow-hidden">
              <div className="absolute top-[-50px] left-[-30px] w-[150px] h-[150px] bg-mjs-red/10 rounded-full animate-pulse" />
              <div className="absolute bottom-[-40px] right-[-20px] w-[120px] h-[120px] bg-mjs-red/5 rounded-full animate-pulse" style={{ animationDelay: "1s" }} />
              <button onClick={() => { setShowGiftPicker(false); setGiftClaimed(true); }} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors text-sm z-10">&#10005;</button>
              <div className="relative z-10">
                <div className="text-5xl mb-3 animate-bounce" style={{ animationDuration: "2s" }}>{orderDetails.rewardTier.type === "giftcard" ? "💳" : "🎁"}</div>
                <div className="text-xs font-bold uppercase tracking-[3px] text-mjs-red mb-3">You Earned a Reward</div>
                <div className="text-2xl font-black text-white mb-1">
                  {orderDetails.rewardTier.type === "giftcard" ? `Pick Your FREE $${orderDetails.rewardTier.amount} Gift Card` : "Pick Your FREE Gift"}
                </div>
                <div className="text-sm text-gray-300 mt-2">
                  Your order unlocks the <span className="text-mjs-red font-bold">{orderDetails.rewardTier.label} Tier</span>
                </div>
              </div>
            </div>
            {/* Gift Options */}
            <div className="bg-white p-6">
              {giftLoading ? (
                <div className="text-center py-10">
                  <div className="relative inline-block mb-5">
                    <div className="w-20 h-20 rounded-full border-4 border-gray-100 border-t-mjs-red animate-spin mx-auto" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl">💳</span>
                    </div>
                  </div>
                  <div className="text-lg font-black text-mjs-dark mb-1">Reserving Your Gift Card...</div>
                  <div className="flex items-center justify-center gap-1 mt-4">
                    <div className="w-2 h-2 bg-mjs-red rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-mjs-red rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-mjs-red rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-[10px] font-bold text-mjs-gray-400 uppercase tracking-wider text-center mb-5">Choose One</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {orderDetails.rewardTier.gifts.map((gift, idx) => (
                      <button
                        key={gift.id}
                        onClick={() => handleGiftSelect(gift)}
                        className="text-center bg-white rounded-xl border-2 border-gray-100 p-3 hover:border-mjs-red hover:shadow-xl transition-all duration-300 group hover:scale-[1.03]"
                      >
                        <div className="w-full h-[60px] overflow-hidden rounded-lg mb-2 flex items-center justify-center">
                          <img src={gift.image} alt={gift.name} className="w-full h-full object-contain" />
                        </div>
                        <div className="text-[11px] font-bold text-mjs-dark group-hover:text-mjs-red transition-colors">{gift.name}</div>
                        <div className="text-xs font-black text-mjs-red mt-0.5">${orderDetails.rewardTier!.amount} FREE</div>
                        <div className="mt-2 bg-mjs-red text-white text-[9px] font-bold py-1.5 rounded-lg group-hover:bg-red-700 transition-colors w-full text-center opacity-0 group-hover:opacity-100 transition-opacity">Select</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Gift Card Reveal Modal */}
      {giftCardResult && !giftClaimed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-in fade-in duration-500">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-md" onClick={() => { setGiftCardResult(null); setGiftClaimed(true); }} />
          <div className="relative w-full max-w-[95vw] sm:max-w-[480px] rounded-3xl shadow-2xl overflow-hidden bg-white animate-in zoom-in-95 duration-500">
            <div className="bg-mjs-dark px-6 py-6 text-center">
              <button onClick={() => { setGiftCardResult(null); setGiftClaimed(true); }} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors text-sm z-10">&#10005;</button>
              <div className="text-4xl mb-2">&#127881;</div>
              <div className="text-xl font-black text-white">Your Gift Card is Reserved!</div>
              <div className="text-sm text-gray-400 mt-1">${giftCardResult.amount} {giftCardResult.name} Gift Card</div>
              <div className="mt-3 inline-flex items-center gap-2 bg-emerald-500/20 rounded-full px-4 py-1.5">
                <span className="text-emerald-400 text-xs">&#10003;</span>
                <span className="text-xs font-semibold text-emerald-400">Confirmed</span>
              </div>
            </div>
            <div className="p-6 text-center">
              {/* Brand Card — front only, no flip */}
              <div className="w-full max-w-[280px] sm:max-w-[340px] mx-auto mb-5 rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
                <img src={giftCardResult.image} alt={giftCardResult.name} className="w-full h-auto" />
              </div>

              <div className="text-lg font-black text-mjs-dark mb-1">${giftCardResult.amount}.00 {giftCardResult.name}</div>

              {/* Delivery timeline */}
              <div className="bg-gray-50 rounded-xl p-4 mt-4 mb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-mjs-red" />
                  <span className="text-xs font-bold text-mjs-dark">Arriving in 72 Hours</span>
                </div>
                <p className="text-[11px] text-mjs-gray-500 leading-relaxed">
                  Your gift card will be delivered to your email within 72 hours after your order is verified. Keep an eye on your inbox!
                </p>
                <div className="mt-3 flex items-center justify-center gap-2">
                  <div className="text-[10px] text-mjs-gray-400">Delivering to:</div>
                  <div className="text-[11px] font-semibold text-mjs-dark">{user?.email || orderDetails?.shippingAddress?.name || ""}</div>
                </div>
              </div>

              <button onClick={() => { setGiftCardResult(null); setGiftClaimed(true); }} className="w-full bg-mjs-dark text-white font-bold text-sm py-3 rounded-xl hover:bg-gray-800 transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin" />
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}
