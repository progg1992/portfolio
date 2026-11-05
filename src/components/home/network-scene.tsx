"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";

type SceneProps = { onReady: () => void; active: boolean };

/**
 * Loads the React Three Fiber scene during idle time once the section is
 * within one screen of the viewport, on desktops only. Pauses rendering when
 * the section is off screen or the tab is hidden.
 */
export function NetworkScene() {
  const ref = useRef<HTMLDivElement>(null);
  const [Scene, setScene] = useState<ComponentType<SceneProps> | null>(null);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const desktop = window.matchMedia(
      "(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    if (!desktop.matches || !document.createElement("canvas").getContext("webgl2")) return;

    let started = false;
    const idle = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 200));
    const near = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || started) return;
        started = true;
        near.disconnect();
        idle(() => {
          performance.mark("scene-import-start");
          import("./topology-3d").then((m) => setScene(() => m.Topology3D));
        });
      },
      { rootMargin: "100% 0px" },
    );
    near.observe(el);
    const onScreen = new IntersectionObserver(([entry]) => setVisible(!!entry?.isIntersecting));
    onScreen.observe(el);
    const onTab = () => setTabVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onTab);
    return () => {
      near.disconnect();
      onScreen.disconnect();
      document.removeEventListener("visibilitychange", onTab);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="absolute inset-0">
      {Scene && (
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
        >
          <Scene
            active={visible && tabVisible}
            onReady={() => {
              performance.mark("scene-ready");
              setReady(true);
            }}
          />
        </div>
      )}
    </div>
  );
}
