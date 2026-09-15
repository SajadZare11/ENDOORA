import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();

console.log("🛡️  Running Endoora Monorepo Security & Penetration Audit (SEC-003)...");

const checks = [];

function check(name, fn) {
  try {
    fn();
    checks.push({ name, status: "PASS" });
    console.log(`  ✓ ${name}`);
  } catch (err) {
    checks.push({ name, status: "FAIL", error: err.message });
    console.error(`  ✗ ${name}: ${err.message}`);
  }
}

// 1. Secrets & Private Key Exposure Scan
check("Zero exposed production secrets or raw private keys", () => {
  const sensitivePatterns = [
    /-----BEGIN (RSA|EC|OPENSSH|PGP) PRIVATE KEY-----/,
    /AKIA[0-9A-Z]{16}/,
    /ghp_[0-9a-zA-Z]{36}/,
    /sk_live_[0-9a-zA-Z]{24}/,
  ];

  const searchDirs = [
    path.join(root, "apps", "api"),
    path.join(root, "apps", "web"),
    path.join(root, "packages"),
  ];

  function scanDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name === "node_modules" || entry.name === ".venv" || entry.name === ".next" || entry.name === "__pycache__" || entry.name === ".git") {
        continue;
      }
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (entry.isFile() && /\.(py|ts|tsx|js|mjs|json|env|md)$/.test(entry.name)) {
        const content = fs.readFileSync(fullPath, "utf8");
        for (const pattern of sensitivePatterns) {
          if (pattern.test(content)) {
            throw new Error(`Potential secret leak detected in ${path.relative(root, fullPath)}`);
          }
        }
      }
    }
  }

  for (const d of searchDirs) {
    if (fs.existsSync(d)) scanDir(d);
  }
});

// 2. HTTP Security Headers in Next.js
check("Next.js HTTP security headers configured in next.config.ts", () => {
  const configPath = path.join(root, "apps", "web", "next.config.ts");
  const content = fs.readFileSync(configPath, "utf8");
  const requiredHeaders = [
    "X-Content-Type-Options",
    "X-Frame-Options",
    "X-XSS-Protection",
    "Referrer-Policy",
    "Permissions-Policy",
    "Content-Security-Policy",
  ];
  for (const h of requiredHeaders) {
    if (!content.includes(h)) {
      throw new Error(`Missing HTTP security header in next.config.ts: ${h}`);
    }
  }
});

// 3. Django Security Settings
check("Django core security settings active in base.py", () => {
  const settingsPath = path.join(root, "apps", "api", "endoora_api", "settings", "base.py");
  const content = fs.readFileSync(settingsPath, "utf8");
  const requiredSettings = [
    "CSRF_COOKIE_HTTPONLY",
    "SESSION_COOKIE_HTTPONLY",
    "SECURE_BROWSER_XSS_FILTER",
    "SECURE_CONTENT_TYPE_NOSNIFF",
    "X_FRAME_OPTIONS",
  ];
  for (const s of requiredSettings) {
    if (!content.includes(s)) {
      throw new Error(`Missing Django security setting in base.py: ${s}`);
    }
  }
});

// 4. Security Apps Registered
check("Security and Data Protection apps registered in Django settings", () => {
  const settingsPath = path.join(root, "apps", "api", "endoora_api", "settings", "base.py");
  const content = fs.readFileSync(settingsPath, "utf8");
  if (!content.includes("security.apps.SecurityConfig")) {
    throw new Error("Missing security.apps.SecurityConfig in INSTALLED_APPS");
  }
  if (!content.includes("data_protection.apps.DataProtectionConfig")) {
    throw new Error("Missing data_protection.apps.DataProtectionConfig in INSTALLED_APPS");
  }
});

// 5. Input Sanitization & Throttling
check("Security middleware and throttling configured", () => {
  const settingsPath = path.join(root, "apps", "api", "endoora_api", "settings", "base.py");
  const content = fs.readFileSync(settingsPath, "utf8");
  if (!content.includes("SecurityHeadersMiddleware")) {
    throw new Error("SecurityHeadersMiddleware not in MIDDLEWARE");
  }
  if (!content.includes("InputSanitizationMiddleware")) {
    throw new Error("InputSanitizationMiddleware not in MIDDLEWARE");
  }
  if (!content.includes("RoleBasedThrottle")) {
    throw new Error("RoleBasedThrottle not in DEFAULT_THROTTLE_CLASSES");
  }
});

const failed = checks.filter((c) => c.status === "FAIL");
if (failed.length > 0) {
  console.error(`\n❌ Security audit failed with ${failed.length} failure(s).`);
  process.exit(1);
}

console.log(`\n✅ Security audit passed: ${checks.length}/${checks.length} checks verified.\n`);
