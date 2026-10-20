import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type TerminalTabProps = {
  selected: boolean;
  /** id of the tabpanel this tab controls. */
  controls: string;
} & Omit<ComponentProps<"button">, "role" | "aria-selected" | "aria-controls">;

/**
 * One tab in the terminal panel. Presentation only: keyboard handling and
 * roving tabindex live in the Terminal component (PTR-25), per the WAI-ARIA tabs pattern.
 */
export function TerminalTab({ selected, controls, className, ...props }: TerminalTabProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      aria-controls={controls}
      tabIndex={selected ? 0 : -1}
      className={cn(
        "min-h-9 rounded-md border px-3.5 font-mono text-[13px] transition-colors duration-150",
        selected
          ? "border-cyan bg-cyan/10 text-cyan"
          : "border-transparent text-muted hover:border-line-strong hover:bg-slate hover:text-ink",
        className,
      )}
      {...props}
    />
  );
}
