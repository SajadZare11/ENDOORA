import fs from "fs";
import path from "path";
import { expect, createRegistry } from "./helpers/assertions.mjs";

import {
  isPrivateOrReservedIp,
  validateWebhookUrl,
} from "../../../apps/web/lib/ssrf-protection.ts";

export const registry = createRegistry("Tier 4: Security, RBAC & Adversarial Suite");

const ADMIN_API_DIR = path.resolve("apps/web/app/api/admin");

// 1. SSRF Protection Tests
const ATTACK_VECTORS = [
  { url: "http://127.0.0.1:8000/api", label: "Local loopback with port" },
  { url: "http://localhost:3000/secret", label: "Localhost hostname" },
  { url: "http://169.254.169.254/latest/meta-data/", label: "AWS/GCP Cloud Metadata IMDS" },
  { url: "http://[::1]:8080", label: "IPv6 Loopback" },
  { url: "http://0.0.0.0:9000", label: "Current network 0.0.0.0/8" },
  { url: "http://10.0.0.1/admin", label: "RFC 1918 Class A Private IP" },
  { url: "http://192.168.1.1/router", label: "RFC 1918 Class C Private IP" },
  { url: "http://172.16.0.1/internal", label: "RFC 1918 Class B Private IP" },
  { url: "http://[fe80::1]/service", label: "IPv6 Link-local" },
  { url: "http://100.64.0.1/cgnat", label: "Carrier-Grade NAT Shared Space" },
  { url: "file:///etc/passwd", label: "File URI scheme hijacking" },
  { url: "gopher://127.0.0.1:6379", label: "Gopher URI scheme hijacking" },
  { url: "ftp://internal.server/file", label: "FTP URI scheme hijacking" },
  { url: "http://user:pass@example.com", label: "Embedded credentials in URL" },
  { url: "https://example.com:22/ssh", label: "Forbidden SSH port 22" },
  { url: "https://example.com:5432/db", label: "Forbidden Postgres port 5432" },
];

for (const attack of ATTACK_VECTORS) {
  registry.test(`SSRF Defense blocks ${attack.label}: ${attack.url}`, async () => {
    const res = await validateWebhookUrl(attack.url);
    expect(res.isSafe).toBe(false, `Expected SSRF rejection for ${attack.url}`);
    expect(res.error).toBeTruthy();
  });
}

registry.test("SSRF Defense allows legitimate public webhook endpoint", async () => {
  const publicUrl = "https://httpbin.org/post";
  const res = await validateWebhookUrl(publicUrl);
  expect(res.isSafe).toBe(true, `Public URL falsely rejected: ${res.error}`);
});

// 2. IP Classification Unit Invariants
registry.test("isPrivateOrReservedIp correctly classifies IP boundaries", () => {
  expect(isPrivateOrReservedIp("127.0.0.1")).toBe(true);
  expect(isPrivateOrReservedIp("10.255.255.255")).toBe(true);
  expect(isPrivateOrReservedIp("172.31.255.255")).toBe(true);
  expect(isPrivateOrReservedIp("192.168.0.1")).toBe(true);
  expect(isPrivateOrReservedIp("169.254.1.1")).toBe(true);
  expect(isPrivateOrReservedIp("::1")).toBe(true);

  // Public IPs
  expect(isPrivateOrReservedIp("8.8.8.8")).toBe(false);
  expect(isPrivateOrReservedIp("1.1.1.1")).toBe(false);
  expect(isPrivateOrReservedIp("185.143.232.1")).toBe(false);
});

// 3. Master PIN Bypass & Hardcoded Secrets Scan
registry.test("Zero hardcoded '123456' master PIN bypasses remain in admin codebase", () => {
  function scanDir(dir) {
    let matches = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory() && entry.name !== "node_modules" && entry.name !== ".next") {
        matches = matches.concat(scanDir(full));
      } else if (entry.isFile() && (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx"))) {
        const code = fs.readFileSync(full, "utf-8");
        // Look for pin === "123456" fallback bypasses
        if (/pin\s*===\s*["']123456["']/i.test(code) && !entry.name.includes("test")) {
          matches.push(path.relative(process.cwd(), full));
        }
      }
    }
    return matches;
  }

  const bypassFiles = scanDir(ADMIN_API_DIR);
  expect(bypassFiles.length).toBe(0, `Found hardcoded master PIN bypass in: ${bypassFiles.join(", ")}`);
});
