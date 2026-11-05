"use client";

import { useEffect, useState, type ComponentType } from "react";

/**
 * PTR-28 spike, approach A. Loads the React Three Fiber scene only after the
 * page has loaded and the browser is idle, and only with WebGL and without
 * prefers-reduced-motion. Until then, and on failure, the static SVG stays.
 */
export function Topology3DLoader() {
  const [Scene, setScene] = useState<ComponentType<{ onReady: () => void }> | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const gl = document.createElement("canvas").getContext("webgl2");
    if (!gl) return;
    let cancelled = false;
    const start = () => {
      const idle = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 200));
      idle(() => {
        import("./topology-3d").then((m) => {
          if (!cancelled) setScene(() => m.Topology3D);
        });
      });
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("load", start);
    };
  }, []);

  if (!Scene) return null;
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 top-9 bg-charcoal transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
    >
      <Scene onReady={() => setReady(true)} />
    </div>
  );
}
