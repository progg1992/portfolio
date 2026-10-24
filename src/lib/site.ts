/** Site-wide links and labels. One place to change them. */

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
  privacy: { href: "/privacy", label: "privacy", live: false, story: "PTR-50" },
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

export const external = {
  linkedin: "https://linkedin.com/in/pierce-rogg",
  github: "https://github.com/progg1992",
  bdd: "https://bluedevildev.com",
} as const;

/** True when `pathname` is `href` or a page beneath it, so /work/bdos-v3 marks "work" active. */
export function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
