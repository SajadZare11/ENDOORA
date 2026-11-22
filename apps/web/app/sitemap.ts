import type { MetadataRoute } from "next";
import { featureKeys, localizedPath, PUBLIC_BASE_URL, publicPageKeys } from "../lib/public-site";

function entry(path: string, priority: number): MetadataRoute.Sitemap[number] {
  const fa = `${PUBLIC_BASE_URL}${localizedPath("fa", path)}`;
  const en = `${PUBLIC_BASE_URL}${localizedPath("en", path)}`;
  return {
    url: fa,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority,
    alternates: { languages: { "fa-IR": fa, en } },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [entry("/", 1)];
  for (const key of publicPageKeys) pages.push(entry(`/${key}`, key === "placement" ? 0.9 : 0.7));
  for (const key of featureKeys) pages.push(entry(`/features/${key}`, 0.65));
  return pages;
}
