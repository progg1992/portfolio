import { expect, test } from "@playwright/test";
import { roles } from "../src/content/experience";
import { resume } from "../src/lib/site";

// PTR-49 acceptance criteria.
test("the role timeline is an ordered list, newest first, with machine-readable dates", async ({
  page,
}) => {
  await page.goto("/experience");
  const timeline = page.getByRole("region", { name: "Role history" }).locator("ol").first();
  const items = timeline.locator(":scope > li");
  await expect(items).toHaveCount(roles.length);
  await expect(items.first().getByRole("heading", { level: 3 })).toHaveText("Founder and CEO");
  await expect(items.first().locator("time")).toHaveAttribute("datetime", "2025");
  await expect(items.first()).toContainText("to present");
  const starts = await timeline
    .locator(":scope > li > p:first-child time:first-child")
    .evaluateAll((els) => els.map((e) => Number(e.getAttribute("datetime"))));
  expect(starts).toEqual([...starts].sort((a, b) => b - a));
});

test("figures appear with the role they came from", async ({ page }) => {
  await page.goto("/experience");
  const bice = page.getByRole("listitem").filter({ hasText: "Certified Bice Ltd." }).first();
  await expect(bice).toContainText("$150,000");
  await expect(bice).toContainText("$250,000");
  const twin = page.getByRole("listitem").filter({ hasText: "Twin Designs and Tech" }).first();
  await expect(twin).toContainText("25%");
});

test("the infrastructure record shows the systems and the operations figures", async ({ page }) => {
  await page.goto("/experience");
  const record = page.getByRole("region", { name: "Systems I have run" });
  for (const name of ["Windows Server", "Ubuntu Linux", "Docker", "VMware", "Hyper-V", "pfSense"]) {
    await expect(record.getByText(name, { exact: true })).toBeVisible();
  }
  for (const v of ["$150K", "-25%", "NIST"]) {
    await expect(record.getByText(v, { exact: true })).toBeVisible();
  }
});

test("skills render as grouped tags", async ({ page }) => {
  await page.goto("/experience");
  const skills = page.getByRole("region", { name: "Areas of expertise" });
  await expect(skills.getByRole("heading", { level: 3 })).toHaveCount(4);
  await expect(skills.getByText("Active Directory", { exact: true })).toBeVisible();
});

test("the resume download appears at the top and bottom", async ({ page }) => {
  test.skip(!resume.live, "resume not live");
  await page.goto("/experience");
  const links = page.getByRole("main").getByRole("link", { name: "Download resume" });
  await expect(links).toHaveCount(2);
  for (const l of await links.all()) await expect(l).toHaveAttribute("href", resume.path);
});

test("the home page links to experience from its teaser", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Operations first, development second/ }).click();
  await expect(page).toHaveURL(/\/experience$/);
});
