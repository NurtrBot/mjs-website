import https from "https";
import { gunzipSync } from "zlib";

const STORE_HASH = process.env.BIGCOMMERCE_STORE_HASH!;
const ACCESS_TOKEN = process.env.BIGCOMMERCE_ACCESS_TOKEN!;
const BASE_URL = `https://api.bigcommerce.com/stores/${STORE_HASH}/v3`;
const V2_URL = `https://api.bigcommerce.com/stores/${STORE_HASH}/v2`;
const AUTH_HEADERS = {
  "X-Auth-Token": ACCESS_TOKEN,
  "Accept": "application/json",
  "Content-Type": "application/json",
};

// Native HTTPS request for write operations (bypasses Next.js fetch gzip bug)
function nativeRequest(method: string, url: string, body?: unknown): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const postData = body ? JSON.stringify(body) : undefined;
    const req = https.request({
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method,
      headers: {
        "X-Auth-Token": process.env.BIGCOMMERCE_ACCESS_TOKEN!,
        "Accept": "application/json",
        "Content-Type": "application/json",
        ...(postData ? { "Content-Length": Buffer.byteLength(postData) } : {}),
      },
    }, (res) => {
      const chunks: Buffer[] = [];
      res.on("data", (chunk: Buffer) => chunks.push(chunk));
      res.on("end", () => {
        let buffer = Buffer.concat(chunks);
        // Handle gzip
        if (res.headers["content-encoding"] === "gzip") {
          try { buffer = gunzipSync(buffer); } catch {}
        }
        const text = buffer.toString("utf-8");
        if (res.statusCode && res.statusCode >= 400) {
          reject(new Error(`BC ${method} ${parsed.pathname}: ${res.statusCode} ${text.slice(0, 200)}`));
          return;
        }
        if (!text) { resolve({ data: null }); return; }
        try { resolve(JSON.parse(text)); } catch { reject(new Error(`Invalid JSON from BC: ${text.slice(0, 100)}`)); }
      });
    });
    req.on("error", reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function bcFetch(endpoint: string, params?: Record<string, string>) {
  const url = new URL(`${BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  const res = await fetch(url.toString(), {
    headers: AUTH_HEADERS,
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`BigCommerce API error: ${res.status} ${res.statusText}`);
  return res.json();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function bcPost(endpoint: string, body: unknown): Promise<any> {
  const storeHash = process.env.BIGCOMMERCE_STORE_HASH!;
  return nativeRequest("POST", `https://api.bigcommerce.com/stores/${storeHash}/v3${endpoint}`, body);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function bcPut(endpoint: string, body: unknown): Promise<any> {
  const storeHash = process.env.BIGCOMMERCE_STORE_HASH!;
  return nativeRequest("PUT", `https://api.bigcommerce.com/stores/${storeHash}/v3${endpoint}`, body);
}

async function bcDelete(endpoint: string) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "DELETE",
    headers: AUTH_HEADERS,
  });
  if (!res.ok && res.status !== 204) {
    throw new Error(`BC DELETE ${endpoint}: ${res.status}`);
  }
}

/* ── Categories ── */
export interface BCCategory {
  id: number;
  name: string;
  parent_id: number;
  sort_order: number;
  is_visible: boolean;
}

export async function getCategories(): Promise<BCCategory[]> {
  const all: BCCategory[] = [];
  let page = 1;
  while (true) {
    const res = await bcFetch("/catalog/categories", { limit: "250", page: String(page) });
    all.push(...res.data);
    if (page >= res.meta.pagination.total_pages) break;
    page++;
  }
  return all;
}

/* ── Products ── */
export interface BCProduct {
  id: number;
  name: string;
  sku: string;
  price: number;
  calculated_price: number;
  sale_price: number;
  retail_price: number;
  cost_price: number;
  description: string;
  categories: number[];
  brand_id: number;
  inventory_level: number;
  inventory_tracking: string;
  is_visible: boolean;
  is_featured: boolean;
  weight: number;
  condition: string;
  availability: string;
  availability_description: string;
  total_sold: number;
  sort_order: number;
  custom_url: { url: string };
  images?: BCProductImage[];
  reviews_count?: number;
  reviews_rating_sum?: number;
}

export interface BCProductImage {
  id: number;
  product_id: number;
  url_standard: string;
  url_thumbnail: string;
  url_zoom: string;
  is_thumbnail: boolean;
  sort_order: number;
}

export async function getProducts(params?: {
  page?: number;
  limit?: number;
  category_id?: number;
  is_visible?: boolean;
  sort?: string;
  direction?: string;
  keyword?: string;
}): Promise<{ data: BCProduct[]; meta: { pagination: { total: number; total_pages: number; current_page: number } } }> {
  const queryParams: Record<string, string> = {
    limit: String(params?.limit || 50),
    page: String(params?.page || 1),
    include: "images,bulk_pricing_rules",
  };
  if (params?.category_id) queryParams["categories:in"] = String(params.category_id);
  if (params?.is_visible !== undefined) queryParams.is_visible = String(params.is_visible);
  if (params?.sort) queryParams.sort = params.sort;
  if (params?.direction) queryParams.direction = params.direction;
  if (params?.keyword) queryParams.keyword = params.keyword;

  return bcFetch("/catalog/products", queryParams);
}

export async function getProductBySku(sku: string): Promise<BCProduct | null> {
  const res = await bcFetch("/catalog/products", { sku, include: "images" });
  return res.data?.[0] || null;
}

export async function getProductById(id: number): Promise<BCProduct | null> {
  try {
    const res = await bcFetch(`/catalog/products/${id}`, { include: "images" });
    return res.data || null;
  } catch {
    return null;
  }
}

export async function getProductImages(productId: number): Promise<BCProductImage[]> {
  const res = await bcFetch(`/catalog/products/${productId}/images`);
  return res.data || [];
}

/* ── Bulk Pricing Rules ── */
export interface BCBulkPricingRule {
  id: number;
  quantity_min: number;
  quantity_max: number;
  type: string; // "percent" | "price" | "fixed"
  amount: number;
}

export async function getBulkPricingRules(productId: number): Promise<BCBulkPricingRule[]> {
  try {
    const res = await bcFetch(`/catalog/products/${productId}/bulk-pricing-rules`);
    return res.data || [];
  } catch {
    return [];
  }
}

/* ── Variants (for V2 order creation) ── */
export async function getProductVariants(productId: number): Promise<{ id: number; option_values: { id: number; option_id: number }[] }[]> {
  try {
    const res = await bcFetch(`/catalog/products/${productId}/variants`, { limit: "10" });
    return res.data || [];
  } catch {
    return [];
  }
}

/* ── Reviews ── */
export interface BCReview {
  id: number;
  product_id: number;
  title: string;
  text: string;
  status: string;
  rating: number;
  name: string;
  email: string;
  date_created: string;
  date_modified: string;
  date_reviewed: string;
}

export async function getProductReviews(productId: number): Promise<BCReview[]> {
  try {
    const res = await bcFetch(`/catalog/products/${productId}/reviews`, { limit: "50", status: "1" });
    return res.data || [];
  } catch {
    return [];
  }
}

/* ── Brands ── */
export interface BCBrand {
  id: number;
  name: string;
}

export async function getBrands(): Promise<BCBrand[]> {
  const res = await bcFetch("/catalog/brands", { limit: "250" });
  return res.data || [];
}

/* ── Customers ── */
export async function getCustomerByEmail(email: string) {
  const storeHash = process.env.BIGCOMMERCE_STORE_HASH!;
  const url = `https://api.bigcommerce.com/stores/${storeHash}/v2/customers?email=${encodeURIComponent(email)}`;
  try {
    const data = await nativeRequest("GET", url);
    if (Array.isArray(data)) return data[0] || null;
    return null;
  } catch {
    return null;
  }
}

export async function createCustomer(data: {
  first_name: string;
  last_name: string;
  email: string;
  company?: string;
  phone?: string;
  password: string;
  address?: {
    address1: string;
    city: string;
    state_or_province: string;
    postal_code: string;
    country_code: string;
  };
}) {
  const customerBody: Record<string, unknown>[] = [{
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    company: data.company || "",
    phone: data.phone || "",
    authentication: { new_password: data.password },
    origin_channel_id: 1,
    channel_ids: [1],
  }];
  const res = await bcPost("/customers", customerBody);
  const customer = res.data?.[0];
  if (!customer) throw new Error("Failed to create customer");

  // Create address if provided (non-critical — don't fail the signup)
  if (data.address && data.address.address1) {
    try {
      await bcPost("/customers/addresses", [{
        customer_id: customer.id,
        first_name: data.first_name,
        last_name: data.last_name,
        company: data.company || "",
        address1: data.address.address1,
        city: data.address.city,
        state_or_province: data.address.state_or_province,
        postal_code: data.address.postal_code,
        country_code: data.address.country_code,
      }]);
    } catch {
      // Address creation is optional — customer is still created
    }
  }

  return customer;
}

export async function createCustomerAddress(customerId: number, address: {
  first_name: string;
  last_name: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state_or_province: string;
  postal_code: string;
  country_code: string;
  phone?: string;
}) {
  const res = await bcPost("/customers/addresses", [{
    customer_id: customerId,
    ...address,
  }]);
  return res.data?.[0];
}

/* ── Orders (V2 API for reads) ── */
export async function getOrdersByCustomerId(customerId: number) {
  const storeHash = process.env.BIGCOMMERCE_STORE_HASH!;
  try {
    const data = await nativeRequest("GET", `https://api.bigcommerce.com/stores/${storeHash}/v2/orders?customer_id=${customerId}&sort=date_created:desc&limit=20`);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function getOrderProducts(orderId: number) {
  const storeHash = process.env.BIGCOMMERCE_STORE_HASH!;
  try {
    const data = await nativeRequest("GET", `https://api.bigcommerce.com/stores/${storeHash}/v2/orders/${orderId}/products`);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

/* ══════════════════════════════════════════════════════════════════════
   WRITE API — Cart → Checkout → Order Pipeline
   ══════════════════════════════════════════════════════════════════════ */

export interface CartLineItem {
  product_id: number;
  quantity: number;
}

export interface ShippingAddress {
  first_name: string;
  last_name: string;
  email: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state_or_province: string;
  state_or_province_code: string;
  postal_code: string;
  country_code: string;
  phone?: string;
}

export interface ShippingOption {
  id: string;
  description: string;
  type: string;
  cost: number;
  transit_time: string;
}

/* ── Step 1: Create Cart ── */
export async function createCart(lineItems: CartLineItem[], customerId?: number) {
  const body: Record<string, unknown> = {
    line_items: lineItems,
  };
  if (customerId) body.customer_id = customerId;
  const res = await bcPost("/carts", body);
  return res.data;
}

/* ── Step 2: Get Checkout ── */
export async function getCheckout(cartId: string) {
  const res = await bcFetch(`/checkouts/${cartId}`);
  return res.data;
}

/* ── Step 3: Add Shipping Address + Get Rates ── */
export async function addConsignment(cartId: string, address: ShippingAddress, lineItemIds: { item_id: string; quantity: number }[]) {
  const res = await bcPost(
    `/checkouts/${cartId}/consignments?include=consignments.available_shipping_options`,
    [{
      address,
      line_items: lineItemIds,
    }]
  );
  return res.data;
}

/* ── Step 3b: Apply Coupon Code to Checkout ── */
export async function applyCouponToCheckout(cartId: string, couponCode: string) {
  try {
    const res = await bcPost(`/checkouts/${cartId}/coupons`, { coupon_code: couponCode });
    return res.data;
  } catch {
    // Non-critical — order proceeds without coupon
    return null;
  }
}

/* ── Step 4: Select Shipping Option ── */
export async function selectShippingOption(cartId: string, consignmentId: string, shippingOptionId: string) {
  const res = await bcPut(`/checkouts/${cartId}/consignments/${consignmentId}`, {
    shipping_option_id: shippingOptionId,
  });
  return res.data;
}

/* ── Step 5: Add Billing Address ── */
export async function setBillingAddress(cartId: string, address: ShippingAddress) {
  const res = await bcPost(`/checkouts/${cartId}/billing-address`, address);
  return res.data;
}

/* ── Step 6: Create Order from Checkout ── */
export async function createOrderFromCheckout(cartId: string) {
  const res = await bcPost(`/checkouts/${cartId}/orders`, {});
  return res.data;
}

/* ── Step 7: Update Order Status (for bill-to-account / cash) ── */
export async function updateOrderStatus(orderId: number, statusId: number) {
  const storeHash = process.env.BIGCOMMERCE_STORE_HASH!;
  return nativeRequest("PUT", `https://api.bigcommerce.com/stores/${storeHash}/v2/orders/${orderId}`, { status_id: statusId });
}

/* ── Update Order (general fields via V2) ── */
export async function updateOrder(orderId: number, fields: Record<string, unknown>) {
  const storeHash = process.env.BIGCOMMERCE_STORE_HASH!;
  return nativeRequest("PUT", `https://api.bigcommerce.com/stores/${storeHash}/v2/orders/${orderId}`, fields);
}

/* ── Helper: Get product ID by SKU (for cart creation) ── */
export async function getProductIdBySku(sku: string): Promise<number | null> {
  try {
    const res = await bcFetch("/catalog/products", { sku, limit: "1" });
    return res.data?.[0]?.id || null;
  } catch {
    return null;
  }
}

/* ── Helper: Delete Cart (cleanup) ── */
export async function deleteCart(cartId: string) {
  await bcDelete(`/carts/${cartId}`);
}

/* ── Create Order Directly via V2 (bypasses checkout pipeline / EverEye) ── */
export async function createV2Order(data: {
  customer_id?: number;
  billing_address: {
    first_name: string;
    last_name: string;
    email: string;
    company?: string;
    street_1: string;
    street_2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    country_iso2: string;
    phone?: string;
  };
  shipping_addresses: {
    first_name: string;
    last_name: string;
    email: string;
    company?: string;
    street_1: string;
    street_2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    country_iso2: string;
    phone?: string;
  }[];
  products: {
    product_id: number;
    quantity: number;
    product_options?: { id: number; value: string }[];
  }[];
  status_id?: number;
  staff_notes?: string;
  customer_message?: string;
}) {
  const storeHash = process.env.BIGCOMMERCE_STORE_HASH!;
  const body = {
    customer_id: data.customer_id || 0,
    billing_address: data.billing_address,
    shipping_addresses: data.shipping_addresses,
    products: data.products,
    status_id: data.status_id || 7,
    ...(data.staff_notes ? { staff_notes: data.staff_notes } : {}),
    ...(data.customer_message ? { customer_message: data.customer_message } : {}),
  };
  const result = await nativeRequest("POST", `https://api.bigcommerce.com/stores/${storeHash}/v2/orders`, body);
  return result;
}

/* ── Storefront Token (for embedded payment) ── */
export async function createStorefrontToken(origin: string) {
  const res = await bcPost("/storefront/api-token", {
    channel_id: 1,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    allowed_cors_origins: [origin],
  });
  return res.data?.token;
}

/* ══════════════════════════════════════════════════════════════════════
   PAYMENTS API — Process credit card through Intuit/QuickBooks
   ══════════════════════════════════════════════════════════════════════ */

/* ── Get payment access token for an order ── */
export async function getPaymentAccessToken(orderId: number): Promise<string> {
  const res = await bcPost("/payments/access_tokens", { order: { id: orderId } });
  const token = res.data?.id;
  if (!token) throw new Error("Failed to get payment access token");
  return token;
}

/* ── Get accepted payment methods for an order ── */
export async function getAcceptedPaymentMethods(orderId: number): Promise<{ id: string; name: string }[]> {
  try {
    const res = await bcFetch(`/payments/methods`, { order_id: String(orderId) });
    return res.data || [];
  } catch {
    return [];
  }
}

/* ── Process card payment ── */
export async function processCardPayment(
  paymentToken: string,
  card: {
    cardholderName: string;
    number: string;
    expiryMonth: number;
    expiryYear: number;
    verificationValue: string;
  },
  paymentMethodId?: string
): Promise<{ status: string; transactionId?: string }> {
  const storeHash = process.env.BIGCOMMERCE_STORE_HASH!;
  const url = `https://payments.bigcommerce.com/stores/${storeHash}/payments`;

  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      payment: {
        instrument: {
          type: "card",
          cardholder_name: card.cardholderName,
          number: card.number.replace(/\s/g, ""),
          expiry_month: card.expiryMonth,
          expiry_year: card.expiryYear,
          verification_value: card.verificationValue,
        },
        payment_method_id: paymentMethodId || "qbmsv2.card",
      },
    });

    const parsed = new URL(url);
    const req = https.request({
      hostname: parsed.hostname,
      path: parsed.pathname,
      method: "POST",
      headers: {
        "Authorization": `PAT ${paymentToken}`,
        "Accept": "application/vnd.bc.v1+json",
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
      },
    }, (res) => {
      const chunks: Buffer[] = [];
      res.on("data", (chunk: Buffer) => chunks.push(chunk));
      res.on("end", () => {
        let buffer = Buffer.concat(chunks);
        if (res.headers["content-encoding"] === "gzip") {
          try { buffer = gunzipSync(buffer); } catch {}
        }
        const text = buffer.toString("utf-8");
        if (res.statusCode && res.statusCode >= 400) {
          reject(new Error(`Payment failed: ${res.statusCode} ${text.slice(0, 200)}`));
          return;
        }
        try {
          const data = JSON.parse(text);
          resolve({
            status: data.data?.status || "success",
            transactionId: data.data?.transaction?.id,
          });
        } catch {
          reject(new Error(`Payment response parse error: ${text.slice(0, 100)}`));
        }
      });
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}
