import type { MetadataRoute } from "next";
import { indexable, siteUrl } from "@/lib/site";

// PTR-34. Production allows everything and points at the sitemap. Previews and
// staging disallow everything, alongside the noindex header (PTR-13).
export default function robots(): MetadataRoute.Robots {
  if (!indexable) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/styleguide" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
