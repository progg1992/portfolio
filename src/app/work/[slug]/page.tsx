import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCaseStudies, getCaseStudy, getCaseStudyBody } from "@/content/work";

// Skeleton renderer added with the content model (PTR-48) so the build proves
// every case study compiles and validates. The full template is PTR-22.

export async function generateStaticParams() {
  return (await getCaseStudies()).map((s) => ({ slug: s.slug }));
}

// Cache Components does not allow `dynamicParams`. Unknown slugs render on
// request and the page calls notFound(), so they return 404 (FR-10).

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const study = await getCaseStudy((await params).slug);
  return study ? { title: study.title, description: study.summary } : {};
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const study = await getCaseStudy((await params).slug);
  if (!study) notFound();
  const Body = await getCaseStudyBody(study.slug);

  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <p className="font-mono text-sm text-cyan">
        {study.id} <span className="text-subtle">· {study.discipline}</span>
      </p>
      <h1 className="mt-4 text-heading font-bold">{study.title}</h1>
      <p className="mt-4 text-lg text-muted">{study.subheading}</p>
      <p className="mt-2 font-mono text-xs text-subtle">{study.context}</p>
      <article className="mt-8">
        <Body />
      </article>
    </main>
  );
}
