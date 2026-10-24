import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Terminal } from "@/components/home/terminal";
import { Topology } from "@/components/home/topology";
import { buttonClasses } from "@/components/ui/button";
import { teaser as aboutTeaser } from "@/content/about";
import { teaser as experienceTeaser } from "@/content/experience";
import { hero } from "@/content/home";
import { getFeaturedCaseStudies } from "@/content/work";
import { external, pages, resume, siteUrl } from "@/lib/site";

// Home page as a summary hub (PTR-20, CR-1). Each teaser comes from the content
// its page renders, and appears once that page is live (src/lib/site.ts).

export const metadata: Metadata = { alternates: { canonical: "/" } };

/** schema.org Person (PTR-34), from the same hero content the page shows. */
const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: hero.name,
  jobTitle: [...hero.titles],
  url: `${siteUrl}/`,
  sameAs: [external.linkedin, external.github],
  worksFor: { "@type": "Organization", name: "Blue Devil Development", url: external.bdd },
};

function Figure({ children }: { children: ReactNode }) {
  return <strong className="font-semibold text-ink">{children}</strong>;
}

function Eyebrow({ n, label }: { n: number; label: string }) {
  return (
    <p className="font-mono text-[13px] text-purple-text">
      {String(n).padStart(2, "0")} / {label}
    </p>
  );
}

type Teaser = {
  page: { href: string; label: string; live: boolean };
  title: string;
  body: string;
  cta: string;
};

export default async function Home() {
  const featured = await getFeaturedCaseStudies();
  const teasers: Teaser[] = [
    { page: pages.experience, ...experienceTeaser },
    { page: pages.about, ...aboutTeaser },
  ];
  const liveTeasers = teasers.filter((t) => t.page.live);

  // Sections are numbered in the order they render, so the sequence has no gaps
  // while pages are still being built.
  let section = 0;
  const next = () => ++section;

  return (
    <>
      <script
        type="application/ld+json"
        // Static data from this file; < is escaped so the JSON cannot close the tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(person).replace(/</g, "\\u003c") }}
      />
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 -right-50 size-[900px] bg-[radial-gradient(closest-side,rgb(6_182_212/0.14),rgb(168_85_247/0.06)_55%,transparent)]"
        />
        <div className="relative mx-auto grid max-w-[1240px] items-center gap-14 px-6 pt-24 pb-26 min-[1024px]:grid-cols-2">
          <div className="flex flex-col gap-7">
            <p className="inline-flex items-center gap-2.5 self-start rounded-full border border-line bg-charcoal px-3 py-1.5 font-mono text-xs text-muted">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-ok" />
              {hero.availability}
            </p>
            <h1 className="text-display font-bold">{hero.name}</h1>
            <p className="font-mono text-[clamp(0.8125rem,1.4vw,1rem)] leading-[1.7] text-cyan">
              {hero.titles.join(" · ")}
            </p>
            <p className="max-w-[560px] text-[19px] leading-[1.6] text-muted">
              I own technology environments end to end: the infrastructure, the budget, and the
              teams that run it. I have managed a <Figure>{hero.figures.budget.value}</Figure>{" "}
              technology budget, saved <Figure>{hero.figures.savings.value}</Figure> a year through
              workflow optimization, and led cross-functional engineering teams through delivery.
            </p>
            <div className="flex flex-wrap gap-3">
              {pages.contact.live && (
                <Link href={`${pages.contact.href}?reason=interview`} className={buttonClasses({})}>
                  Schedule a conversation
                </Link>
              )}
              <Link
                href={pages.work.href}
                className={buttonClasses({ variant: pages.contact.live ? "secondary" : "primary" })}
              >
                Read the case studies
              </Link>
            </div>
          </div>
          <Topology />
        </div>
      </section>

      <section aria-labelledby="status-heading" className="border-y border-line bg-charcoal">
        <div className="mx-auto flex max-w-[1040px] flex-col gap-8 px-6 py-26">
          <div className="flex flex-col items-center gap-2.5 text-center">
            <Eyebrow n={next()} label="system_status" />
            <h2 id="status-heading" className="text-heading font-bold">
              What I run, deliver, and lead
            </h2>
          </div>
          <Terminal />
        </div>
      </section>

      <section aria-labelledby="featured-heading">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-8 px-6 pt-28 pb-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-2.5">
              <Eyebrow n={next()} label="featured_work" />
              <h2 id="featured-heading" className="text-heading font-bold">
                Architectural case studies
              </h2>
            </div>
            <Link
              href={pages.work.href}
              className="inline-flex min-h-11 items-center font-mono text-sm text-cyan hover:text-cyan-hover"
            >
              all case studies →
            </Link>
          </div>
          <ul className="grid gap-4 md:grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))]">
            {featured.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/work/${s.slug}`}
                  className="flex h-full flex-col gap-4 rounded-[14px] border border-line bg-slate p-7 transition-colors hover:border-line-strong hover:bg-charcoal"
                >
                  <span className="flex justify-between font-mono text-xs text-muted">
                    <span className="text-cyan">{s.id}</span>
                    {s.discipline}
                  </span>
                  <span className="text-[22px] leading-[1.25] font-bold tracking-[-0.02em]">
                    {s.title}
                  </span>
                  <span className="text-[15px] text-muted">{s.summary}</span>
                  <span className="mt-auto font-mono text-xs text-subtle">
                    {s.stack.slice(0, 3).join(" · ")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {liveTeasers.length > 0 && (
        <section aria-label="More about Pierce">
          <ul className="mx-auto grid max-w-[1240px] gap-4 px-6 pt-10 pb-28 md:grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))]">
            {liveTeasers.map((t) => (
              <li key={t.page.href}>
                <Link
                  href={t.page.href}
                  className="flex h-full flex-col gap-3.5 rounded-[14px] border border-line bg-charcoal p-8 transition-colors hover:border-line-strong"
                >
                  <Eyebrow n={next()} label={t.page.label} />
                  <span className="text-[26px] leading-[1.2] font-bold tracking-[-0.02em]">
                    {t.title}
                  </span>
                  <span className="text-muted">{t.body}</span>
                  <span className="font-mono text-sm text-cyan">{t.cta} →</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="intake-heading" className="border-t border-line bg-charcoal">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-8 px-6 py-22">
          <div className="flex max-w-[640px] flex-col gap-3">
            <Eyebrow n={next()} label="intake" />
            <h2
              id="intake-heading"
              className="text-[clamp(1.875rem,4vw,3rem)] leading-[1.05] font-bold tracking-[-0.03em]"
            >
              Hiring, or need a technologist on a project?
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {pages.contact.live && (
              <Link href={pages.contact.href} className={buttonClasses({})}>
                Initiate a connection
              </Link>
            )}
            {resume.live && (
              <a
                href={resume.path}
                download
                className={buttonClasses({ variant: pages.contact.live ? "secondary" : "primary" })}
              >
                Download resume
              </a>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
