"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { isActive, nav } from "@/lib/site";

/** Desktop navigation. Hidden below 820 px, where MobileMenu takes over. */
export function NavLinks() {
  const pathname = usePathname();
  return (
    <ul className="hidden items-center gap-8 font-mono text-[13px] min-[820px]:flex">
      {nav.map(({ href, label }) => {
        const active = isActive(pathname, href);
        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "inline-flex min-h-11 min-w-11 items-center justify-center border-b transition-colors duration-150",
                active ? "border-cyan text-cyan" : "border-transparent text-muted hover:text-ink",
              )}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
