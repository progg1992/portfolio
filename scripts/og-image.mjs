// Renders src/app/opengraph-image.png and twitter-image.png (PTR-34), 1200 x 630,
// in the site's style with the self-hosted fonts. Run after changing the hero
// copy: node scripts/og-image.mjs  (PW_CHROMIUM_PATH can point at a local Chromium).
import { copyFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = new URL("../", import.meta.url);
const font = (f) => new URL(`src/fonts/${f}`, root).href;
const out = fileURLToPath(new URL("src/app/opengraph-image.png", root));

const html = `<!doctype html><html><head><style>
@font-face { font-family: Geist; src: url(${font("Geist-Variable-latin.woff2")}); font-weight: 100 900; }
@font-face { font-family: Mono; src: url(${font("JetBrainsMono-Variable-latin.woff2")}); font-weight: 100 800; }
* { margin: 0; box-sizing: border-box; }
body { width: 1200px; height: 630px; background: #09090b; color: #fafafa; font-family: Geist; overflow: hidden; position: relative; }
.glow { position: absolute; right: -220px; top: -260px; width: 900px; height: 900px;
  background: radial-gradient(closest-side, rgba(6,182,212,.18), rgba(168,85,247,.08) 55%, transparent); }
.wrap { position: relative; height: 100%; padding: 72px 80px; display: flex; flex-direction: column; justify-content: space-between; }
.top { display: flex; align-items: center; gap: 14px; font-family: Mono; font-weight: 600; font-size: 26px; }
.dot { width: 14px; height: 14px; border-radius: 50%; background: #06b6d4; box-shadow: 0 0 18px #06b6d4; }
h1 { font-weight: 700; font-size: 112px; line-height: .98; letter-spacing: -0.04em; }
.titles { margin-top: 26px; font-family: Mono; font-size: 28px; line-height: 1.5; color: #06b6d4; }
.bottom { display: flex; justify-content: space-between; font-family: Mono; font-size: 19px; white-space: nowrap; color: #a1a1aa; border-top: 1px solid #27272a; padding-top: 28px; }
.ok { color: #22c55e; }
</style></head><body><div class="glow"></div><div class="wrap">
<div class="top"><span class="dot"></span>pierce.rogg</div>
<div><h1>Pierce Rogg</h1>
<p class="titles">Technical Project Manager · Principal Technologist<br>Systems Operations Leader</p></div>
<div class="bottom"><span>work · experience · contact</span><span><span class="ok">●</span> available for leadership roles and consulting</span></div>
</div></body></html>`;

const browser = await chromium.launch(
  process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {},
);
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
// Loaded from a file so the page may read the local font files.
const tmp = join(tmpdir(), `og-${process.pid}.html`);
await writeFile(tmp, html);
await page.goto(`file://${tmp}`, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
const loaded = await page.evaluate(() => [...document.fonts].every((f) => f.status === "loaded"));
if (!loaded) throw new Error("fonts did not load; the image would use a fallback font");
await page.screenshot({ path: out });
await browser.close();
await rm(tmp);
await copyFile(out, out.replace("opengraph-image", "twitter-image"));
console.log("wrote", out);
