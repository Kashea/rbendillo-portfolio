import type { MetadataRoute } from "next";
import { caseStudies, site } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, priority: 1 },
    { url: `${site.url}/resume`, priority: 0.9 },
    ...caseStudies.map((p) => ({ url: `${site.url}/work/${p.slug}`, priority: 0.8 })),
  ];
}
