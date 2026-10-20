import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "ok" | "info" | "neutral";

const tones: Record<Tone, { ring: string; dot: string; text: string }> = {
  ok: { ring: "border-ok/40", dot: "bg-ok", text: "text-ok" },
  info: { ring: "border-cyan/50", dot: "bg-cyan", text: "text-cyan" },
  neutral: { ring: "border-line", dot: "bg-subtle", text: "text-muted" },
};

type StatusBadgeProps = {
  children: ReactNode;
  tone?: Tone;
  /** Show the leading status dot. The dot is decorative; the text carries the meaning. */
  dot?: boolean;
  className?: string;
};

/** Status pills: availability, system health, certification state. */
export function StatusBadge({
  children,
  tone = "neutral",
  dot = true,
  className,
}: StatusBadgeProps) {
  const t = tones[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border bg-charcoal px-3 py-1.5 font-mono text-xs",
        t.ring,
        t.text,
        className,
      )}
    >
      {dot && <span aria-hidden="true" className={cn("size-1.5 rounded-full", t.dot)} />}
      {children}
    </span>
  );
}
