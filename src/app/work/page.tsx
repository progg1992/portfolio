import type { Metadata } from "next";
import { WorkIndex } from "@/components/work/work-index";
import { getCaseStudies } from "@/content/work";

// Work index (PTR-26). Cards come from the content model (ADR 0007); the
// discipline filter runs in the browser so the route stays static (ADR 0001).

export const metadata: Metadata = {
  title: "Work",
  description:
    "Case studies in infrastructure, operations, delivery, and documentation, each with sourced figures.",
};

export default async function WorkPage() {
  const studies = (await getCaseStudies()).map(
    ({ id, slug, title, subheading, discipline, stack, metrics }) => ({
      id,
      slug,
      title,
      subheading,
      discipline,
      stack,
      metrics: metrics.slice(0, 1),
    }),
  );

  return (
    <div className="mx-auto flex max-w-[1040px] flex-col gap-12 px-6 pt-18 pb-22">
      <header className="flex flex-col gap-4">
        <p className="font-mono text-[13px] text-purple-text">~/work</p>
        <h1 className="text-[clamp(2.375rem,5.4vw,4.25rem)] leading-[1.02] font-bold tracking-[-0.04em]">
          Case studies
        </h1>
        <p className="max-w-[640px] text-xl text-muted">
          Each one written as problem, solution, and impact, with the source behind every number.
        </p>
      </header>
      <WorkIndex studies={studies} />
    </div>
  );
}
