import {
  featureKeys,
  legalKeys,
  publicPageKeys,
} from "../apps/web/lib/public-site.ts";

const baseUrl = (process.env.ENDOORA_WEB_TEST_URL ?? "http://127.0.0.1:3000").replace(/\/$/, "");

const localized = (keys, segment = "") => keys.flatMap((key) => [
  `${segment}/${key}`,
  `/en${segment}/${key}`,
]);

const publicRoutes = [
  "/",
  "/en",
  ...localized(publicPageKeys),
  ...localized(featureKeys, "/features"),
  ...localized(legalKeys, "/legal"),
];

const infrastructureRoutes = ["/robots.txt", "/sitemap.xml", "/opengraph-image"];
const ctaRoutes = ["/auth/login", "/auth/register", "/placement/demo"];
const failures = [];
const titles = new Map();

for (const route of [...publicRoutes, ...infrastructureRoutes, ...ctaRoutes]) {
  const response = await fetch(`${baseUrl}${route}`, { redirect: "manual" });
  if (response.status !== 200) {
    failures.push(`${route}: expected 200, received ${response.status}`);
    continue;
  }

  if (!publicRoutes.includes(route)) continue;
  const html = await response.text();
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1]?.replace(/&amp;/g, "&").trim();
  const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1]?.trim();
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];

  if (!title || !description || !canonical) failures.push(`${route}: missing title, description, or canonical metadata`);
  if (title) {
    if (titles.has(title)) failures.push(`${route}: title duplicates ${titles.get(title)} (${title})`);
    else titles.set(title, route);
  }

  if (route.includes("/legal/") && !html.includes('name="robots" content="noindex, nofollow"')) {
    failures.push(`${route}: draft legal page is missing noindex,nofollow`);
  }
}

const unknown = await fetch(`${baseUrl}/this-route-must-not-exist-day06`, { redirect: "manual" });
if (unknown.status !== 404) failures.push(`/this-route-must-not-exist-day06: expected 404, received ${unknown.status}`);

const faHome = await (await fetch(`${baseUrl}/`)).text();
const enHome = await (await fetch(`${baseUrl}/en`)).text();
for (const [route, html, expected] of [
  ["/", faHome, ['href="/placement"', 'href="/auth/register"', 'application/ld+json']],
  ["/en", enHome, ['href="/en/placement"', 'href="/auth/register?locale=en"', 'application/ld+json']],
]) {
  for (const marker of expected) if (!html.includes(marker)) failures.push(`${route}: missing ${marker}`);
}

const sitemap = await (await fetch(`${baseUrl}/sitemap.xml`)).text();
if (sitemap.includes("/legal/") || sitemap.includes("/design-system/")) failures.push("/sitemap.xml: contains a draft or developer route");
if (!sitemap.includes('hreflang="fa-IR"') || !sitemap.includes('hreflang="en"')) failures.push("/sitemap.xml: missing Persian/English alternates");

const robots = await (await fetch(`${baseUrl}/robots.txt`)).text();
if (!robots.includes("Disallow: /legal/") || !robots.includes("Disallow: /design-system/")) failures.push("/robots.txt: missing draft/developer disallow rules");

if (failures.length) {
  console.error(`Day 06 route smoke check failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Day 06 route smoke check: PASS (${publicRoutes.length} public pages, ${infrastructureRoutes.length} infrastructure routes, ${ctaRoutes.length} CTA/support routes, one verified 404)`);
