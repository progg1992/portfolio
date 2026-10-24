import { expect, test } from "@playwright/test";

// PTR-21 (content and layout) and PTR-25 (keyboard tabs).
const terminal = (page: import("@playwright/test").Page) =>
  page.getByRole("region", { name: "What I run, deliver, and lead" });

test("tabs follow the WAI-ARIA pattern and only the selected tab is tabbable", async ({ page }) => {
  await page.goto("/");
  const list = terminal(page).getByRole("tablist", { name: "Terminal views" });
  const tabs = list.getByRole("tab");
  await expect(tabs).toHaveCount(3);
  await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");
  await expect(tabs.nth(0)).toHaveAttribute("tabindex", "0");
  await expect(tabs.nth(1)).toHaveAttribute("tabindex", "-1");
  for (let i = 0; i < 3; i++) {
    const controls = await tabs.nth(i).getAttribute("aria-controls");
    await expect(page.locator(`#${controls}`)).toHaveAttribute("role", "tabpanel");
  }
});

test("arrow keys, Home, and End move selection and update the prompt", async ({ page }) => {
  await page.goto("/");
  const t = terminal(page);
  const tab = (name: string) => t.getByRole("tab", { name });
  await tab("~/infrastructure").focus();

  await page.keyboard.press("ArrowRight");
  await expect(tab("~/operations")).toBeFocused();
  await expect(tab("~/operations")).toHaveAttribute("aria-selected", "true");
  await expect(t.getByText("$ cat metrics.log")).toBeVisible();
  await expect(t.getByRole("tabpanel")).toContainText("$150K");

  await page.keyboard.press("End");
  await expect(tab("~/leadership")).toBeFocused();
  await expect(t.getByText("$ whoami --team")).toBeVisible();

  await page.keyboard.press("ArrowRight");
  await expect(tab("~/infrastructure")).toBeFocused();

  await page.keyboard.press("ArrowLeft");
  await expect(tab("~/leadership")).toBeFocused();

  await page.keyboard.press("Home");
  await expect(tab("~/infrastructure")).toHaveAttribute("aria-selected", "true");
  await expect(t.getByText("$ ls --systems")).toBeVisible();
});

test("each panel shows its content", async ({ page }) => {
  await page.goto("/");
  const t = terminal(page);
  // Hidden panels are excluded from role queries, so this is the visible panel.
  const panel = t.getByRole("tabpanel");
  for (const name of ["Windows Server", "Ubuntu Linux", "Docker", "VMware", "Hyper-V", "pfSense"]) {
    await expect(panel.getByText(name, { exact: true })).toBeVisible();
  }
  await t.getByRole("tab", { name: "~/operations" }).click();
  for (const v of ["$150K", "-25%", "NIST"]) {
    await expect(panel.getByText(v, { exact: true })).toBeVisible();
  }
  await expect(panel.getByText(/^src: /)).toHaveCount(3);
  await t.getByRole("tab", { name: "~/leadership" }).click();
  for (const v of ["10", "Agile", "95%"]) {
    await expect(panel.getByText(v, { exact: true })).toBeVisible();
  }
});

test("the infrastructure grid reflows by width", async ({ page, viewport }) => {
  await page.goto("/");
  const cards = terminal(page).getByRole("tabpanel").getByRole("listitem");
  const xs = new Set<number>();
  for (const box of await Promise.all([1, 2, 3, 4].map((i) => cards.nth(i).boundingBox())))
    xs.add(Math.round(box!.x));
  // Narrow (375): one column. Desktop (1440): four columns.
  expect(xs.size).toBe((viewport?.width ?? 0) < 768 ? 1 : 4);
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });
  test("the panel switch is instant", async ({ page }) => {
    await page.goto("/");
    await terminal(page).getByRole("tab", { name: "~/operations" }).click();
    const duration = await terminal(page)
      .getByRole("tabpanel")
      .evaluate((el) => parseFloat(getComputedStyle(el).animationDuration));
    expect(duration).toBeLessThan(0.001);
  });
});

test.describe("tablet", () => {
  test.use({ viewport: { width: 768, height: 1024 } });
  test("the infrastructure grid is two columns at 768", async ({ page }) => {
    await page.goto("/");
    const cards = terminal(page).getByRole("tabpanel").getByRole("listitem");
    const xs = new Set<number>();
    for (const box of await Promise.all([1, 2, 3, 4].map((i) => cards.nth(i).boundingBox())))
      xs.add(Math.round(box!.x));
    expect(xs.size).toBe(2);
  });
});
