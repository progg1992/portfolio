import type { Metadata } from "next";
import Link from "next/link";
import { RequestedPath } from "@/components/site/requested-path";
import { pages } from "@/lib/site";

// Custom 404 (PTR-50), rendered inside the root layout so the header and
// footer stay. The status is a real 404 (ADR 0001, e2e/not-found.spec.ts).

export const metadata: Metadata = { title: "Not found" };

const links = [
  { href: "/", label: "~/home" },
  { href: pages.work.href, label: "~/work" },
  { href: pages.contact.href, label: "~/contact" },
];

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-[760px] flex-col gap-8 px-6 pt-24 pb-28">
      <div className="overflow-hidden rounded-[14px] border border-line bg-obsidian shadow-[0_30px_80px_rgb(0_0_0/0.5)]">
        <div aria-hidden="true" className="flex gap-2 border-b border-line bg-slate px-4 py-3">
          <span className="size-3 rounded-full bg-error" />
          <span className="size-3 rounded-full bg-warn" />
          <span className="size-3 rounded-full bg-ok" />
        </div>
        <div className="flex flex-col gap-4 p-7 font-mono text-sm">
          <p className="text-subtle">
            <span className="text-ok">pierce@ops</span>:<span className="text-cyan">~</span>$ cd{" "}
            <RequestedPath />
          </p>
          <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] leading-tight font-semibold text-error">
            404: route not found
          </h1>
          <p className="font-sans text-base text-muted">
            The page you asked for does not exist or has moved. These do:
          </p>
          <ul className="flex flex-wrap gap-3">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="inline-flex min-h-11 items-center rounded-md border border-line-strong px-4 text-cyan transition-colors hover:border-cyan hover:bg-cyan/10"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
