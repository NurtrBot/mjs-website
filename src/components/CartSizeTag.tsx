import { sizeNameForSku } from "@/lib/product-families";

/**
 * "Size: X-Large" under a cart / checkout / order line for sized products (glove families),
 * read from the line's SKU so carts saved before the size strip existed get it too.
 */
export default function CartSizeTag({ sku, className = "" }: { sku?: string | null; className?: string }) {
  const size = sizeNameForSku(sku);
  if (!size) return null;
  return (
    <div className={`mt-1 ${className}`}>
      <span className="inline-flex items-center gap-1 rounded-md border border-mjs-red/30 bg-red-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-mjs-red">
        Size: {size}
      </span>
    </div>
  );
}
