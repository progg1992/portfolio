// PTR-28 spike: measures one build of the home page.
// Usage: node scripts/spike/measure.mjs <label> <base url>
import { gzipSync } from "node:zlib";
import { writeFileSync } from "node:fs";
import { chromium } from "playwright";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import desktopConfig from "lighthouse/core/config/desktop-config.js";

const desktop = process.env.FORM === "desktop";

const [label, base] = process.argv.slice(2);
const CHROME = process.env.CHROME_PATH;

// 1. Every JS and model byte the home page loads in a real browser, split by
//    whether it arrived before or after the load event.
const browser = await chromium.launch({
  executablePath: CHROME,
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
const page = await browser.newPage({ viewport: { width: 412, height: 823 } });
const seen = [];
let loaded = false;
page.on("response", async (res) => {
  const url = res.url();
  if (!/\.(js|glb)(\?|$)/.test(url)) return;
  const phase = loaded ? "after-load" : "initial";
  try {
    const body = await res.body();
    seen.push({ url: url.replace(base, ""), phase, gzip: gzipSync(body, { level: 9 }).length });
  } catch {}
});
page.on("load", () => (loaded = true));
await page.goto(base + "/", { waitUntil: "load" });
await page.waitForTimeout(6000);
const canvas = await page.locator("canvas").count();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await browser.close();
const sum = (phase) => seen.filter((s) => s.phase === phase).reduce((a, s) => a + s.gzip, 0);
const weight = {
  initialJsKB: +(sum("initial") / 1024).toFixed(1),
  afterLoadKB: +(sum("after-load") / 1024).toFixed(1),
  afterLoadFiles: seen
    .filter((s) => s.phase === "after-load")
    .map((s) => `${s.url.split("/").pop()} ${(s.gzip / 1024).toFixed(1)} KB`),
  canvasRendered: canvas > 0,
};

// 2. Lighthouse, mobile, simulated throttling, five runs, the same settings as lighthouserc.json.
const runs = [];
for (let i = 0; i < 5; i++) {
  const chrome = await chromeLauncher.launch({
    chromePath: CHROME,
    chromeFlags: [
      "--headless=new",
      "--no-sandbox",
      "--use-angle=swiftshader",
      "--enable-unsafe-swiftshader",
    ],
  });
  const r = desktop
    ? await lighthouse(
        base + "/",
        { port: chrome.port, onlyCategories: ["performance"] },
        desktopConfig,
      )
    : await lighthouse(base + "/", {
        port: chrome.port,
        onlyCategories: ["performance"],
        formFactor: "mobile",
        throttlingMethod: "simulate",
        screenEmulation: {
          mobile: true,
          width: 412,
          height: 823,
          deviceScaleFactor: 1.75,
          disabled: false,
        },
      });
  await chrome.kill();
  const a = r.lhr.audits;
  runs.push({
    score: Math.round(r.lhr.categories.performance.score * 100),
    lcp: Math.round(a["largest-contentful-paint"].numericValue),
    tbt: Math.round(a["total-blocking-time"].numericValue),
    cls: +a["cumulative-layout-shift"].numericValue.toFixed(3),
    si: Math.round(a["speed-index"].numericValue),
    tti: Math.round(a["interactive"].numericValue),
    totalKB: Math.round(a["total-byte-weight"].numericValue / 1024),
    glbRequested: a["network-requests"].details.items.some((n) => n.url.endsWith(".glb")),
  });
}
const median = (k) => [...runs].map((r) => r[k]).sort((a, b) => a - b)[2];
const out = {
  label,
  form: desktop ? "desktop" : "mobile",
  weight,
  lighthouse: {
    median: Object.fromEntries(
      ["score", "lcp", "tbt", "cls", "si", "tti", "totalKB"].map((k) => [k, median(k)]),
    ),
    runs,
  },
};
writeFileSync(
  `${process.env.OUT_DIR}/${label}${desktop ? "-desktop" : ""}.json`,
  JSON.stringify(out, null, 2),
);
console.log(JSON.stringify(out, null, 2));
