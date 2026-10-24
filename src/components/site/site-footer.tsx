import Link from "next/link";
import { external, pages } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-obsidian">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 pt-7 pb-10 font-mono text-xs text-subtle">
        <p>
          © 2026 Pierce Rogg · Upper Peninsula, Michigan
          {pages.privacy.live && (
            <>
              {" · "}
              <Link
                href={pages.privacy.href}
                className="text-muted underline underline-offset-4 hover:text-ink"
              >
                privacy
              </Link>
            </>
          )}
        </p>
        <ul className="flex items-center gap-5">
          <li>
            <a
              href={external.linkedin}
              className="text-muted hover:text-ink"
              rel="noopener"
              target="_blank"
            >
              linkedin<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
          <li>
            <a
              href={external.github}
              className="text-muted hover:text-ink"
              rel="noopener"
              target="_blank"
            >
              github<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
