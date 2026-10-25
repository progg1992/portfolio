import { expect, test, type Page } from "@playwright/test";

// PTR-32: Interaction to Next Paint under 200 ms on a throttled profile.
// Chromium's Event Timing API reports each interaction's duration (input to
// next paint); INP is the slowest of them. The CPU is slowed 4x, the
// Lighthouse mobile profile.

async function throttle(page: Page) {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
}

async function startObserving(page: Page) {
  await page.evaluate(() => {
    const w = window as unknown as { inp: number[] };
    w.inp = [];
    new PerformanceObserver((list) => {
      for (const e of list.getEntries() as (PerformanceEventTiming & {
        interactionId?: number;
      })[]) {
        if (e.interactionId) w.inp.push(e.duration);
      }
    }).observe({ type: "event", durationThreshold: 16, buffered: true } as PerformanceObserverInit);
  });
}

const worst = (page: Page) =>
  page.evaluate(async () => {
    // Let the observer receive the last entries.
    await new Promise((r) => setTimeout(r, 300));
    const all = (window as unknown as { inp: number[] }).inp;
    return all.length ? Math.max(...all) : 0;
  });

test("interactions respond within 200 ms on a 4x slower CPU", async ({ page, isMobile }) => {
  await page.goto("/");
  await throttle(page);
  await startObserving(page);
  if (isMobile) {
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.getByRole("button", { name: "Close menu" }).click();
  }
  for (const tab of ["~/operations", "~/leadership", "~/infrastructure"]) {
    await page.getByRole("tab", { name: tab }).click();
  }
  const home = await worst(page);

  await page.goto("/work");
  await throttle(page);
  await startObserving(page);
  for (const d of ["infrastructure", "delivery", "all"]) {
    await page.getByRole("button", { name: d, exact: true }).click();
  }
  const work = await worst(page);

  await page.goto("/contact");
  await throttle(page);
  await startObserving(page);
  await page.getByLabel("Work email", { exact: true }).fill("jordan@");
  await page.getByLabel("Message", { exact: true }).click();
  await page.getByRole("button", { name: "Send message" }).click();
  const contact = await worst(page);

  console.log(
    `INP ms (${isMobile ? "mobile" : "desktop"}): home ${home}, work ${work}, contact ${contact}`,
  );
  expect(Math.max(home, work, contact)).toBeLessThan(200);
});
