import { z } from "zod";

/**
 * The case study content model (ADR 0007, PTR-48).
 * Every case study file exports `meta` in this shape. The build fails on
 * anything that does not match, including a metric without a source (CNT-01).
 */

export const disciplines = ["infrastructure", "operations", "delivery", "documentation"] as const;

const text = (field: string, max: number) =>
  z
    .string({ error: `${field} is required` })
    .trim()
    .min(1, `${field} cannot be empty`)
    .max(max, `${field} must be ${max} characters or fewer`);

export const metricSchema = z.object({
  /** As displayed: "$250K", "-25%", "146". */
  value: text("metric value", 12),
  label: text("metric label", 80),
  /** Employer or project, and dates. Required on every figure (CNT-01). */
  source: text("metric source", 160),
});

export const caseStudySchema = z
  .object({
    id: z.string().regex(/^CS-\d{2}$/, 'id must look like "CS-01"'),
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be lowercase words joined by hyphens"),
    title: text("title", 90),
    subheading: text("subheading", 120),
    /** One line for cards and the home page teaser. */
    summary: text("summary", 160),
    discipline: z.enum(disciplines),
    stack: z.array(text("stack item", 40)).min(1, "stack needs at least one item").max(6),
    /** Where the work happened and when, as shown on the page. */
    context: text("context", 120),
    problem: text("problem", 600),
    solution: text("solution", 800),
    impact: text("impact", 600),
    metrics: z.array(metricSchema).max(4),
    order: z.number().int().positive(),
    featured: z.boolean(),
    published: z.boolean(),
  })
  .strict();

export type Metric = z.infer<typeof metricSchema>;
export type CaseStudyMeta = z.infer<typeof caseStudySchema>;

/**
 * Validates one file's exported meta. Throws an error that names the file and
 * every failing field, so a bad case study stops the build with a fix-it message.
 */
export function parseCaseStudyMeta(file: string, meta: unknown): CaseStudyMeta {
  const result = caseStudySchema.safeParse(meta);
  if (!result.success) {
    const problems = result.error.issues
      .map((issue) => `  - ${issue.path.join(".") || "(meta)"}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid case study in ${file}:\n${problems}`);
  }
  const expected = `${result.data.slug}.mdx`;
  if (file !== expected) {
    throw new Error(`Invalid case study in ${file}: file name must match its slug (${expected})`);
  }
  return result.data;
}

/** Cross-file checks: ids, slugs, and order values must each be unique. */
export function assertUnique(studies: CaseStudyMeta[]): void {
  for (const key of ["id", "slug", "order"] as const) {
    const seen = new Map<string | number, string>();
    for (const s of studies) {
      const other = seen.get(s[key]);
      if (other)
        throw new Error(`Case studies ${other} and ${s.slug} share the same ${key}: ${s[key]}`);
      seen.set(s[key], s.slug);
    }
  }
}
