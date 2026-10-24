"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { TerminalTab } from "@/components/ui/terminal-tab";
import { cn } from "@/lib/cn";
import { leadership, operations, tabs, type TabId } from "@/content/system-status";
import { Stats, SystemsGrid } from "./status-cards";

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
              <SystemsGrid />
            ) : (
              <Stats items={t.id === "operations" ? operations : leadership} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
