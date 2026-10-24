// Checks a production build's robots.txt and sitemap (PTR-34). CI runs it in
// the Lighthouse job, which builds with VERCEL_ENV=production.
// Usage: node scripts/check-seo.mjs http://localhost:3200
const base = process.argv[2] ?? "http://localhost:3200";
const fail = (msg) => {
  console.error(`check-seo: ${msg}`);
  process.exit(1);
};

const robots = await (await fetch(`${base}/robots.txt`)).text();
if (!/Allow: \/\s*$/m.test(robots)) fail("robots.txt does not allow crawling");
if (!/Disallow: \/styleguide/.test(robots)) fail("robots.txt does not exclude /styleguide");
if (!/Sitemap: https?:\/\/\S+\/sitemap\.xml/.test(robots)) fail("robots.txt has no sitemap line");

const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
for (const path of [
  "/",
  "/work",
  "/experience",
  "/about",
  "/contact",
  "/privacy",
  "/work/bdos-v3",
]) {
  if (!sitemap.includes(`${path}</loc>`)) fail(`sitemap is missing ${path}`);
}
if (sitemap.includes("/styleguide")) fail("sitemap lists /styleguide");

const home = await (await fetch(`${base}/`)).text();
if (!/<meta name="robots" content="index, follow"/.test(home)) fail("home is not indexable");
console.log("check-seo: ok");
