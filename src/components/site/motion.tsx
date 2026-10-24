"use client";

import { useEffect } from "react";

/**
 * Site-wide motion (PTR-30): feeds pointer coordinates to .glow elements and
 * marks .pulse-dot elements the first time they are seen. One passive listener
 * and one observer for the whole site; the CSS in globals.css does the drawing.
 * Does nothing on touch devices or under prefers-reduced-motion.
 */
export function Motion() {
  useEffect(() => {
    const allowed = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    if (!allowed.matches) return;

    let frame = 0;
    let last: PointerEvent | null = null;
    const paint = () => {
      frame = 0;
      const e = last;
      if (!e || !(e.target instanceof Element)) return;
      const el = e.target.closest<HTMLElement>(".glow");
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--glow-x", `${e.clientX - r.left}px`);
      el.style.setProperty("--glow-y", `${e.clientY - r.top}px`);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      last = e;
      if (!frame) frame = requestAnimationFrame(paint);
    };
    document.addEventListener("pointermove", onMove, { passive: true });

    const seen = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-seen", "");
          seen.unobserve(entry.target);
        }
      },
      { threshold: 1 },
    );
    const watch = (root: ParentNode) =>
      root.querySelectorAll(".pulse-dot:not([data-seen])").forEach((el) => seen.observe(el));
    watch(document);
    // Client navigation and tab switches add dots later.
    const added = new MutationObserver(() => watch(document));
    added.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
      seen.disconnect();
      added.disconnect();
    };
  }, []);

  return null;
}
