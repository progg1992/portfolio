"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { TerminalTab } from "@/components/ui/terminal-tab";
import { cn } from "@/lib/cn";
import {
  leadership,
  operations,
  systems,
  tabs,
  type Stat,
  type TabId,
} from "@/content/system-status";

const panelId = (id: TabId) => `terminal-panel-${id}`;
const tabId = (id: TabId) => `terminal-tab-${id}`;

/**
 * The system_status terminal (PTR-21) with keyboard tabs (PTR-25), following
 * the WAI-ARIA tabs pattern with automatic activation: arrow keys move and
 * select, Home and End jump, and only the selected tab is in the tab order.
 */
export function Terminal() {
  const [active, setActive] = useState<TabId>("infrastructure");
  // The fade runs only after a switch, never on first paint.
  const [switched, setSwitched] = useState(false);
  const refs = useRef<Partial<Record<TabId, HTMLButtonElement | null>>>({});
  const current = tabs.find((t) => t.id === active)!;

  function select(id: TabId, focus: boolean) {
    setActive(id);
    setSwitched(true);
    if (focus) refs.current[id]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const i = tabs.findIndex((t) => t.id === active);
    const last = tabs.length - 1;
    const target = {
      ArrowRight: i === last ? 0 : i + 1,
      ArrowLeft: i === 0 ? last : i - 1,
      Home: 0,
      End: last,
    }[event.key];
    if (target === undefined) return;
    event.preventDefault();
    select(tabs[target].id, true);
  }

  return (
    <div className="overflow-hidden rounded-[14px] border border-line bg-obsidian shadow-[0_30px_80px_rgb(0_0_0/0.5)]">
      <div className="flex flex-wrap items-center gap-4 border-b border-line bg-slate px-4 py-3">
        <div aria-hidden="true" className="flex gap-2">
          <span className="size-3 rounded-full bg-error" />
          <span className="size-3 rounded-full bg-warn" />
          <span className="size-3 rounded-full bg-ok" />
        </div>
        <div role="tablist" aria-label="Terminal views" className="flex flex-wrap gap-1">
          {tabs.map((t) => (
            <TerminalTab
              key={t.id}
              id={tabId(t.id)}
              ref={(el) => {
                refs.current[t.id] = el;
              }}
              selected={t.id === active}
              controls={panelId(t.id)}
              onClick={() => select(t.id, false)}
              onKeyDown={onKeyDown}
            >
              {t.path}
            </TerminalTab>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-5 p-5 font-mono sm:p-7">
        <p className="text-[13px] text-subtle">
          <span className="text-ok">pierce@ops</span>:
          <span className="text-cyan">{current.path}</span>$ {current.command}
        </p>

        {tabs.map((t) => (
          <div
            key={t.id}
            id={panelId(t.id)}
            role="tabpanel"
            aria-labelledby={tabId(t.id)}
            tabIndex={0}
            hidden={t.id !== active}
            className={cn("rounded-lg", switched && t.id === active && "animate-panel-in")}
          >
            {t.id === "infrastructure" ? (
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
                      className={cn(
                        "font-sans font-semibold text-ink",
                        s.wide ? "text-[22px]" : "text-xl",
                      )}
                    >
                      {s.name}
                    </span>
                    <span className="text-xs text-subtle">{s.detail}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <Stats items={t.id === "operations" ? operations : leadership} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Stats({ items }: { items: Stat[] }) {
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
