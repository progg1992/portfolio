import type { Metadata } from "next";
import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";
import { certifications, education, governance, heading, principles, story } from "@/content/about";
import { external, pages } from "@/lib/site";

// About page (PTR-23, CR-1), from the approved About artboard. Content lives
// in src/content/about.ts. The portrait slot waits for the Client's photo.

export const metadata: Metadata = {
  title: "About",
  alternates: { canonical: "/about" },
  description:
    "Pierce Rogg: from writing code to running the systems it depends on. Education, certifications, and governance work.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto flex max-w-[1240px] flex-col gap-22 px-6 pt-22 pb-28">
      <section className="grid gap-x-16 gap-y-8 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <p className="font-mono text-[13px] text-purple-text">~/about</p>
          <h1 className="text-[clamp(2.5rem,5.6vw,4.5rem)] leading-none font-bold tracking-[-0.04em]">
            {heading}
          </h1>
        </div>
        <div className="flex flex-col gap-5 text-lg leading-[1.7] text-muted lg:pt-12">
          {story.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
          <p>
            {principles.lead} <span className="text-ink">{principles.rules}</span>{" "}
            {principles.close}
          </p>
          {pages.experience.live && (
            <Link
              href={pages.experience.href}
              className="inline-flex min-h-11 items-center self-start font-mono text-sm text-cyan hover:text-cyan-hover"
            >
              see the full record →
            </Link>
          )}
        </div>
      </section>

      <section aria-labelledby="governance-heading" className="flex flex-col gap-6">
        <div className="flex flex-col gap-2.5">
          <p className="font-mono text-[13px] text-purple-text">01 / governance</p>
          <h2 id="governance-heading" className="text-[32px] font-bold tracking-[-0.03em]">
            Governance and foundations
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))]">
          <div className="flex flex-col justify-between gap-6 rounded-[14px] border border-purple/40 bg-charcoal p-8">
            <span className="font-mono text-xs text-purple-text">{governance.label}</span>
            <div className="flex flex-col gap-3">
              <h3 className="text-[28px] leading-[1.15] font-bold tracking-[-0.02em]">
                {governance.title}
              </h3>
              <p className="text-muted">{governance.body}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 rounded-[14px] border border-line bg-charcoal p-7">
            <span className="font-mono text-xs text-cyan">education</span>
            <h3 className="text-xl font-bold">{education.degree}</h3>
            <p className="text-[15px] text-muted">{education.detail}</p>
            <p className="mt-1.5 border-t border-line pt-2.5 text-[15px] text-muted">
              {education.prior}
            </p>
            <p className="text-sm text-subtle">{education.earlier}</p>
          </div>
          <div className="flex flex-col gap-3 rounded-[14px] border border-line bg-charcoal p-7">
            <span className="font-mono text-xs text-cyan">certifications</span>
            <h3 className="text-xl font-bold">Professional development</h3>
            <ul className="flex flex-wrap gap-2 font-mono text-xs">
              {certifications.map((c) => (
                <li key={c} className="rounded-md border border-cyan/50 px-2.5 py-1 text-cyan">
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="closing-heading"
        className="flex flex-wrap items-center justify-between gap-6 rounded-[14px] border border-line bg-charcoal p-8"
      >
        <div className="flex flex-col gap-1.5">
          <h2 id="closing-heading" className="text-2xl font-bold tracking-[-0.02em]">
            Building something that has to stay up?
          </h2>
          <p className="text-muted">
            Client projects run through{" "}
            <a href={external.bdd} className="text-cyan underline underline-offset-4">
              Blue Devil Development
            </a>
            .
          </p>
        </div>
        {pages.contact.live && (
          <Link href={`${pages.contact.href}?reason=consulting`} className={buttonClasses({})}>
            Start a conversation
          </Link>
        )}
      </section>
    </div>
  );
}
