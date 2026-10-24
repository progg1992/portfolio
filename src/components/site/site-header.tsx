import Link from "next/link";
import { nav, resume } from "@/lib/site";
import { MobileMenu } from "./mobile-menu";
import { NavLinks } from "./nav-links";

export function SiteHeader() {
  return (
    <header className="relative z-30 border-b border-line bg-obsidian">
      <div className="mx-auto flex min-h-18 max-w-[1240px] items-center justify-between gap-6 px-6">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-2.5 font-mono text-[15px] font-semibold text-ink"
        >
          <span
            aria-hidden="true"
            className="size-2 rounded-full bg-cyan shadow-[0_0_10px_var(--color-cyan)]"
          />
          pierce.rogg
          <span className="sr-only">, home</span>
        </Link>

        {nav.length > 0 && (
          <nav aria-label="Primary" className="hidden min-[820px]:block">
            <NavLinks />
          </nav>
        )}

        <div className="flex items-center gap-2">
          {resume.live && (
            <a
              href={resume.path}
              download
              className="hidden min-h-11 items-center rounded-control border border-line-strong px-[18px] text-sm font-medium text-ink transition-colors hover:border-subtle hover:bg-slate min-[420px]:inline-flex"
            >
              Resume PDF
            </a>
          )}
          {(nav.length > 0 || resume.live) && <MobileMenu />}
        </div>
      </div>
    </header>
  );
}
