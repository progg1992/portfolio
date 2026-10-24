import { expect, test } from "@playwright/test";

// PTR-26 acceptance criteria.
const cards = (page: import("@playwright/test").Page) =>
  page.getByRole("main").getByRole("article");

test("one card per published case study, linking to its page", async ({ page }) => {
  await page.goto("/work");
  await expect(cards(page)).toHaveCount(3);
  const first = cards(page).first();
  await expect(first).toContainText("CS-01");
  await expect(first).toContainText("146");
  await expect(first.getByRole("link")).toHaveAttribute("href", "/work/bdos-v3");
  await first.getByRole("link").click();
  await expect(page).toHaveURL(/\/work\/bdos-v3$/);
});

test("filtering sets aria-pressed, the URL, and the status count", async ({ page }) => {
  await page.goto("/work");
  const group = page.getByRole("group", { name: "Filter by discipline" });
  const all = group.getByRole("button", { name: "all" });
  const docs = group.getByRole("button", { name: "documentation" });
  await expect(all).toHaveAttribute("aria-pressed", "true");

  await docs.click();
  await expect(docs).toHaveAttribute("aria-pressed", "true");
  await expect(all).toHaveAttribute("aria-pressed", "false");
  await expect(page).toHaveURL(/\/work\?d=documentation$/);
  await expect(cards(page)).toHaveCount(1);
  await expect(page.getByRole("status")).toHaveText("1 of 3 case studies in Documentation");

  await docs.click();
  await expect(page).toHaveURL(/\/work$/);
  await expect(cards(page)).toHaveCount(3);
});

test("a shared filtered URL opens filtered", async ({ page }) => {
  await page.goto("/work?d=delivery");
  await expect(cards(page)).toHaveCount(1);
  await expect(page.getByRole("button", { name: "delivery" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});

test("an unknown filter value shows everything", async ({ page }) => {
  await page.goto("/work?d=nonsense");
  await expect(cards(page)).toHaveCount(3);
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("every card shows and links work, even with a filter in the URL", async ({ page }) => {
    await page.goto("/work?d=delivery");
    await expect(cards(page)).toHaveCount(3);
    await cards(page).nth(1).getByRole("link").click();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page).toHaveURL(/\/work\/[a-z-]+$/);
  });
});
