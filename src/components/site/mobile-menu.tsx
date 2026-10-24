"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { isActive, nav, resumePath } from "@/lib/site";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Menu for screens under 820 px. While open, focus is trapped inside the panel,
 * Escape closes it and returns focus to the toggle, and following a link closes it.
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback((restoreFocus: boolean) => {
    setOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close(true);
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      // Trap focus: the toggle plus the panel's links form one loop.
      const items = [
        toggleRef.current,
        ...panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      ].filter((el): el is HTMLElement => el !== null);
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <div className="min-[820px]:hidden">
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex size-11 items-center justify-center rounded-control border border-line-strong bg-charcoal text-ink transition-colors hover:border-subtle hover:bg-slate"
      >
        <svg
          aria-hidden="true"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      <div
        ref={panelRef}
        id="mobile-menu"
        hidden={!open}
        className="absolute inset-x-0 top-full z-40 border-b border-line bg-obsidian px-6 pt-2 pb-6"
      >
        <nav aria-label="Primary">
          <ul className="flex flex-col font-mono text-base">
            {nav.map(({ href, label }) => {
              const active = isActive(pathname, href);
              return (
                <li key={href} className="border-b border-line">
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    onNavigate={() => close(false)}
                    className={cn(
                      "flex min-h-12 items-center",
                      active ? "text-cyan" : "text-muted hover:text-ink",
                    )}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <a
          href={resumePath}
          download
          className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-control border border-line-strong font-medium text-ink"
        >
          Download resume (PDF)
        </a>
      </div>
    </div>
  );
}
