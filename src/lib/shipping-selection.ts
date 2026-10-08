import { getFreeDeliveryMinimum, isExtendedMinimumZip } from "@/lib/delivery-zones";

/* ─────────────────────────────────────────────────────────────
   Which shipping option a checkout should use.

   California delivery rates come from ShipperHQ layered over the native
   BigCommerce zone, and that zone on its own offers only in-store pickup.
   So "ShipperHQ returned nothing" and "this address is pickup only" look
   identical at this layer. A delivery order must never resolve to pickup
   because of it — that is how orders ended up filed as store pickups.
   ───────────────────────────────────────────────────────────── */

export interface ShippingOption {
  id: string;
  description?: string;
  type?: string;
  cost: number;
}

export type Fulfillment = "delivery" | "pickup";

/** Pickup is matched on description too — the carrier config has used more than one `type`. */
export function isPickupOption(o: Pick<ShippingOption, "type" | "description">): boolean {
  return o.type === "pickupinstore" || o.type === "pickup" || /pick\s*up/i.test(o.description || "");
}

export function hasDeliveryRate(options: ShippingOption[] | undefined): boolean {
  return (options || []).some((o) => !isPickupOption(o));
}

export interface SelectionResult {
  option: ShippingOption | null;
  /** Set when nothing could be chosen; the checkout should surface this and stop. */
  error: string | null;
}

export function chooseShippingOption(args: {
  options: ShippingOption[];
  fulfillment: Fulfillment;
  zip: string;
  subtotalExTax: number;
}): SelectionResult {
  const { options, fulfillment, zip, subtotalExTax } = args;

  if (fulfillment === "pickup") {
    // An explicit pickup request may take whatever the carrier offers.
    const option = options.find(isPickupOption) || options[0] || null;
    return {
      option,
      error: option ? null : "In-store pickup isn't available for this order right now. Please call us at (714) 779-2640.",
    };
  }

  const deliveryOptions = options.filter((o) => !isPickupOption(o));

  // $699-minimum zips pay the UPS rate when under the minimum, not a local delivery rate
  const freeDeliveryMinimum = getFreeDeliveryMinimum(zip);
  const underExtendedMinimum =
    isExtendedMinimumZip(zip) && freeDeliveryMinimum !== null && subtotalExTax < freeDeliveryMinimum;
  const upsOptions = deliveryOptions.filter((o) => /ups/i.test(o.description || ""));
  const eligible = underExtendedMinimum && upsOptions.length > 0 ? upsOptions : deliveryOptions;

  const option = [...eligible].sort((a, b) => a.cost - b.cost)[0] || null;

  return {
    option,
    error: option
      ? null
      : "We couldn't calculate a delivery rate for this address. Please double-check the ZIP code, or call us at (714) 779-2640 and we'll place the order for you.",
  };
}
