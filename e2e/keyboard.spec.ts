import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { routes } from "./routes";

// PTR-31: the automated part of the accessibility audit. Screen reader passes
// are manual (docs/testing/screen-reader-script.md).

// Elements with tabindex="-1" (inactive terminal tabs, roving tabindex) are
// reachable with arrow keys, not Tab, by design (WAI-ARIA tabs pattern).
const tabbable =
  ':is(a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select, textarea, [tabindex]):not([tabindex="-1"])';

/** Tabs until focus returns to the start, recording each stop. */
async function tabThrough(page: Page, limit = 120) {
  const stops: { id: string; visible: boolean; ring: boolean }[] = [];
  for (let i = 0; i < limit; i++) {
    await page.keyboard.press("Tab");
    const stop = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body) return null;
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      // A focus indicator: the global outline, a box shadow, or (for the card
      // pattern) a focus-within border on the card that contains the link.
      const ring =
        (s.outlineStyle !== "none" && parseFloat(s.outlineWidth) > 0) ||
        s.boxShadow !== "none" ||
        !!el.closest('[class*="focus-within:"]');
      const label = (el.getAttribute("aria-label") || el.textContent || el.tagName)
        .trim()
        .slice(0, 40);
      return {
        id: `${el.tagName.toLowerCase()}:${label}`,
        visible: r.width > 0 && r.height > 0,
        ring,
      };
    });
    if (!stop) break; // focus left the page content: the cycle is complete
    if (stops.length && stop.id === stops[0].id) break;
    stops.push(stop);
  }
  return stops;
}

for (const route of routes.filter((r) => r !== "/styleguide")) {
  test(`${route}: every control is reachable by keyboard with a visible focus indicator`, async ({
    page,
  }) => {
    await page.goto(route);
    const expected = await page.locator(tabbable).evaluateAll(
      (els) =>
        els.filter((el) => {
          const r = (el as HTMLElement).getBoundingClientRect();
          const hidden = getComputedStyle(el).visibility === "hidden";
          return r.width > 0 && r.height > 0 && !hidden && !el.closest("[aria-hidden='true']");
        }).length,
    );
    const stops = await tabThrough(page);
    expect(stops.length, "tab stops vs visible tabbable elements").toBeGreaterThanOrEqual(expected);
    const noRing = stops.filter((s) => s.visible && !s.ring).map((s) => s.id);
    expect(noRing, "focused elements without a visible focus indicator").toEqual([]);
    const invisible = stops.filter((s) => !s.visible).map((s) => s.id);
    expect(invisible, "focus landed on something not visible").toEqual([]);
  });
}

test("focus never gets stuck: Shift+Tab walks back to the skip link", async ({ page }) => {
  await page.goto("/contact");
  for (let i = 0; i < 12; i++) await page.keyboard.press("Tab");
  for (let i = 0; i < 40; i++) {
    const atSkip = await page.evaluate(
      () => document.activeElement?.textContent === "Skip to content",
    );
    if (atSkip) break;
    await page.keyboard.press("Shift+Tab");
  }
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
});

// WCAG 1.4.10 Reflow: 320 CSS px, and 1280 px at 200% zoom (640 CSS px).
for (const width of [320, 640]) {
  test.describe(`reflow at ${width} px`, () => {
    test.use({ viewport: { width, height: 800 } });
    for (const route of routes) {
      test(`${route} has no horizontal scroll`, async ({ page }) => {
        await page.goto(route);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow).toBeLessThanOrEqual(0);
      });
    }
  });
}

// axe in states the page-load scan never sees. Waits for running animations
// (the 160 ms panel fade) to finish, so contrast is measured at rest.
const axe = async (page: Page) => {
  await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished)));
  return new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze()
    .then((r) =>
      r.violations
        .filter((v) => v.impact === "critical" || v.impact === "serious")
        .map((v) => `${v.id}: ${v.help}`),
    );
};

test("interactive states have no critical or serious axe findings", async ({ page, isMobile }) => {
  await page.goto("/");
  if (isMobile) {
    await page.getByRole("button", { name: "Open menu" }).click();
    expect(await axe(page), "mobile menu open").toEqual([]);
    await page.keyboard.press("Escape");
  }
  await page.getByRole("tab", { name: "~/leadership" }).click();
  expect(await axe(page), "terminal on leadership").toEqual([]);

  await page.goto("/work?d=infrastructure");
  expect(await axe(page), "work filtered").toEqual([]);

  await page.goto("/contact");
  await page.getByRole("button", { name: "Send message" }).click();
  expect(await axe(page), "contact form with errors").toEqual([]);

  await page.goto("/no-such-page");
  expect(await axe(page), "404").toEqual([]);
});
