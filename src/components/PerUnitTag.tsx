/**
 * Green price-per-unit tag (per roll, per bag, per pack/box/ream, …).
 * Re-animates whenever the per-unit price changes (e.g. the shopper picks a
 * different tier tile).
 */
export default function PerUnitTag({
  price,
  count,
  unit,
  each,
  tierLabel,
  compact = false,
  className = "",
}: {
  price: number;
  /** Units in one case, e.g. 96 rolls or 500 bags */
  count: number;
  /** Singular unit name, e.g. "roll" or "bag" */
  unit: string;
  /** Pieces in each unit, e.g. 250 towels per pack → "16 packs × 250" */
  each?: number;
  /** Shown when the price comes from a bulk tier, e.g. "25+ Cartons" */
  tierLabel?: string;
  /** Price and "/unit" only, for tight spots like the mobile sticky bar */
  compact?: boolean;
  className?: string;
}) {
  const perUnit = price / count;
  // Under 10¢ (e.g. 1,000-count liners) two decimals would make every tier look the same
  const perUnitText = perUnit < 0.01 ? perUnit.toFixed(4) : perUnit < 0.1 ? perUnit.toFixed(3) : perUnit.toFixed(2);
  const plural = /(x|s|ch|sh)$/.test(unit) ? `${unit}es` : `${unit}s`;
  return (
    <span
      className={`inline-flex items-center rounded-full bg-gradient-to-r from-mjs-green to-emerald-500 text-white shadow-sm shadow-green-600/20 ${
        compact ? "gap-1 px-2 py-0.5" : "gap-1.5 pl-3 pr-3.5 py-1"
      } ${className}`}
      aria-live="polite"
    >
      <span key={perUnitText} className={`per-roll-pop font-extrabold tabular-nums ${compact ? "text-xs" : "text-sm"}`}>
        ${perUnitText}
      </span>
      <span className={`font-semibold text-white/90 ${compact ? "text-[10px]" : "text-xs"}`}>/ {unit}</span>
      {!compact && (
        <span className="text-[11px] font-medium text-white/75 border-l border-white/30 pl-1.5">
          {tierLabel ? tierLabel : `${count.toLocaleString()} ${plural}${each ? ` × ${each.toLocaleString()}` : ""}`}
        </span>
      )}
    </span>
  );
}
