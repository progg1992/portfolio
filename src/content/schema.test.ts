import { describe, expect, it } from "vitest";
import { assertUnique, parseCaseStudyMeta, type CaseStudyMeta } from "./schema";

const valid: CaseStudyMeta = {
  id: "CS-09",
  slug: "sample-study",
  title: "Sample study",
  subheading: "A subheading",
  summary: "A one-line summary.",
  discipline: "operations",
  stack: ["Linux"],
  context: "Example Co., 2024 to 2025",
  problem: "A problem.",
  solution: "A solution.",
  impact: "An impact.",
  metrics: [{ value: "25%", label: "fewer delays", source: "Example Co., 2024 to 2025" }],
  exhibit: "none",
  order: 9,
  featured: false,
  published: true,
};

describe("parseCaseStudyMeta", () => {
  it("accepts a complete, valid case study", () => {
    expect(parseCaseStudyMeta("sample-study.mdx", valid)).toEqual(valid);
  });

  it("fails a metric with no source, naming the file and the field (CNT-01)", () => {
    const meta = { ...valid, metrics: [{ value: "25%", label: "fewer delays" }] };
    expect(() => parseCaseStudyMeta("sample-study.mdx", meta)).toThrow(
      /sample-study\.mdx[\s\S]*metrics\.0\.source/,
    );
  });

  it("fails a metric whose source is blank", () => {
    const meta = { ...valid, metrics: [{ ...valid.metrics[0], source: "   " }] };
    expect(() => parseCaseStudyMeta("sample-study.mdx", meta)).toThrow(
      /metric source cannot be empty/,
    );
  });

  it("fails when meta is missing entirely", () => {
    expect(() => parseCaseStudyMeta("sample-study.mdx", undefined)).toThrow(/sample-study\.mdx/);
  });

  it("fails an unknown discipline", () => {
    expect(() => parseCaseStudyMeta("sample-study.mdx", { ...valid, discipline: "sales" })).toThrow(
      /discipline/,
    );
  });

  it("fails unknown fields, so typos do not pass silently", () => {
    expect(() => parseCaseStudyMeta("sample-study.mdx", { ...valid, publshed: true })).toThrow();
  });

  it("fails when the file name does not match the slug", () => {
    expect(() => parseCaseStudyMeta("other-name.mdx", valid)).toThrow(/must match its slug/);
  });

  it("fails a malformed id", () => {
    expect(() => parseCaseStudyMeta("sample-study.mdx", { ...valid, id: "CS-9" })).toThrow(/id/);
  });
});

describe("assertUnique", () => {
  it("passes distinct studies", () => {
    expect(() =>
      assertUnique([valid, { ...valid, id: "CS-10", slug: "other", order: 10 }]),
    ).not.toThrow();
  });

  for (const key of ["id", "slug", "order"] as const) {
    it(`fails two studies with the same ${key}`, () => {
      const other = { ...valid, id: "CS-10", slug: "other", order: 10, [key]: valid[key] };
      expect(() => assertUnique([valid, other])).toThrow(new RegExp(`same ${key}`));
    });
  }
});
