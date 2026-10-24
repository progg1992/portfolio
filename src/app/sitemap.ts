import type { MetadataRoute } from "next";
import { getCaseStudies } from "@/content/work";
import { pages, siteUrl } from "@/lib/site";

// PTR-34. Every live page plus each published case study. Pages join the
// sitemap through the same live flags that control the navigation.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const studies = await getCaseStudies();
  const live = Object.values(pages).filter((p) => p.live);
  return [
    { url: `${siteUrl}/`, changeFrequency: "monthly", priority: 1 },
    ...live.map((p) => ({ url: `${siteUrl}${p.href}`, changeFrequency: "monthly" as const })),
    ...studies.map((s) => ({
      url: `${siteUrl}/work/${s.slug}`,
      changeFrequency: "yearly" as const,
    })),
  ];
}
