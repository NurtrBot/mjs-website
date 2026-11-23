"use client";

// Site-wide interaction tracking.
// Every button, link and tap on the site fires a GA4 event (and a Clarity custom event) with
// the page area, the section the control sits in, and the control's label. Sections are named
// with data-track="…" on their wrapper; anything untagged falls back to the nearest landmark
// and its heading. Also fires section_view once per page for each tagged section that scrolls
// into view, so the homepage and dashboard can be read section by section.

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

const INTERACTIVE = 'button, a[href], [role="button"], [role="tab"], [role="menuitem"], input[type="submit"], input[type="button"], summary, label[for]';
const LANDMARK = "section, nav, header, footer, aside, main, form, [data-track]";

const clean = (s: string | null | undefined, max = 80) => (s || "").replace(/\s+/g, " ").trim().slice(0, max);

function pageArea(path: string) {
  if (path === "/") return "home";
  if (path.startsWith("/account")) return "dashboard";
  if (path.startsWith("/product/")) return "product";
  if (path.startsWith("/category/") || path.startsWith("/collection/") || path.startsWith("/shop")) return "catalog";
  if (path.startsWith("/cart")) return "cart";
  if (path.startsWith("/checkout")) return "checkout";
  return path.split("/")[1] || "page";
}

function labelOf(el: HTMLElement) {
  const explicit = el.getAttribute("data-track-label") || el.getAttribute("aria-label") || el.getAttribute("title");
  if (explicit) return clean(explicit);
  const text = clean(el.innerText || el.textContent);
  if (text) return text;
  const img = el.querySelector("img");
  if (img?.alt) return clean(img.alt);
  const href = el.getAttribute("href");
  if (href) return clean(href.replace(/^https?:\/\/[^/]+/, "")) || "link";
  return `${el.tagName.toLowerCase()}:${clean(el.className, 40)}`;
}

function sectionOf(el: HTMLElement) {
  const tagged = el.closest<HTMLElement>("[data-track]");
  if (tagged?.dataset.track) return tagged.dataset.track;
  const land = el.closest<HTMLElement>(LANDMARK);
  if (!land) return "page";
  const heading = land.querySelector("h1, h2, h3");
  const h = clean(heading?.textContent, 40);
  return h ? `${land.tagName.toLowerCase()}:${h}` : land.tagName.toLowerCase();
}

export default function ClickTracker() {
  const pathname = usePathname();

  // Clicks: capture phase so we see them even when a handler stops propagation or navigates away
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const el = target?.closest<HTMLElement>(INTERACTIVE);
      if (!el) return;
      const path = window.location.pathname;
      const area = pageArea(path);
      const label = labelOf(el);
      const section = sectionOf(el);
      const href = el.getAttribute("href");
      const name = area === "home" ? "home_click" : area === "dashboard" ? "dashboard_click" : "ui_click";
      trackEvent(name, {
        click_label: label,
        click_section: section,
        click_href: href ? clean(href.replace(/^https?:\/\/[^/]+/, ""), 100) : undefined,
        click_tag: el.tagName.toLowerCase(),
        page_area: area,
        page_path: path,
      });
      const w = window as unknown as { clarity?: (...a: unknown[]) => void };
      if (w.clarity) {
        try {
          w.clarity("event", `${area}: ${section} › ${label}`.slice(0, 100));
        } catch {}
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Section views: once per page for each data-track section that becomes half visible
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const seen = new Set<string>();
    const area = pageArea(pathname);
    const io = new IntersectionObserver(entries => {
      for (const en of entries) {
        if (!en.isIntersecting) continue;
        const el = en.target as HTMLElement;
        const name = el.dataset.track;
        if (!name || seen.has(name)) continue;
        seen.add(name);
        trackEvent("section_view", { section: name, page_area: area, page_path: pathname });
        io.unobserve(el);
      }
    }, { threshold: 0.5 });
    const observed = new WeakSet<Element>();
    const scan = () => {
      document.querySelectorAll<HTMLElement>("[data-track]").forEach(el => {
        if (observed.has(el) || (el.dataset.track && seen.has(el.dataset.track))) return;
        observed.add(el);
        io.observe(el);
      });
    };
    scan();
    // Sections that render after data loads (dashboard strips, personalised rows) get picked up here
    let t: ReturnType<typeof setTimeout> | undefined;
    const mo = new MutationObserver(() => { clearTimeout(t); t = setTimeout(scan, 400); });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { clearTimeout(t); mo.disconnect(); io.disconnect(); };
  }, [pathname]);

  return null;
}
