import { expect, test } from "@playwright/test";
import { analytics } from "../src/lib/site";

// PTR-50: the privacy page states what the form collects, where it goes,
// how long it is kept, the analytics setup as it actually is, and deletion.
test("privacy covers the form, retention, analytics, and deletion", async ({ page }) => {
  await page.goto("/privacy");
  const main = page.getByRole("main");
  await expect(main).toContainText(
    "name, your email address, the reason you picked, and your message",
  );
  await expect(main).toContainText("Resend");
  await expect(main).toContainText("30 days");
  await expect(main.getByRole("heading", { name: "Questions about your data" })).toBeVisible();
  await expect(main).not.toContainText("I will delete");
  if (analytics.live) {
    await expect(main).toContainText("Vercel Web Analytics");
  } else {
    await expect(main).toContainText("runs no analytics");
  }
});

test("the page tells the truth about cookies", async ({ page, context }) => {
  await page.goto("/privacy");
  await expect(page.getByRole("main")).toContainText("sets no cookies");
  for (const path of ["/", "/work", "/contact"]) await page.goto(path);
  expect(await context.cookies()).toEqual([]);
});

test("footer and contact form link to privacy", async ({ page }) => {
  await page.goto("/contact");
  await expect(
    page.getByRole("contentinfo").getByRole("link", { name: "privacy" }),
  ).toHaveAttribute("href", "/privacy");
  await expect(page.getByRole("main").getByRole("link", { name: "Privacy" })).toHaveAttribute(
    "href",
    "/privacy",
  );
});
