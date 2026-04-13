"use client";

import { useState, useEffect } from "react";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  ShieldCheck,
  RotateCcw,
  Package,
  Check,
  ChevronRight,
  Minus,
  Plus,
  Info,
  Printer,
  ChevronDown,
  Zap,
  Clock,
  Phone,
  BadgePercent,
  MapPin,
  Loader2,
  Headphones,
  FileText,
} from "lucide-react";

import { getProductBySlug, getRelatedProducts, type ProductData } from "@/data/products";
import { useCart } from "@/context/CartContext";

/* ───────── sub-components ───────── */

function StarRating({
  rating,
  size = "sm",
}: {
  rating: number;
  size?: "sm" | "md";
}) {
  const cls = size === "md" ? "w-5 h-5" : "w-4 h-4";
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`${cls} ${
            i < Math.floor(rating)
              ? "text-mjs-gold fill-mjs-gold"
              : "text-gray-200 fill-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

function QuantitySelector({
  qty,
  setQty,
}: {
  qty: number;
  setQty: (n: number) => void;
}) {
  return (
    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
      <button
        onClick={() => setQty(Math.max(1, qty - 1))}
        className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
      >
        <Minus className="w-4 h-4 text-gray-600" />
      </button>
      <input
        type="number"
        value={qty}
        onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
        className="w-14 h-10 text-center text-sm font-semibold border-x border-gray-300 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button
        onClick={() => setQty(qty + 1)}
        className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
      >
        <Plus className="w-4 h-4 text-gray-600" />
      </button>
    </div>
  );
}

/* ───────── reviews component ───────── */

interface ReviewData {
  id: number;
  title: string;
  text: string;
  rating: number;
  name: string;
  date: string;
}

function ProductReviews({ sku, rating, reviewCount }: { sku: string; rating: number; reviewCount: number }) {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [avgRating, setAvgRating] = useState(rating);
  const [count, setCount] = useState(reviewCount);

  useEffect(() => {
    fetch(`/api/products/reviews?sku=${encodeURIComponent(sku)}`)
      .then(r => r.json())
      .then(data => {
        if (data.reviews?.length > 0) {
          setReviews(data.reviews);
          setAvgRating(data.rating);
          setCount(data.count);
        }
      })
      .catch(() => {});
  }, [sku]);

  // Don't render section if no reviews
  if (count === 0 && reviews.length === 0) return null;

  // Build rating distribution
  const dist = [0, 0, 0, 0, 0];
  reviews.forEach(r => { if (r.rating >= 1 && r.rating <= 5) dist[r.rating - 1]++; });
  const total = reviews.length || 1;

  return (
    <section id="reviews" className="bg-mjs-gray-50 border-t border-gray-200">
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        {/* Review Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-0 md:divide-x md:divide-gray-200">
            <div className="md:pr-6 text-center md:text-left flex-shrink-0">
              <h3 className="text-base font-bold text-mjs-dark mb-1">Customer Reviews</h3>
              <div className="flex items-center justify-center md:justify-start gap-2">
                {avgRating > 0 && (
                  <span className="inline-flex items-center gap-0.5 bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                    {avgRating.toFixed(1)} <Star className="w-3 h-3 fill-white" />
                  </span>
                )}
                <span className="text-xs text-mjs-gray-500">{count} Review{count !== 1 ? "s" : ""}</span>
              </div>
            </div>

            {avgRating > 0 && (
              <div className="md:px-6 flex-shrink-0 text-center">
                <div className="text-3xl font-black text-mjs-dark leading-none">{avgRating.toFixed(1)}</div>
                <StarRating rating={avgRating} size="sm" />
                <div className="text-[10px] text-mjs-gray-500 mt-0.5">{count} total</div>
              </div>
            )}

            {reviews.length > 0 && (
              <div className="md:pl-6 flex-shrink-0 w-full md:w-auto">
                <div className="space-y-1 w-[200px]">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const pct = Math.round((dist[star - 1] / total) * 100);
                    return (
                      <div key={star} className="flex items-center gap-2">
                        <span className="text-[11px] font-medium text-mjs-gray-500 w-2.5">{star}</span>
                        <Star className="w-3 h-3 text-mjs-gold fill-mjs-gold" />
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-mjs-gold rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[10px] text-mjs-gray-500 w-7 text-right">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Review Cards */}
        {reviews.length > 0 && (
          <div className="grid md:grid-cols-3 gap-3">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-mjs-red/10 rounded-full flex items-center justify-center">
                      <span className="text-mjs-red font-bold text-xs">{review.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-mjs-gray-800">{review.name}</div>
                      <div className="text-[10px] text-mjs-gray-500">
                        {new Date(review.date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                      </div>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-mjs-green bg-green-50 px-1.5 py-0.5 rounded">
                    <Check className="w-2.5 h-2.5" /> Verified
                  </span>
                </div>
                <StarRating rating={review.rating} />
                {review.title && <div className="text-sm font-bold text-mjs-gray-800 mt-1.5">{review.title}</div>}
                {review.text && <p className="text-xs text-mjs-gray-600 mt-1 leading-relaxed">{review.text}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ───────── main component ───────── */

export default function ProductDetailPage({ slug }: { slug: string }) {
  const localProduct = getProductBySlug(slug);
  const [product, setProduct] = useState<ProductData | null>(localProduct || null);
  const [loading, setLoading] = useState(!localProduct);
  const relatedProducts = getRelatedProducts(slug, 6);
  const { addItem } = useCart();

  // Fetch from BigCommerce if not found locally (or to get fresher data)
  useEffect(() => {
    if (!localProduct) setLoading(true);
    fetch(`/api/products/slug?slug=${encodeURIComponent(slug)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.product) {
          setProduct(data.product);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    // Use selected brick's unit price, or match by qty
    const selectedOpt = product.quickBuy[selectedBrick];
    const matchedBulk = selectedOpt || product.quickBuy.find(opt => opt.qty === qty);
    const unitPrice = matchedBulk?.unitPrice || product.price;
    addItem({
      slug: product.slug,
      sku: product.sku,
      name: product.cardTitle,
      brand: product.brand,
      price: unitPrice,
      image: product.images[0],
      pack: product.pack,
    }, qty);
  };
  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [selectedBrick, setSelectedBrick] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [shipZip, setShipZip] = useState("");
  const [shipOption, setShipOption] = useState<"pickup" | "delivery">("delivery");
  const [shipChecked, setShipChecked] = useState(false);
  const [shipChecking, setShipChecking] = useState(false);
  const [shipPrice, setShipPrice] = useState("");
  const [shipArea, setShipArea] = useState("");
  const [freeMinimum, setFreeMinimum] = useState("");

  const [shipMethod, setShipMethod] = useState("");

  const checkShipping = () => {
    if (shipZip.length < 5 || !product) return;
    setShipChecking(true);

    // Detect local zone for free delivery info
    const prefix = shipZip.slice(0, 3);
    const ocZips = ["926", "927", "928"];
    const laZips = ["900","901","902","903","904","905","906","907","908","909","910","911","912","913","914","915","916","917","918"];
    const ieZips = ["920","921","922","923","924","925"];
    const sdZips = ["919","930","931","932","933","934","935"];

    const isLocal = ocZips.includes(prefix) || laZips.includes(prefix) || ieZips.includes(prefix);
    const isSD = sdZips.includes(prefix);

    if (isLocal) {
      setFreeMinimum("$399");
    } else if (isSD) {
      setFreeMinimum("$699");
    } else {
      setFreeMinimum("");
    }

    // Always fetch real UPS rate from ShipperHQ
    fetch("/api/shipping/estimate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [{ sku: product.sku, quantity: qty }],
        zip: shipZip,
      }),
    })
      .then(r => r.json())
      .then(data => {
        const rates = data.rates || [];
        const delivery = rates.filter((r: { type: string }) => r.type !== "pickupinstore" && r.type !== "pickup");
        const cheapest = delivery.sort((a: { cost: number }, b: { cost: number }) => a.cost - b.cost)[0];
        if (cheapest) {
          setShipPrice(`$${cheapest.cost.toFixed(2)}`);
          setShipMethod(cheapest.name || "UPS Ground");
          setShipArea(isLocal ? "OC / LA / IE" : isSD ? "San Diego" : cheapest.name || "UPS Ground");
        } else {
          setShipPrice("Call for rate");
          setShipMethod("UPS Ground");
          setShipArea("UPS Ground");
        }
        setFreeMinimum("");
        setShipChecked(true);
        setShipChecking(false);
      })
      .catch(() => {
        setShipPrice("Call for rate");
        setShipChecked(true);
        setShipChecking(false);
      });
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-white min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-mjs-red animate-spin mx-auto" />
          <p className="text-sm text-mjs-gray-400 mt-3">Loading product...</p>
        </div>
      </div>
    );
  }

  // Not found
  if (!product) {
    return (
      <div className="bg-white min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-mjs-dark mb-2">Product Not Found</h2>
          <p className="text-sm text-mjs-gray-400 mb-6">The product you&apos;re looking for couldn&apos;t be found.</p>
          <a href="/" className="bg-mjs-red text-white font-semibold px-6 py-2.5 rounded-lg text-sm hover:bg-red-700 transition-colors">
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="bg-mjs-gray-50 border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 py-3">
          <nav className="flex items-center gap-1.5 text-sm text-mjs-gray-400">
            <a href="/" className="hover:text-mjs-red transition-colors">
              Home
            </a>
            <ChevronRight className="w-3.5 h-3.5" />
            <a href={`/search?q=${encodeURIComponent(product.category)}`} className="hover:text-mjs-red transition-colors">
              {product.category}
            </a>
            <ChevronRight className="w-3.5 h-3.5" />
            <a href={`/search?q=${encodeURIComponent(product.subcategory)}`} className="hover:text-mjs-red transition-colors">
              {product.subcategory}
            </a>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-mjs-gray-700 font-medium truncate max-w-[200px]">
              {product.sku}
            </span>
          </nav>
        </div>
      </div>

      {/* ═══════════════ PRODUCT HERO ═══════════════ */}
      <section className="max-w-[1400px] mx-auto px-4 py-8 md:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">
          {/* ── LEFT: Image Gallery ── */}
          <div>
            {/* Main Image */}
            <div className="relative bg-mjs-gray-50 rounded-2xl border border-gray-100 overflow-hidden aspect-square flex items-center justify-center mb-4">
              {discount > 0 && (
                <div className="absolute top-4 left-4 z-10 bg-mjs-red text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                  SAVE {discount}%
                </div>
              )}
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-xl border-2 overflow-hidden flex-shrink-0 transition-all ${
                    selectedImage === i
                      ? "border-mjs-red shadow-md"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Product Info ── */}
          <div>
            {/* Brand */}
            <a
              href="#"
              className="inline-flex items-center text-sm font-semibold text-mjs-blue hover:underline mb-2"
            >
              {product.brand}
            </a>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-extrabold text-mjs-dark leading-tight tracking-tight mb-3">
              {product.name}
            </h1>

            {/* Rating row */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <StarRating rating={product.rating} size="md" />
              <span className="text-sm font-semibold text-mjs-gray-700">
                {product.rating}
              </span>
              <a
                href="#reviews"
                className="text-sm text-mjs-blue hover:underline"
              >
                {product.reviewCount} Reviews
              </a>
              <span className="text-mjs-gray-300">|</span>
              <span className="text-sm text-mjs-gray-600">
                SKU: {product.sku}
              </span>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-200 mb-5" />

            {/* Pricing */}
            <div className="mb-5">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black text-mjs-dark">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-lg text-mjs-gray-400 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-green-50 text-mjs-green text-sm font-bold px-2.5 py-1 rounded-lg">
                      <BadgePercent className="w-4 h-4" />
                      Save ${(product.originalPrice - product.price).toFixed(2)}
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-mjs-gray-600 mt-1">
                Price per carton &middot; Bulk pricing available
              </p>
            </div>

            {/* Stock badge */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-1.5 bg-green-50 text-mjs-green text-sm font-semibold px-3 py-1.5 rounded-lg">
                <Check className="w-4 h-4" />
                In Stock
              </div>
              <span className="text-xs text-mjs-gray-600">
                {product.stockQty}&nbsp;available &nbsp;&middot;&nbsp; Usually ships in 1-2 days
              </span>
            </div>

            {/* Quick Buy Options */}
            {product.quickBuy.length > 0 && (
              <div className="mb-4">
                <div className="text-xs font-semibold text-mjs-gray-500 uppercase tracking-wide mb-2">
                  Quick Select
                </div>
                <div className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${product.quickBuy.length}, 1fr)` }}>
                  {product.quickBuy.map((opt, i) => {
                    const unitPrice = opt.unitPrice
                      ? opt.unitPrice
                      : opt.savings
                        ? +(product.price * (1 - parseInt(opt.savings.replace(/\D/g, "")) / 100)).toFixed(2)
                        : product.price;
                    const isSelected = selectedBrick === i;
                    return (
                      <button
                        key={i}
                        onClick={() => { setSelectedBrick(i); setQty(opt.qty); }}
                        className={`flex flex-col items-center text-center px-3 py-3 rounded-lg border transition-all ${
                          isSelected
                            ? "border-mjs-red bg-red-50"
                            : "border-gray-200 bg-white hover:border-mjs-red/40 hover:bg-red-50/50"
                        }`}
                      >
                        <span className={`text-sm font-semibold ${isSelected ? "text-mjs-red" : "text-mjs-gray-800"}`}>
                          {opt.label}
                        </span>
                        <span className={`text-base font-bold mt-1 ${isSelected ? "text-mjs-red" : "text-mjs-dark"}`}>
                          ${unitPrice.toFixed(2)}
                        </span>
                        {opt.savings ? (
                          <span className="text-[10px] font-bold text-mjs-green mt-0.5">
                            {opt.savings}
                          </span>
                        ) : (
                          <span className="text-[10px] text-mjs-gray-400 mt-0.5">
                            per unit
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <QuantitySelector qty={qty} setQty={setQty} />
              <button
                onClick={handleAddToCart}
                className="flex-1 min-w-[200px] bg-mjs-red hover:bg-mjs-red-dark text-white font-bold py-3 px-6 rounded-lg transition-all hover:shadow-lg hover:shadow-red-500/20 flex items-center justify-center gap-2 text-base"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
            </div>

            {/* Shipping & Pickup Options */}
            <div className="border border-gray-200 rounded-xl mb-4 overflow-hidden">
              {/* Option Cards */}
              <div className="grid grid-cols-2 gap-3 p-4">
                {/* Ship */}
                <button
                  onClick={() => { setShipOption("delivery"); if (!shipChecked) setShipChecked(false); }}
                  className={`rounded-xl border-2 py-5 px-4 text-center transition-all ${
                    shipOption === "delivery"
                      ? "border-mjs-red bg-red-50/30"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Truck className="w-5 h-5 text-mjs-dark" />
                    <span className="text-base font-bold text-mjs-dark">Ship</span>
                    {shipOption === "delivery" && (
                      <div className="w-5 h-5 rounded-full bg-mjs-red flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  {shipChecking ? (
                    <>
                      <div className="text-sm font-semibold text-mjs-dark">Calculating...</div>
                      <div className="text-xs text-mjs-gray-600 mt-1">
                        <Loader2 className="w-4 h-4 animate-spin inline" />
                      </div>
                      <div className="text-sm font-bold text-mjs-gray-400 mt-2">—</div>
                    </>
                  ) : shipChecked && shipZip ? (
                    <>
                      <div className="text-sm font-semibold text-mjs-dark">{shipMethod || "Ships UPS Ground"}</div>
                      <div className="text-xs text-mjs-gray-600 mt-1">
                        {product.inStock ? `${product.stockQty.toLocaleString()} available` : "Check availability"}
                      </div>
                      <div className="text-sm font-bold text-mjs-green mt-2">{shipPrice}</div>
                      {freeMinimum && <div className="text-[10px] text-mjs-gray-400 mt-0.5">Free over {freeMinimum}</div>}
                    </>
                  ) : (
                    <>
                      <div className="text-sm font-semibold text-mjs-dark">Ships UPS Ground</div>
                      <div className="text-xs text-mjs-gray-600 mt-1">Enter zip for rate</div>
                      <div className="text-sm font-bold text-mjs-gray-400 mt-2">—</div>
                    </>
                  )}
                </button>

                {/* Pick Up */}
                <button
                  onClick={() => setShipOption("pickup")}
                  className={`rounded-xl border-2 py-5 px-4 text-center transition-all ${
                    shipOption === "pickup"
                      ? "border-mjs-red bg-red-50/30"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Package className="w-5 h-5 text-mjs-dark" />
                    <span className="text-base font-bold text-mjs-dark">Pick Up</span>
                    {shipOption === "pickup" && (
                      <div className="w-5 h-5 rounded-full bg-mjs-red flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="text-[10px] font-bold text-mjs-gray-400 uppercase tracking-wider">Anaheim Warehouse</div>
                  <div className="text-sm font-semibold text-mjs-dark mt-1">Ready: Today (6:30AM-3PM)</div>
                  <div className="text-sm font-bold text-mjs-green mt-2">FREE</div>
                </button>
              </div>

              {/* Zip code input — shows when Ship is selected */}
              {shipOption === "delivery" && (
                <div className="px-4 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-mjs-gray-400" />
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={5}
                        value={shipZip}
                        onChange={(e) => { setShipZip(e.target.value.replace(/\D/g, "")); setShipChecked(false); }}
                        onKeyDown={(e) => e.key === "Enter" && checkShipping()}
                        placeholder="Enter zip code"
                        className="w-full pl-8 pr-3 py-2.5 text-sm rounded-lg border border-gray-300 focus:border-mjs-red focus:ring-1 focus:ring-mjs-red/20 outline-none transition-all bg-white"
                        autoFocus
                      />
                    </div>
                    <button
                      onClick={checkShipping}
                      disabled={shipZip.length < 5 || shipChecking}
                      className="px-5 py-2.5 text-sm font-semibold bg-mjs-dark text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {shipChecking ? <Loader2 className="w-4 h-4 animate-spin" /> : "Check Rate"}
                    </button>
                  </div>
                </div>
              )}

              {/* Bottom info — dynamic based on area */}
              <div className="bg-mjs-gray-50 border-t border-gray-200 py-3 px-4">
                {shipOption === "pickup" ? (
                  <div className="flex items-center justify-center gap-2">
                    <MapPin className="w-4 h-4 text-mjs-red flex-shrink-0" />
                    <span className="text-xs font-semibold text-mjs-gray-600 text-center">
                      Pick up at 3066 E. La Palma Ave, Anaheim &middot; Mon-Fri 6:30 AM - 2:45 PM
                    </span>
                  </div>
                ) : shipChecked && freeMinimum ? (
                  <div className="flex items-center justify-center gap-2">
                    <Truck className="w-4 h-4 text-mjs-green flex-shrink-0" />
                    <span className="text-xs font-semibold text-mjs-green text-center">
                      Free Delivery to {shipArea} on orders {freeMinimum}+
                    </span>
                  </div>
                ) : shipChecked && !freeMinimum ? (
                  <div className="flex items-center justify-center gap-2">
                    <Truck className="w-4 h-4 text-mjs-gray-500 flex-shrink-0" />
                    <span className="text-xs font-semibold text-mjs-gray-600 text-center">
                      {shipMethod || "Ships UPS Ground"} &middot; {shipPrice || "Enter zip for rate"}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Truck className="w-4 h-4 text-mjs-red flex-shrink-0" />
                    <span className="text-xs font-semibold text-mjs-gray-600 text-center">
                      Free Delivery on qualifying orders &middot; Enter zip for your rate
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Secondary actions */}
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  isWishlisted
                    ? "text-mjs-red"
                    : "text-mjs-gray-500 hover:text-mjs-red"
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${isWishlisted ? "fill-mjs-red" : ""}`}
                />
                {isWishlisted ? "Saved" : "Save to List"}
              </button>
              <button className="flex items-center gap-1.5 text-sm font-medium text-mjs-gray-500 hover:text-mjs-gray-700 transition-colors">
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button className="flex items-center gap-1.5 text-sm font-medium text-mjs-gray-500 hover:text-mjs-gray-700 transition-colors">
                <Printer className="w-4 h-4" />
                Print
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════ VALUE BOXES ═══════ */}
      <section className="border-t border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
            <div className="flex items-center gap-3 bg-mjs-gray-50 border border-gray-200 rounded-xl px-4 py-3">
              <div className="w-9 h-9 bg-mjs-red/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <BadgePercent className="w-4 h-4 text-mjs-red" />
              </div>
              <div>
                <div className="text-xs font-bold text-mjs-gray-800">Get 10% Off Coupon</div>
                <div className="text-[10px] text-mjs-blue font-semibold">Join our email list</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-mjs-gray-50 border border-gray-200 rounded-xl px-4 py-3">
              <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <RotateCcw className="w-4 h-4 text-mjs-green" />
              </div>
              <div>
                <div className="text-xs font-bold text-mjs-gray-800">Free 30-Day Returns</div>
                <div className="text-[10px] text-mjs-blue font-semibold">Return Policy</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-mjs-gray-50 border border-gray-200 rounded-xl px-4 py-3">
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 text-mjs-blue" />
              </div>
              <div>
                <div className="text-xs font-bold text-mjs-gray-800">Net 30 Payment Terms</div>
                <div className="text-[10px] text-mjs-blue font-semibold">Apply Now</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-mjs-gray-50 border border-gray-200 rounded-xl px-4 py-3">
              <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Headphones className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <div className="text-xs font-bold text-mjs-gray-800">Talk to a Real Person</div>
                <div className="text-[10px] text-mjs-blue font-semibold">Contact Our Team in Anaheim</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-mjs-gray-50 border border-gray-200 rounded-xl px-4 py-3">
              <div className="w-9 h-9 bg-violet-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="w-4 h-4 text-violet-600" />
              </div>
              <div>
                <div className="text-xs font-bold text-mjs-gray-800">Bulk Quote</div>
                <div className="text-[10px] text-mjs-blue font-semibold">(714) 779-2640</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ 1. DESCRIPTION + FEATURES ═══════ */}
      <section className="border-t border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Description — left 3 cols */}
            <div className="lg:col-span-3">
              <h3 className="text-base font-bold text-mjs-dark mb-3">
                Product Description
              </h3>
              <div className="bg-mjs-gray-50 rounded-xl border border-gray-100 p-5">
                <p className="text-sm text-mjs-gray-600 leading-[1.8]">
                  {product.description}
                </p>
              </div>
              {product.sdsSheet && (
                <div className="flex items-center gap-2 mt-3 text-sm text-mjs-gray-500">
                  <FileText className="w-4 h-4 text-mjs-gray-400" />
                  <span>Safety Data Sheet</span>
                  <a href={product.sdsSheet} target="_blank" rel="noopener noreferrer" className="text-mjs-red font-semibold hover:underline">
                    Download PDF
                  </a>
                </div>
              )}
            </div>

            {/* Features — right 2 cols */}
            <div className="lg:col-span-2">
              <h3 className="text-base font-bold text-mjs-dark mb-3">
                Key Features
              </h3>
              <div className="bg-mjs-gray-50 rounded-xl border border-gray-100 divide-y divide-gray-100">
                {product.highlights.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 px-4 py-2.5"
                  >
                    <div className="w-5 h-5 bg-mjs-green/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-mjs-green" />
                    </div>
                    <span className="text-sm text-mjs-gray-700">{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ 2. RECOMMENDED PRODUCTS (upsell) ═══════ */}
      <section className="bg-mjs-gray-50 border-t border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-mjs-dark">
              You May Also Need
            </h2>
            <a href="#" className="text-xs font-semibold text-mjs-red hover:text-mjs-red-dark">
              View All &rarr;
            </a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {relatedProducts.map((rp, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all group"
              >
                <a href={`/product/${rp.slug}`} className="block bg-mjs-gray-50 h-[170px] overflow-hidden">
                  <img src={rp.images[0]} alt={rp.cardTitle} className="w-full h-full object-cover" />
                </a>
                <div className="p-3.5">
                  <a href={`/product/${rp.slug}`}>
                    <h3 className="text-[13px] font-semibold text-mjs-gray-800 leading-snug group-hover:text-mjs-red transition-colors">
                      {rp.cardTitle}
                    </h3>
                  </a>
                  <div className="text-lg font-bold text-mjs-dark mt-1.5">
                    ${rp.price.toFixed(2)}
                  </div>
                  <div className="text-xs font-medium text-mjs-gray-600 mt-0.5">
                    {rp.pack}
                  </div>
                  <button
                    onClick={() => addItem({
                      slug: rp.slug,
                      name: rp.cardTitle,
                      brand: rp.brand,
                      price: rp.price,
                      image: rp.images[0],
                      pack: rp.pack,
                    })}
                    className="w-full mt-3 border border-mjs-red text-mjs-red font-semibold py-2 rounded-lg text-xs hover:bg-mjs-red hover:text-white transition-all flex items-center justify-center gap-1.5"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ 3. SPECIFICATIONS ═══════ */}
      <section className="border-t border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 py-6">
          <h3 className="text-base font-bold text-mjs-dark mb-3">
            Technical Specifications
          </h3>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="grid md:grid-cols-2">
              {Object.entries(product.specs).map(([key, value], i) => (
                <div
                  key={key}
                  className={`flex items-center text-sm border-b border-gray-100 last:border-b-0 ${
                    i % 2 === 0 ? "md:border-r" : ""
                  }`}
                >
                  <div className="w-2/5 px-4 py-2.5 font-semibold text-mjs-gray-600 bg-mjs-gray-50">
                    {key}
                  </div>
                  <div className="w-3/5 px-4 py-2.5 text-mjs-gray-700">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prop 65 Warning — chemicals only */}
          {(product.category === "Cleaning Chemicals" || product.sdsSheet) && (
            <div className="mt-4 flex items-start gap-3 text-xs text-mjs-gray-500 leading-relaxed">
              <span className="text-amber-500 text-base flex-shrink-0 mt-px">&#9888;</span>
              <p>
                <span className="font-semibold text-mjs-gray-600">Attention CA Residents: Prop 65 Warning</span>
                <br />
                WARNING: This product can expose you to chemicals including lead, which are known to the State of California to cause cancer, birth defects, or other reproductive harm. For more information, go to{" "}
                <a href="https://www.p65warnings.ca.gov" target="_blank" rel="noopener noreferrer" className="text-mjs-red hover:underline">www.p65warnings.ca.gov</a>.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ═══════ 4. REVIEWS — FULL WIDTH ═══════ */}
      <ProductReviews sku={product.sku} rating={product.rating} reviewCount={product.reviewCount} />

      {/* ═══════ CLOSING: TRUST + CONTACT ═══════ */}
      <section className="bg-white border-t border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 py-6">
          {/* Trust Icons */}
          <div className="flex items-center justify-center gap-8 md:gap-14 mb-6 flex-wrap">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-mjs-green" />
              <span className="text-xs font-semibold text-mjs-gray-600">Secure Checkout</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-mjs-blue" />
              <span className="text-xs font-semibold text-mjs-gray-600">Ships Nationwide</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-amber-600" />
              <span className="text-xs font-semibold text-mjs-gray-600">30-Day Returns</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-violet-600" />
              <span className="text-xs font-semibold text-mjs-gray-600">Quality Guaranteed</span>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="bg-mjs-gray-50 rounded-xl border border-gray-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-mjs-red/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Headphones className="w-5 h-5 text-mjs-red" />
              </div>
              <div>
                <div className="text-sm font-bold text-mjs-gray-800">
                  Still have questions?
                </div>
                <div className="text-xs text-mjs-gray-500">
                  Our Anaheim team is here to help Mon–Fri, 6:30am–3:00pm
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="tel:7147792640"
                className="inline-flex items-center gap-2 bg-mjs-dark text-white font-semibold px-5 py-2.5 rounded-lg text-sm hover:bg-mjs-charcoal transition-colors"
              >
                <Phone className="w-4 h-4" />
                (714) 779-2640
              </a>
              <a
                href="mailto:orders@mobilejanitorialsupply.com"
                className="inline-flex items-center gap-2 border border-gray-300 text-mjs-gray-700 font-semibold px-5 py-2.5 rounded-lg text-sm hover:bg-white transition-colors"
              >
                Email Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
