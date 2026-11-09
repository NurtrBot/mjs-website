export const REDDIT_PIXEL_ID = "a2_jckht9i8n1m0";

type Rdt = ((...args: unknown[]) => void) & {
  callQueue?: unknown[];
  sendEvent?: (...args: unknown[]) => void;
};
declare global {
  interface Window { rdt?: Rdt }
}

export function rdt(...args: unknown[]) {
  if (typeof window === "undefined") return;
  if (!window.rdt) {
    const p = function (...a: unknown[]) {
      if (p.sendEvent) p.sendEvent(...a);
      else p.callQueue!.push(a);
    } as Rdt;
    p.callQueue = [];
    window.rdt = p;
  }
  window.rdt(...args);
}
