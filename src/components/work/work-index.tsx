"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import type { CaseStudyMeta } from "@/content/schema";
import { disciplines, type Discipline } from "@/content/disciplines";
import { FilterButton, Tag } from "@/components/ui/tag";

export type WorkCard = Pick<
  CaseStudyMeta,
  "id" | "slug" | "title" | "subheading" | "discipline" | "stack" | "metrics"
>;

const labels: Record<Discipline, string> = {
  infrastructure: "Infrastructure",
  operations: "Operations",
  delivery: "Delivery",
  documentation: "Documentation",
};

/**
 * The filter lives in the URL (?d=infrastructure) so a filtered view can be
 * shared. The server snapshot is "", so the prerendered HTML shows every card
 * and works without JavaScript; the browser applies the filter after hydration.
 */
const listeners = new Set<() => void>();
function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("popstate", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("popstate", listener);
  };
}
const getSearch = () => window.location.search;
const getServerSearch = () => "";

function parse(search: string): Discipline | null {
  const d = new URLSearchParams(search).get("d");
  return disciplines.find((x) => x === d) ?? null;
}

function setFilter(next: Discipline | null) {
  const url = new URL(window.location.href);
  if (next) url.searchParams.set("d", next);
  else url.searchParams.delete("d");
  // replaceState: changing a filter is not a navigation worth a Back press.
  window.history.replaceState(window.history.state, "", url);
  listeners.forEach((l) => l());
}

export function WorkIndex({ studies }: { studies: WorkCard[] }) {
  const active = parse(useSyncExternalStore(subscribe, getSearch, getServerSearch));
  const shown = active ? studies.filter((s) => s.discipline === active) : studies;
  const present = disciplines.filter((d) => studies.some((s) => s.discipline === d));

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <div role="group" aria-label="Filter by discipline" className="flex flex-wrap gap-2">
          <FilterButton pressed={active === null} onClick={() => setFilter(null)}>
            all
          </FilterButton>
          {present.map((d) => (
            <FilterButton
              key={d}
              pressed={active === d}
              onClick={() => setFilter(active === d ? null : d)}
            >
              {labels[d].toLowerCase()}
            </FilterButton>
          ))}
        </div>
        <p role="status" className="font-mono text-xs text-subtle">
          {active
            ? `${shown.length} of ${studies.length} case studies in ${labels[active]}`
            : `${studies.length} case studies`}
        </p>
      </div>

      <ul className="grid gap-4 md:grid-cols-2">
        {shown.map((s) => {
          const metric = s.metrics[0];
          return (
            <li key={s.slug}>
              <article className="relative flex h-full flex-col gap-4 rounded-xl border border-line bg-slate p-7 transition-colors focus-within:border-cyan hover:border-line-strong hover:bg-charcoal">
                <p className="flex gap-3 font-mono text-[13px]">
                  <span className="text-cyan">{s.id}</span>
                  <span className="text-muted">{labels[s.discipline].toLowerCase()}</span>
                </p>
                <div className="flex flex-col gap-1.5">
                  <h2 className="text-xl leading-snug font-semibold tracking-[-0.02em]">
                    <Link
                      href={`/work/${s.slug}`}
                      className="after:absolute after:inset-0 after:rounded-xl focus:outline-none"
                    >
                      {s.title}
                    </Link>
                  </h2>
                  <p className="text-muted">{s.subheading}</p>
                </div>
                {metric && (
                  <p className="flex items-baseline gap-3">
                    <span className="font-mono text-3xl leading-none font-semibold text-cyan">
                      {metric.value}
                    </span>
                    <span className="text-sm text-muted">{metric.label}</span>
                  </p>
                )}
                <ul className="mt-auto flex flex-wrap gap-2" aria-label="Stack">
                  {s.stack.map((item) => (
                    <li key={item}>
                      <Tag>{item}</Tag>
                    </li>
                  ))}
                </ul>
              </article>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
