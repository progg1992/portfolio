/** Site-wide links and labels. One place to change them. */

/**
 * The public origin for canonical URLs, Open Graph, the sitemap, and robots
 * (PTR-34). Set NEXT_PUBLIC_SITE_URL to the custom domain in production
 * (PTR-36). Before that, Vercel's production URL is used, then localhost.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");

/** Only production is indexed; previews and staging stay noindex (PTR-13). */
export const indexable = process.env.VERCEL_ENV === "production";

/**
 * Every internal page the header and footer can link to. `live` is false until
 * the story that builds the page ships; the story that builds a page flips its
 * flag in the same pull request. Linking to a page that does not exist is a
 * broken link, and Next.js prefetching turns it into a console 404 on every page
 * (which failed the Lighthouse Best Practices budget, PTR-15).
 */
export const pages = {
  work: { href: "/work", label: "work", live: true, story: "PTR-26" },
  experience: { href: "/experience", label: "experience", live: true, story: "PTR-49" },
  about: { href: "/about", label: "about", live: true, story: "PTR-23" },
  contact: { href: "/contact", label: "contact", live: true, story: "PTR-24" },
  privacy: { href: "/privacy", label: "privacy", live: true, story: "PTR-50" },
} as const;

type Page = (typeof pages)[keyof typeof pages];

/** Header navigation, in display order, limited to pages that exist. */
export const nav: readonly Page[] = [
  pages.work,
  pages.experience,
  pages.about,
  pages.contact,
].filter((p) => p.live);

/** The resume PDF in /public. Shown once the Client accepts the final file (PTR-8). */
export const resume = { path: "/Pierce-Rogg-Resume.pdf", live: true, story: "PTR-8" } as const;

/**
 * Cookieless analytics (PTR-35). The privacy page reads this flag, so its
 * analytics paragraph always matches what the site actually runs (PTR-50).
 */
export const analytics = {
  live: true,
  provider: "Vercel Web Analytics",
  story: "PTR-35",
} as const;

/**
 * True only in builds on Vercel. The analytics script is served by Vercel's
 * edge, so anywhere else (local, CI) it would 404 and fail Lighthouse.
 */
export const onVercel = process.env.VERCEL === "1";

export const external = {
  linkedin: "https://linkedin.com/in/pierce-rogg",
  github: "https://github.com/progg1992",
  bdd: "https://bluedevildev.com",
} as const;

/** True when `pathname` is `href` or a page beneath it, so /work/bdos-v3 marks "work" active. */
export function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
