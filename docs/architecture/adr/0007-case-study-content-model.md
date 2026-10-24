# ADR 0007: MDX case studies with schema-validated metadata

- **Status:** Accepted
- **Date:** 2026-10-19
- **Issue:** PTR-48, CR-1 (PTR-46)

## Context

Case studies are the core of the site, and the Client must be able to add one without paying for a rebuild. Every figure must have a source (content requirement CNT-01), and that rule should be enforced by the build, not by memory.

## Decision

- Each case study is one MDX file in `src/content/work/`.
- The file exports a `meta` object instead of YAML frontmatter. `@next/mdx` supports JS exports natively, so no frontmatter plugin is needed.
- `meta` is validated at build time with a Zod schema (`src/content/schema.ts`): id, slug, title, subheading, summary, discipline, stack, context, problem, solution, impact, metrics, exhibit type, order, featured, and published.
- Every metric requires a `source` field. A metric without one fails the build with a message naming the file and the field.
- The metadata load is cached with `"use cache"`, which Cache Components requires for the directory read to be part of the static output. The MDX body is imported separately, because a component cannot be serialized into the cache.
- File names must match slugs; ids, slugs, and order values must be unique.
- One template renders every study at `/work/[slug]`, and the same data feeds the `/work` index and the home page teasers.

## Consequences

- Adding a case study is one file and one pull request.
- An unsourced or malformed claim cannot reach production.
- `published: false` hides a study everywhere without deleting it.
- No CMS: content edits go through Git, which suits a technical Client and keeps the audit trail.
