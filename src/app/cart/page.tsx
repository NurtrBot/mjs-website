"use client";

import { useCart } from "@/context/CartContext";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  Minus,
  Plus,
  Trash2,
  Truck,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  Tag,
  X,
  PackageCheck,
  ShoppingCart,
  Sparkles,
} from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { allProducts } from "@/data/products";

export default function CartPage() {
  const { items, updateQty, removeItem, clearCart, addItem, itemCount, subtotal } =
    useCart();
  const [promoCode, setPromoCode] = useState("");
  const [showShippingPopup, setShowShippingPopup] = useState(false);
  const [animateBar, setAnimateBar] = useState(false);
  const [paperQty, setPaperQty] = useState(1);
  const [paperAdded, setPaperAdded] = useState(false);
  const router = useRouter();

  const copyPaper = {
    slug: "supreme-copy-paper-letter-20lb",
    name: "Supreme Copy Paper, Letter Size, 20 lb",
    brand: "Supreme",
    price: 52.99,
    image: "/images/product-copy-paper.png",
    pack: "10 Reams/Case",
  };

  const handleCheckout = () => {
    if (subtotal < freeDeliveryThreshold) {
      setShowShippingPopup(true);
      setTimeout(() => setAnimateBar(true), 100);
    } else {
      router.push("/checkout");
    }
  };

  const closePopup = () => {
    setAnimateBar(false);
    setShowShippingPopup(false);
    setPaperAdded(false);
    setPaperQty(1);
  };

  const handleAddPaper = () => {
    addItem(copyPaper, paperQty);
    setPaperAdded(true);
    setTimeout(() => setAnimateBar(true), 50);
  };

  const freeDeliveryThreshold = 399;
  const remaining = freeDeliveryThreshold - subtotal;
  const freeDeliveryProgress = Math.min(
    (subtotal / freeDeliveryThreshold) * 100,
    100
  );
  const taxRate = 0.0775;
  const tax = subtotal * taxRate;
  const shipping = subtotal >= freeDeliveryThreshold ? 0 : subtotal > 0 ? 35.00 : 0;
  const total = subtotal + tax + shipping;

  return (
    <>
      <TopBar />
      <Header />
      <main className="bg-mjs-gray-50 min-h-[60vh]">
        <div className="max-w-[1200px] mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-mjs-gray-400 mb-6">
            <Link href="/" className="hover:text-mjs-red transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-mjs-dark font-medium">Shopping Cart</span>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-black text-mjs-dark">
              Shopping Cart
              {itemCount > 0 && (
                <span className="text-base font-medium text-mjs-gray-400 ml-2">
                  ({itemCount} {itemCount === 1 ? "item" : "items"})
                </span>
              )}
            </h1>
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-sm text-mjs-gray-400 hover:text-mjs-red transition-colors"
              >
                Clear Cart
              </button>
            )}
          </div>

          {/* Free Delivery Banner */}
          {items.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
              {remaining > 0 ? (
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-mjs-gray-400 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-sm text-mjs-gray-600 mb-2">
                      Add{" "}
                      <span className="font-bold text-mjs-dark">
                        ${remaining.toFixed(2)}
                      </span>{" "}
                      more for{" "}
                      <span className="font-bold text-mjs-green">
                        FREE delivery
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-mjs-green rounded-full transition-all duration-500"
                        style={{ width: `${freeDeliveryProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm font-semibold text-mjs-green">
                  <Truck className="w-5 h-5" />
                  You qualify for FREE delivery!
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {items.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-200 py-20 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-mjs-gray-100 rounded-full flex items-center justify-center mb-5">
                <ShoppingBag className="w-9 h-9 text-mjs-gray-300" />
              </div>
              <h2 className="text-xl font-bold text-mjs-dark mb-2">
                Your cart is empty
              </h2>
              <p className="text-sm text-mjs-gray-400 mb-6 max-w-sm">
                Looks like you haven&apos;t added any products yet. Browse our
                catalog to find what you need.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-mjs-red hover:bg-mjs-red-dark text-white font-semibold px-8 py-3 rounded-lg text-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Continue Shopping
              </Link>
            </div>
          )}

          {/* Cart Content */}
          {items.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Items Column */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  {/* Table Header */}
                  <div className="hidden md:grid grid-cols-[1fr_120px_140px_100px_40px] gap-4 px-6 py-3 bg-mjs-gray-50 border-b border-gray-200 text-xs font-semibold text-mjs-gray-400 uppercase tracking-wider">
                    <span>Product</span>
                    <span className="text-center">Price</span>
                    <span className="text-center">Quantity</span>
                    <span className="text-right">Subtotal</span>
                    <span></span>
                  </div>

                  {/* Items */}
                  {items.map((item, index) => (
                    <div
                      key={item.slug}
                      className={`grid grid-cols-1 md:grid-cols-[1fr_120px_140px_100px_40px] gap-4 px-6 py-5 items-center ${
                        index < items.length - 1
                          ? "border-b border-gray-100"
                          : ""
                      }`}
                    >
                      {/* Product */}
                      <div className="flex items-center gap-4">
                        <Link
                          href={`/product/${item.slug}`}
                          className="w-20 h-20 bg-mjs-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </Link>
                        <div className="min-w-0">
                          <Link
                            href={`/product/${item.slug}`}
                            className="text-sm font-semibold text-mjs-dark hover:text-mjs-red transition-colors line-clamp-2"
                          >
                            {item.name}
                          </Link>
                          <div className="text-xs text-mjs-gray-400 mt-1">
                            {item.brand} &middot; {item.pack}
                          </div>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-sm font-semibold text-mjs-gray-600 text-center">
                        <span className="md:hidden text-xs text-mjs-gray-400 mr-1">
                          Price:
                        </span>
                        ${item.price.toFixed(2)}
                      </div>

                      {/* Quantity */}
                      <div className="flex items-center justify-center">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQty(item.slug, item.qty - 1)}
                            className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5 text-mjs-gray-600" />
                          </button>
                          <span className="w-12 h-9 flex items-center justify-center text-sm font-semibold text-mjs-dark border-x border-gray-200 bg-mjs-gray-50">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateQty(item.slug, item.qty + 1)}
                            className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5 text-mjs-gray-600" />
                          </button>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="text-sm font-bold text-mjs-dark text-right">
                        <span className="md:hidden text-xs text-mjs-gray-400 font-medium mr-1">
                          Subtotal:
                        </span>
                        ${(item.price * item.qty).toFixed(2)}
                      </div>

                      {/* Remove */}
                      <div className="flex justify-end">
                        <button
                          onClick={() => removeItem(item.slug)}
                          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors group"
                        >
                          <Trash2 className="w-4 h-4 text-mjs-gray-300 group-hover:text-mjs-red transition-colors" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Continue Shopping */}
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-sm font-medium text-mjs-gray-500 hover:text-mjs-red mt-4 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Continue Shopping
                </Link>
              </div>

              {/* Order Summary Column */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-[80px]">
                  <h2 className="text-lg font-bold text-mjs-dark mb-5">
                    Order Summary
                  </h2>

                  {/* Promo Code */}
                  <div className="mb-5">
                    <label className="text-xs font-medium text-mjs-gray-500 mb-1.5 block">
                      Promo Code
                    </label>
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Tag className="w-4 h-4 text-mjs-gray-300 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="Enter code"
                          className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mjs-red/20 focus:border-mjs-red/40"
                        />
                      </div>
                      <button className="px-4 py-2.5 bg-mjs-gray-100 hover:bg-mjs-gray-200 text-sm font-semibold text-mjs-gray-600 rounded-lg transition-colors">
                        Apply
                      </button>
                    </div>
                  </div>

                  <div className="h-px bg-gray-100 mb-4" />

                  {/* Totals */}
                  <div className="space-y-3 mb-4">
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
                      <span className="text-mjs-gray-500">
                        Sales Tax (7.75%)
                      </span>
                      <span className="font-semibold text-mjs-gray-700">
                        ${tax.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="h-px bg-gray-200 mb-4" />

                  <div className="flex justify-between items-center mb-6">
                    <span className="text-base font-bold text-mjs-dark">
                      Order Total
                    </span>
                    <span className="text-xl font-black text-mjs-dark">
                      ${total.toFixed(2)}
                    </span>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-mjs-red hover:bg-mjs-red-dark text-white font-bold py-3.5 rounded-lg text-sm transition-all hover:shadow-lg hover:shadow-red-500/20 flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Trust Badges */}
                  <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-1.5 text-[11px] text-mjs-gray-400">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Secure Checkout
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-mjs-gray-400">
                      <Truck className="w-3.5 h-3.5" />
                      Free Delivery $399+
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══ RECOMMENDED FOR YOU — UPSELL STRIP ═══ */}
          {items.length > 0 && (() => {
            const cartSlugs = new Set(items.map((i) => i.slug));
            const cartCategories = new Set(
              items.map((i) => allProducts.find((p) => p.slug === i.slug)?.category).filter(Boolean)
            );
            // Get category-matched products first, then fill with other popular items
            const categoryMatched = allProducts
              .filter((p) => !cartSlugs.has(p.slug) && cartCategories.has(p.category));
            const otherPopular = allProducts
              .filter((p) => !cartSlugs.has(p.slug) && !cartCategories.has(p.category))
              .sort((a, b) => b.reviewCount - a.reviewCount);
            const upsellProducts = [...categoryMatched, ...otherPopular].slice(0, 8);

            if (upsellProducts.length === 0) return null;

            return (
              <div className="mt-8 mb-2">
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  {/* Header */}
                  <div className="px-6 pt-5 pb-4 flex flex-wrap items-center gap-3">
                    <h3 className="text-sm font-bold text-mjs-dark">Recommended for You</h3>
                    <div className="flex items-center gap-1.5 bg-red-50 text-mjs-red text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                      <Sparkles className="w-3 h-3" />
                      Take an Extra 10% Off
                    </div>
                  </div>

                  {/* Products Grid */}
                  <div className="px-6 pb-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                      {upsellProducts.map((product) => {
                        const discountedPrice = +(product.price * 0.9).toFixed(2);
                        const savings = +(product.price - discountedPrice).toFixed(2);
                        return (
                          <div key={product.slug} className="bg-mjs-gray-50 rounded-xl border border-gray-100 p-3 flex flex-col group hover:shadow-md hover:border-gray-200 transition-all">
                            <a href={`/product/${product.slug}`} className="block h-[90px] mb-2 overflow-hidden rounded-lg bg-white">
                              <img src={product.images[0]} alt={product.cardTitle} className={`w-full h-full ${product.imageFit === "contain" ? "object-contain p-2" : "object-cover"}`} />
                            </a>
                            <div className="flex-1 min-h-[40px]">
                              <div className="text-[9px] text-mjs-gray-400 font-medium uppercase">{product.brand}</div>
                              <a href={`/product/${product.slug}`} className="text-[11px] font-semibold text-mjs-dark leading-tight line-clamp-2 group-hover:text-mjs-red transition-colors">
                                {product.cardTitle}
                              </a>
                            </div>
                            <div className="mt-2">
                              <div className="flex items-baseline gap-1.5">
                                <span className="text-sm font-black text-mjs-dark">${discountedPrice.toFixed(2)}</span>
                                <span className="text-[10px] text-mjs-gray-400 line-through">${product.price.toFixed(2)}</span>
                              </div>
                              <div className="text-[9px] text-mjs-red font-semibold mb-2">Save ${savings.toFixed(2)}</div>
                              <button
                                onClick={() => addItem({
                                  slug: product.slug,
                                  name: product.cardTitle,
                                  brand: product.brand,
                                  price: discountedPrice,
                                  image: product.images[0],
                                  pack: product.pack,
                                })}
                                className="w-full bg-white border border-mjs-red text-mjs-red text-[10px] font-bold py-1.5 rounded-lg hover:bg-mjs-red hover:text-white transition-colors flex items-center justify-center gap-1"
                              >
                                <ShoppingCart className="w-3 h-3" />
                                Add to Cart
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </main>
      <Footer />

      {/* Free Shipping Threshold Popup */}
      {showShippingPopup && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[80]"
            onClick={closePopup}
          />
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.15)] max-w-[460px] w-full animate-[popIn_0.25s_ease-out] my-auto">
              {/* Close */}
              <div className="flex justify-end px-5 pt-4">
                <button
                  onClick={closePopup}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-4 h-4 text-mjs-gray-400" />
                </button>
              </div>

              <div className="px-8 pb-8">
                {/* Truck Image */}
                <div className="flex justify-center mb-4 -mt-1">
                  <img
                    src="/images/cat-delivery.png"
                    alt="Free Delivery"
                    className="w-28 h-auto object-contain"
                  />
                </div>

                {/* Headline */}
                <div className="text-center mb-5">
                  <h3 className="text-xl font-black text-mjs-dark mb-1.5">
                    You&apos;re almost there!
                  </h3>
                  <p className="text-sm text-mjs-gray-500 leading-relaxed">
                    Spend <span className="font-bold text-mjs-dark">${remaining > 0 ? remaining.toFixed(2) : "0.00"}</span> more
                    to unlock{" "}
                    <span className="font-bold text-mjs-green">FREE shipping</span>
                    {" "}&mdash; save <span className="font-semibold">$35</span> on delivery
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-mjs-red rounded-full transition-all duration-700 ease-out"
                      style={{ width: animateBar ? `${freeDeliveryProgress}%` : "0%" }}
                    />
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs font-semibold text-mjs-gray-500">
                      ${subtotal.toFixed(2)}
                    </span>
                    <div className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-mjs-green" />
                      <span className="text-xs font-bold text-mjs-green">$399 FREE</span>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="relative mb-5">
                  <div className="h-px bg-gray-200" />
                  <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-[10px] font-bold text-mjs-gray-400 uppercase tracking-widest">
                    Quick Add
                  </span>
                </div>

                {/* Copy Paper Upsell */}
                <div className="border border-gray-200 rounded-xl p-4 mb-6 bg-gradient-to-br from-white to-orange-50/40">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-white border border-gray-100 flex items-center justify-center p-1">
                      <img
                        src="/images/product-copy-paper.png"
                        alt="Supreme Copy Paper"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <span className="inline-block bg-orange-100 text-orange-600 text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded mb-1">
                            Popular Add-On
                          </span>
                          <h4 className="text-sm font-bold text-mjs-dark leading-snug">
                            Supreme Copy Paper
                          </h4>
                        </div>
                      </div>
                      <p className="text-[11px] text-mjs-gray-400 mb-2">
                        Letter Size &middot; 20 lb &middot; 10 Reams/Case
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-base font-black text-mjs-dark">
                          $52.99
                          <span className="text-[10px] font-medium text-mjs-gray-400 ml-0.5">/case</span>
                        </span>

                        {/* Qty Selector + Add */}
                        {!paperAdded ? (
                          <div className="flex items-center gap-1.5">
                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                              <button
                                onClick={() => setPaperQty(Math.max(1, paperQty - 1))}
                                className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 transition-colors"
                              >
                                <Minus className="w-3 h-3 text-mjs-gray-500" />
                              </button>
                              <span className="w-7 h-7 flex items-center justify-center text-xs font-bold text-mjs-dark border-x border-gray-200 bg-gray-50">
                                {paperQty}
                              </span>
                              <button
                                onClick={() => setPaperQty(paperQty + 1)}
                                className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 transition-colors"
                              >
                                <Plus className="w-3 h-3 text-mjs-gray-500" />
                              </button>
                            </div>
                            <button
                              onClick={handleAddPaper}
                              className="bg-mjs-red hover:bg-mjs-red-dark text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                            >
                              Add
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs font-bold text-mjs-green flex items-center gap-1">
                            <PackageCheck className="w-4 h-4" />
                            Added!
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* How much this helps */}
                  {!paperAdded && remaining > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100 text-center">
                      <p className="text-[11px] text-mjs-gray-400">
                        {copyPaper.price * paperQty >= remaining ? (
                          <>
                            Adding {paperQty} {paperQty === 1 ? "case" : "cases"} will{" "}
                            <span className="font-bold text-mjs-green">unlock free shipping</span>
                          </>
                        ) : (
                          <>
                            Adding {paperQty} {paperQty === 1 ? "case" : "cases"} gets you to{" "}
                            <span className="font-semibold text-mjs-dark">
                              ${(subtotal + copyPaper.price * paperQty).toFixed(2)}
                            </span>
                            {" "}&mdash;{" "}
                            <span className="font-semibold text-mjs-red">
                              ${(remaining - copyPaper.price * paperQty).toFixed(2)}
                            </span>{" "}
                            away
                          </>
                        )}
                      </p>
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div className="space-y-2.5">
                  <Link
                    href="/"
                    onClick={closePopup}
                    className="w-full bg-mjs-dark hover:bg-gray-800 text-white font-semibold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
                  >
                    Continue Shopping
                  </Link>
                  <button
                    onClick={() => {
                      closePopup();
                      router.push("/checkout");
                    }}
                    className="w-full border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-mjs-gray-500 font-medium py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
                  >
                    Pay Delivery Fee &middot; $35.00
                  </button>
                </div>
              </div>
            </div>
          </div>

          <style jsx>{`
            @keyframes popIn {
              from {
                opacity: 0;
                transform: scale(0.96) translateY(8px);
              }
              to {
                opacity: 1;
                transform: scale(1) translateY(0);
              }
            }
          `}</style>
        </>
      )}
    </>
  );
}
