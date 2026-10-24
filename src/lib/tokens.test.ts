import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { contrastRatio } from "./contrast";

// Read tokens straight from the stylesheet so this test cannot drift from it.
const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");
const color = (name: string): string => {
  const match = css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6});`));
  if (!match) throw new Error(`Token --color-${name} not found in globals.css`);
  return match[1];
};

const surfaces = ["obsidian", "charcoal", "slate"] as const;

// Every token used for text, against every surface it can sit on.
const textTokens = ["ink", "muted", "subtle", "cyan", "purple-text", "ok", "warn", "error"];

describe("text contrast (WCAG 1.4.3, 4.5:1)", () => {
  for (const fg of textTokens) {
    for (const bg of surfaces) {
      it(`${fg} on ${bg}`, () => {
        expect(contrastRatio(color(fg), color(bg))).toBeGreaterThanOrEqual(4.5);
      });
    }
  }

  it("obsidian text on a cyan button, in every button state", () => {
    for (const fill of ["cyan", "cyan-hover", "cyan-active"]) {
      expect(contrastRatio(color("obsidian"), color(fill))).toBeGreaterThanOrEqual(4.5);
    }
  });
});

describe("non-text contrast (WCAG 1.4.11, 3:1)", () => {
  for (const bg of surfaces) {
    it(`form control border on ${bg}`, () => {
      expect(contrastRatio(color("control"), color(bg))).toBeGreaterThanOrEqual(3);
    });
    it(`focus ring on ${bg}`, () => {
      expect(contrastRatio(color("cyan"), color(bg))).toBeGreaterThanOrEqual(3);
    });
  }
});

describe("documented deviations from the brief", () => {
  it("#71717A fails text contrast, which is why subtle replaced it", () => {
    expect(contrastRatio("#71717a", color("slate"))).toBeLessThan(4.5);
  });
  it("#A855F7 fails text contrast on slate, which is why purple-text exists", () => {
    expect(contrastRatio(color("purple"), color("slate"))).toBeLessThan(4.5);
  });
});
