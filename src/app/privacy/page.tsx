import type { Metadata } from "next";
import { analyticsOff, analyticsOn, sections, updated } from "@/content/privacy";
import { analytics } from "@/lib/site";

// Privacy page (PTR-50). Content in src/content/privacy.ts.

export const metadata: Metadata = {
  title: "Privacy",
  alternates: { canonical: "/privacy" },
  description:
    "What the contact form collects, where it goes, how long it is kept, and how analytics work on this site.",
};

export default function PrivacyPage() {
  const blocks = [
    sections.form,
    analytics.live ? analyticsOn : analyticsOff,
    sections.cookies,
    sections.hosting,
    sections.questions,
  ];
  return (
    <article className="mx-auto flex max-w-[760px] flex-col gap-12 px-6 pt-22 pb-28">
      <header className="flex flex-col gap-4">
        <p className="font-mono text-[13px] text-purple-text">~/privacy</p>
        <h1 className="text-[clamp(2.5rem,5.6vw,4rem)] leading-[1.02] font-bold tracking-[-0.04em]">
          Privacy
        </h1>
        <p className="text-lg text-muted">
          What this site collects, where it goes, and how long it stays there.
        </p>
        <p className="font-mono text-xs text-subtle">
          last updated <time dateTime={updated.iso}>{updated.label}</time>
        </p>
      </header>
      {blocks.map((b) => (
        <section key={b.heading} className="flex flex-col gap-3">
          <h2 className="text-2xl font-bold tracking-[-0.02em]">{b.heading}</h2>
          {b.paragraphs.map((p) => (
            <p key={p.slice(0, 32)} className="text-[17px] leading-[1.7] text-muted">
              {p}
            </p>
          ))}
        </section>
      ))}
    </article>
  );
}
