// Initial JavaScript budget (PTR-32): the scripts each page loads before any
// interaction must total under 150 KB gzip. Vercel serves Brotli, which is
// smaller, so gzip is the conservative measure. Measured on the HTML the
// server sends, which is what a first visit downloads.
// Usage: node scripts/check-js-budget.mjs http://localhost:3200
import { gzipSync } from "node:zlib";

const base = process.argv[2] ?? "http://localhost:3200";
const BUDGET = 150 * 1024;
const routes = ["/", "/work", "/work/bdos-v3", "/experience", "/about", "/contact", "/privacy"];

let failed = false;
const cache = new Map();
for (const route of routes) {
  const html = await (await fetch(base + route)).text();
  // Scripts marked noModule are legacy-browser polyfills that modern browsers
  // never download, so they do not count against the budget.
  const tags = [...html.matchAll(/<script\b[^>]*>/g)].map((m) => m[0]);
  const srcs = [
    ...new Set(
      tags
        .filter((t) => !/\bnomodule\b/i.test(t))
        .map((t) => t.match(/src="([^"]+)"/)?.[1])
        .filter(Boolean),
    ),
  ];
  let total = 0;
  for (const src of srcs) {
    if (!cache.has(src)) {
      const body = Buffer.from(await (await fetch(new URL(src, base))).arrayBuffer());
      cache.set(src, gzipSync(body, { level: 9 }).length);
    }
    total += cache.get(src);
  }
  const kb = (total / 1024).toFixed(1);
  const ok = total < BUDGET;
  if (!ok) failed = true;
  console.log(
    `${ok ? "ok  " : "FAIL"} ${route.padEnd(16)} ${kb} KB gzip across ${srcs.length} scripts`,
  );
}
if (failed) {
  console.error(`check-js-budget: a page exceeds ${BUDGET / 1024} KB of initial JavaScript`);
  process.exit(1);
}
