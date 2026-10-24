import { expect, test, type Page } from "@playwright/test";

// PTR-30. Desktop Chrome reports (hover: hover) and (pointer: fine); the mobile
// project emulates a touch device, which must get no motion at all.
const glowOpacity = (page: Page, selector: string) =>
  page
    .locator(selector)
    .first()
    .evaluate((el) => getComputedStyle(el, "::before").opacity);

test.describe("pointer devices", () => {
  test.skip(({ isMobile }) => isMobile, "pointer devices only");

  test("the glow follows the pointer inside a card and fades out on leave", async ({ page }) => {
    await page.goto("/work");
    const card = page.getByRole("main").getByRole("article").first();
    const box = (await card.boundingBox())!;
    await page.mouse.move(box.x + 40, box.y + 30);
    await page.mouse.move(box.x + 60, box.y + 50, { steps: 4 });
    await expect.poll(() => glowOpacity(page, "main article")).toBe("1");
    const x = await card.evaluate((el) => el.style.getPropertyValue("--glow-x"));
    expect(parseFloat(x)).toBeCloseTo(60, -1);
    const duration = await card.evaluate(
      (el) => getComputedStyle(el, "::before").transitionDuration,
    );
    expect(duration).toBe("0.2s");
    await page.mouse.move(5, 5);
    await expect.poll(() => glowOpacity(page, "main article")).toBe("0");
  });

  test("status dots pulse once when first seen", async ({ page }) => {
    await page.goto("/");
    const dot = page.locator(".pulse-dot").first();
    await expect(dot).toHaveAttribute("data-seen", "");
    const anim = await dot.evaluate((el) => {
      const s = getComputedStyle(el);
      return { name: s.animationName, count: s.animationIterationCount };
    });
    expect(anim).toEqual({ name: "status-pulse", count: "1" });
  });

  test("moving the pointer causes no long tasks", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      (window as unknown as { longTasks: number[] }).longTasks = [];
      new PerformanceObserver((list) => {
        for (const e of list.getEntries())
          (window as unknown as { longTasks: number[] }).longTasks.push(e.duration);
      }).observe({ type: "longtask", buffered: false });
    });
    const terminal = page.getByRole("region", { name: "What I run, deliver, and lead" });
    await terminal.scrollIntoViewIfNeeded();
    const box = (await terminal.boundingBox())!;
    for (let i = 0; i < 40; i++) {
      await page.mouse.move(box.x + 20 + i * 15, box.y + 40 + (i % 10) * 20);
    }
    const tasks = await page.evaluate(
      () => (window as unknown as { longTasks: number[] }).longTasks,
    );
    expect(tasks.filter((d) => d > 50)).toEqual([]);
  });
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("no glow and no pulse", async ({ page, isMobile }) => {
    test.skip(isMobile, "covered by the touch test");
    await page.goto("/work");
    const card = page.getByRole("main").getByRole("article").first();
    await card.hover();
    expect(await card.evaluate((el) => getComputedStyle(el, "::before").content)).toBe("none");
    await page.goto("/");
    const dot = page.locator(".pulse-dot").first();
    expect(await dot.evaluate((el) => getComputedStyle(el).animationName)).toBe("none");
  });
});

test("touch devices get no motion", async ({ page, isMobile }) => {
  test.skip(!isMobile, "touch emulation only");
  await page.goto("/");
  const dot = page.locator(".pulse-dot").first();
  expect(await dot.evaluate((el) => getComputedStyle(el).animationName)).toBe("none");
  await page.goto("/work");
  const card = page.getByRole("main").getByRole("article").first();
  await card.tap();
  expect(await card.evaluate((el) => getComputedStyle(el, "::before").content)).toBe("none");
});
