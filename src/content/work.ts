import "server-only";
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import type { ComponentType } from "react";
import { assertUnique, parseCaseStudyMeta, type CaseStudyMeta } from "./schema";

const DIR = join(process.cwd(), "src/content/work");

/**
 * Reads and validates every case study's meta in src/content/work. Files
 * starting with "_" are templates and are skipped.
 *
 * Cached with "use cache" so Cache Components can prerender pages that use it:
 * the directory read is I/O, and only cached I/O can be part of the static shell.
 * The result is plain data, which is what the cache can serialize.
 */
async function loadAllMeta(): Promise<CaseStudyMeta[]> {
  "use cache";
  const files = (await readdir(DIR)).filter((f) => f.endsWith(".mdx") && !f.startsWith("_"));
  const metas = await Promise.all(
    files.map(async (file) => {
      const mod: { meta?: unknown } = await import(
        `@/content/work/${file.replace(/\.mdx$/, "")}.mdx`
      );
      return parseCaseStudyMeta(file, mod.meta);
    }),
  );
  assertUnique(metas);
  return metas.sort((a, b) => a.order - b.order);
}

/** Published case studies, in display order. */
export async function getCaseStudies(): Promise<CaseStudyMeta[]> {
  return (await loadAllMeta()).filter((s) => s.published);
}

/** Published case studies marked featured, for the home page. */
export async function getFeaturedCaseStudies(): Promise<CaseStudyMeta[]> {
  return (await getCaseStudies()).filter((s) => s.featured);
}

export async function getCaseStudy(slug: string): Promise<CaseStudyMeta | undefined> {
  return (await getCaseStudies()).find((s) => s.slug === slug);
}

/** The rendered MDX body of a published case study. Call after getCaseStudy confirms the slug. */
export async function getCaseStudyBody(slug: string): Promise<ComponentType> {
  const mod: { default: ComponentType } = await import(`@/content/work/${slug}.mdx`);
  return mod.default;
}
