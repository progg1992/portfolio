import { expect, test } from "@playwright/test";
import { routes } from "./routes";

// PTR-34. The suite runs a non-production build, so these check the shared
// tags and that previews stay out of search. scripts/check-seo.mjs covers the
// production build (indexable robots.txt, sitemap) in CI.
const pages = routes.filter((r) => r !== "/styleguide");

for (const route of pages) {
  test(`${route} has a title, description, canonical, and preview image`, async ({ page }) => {
    await page.goto(route);
    await expect(page).toHaveTitle(/Pierce Rogg/);
    const head = page.locator("head");
    await expect(head.locator('meta[name="description"]')).toHaveAttribute("content", /.{40,}/);
    // Next.js writes the home canonical as the bare origin, with no trailing slash.
    const canonical = route === "/" ? /^https?:\/\/[^/]+\/?$/ : new RegExp(`${route}$`);
    await expect(head.locator('link[rel="canonical"]')).toHaveAttribute("href", canonical);
    await expect(head.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      /opengraph-image/,
    );
    await expect(head.locator('meta[property="og:image:width"]')).toHaveAttribute(
      "content",
      "1200",
    );
    await expect(head.locator('meta[property="og:image:height"]')).toHaveAttribute(
      "content",
      "630",
    );
    await expect(head.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image",
    );
  });
}

test("previews and staging stay out of search", async ({ page, request }) => {
  await page.goto("/");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toMatch(/Disallow: \/\s*$/m);
  expect(robots).not.toContain("Sitemap:");
});

test("the home page carries Person structured data", async ({ page }) => {
  await page.goto("/");
  const json = JSON.parse(
    (await page.locator('script[type="application/ld+json"]').textContent()) ?? "{}",
  );
  expect(json["@type"]).toBe("Person");
  expect(json.name).toBe("Pierce Rogg");
  expect(json.jobTitle).toHaveLength(3);
  expect(json.sameAs).toEqual([
    "https://linkedin.com/in/pierce-rogg",
    "https://github.com/progg1992",
  ]);
});

test("the preview image is a 1200 by 630 PNG", async ({ request }) => {
  const res = await request.get("/opengraph-image.png");
  expect(res.status()).toBe(200);
  const buf = await res.body();
  expect(buf.readUInt32BE(16)).toBe(1200);
  expect(buf.readUInt32BE(20)).toBe(630);
});
