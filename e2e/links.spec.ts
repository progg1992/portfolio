import { expect, test } from "@playwright/test";
import { routes } from "./routes";

// Every internal link on every page must resolve. A link to a page that does not
// exist yet is a broken link, and Next.js prefetching also logs it as a console
// 404, which fails the Lighthouse Best Practices budget (PTR-15).
test("every internal link on every page returns 200", async ({ page, request }) => {
  const checked = new Map<string, number>();
  for (const route of routes) {
    await page.goto(route);
    const hrefs = await page
      .locator("a[href]")
      .evaluateAll((links) => links.map((a) => a.getAttribute("href") ?? ""));
    for (const href of hrefs) {
      if (!href.startsWith("/") || href.startsWith("//")) continue;
      const path = href.split("#")[0] || route;
      if (checked.has(path)) continue;
      checked.set(path, (await request.get(path)).status());
    }
  }
  const broken = [...checked].filter(([, status]) => status !== 200);
  expect(broken, "internal links that do not return 200").toEqual([]);
  expect(checked.size).toBeGreaterThan(0);
});
