/* ─────────────────────────────────────────────────────────────
   Gift-card reward tiers — single source of truth.

   Used by the checkout page (to show the tier a cart unlocks), the order
   route (to send the card) and the reward-claim route (confirmation page).
   The SERVER decides the tier from the real BigCommerce order; the browser
   only picks which brand of card it wants.

   Qualifying amount = merchandise subtotal before tax and shipping, minus
   any promo-code discount. Payment method does not matter: bill-to-account,
   card and cash orders all qualify.

   ACCOUNT HOLDERS ONLY (since 2026-11-19): guest checkouts earn nothing and
   are never shown a reward.
   ───────────────────────────────────────────────────────────── */

export interface GiftCard {
  id: string;
  name: string;
  image: string;
}

export interface RewardTier {
  minSpend: number;
  label: string;
  type: "giftcard";
  amount: number;
  gifts: GiftCard[];
}

// Digital gift cards (Tremendous production campaign)
export const GIFT_CARDS: GiftCard[] = [
  { id: "OKMHM2X2OHYV", name: "Amazon", image: "https://api.tremendous.com/product_images/OKMHM2X2OHYV/card" },
  { id: "DC82VBYLI4CC", name: "Apple", image: "https://api.tremendous.com/product_images/DC82VBYLI4CC/card" },
  { id: "2XG0FLQXBDCZ", name: "Starbucks", image: "https://api.tremendous.com/product_images/2XG0FLQXBDCZ/card" },
  { id: "GL3Y4RNQJAQ1", name: "Southwest Airlines", image: "https://api.tremendous.com/product_images/GL3Y4RNQJAQ1/card" },
  { id: "9OEIQ5EWBWT9", name: "DoorDash", image: "https://api.tremendous.com/product_images/9OEIQ5EWBWT9/card" },
  { id: "CRN0ID07Y2XD", name: "Chipotle", image: "https://api.tremendous.com/product_images/CRN0ID07Y2XD/card" },
  { id: "HNFP6TMSPA9W", name: "Airbnb", image: "https://api.tremendous.com/product_images/HNFP6TMSPA9W/card" },
  { id: "DYHLA54LEX11", name: "AMC Theatres", image: "https://api.tremendous.com/product_images/DYHLA54LEX11/card" },
  { id: "4SAT90Q41D60", name: "Chevron", image: "https://api.tremendous.com/product_images/4SAT90Q41D60/card" },
  { id: "L9SW3VT4MLW4", name: "Dick's Sporting Goods", image: "https://api.tremendous.com/product_images/L9SW3VT4MLW4/card" },
];

// Account holders (signed in)
export const ACCOUNT_TIERS: RewardTier[] = [
  { minSpend: 700, label: "Bronze", type: "giftcard", amount: 10, gifts: GIFT_CARDS },
  { minSpend: 2000, label: "Silver", type: "giftcard", amount: 25, gifts: GIFT_CARDS },
  { minSpend: 3500, label: "Gold", type: "giftcard", amount: 50, gifts: GIFT_CARDS },
  { minSpend: 5000, label: "Platinum", type: "giftcard", amount: 75, gifts: GIFT_CARDS },
  { minSpend: 7500, label: "Diamond", type: "giftcard", amount: 100, gifts: GIFT_CARDS },
];

/** Guests get an empty ladder: nothing to show, nothing to earn */
export function getRewardTiers(isAccountHolder: boolean): RewardTier[] {
  return isAccountHolder ? ACCOUNT_TIERS : [];
}

export const REWARD_MIN_SPEND = ACCOUNT_TIERS[0].minSpend;
export const REWARD_MAX_AMOUNT = ACCOUNT_TIERS[ACCOUNT_TIERS.length - 1].amount;

/** Highest tier the qualifying subtotal reaches, or null if it reaches none */
export function getRewardTier(qualifyingSubtotal: number, isAccountHolder: boolean): RewardTier | null {
  const tiers = getRewardTiers(isAccountHolder);
  for (let i = tiers.length - 1; i >= 0; i--) {
    if (qualifyingSubtotal >= tiers[i].minSpend) return tiers[i];
  }
  return null;
}

export function isGiftCardId(id: unknown): id is string {
  return typeof id === "string" && GIFT_CARDS.some((g) => g.id === id);
}

/** Qualifying amount from a BigCommerce v2 order: merchandise before tax/shipping, after discounts */
export function qualifyingSubtotalFromOrder(order: { subtotal_ex_tax?: unknown; discount_amount?: unknown }): number {
  const sub = Number(order.subtotal_ex_tax) || 0;
  const disc = Number(order.discount_amount) || 0;
  return Math.max(0, sub - disc);
}

/** Marker written to the BigCommerce order's staff notes once a card has been sent */
export const REWARD_SENT_MARKER = "[REWARD_SENT";
export function rewardSentNote(amount: number, tremendousRewardId: string): string {
  return `${REWARD_SENT_MARKER}:$${amount}:${tremendousRewardId || "n/a"}:${new Date().toISOString().slice(0, 10)}]`;
}
