/**
 * Green price-per-roll tag for paper products. Re-animates whenever the
 * per-roll price changes (e.g. the shopper picks a different tier tile).
 */
export default function PerRollTag({
  price,
  rolls,
  tierLabel,
  compact = false,
  className = "",
}: {
  price: number;
  rolls: number;
  /** Shown when the price comes from a bulk tier, e.g. "25+ Cartons" */
  tierLabel?: string;
  /** Price and "/roll" only, for tight spots like the mobile sticky bar */
  compact?: boolean;
  className?: string;
}) {
  const perRoll = price / rolls;
  return (
    <span
      className={`inline-flex items-center rounded-full bg-gradient-to-r from-mjs-green to-emerald-500 text-white shadow-sm shadow-green-600/20 ${
        compact ? "gap-1 px-2 py-0.5" : "gap-1.5 pl-3 pr-3.5 py-1"
      } ${className}`}
      aria-live="polite"
    >
      <span key={perRoll.toFixed(2)} className={`per-roll-pop font-extrabold tabular-nums ${compact ? "text-xs" : "text-sm"}`}>
        ${perRoll.toFixed(2)}
      </span>
      <span className={`font-semibold text-white/90 ${compact ? "text-[10px]" : "text-xs"}`}>/ roll</span>
      {!compact && (
        <span className="text-[11px] font-medium text-white/75 border-l border-white/30 pl-1.5">
          {tierLabel ? tierLabel : `${rolls} rolls`}
        </span>
      )}
    </span>
  );
}
