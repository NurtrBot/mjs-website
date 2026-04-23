// GA4 Analytics Event Tracking
// Fires custom events to Google Analytics for all key user actions

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

function gtag(...args: unknown[]) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag(...args);
  }
}

// Page view (auto-tracked but useful for SPA navigation)
export function trackPageView(url: string, title?: string) {
  gtag("event", "page_view", {
    page_location: url,
    page_title: title || document.title,
  });
}

// Product viewed
export function trackViewProduct(product: { sku: string; name: string; price: number; category?: string; brand?: string }) {
  gtag("event", "view_item", {
    currency: "USD",
    value: product.price,
    items: [{
      item_id: product.sku,
      item_name: product.name,
      price: product.price,
      item_category: product.category || "",
      item_brand: product.brand || "",
    }],
  });
}

// Add to cart
export function trackAddToCart(product: { sku: string; name: string; price: number; quantity: number; category?: string; brand?: string }) {
  gtag("event", "add_to_cart", {
    currency: "USD",
    value: product.price * product.quantity,
    items: [{
      item_id: product.sku,
      item_name: product.name,
      price: product.price,
      quantity: product.quantity,
      item_category: product.category || "",
      item_brand: product.brand || "",
    }],
  });
}

// Begin checkout
export function trackBeginCheckout(items: { sku: string; name: string; price: number; quantity: number }[], total: number) {
  gtag("event", "begin_checkout", {
    currency: "USD",
    value: total,
    items: items.map(i => ({
      item_id: i.sku,
      item_name: i.name,
      price: i.price,
      quantity: i.quantity,
    })),
  });
}

// Purchase complete
export function trackPurchase(orderId: string, total: number, tax: number, shipping: number, items: { sku: string; name: string; price: number; quantity: number }[]) {
  gtag("event", "purchase", {
    transaction_id: orderId,
    currency: "USD",
    value: total,
    tax,
    shipping,
    items: items.map(i => ({
      item_id: i.sku,
      item_name: i.name,
      price: i.price,
      quantity: i.quantity,
    })),
  });
}

// Search
export function trackSearch(query: string, resultsCount: number) {
  gtag("event", "search", {
    search_term: query,
    results_count: resultsCount,
  });
}

// Sign up
export function trackSignUp(method: string) {
  gtag("event", "sign_up", { method });
}

// Login
export function trackLogin(method: string) {
  gtag("event", "login", { method });
}

// Apply promo code
export function trackPromoCode(code: string, discount: number) {
  gtag("event", "select_promotion", {
    promotion_id: code,
    promotion_name: code,
    creative_name: `Discount $${discount}`,
  });
}

// Select gift reward
export function trackSelectReward(rewardName: string, tier: string, value: number) {
  gtag("event", "select_content", {
    content_type: "reward",
    content_id: rewardName,
    promotion_name: `${tier} Tier - $${value}`,
  });
}

// Contact form submitted
export function trackContactForm(formType: string) {
  gtag("event", "generate_lead", {
    currency: "USD",
    value: 0,
    form_type: formType,
  });
}

// Category viewed
export function trackViewCategory(category: string) {
  gtag("event", "view_item_list", {
    item_list_id: category,
    item_list_name: category,
  });
}

// Click CTA button
export function trackClickCTA(buttonName: string, location: string) {
  gtag("event", "select_content", {
    content_type: "cta",
    content_id: buttonName,
    creative_slot: location,
  });
}
