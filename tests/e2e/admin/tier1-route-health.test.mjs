import fs from "fs";
import path from "path";
import { expect, createRegistry } from "./helpers/assertions.mjs";

export const registry = createRegistry("Tier 1: Admin Routes & Page Health Suite");

const BASE_APP = path.resolve("apps/web/app");
const ADMIN_API_DIR = path.resolve("apps/web/app/api/admin");

const ADMIN_PAGE_ROUTES = [
  "admin",
  "operations/ai",
  "operations/analytics",
  "operations/audit",
  "operations/content",
  "operations/courses",
  "operations/disaster-recovery",
  "operations/flags",
  "operations/incidents",
  "operations/launch",
  "operations/monitoring",
  "operations/pen-test",
  "operations/privacy",
  "operations/pwa",
  "operations/questions",
  "operations/security",
  "operations/taxonomy",
  "content",
  "content/courses",
  "content/questions",
  "content/taxonomy",
  "finance",
  "ielts-content",
  "marketplace",
];

// 1. Verify all 24 Admin Frontend Routes exist and export default Page component
for (const route of ADMIN_PAGE_ROUTES) {
  registry.test(`Page Route /${route} exists, has page.tsx and valid default export`, () => {
    const directPath = path.join(BASE_APP, route, "page.tsx");
    const groupPath = path.join(BASE_APP, "(admin)", route, "page.tsx");
    const pagePath = fs.existsSync(directPath) ? directPath : groupPath;

    expect(fs.existsSync(pagePath)).toBe(true, `File missing in both direct and (admin) group: ${directPath}`);
    const content = fs.readFileSync(pagePath, "utf-8");
    expect(content.includes("export default")).toBe(true, `Route /${route} missing default export`);
    expect(content.length).toBeGreaterThan(50, `Route /${route} page.tsx appears to be an empty stub`);
  });
}

// 2. Discover and inspect all 43 Admin API routes
function getRouteFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of list) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getRouteFiles(full));
    } else if (entry.name === "route.ts") {
      results.push(full);
    }
  }
  return results;
}

const allApiRoutes = getRouteFiles(ADMIN_API_DIR);

registry.test(`Admin API route catalog contains all expected endpoints (>= 42)`, () => {
  expect(allApiRoutes.length).toBeGreaterThanOrEqual(42, `Expected at least 42 route handlers, found ${allApiRoutes.length}`);
});

registry.test(`Zero production 404 disablers exist across any admin route`, () => {
  const violatingFiles = [];
  for (const routeFile of allApiRoutes) {
    const code = fs.readFileSync(routeFile, "utf-8");
    if (code.includes('process.env.NODE_ENV === "production"') && code.includes("404")) {
      violatingFiles.push(path.relative(process.cwd(), routeFile));
    }
  }
  expect(violatingFiles.length).toBe(0, `Found production 404 disablers in: ${violatingFiles.join(", ")}`);
});

registry.test(`Every administrative API route exports standard HTTP methods`, () => {
  const methodRegex = /export\s+async\s+function\s+(GET|POST|PUT|PATCH|DELETE)/;
  for (const routeFile of allApiRoutes) {
    const code = fs.readFileSync(routeFile, "utf-8");
    expect(methodRegex.test(code)).toBe(true, `No HTTP methods exported in ${path.relative(process.cwd(), routeFile)}`);
  }
});

registry.test(`Every administrative API route enforces verifyAdminSession gating`, () => {
  for (const routeFile of allApiRoutes) {
    const code = fs.readFileSync(routeFile, "utf-8");
    const hasAuthCheck =
      code.includes("verifyAdminSession") ||
      code.includes("verifyStaffOrSuperuser") ||
      code.includes("adminAuth");
    expect(hasAuthCheck).toBe(true, `Missing admin session auth check in: ${path.relative(process.cwd(), routeFile)}`);
  }
});
