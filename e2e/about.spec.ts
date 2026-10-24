import { expect, test } from "@playwright/test";

// PTR-23 acceptance criteria.
test("credentials match the resume and the Client's decisions", async ({ page }) => {
  await page.goto("/about");
  const main = page.getByRole("main");
  await expect(
    main.getByRole("heading", { name: "M.S. Computer Information Systems" }),
  ).toBeVisible();
  await expect(main).toContainText("Colorado State University · in progress");
  await expect(main).not.toContainText("2027 · Colorado");
  await expect(main).not.toContainText("May 2027");
  await expect(main).toContainText("Project Management");
  await expect(main).toContainText("Artificial Intelligence and Business Transformation");
  await expect(main).toContainText(
    "B.S. Technology Management, Herzing University, 2024, cum laude",
  );
  await expect(main).toContainText("IT Essentials certificate, DeVry University, 2022");
  await expect(main).toContainText("Coding bootcamp, Michigan State University, 2021");
  await expect(main).toContainText("CompTIA A+ · expected Jan 2027");
  await expect(main).not.toContainText("Network+");
  await expect(main).not.toContainText("Security+");
});

test("the story is first person and the governance card is present", async ({ page }) => {
  await page.goto("/about");
  await expect(page.getByText(/^I came up writing code/)).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "AI ethics, governance, and SOP development" }),
  ).toBeVisible();
});

test("the home page links to about from its teaser", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /From the Upper Peninsula/ }).click();
  await expect(page).toHaveURL(/\/about$/);
});
