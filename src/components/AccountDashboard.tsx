"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import {
  Package, ShoppingCart, FileText, DollarSign, Clock, Truck,
  CheckCircle, ArrowRight, Download, User, Building2, MapPin,
  CreditCard, Phone, Mail, RefreshCw, Eye, Star, Shield,
  ChevronRight, Store, BadgePercent, Plus, X,
} from "lucide-react";
import { allProducts } from "@/data/products";

const tabs = ["Overview", "Orders", "My Pricing", "Account Info"];

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
  const [activeTab, setActiveTab] = useState("Overview");
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderStep, setOrderStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("bill");
  const [fulfillment, setFulfillment] = useState("");
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [customShipTo, setCustomShipTo] = useState({ name: "", address: "", city: "", state: "", zip: "" });
  const [editBillTo, setEditBillTo] = useState(false);
  const [billTo, setBillTo] = useState({
    company: "EasterDay Janitorial Services",
    name: "Nick Martinez",
    email: "nick@easterday.com",
    phone: "(714) 555-1234",
    address: "1200 W Main St",
    city: "Anaheim",
    state: "CA",
    zip: "92801",
  });
  const [viewingOrder, setViewingOrder] = useState<MockOrder | null>(null);
  const [reordered, setReordered] = useState<string | null>(null);

  const handleReorder = (order: MockOrder) => {
    for (const item of order.lineItems) {
      addItem({
        slug: item.sku.toLowerCase(),
        name: item.name,
        brand: "MJS",
        price: item.price,
        image: "/images/placeholder-product.svg",
        pack: "",
      }, item.qty);
    }
    setReordered(order.id);
    setTimeout(() => setReordered(null), 3000);
  };

  // Mock customer data for demo
  const mockUser = user || {
    firstName: "Nick",
    lastName: "Martinez",
    email: "nick@easterday.com",
    company: "EasterDay Janitorial Services",
  };

  // Mock saved addresses
  const savedAddresses = [
    { id: 1, label: "Main Office", name: "EasterDay Janitorial", address: "1200 W Main St", city: "Anaheim", state: "CA", zip: "92801" },
    { id: 2, label: "Building B - Downtown", name: "EasterDay Janitorial", address: "500 S Grand Ave, Suite 300", city: "Los Angeles", state: "CA", zip: "90071" },
    { id: 3, label: "Warehouse", name: "EasterDay Janitorial", address: "8800 Valley Blvd", city: "Rosemead", state: "CA", zip: "91770" },
  ];

  const openOrderModal = () => {
    setOrderStep(1);
    setPaymentMethod("bill");
    setFulfillment("");
    setSelectedAddress(null);
    setShowOrderModal(true);
  };

  // Customer discount (mock — would come from BigCommerce)
  const discountRate = 0.15;
  const pricingTier = "Wholesale A";

  // Sample priced products
  const pricedProducts = allProducts.filter(p => p.price > 0).slice(0, 12);

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
                <div className="text-2xl font-black text-mjs-dark">24</div>
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
                <div className="text-2xl font-black text-mjs-dark">${mockOrders.reduce((sum, o) => sum + o.total, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
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
                  {mockOrders.slice(0, 4).map((order) => (
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
                  {mockOrders.map((order) => (
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
            </div>
          </div>
        )}

        {/* ═══ MY PRICING TAB ═══ */}
        {activeTab === "My Pricing" && (
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-sm font-bold text-mjs-dark">Your Custom Pricing</h2>
                <span className="bg-green-50 text-green-600 text-[10px] font-bold px-2.5 py-0.5 rounded-full">{(discountRate * 100).toFixed(0)}% Off Retail</span>
              </div>
              <p className="text-xs text-mjs-gray-400">These prices are exclusive to your account. Add items to cart at your special rate.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {pricedProducts.map((product) => {
                const yourPrice = +(product.price * (1 - discountRate)).toFixed(2);
                const saved = +(product.price - yourPrice).toFixed(2);
                return (
                  <div key={product.slug} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group flex flex-col">
                    <a href={`/product/${product.slug}`} className="block h-[140px] bg-white overflow-hidden">
                      <img src={product.images[0]} alt={product.cardTitle} className={`w-full h-full ${product.imageFit === "contain" ? "object-contain p-4" : "object-cover"}`} />
                    </a>
                    <div className="p-3 flex flex-col flex-1">
                      <div className="text-[9px] text-mjs-gray-400 font-medium uppercase">{product.brand}</div>
                      <a href={`/product/${product.slug}`} className="text-[11px] font-semibold text-mjs-dark leading-tight mt-0.5 group-hover:text-mjs-red transition-colors line-clamp-2">
                        {product.cardTitle}
                      </a>
                      <div className="mt-auto pt-2">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-sm font-black text-mjs-dark">${yourPrice.toFixed(2)}</span>
                          <span className="text-[10px] text-mjs-gray-400 line-through">${product.price.toFixed(2)}</span>
                        </div>
                        <div className="text-[9px] text-mjs-green font-semibold">You save ${saved.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ ACCOUNT INFO TAB ═══ */}
        {activeTab === "Account Info" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-mjs-dark">Company Information</h2>
                <button className="text-xs text-mjs-red font-semibold hover:underline">Edit</button>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-mjs-gray-50 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-4 h-4 text-mjs-gray-400" />
                  </div>
                  <div>
                    <div className="text-[10px] text-mjs-gray-400 font-medium uppercase">Company Name</div>
                    <div className="text-sm font-semibold text-mjs-dark">{mockUser.company}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-mjs-gray-50 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-mjs-gray-400" />
                  </div>
                  <div>
                    <div className="text-[10px] text-mjs-gray-400 font-medium uppercase">Contact Name</div>
                    <div className="text-sm font-semibold text-mjs-dark">{mockUser.firstName} {mockUser.lastName}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-mjs-gray-50 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-mjs-gray-400" />
                  </div>
                  <div>
                    <div className="text-[10px] text-mjs-gray-400 font-medium uppercase">Email</div>
                    <div className="text-sm font-semibold text-mjs-dark">{mockUser.email}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-mjs-dark">Delivery Address</h2>
                <button className="text-xs text-mjs-red font-semibold hover:underline">Edit</button>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-mjs-gray-50 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-mjs-gray-400" />
                  </div>
                  <div>
                    <div className="text-[10px] text-mjs-gray-400 font-medium uppercase">Address</div>
                    <div className="text-sm text-mjs-gray-600">Address on file</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-mjs-dark">Billing Information</h2>
                <button className="text-xs text-mjs-red font-semibold hover:underline">Edit</button>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-mjs-gray-50 flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-4 h-4 text-mjs-gray-400" />
                  </div>
                  <div>
                    <div className="text-[10px] text-mjs-gray-400 font-medium uppercase">Payment Method</div>
                    <div className="text-sm text-mjs-gray-600">Bill to Company (Net 30)</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-mjs-dark">Account Details</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-mjs-gray-400">Pricing Tier</span>
                  <span className="font-semibold text-mjs-dark">{pricingTier}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-mjs-gray-400">Discount Rate</span>
                  <span className="font-semibold text-mjs-dark">{(discountRate * 100).toFixed(0)}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-mjs-gray-400">Account Since</span>
                  <span className="font-semibold text-mjs-dark">Jan 2024</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-mjs-gray-400">Credit Terms</span>
                  <span className="font-semibold text-mjs-dark">Net 30</span>
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

                  {/* Fulfillment */}
                  <h3 className="text-xs font-bold text-mjs-gray-500 uppercase tracking-wider mb-3">Fulfillment</h3>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {[
                      { id: "delivery", label: "Delivery", icon: Truck, sub: "1-3 Business Days" },
                      { id: "pickup", label: "Will Call (Pickup)", icon: Store, sub: "Ready Same Day" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setFulfillment(opt.id)}
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
                          <div className="text-xs text-mjs-gray-500 mt-0.5">{addr.name}</div>
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
              {orderStep === 1 ? (
                <>
                  <button onClick={() => setShowOrderModal(false)} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-mjs-gray-500 hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  {fulfillment === "pickup" ? (
                    <a
                      href="/"
                      className={`flex-1 py-3 rounded-xl text-sm font-semibold text-center transition-colors ${
                        paymentMethod && fulfillment
                          ? "bg-mjs-red text-white hover:bg-red-700"
                          : "bg-gray-100 text-mjs-gray-400 pointer-events-none"
                      }`}
                    >
                      Start Shopping
                    </a>
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
                  <a
                    href="/"
                    className={`flex-1 py-3 rounded-xl text-sm font-semibold text-center transition-colors ${
                      selectedAddress || customShipTo.address
                        ? "bg-mjs-red text-white hover:bg-red-700"
                        : "bg-gray-100 text-mjs-gray-400 pointer-events-none"
                    }`}
                  >
                    Start Shopping
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══ ORDER INVOICE MODAL ═══ */}
      {viewingOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setViewingOrder(null)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
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
              <table className="w-full">
                <thead>
                  <tr className="text-[10px] font-bold text-mjs-gray-400 uppercase tracking-wider border-b border-gray-100">
                    <th className="text-left py-2">Item</th>
                    <th className="text-center py-2">SKU</th>
                    <th className="text-center py-2">Qty</th>
                    <th className="text-right py-2">Price</th>
                    <th className="text-right py-2">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {viewingOrder.lineItems.map((item, i) => (
                    <tr key={i}>
                      <td className="py-3 text-sm font-medium text-mjs-dark">{item.name}</td>
                      <td className="py-3 text-xs text-mjs-gray-500 text-center">{item.sku}</td>
                      <td className="py-3 text-sm text-mjs-gray-600 text-center">{item.qty}</td>
                      <td className="py-3 text-sm text-mjs-gray-600 text-right">${item.price.toFixed(2)}</td>
                      <td className="py-3 text-sm font-semibold text-mjs-dark text-right">${(item.price * item.qty).toFixed(2)}</td>
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
