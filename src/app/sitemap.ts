import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/db/projects";
import { projects as staticProjects } from "@/data/projects";

const BASE = "https://elssila.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/studio`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/projects`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/services`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/contact`, changeFrequency: "monthly", priority: 0.7 },
  ];

  let slugs: string[] = [];
  try {
    slugs = await getAllSlugs();
    if (!slugs.length) slugs = staticProjects.map((p) => p.slug);
  } catch {
    slugs = staticProjects.map((p) => p.slug);
  }

  const projectPages: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${BASE}/projects/${slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...projectPages];
}
