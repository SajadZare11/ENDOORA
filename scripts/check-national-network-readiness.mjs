/**
 * Endoora National Network (Net Melli / شبکه ملی اطلاعات) Readiness Auditor
 * Verifies that the platform is 100% self-contained, offline-resilient,
 * and contains zero external runtime dependencies that would break during
 * international internet blackouts.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");

const issues = [];
const passed = [];

function checkFileContains(relPath, pattern, shouldContain, description) {
  const fullPath = path.join(REPO_ROOT, relPath);
  if (!fs.existsSync(fullPath)) {
    issues.push(`[MISSING FILE] ${relPath} does not exist.`);
    return;
  }
  const content = fs.readFileSync(fullPath, "utf-8");
  const matches = pattern.test(content);
  if (shouldContain && !matches) {
    issues.push(`[FAILED] ${relPath}: Expected to match ${pattern} (${description})`);
  } else if (!shouldContain && matches) {
    issues.push(`[FAILED] ${relPath}: Found forbidden pattern ${pattern} (${description})`);
  } else {
    passed.push(`[PASSED] ${relPath}: ${description}`);
  }
}

function scanForbiddenUrlsInDir(dirRelPath, fileExtensions, forbiddenRegexes) {
  const fullDir = path.join(REPO_ROOT, dirRelPath);
  if (!fs.existsSync(fullDir)) return;

  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name === "node_modules" || entry.name === ".next" || entry.name === ".venv") continue;
      const entryPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(entryPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (fileExtensions.includes(ext)) {
          const content = fs.readFileSync(entryPath, "utf-8");
          for (const { regex, label } of forbiddenRegexes) {
            if (regex.test(content)) {
              issues.push(`[EXTERNAL DEPENDENCY] In ${path.relative(REPO_ROOT, entryPath)}: found ${label}`);
            }
          }
        }
      }
    }
  }

  walk(fullDir);
}

console.log("================================================================================");
console.log("       Endoora National Network (Net Melli) Resilience & Readiness Audit         ");
console.log("================================================================================\n");

// 1. Font Independence Check
checkFileContains(
  "apps/web/app/fonts.ts",
  /next\/font\/local/,
  true,
  "Persian fonts load locally via next/font/local (no Google Fonts build-time network requirement)"
);

checkFileContains(
  "apps/web/app/fonts.ts",
  /next\/font\/google/,
  false,
  "No vulnerable next/font/google imports in fonts.ts"
);

// 2. Next.js Standalone Config
checkFileContains(
  "apps/web/next.config.ts",
  /output:\s*"standalone"/,
  true,
  "Next.js is configured with output: 'standalone' for self-hosted containerization"
);

// 3. Nginx OCSP Stapling Safety
checkFileContains(
  "infra/nginx/conf.d/endoora.conf",
  /ssl_stapling\s+off;/,
  true,
  "Nginx explicitly disables OCSP stapling to prevent TLS handshake freeze during foreign routing drops"
);

// 4. Docker Production Compose
checkFileContains(
  "infra/docker-compose.prod.yml",
  /container_name:\s*endoora-prod-nginx/,
  true,
  "Production docker-compose includes domestic reverse proxy container"
);

// 5. Scan for Forbidden External CDNs and APIs in Frontend Source
const forbiddenPatterns = [
  { regex: /https?:\/\/fonts\.googleapis\.com/i, label: "Google Fonts CDN" },
  { regex: /https?:\/\/fonts\.gstatic\.com/i, label: "Google Fonts Static CDN" },
  { regex: /https?:\/\/cdnjs\.cloudflare\.com/i, label: "Cloudflare CDNJS" },
  { regex: /https?:\/\/cdn\.jsdelivr\.net/i, label: "jsDelivr CDN" },
  { regex: /https?:\/\/unpkg\.com/i, label: "Unpkg CDN" },
  { regex: /https?:\/\/(?:www\.)?google\.com\/recaptcha/i, label: "Google reCAPTCHA" },
  { regex: /https?:\/\/(?:www\.)?googletagmanager\.com/i, label: "Google Tag Manager" },
  { regex: /https?:\/\/(?:www\.)?google-analytics\.com/i, label: "Google Analytics" },
];

scanForbiddenUrlsInDir("apps/web/app", [".ts", ".tsx", ".css", ".html"], forbiddenPatterns);
scanForbiddenUrlsInDir("packages/ui/src", [".ts", ".tsx", ".css"], forbiddenPatterns);

// Report Results
for (const p of passed) {
  console.log(`\x1b[32m✔ ${p}\x1b[0m`);
}

if (issues.length > 0) {
  console.log("\n\x1b[31mFound issues compromising National Network resilience:\x1b[0m");
  for (const issue of issues) {
    console.log(`\x1b[31m✖ ${issue}\x1b[0m`);
  }
  process.exit(1);
} else {
  console.log("\n\x1b[32m✔ ZERO external runtime dependencies detected. All checks passed!\x1b[0m");
  console.log("\x1b[32m✔ Endoora is fully equipped for uninterrupted operation inside Iran.\x1b[0m\n");
}
