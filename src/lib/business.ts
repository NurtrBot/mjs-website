import { LOCAL_FREE_DELIVERY_MINIMUM, EXTENDED_FREE_DELIVERY_MINIMUM } from "@/lib/delivery-zones";

/* ─────────────────────────────────────────────────────────────
   Single source of truth for business facts that appear in copy,
   structured data and llms.txt. Change a number here, not in pages.
   ───────────────────────────────────────────────────────────── */

export const BUSINESS = {
  name: "Mobile Janitorial Supply",
  legalName: "Bergman Inc. DBA Mobile Janitorial Supply",
  siteUrl: "https://www.mobilejanitorialsupply.com",
  phone: "(714) 779-2640",
  phoneHref: "tel:7147792640",
  email: "orders@mobilejanitorialsupply.com",
  address: {
    street: "3066 E. La Palma Ave.",
    city: "Anaheim",
    state: "CA",
    zip: "92806",
  },
  hours: "Mon–Fri 6:30 AM – 3:00 PM PT",
  foundedYear: 1990,
  // Marketing figure for catalog breadth (BigCommerce holds far more SKUs than are shown online)
  productCountClaim: "10,000+",
  pricePromise: "Found a lower price from a local competitor? We'll match it.",
} as const;

/* ── Google reviews (update count here; every page reads it) ── */
export const GOOGLE_REVIEWS = {
  count: 247,
  rating: 4.9,
  url: "https://www.google.com/search?q=Mobile+Janitorial+Supply+Anaheim+reviews",
  // Where the review-request email's button sends people. This share link opens our
  // Google listing, where "Write a review" is one more tap. To drop people straight
  // into the review box instead, replace this with the Business Profile link
  // (Google Business Profile → Ask for reviews → Copy link, a https://g.page/r/…/review URL).
  writeUrl: "https://share.google/3LyYI6SnmFkHTmEKr",
} as const;

export const yearsInBusiness = () => new Date().getFullYear() - BUSINESS.foundedYear;
export const yearsInBusinessClaim = () => `${Math.floor(yearsInBusiness() / 5) * 5}+`; // "35+"

/* ── Delivery ── */
export const DELIVERY = {
  localMinimum: LOCAL_FREE_DELIVERY_MINIMUM,      // OC, LA, Inland Empire
  extendedMinimum: EXTENDED_FREE_DELIVERY_MINIMUM, // San Diego County + zips 92404, 92880
  extendedZips: ["92404", "92880"],
  leadTime: "1–3 business days",
  localZones: "Orange County, Los Angeles County and the Inland Empire",
  extendedZones: "San Diego County",
  underMinimum: "Orders under the minimum ship UPS Ground at the live carrier rate shown at checkout.",
  outsideArea: "Everywhere else in the US ships UPS Ground.",
  minimumBasis: "Minimums are on the order subtotal before tax.",
  fuelSurcharge: "A fuel surcharge may apply to local deliveries when fuel prices are elevated.",
} as const;

// Short banner line used in the top bar / hero
export const DELIVERY_BANNER = `FREE 1–3 Day Delivery on Subtotals $${DELIVERY.localMinimum}+ (OC · LA · IE) · $${DELIVERY.extendedMinimum}+ San Diego`;

/* ── Returns ── */
export const RETURNS = {
  windowDays: 7,
  restockingFeePercent: 15,
  summary: "Returns accepted within 7 days of receipt. Returns due to customer error carry a 15% restocking charge and the customer pays return freight. Used equipment is not returnable.",
  badge: "7-Day Returns",
} as const;

/* ── Payment ── */
export const PAYMENT = {
  guestCheckout: true,
  methods: "Credit card (all customers); Net-30 Bill to Account for approved business accounts; cash on will-call pickup.",
  netTerms: "Net-30 terms require an approved credit application, available from the account page after sign-up.",
  taxExempt: "Resale / tax-exempt customers can submit their California seller's permit number from their account; approved accounts are not charged sales tax.",
} as const;
