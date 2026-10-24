import { cn } from "@/lib/cn";
import { systems, type Stat } from "@/content/system-status";

// Card grids shared by the home terminal (PTR-21) and /experience (PTR-49), so
// both pages render the same data the same way.

export function SystemsGrid() {
  return (
    <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
      {systems.map((s) => (
        <li
          key={s.name}
          className={cn(
            "flex flex-col gap-2.5 rounded-[10px] border bg-slate p-5",
            s.wide && "lg:col-span-2",
            s.accent ? "border-purple/50" : "border-line",
          )}
        >
          <span className="flex justify-between text-xs text-muted">
            {s.key}
            <span className="text-ok">
              <span aria-hidden="true">● </span>online
            </span>
          </span>
          <span
            className={cn("font-sans font-semibold text-ink", s.wide ? "text-[22px]" : "text-xl")}
          >
            {s.name}
          </span>
          <span className="text-xs text-subtle">{s.detail}</span>
        </li>
      ))}
    </ul>
  );
}

export function Stats({ items }: { items: Stat[] }) {
  return (
    <dl className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {items.map((s) => (
        <div
          key={s.key}
          className="flex flex-col gap-2 rounded-[10px] border border-line bg-slate p-6"
        >
          <dt className="text-xs text-muted">{s.key}</dt>
          <dd
            className={cn(
              "text-[40px] leading-none font-semibold",
              s.accent ? "text-purple-text" : "text-cyan",
            )}
          >
            {s.value}
          </dd>
          <dd className="font-sans text-[15px] text-muted">{s.body}</dd>
          <dd className="mt-auto pt-1 text-[11px] text-subtle">src: {s.source}</dd>
        </div>
      ))}
    </dl>
  );
}
