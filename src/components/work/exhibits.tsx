import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * A captioned figure for a case study diagram. Wrap a fenced text block in it
 * to show a tree or listing; the text stays real text for screen readers.
 */
export function Exhibit({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <figure className="my-10">
      {/* Focusable so keyboard users can scroll it on narrow screens (WCAG 2.1.1). */}
      <div
        role="region"
        aria-label={caption}
        tabIndex={0}
        className="overflow-x-auto rounded-xl border border-line bg-charcoal px-7 py-6 font-mono text-sm leading-8 text-muted [&_code]:text-muted [&_pre]:m-0 [&_pre]:whitespace-pre"
      >
        {children}
      </div>
      <figcaption className="mt-2.5 font-mono text-xs text-subtle">exhibit: {caption}</figcaption>
    </figure>
  );
}

type Tone = "alert" | "warn" | "info" | "accent" | "ok";

const tones: Record<Tone, string> = {
  alert: "text-error",
  warn: "text-warn",
  info: "text-cyan",
  accent: "text-purple-text",
  ok: "text-ok",
};

export type TimelineStep = { label: string; tone: Tone; text: string };

/** An incident read top to bottom: what broke, how it was traced, what changed. */
export function IncidentTimeline({ caption, steps }: { caption: string; steps: TimelineStep[] }) {
  return (
    <figure className="my-10">
      <ol className="overflow-x-auto rounded-xl border border-line bg-charcoal px-7 py-6 font-mono text-sm">
        {steps.map((step) => (
          <li
            key={step.label}
            className="grid grid-cols-[96px_1fr] gap-4 border-b border-line py-3 last:border-b-0"
          >
            <span className={cn("font-medium", tones[step.tone])}>[{step.label}]</span>
            <span className="text-muted">{step.text}</span>
          </li>
        ))}
      </ol>
      <figcaption className="mt-2.5 font-mono text-xs text-subtle">exhibit: {caption}</figcaption>
    </figure>
  );
}
