import type { MetadataRoute } from "next";
import { caseStudies, modules, site } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, priority: 1 },
    { url: `${site.url}/resume`, priority: 0.9 },
    ...caseStudies.map((p) => ({ url: `${site.url}/work/${p.slug}`, priority: 0.8 })),
    { url: `${site.url}/module/protocol`, priority: 0.7 },
    ...modules.map((m) => ({ url: `${site.url}/module/${m.slug}`, priority: 0.6 })),
  ];
}
