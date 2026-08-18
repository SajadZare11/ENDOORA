import type { MetadataRoute } from "next";
import { PUBLIC_BASE_URL } from "../lib/public-site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/api/",
        "/design-system/",
        "/legal/",
        "/en/legal/",
        "/account/",
        "/teacher/account/",
      ],
    },
    sitemap: `${PUBLIC_BASE_URL}/sitemap.xml`,
    host: PUBLIC_BASE_URL,
  };
}
