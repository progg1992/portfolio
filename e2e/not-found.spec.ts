import { expect, test } from "@playwright/test";

// FR-10 and FR-19: an unknown case study slug returns a real 404, not a 200 or a 500.
test("unknown case study slug returns 404", async ({ request }) => {
  const response = await request.get("/work/does-not-exist");
  expect(response.status()).toBe(404);
});

test("unknown route returns 404", async ({ request }) => {
  const response = await request.get("/no-such-page");
  expect(response.status()).toBe(404);
});

test("the 404 page reads as a terminal error and links home, work, and contact", async ({
  page,
}) => {
  const response = await page.goto("/no-such-page");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("404: route not found");
  const main = page.getByRole("main");
  await expect(main.getByRole("link", { name: "~/home" })).toHaveAttribute("href", "/");
  await expect(main.getByRole("link", { name: "~/work" })).toHaveAttribute("href", "/work");
  await expect(main.getByRole("link", { name: "~/contact" })).toHaveAttribute("href", "/contact");
  await expect(page.getByRole("banner")).toBeVisible();
  await expect(page.getByRole("contentinfo")).toBeVisible();
});
