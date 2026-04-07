const STORE_HASH = process.env.BIGCOMMERCE_STORE_HASH!;
const ACCESS_TOKEN = process.env.BIGCOMMERCE_ACCESS_TOKEN!;
const BASE_URL = `https://api.bigcommerce.com/stores/${STORE_HASH}/v3`;

async function bcFetch(endpoint: string, params?: Record<string, string>) {
  const url = new URL(`${BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  const res = await fetch(url.toString(), {
    headers: {
      "X-Auth-Token": ACCESS_TOKEN,
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    next: { revalidate: 300 }, // Cache for 5 minutes
  });
  if (!res.ok) throw new Error(`BigCommerce API error: ${res.status} ${res.statusText}`);
  return res.json();
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
    include: "images",
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

/* ── Customers (V2 API for some endpoints) ── */
export async function getCustomerByEmail(email: string) {
  const V2_URL = `https://api.bigcommerce.com/stores/${STORE_HASH}/v2`;
  const res = await fetch(`${V2_URL}/customers?email=${encodeURIComponent(email)}`, {
    headers: {
      "X-Auth-Token": ACCESS_TOKEN,
      "Accept": "application/json",
    },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.[0] || null;
}

/* ── Orders (V2 API) ── */
export async function getOrdersByCustomerId(customerId: number) {
  const V2_URL = `https://api.bigcommerce.com/stores/${STORE_HASH}/v2`;
  const res = await fetch(`${V2_URL}/orders?customer_id=${customerId}&sort=date_created:desc&limit=20`, {
    headers: {
      "X-Auth-Token": ACCESS_TOKEN,
      "Accept": "application/json",
    },
  });
  if (!res.ok) return [];
  return res.json();
}

export async function getOrderProducts(orderId: number) {
  const V2_URL = `https://api.bigcommerce.com/stores/${STORE_HASH}/v2`;
  const res = await fetch(`${V2_URL}/orders/${orderId}/products`, {
    headers: {
      "X-Auth-Token": ACCESS_TOKEN,
      "Accept": "application/json",
    },
  });
  if (!res.ok) return [];
  return res.json();
}
