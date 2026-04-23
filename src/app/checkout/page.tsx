"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useOrderSetup } from "@/context/OrderContext";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Building2, Loader2 } from "lucide-react";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Truck,
  Lock,
  CreditCard,
  ChevronDown,
  ChevronUp,
  Store,
  Tag,
  Gift,
  CheckCircle,
} from "lucide-react";
import { trackPromoCode } from "@/lib/analytics";

// Physical gifts — $500 tier
const PHYSICAL_GIFTS = [
  { id: "carhartt-beanie", name: "Carhartt Watch Hat", description: "Acrylic knit beanie — Carhartt Brown", image: "/images/rewards/carhartt-beanie.webp" },
  { id: "arctic-tumbler", name: "Arctic Tumbler 20oz", description: "Matte black insulated tumbler with straw", image: "/images/rewards/arctic-tumbler.webp" },
  { id: "jbl-speaker", name: "JBL Charge Essential", description: "Waterproof Bluetooth speaker", image: "/images/rewards/jbl-speaker.avif" },
];

// Digital gift cards — $1,000+ tiers (from Tremendous campaign)
const GIFT_CARDS = [
  { id: "OKMHM2X2OHYV", name: "Amazon", image: "https://testflight.tremendous.com/product_images/OKMHM2X2OHYV/card" },
  { id: "DC82VBYLI4CC", name: "Apple", image: "https://testflight.tremendous.com/product_images/DC82VBYLI4CC/card" },
  { id: "2XG0FLQXBDCZ", name: "Starbucks", image: "https://testflight.tremendous.com/product_images/2XG0FLQXBDCZ/card" },
  { id: "AFO794BZA8LR", name: "Home Depot", image: "https://testflight.tremendous.com/product_images/AFO794BZA8LR/card" },
  { id: "3VHRRUUEWXR7", name: "Shell Gas", image: "https://testflight.tremendous.com/product_images/3VHRRUUEWXR7/card" },
  { id: "GL3Y4RNQJAQ1", name: "Southwest Airlines", image: "https://testflight.tremendous.com/product_images/GL3Y4RNQJAQ1/card" },
  { id: "L9SW3VT4MLW4", name: "Dick's Sporting Goods", image: "https://testflight.tremendous.com/product_images/L9SW3VT4MLW4/card" },
  { id: "9OEIQ5EWBWT9", name: "DoorDash", image: "https://testflight.tremendous.com/product_images/9OEIQ5EWBWT9/card" },
  { id: "CRN0ID07Y2XD", name: "Chipotle", image: "https://testflight.tremendous.com/product_images/CRN0ID07Y2XD/card" },
];

// Tier thresholds
const REWARD_TIERS = [
  { minSpend: 500, label: "Bronze", type: "physical" as const, amount: 0, gifts: PHYSICAL_GIFTS },
  { minSpend: 1000, label: "Silver", type: "giftcard" as const, amount: 25, gifts: GIFT_CARDS },
  { minSpend: 2500, label: "Gold", type: "giftcard" as const, amount: 50, gifts: GIFT_CARDS },
  { minSpend: 3500, label: "Platinum", type: "giftcard" as const, amount: 75, gifts: GIFT_CARDS },
  { minSpend: 5000, label: "Diamond", type: "giftcard" as const, amount: 100, gifts: GIFT_CARDS },
];

export default function CheckoutPage() {
  const { items, subtotal, itemCount, clearCart } = useCart();
  const { user } = useAuth();
  const { orderSetup, clearOrderSetup } = useOrderSetup();
  const router = useRouter();
  const [placing, setPlacing] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [selectedGift, setSelectedGift] = useState<{ id: string; name: string; tier: string; type: "physical" | "giftcard"; amount?: number } | null>(null);
  const [step, setStep] = useState(1);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [shippingEstimate, setShippingEstimate] = useState<number | null>(null);
  const [shippingName, setShippingName] = useState("");
  const [estimatingShipping, setEstimatingShipping] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<"bill" | "card" | "cash" | "">(
    (orderSetup?.paymentMethod as "bill" | "card" | "cash") || ""
  );
  const [fulfillmentType, setFulfillmentType] = useState<"delivery" | "pickup">(
    (orderSetup?.fulfillment as "delivery" | "pickup") || "delivery"
  );

  const isPickup = fulfillmentType === "pickup";
  const isBillToAccount = selectedPayment === "bill";
  const isCash = selectedPayment === "cash";

  const [isTaxExempt, setIsTaxExempt] = useState(false);
  useEffect(() => {
    if (user?.id) {
      fetch(`/api/customers/tax-id?customerId=${user.id}`)
        .then(r => r.json())
        .then(data => { if (data.uploaded) setIsTaxExempt(true); })
        .catch(() => {});
    }
  }, [user?.id]);

  // Promo code
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState<{ code: string; discount: number; name: string; appliesTo?: string } | null>(null);
  const [promoError, setPromoError] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);

  const applyPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoError("");
    setPromoLoading(true);
    try {
      const res = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: promoCode.trim(),
          subtotal,
          items: items.map(i => ({
            price: i.price,
            qty: i.qty,
            name: i.name || "",
            sku: i.sku || "",
            category: (i as unknown as Record<string, string>).category || "",
            subcategory: (i as unknown as Record<string, string>).subcategory || "",
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.valid) {
        setPromoError(data.error || "Invalid promo code");
      } else {
        setPromoApplied({ code: data.code, discount: data.discount, name: data.name, appliesTo: data.appliesTo });
        trackPromoCode(data.code, data.discount);
      }
    } catch {
      setPromoError("Failed to validate code");
    }
    setPromoLoading(false);
  };

  const removePromo = () => {
    setPromoApplied(null);
    setPromoCode("");
    setPromoError("");
  };

  const promoDiscount = promoApplied?.discount || 0;
  const taxableSubtotal = subtotal - promoDiscount;
  // Tax is estimated at 7.75% for display — BC calculates the actual tax at order creation
  const estimatedTaxRate = 0.0775;
  const tax = isTaxExempt ? 0 : taxableSubtotal * estimatedTaxRate;
  const shipping = isPickup ? 0 : shippingEstimate ?? 0;
  const total = taxableSubtotal + tax + shipping;

  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    company: "",
    address: "",
    apt: "",
    city: "",
    state: "CA",
    zip: "",
    phone: "",
    sameAsBilling: true,
    billingFirstName: "",
    billingLastName: "",
    billingCompany: "",
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

  // Auto-fill from order setup + user data
  useEffect(() => {
    const ship = orderSetup?.shipTo;
    const names = (user?.firstName || "").split(" ");
    setForm(prev => ({
      ...prev,
      email: user?.email || prev.email,
      firstName: user?.firstName || prev.firstName,
      lastName: user?.lastName || prev.lastName,
      company: ship?.company || user?.company || prev.company,
      address: ship?.address || prev.address,
      city: ship?.city || prev.city,
      state: ship?.state || prev.state || "CA",
      zip: ship?.zip || prev.zip,
      phone: user?.phone || prev.phone,
      cardName: user ? `${user.firstName} ${user.lastName}` : prev.cardName,
    }));
  }, [user, orderSetup]);

  const update = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const [editBillTo, setEditBillTo] = useState(false);
  const [billTo, setBillTo] = useState({
    company: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "CA",
    zip: "",
  });

  // Delivery zone detection
  const getDeliveryZone = (zip: string): "oc" | "la" | "ie" | "sd" | "ups" => {
    const prefix = zip.slice(0, 3);
    const ocZips = ["926", "927", "928"];
    const laZips = ["900", "901", "902", "903", "904", "905", "906", "907", "908", "909", "910", "911", "912", "913", "914", "915", "916", "917", "918"];
    const ieZips = ["920", "921", "922", "923", "924", "925"];
    const sdZips = ["919", "930", "931", "932", "933", "934", "935"];
    if (ocZips.includes(prefix)) return "oc";
    if (laZips.includes(prefix)) return "la";
    if (ieZips.includes(prefix)) return "ie";
    if (sdZips.includes(prefix)) return "sd";
    return "ups";
  };

  // Fetch real shipping estimate when zip changes
  useEffect(() => {
    if (isPickup || !form.zip || form.zip.length < 5 || items.length === 0) {
      if (isPickup) {
        setShippingEstimate(0);
        setShippingName("FREE Pickup");
      }
      return;
    }

    const zone = getDeliveryZone(form.zip);

    // Local delivery zones
    const isLoggedIn = !!user?.id;

    if (zone === "oc" || zone === "la" || zone === "ie") {
      if (subtotal >= 399) {
        setShippingEstimate(0);
        setShippingName("FREE Delivery");
        setEstimatingShipping(false);
        return;
      }
      // Under threshold — logged-in customers get flat $35, guests get UPS
      if (isLoggedIn) {
        setShippingEstimate(35);
        setShippingName("Local Delivery");
        setEstimatingShipping(false);
        return;
      }
      // Guest — fall through to UPS rate
    }

    if (zone === "sd") {
      if (subtotal >= 699) {
        setShippingEstimate(0);
        setShippingName("FREE Delivery");
        setEstimatingShipping(false);
        return;
      }
      // Under threshold — logged-in customers get flat $65, guests get UPS
      if (isLoggedIn) {
        setShippingEstimate(65);
        setShippingName("San Diego Delivery");
        setEstimatingShipping(false);
        return;
      }
      // Guest — fall through to UPS rate
    }

    // All other orders — get real UPS rate
    setEstimatingShipping(true);
    fetch("/api/shipping/estimate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map(i => ({ sku: i.sku || i.slug, productId: i.productId, quantity: i.qty })),
        zip: form.zip,
        state: form.state || "",
        city: form.city || "",
      }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.rates?.length > 0) {
          const deliveryRates = data.rates.filter((r: { type: string }) => r.type !== "pickupinstore" && r.type !== "pickup");
          const cheapest = deliveryRates.sort((a: { cost: number }, b: { cost: number }) => a.cost - b.cost)[0];
          if (cheapest) {
            setShippingEstimate(cheapest.cost);
            setShippingName(cheapest.name);
          } else {
            setShippingEstimate(0);
            setShippingName("Shipping");
          }
        }
        setEstimatingShipping(false);
      })
      .catch(() => { setEstimatingShipping(false); });
  }, [form.zip, form.state, items.length, isPickup, subtotal]);

  // Auto-fill billTo from order setup
  useEffect(() => {
    if (orderSetup?.billTo) {
      setBillTo({
        company: orderSetup.billTo.company || user?.company || "",
        name: orderSetup.billTo.name || (user ? `${user.firstName} ${user.lastName}` : ""),
        email: orderSetup.billTo.email || user?.email || "",
        phone: orderSetup.billTo.phone || user?.phone || "",
        address: "",
        city: "",
        state: "CA",
        zip: "",
      });
    } else if (user) {
      setBillTo({
        company: user.company || "",
        name: `${user.firstName} ${user.lastName}`,
        email: user.email || "",
        phone: user.phone || "",
        address: "",
        city: "",
        state: "CA",
        zip: "",
      });
    }
  }, [user, orderSetup]);

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
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
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

              {/* Bill To — only for logged-in customer accounts */}
              {user?.id && (
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
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
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
              )}

              {/* Fulfillment Selection */}
              <section className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <h2 className="text-base font-bold text-mjs-dark mb-4">
                  How would you like to receive your order?
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setFulfillmentType("delivery")}
                    className={`relative rounded-xl border-2 p-4 text-center transition-all ${
                      !isPickup
                        ? "border-mjs-red bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Truck className={`w-6 h-6 mx-auto mb-2 ${!isPickup ? "text-mjs-red" : "text-mjs-gray-400"}`} />
                    <div className={`text-sm font-bold ${!isPickup ? "text-mjs-dark" : "text-mjs-gray-600"}`}>Delivery</div>
                    <div className="text-[10px] text-mjs-gray-400 mt-0.5">Ship to your address</div>
                  </button>
                  <button
                    onClick={() => setFulfillmentType("pickup")}
                    className={`relative rounded-xl border-2 p-4 text-center transition-all ${
                      isPickup
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Store className={`w-6 h-6 mx-auto mb-2 ${isPickup ? "text-emerald-600" : "text-mjs-gray-400"}`} />
                    <div className={`text-sm font-bold ${isPickup ? "text-mjs-dark" : "text-mjs-gray-600"}`}>Pick Up</div>
                    <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Always FREE</div>
                  </button>
                </div>
              </section>

              {/* Shipping / Pickup Details */}
              <section className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <h2 className="text-base font-bold text-mjs-dark mb-4">
                  {isPickup ? "Pickup Location" : "Shipping Address"}
                </h2>

                {isPickup ? (
                  <div>
                    {/* Contact info for pickup (needed for order confirmation) */}
                    {!user?.id && (
                      <div className="mb-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className={labelClass}>Email</label>
                            <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="your@email.com" className={inputClass} />
                          </div>
                          <div>
                            <label className={labelClass}>Phone</label>
                            <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="(714) 555-0100" className={inputClass} />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mt-3">
                          <div>
                            <label className={labelClass}>First Name</label>
                            <input type="text" value={form.firstName} onChange={(e) => update("firstName", e.target.value)} className={inputClass} />
                          </div>
                          <div>
                            <label className={labelClass}>Last Name</label>
                            <input type="text" value={form.lastName} onChange={(e) => update("lastName", e.target.value)} className={inputClass} />
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="bg-emerald-50 rounded-xl p-5 flex items-start gap-3">
                      <Store className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-bold text-emerald-700">Will Call — Anaheim Warehouse</div>
                        <div className="text-xs text-emerald-600 mt-1">3066 E. La Palma Ave, Anaheim, CA 92806</div>
                        <div className="text-xs text-emerald-600 mt-0.5">Mon — Fri, 6:30 AM — 2:45 PM</div>
                        <div className="text-xs text-emerald-500 mt-2 font-medium">Your order will be ready for pickup once confirmed.</div>
                        <div className="mt-3 inline-flex items-center gap-1.5 bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-full">
                          <ShieldCheck className="w-3 h-3" />
                          FREE — No Shipping Charge
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="your@email.com"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Phone</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      placeholder="(555) 555-5555"
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-3">
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
                </>
                )}
              </section>

              {/* Billing Address — only show for credit card customers */}
              {!isBillToAccount && !isCash && (
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
                        <input type="text" value={form.billingFirstName} onChange={(e) => update("billingFirstName", e.target.value)} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Last Name</label>
                        <input type="text" value={form.billingLastName} onChange={(e) => update("billingLastName", e.target.value)} className={inputClass} />
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className={labelClass}>Company (optional)</label>
                      <input type="text" value={form.billingCompany} onChange={(e) => update("billingCompany", e.target.value)} className={inputClass} />
                    </div>
                    <div className="mt-3">
                      <label className={labelClass}>Street Address</label>
                      <input type="text" value={form.billingAddress} onChange={(e) => update("billingAddress", e.target.value)} className={inputClass} />
                    </div>
                    <div className="grid grid-cols-3 gap-3 mt-3">
                      <div>
                        <label className={labelClass}>City</label>
                        <input type="text" value={form.billingCity} onChange={(e) => update("billingCity", e.target.value)} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>State</label>
                        <input type="text" value={form.billingState} onChange={(e) => update("billingState", e.target.value)} maxLength={2} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>ZIP Code</label>
                        <input type="text" value={form.billingZip} onChange={(e) => update("billingZip", e.target.value)} className={inputClass} />
                      </div>
                    </div>
                  </>
                )}
              </section>
              )}

              {/* Payment */}
              <section className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  {isBillToAccount ? (
                    <Building2 className="w-5 h-5 text-blue-500" />
                  ) : (
                    <CreditCard className="w-5 h-5 text-mjs-gray-400" />
                  )}
                  <h2 className="text-base font-bold text-mjs-dark">
                    Payment
                  </h2>
                </div>

                {/* Payment method selector for logged-in users */}
                {user?.id && (
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <button
                      onClick={() => setSelectedPayment("bill")}
                      className={`p-4 rounded-xl border-2 text-center transition-all ${
                        selectedPayment === "bill"
                          ? "border-mjs-red bg-red-50"
                          : "border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <Building2 className={`w-5 h-5 mx-auto mb-1.5 ${selectedPayment === "bill" ? "text-mjs-red" : "text-mjs-gray-400"}`} />
                      <div className="text-xs font-semibold text-mjs-dark">Bill to Account</div>
                      <div className="text-[10px] text-mjs-gray-500">Net 30 Terms</div>
                    </button>
                    <button
                      onClick={() => setSelectedPayment("card")}
                      className={`p-4 rounded-xl border-2 text-center transition-all ${
                        selectedPayment === "card"
                          ? "border-mjs-red bg-red-50"
                          : "border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <CreditCard className={`w-5 h-5 mx-auto mb-1.5 ${selectedPayment === "card" ? "text-mjs-red" : "text-mjs-gray-400"}`} />
                      <div className="text-xs font-semibold text-mjs-dark">Credit Card</div>
                      <div className="text-[10px] text-mjs-gray-500">Pay Now</div>
                    </button>
                  </div>
                )}

                {isBillToAccount ? (
                  <div className="bg-blue-50 rounded-xl p-5">
                    <div className="text-sm font-bold text-blue-700">Bill to Account — Net 30 Terms</div>
                    <div className="text-xs text-blue-600 mt-1">{billTo.company}</div>
                    <div className="text-xs text-blue-600">{billTo.name} &middot; {billTo.email}</div>
                    <p className="text-xs text-blue-500 mt-3">
                      This order will be billed to your company account. Payment is due within 30 days of invoice date.
                    </p>
                  </div>
                ) : isCash ? (
                  <div className="bg-green-50 rounded-xl p-5">
                    <div className="text-sm font-bold text-green-700">Cash on Pickup</div>
                    <div className="text-xs text-green-600 mt-1">Payment will be collected at our Anaheim warehouse when you pick up your order.</div>
                    <div className="text-xs text-green-600 mt-2">3066 E. La Palma Ave, Anaheim, CA 92806</div>
                  </div>
                ) : (
                  <>
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
                          onChange={(e) => {
                            let v = e.target.value.replace(/[^\d]/g, "");
                            if (v.length > 4) v = v.slice(0, 4);
                            if (v.length >= 3) v = v.slice(0, 2) + " / " + v.slice(2);
                            update("expiry", v);
                          }}
                          placeholder="MM / YY"
                          maxLength={7}
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
                  </>
                )}
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
              {orderError && (
                <div className="bg-red-50 text-red-600 text-sm font-medium px-4 py-3 rounded-xl mb-4">
                  {orderError}
                </div>
              )}
              <button
                disabled={placing}
                onClick={async () => {
                  setPlacing(true);
                  setOrderError("");
                  try {
                    const payMethod = selectedPayment || "card";
                    const fulfill = isPickup ? "pickup" : "delivery";

                    // Require payment selection for logged-in users
                    if (user?.id && !selectedPayment) {
                      setOrderError("Please select a payment method — Bill to Account or Credit Card.");
                      setPlacing(false);
                      return;
                    }

                    // Build shipping address — use pickup address for pickup orders
                    const shipAddr = isPickup ? {
                      firstName: form.firstName || user?.firstName || "Pickup",
                      lastName: form.lastName || user?.lastName || "Customer",
                      email: form.email || user?.email || "",
                      company: form.company || user?.company || "",
                      address1: "3066 E La Palma Ave",
                      city: "Anaheim",
                      state: "CA",
                      zip: "92806",
                      phone: form.phone || user?.phone || "",
                    } : {
                      firstName: form.firstName,
                      lastName: form.lastName,
                      email: form.email || user?.email || "",
                      company: form.company || "",
                      address1: form.address,
                      address2: form.apt || "",
                      city: form.city,
                      state: form.state,
                      zip: form.zip,
                      phone: form.phone || "",
                    };

                    if (!isPickup && !shipAddr.address1) {
                      setOrderError("Please enter a shipping address.");
                      setPlacing(false);
                      return;
                    }

                    if (!shipAddr.email) {
                      setOrderError("Please enter your email address.");
                      setPlacing(false);
                      return;
                    }

                    // Validate card details if paying by card
                    if (payMethod === "card") {
                      if (!form.cardNumber || !form.expiry || !form.cvv || !form.cardName) {
                        setOrderError("Please fill in all credit card fields.");
                        setPlacing(false);
                        return;
                      }
                    }

                    const orderItems = items.map(item => ({
                      sku: item.sku || item.slug,
                      productId: item.productId,
                      quantity: item.qty,
                    }));

                    const res = await fetch("/api/orders/create", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        items: orderItems,
                        customerId: user?.id,
                        paymentMethod: payMethod,
                        fulfillment: fulfill,
                        shippingAddress: shipAddr,
                        billingAddress: isBillToAccount ? {
                          firstName: billTo.name?.split(" ")[0] || "",
                          lastName: billTo.name?.split(" ").slice(1).join(" ") || "",
                          email: billTo.email,
                          company: billTo.company,
                          address1: billTo.address || shipAddr.address1,
                          city: billTo.city || shipAddr.city,
                          state: billTo.state || shipAddr.state,
                          zip: billTo.zip || shipAddr.zip,
                          phone: billTo.phone || "",
                        } : undefined,
                        notes: form.notes || "",
                        couponCode: promoApplied?.code || undefined,
                        card: payMethod === "card" ? {
                          cardName: form.cardName,
                          cardNumber: form.cardNumber,
                          expiry: form.expiry,
                          cvv: form.cvv,
                        } : undefined,
                      }),
                    });

                    const data = await res.json();
                    if (!res.ok || !data.success) {
                      setOrderError(data.error || "Failed to place order. Please try again.");
                      setPlacing(false);
                      return;
                    }

                    // Store order details for confirmation page — use BC's actual totals
                    const bc = data.bcTotals || {};
                    try {
                      sessionStorage.setItem("mjs_order_confirm", JSON.stringify({
                        items: items.map(i => ({ name: i.name, sku: i.sku, qty: i.qty, price: i.price, image: i.image, pack: i.pack })),
                        subtotal: bc.subtotal || subtotal,
                        promoCode: promoApplied?.code || null,
                        promoDiscount: bc.discount || promoDiscount,
                        tax: bc.tax || (isTaxExempt ? 0 : tax),
                        shipping: bc.shipping || shipping,
                        total: bc.total || total,
                        shippingAddress: isPickup ? null : { name: `${form.firstName} ${form.lastName}`, company: form.company, address: form.address, city: form.city, state: form.state, zip: form.zip, phone: form.phone },
                        customerName: user ? `${user.firstName}` : form.firstName,
                        isTaxExempt,
                        freeGift: selectedGift?.name || null,
                        reward: data.reward || null,
                        rewardTier: (() => {
                          const tier = [...REWARD_TIERS].reverse().find(t => subtotal >= t.minSpend);
                          return tier ? { type: tier.type, amount: tier.amount, label: tier.label, minSpend: tier.minSpend, gifts: tier.gifts } : null;
                        })(),
                      }));
                    } catch {}

                    // Success — clear cart and redirect
                    clearCart();
                    clearOrderSetup();
                    router.push(`/order-confirmation?order=${data.orderNumber}&method=${payMethod}&fulfillment=${fulfill}&shipping=${encodeURIComponent(data.shippingMethod || "")}&shippingCost=${data.shippingCost || 0}`);
                  } catch (err) {
                    setOrderError("Something went wrong. Please try again or call (714) 779-2640.");
                    setPlacing(false);
                  }
                }}
                className="w-full bg-mjs-red hover:bg-mjs-red-dark text-white font-bold py-4 rounded-xl text-base transition-all hover:shadow-lg hover:shadow-red-500/20 flex items-center justify-center gap-2 mb-8 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {placing ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                ) : (
                  <><Lock className="w-4 h-4" />
                  {isBillToAccount
                    ? `Place Order — Bill to Account — $${total.toFixed(2)}`
                    : isCash
                    ? `Place Order — Pay at Pickup — $${total.toFixed(2)}`
                    : `Place Order — $${total.toFixed(2)}`
                  }</>
                )}
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

                  {/* Promo Code */}
                  <div className="mb-4">
                    {promoApplied ? (
                      <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <Tag className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-xs font-bold text-emerald-700">{promoApplied.code}</span>
                          <span className="text-[10px] text-emerald-600">−${promoApplied.discount.toFixed(2)}</span>
                        </div>
                        <button onClick={removePromo} className="text-emerald-400 hover:text-emerald-600 transition-colors text-xs font-semibold">
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={promoCode}
                            onChange={(e) => { setPromoCode(e.target.value.toUpperCase()); setPromoError(""); }}
                            placeholder="Promo code"
                            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-mjs-red transition-all font-mono tracking-wide"
                            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); applyPromo(); } }}
                          />
                          <button
                            onClick={applyPromo}
                            disabled={promoLoading || !promoCode.trim()}
                            className="bg-mjs-dark text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-40"
                          >
                            {promoLoading ? "..." : "Apply"}
                          </button>
                        </div>
                        {promoError && (
                          <div className="text-[11px] text-red-500 mt-1.5 font-medium">{promoError}</div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Totals */}
                  <div className="space-y-2.5 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-mjs-gray-500">Subtotal</span>
                      <span className="font-semibold text-mjs-gray-700">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                    {promoApplied && (
                      <div className="flex justify-between text-sm">
                        <span className="text-emerald-600">
                          Discount ({promoApplied.code})
                          {promoApplied.appliesTo === "select items" && (
                            <span className="text-[10px] text-emerald-500 block">Applied to liner items only</span>
                          )}
                        </span>
                        <span className="font-semibold text-emerald-600">−${promoApplied.discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-mjs-gray-500">
                        {shippingName || "Shipping"}
                      </span>
                      <span className="font-semibold text-mjs-gray-700">
                        {estimatingShipping ? (
                          <span className="text-mjs-gray-400">Calculating...</span>
                        ) : isPickup ? (
                          <span className="text-mjs-green">FREE (Pickup)</span>
                        ) : shippingEstimate === null ? (
                          <span className="text-mjs-gray-400">Enter zip code</span>
                        ) : shipping === 0 ? (
                          <span className="text-mjs-green">FREE</span>
                        ) : (
                          `$${shipping.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-mjs-gray-500">Est. Tax</span>
                      <span className={`font-semibold ${isTaxExempt ? "text-emerald-600" : "text-mjs-gray-700"}`}>
                        {isTaxExempt ? "TAX EXEMPT" : `$${tax.toFixed(2)}`}
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
                      Ships Nationwide
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
