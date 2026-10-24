import { expect, test } from "@playwright/test";
import { pages } from "../src/lib/site";

// PTR-20 acceptance criteria.
test("the hero names Pierce, shows the title line, and links to the work", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Pierce Rogg");
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page.getByText("Available for leadership roles and consulting")).toBeVisible();
  const hero = page.getByRole("main").locator("section").first();
  await expect(hero.getByText("$150K", { exact: true })).toBeVisible();
  await expect(hero.getByText("$250K", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("main").getByRole("link", { name: "Read the case studies" }),
  ).toHaveAttribute("href", "/work");
  const contact = page.getByRole("link", { name: "Schedule a conversation" });
  await expect(contact).toHaveCount(pages.contact.live ? 1 : 0);
});

test("the topology is a labeled image", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("img", { name: /Network topology/ })).toBeVisible();
});

test("featured case studies come from the content model and link to their pages", async ({
  page,
}) => {
  await page.goto("/");
  const featured = page.getByRole("region", { name: "Architectural case studies" });
  const links = featured.getByRole("listitem").getByRole("link");
  await expect(links).toHaveCount(3);
  await expect(links.nth(0)).toHaveAttribute("href", "/work/bdos-v3");
  await expect(links.nth(0)).toContainText("146 canonical models across 14 domains");
});

test("section numbers run in order with no gaps", async ({ page }) => {
  await page.goto("/");
  const labels = await page.getByText(/^\d{2} \/ /).allTextContents();
  expect(labels.map((l) => l.slice(0, 2))).toEqual(
    labels.map((_, i) => String(i + 1).padStart(2, "0")),
  );
});

test("hero is two columns at desktop width and stacked below it", async ({ page, viewport }) => {
  await page.goto("/");
  const h1 = await page.getByRole("heading", { level: 1 }).boundingBox();
  const figure = await page.getByRole("img", { name: /Network topology/ }).boundingBox();
  if ((viewport?.width ?? 0) >= 1024) {
    expect(figure!.x).toBeGreaterThan(h1!.x + h1!.width / 2);
  } else {
    expect(figure!.y).toBeGreaterThan(h1!.y + h1!.height);
  }
});
