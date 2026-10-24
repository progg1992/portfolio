import { expect, test } from "@playwright/test";

// PTR-19 acceptance criteria that can be checked automatically.

test("the skip link is the first focusable element and moves focus to main", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page.locator("main#main")).toBeFocused();
});

test("every page has exactly one main landmark", async ({ page }) => {
  for (const route of ["/", "/work/bdos-v3", "/styleguide"]) {
    await page.goto(route);
    await expect(page.locator("main")).toHaveCount(1);
  }
});

test("footer links to privacy", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("contentinfo").getByRole("link", { name: "privacy" }),
  ).toHaveAttribute("href", "/privacy");
});

test.describe("desktop", () => {
  test.skip(({ viewport }) => (viewport?.width ?? 0) < 820, "desktop only");

  test("the current section is marked with aria-current", async ({ page }) => {
    await page.goto("/work/bdos-v3");
    const nav = page.getByRole("navigation", { name: "Primary" });
    await expect(nav.getByRole("link", { name: "work" })).toHaveAttribute("aria-current", "page");
    await expect(nav.getByRole("link", { name: "about" })).not.toHaveAttribute("aria-current");
  });

  test("the menu button is not shown", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: "Open menu" })).toBeHidden();
  });
});

test.describe("mobile menu", () => {
  test.skip(({ viewport }) => (viewport?.width ?? 0) >= 820, "mobile only");

  test("opens, traps focus, and closes on Escape with focus restored", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Open menu" });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");

    await toggle.click();
    const close = page.getByRole("button", { name: "Close menu" });
    await expect(close).toHaveAttribute("aria-expanded", "true");
    const menu = page.locator("#mobile-menu");
    await expect(menu.getByRole("link", { name: "work" })).toBeFocused();

    // Tab through every item; focus must never leave the toggle and the panel.
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press("Tab");
      const inside = await page.evaluate(() => {
        const el = document.activeElement;
        return (
          !!el &&
          (!!el.closest("#mobile-menu") || el.getAttribute("aria-controls") === "mobile-menu")
        );
      });
      expect(inside, `focus escaped the menu after ${i + 1} tabs`).toBe(true);
    }

    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
  });

  test("following a link closes the menu", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.locator("#mobile-menu").getByRole("link", { name: "work" }).click();
    await expect(page.locator("#mobile-menu")).toBeHidden();
  });
});

test("header controls are at least 44 by 44 px", async ({ page }) => {
  await page.goto("/");
  const controls = page.getByRole("banner").locator("a:visible, button:visible");
  const count = await controls.count();
  expect(count).toBeGreaterThan(0);
  for (let i = 0; i < count; i++) {
    const box = await controls.nth(i).boundingBox();
    expect(box, `control ${i} has no box`).not.toBeNull();
    expect(box!.height, `control ${i} height`).toBeGreaterThanOrEqual(44);
    expect(box!.width, `control ${i} width`).toBeGreaterThanOrEqual(44);
  }
});
