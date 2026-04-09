"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useOrderSetup } from "@/context/OrderContext";
import {
  Package, ShoppingCart, FileText, DollarSign, Clock, Truck,
  CheckCircle, ArrowRight, Download, User, Building2, MapPin,
  CreditCard, Phone, Mail, RefreshCw, Eye, Star, Shield,
  ChevronRight, Store, BadgePercent, Plus, X,
} from "lucide-react";

const tabs = ["Overview", "Orders", "Account Info"];

/* ── Mock Order Data with Line Items ── */
interface OrderLineItem {
  name: string;
  sku: string;
  qty: number;
  price: number;
}
interface MockOrder {
  id: string;
  date: string;
  items: number;
  total: number;
  status: string;
  statusColor: string;
  lineItems: OrderLineItem[];
  tax: number;
  shipping: number;
}

const mockOrders: MockOrder[] = [
  {
    id: "MJS-10482", date: "Mar 25, 2026", items: 8, total: 487.32, status: "Delivered", statusColor: "text-green-600 bg-green-50",
    tax: 34.52, shipping: 0,
    lineItems: [
      { name: "2-Ply Toilet Tissue, 96 Rolls/Case", sku: "5602", qty: 3, price: 48.99 },
      { name: "Multifold Paper Towels, White, 4000/Carton", sku: "GJO21100", qty: 2, price: 39.99 },
      { name: "Heavy Duty Green Degreaser, 1 Gallon", sku: "3180EA", qty: 2, price: 11.50 },
      { name: "Fabulous Lavender Cleaner, Gallon", sku: "3162EA", qty: 1, price: 13.75 },
    ],
  },
  {
    id: "MJS-10461", date: "Mar 18, 2026", items: 12, total: 1243.50, status: "Delivered", statusColor: "text-green-600 bg-green-50",
    tax: 89.22, shipping: 0,
    lineItems: [
      { name: "Premium Roll Towel, 12 Rolls/Carton", sku: "5108", qty: 4, price: 61.35 },
      { name: "Jumbo Bath Tissue, 12 Rolls/Carton", sku: "5200", qty: 5, price: 36.99 },
      { name: "Blue Nitrile Exam Gloves, 100/Box", sku: "8601", qty: 10, price: 5.99 },
      { name: "Clear Can Liners 40-45 Gal, 250/Case", sku: "CL404814", qty: 3, price: 37.95 },
    ],
  },
  {
    id: "MJS-10445", date: "Mar 10, 2026", items: 5, total: 329.99, status: "Delivered", statusColor: "text-green-600 bg-green-50",
    tax: 23.40, shipping: 0,
    lineItems: [
      { name: "Sanitizing Multi-Surface Wipes, 12/Carton", sku: "NICM30472", qty: 1, price: 109.34 },
      { name: "Value Scents Lavender Spray, 12/CT", sku: "4385370", qty: 2, price: 54.28 },
      { name: "Half-Fold Toilet Seat Covers, 5000/Carton", sku: "5800", qty: 1, price: 50.59 },
    ],
  },
  {
    id: "MJS-10430", date: "Mar 3, 2026", items: 15, total: 2105.80, status: "Delivered", statusColor: "text-green-600 bg-green-50",
    tax: 151.20, shipping: 0,
    lineItems: [
      { name: "2-Ply Toilet Tissue, 96 Rolls/Case", sku: "5602", qty: 10, price: 48.99 },
      { name: "Natural Multifold Towels, 4000/Carton", sku: "5302", qty: 8, price: 27.99 },
      { name: "Mop Bucket/Wringer Combo, 35 QT", sku: "8036", qty: 2, price: 44.95 },
      { name: "Boxed Facial Tissue, 30/Case", sku: "5701", qty: 5, price: 25.25 },
    ],
  },
  {
    id: "MJS-10412", date: "Feb 24, 2026", items: 6, total: 612.44, status: "Delivered", statusColor: "text-green-600 bg-green-50",
    tax: 43.39, shipping: 0,
    lineItems: [
      { name: "Kitchen Roll Towels, 30 Rolls/Carton", sku: "ST852", qty: 4, price: 37.95 },
      { name: "Black Nitrile Exam Gloves, 100/Box", sku: "8902EA", qty: 10, price: 7.99 },
      { name: "Heavy Duty Green Degreaser, 1 Gallon", sku: "3180EA", qty: 4, price: 11.50 },
    ],
  },
  {
    id: "MJS-10398", date: "Feb 17, 2026", items: 9, total: 875.20, status: "Delivered", statusColor: "text-green-600 bg-green-50",
    tax: 62.00, shipping: 0,
    lineItems: [
      { name: "Clear Stretch Film, 18\" x 1500'", sku: "FLM140180", qty: 3, price: 39.99 },
      { name: "Urinal Deodorizer Screen, Ocean Mist, 10/Carton", sku: "DRIBBLEOM", qty: 5, price: 23.95 },
      { name: "Automated Paper Towel Dispenser, Black", sku: "980144024", qty: 2, price: 89.95 },
    ],
  },
];

export default function AccountDashboard() {
  const { user } = useAuth();
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
  const [viewingOrder, setViewingOrder] = useState<MockOrder | null>(null);
  const [reordered, setReordered] = useState<string | null>(null);

  // Real BC data state
  const [bcOrders, setBcOrders] = useState<MockOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const mockUser = user || { firstName: "Guest", lastName: "", email: "", company: "" };

  // Fetch real orders from BC
  useEffect(() => {
    if (!user?.id) { setOrdersLoading(false); return; }
    fetch(`/api/customer/orders?customerId=${user.id}`)
      .then(r => r.json())
      .then(data => {
        const orders: MockOrder[] = (data.orders || []).map((o: Record<string, unknown>) => {
          const status = o.status as string;
          let statusColor = "text-mjs-gray-500 bg-gray-50";
          if (status === "Completed" || status === "Shipped" || status === "Delivered") statusColor = "text-green-600 bg-green-50";
          else if (status === "Awaiting Shipment" || status === "Awaiting Pickup") statusColor = "text-blue-600 bg-blue-50";
          else if (status === "Pending") statusColor = "text-amber-600 bg-amber-50";
          else if (status === "Cancelled" || status === "Declined" || status === "Refunded") statusColor = "text-red-600 bg-red-50";
          return {
            id: `MJS-${o.id}`,
            date: new Date(o.date as string).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
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

  const handleReorder = async (order: MockOrder) => {
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
  const [addresses, setAddresses] = useState<SavedAddress[]>([
    { id: 1, label: "Main Office", company: "EasterDay Janitorial", address: "1200 W Main St", city: "Anaheim", state: "CA", zip: "92801" },
    { id: 2, label: "Building B - Downtown", company: "EasterDay Janitorial", address: "500 S Grand Ave, Suite 300", city: "Los Angeles", state: "CA", zip: "90071" },
    { id: 3, label: "Warehouse", company: "EasterDay Janitorial", address: "8800 Valley Blvd", city: "Rosemead", state: "CA", zip: "91770" },
  ]);
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

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
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
          <div className="bg-white rounded-xl border border-gray-100 p-5">
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
          <div className="bg-white rounded-xl border border-gray-100 p-5">
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
          <div className="bg-white rounded-xl border border-gray-100 p-5">
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

              {/* Account Rep */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-sm font-bold text-mjs-dark mb-3">Your Account Rep</h2>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-mjs-red rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">NB</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-mjs-dark">Nick Bergman</div>
                    <div className="text-xs text-mjs-gray-400">Account Representative</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <a href="tel:7147792640" className="flex items-center gap-2 text-xs text-mjs-gray-500 hover:text-mjs-red transition-colors">
                    <Phone className="w-3.5 h-3.5" /> (714) 779-2640
                  </a>
                  <a href="mailto:orders@mobilejanitorialsupply.com" className="flex items-center gap-2 text-xs text-mjs-gray-500 hover:text-mjs-red transition-colors">
                    <Mail className="w-3.5 h-3.5" /> orders@mobilejanitorialsupply.com
                  </a>
                  <a href="mailto:nick@mobilejanitorialsupply.com" className="flex items-center gap-2 text-xs text-mjs-gray-500 hover:text-mjs-red transition-colors">
                    <Mail className="w-3.5 h-3.5" /> nick@mobilejanitorialsupply.com
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
        {activeTab === "Account Info" && (
          <div className="space-y-6">
            {/* ── Company Information ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-bold text-mjs-dark">Company Information</h2>
                <button
                  onClick={() => setEditingCompany(!editingCompany)}
                  className="text-xs text-mjs-red font-semibold hover:underline"
                >
                  {editingCompany ? "Done" : "Edit"}
                </button>
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

            {/* ── Delivery Addresses ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
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
                          onClick={() => setAddresses(addresses.filter(a => a.id !== addr.id))}
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
                      onClick={() => {
                        if (!addressForm.label || !addressForm.address || !addressForm.city || !addressForm.zip) return;
                        if (editingAddressId) {
                          setAddresses(addresses.map(a => a.id === editingAddressId ? { ...addressForm, id: editingAddressId } : a));
                        } else {
                          setAddresses([...addresses, { ...addressForm, id: Date.now() }]);
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
                        <div className="grid grid-cols-6 gap-2">
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
                      <div className="grid grid-cols-6 gap-2">
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
                      <td className="py-3 text-sm font-semibold text-mjs-dark text-right whitespace-nowrap">${(item.price * item.qty).toFixed(2)}</td>
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
                    ${viewingOrder.lineItems.reduce((s, i) => s + i.price * i.qty, 0).toFixed(2)}
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
              <button
                onClick={() => { handleReorder(viewingOrder); setViewingOrder(null); }}
                className="inline-flex items-center gap-2 bg-mjs-red text-white font-semibold px-6 py-2.5 rounded-lg text-sm hover:bg-red-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Reorder This Order
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
