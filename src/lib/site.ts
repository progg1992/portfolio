/** Site-wide links and labels. One place to change them. */

export const nav = [
  { href: "/work", label: "work" },
  { href: "/experience", label: "experience" },
  { href: "/about", label: "about" },
  { href: "/contact", label: "contact" },
] as const;

/** The resume PDF in /public (PTR-8). The file ships once the Client accepts it. */
export const resumePath = "/Pierce-Rogg-Resume.pdf";

export const external = {
  linkedin: "https://linkedin.com/in/pierce-rogg",
  github: "https://github.com/progg1992",
  bdd: "https://bluedevildev.com",
} as const;

/** True when `pathname` is `href` or a page beneath it, so /work/bdos-v3 marks "work" active. */
export function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
