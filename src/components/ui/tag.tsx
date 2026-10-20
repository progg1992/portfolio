import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type TagProps = {
  children: ReactNode;
  /** Selected state, for tags used as filters. */
  active?: boolean;
  className?: string;
};

/** Tech stack and skill labels. Static text; for a clickable filter, use FilterButton. */
export function Tag({ children, active = false, className }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-1 font-mono text-xs",
        active ? "border-cyan bg-cyan/10 text-cyan" : "border-line-strong text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

type FilterButtonProps = {
  children: ReactNode;
  pressed: boolean;
  onClick: () => void;
};

/** A toggle in a filter group. Announces its state with aria-pressed. */
export function FilterButton({ children, pressed, onClick }: FilterButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "min-h-10 rounded-md border px-3.5 font-mono text-[13px] transition-colors duration-150",
        pressed
          ? "border-cyan bg-cyan/10 text-cyan"
          : "border-line-strong text-muted hover:border-subtle hover:bg-slate hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
