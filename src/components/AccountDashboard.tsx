"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useOrderSetup } from "@/context/OrderContext";
import {
  Package, ShoppingCart, FileText, DollarSign, Clock, Truck,
  CheckCircle, ArrowRight, Download, User, Building2, MapPin,
  CreditCard, Phone, Mail, RefreshCw, Eye, Star, Shield,
  ChevronLeft, ChevronRight, Store, BadgePercent, Plus, Minus, X, Upload, FileCheck, EyeOff, Lock, Gift,
} from "lucide-react";

const tabs = ["Overview", "Orders", "Rewards", "Account Info"];

interface OrderLineItem {
  name: string;
  sku: string;
  qty: number;
  price: number;
  lineTotal?: number;
}
interface OrderData {
  id: string;
  date: string;
  dateRaw: string;
  items: number;
  total: number;
  status: string;
  statusColor: string;
  lineItems: OrderLineItem[];
  tax: number;
  shipping: number;
}

interface BuyAgainProduct {
  sku: string;
  name: string;
  price: number;
  totalQty: number;
  slug: string;
  image: string;
  brand: string;
  pack: string;
}

function YourProductsStrip({ favorites, removeFavorite, orders, addItem }: {
  favorites: import("@/context/FavoritesContext").FavoriteItem[];
  removeFavorite: (sku: string) => void;
  orders: OrderData[];
  addItem: (item: { slug: string; sku?: string; name: string; brand: string; price: number; image: string; pack: string }, qty?: number) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [buyAgainProducts, setBuyAgainProducts] = useState<BuyAgainProduct[]>([]);

  useEffect(() => {
    if (orders.length === 0) return;
    const counts = new Map<string, { name: string; sku: string; price: number; qty: number }>();
    for (const order of orders) {
      for (const item of order.lineItems) {
        if (!item.sku) continue;
        const existing = counts.get(item.sku);
        if (existing) existing.qty += item.qty;
        else counts.set(item.sku, { name: item.name, sku: item.sku, price: item.price, qty: item.qty });
      }
    }
    const topSkus = [...counts.values()].sort((a, b) => b.qty - a.qty).slice(0, 10);
    if (topSkus.length === 0) return;
    Promise.all(
      topSkus.map(item =>
        fetch(`/api/products/search?q=${encodeURIComponent(item.sku)}&limit=1`)
          .then(r => r.json())
          .then(data => {
            const found = data.products?.[0];
            return { sku: item.sku, name: found?.name || item.name, price: item.price, totalQty: item.qty, slug: found?.slug || item.sku.toLowerCase(), image: found?.images?.[0] || "", brand: found?.brand || "", pack: found?.pack || "" } as BuyAgainProduct;
          })
          .catch(() => ({ sku: item.sku, name: item.name, price: item.price, totalQty: item.qty, slug: item.sku.toLowerCase(), image: "", brand: "", pack: "" } as BuyAgainProduct))
      )
    ).then(results => setBuyAgainProducts(results.filter(p => p.image)));
  }, [orders]);

  // Merge: favorites first, then buy-again (skip duplicates)
  const favSkus = new Set(favorites.map(f => f.sku.toUpperCase()));
  const buyAgainFiltered = buyAgainProducts.filter(p => !favSkus.has(p.sku.toUpperCase()));

  if (favorites.length === 0 && buyAgainFiltered.length === 0) return null;

  return (
    <div className="bg-white border-t border-gray-100 mt-6 rounded-2xl shadow-sm">
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <h2 className="text-base font-bold text-mjs-dark">Your Products</h2>
            {favorites.length > 0 && <span className="bg-mjs-red/10 text-mjs-red text-[9px] font-bold px-2 py-0.5 rounded tracking-wide">{favorites.length} SAVED</span>}
            {buyAgainFiltered.length > 0 && <span className="bg-gray-100 text-mjs-gray-500 text-[9px] font-bold px-2 py-0.5 rounded tracking-wide">+ REORDER</span>}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => scrollRef.current?.scrollBy({ left: -400, behavior: "smooth" })} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
              <ChevronLeft className="w-4 h-4 text-mjs-gray-600" />
            </button>
            <button onClick={() => scrollRef.current?.scrollBy({ left: 400, behavior: "smooth" })} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
              <ChevronRight className="w-4 h-4 text-mjs-gray-600" />
            </button>
          </div>
        </div>
        <div ref={scrollRef} className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {/* Favorites first */}
          {favorites.map((fav) => (
            <div key={`fav-${fav.sku}`} className="flex-shrink-0 w-[190px] bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group relative">
              <button onClick={() => removeFavorite(fav.sku)} className="absolute top-2 right-2 z-10 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center text-mjs-gray-400 hover:text-mjs-red hover:bg-red-50 transition-all shadow-sm">
                <X className="w-3 h-3" />
              </button>
              <div className="absolute top-2 left-2 z-10 bg-mjs-red text-white text-[7px] font-bold px-1.5 py-0.5 rounded">SAVED</div>
              <a href={`/product/${fav.slug}`} className="block h-[160px] bg-white overflow-hidden">
                <img src={fav.image} alt={fav.name} className="w-full h-full object-contain p-2" />
              </a>
              <div className="p-3">
                <div className="text-[10px] font-medium text-mjs-gray-400 uppercase tracking-wide">{fav.sku}</div>
                <a href={`/product/${fav.slug}`}><h3 className="text-[10px] font-semibold text-mjs-gray-800 leading-snug line-clamp-2 group-hover:text-mjs-red transition-colors mt-0.5">{fav.name}</h3></a>
                <div className="mt-1.5"><span className="text-base font-bold text-mjs-dark">${fav.price.toFixed(2)}</span></div>
                <div className="text-[10px] font-medium text-mjs-gray-500 mt-0.5">{fav.pack}</div>
                <button onClick={() => addItem({ slug: fav.slug, sku: fav.sku, name: fav.name, brand: fav.brand, price: fav.price, image: fav.image, pack: fav.pack })} className="w-full mt-2 bg-white border border-mjs-red text-mjs-red font-semibold py-1.5 rounded-lg text-[10px] hover:bg-mjs-red hover:text-white transition-all flex items-center justify-center gap-1">
                  <ShoppingCart className="w-3 h-3" /> Add
                </button>
              </div>
            </div>
          ))}
          {/* Then buy-again items */}
          {buyAgainFiltered.map((product) => (
            <BuyAgainCard key={`ba-${product.sku}`} product={product} addItem={addItem} />
          ))}
        </div>
      </div>
    </div>
  );
}

function BuyAgainCard({ product, addItem }: { product: BuyAgainProduct; addItem: (item: { slug: string; sku?: string; name: string; brand: string; price: number; image: string; pack: string }, qty?: number) => void }) {
  const [qty, setQty] = useState(1);
  return (
    <div className="flex-shrink-0 w-[190px] bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group relative">
      <a href={`/product/${product.slug}`} className="block h-[160px] bg-white overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-full object-contain p-2" />
      </a>
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="text-[10px] font-medium text-mjs-gray-400 uppercase tracking-wide">{product.sku}</div>
          <span className="text-[8px] text-mjs-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">×{product.totalQty} ordered</span>
        </div>
        <a href={`/product/${product.slug}`}>
          <h3 className="text-[10px] font-semibold text-mjs-gray-800 leading-snug line-clamp-2 group-hover:text-mjs-red transition-colors mt-0.5">{product.name}</h3>
        </a>
        <div className="mt-1.5">
          <span className="text-base font-bold text-mjs-dark">${product.price.toFixed(2)}</span>
        </div>
        <div className="text-[10px] font-medium text-mjs-gray-500 mt-0.5">{product.pack}</div>
        <div className="flex items-center gap-1.5 mt-2">
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-6 h-7 flex items-center justify-center hover:bg-gray-100 transition-colors">
              <Minus className="w-2.5 h-2.5 text-mjs-gray-500" />
            </button>
            <span className="w-7 h-7 flex items-center justify-center text-[10px] font-bold text-mjs-dark border-x border-gray-200 bg-mjs-gray-50">{qty}</span>
            <button onClick={() => setQty(qty + 1)} className="w-6 h-7 flex items-center justify-center hover:bg-gray-100 transition-colors">
              <Plus className="w-2.5 h-2.5 text-mjs-gray-500" />
            </button>
          </div>
          <button
            onClick={() => { addItem({ slug: product.slug, sku: product.sku, name: product.name, brand: product.brand, price: product.price, image: product.image, pack: product.pack }, qty); setQty(1); }}
            className="flex-1 bg-white border border-mjs-red text-mjs-red font-semibold py-1.5 rounded-lg text-[10px] hover:bg-mjs-red hover:text-white transition-all flex items-center justify-center gap-1"
          >
            <ShoppingCart className="w-3 h-3" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

function BuyAgainStrip({ orders, addItem }: { orders: OrderData[]; addItem: (item: { slug: string; sku?: string; name: string; brand: string; price: number; image: string; pack: string }, qty?: number) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<BuyAgainProduct[]>([]);
  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -400 : 400, behavior: "smooth" });
  };

  useEffect(() => {
    if (orders.length === 0) return;

    // Count purchases per SKU
    const counts = new Map<string, { name: string; sku: string; price: number; qty: number }>();
    for (const order of orders) {
      for (const item of order.lineItems) {
        if (!item.sku) continue;
        const existing = counts.get(item.sku);
        if (existing) {
          existing.qty += item.qty;
        } else {
          counts.set(item.sku, { name: item.name, sku: item.sku, price: item.price, qty: item.qty });
        }
      }
    }

    const topSkus = [...counts.values()].sort((a, b) => b.qty - a.qty).slice(0, 10);
    if (topSkus.length === 0) return;

    // Fetch product details for images
    Promise.all(
      topSkus.map(item =>
        fetch(`/api/products/search?q=${encodeURIComponent(item.sku)}&limit=1`)
          .then(r => r.json())
          .then(data => {
            const found = data.products?.[0];
            return {
              sku: item.sku,
              name: found?.name || item.name,
              price: item.price,
              totalQty: item.qty,
              slug: found?.slug || item.sku.toLowerCase(),
              image: found?.images?.[0] || "",
              brand: found?.brand || "",
              pack: found?.pack || "",
            } as BuyAgainProduct;
          })
          .catch(() => ({
            sku: item.sku,
            name: item.name,
            price: item.price,
            totalQty: item.qty,
            slug: item.sku.toLowerCase(),
            image: "",
            brand: "",
            pack: "",
          } as BuyAgainProduct))
      )
    ).then(results => setProducts(results.filter(p => p.image)));
  }, [orders]);

  if (products.length === 0) return null;

  return (
    <div className="bg-white border-t border-gray-100 mt-6 rounded-2xl shadow-sm">
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <h2 className="text-base font-bold text-mjs-dark">Buy Again</h2>
            <span className="bg-mjs-red/10 text-mjs-red text-[9px] font-bold px-2 py-0.5 rounded tracking-wide">YOUR TOP ITEMS</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => scroll("left")} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
              <ChevronLeft className="w-4 h-4 text-mjs-gray-600" />
            </button>
            <button onClick={() => scroll("right")} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
              <ChevronRight className="w-4 h-4 text-mjs-gray-600" />
            </button>
          </div>
        </div>
        <div ref={scrollRef} className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {products.map((product) => (
            <BuyAgainCard key={product.sku} product={product} addItem={addItem} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AccountDashboard() {
  const { user, login } = useAuth();
  const { favorites, removeFavorite } = useFavorites();
  const [viewingReward, setViewingReward] = useState<{ amount: number; brand: string; tierLabel: string; tierColor: string; orderId: string; orderDate: string; orderTotal: number; hoursLeft: number; minsLeft: number; isDelivered: boolean } | null>(null);
  const { addItem } = useCart();
  const { setOrderSetup } = useOrderSetup();
  const [activeTab, setActiveTab] = useState("Overview");
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderStep, setOrderStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("bill");
  const [fulfillment, setFulfillment] = useState("");
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [customShipTo, setCustomShipTo] = useState({ name: "", address: "", city: "", state: "", zip: "" });
  const [editBillTo, setEditBillTo] = useState(false);
  const [billTo, setBillTo] = useState({
    company: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });
  const [viewingOrder, setViewingOrder] = useState<OrderData | null>(null);
  const [reordered, setReordered] = useState<string | null>(null);

  // Real BC data state
  const [bcOrders, setBcOrders] = useState<OrderData[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const mockUser = user || { firstName: "Guest", lastName: "", email: "", company: "" };

  // Fetch real orders from BC
  useEffect(() => {
    if (!user?.id) { setOrdersLoading(false); return; }
    fetch(`/api/customer/orders?customerId=${user.id}`)
      .then(r => r.json())
      .then(data => {
        const orders: OrderData[] = (data.orders || []).map((o: Record<string, unknown>) => {
          const status = o.status as string;
          let statusColor = "text-mjs-gray-500 bg-gray-50";
          if (status === "Completed" || status === "Shipped" || status === "Delivered") statusColor = "text-green-600 bg-green-50";
          else if (status === "Awaiting Shipment" || status === "Awaiting Pickup") statusColor = "text-blue-600 bg-blue-50";
          else if (status === "Pending") statusColor = "text-amber-600 bg-amber-50";
          else if (status === "Cancelled" || status === "Declined" || status === "Refunded") statusColor = "text-red-600 bg-red-50";
          return {
            id: `MJS-${o.id}`,
            date: new Date(o.date as string).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            dateRaw: o.date as string,
            items: (o.lineItems as Record<string, unknown>[])?.length || o.itemCount as number || 0,
            total: Number(o.total) || 0,
            status,
            statusColor,
            tax: Number(o.tax) || 0,
            shipping: Number(o.shipping) || 0,
            lineItems: ((o.lineItems as Record<string, unknown>[]) || []).map(li => ({
              name: li.name as string,
              sku: li.sku as string,
              qty: li.qty as number,
              price: Number(li.price) || 0,
              lineTotal: Number(li.lineTotal) || 0,
            })),
          };
        });
        setBcOrders(orders);
        setOrdersLoading(false);
      })
      .catch(() => setOrdersLoading(false));
  }, [user?.id]);

  // Fetch real addresses from BC
  useEffect(() => {
    if (!user?.id) return;
    fetch(`/api/customer/addresses?customerId=${user.id}`)
      .then(r => r.json())
      .then(data => {
        if (data.addresses?.length > 0) {
          const bcAddrs = data.addresses.map((a: Record<string, unknown>) => ({
            id: a.id as number,
            label: (a.company as string) || `${a.city}, ${a.state}`,
            company: (a.company as string) || "",
            address: `${a.address1}${a.address2 ? " " + a.address2 : ""}`,
            city: a.city as string,
            state: a.state as string,
            zip: a.zip as string,
          }));
          setAddresses(bcAddrs);
        }
      })
      .catch(() => {});
  }, [user?.id]);

  // Populate billTo from user data
  useEffect(() => {
    if (user) {
      setBillTo({
        company: user.company || "",
        name: `${user.firstName} ${user.lastName}`,
        email: user.email || "",
        phone: user.phone || "",
        address: "",
        city: "",
        state: "",
        zip: "",
      });
    }
  }, [user]);

  // Only show real BC orders — no mock data for logged-in users
  const displayOrders = bcOrders;

  const downloadInvoice = async (order: OrderData) => {
    try {
      const res = await fetch("/api/invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order: {
            id: order.id,
            date: order.date,
            status: order.status,
            statusColor: order.statusColor,
            items: order.items,
            lineItems: order.lineItems,
            tax: order.tax,
            shipping: order.shipping,
            total: order.total,
          },
          customer: {
            firstName: mockUser.firstName,
            lastName: mockUser.lastName,
            company: mockUser.company,
            email: mockUser.email,
            phone: mockUser.phone || "",
          },
        }),
      });
      if (res.ok) {
        const html = await res.text();
        const newTab = window.open("", "_blank");
        if (newTab) {
          newTab.document.write(html);
          newTab.document.close();
        }
      }
    } catch {}
  };


  const handleReorder = async (order: OrderData) => {
    // Fetch product details for images
    const results = await Promise.all(
      order.lineItems.map(item =>
        fetch(`/api/products/search?q=${encodeURIComponent(item.sku)}&limit=1`)
          .then(r => r.json())
          .catch(() => ({ products: [] }))
      )
    );
    for (let i = 0; i < order.lineItems.length; i++) {
      const item = order.lineItems[i];
      const found = results[i]?.products?.[0];
      addItem({
        slug: found?.slug || item.sku.toLowerCase(),
        name: item.name,
        brand: found?.brand || "MJS",
        price: item.price,
        image: found?.images?.[0] || "/images/placeholder-product.svg",
        pack: found?.pack || "",
      }, item.qty);
    }
    setReordered(order.id);
    setTimeout(() => setReordered(null), 3000);
  };

  // Editable company info — syncs when user data arrives
  const [companyInfo, setCompanyInfo] = useState({
    company: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  useEffect(() => {
    if (user) {
      setCompanyInfo({
        company: user.company || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);
  const [editingCompany, setEditingCompany] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleChangePassword = async () => {
    setPasswordError("");
    if (newPassword.length < 7) {
      setPasswordError("Password must be at least 7 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }
    if (!user?.id) return;
    setPasswordSaving(true);
    try {
      const res = await fetch("/api/customers/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: user.id, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setPasswordSaved(true);
        setNewPassword("");
        setConfirmPassword("");
        setShowPasswordForm(false);
        setTimeout(() => setPasswordSaved(false), 4000);
      } else {
        setPasswordError(data.error || "Failed to update password.");
      }
    } catch {
      setPasswordError("Something went wrong. Please try again.");
    }
    setPasswordSaving(false);
  };

  const saveProfile = async () => {
    if (!user?.id) return;
    setSavingProfile(true);
    try {
      const res = await fetch("/api/customers/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: user.id,
          firstName: companyInfo.firstName,
          lastName: companyInfo.lastName,
          company: companyInfo.company,
          email: companyInfo.email,
          phone: companyInfo.phone,
        }),
      });
      const data = await res.json();
      if (data.success) {
        // Update auth context + localStorage
        login(data.customer);
        setProfileSaved(true);
        setTimeout(() => setProfileSaved(false), 3000);
      }
    } catch {}
    setSavingProfile(false);
    setEditingCompany(false);
  };

  // Tax ID upload
  const [taxIdUploaded, setTaxIdUploaded] = useState(false);
  const [taxIdFileName, setTaxIdFileName] = useState<string | null>(null);
  const [taxIdDate, setTaxIdDate] = useState<string | null>(null);
  const [taxIdNumber, setTaxIdNumber] = useState("");
  const [taxIdUploading, setTaxIdUploading] = useState(false);
  const [taxIdError, setTaxIdError] = useState("");
  const taxFileRef = useRef<HTMLInputElement>(null);

  // Check tax ID status on mount
  useEffect(() => {
    if (!user?.id) return;
    fetch(`/api/customers/tax-id?customerId=${user.id}`)
      .then(r => r.json())
      .then(data => {
        if (data.uploaded) {
          setTaxIdUploaded(true);
          setTaxIdFileName(data.taxIdNumber || "On File");
          setTaxIdDate(data.uploadDate);
          try { localStorage.setItem("mjs_tax_exempt", "true"); } catch {}
        }
      })
      .catch(() => {});
  }, [user?.id]);

  const handleTaxIdUpload = async (file: File) => {
    if (!user?.id) return;
    setTaxIdUploading(true);
    setTaxIdError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("customerId", String(user.id));
      formData.append("customerName", `${user.firstName} ${user.lastName}`);
      formData.append("customerEmail", user.email || "");
      formData.append("companyName", user.company || "");
      formData.append("taxIdNumber", taxIdNumber.trim());

      const res = await fetch("/api/customers/tax-id", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setTaxIdError(data.error || "Upload failed. Please try again.");
      } else {
        setTaxIdUploaded(true);
        setTaxIdFileName(data.taxIdNumber || taxIdNumber.trim());
        setTaxIdDate(data.uploadDate);
        // Store tax exempt status in localStorage for checkout
        try { localStorage.setItem("mjs_tax_exempt", "true"); } catch {}
      }
    } catch {
      setTaxIdError("Something went wrong. Please try again.");
    }
    setTaxIdUploading(false);
  };

  // Multi-address book
  interface SavedAddress {
    id: number;
    label: string;
    company: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  }
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [addressForm, setAddressForm] = useState({ label: "", company: "", address: "", city: "", state: "", zip: "" });

  const savedAddresses = addresses;

  const openOrderModal = () => {
    setOrderStep(1);
    setPaymentMethod("bill");
    setFulfillment("");
    setSelectedAddress(null);
    setShowOrderModal(true);
  };

  // Account details (would come from BigCommerce customer groups)
  const pricingTier = "Standard";
  const discountRate = 0;

  return (
    <section className="bg-mjs-gray-50 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-mjs-gray-400 mb-6">
          <a href="/" className="hover:text-mjs-red transition-colors">Home</a>
          <span>/</span>
          <span className="text-mjs-dark font-medium">My Account</span>
        </div>

        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-mjs-dark to-gray-800 rounded-2xl p-8 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-white/5 rounded-full translate-y-1/2" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-mjs-gold text-mjs-dark text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                {pricingTier}
              </span>
              <span className="bg-white/10 text-white/60 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                Active Account
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-1">
              Welcome, {mockUser.company}!
            </h1>
            <p className="text-gray-400 text-sm">Manage your orders, view your custom pricing, and place new orders.</p>
          </div>
        </div>

        {/* Account Completion Progress */}
        {(() => {
          const steps = [
            { label: "Create Account", done: true, action: "" },
            { label: "Add Shipping Address", done: addresses.length > 0, action: "account-info" },
            { label: "Upload Tax ID", done: taxIdUploaded, action: "account-info" },
            { label: "Place First Order", done: displayOrders.length > 0, action: "order" },
          ];
          const completed = steps.filter(s => s.done).length;
          const total = steps.length;
          const pct = Math.round((completed / total) * 100);

          if (pct >= 100) return null;

          return (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6 overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm font-bold text-mjs-dark">Complete Your Account</div>
                  <div className="text-xs text-mjs-gray-400 mt-0.5">{completed} of {total} steps done — {pct}% complete</div>
                </div>
                <div className="text-xs font-bold text-mjs-red">{pct}%</div>
              </div>
              {/* Progress bar */}
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-gradient-to-r from-mjs-red to-red-400 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${pct}%` }}
                />
              </div>
              {/* Steps */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {steps.map((step, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (step.done || !step.action) return;
                      if (step.action === "account-info" && step.label === "Add Shipping Address") {
                        setActiveTab("Account Info");
                        setTimeout(() => {
                          setAddressForm({ label: "", company: companyInfo.company, address: "", city: "", state: "CA", zip: "" });
                          setEditingAddressId(null);
                          setShowAddressForm(true);
                          // Scroll to address section
                          document.getElementById("delivery-addresses")?.scrollIntoView({ behavior: "smooth", block: "center" });
                        }, 100);
                      } else if (step.action === "account-info" && step.label === "Upload Tax ID") {
                        setActiveTab("Account Info");
                        setTimeout(() => {
                          document.getElementById("tax-id-section")?.scrollIntoView({ behavior: "smooth", block: "center" });
                        }, 100);
                      } else if (step.action === "order") {
                        openOrderModal();
                      }
                    }}
                    className={`flex-1 rounded-xl border p-3 text-left transition-all ${
                      step.done
                        ? "bg-emerald-50 border-emerald-200"
                        : "bg-white border-gray-200 hover:border-mjs-red hover:bg-red-50 cursor-pointer"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {step.done ? (
                        <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-[10px] font-bold text-mjs-gray-400">{i + 1}</span>
                        </div>
                      )}
                      <span className={`text-[11px] font-semibold ${step.done ? "text-emerald-700" : "text-mjs-dark"}`}>
                        {step.label}
                      </span>
                    </div>
                    {!step.done && (
                      <div className="text-[9px] text-mjs-red font-semibold ml-7">Set up &rarr;</div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-mjs-red" />
              </div>
              <div>
                <div className="text-2xl font-black text-mjs-dark">{displayOrders.length}</div>
                <div className="text-xs text-mjs-gray-400">Total Orders</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-black text-mjs-dark">Active</div>
                <div className="text-xs text-mjs-gray-400">Account Status</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                <BadgePercent className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <div className="text-2xl font-black text-mjs-dark">{(discountRate * 100).toFixed(0)}%</div>
                <div className="text-xs text-mjs-gray-400">Your Discount</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <div className="text-2xl font-black text-mjs-dark">${displayOrders.reduce((sum, o) => sum + o.total, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div className="text-xs text-mjs-gray-400">Total Spent</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-2 mb-6">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === tab
                    ? "bg-mjs-red text-white"
                    : "text-mjs-gray-500 hover:bg-mjs-gray-50 hover:text-mjs-dark"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* ═══ OVERVIEW TAB ═══ */}
        {activeTab === "Overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Orders */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-mjs-dark">Recent Orders</h2>
                  <button onClick={() => setActiveTab("Orders")} className="text-xs text-mjs-red font-semibold hover:underline">View All</button>
                </div>
                <div className="divide-y divide-gray-50">
                  {ordersLoading ? (
                    <div className="px-6 py-10 text-center">
                      <div className="w-6 h-6 border-2 border-gray-200 border-t-mjs-red rounded-full animate-spin mx-auto" />
                      <p className="text-xs text-mjs-gray-400 mt-2">Loading orders...</p>
                    </div>
                  ) : displayOrders.length === 0 ? (
                    <div className="px-6 py-10 text-center">
                      <Package className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-mjs-gray-600">No orders yet</p>
                      <p className="text-xs text-mjs-gray-400 mt-1">Your order history will appear here once you place your first order.</p>
                      <a href="/" className="inline-block mt-3 text-xs text-mjs-red font-semibold hover:underline">Start Shopping</a>
                    </div>
                  ) : displayOrders.slice(0, 4).map((order) => (
                    <button key={order.id} onClick={() => setViewingOrder(order)} className="w-full px-6 py-4 flex items-center justify-between hover:bg-mjs-gray-50/50 transition-colors text-left">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-mjs-gray-50 rounded-lg flex items-center justify-center">
                          <Package className="w-4 h-4 text-mjs-gray-400" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-mjs-dark">{order.id}</div>
                          <div className="text-xs text-mjs-gray-400">{order.date} &middot; {order.items} items</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm font-bold text-mjs-dark">${order.total.toFixed(2)}</div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${order.statusColor}`}>{order.status}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-mjs-gray-300" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-sm font-bold text-mjs-dark mb-4">Quick Actions</h2>
                <div className="space-y-2">
                  <button
                    onClick={openOrderModal}
                    className="w-full flex items-center gap-3 bg-mjs-red text-white rounded-xl px-4 py-3 hover:bg-red-700 transition-colors"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span className="text-sm font-semibold">Place New Order</span>
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </button>
                  <a href="/" className="w-full flex items-center gap-3 bg-mjs-gray-50 rounded-xl px-4 py-3 hover:bg-gray-100 transition-colors">
                    <Store className="w-5 h-5 text-mjs-gray-500" />
                    <span className="text-sm font-semibold text-mjs-dark">Browse Products</span>
                    <ChevronRight className="w-4 h-4 ml-auto text-mjs-gray-400" />
                  </a>
                  <a href="/quote" className="w-full flex items-center gap-3 bg-mjs-gray-50 rounded-xl px-4 py-3 hover:bg-gray-100 transition-colors">
                    <FileText className="w-5 h-5 text-mjs-gray-500" />
                    <span className="text-sm font-semibold text-mjs-dark">Get a Quote</span>
                    <ChevronRight className="w-4 h-4 ml-auto text-mjs-gray-400" />
                  </a>
                  <a href="/resources" className="w-full flex items-center gap-3 bg-mjs-gray-50 rounded-xl px-4 py-3 hover:bg-gray-100 transition-colors">
                    <Download className="w-5 h-5 text-mjs-gray-500" />
                    <span className="text-sm font-semibold text-mjs-dark">Download Forms</span>
                    <ChevronRight className="w-4 h-4 ml-auto text-mjs-gray-400" />
                  </a>
                </div>
              </div>

              {/* Account Reps */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-sm font-bold text-mjs-dark mb-4">Your Account Team</h2>
                <div className="space-y-4">
                  {[
                    { initials: "RB", name: "Ryan Bergman", email: "ryan@mobilejanitorialsupply.com" },
                    { initials: "ZB", name: "Zack Bergman", email: "zack@mobilejanitorialsupply.com" },
                    { initials: "NB", name: "Nick Bergman", email: "nick@mobilejanitorialsupply.com" },
                  ].map((rep) => (
                    <div key={rep.email} className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-mjs-red rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-xs">{rep.initials}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-mjs-dark">{rep.name}</div>
                        <a href={`mailto:${rep.email}`} className="text-xs text-mjs-gray-400 hover:text-mjs-red transition-colors">{rep.email}</a>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <a href="tel:7147792640" className="flex items-center gap-2 text-xs text-mjs-gray-500 hover:text-mjs-red transition-colors">
                    <Phone className="w-3.5 h-3.5" /> (714) 779-2640
                  </a>
                </div>
              </div>

              {/* Forms */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-sm font-bold text-mjs-dark mb-3">Forms & Documents</h2>
                <div className="space-y-2">
                  <a
                    href="/forms/new-customer-contact-form.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 bg-mjs-gray-50 rounded-xl hover:bg-red-50 hover:border-mjs-red/20 border border-transparent transition-all group"
                  >
                    <FileText className="w-5 h-5 text-mjs-red flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-mjs-dark group-hover:text-mjs-red transition-colors">New Customer Contact Form</div>
                      <div className="text-[10px] text-mjs-gray-400">PDF Download</div>
                    </div>
                  </a>
                  <a
                    href="/forms/credit-card-authorization-form.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 bg-mjs-gray-50 rounded-xl hover:bg-red-50 hover:border-mjs-red/20 border border-transparent transition-all group"
                  >
                    <FileText className="w-5 h-5 text-mjs-red flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-mjs-dark group-hover:text-mjs-red transition-colors">Credit Card Authorization Form</div>
                      <div className="text-[10px] text-mjs-gray-400">PDF Download</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ ORDERS TAB ═══ */}
        {activeTab === "Orders" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-sm font-bold text-mjs-dark">Order History</h2>
            </div>
            <div className="overflow-x-auto">
              {displayOrders.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-mjs-gray-600">No orders yet</p>
                  <p className="text-xs text-mjs-gray-400 mt-1 max-w-sm mx-auto">Once you place an order, it will appear here with full details, tracking, and reorder options.</p>
                  <a href="/" className="inline-block mt-4 bg-mjs-red text-white font-semibold px-6 py-2.5 rounded-lg text-sm hover:bg-red-700 transition-colors">Start Shopping</a>
                </div>
              ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-mjs-gray-50 text-xs font-semibold text-mjs-gray-400 uppercase tracking-wider">
                    <th className="text-left px-6 py-3">Order #</th>
                    <th className="text-left px-6 py-3">Date</th>
                    <th className="text-center px-6 py-3">Items</th>
                    <th className="text-right px-6 py-3">Total</th>
                    <th className="text-center px-6 py-3">Status</th>
                    <th className="text-right px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {displayOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-mjs-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-mjs-dark">{order.id}</td>
                      <td className="px-6 py-4 text-sm text-mjs-gray-500">{order.date}</td>
                      <td className="px-6 py-4 text-sm text-mjs-gray-500 text-center">{order.items}</td>
                      <td className="px-6 py-4 text-sm font-bold text-mjs-dark text-right">${order.total.toFixed(2)}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${order.statusColor}`}>{order.status}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => setViewingOrder(order)} className="text-xs text-mjs-gray-400 hover:text-mjs-dark font-medium flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" /> View
                          </button>
                          <button onClick={() => downloadInvoice(order)} className="text-xs text-mjs-gray-400 hover:text-mjs-dark font-medium flex items-center gap-1">
                            <Download className="w-3.5 h-3.5" /> Invoice
                          </button>
                          <button
                            onClick={() => handleReorder(order)}
                            className="text-xs text-mjs-red font-semibold flex items-center gap-1 hover:underline"
                          >
                            {reordered === order.id ? (
                              <><CheckCircle className="w-3.5 h-3.5 text-green-500" /> <span className="text-green-500">Added!</span></>
                            ) : (
                              <><RefreshCw className="w-3.5 h-3.5" /> Reorder</>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              )}
            </div>
          </div>
        )}

        {/* ═══ MY PRICING TAB ═══ */}
        {/* ═══ ACCOUNT INFO TAB ═══ */}
        {activeTab === "Rewards" && (
          <div className="space-y-6">
            {/* Rewards Summary */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-bold text-mjs-dark">Your Rewards</h2>
                <a href="/rewards" className="text-xs text-mjs-red font-semibold hover:underline">View Rewards Program &rarr;</a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-black text-mjs-dark">{displayOrders.length}</div>
                  <div className="text-[10px] text-mjs-gray-400 mt-0.5">Total Orders</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-black text-mjs-dark">
                    ${displayOrders.reduce((s, o) => s + o.total, 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-[10px] text-mjs-gray-400 mt-0.5">Lifetime Spend</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-black text-mjs-red">{displayOrders.filter(o => o.total >= 700).length}</div>
                  <div className="text-[10px] text-mjs-gray-400 mt-0.5">Rewards Earned</div>
                </div>
              </div>

              {/* Tier Display — Premium */}
              <div className="bg-gradient-to-br from-mjs-dark via-gray-800 to-mjs-dark rounded-2xl p-6 mb-6 relative overflow-hidden">
                <div className="absolute top-[-30px] right-[-20px] w-[120px] h-[120px] bg-mjs-red/5 rounded-full" />
                <div className="absolute bottom-[-40px] left-[-20px] w-[100px] h-[100px] bg-mjs-red/5 rounded-full" />
                <div className="relative">
                  <div className="text-center mb-5">
                    <div className="text-3xl mb-2">🎁</div>
                    <div className="text-[10px] font-bold uppercase tracking-[3px] text-mjs-red mb-1">Reward Tiers</div>
                    <div className="text-lg font-black text-white">Earn a Gift Card on Every Qualifying Order</div>
                    <div className="text-xs text-gray-400 mt-1">Highest tier per order — gift card delivered to your email within 72 hours</div>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { min: "$700", reward: "$10", label: "Bronze", color: "from-amber-600 to-amber-700" },
                      { min: "$2,000", reward: "$25", label: "Silver", color: "from-gray-400 to-gray-500" },
                      { min: "$3,500", reward: "$50", label: "Gold", color: "from-yellow-400 to-amber-500" },
                      { min: "$5,000", reward: "$75", label: "Platinum", color: "from-indigo-500 to-purple-600" },
                      { min: "$7,500", reward: "$100", label: "Diamond", color: "from-mjs-red to-red-700" },
                    ].map((tier, i) => (
                      <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center hover:bg-white/10 transition-all">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tier.color} flex items-center justify-center mx-auto mb-2 shadow-lg`}>
                          <span className="text-white text-sm font-black">{tier.reward}</span>
                        </div>
                        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{tier.label}</div>
                        <div className="text-xs font-bold text-white mt-0.5">{tier.min}+</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reward History */}
              <div>
                <h3 className="text-sm font-bold text-mjs-dark mb-3">Reward History</h3>
                {displayOrders.filter(o => o.total >= 700).length > 0 ? (
                  <div className="space-y-3">
                    {displayOrders
                      .filter(o => o.total >= 700)
                      .map(order => {
                        let rewardAmount = 0;
                        let tierLabel = "";
                        let tierColor = "from-amber-600 to-amber-700";
                        if (order.total >= 7500) { rewardAmount = 100; tierLabel = "Diamond"; tierColor = "from-mjs-red to-red-700"; }
                        else if (order.total >= 5000) { rewardAmount = 75; tierLabel = "Platinum"; tierColor = "from-indigo-500 to-purple-600"; }
                        else if (order.total >= 3500) { rewardAmount = 50; tierLabel = "Gold"; tierColor = "from-yellow-400 to-amber-500"; }
                        else if (order.total >= 2000) { rewardAmount = 25; tierLabel = "Silver"; tierColor = "from-gray-400 to-gray-500"; }
                        else if (order.total >= 700) { rewardAmount = 10; tierLabel = "Bronze"; tierColor = "from-amber-600 to-amber-700"; }

                        // Extract gift card brand from order notes if available
                        const staffNotes = (order as unknown as Record<string, unknown>).staffNotes as string || "";
                        const brandMatch = staffNotes.match(/GIFT CARD:\s*(\w+)/);
                        const giftBrand = brandMatch ? brandMatch[1] : null;

                        // Calculate 72h countdown from order creation time
                        const orderDate = new Date(order.dateRaw);
                        const deliveryDate = new Date(orderDate.getTime() + 72 * 60 * 60 * 1000);
                        const now = new Date();
                        const msRemaining = deliveryDate.getTime() - now.getTime();
                        const hoursLeft = Math.max(0, Math.floor(msRemaining / (1000 * 60 * 60)));
                        const minsLeft = Math.max(0, Math.floor((msRemaining % (1000 * 60 * 60)) / (1000 * 60)));
                        const isDelivered = msRemaining <= 0;

                        return (
                          <div
                            key={order.id}
                            onClick={() => setViewingReward({ amount: rewardAmount, brand: giftBrand || "Gift Card", tierLabel, tierColor, orderId: order.id, orderDate: order.date, orderTotal: order.total, hoursLeft, minsLeft, isDelivered })}
                            className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md hover:border-mjs-red/30 transition-all cursor-pointer"
                          >
                            <div className="flex items-center gap-4">
                              {/* Tier icon */}
                              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tierColor} flex items-center justify-center flex-shrink-0 shadow-md`}>
                                <span className="text-white text-sm font-black">${rewardAmount}</span>
                              </div>
                              {/* Details */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-bold text-mjs-dark">${rewardAmount} Gift Card</span>
                                  {giftBrand && (
                                    <span className="text-[9px] font-bold bg-gray-100 text-mjs-gray-600 px-2 py-0.5 rounded-full">{giftBrand}</span>
                                  )}
                                </div>
                                <div className="text-[10px] text-mjs-gray-400 mt-0.5">
                                  {order.id} &middot; {order.date} &middot; {tierLabel} Tier &middot; ${order.total.toFixed(2)} order
                                </div>
                              </div>
                              {/* Status / Countdown */}
                              <div className="text-right flex-shrink-0">
                                {isDelivered ? (
                                  <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full">
                                    <CheckCircle className="w-3 h-3" />
                                    Delivered
                                  </div>
                                ) : (
                                  <div>
                                    <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 text-[10px] font-bold px-2.5 py-1 rounded-full">
                                      <Clock className="w-3 h-3" />
                                      {hoursLeft}h {minsLeft}m
                                    </div>
                                    <div className="text-[9px] text-mjs-gray-400 mt-1">Delivering soon</div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-gray-50 rounded-xl">
                    <Gift className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <div className="text-sm font-bold text-mjs-gray-500 mb-1">No rewards yet</div>
                    <div className="text-xs text-mjs-gray-400">Place an order of $700 or more to earn your first gift card.</div>
                    <a href="/" className="inline-block mt-4 bg-mjs-red text-white font-semibold px-5 py-2 rounded-lg text-xs hover:bg-red-700 transition-colors">
                      Start Shopping
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "Account Info" && (
          <div className="space-y-6">
            {/* ── Tax ID / Resale Certificate Upload — only show when not yet activated ── */}
            {!taxIdUploaded && (
              <div id="tax-id-section" className="rounded-2xl border shadow-sm p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-blue-100">
                    <Upload className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-sm font-bold text-mjs-dark">Tax Exempt? Enter Your Resale / Tax ID</h2>
                    <p className="text-xs text-mjs-gray-500 mt-0.5">
                      Enter your Tax ID or Resale Certificate number below. Once verified and activated, tax will no longer be applied to your orders.
                    </p>

                    <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-end gap-3">
                      <div className="flex-1 w-full sm:w-auto">
                        <label className="block text-[10px] font-medium text-mjs-gray-600 mb-1 uppercase">Tax ID / Resale Number</label>
                        <input
                          type="text"
                          value={taxIdNumber}
                          onChange={(e) => setTaxIdNumber(e.target.value)}
                          placeholder="e.g. 12-3456789 or SR GHA 12-345678"
                          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 transition-all font-mono tracking-wide"
                        />
                      </div>
                      <button
                        onClick={async () => {
                          const id = taxIdNumber.trim();
                          if (!id) { setTaxIdError("Please enter your Tax ID number."); return; }
                          // Validate format — must be at least 7 chars, contain digits
                          const digits = id.replace(/[^0-9]/g, "");
                          if (digits.length < 7) { setTaxIdError("Invalid Tax ID. Must contain at least 7 digits."); return; }
                          if (!/\d{2,}[-\s]?\d{3,}/.test(id) && !/[A-Z]{2,}\s*[A-Z]*\s*\d{2,}[-\s]?\d+/.test(id.toUpperCase())) {
                            setTaxIdError("Invalid format. Enter a valid EIN (XX-XXXXXXX) or state resale certificate number.");
                            return;
                          }
                          setTaxIdError("");
                          setTaxIdUploading(true);
                          try {
                            const res = await fetch("/api/customers/tax-id", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                customerId: user?.id,
                                taxIdNumber: id,
                                customerName: `${user?.firstName} ${user?.lastName}`,
                                customerEmail: user?.email || "",
                                companyName: user?.company || "",
                              }),
                            });
                            const data = await res.json();
                            if (data.success) {
                              setTaxIdUploaded(true);
                              setTaxIdFileName(id);
                              setTaxIdDate(data.uploadDate);
                              try { localStorage.setItem("mjs_tax_exempt", "true"); } catch {}
                            } else {
                              setTaxIdError(data.error || "Failed to save. Please try again.");
                            }
                          } catch {
                            setTaxIdError("Something went wrong. Please try again.");
                          }
                          setTaxIdUploading(false);
                        }}
                        disabled={taxIdUploading}
                        className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-lg text-xs hover:bg-blue-700 shadow-sm transition-all disabled:opacity-50"
                      >
                        <Shield className="w-3.5 h-3.5" />
                        {taxIdUploading ? "Verifying..." : "Submit & Activate"}
                      </button>
                    </div>
                    <span className="text-[10px] text-mjs-gray-400 mt-1.5 block">EIN format: XX-XXXXXXX &middot; CA Resale: SR GHA XX-XXXXXX</span>

                    {taxIdError && (
                      <div className="mt-3 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-600 font-medium">
                        {taxIdError}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── Company Information ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-mjs-dark">Company Information</h2>
                  {profileSaved && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1 animate-in fade-in duration-300">
                      <CheckCircle className="w-3 h-3" /> Saved
                    </span>
                  )}
                </div>
                {editingCompany ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setEditingCompany(false); if (user) setCompanyInfo({ company: user.company || "", firstName: user.firstName || "", lastName: user.lastName || "", email: user.email || "", phone: user.phone || "" }); }}
                      className="text-xs text-mjs-gray-400 font-semibold hover:underline"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveProfile}
                      disabled={savingProfile}
                      className="text-xs bg-mjs-red text-white font-bold px-3 py-1 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      {savingProfile ? "Saving..." : "Save"}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditingCompany(true)}
                    className="text-xs text-mjs-red font-semibold hover:underline"
                  >
                    Edit
                  </button>
                )}
              </div>

              {!editingCompany ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { icon: Building2, label: "Company Name", value: companyInfo.company },
                    { icon: User, label: "Contact Name", value: `${companyInfo.firstName} ${companyInfo.lastName}` },
                    { icon: Mail, label: "Email", value: companyInfo.email },
                    { icon: Phone, label: "Phone", value: companyInfo.phone },
                  ].map((field) => (
                    <div key={field.label} className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-mjs-gray-50 flex items-center justify-center flex-shrink-0">
                        <field.icon className="w-4 h-4 text-mjs-gray-400" />
                      </div>
                      <div>
                        <div className="text-[10px] text-mjs-gray-500 font-medium uppercase">{field.label}</div>
                        <div className="text-sm font-semibold text-mjs-dark">{field.value}</div>
                      </div>
                    </div>
                  ))}
                  {taxIdUploaded && (
                    <div className="sm:col-span-2 mt-2 flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <div className="text-[10px] text-emerald-600 font-medium uppercase">Tax Exempt</div>
                        <div className="text-sm font-bold text-emerald-800">TAX ID {taxIdFileName}</div>
                      </div>
                      <span className="bg-emerald-600 text-white text-[9px] font-bold px-2.5 py-1 rounded-full tracking-wide">ACTIVATED</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  <input type="text" value={companyInfo.company} onChange={(e) => setCompanyInfo({ ...companyInfo, company: e.target.value })} placeholder="Company Name" className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-mjs-red transition-all" />
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" value={companyInfo.firstName} onChange={(e) => setCompanyInfo({ ...companyInfo, firstName: e.target.value })} placeholder="First Name" className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-mjs-red transition-all" />
                    <input type="text" value={companyInfo.lastName} onChange={(e) => setCompanyInfo({ ...companyInfo, lastName: e.target.value })} placeholder="Last Name" className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-mjs-red transition-all" />
                  </div>
                  <input type="email" value={companyInfo.email} onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })} placeholder="Email" className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-mjs-red transition-all" />
                  <input type="tel" value={companyInfo.phone} onChange={(e) => setCompanyInfo({ ...companyInfo, phone: e.target.value })} placeholder="Phone" className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-mjs-red transition-all" />
                </div>
              )}
            </div>

            {/* ── Password ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-mjs-dark">Password & Security</h2>
                  {passwordSaved && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1 animate-in fade-in duration-300">
                      <CheckCircle className="w-3 h-3" /> Password Updated
                    </span>
                  )}
                </div>
                {!showPasswordForm && (
                  <button
                    onClick={() => setShowPasswordForm(true)}
                    className="text-xs text-mjs-red font-semibold hover:underline"
                  >
                    Change Password
                  </button>
                )}
              </div>

              {!showPasswordForm ? (
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-mjs-gray-50 flex items-center justify-center flex-shrink-0">
                    <Lock className="w-4 h-4 text-mjs-gray-400" />
                  </div>
                  <div>
                    <div className="text-[10px] text-mjs-gray-500 font-medium uppercase">Password</div>
                    <div className="text-sm font-semibold text-mjs-dark">••••••••••</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-mjs-gray-600 mb-1">New Password</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Minimum 7 characters"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-mjs-red transition-all pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-mjs-gray-400 hover:text-mjs-gray-600"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-mjs-gray-600 mb-1">Confirm Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your new password"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-mjs-red transition-all"
                    />
                  </div>
                  {passwordError && (
                    <div className="bg-red-50 text-red-600 text-xs font-medium px-3 py-2 rounded-lg">
                      {passwordError}
                    </div>
                  )}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => { setShowPasswordForm(false); setNewPassword(""); setConfirmPassword(""); setPasswordError(""); }}
                      className="text-xs text-mjs-gray-400 font-semibold hover:underline"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleChangePassword}
                      disabled={passwordSaving}
                      className="text-xs bg-mjs-red text-white font-bold px-4 py-1.5 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      {passwordSaving ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ── Delivery Addresses ── */}
            <div id="delivery-addresses" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-bold text-mjs-dark">Delivery Addresses</h2>
                <button
                  onClick={() => {
                    setAddressForm({ label: "", company: companyInfo.company, address: "", city: "", state: "CA", zip: "" });
                    setEditingAddressId(null);
                    setShowAddressForm(true);
                  }}
                  className="flex items-center gap-1 text-xs text-mjs-red font-semibold hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Address
                </button>
              </div>

              {/* Address Cards Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {addresses.map((addr) => (
                  <div key={addr.id} className="border border-gray-200 rounded-xl p-4 hover:border-mjs-red/30 hover:shadow-sm transition-all group">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-[10px] font-bold text-mjs-red uppercase tracking-wide bg-red-50 px-2 py-0.5 rounded">{addr.label}</span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setAddressForm({ label: addr.label, company: addr.company, address: addr.address, city: addr.city, state: addr.state, zip: addr.zip });
                            setEditingAddressId(addr.id);
                            setShowAddressForm(true);
                          }}
                          className="text-[10px] text-mjs-gray-500 hover:text-mjs-red font-medium"
                        >
                          Edit
                        </button>
                        <span className="text-mjs-gray-300">|</span>
                        <button
                          onClick={async () => {
                            try {
                              await fetch("/api/customer/addresses", {
                                method: "DELETE",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ addressId: addr.id }),
                              });
                            } catch {}
                            setAddresses(addresses.filter(a => a.id !== addr.id));
                          }}
                          className="text-[10px] text-mjs-gray-500 hover:text-red-600 font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-mjs-dark">{addr.company}</div>
                    <div className="text-xs text-mjs-gray-600 mt-1">{addr.address}</div>
                    <div className="text-xs text-mjs-gray-600">{addr.city}, {addr.state} {addr.zip}</div>
                  </div>
                ))}

                {/* Add New Address Card */}
                <button
                  onClick={() => {
                    setAddressForm({ label: "", company: companyInfo.company, address: "", city: "", state: "CA", zip: "" });
                    setEditingAddressId(null);
                    setShowAddressForm(true);
                  }}
                  className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:border-mjs-red/40 hover:bg-red-50/30 transition-all min-h-[120px]"
                >
                  <div className="w-10 h-10 rounded-full bg-mjs-gray-50 flex items-center justify-center">
                    <Plus className="w-5 h-5 text-mjs-gray-400" />
                  </div>
                  <span className="text-xs font-semibold text-mjs-gray-500">Add New Address</span>
                </button>
              </div>

              {/* Add/Edit Address Form */}
              {showAddressForm && (
                <div className="mt-4 border border-mjs-red/20 bg-red-50/20 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-mjs-dark">
                      {editingAddressId ? "Edit Address" : "New Delivery Address"}
                    </h3>
                    <button onClick={() => setShowAddressForm(false)} className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center">
                      <X className="w-4 h-4 text-mjs-gray-400" />
                    </button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <input type="text" value={addressForm.label} onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })} placeholder="Label (e.g. Main Office, Warehouse)" className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-mjs-red transition-all" />
                    <input type="text" value={addressForm.company} onChange={(e) => setAddressForm({ ...addressForm, company: e.target.value })} placeholder="Company Name" className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-mjs-red transition-all" />
                    <input type="text" value={addressForm.address} onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })} placeholder="Street Address" className="sm:col-span-2 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-mjs-red transition-all" />
                    <input type="text" value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} placeholder="City" className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-mjs-red transition-all" />
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" value={addressForm.state} onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} placeholder="State" maxLength={2} className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-mjs-red transition-all" />
                      <input type="text" value={addressForm.zip} onChange={(e) => setAddressForm({ ...addressForm, zip: e.target.value })} placeholder="ZIP" className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-mjs-red transition-all" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <button
                      onClick={async () => {
                        if (!addressForm.address || !addressForm.city || !addressForm.zip) return;
                        if (!user?.id) return;

                        if (editingAddressId) {
                          // Update existing address in BC
                          try {
                            const res = await fetch("/api/customer/addresses", {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                addressId: editingAddressId,
                                company: addressForm.company,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                address: addressForm.address,
                                city: addressForm.city,
                                state: addressForm.state,
                                zip: addressForm.zip,
                              }),
                            });
                            if ((await res.json()).success) {
                              setAddresses(addresses.map(a => a.id === editingAddressId ? { ...addressForm, id: editingAddressId } : a));
                            }
                          } catch {}
                        } else {
                          // Create new address in BC
                          try {
                            const res = await fetch("/api/customer/addresses", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                customerId: user.id,
                                company: addressForm.company,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                address: addressForm.address,
                                city: addressForm.city,
                                state: addressForm.state,
                                zip: addressForm.zip,
                              }),
                            });
                            const data = await res.json();
                            if (data.success && data.address) {
                              setAddresses([...addresses, {
                                id: data.address.id,
                                label: addressForm.label || addressForm.company || `${addressForm.city}, ${addressForm.state}`,
                                company: addressForm.company,
                                address: addressForm.address,
                                city: addressForm.city,
                                state: addressForm.state,
                                zip: addressForm.zip,
                              }]);
                            }
                          } catch {}
                        }
                        setShowAddressForm(false);
                        setEditingAddressId(null);
                      }}
                      className="bg-mjs-red text-white font-semibold px-5 py-2.5 rounded-lg text-sm hover:bg-red-700 transition-colors"
                    >
                      {editingAddressId ? "Save Changes" : "Add Address"}
                    </button>
                    <button
                      onClick={() => { setShowAddressForm(false); setEditingAddressId(null); }}
                      className="text-sm text-mjs-gray-500 font-medium px-4 py-2.5 hover:text-mjs-dark transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ── Billing & Account Details ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-mjs-dark">Billing Information</h2>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-mjs-gray-50 flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-4 h-4 text-mjs-gray-400" />
                  </div>
                  <div>
                    <div className="text-[10px] text-mjs-gray-500 font-medium uppercase">Payment Method</div>
                    <div className="text-sm font-semibold text-mjs-dark">Bill to Company (Net 30)</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-mjs-dark">Account Details</h2>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-mjs-gray-500">Pricing Tier</span>
                    <span className="font-semibold text-mjs-dark">{pricingTier}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-mjs-gray-500">Discount Rate</span>
                    <span className="font-semibold text-mjs-dark">{(discountRate * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-mjs-gray-500">Account Since</span>
                    <span className="font-semibold text-mjs-dark">Jan 2024</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-mjs-gray-500">Credit Terms</span>
                    <span className="font-semibold text-mjs-dark">Net 30</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ═══ PLACE ORDER MODAL ═══ */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowOrderModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="px-8 pt-6 pb-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-mjs-dark">Place an Order</h2>
                <p className="text-sm text-mjs-gray-500 mt-0.5">Step {orderStep} of 2</p>
              </div>
              <button onClick={() => setShowOrderModal(false)} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
                <X className="w-5 h-5 text-mjs-gray-400" />
              </button>
            </div>

            <div className="px-8 py-6">
              {/* ── STEP 1: Payment & Fulfillment ── */}
              {orderStep === 1 && (
                <>
                  {/* Bill To */}
                  <div className="bg-mjs-gray-50 rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-bold text-mjs-gray-500 uppercase tracking-wider">Bill To</h3>
                      <button onClick={() => setEditBillTo(!editBillTo)} className="text-[10px] text-mjs-red font-semibold hover:underline">
                        {editBillTo ? "Done" : "Edit"}
                      </button>
                    </div>

                    {!editBillTo ? (
                      <div className="flex items-start gap-3">
                        <Building2 className="w-5 h-5 text-mjs-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-semibold text-mjs-dark">{billTo.company}</div>
                          <div className="text-xs text-mjs-gray-500">{billTo.name} &middot; {billTo.email}</div>
                          {billTo.phone && <div className="text-xs text-mjs-gray-500">{billTo.phone}</div>}
                          {billTo.address && <div className="text-xs text-mjs-gray-500">{billTo.address}, {billTo.city}, {billTo.state} {billTo.zip}</div>}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2.5 mt-3">
                        <input type="text" value={billTo.company} onChange={(e) => setBillTo({ ...billTo, company: e.target.value })} placeholder="Company Name" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-mjs-red transition-all" />
                        <input type="text" value={billTo.name} onChange={(e) => setBillTo({ ...billTo, name: e.target.value })} placeholder="Contact Name" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-mjs-red transition-all" />
                        <div className="grid grid-cols-2 gap-2">
                          <input type="email" value={billTo.email} onChange={(e) => setBillTo({ ...billTo, email: e.target.value })} placeholder="Email" className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-mjs-red transition-all" />
                          <input type="tel" value={billTo.phone} onChange={(e) => setBillTo({ ...billTo, phone: e.target.value })} placeholder="Phone" className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-mjs-red transition-all" />
                        </div>
                        <input type="text" value={billTo.address} onChange={(e) => setBillTo({ ...billTo, address: e.target.value })} placeholder="Street Address" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-mjs-red transition-all" />
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                          <input type="text" value={billTo.city} onChange={(e) => setBillTo({ ...billTo, city: e.target.value })} placeholder="City" className="col-span-3 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-mjs-red transition-all" />
                          <input type="text" value={billTo.state} onChange={(e) => setBillTo({ ...billTo, state: e.target.value })} placeholder="ST" maxLength={2} className="col-span-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-mjs-red transition-all" />
                          <input type="text" value={billTo.zip} onChange={(e) => setBillTo({ ...billTo, zip: e.target.value })} placeholder="ZIP" className="col-span-2 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-mjs-red transition-all" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Payment Method */}
                  <h3 className="text-xs font-bold text-mjs-gray-500 uppercase tracking-wider mb-3">Payment Method</h3>
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {[
                      { id: "bill", label: "Bill to Company", icon: Building2, sub: "Net 30 Terms" },
                      { id: "card", label: "Credit Card", icon: CreditCard, sub: "Pay Now" },
                      { id: "cash", label: "Cash on Pickup", icon: DollarSign, sub: "Pay at Counter" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setPaymentMethod(opt.id)}
                        className={`p-4 rounded-xl border-2 text-center transition-all ${
                          paymentMethod === opt.id
                            ? "border-mjs-red bg-red-50"
                            : "border-gray-100 hover:border-gray-200"
                        }`}
                      >
                        <opt.icon className={`w-6 h-6 mx-auto mb-2 ${paymentMethod === opt.id ? "text-mjs-red" : "text-mjs-gray-400"}`} />
                        <div className="text-xs font-semibold text-mjs-dark">{opt.label}</div>
                        <div className="text-[10px] text-mjs-gray-500">{opt.sub}</div>
                      </button>
                    ))}
                  </div>

                  {/* Bill to Company confirmation */}
                  {paymentMethod === "bill" && (
                    <div className="bg-blue-50 rounded-xl p-4 mb-6 flex items-start gap-3">
                      <Building2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-semibold text-blue-700">Billing to {billTo.company || "your company"}</div>
                        <div className="text-xs text-blue-600">{billTo.name} &middot; Net 30 Terms</div>
                      </div>
                    </div>
                  )}

                  {/* Fulfillment */}
                  <h3 className="text-xs font-bold text-mjs-gray-500 uppercase tracking-wider mb-3">Fulfillment</h3>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {[
                      { id: "delivery", label: "Delivery", icon: Truck, sub: "1-3 Business Days" },
                      { id: "pickup", label: "Will Call (Pickup)", icon: Store, sub: "Ready Same Day" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setFulfillment(opt.id);
                          // Auto-select first saved address when choosing delivery
                          if (opt.id === "delivery" && addresses.length > 0 && !selectedAddress) {
                            setSelectedAddress(addresses[0].id);
                          }
                        }}
                        className={`p-4 rounded-xl border-2 text-center transition-all ${
                          fulfillment === opt.id
                            ? "border-mjs-red bg-red-50"
                            : "border-gray-100 hover:border-gray-200"
                        }`}
                      >
                        <opt.icon className={`w-6 h-6 mx-auto mb-2 ${fulfillment === opt.id ? "text-mjs-red" : "text-mjs-gray-400"}`} />
                        <div className="text-xs font-semibold text-mjs-dark">{opt.label}</div>
                        <div className="text-[10px] text-mjs-gray-500">{opt.sub}</div>
                      </button>
                    ))}
                  </div>

                  {/* Delivery — show saved address preview if available */}
                  {fulfillment === "delivery" && addresses.length > 0 && (
                    <div className="bg-mjs-gray-50 rounded-xl p-4 mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-bold text-mjs-gray-500 uppercase tracking-wider">Ship To</h3>
                        <span className="text-[10px] text-mjs-gray-400">{addresses.length} address{addresses.length !== 1 ? "es" : ""} on file</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="text-sm font-semibold text-mjs-dark">{addresses.find(a => a.id === selectedAddress)?.label || addresses[0].label}</div>
                          <div className="text-xs text-mjs-gray-500">
                            {(() => { const a = addresses.find(addr => addr.id === selectedAddress) || addresses[0]; return `${a.address}, ${a.city}, ${a.state} ${a.zip}`; })()}
                          </div>
                          {addresses.length > 1 && (
                            <button onClick={() => { setOrderStep(2); }} className="text-[10px] text-mjs-red font-semibold mt-1 hover:underline">
                              Change address
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Pickup info */}
                  {fulfillment === "pickup" && (
                    <div className="bg-green-50 rounded-xl p-4 mb-6 flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-semibold text-green-700">Anaheim Warehouse</div>
                        <div className="text-xs text-green-600">3066 E. La Palma Ave &middot; Mon-Fri 6:30 AM - 2:45 PM</div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* ── STEP 2: Ship To Address ── */}
              {orderStep === 2 && fulfillment === "delivery" && (
                <>
                  <h3 className="text-xs font-bold text-mjs-gray-400 uppercase tracking-wider mb-3">Ship To — Saved Addresses</h3>
                  <div className="space-y-2 mb-6">
                    {savedAddresses.map((addr) => (
                      <button
                        key={addr.id}
                        onClick={() => setSelectedAddress(addr.id)}
                        className={`w-full flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                          selectedAddress === addr.id
                            ? "border-mjs-red bg-red-50/30"
                            : "border-gray-100 hover:border-gray-200"
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${selectedAddress === addr.id ? "bg-mjs-red" : "bg-mjs-gray-50"}`}>
                          <MapPin className={`w-5 h-5 ${selectedAddress === addr.id ? "text-white" : "text-mjs-gray-400"}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-mjs-dark">{addr.label}</span>
                            {selectedAddress === addr.id && (
                              <div className="w-5 h-5 rounded-full bg-mjs-red flex items-center justify-center">
                                <CheckCircle className="w-3.5 h-3.5 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-mjs-gray-500 mt-0.5">{addr.company}</div>
                          <div className="text-xs text-mjs-gray-500">{addr.address}, {addr.city}, {addr.state} {addr.zip}</div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Add New Address */}
                  <div className="border border-dashed border-gray-300 rounded-xl p-5 mb-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Plus className="w-4 h-4 text-mjs-gray-400" />
                      <span className="text-xs font-bold text-mjs-gray-400 uppercase tracking-wider">New Ship To Address</span>
                    </div>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={customShipTo.name}
                        onChange={(e) => setCustomShipTo({ ...customShipTo, name: e.target.value })}
                        placeholder="Location name (e.g. Building C)"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-mjs-red transition-all"
                      />
                      <input
                        type="text"
                        value={customShipTo.address}
                        onChange={(e) => setCustomShipTo({ ...customShipTo, address: e.target.value })}
                        placeholder="Street address"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-mjs-red transition-all"
                      />
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        <input
                          type="text"
                          value={customShipTo.city}
                          onChange={(e) => setCustomShipTo({ ...customShipTo, city: e.target.value })}
                          placeholder="City"
                          className="col-span-3 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-mjs-red transition-all"
                        />
                        <input
                          type="text"
                          value={customShipTo.state}
                          onChange={(e) => setCustomShipTo({ ...customShipTo, state: e.target.value })}
                          placeholder="State"
                          maxLength={2}
                          className="col-span-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-mjs-red transition-all"
                        />
                        <input
                          type="text"
                          value={customShipTo.zip}
                          onChange={(e) => setCustomShipTo({ ...customShipTo, zip: e.target.value })}
                          placeholder="Zip"
                          className="col-span-2 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-mjs-red transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer Actions */}
            <div className="px-8 py-5 border-t border-gray-100 flex gap-3">
              {(() => {
                const saveAndShop = () => {
                  const selectedAddr = addresses.find(a => a.id === selectedAddress);
                  setOrderSetup({
                    paymentMethod: paymentMethod as "bill" | "card" | "cash",
                    fulfillment: fulfillment as "delivery" | "pickup",
                    billTo: {
                      company: billTo.company,
                      name: billTo.name,
                      email: billTo.email,
                      phone: billTo.phone,
                    },
                    shipTo: fulfillment === "delivery" && selectedAddr ? {
                      label: selectedAddr.label,
                      company: selectedAddr.company,
                      address: selectedAddr.address,
                      city: selectedAddr.city,
                      state: selectedAddr.state,
                      zip: selectedAddr.zip,
                    } : fulfillment === "delivery" && customShipTo.address ? {
                      label: customShipTo.name || "Custom Address",
                      company: "",
                      address: customShipTo.address,
                      city: customShipTo.city,
                      state: customShipTo.state,
                      zip: customShipTo.zip,
                    } : null,
                  });
                  setShowOrderModal(false);
                  window.location.href = "/";
                };

                return orderStep === 1 ? (
                  <>
                    <button onClick={() => setShowOrderModal(false)} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-mjs-gray-500 hover:bg-gray-50 transition-colors">
                      Cancel
                    </button>
                    {fulfillment === "pickup" || (fulfillment === "delivery" && selectedAddress) ? (
                      <button
                        onClick={saveAndShop}
                        className={`flex-1 py-3 rounded-xl text-sm font-semibold text-center transition-colors ${
                          paymentMethod && fulfillment
                            ? "bg-mjs-red text-white hover:bg-red-700"
                            : "bg-gray-100 text-mjs-gray-400 pointer-events-none"
                        }`}
                      >
                        Start Shopping
                      </button>
                    ) : (
                      <button
                        onClick={() => fulfillment && setOrderStep(2)}
                        className={`flex-1 py-3 rounded-xl text-sm font-semibold text-center transition-colors flex items-center justify-center gap-2 ${
                          paymentMethod && fulfillment
                            ? "bg-mjs-red text-white hover:bg-red-700"
                            : "bg-gray-100 text-mjs-gray-400 cursor-not-allowed"
                        }`}
                        disabled={!paymentMethod || !fulfillment}
                      >
                        Next: Ship To Address
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <button onClick={() => setOrderStep(1)} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-mjs-gray-500 hover:bg-gray-50 transition-colors">
                      Back
                    </button>
                    <button
                      onClick={saveAndShop}
                      className={`flex-1 py-3 rounded-xl text-sm font-semibold text-center transition-colors ${
                        selectedAddress || customShipTo.address
                          ? "bg-mjs-red text-white hover:bg-red-700"
                          : "bg-gray-100 text-mjs-gray-400 pointer-events-none"
                      }`}
                    >
                      Start Shopping
                    </button>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ═══ ORDER INVOICE MODAL ═══ */}
      {/* Reward Detail Modal */}
      {viewingReward && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300" onClick={() => setViewingReward(null)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[400px] overflow-hidden animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
            {/* Dark Header */}
            <div className={`bg-gradient-to-br ${viewingReward.tierColor} p-6 text-center relative overflow-hidden`}>
              <div className="absolute top-[-30px] right-[-20px] w-[100px] h-[100px] bg-white/10 rounded-full" />
              <div className="absolute bottom-[-20px] left-[-10px] w-[80px] h-[80px] bg-white/5 rounded-full" />
              <button onClick={() => setViewingReward(null)} className="absolute top-3 right-3 text-white/50 hover:text-white transition-colors text-sm z-10">&#10005;</button>
              <div className="relative">
                <div className="text-4xl mb-2">🎁</div>
                <div className="text-3xl font-black text-white">${viewingReward.amount}.00</div>
                <div className="text-sm font-bold text-white/80 mt-1">{viewingReward.brand === "Gift Card" ? "Gift Card" : `${viewingReward.brand} Gift Card`}</div>
                <div className="text-[10px] text-white/50 mt-1">{viewingReward.tierLabel} Tier Reward</div>
              </div>
            </div>

            {/* Brand Card Image */}
            {(() => {
              const brandImages: Record<string, string> = {
                "Amazon": "https://api.tremendous.com/product_images/OKMHM2X2OHYV/card",
                "Apple": "https://api.tremendous.com/product_images/DC82VBYLI4CC/card",
                "Starbucks": "https://api.tremendous.com/product_images/2XG0FLQXBDCZ/card",
                "Southwest": "https://api.tremendous.com/product_images/GL3Y4RNQJAQ1/card",
                "DoorDash": "https://api.tremendous.com/product_images/9OEIQ5EWBWT9/card",
                "Chipotle": "https://api.tremendous.com/product_images/CRN0ID07Y2XD/card",
                "Airbnb": "https://api.tremendous.com/product_images/HNFP6TMSPA9W/card",
                "AMC": "https://api.tremendous.com/product_images/DYHLA54LEX11/card",
                "Chevron": "https://api.tremendous.com/product_images/4SAT90Q41D60/card",
                "Dick": "https://api.tremendous.com/product_images/L9SW3VT4MLW4/card",
              };
              const imgKey = Object.keys(brandImages).find(k => viewingReward.brand.includes(k));
              const imgUrl = imgKey ? brandImages[imgKey] : null;
              if (!imgUrl) return null;
              return (
                <div className="px-6 pt-5">
                  <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200">
                    <img src={imgUrl} alt={viewingReward.brand} className="w-full h-auto" />
                  </div>
                </div>
              );
            })()}

            {/* Details */}
            <div className="p-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-[9px] text-mjs-gray-400 uppercase font-bold">Order</div>
                  <div className="text-xs font-bold text-mjs-dark mt-0.5">{viewingReward.orderId}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-[9px] text-mjs-gray-400 uppercase font-bold">Order Total</div>
                  <div className="text-xs font-bold text-mjs-dark mt-0.5">${viewingReward.orderTotal.toFixed(2)}</div>
                </div>
              </div>

              {/* Delivery Status */}
              <div className={`rounded-xl p-4 text-center ${viewingReward.isDelivered ? "bg-emerald-50 border border-emerald-200" : "bg-amber-50 border border-amber-200"}`}>
                {viewingReward.isDelivered ? (
                  <div>
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                      <span className="text-sm font-bold text-emerald-800">Delivered to Your Email</span>
                    </div>
                    <div className="text-xs text-emerald-600">Check your inbox for your gift card details</div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Clock className="w-5 h-5 text-amber-600" />
                      <span className="text-sm font-bold text-amber-800">Arriving in {viewingReward.hoursLeft}h {viewingReward.minsLeft}m</span>
                    </div>
                    <div className="text-xs text-amber-600">Your gift card is being verified and will be emailed to you</div>
                    {/* Progress bar */}
                    <div className="w-full h-2 bg-amber-200 rounded-full mt-3 overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all"
                        style={{ width: `${Math.max(5, 100 - ((viewingReward.hoursLeft * 60 + viewingReward.minsLeft) / (72 * 60)) * 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-[9px] text-amber-500">Order placed</span>
                      <span className="text-[9px] text-amber-500">72h delivery</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-[10px] text-mjs-gray-400 text-center mt-3">Placed on {viewingReward.orderDate}</div>

              <button
                onClick={() => setViewingReward(null)}
                className="w-full mt-4 bg-mjs-dark text-white font-bold text-sm py-3 rounded-xl hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {viewingOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setViewingOrder(null)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Invoice Header */}
            <div className="bg-mjs-dark rounded-t-2xl px-8 py-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src="/images/mjs-logo.png" alt="MJS" className="h-14 object-contain" />
                <div>
                  <div className="text-white font-extrabold text-lg tracking-tight">MOBILE JANITORIAL SUPPLY</div>
                  <div className="text-gray-300 text-sm mt-0.5">3066 E. La Palma Ave, Anaheim, CA 92806</div>
                  <div className="text-gray-300 text-sm">(714) 779-2640 &middot; orders@mobilejanitorialsupply.com</div>
                </div>
              </div>
              <button onClick={() => setViewingOrder(null)} className="text-gray-400 hover:text-white transition-colors">
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            {/* Invoice Info */}
            <div className="px-8 py-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-mjs-gray-400 font-medium uppercase tracking-wider">Invoice</div>
                  <div className="text-xl font-black text-mjs-dark">{viewingOrder.id}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-mjs-gray-400 font-medium uppercase tracking-wider">Date</div>
                  <div className="text-sm font-semibold text-mjs-dark">{viewingOrder.date}</div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div>
                  <div className="text-xs text-mjs-gray-400 font-medium uppercase tracking-wider">Bill To</div>
                  <div className="text-sm font-semibold text-mjs-dark">{mockUser.company}</div>
                  <div className="text-xs text-mjs-gray-500">{mockUser.firstName} {mockUser.lastName} &middot; {mockUser.email}</div>
                </div>
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${viewingOrder.statusColor}`}>{viewingOrder.status}</span>
              </div>
            </div>

            {/* Line Items */}
            <div className="px-8 py-4">
              <table className="w-full table-fixed">
                <thead>
                  <tr className="text-[10px] font-bold text-mjs-gray-400 uppercase tracking-wider border-b border-gray-100">
                    <th className="text-left py-2 w-[50%]">Item</th>
                    <th className="text-left py-2 w-[12%]">SKU</th>
                    <th className="text-center py-2 w-[8%]">Qty</th>
                    <th className="text-right py-2 w-[15%]">Price</th>
                    <th className="text-right py-2 w-[15%]">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {viewingOrder.lineItems.map((item, i) => (
                    <tr key={i}>
                      <td className="py-3 pr-3 text-sm font-medium text-mjs-dark truncate">{item.name}</td>
                      <td className="py-3 text-xs text-mjs-gray-500">{item.sku}</td>
                      <td className="py-3 text-sm text-mjs-gray-600 text-center">{item.qty}</td>
                      <td className="py-3 text-sm text-mjs-gray-600 text-right whitespace-nowrap">${item.price.toFixed(2)}</td>
                      <td className="py-3 text-sm font-semibold text-mjs-dark text-right whitespace-nowrap">${(item.lineTotal || item.price * item.qty).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="px-8 py-4 bg-mjs-gray-50 border-t border-gray-100">
              <div className="max-w-xs ml-auto space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-mjs-gray-500">Subtotal</span>
                  <span className="font-semibold text-mjs-dark">
                    ${viewingOrder.lineItems.reduce((s, i) => s + (i.lineTotal || i.price * i.qty), 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-mjs-gray-500">Tax</span>
                  <span className="font-semibold text-mjs-dark">${viewingOrder.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-mjs-gray-500">Shipping</span>
                  <span className="font-semibold text-mjs-green">{viewingOrder.shipping === 0 ? "FREE" : `$${viewingOrder.shipping.toFixed(2)}`}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between">
                  <span className="text-sm font-bold text-mjs-dark">Total</span>
                  <span className="text-lg font-black text-mjs-dark">${viewingOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-8 py-5 flex items-center justify-between">
              <button onClick={() => setViewingOrder(null)} className="text-sm text-mjs-gray-500 hover:text-mjs-dark font-medium">
                Close
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => downloadInvoice(viewingOrder)}
                  className="inline-flex items-center gap-2 bg-white border border-gray-200 text-mjs-dark font-semibold px-4 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Invoice
                </button>
                <button
                  onClick={() => { handleReorder(viewingOrder); setViewingOrder(null); }}
                  className="inline-flex items-center gap-2 bg-mjs-red text-white font-semibold px-6 py-2.5 rounded-lg text-sm hover:bg-red-700 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reorder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ═══ Your Products — Favorites + Buy Again combined ═══ */}
      <YourProductsStrip favorites={favorites} removeFavorite={removeFavorite} orders={displayOrders} addItem={addItem} />
    </section>
  );
}
