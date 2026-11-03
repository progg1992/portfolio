import { expect, test } from "@playwright/test";

// PTR-22: one template renders every case study.
const studies = [
  { slug: "incident-response", id: "CS-02", firstMetric: "3" },
  { slug: "distributed-delivery", id: "CS-03", firstMetric: "-25%" },
  { slug: "building-bluedevildev", id: "CS-01", firstMetric: "111" },
];

for (const s of studies) {
  test(`${s.id} renders every part of the template`, async ({ page }) => {
    await page.goto(`/work/${s.slug}`);
    await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toContainText(s.slug);
    await expect(page.getByText(s.id, { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    for (const part of ["01 problem", "02 solution", "03 impact"]) {
      await expect(page.getByRole("heading", { name: part })).toBeVisible();
    }
    const figures = page.getByRole("region", { name: "Key figures" });
    await expect(figures.locator("dd").first()).toHaveText(s.firstMetric);
    await expect(page.getByRole("heading", { name: "sources" })).toBeVisible();
    await expect(
      page.getByRole("navigation", { name: "More case studies" }).getByRole("link"),
    ).toHaveCount(2);
  });
}

test("previous and next follow the content order", async ({ page }) => {
  await page.goto("/work/incident-response");
  const more = page.getByRole("navigation", { name: "More case studies" });
  await expect(more.getByRole("link").first()).toHaveAttribute(
    "href",
    "/work/building-bluedevildev",
  );
  await expect(more.getByRole("link").last()).toHaveAttribute("href", "/work/distributed-delivery");
});

test("each case study has its own title and description", async ({ page }) => {
  await page.goto("/work/building-bluedevildev");
  await expect(page).toHaveTitle(
    "Building bluedevildev.com: a company site that runs the business | Pierce Rogg",
  );
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /The Blue Devil Development platform/,
  );
});

test("exhibits render as real text", async ({ page }) => {
  await page.goto("/work/building-bluedevildev");
  await expect(page.getByText("exhibit: lead intake")).toBeVisible();
  await expect(page.locator("figure pre").first()).toContainText("find or create contact");
  await page.goto("/work/incident-response");
  await expect(page.locator("figure ol li")).toHaveCount(4);
});

test("the withdrawn BDOS v3 link lands on the work index", async ({ page }) => {
  await page.goto("/work/bdos-v3");
  await expect(page).toHaveURL(/\/work$/);
});
