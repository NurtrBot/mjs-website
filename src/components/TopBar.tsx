import { DELIVERY_BANNER } from "@/lib/business";
export default function TopBar() {
  return (
    <div className="hidden md:block bg-mjs-dark text-white text-xs">
      <div className="max-w-[1400px] mx-auto px-4 flex items-center justify-center h-8 gap-3">
        <span className="font-semibold text-white">
          {DELIVERY_BANNER} <span className="font-normal text-white/70">(before tax)</span>
        </span>
      </div>
    </div>
  );
}
