import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Tag } from "@/components/ui/tag";
import { getCaseStudies, getCaseStudy, getCaseStudyBody } from "@/content/work";

// Case study template (PTR-22). One template renders every study in
// src/content/work; no study has hand-built page code (ADR 0007).

export async function generateStaticParams() {
  return (await getCaseStudies()).map((s) => ({ slug: s.slug }));
}

// Cache Components does not allow `dynamicParams`. Unknown slugs render on
// request and the page calls notFound(); the root layout's ensureStatic makes
// that a real 404 (ADR 0001).

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const study = await getCaseStudy((await params).slug);
  if (!study) return {};
  return {
    title: study.title,
    description: study.summary,
    openGraph: { title: study.title, description: study.summary, type: "article" },
  };
}

const parts = [
  { key: "problem", label: "01 problem", color: "text-error" },
  { key: "solution", label: "02 solution", color: "text-cyan" },
  { key: "impact", label: "03 impact", color: "text-ok" },
] as const;

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const study = await getCaseStudy(slug);
  if (!study) notFound();

  const [Body, all] = await Promise.all([getCaseStudyBody(study.slug), getCaseStudies()]);
  const index = all.findIndex((s) => s.slug === study.slug);
  const previous = index > 0 ? all[index - 1] : undefined;
  const next = index < all.length - 1 ? all[index + 1] : undefined;
  const sources = [...new Set(study.metrics.map((m) => m.source))];

  return (
    <article>
      <header className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-72 -left-60 size-[820px] bg-[radial-gradient(closest-side,rgb(168_85_247/0.12),transparent)]"
        />
        <div className="relative mx-auto flex max-w-[1040px] flex-col gap-6 px-6 pt-18 pb-16">
          <nav aria-label="Breadcrumb" className="font-mono text-[13px] text-subtle">
            <ol className="flex gap-2">
              <li>
                <Link href="/work" className="text-muted hover:text-ink">
                  ~/work
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">{study.slug}</li>
            </ol>
          </nav>
          <p className="flex gap-3 font-mono text-[13px]">
            <span className="text-cyan">{study.id}</span>
            <span className="text-muted">{study.discipline}</span>
          </p>
          <h1 className="text-[clamp(2.375rem,5.4vw,4.25rem)] leading-[1.02] font-bold tracking-[-0.04em]">
            {study.title}
          </h1>
          <p className="max-w-[720px] text-xl text-muted">{study.subheading}</p>
          <ul className="flex flex-wrap gap-2" aria-label="Stack">
            {study.stack.map((item) => (
              <li key={item}>
                <Tag>{item}</Tag>
              </li>
            ))}
          </ul>
        </div>
      </header>

      <section aria-label="Key figures" className="border-b border-line bg-charcoal">
        <dl className="mx-auto grid max-w-[1040px] grid-cols-[repeat(auto-fit,minmax(200px,1fr))] px-6">
          {study.metrics.map((m) => (
            <div key={m.label} className="py-7 pr-6">
              <dt className="font-mono text-xs text-subtle">{m.label}</dt>
              <dd className="mt-1.5 font-mono text-4xl leading-none font-semibold text-cyan">
                {m.value}
              </dd>
            </div>
          ))}
          <div className="py-7">
            <dt className="font-mono text-xs text-subtle">where</dt>
            <dd className="mt-1.5 text-lg leading-snug font-semibold">{study.context}</dd>
          </div>
        </dl>
      </section>

      <div className="mx-auto flex max-w-[1040px] flex-col gap-16 px-6 py-22">
        <section
          aria-label="Problem, solution, and impact"
          className="grid gap-4 md:grid-cols-[repeat(auto-fit,minmax(280px,1fr))]"
        >
          {parts.map(({ key, label, color }) => (
            <div
              key={key}
              className="flex flex-col gap-3 rounded-xl border border-line bg-slate p-7"
            >
              <h2 className={`font-mono text-[13px] font-medium ${color}`}>{label}</h2>
              <p className="text-base text-muted">{study[key]}</p>
            </div>
          ))}
        </section>

        <div className="max-w-[760px]">
          <Body />
        </div>

        <section
          aria-labelledby="sources-heading"
          className="flex flex-col gap-3 rounded-xl border border-dashed border-line-strong px-7 py-6"
        >
          <h2 id="sources-heading" className="font-mono text-[13px] font-medium text-muted">
            sources
          </h2>
          <ul className="flex flex-col gap-1 text-[15px] text-muted">
            {sources.map((source) => (
              <li key={source}>{source}</li>
            ))}
          </ul>
        </section>
      </div>

      <nav aria-label="More case studies" className="border-t border-line">
        <ul className="mx-auto grid max-w-[1040px] gap-4 px-6 pt-10 pb-22 sm:grid-cols-2">
          <li>
            <Link
              href={previous ? `/work/${previous.slug}` : "/work"}
              className="flex h-full flex-col gap-1.5 rounded-xl border border-line p-6 hover:border-line-strong hover:bg-charcoal"
            >
              <span className="font-mono text-xs text-subtle">
                {previous ? `previous: ${previous.id}` : "all case studies"}
              </span>
              <span className="text-lg font-semibold">{previous ? previous.title : "~/work"}</span>
            </Link>
          </li>
          <li>
            <Link
              href={next ? `/work/${next.slug}` : "/work"}
              className="flex h-full flex-col gap-1.5 rounded-xl border border-line p-6 text-right hover:border-line-strong hover:bg-charcoal"
            >
              <span className="font-mono text-xs text-subtle">
                {next ? `next: ${next.id}` : "all case studies"}
              </span>
              <span className="text-lg font-semibold">{next ? next.title : "~/work"}</span>
            </Link>
          </li>
        </ul>
      </nav>
    </article>
  );
}
