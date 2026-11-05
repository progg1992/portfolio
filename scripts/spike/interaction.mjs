// PTR-28 spike, hybrid variant: freezes while scrolling to the 3D section, and
// the response time of a click made while the scene loads.
// Usage: node scripts/spike/interaction.mjs <base url> <cpu slowdown>
import { writeFileSync } from "node:fs";
import { chromium } from "playwright";

const [base, rateArg] = process.argv.slice(2);
const rate = Number(rateArg ?? 1);
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH,
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});

async function open() {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(base + "/", { waitUntil: "load" });
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate });
  await page.evaluate(() => {
    const w = window;
    w.longtasks = [];
    w.inp = [];
    new PerformanceObserver((l) =>
      l.getEntries().forEach((e) => w.longtasks.push({ start: e.startTime, d: e.duration })),
    ).observe({ type: "longtask", buffered: true });
    new PerformanceObserver((l) =>
      l.getEntries().forEach((e) => e.interactionId && w.inp.push(e.duration)),
    ).observe({ type: "event", durationThreshold: 16, buffered: true });
  });
  await page.waitForTimeout(1500);
  return page;
}
const marks = (page) =>
  page.evaluate(() =>
    Object.fromEntries(
      performance.getEntriesByType("mark").map((m) => [m.name, Math.round(m.startTime)]),
    ),
  );

// 1. Scroll with the wheel, 100 px every 50 ms, until the section is in view.
const scroll = [];
for (let run = 0; run < 3; run++) {
  const page = await open();
  const t0 = await page.evaluate(() => performance.now());
  const target = await page.evaluate(
    () => document.getElementById("network-heading").getBoundingClientRect().top + scrollY - 100,
  );
  await page.mouse.move(700, 450);
  for (let y = 0; y < target; y += 100) {
    await page.mouse.wheel(0, 100);
    await page.waitForTimeout(50);
  }
  await page.waitForTimeout(5000);
  const r = await page.evaluate(
    (t0) => window.longtasks.filter((t) => t.start >= t0).map((t) => Math.round(t.d)),
    t0,
  );
  const m = await marks(page);
  scroll.push({
    longestTaskMs: r.length ? Math.max(...r) : 0,
    longTasks: r,
    importToReadyMs: m["scene-ready"] - m["scene-import-start"],
  });
  await page.close();
}

// 2. Bring the section within one screen, then click a terminal tab at set
//    offsets after the scene import starts.
const clicks = [];
for (const offset of [0, 100, 250, 500]) {
  const page = await open();
  await page.evaluate(() =>
    window.scrollTo(
      0,
      document.getElementById("network-heading").getBoundingClientRect().top +
        scrollY -
        1.6 * innerHeight,
    ),
  );
  await page.waitForFunction(
    () => performance.getEntriesByName("scene-import-start").length > 0,
    null,
    { timeout: 15000 },
  );
  await page.waitForTimeout(offset);
  const tab = (await page.getByRole("tab", { name: "~/operations" }).isVisible())
    ? "~/operations"
    : null;
  const before = await page.evaluate(() => window.inp.length);
  // Click a page control that is on screen at this scroll position.
  const box = await page.evaluate(() => {
    const els = [...document.querySelectorAll("main a, main button, [role=tab]")].filter((e) => {
      const r = e.getBoundingClientRect();
      return r.top > 0 && r.bottom < innerHeight && r.width > 0;
    });
    const r = els[0]?.getBoundingClientRect();
    return r
      ? {
          x: r.x + r.width / 2,
          y: r.y + r.height / 2,
          label: els[0].textContent.trim().slice(0, 40),
          href: els[0].getAttribute("href"),
        }
      : null;
  });
  if (box?.href)
    await page.evaluate(() => document.addEventListener("click", (e) => e.preventDefault(), true));
  if (box) await page.mouse.click(box.x, box.y);
  await page.waitForTimeout(3000);
  const durations = await page.evaluate((b) => window.inp.slice(b), before);
  clicks.push({
    offsetMs: offset,
    control: box?.label ?? tab,
    worstMs: durations.length ? Math.round(Math.max(...durations)) : "under 16",
  });
  await page.close();
}
await browser.close();
const out = { cpuSlowdown: rate, scroll, clicks };
writeFileSync(
  `${process.env.OUT_DIR}/hybrid-interaction-${rate}x.json`,
  JSON.stringify(out, null, 2),
);
console.log(JSON.stringify(out, null, 2));
