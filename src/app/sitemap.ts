import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { guideSlugs } from "@/sanity/guides";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    ...guideSlugs.map((slug) => ({ url: `${siteUrl}/${slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 1 })),
  ];
}
