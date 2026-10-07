import { BUSINESS, DELIVERY, RETURNS, PAYMENT, yearsInBusinessClaim } from "@/lib/business";
import { SITE_CATEGORY_NAMES } from "@/lib/category-map";
import { getQuickFilters, filterSlug } from "@/lib/category-filters";

export const revalidate = 86400;

// llms.txt — a plain-text guide to the site for AI assistants and agents (https://llmstxt.org)
export function GET() {
  const base = BUSINESS.siteUrl;
  const categories = Object.entries(SITE_CATEGORY_NAMES)
    .map(([slug, name]) => {
      const subs = getQuickFilters(slug).map(f => `  - [${f.label}](${base}/category/${slug}/${filterSlug(f.label)})`).join("\n");
      return `- [${name}](${base}/category/${slug})${subs ? "\n" + subs : ""}`;
    })
    .join("\n");

  const body = `# ${BUSINESS.name}

> Wholesale janitorial, cleaning, paper, packaging, safety and food-service supplies from Anaheim, California. ${BUSINESS.productCountClaim} products at distributor pricing, sold to businesses and the public, with free 1–3 business day local delivery on qualifying orders across Southern California. In business ${yearsInBusinessClaim()} years (since ${BUSINESS.foundedYear}).

Warehouse & walk-in outlet: ${BUSINESS.address.street}, ${BUSINESS.address.city}, ${BUSINESS.address.state} ${BUSINESS.address.zip}
Phone: ${BUSINESS.phone} · Email: ${BUSINESS.email} · Hours: ${BUSINESS.hours}

## How to buy

- Every product page (\`${base}/product/<slug>\`) shows the SKU, price, pack size, quantity-tier pricing and an Add to Cart button. Checkout is at \`${base}/checkout\`.
- Guest checkout: ${PAYMENT.guestCheckout ? "yes, no account required" : "no"}.
- Payment: ${PAYMENT.methods}
- Net-30: ${PAYMENT.netTerms}
- Tax exempt: ${PAYMENT.taxExempt}
- Quotes for large or recurring orders: ${base}/quote
- Will-call pickup at the Anaheim warehouse is always free.

## Delivery and shipping

- Free local delivery (${DELIVERY.leadTime}) on subtotals of $${DELIVERY.localMinimum}+ to ${DELIVERY.localZones}.
- Free delivery on subtotals of $${DELIVERY.extendedMinimum}+ to ${DELIVERY.extendedZones} and to zip codes ${DELIVERY.extendedZips.join(" and ")}.
- ${DELIVERY.minimumBasis}
- ${DELIVERY.underMinimum}
- ${DELIVERY.outsideArea}
- ${DELIVERY.fuelSurcharge}
- No same-day delivery.

## Returns

- ${RETURNS.summary}
- Full policy: ${base}/return-policy

## Catalog

Browse all categories: ${base}/shop

${categories}

Full product list (one line per product, SKU | name | brand | pack | price | URL): ${base}/llms-full.txt

## Other useful pages

- Safety Data Sheets (SDS) for chemicals: ${base}/resources
- Credit application, order forms, resale certificate: ${base}/resources
- FAQ: ${base}/faq
- Terms: ${base}/terms · Privacy: ${base}/privacy-policy
- Buying guides: ${base}/guides
- Industries served: ${base}/industries/schools, ${base}/industries/restaurants, ${base}/industries/healthcare, ${base}/industries/offices, ${base}/industries/warehouses, ${base}/industries/property-management, ${base}/industries/portable-restroom
- Spanish: ${base}/es
- Sitemap: ${base}/sitemap.xml
`;

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
