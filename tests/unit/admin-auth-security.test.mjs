import assert from "node:assert/strict";
import { NextRequest } from "next/server.js";
import { verifyAdminSession } from "../../apps/web/lib/admin-auth.ts";

console.log("Running Admin Auth & CSRF Unit Tests...");

// 1. Anonymous GET request
{
  const req = new NextRequest("http://localhost:3000/api/admin/users", {
    method: "GET",
  });
  const res = await verifyAdminSession(req);
  assert.equal(res.authorized, false, "Anonymous request must be unauthorized");
  assert.equal(res.status, 401, "Expected 401 for anonymous request");
  console.log("✓ Anonymous GET is rejected with 401");
}

// 2. Anonymous POST request
{
  const req = new NextRequest("http://localhost:3000/api/admin/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "adjust_wallet" }),
  });
  const res = await verifyAdminSession(req);
  assert.equal(res.authorized, false);
  assert.equal(res.status, 401);
  console.log("✓ Anonymous POST is rejected with 401");
}

// 3. Mutating request with session but missing CSRF header
{
  const req = new NextRequest("http://localhost:3000/api/admin/users", {
    method: "POST",
    headers: {
      cookie: "sessionid=test_session_id; csrftoken=valid_token_123",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action: "adjust_wallet" }),
  });
  const res = await verifyAdminSession(req);
  assert.equal(res.authorized, false);
  assert.equal(res.status, 403, "Expected 403 for missing CSRF header");
  console.log("✓ POST with missing CSRF header is rejected with 403");
}

// 4. Mutating request with mismatched CSRF header
{
  const req = new NextRequest("http://localhost:3000/api/admin/users", {
    method: "POST",
    headers: {
      cookie: "sessionid=test_session_id; csrftoken=valid_token_123",
      "x-csrftoken": "forged_different_token",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action: "adjust_wallet" }),
  });
  const res = await verifyAdminSession(req);
  assert.equal(res.authorized, false);
  assert.equal(res.status, 403, "Expected 403 for mismatched CSRF header");
  console.log("✓ POST with mismatched CSRF header is rejected with 403");
}

// 5. Mutating request with matching x-admin-csrf header
{
  const req = new NextRequest("http://localhost:3000/api/admin/users", {
    method: "POST",
    headers: {
      cookie: "sessionid=test_session_id; csrftoken=valid_token_123",
      "x-admin-csrf": "valid_token_123",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action: "adjust_wallet" }),
  });
  const res = await verifyAdminSession(req);
  assert.notEqual(res.status, 403, "x-admin-csrf should pass CSRF verification");
  console.log("✓ POST with matching x-admin-csrf header passes CSRF check");
}

import { isPrivateOrReservedIp, validateWebhookUrl } from "../../apps/web/lib/ssrf-protection.ts";

console.log("\nRunning SSRF Protection Tests...");

// 6. SSRF IP checks
{
  assert.equal(isPrivateOrReservedIp("127.0.0.1"), true, "Loopback must be private");
  assert.equal(isPrivateOrReservedIp("10.0.0.1"), true, "RFC1918 10.x must be private");
  assert.equal(isPrivateOrReservedIp("192.168.1.1"), true, "RFC1918 192.168.x must be private");
  assert.equal(isPrivateOrReservedIp("172.16.0.1"), true, "RFC1918 172.16.x must be private");
  assert.equal(isPrivateOrReservedIp("169.254.169.254"), true, "Cloud metadata IP must be private");
  assert.equal(isPrivateOrReservedIp("::1"), true, "IPv6 loopback must be private");
  assert.equal(isPrivateOrReservedIp("fe80::1"), true, "IPv6 link-local must be private");
  assert.equal(isPrivateOrReservedIp("8.8.8.8"), false, "Public IP 8.8.8.8 must not be private");
  assert.equal(isPrivateOrReservedIp("1.1.1.1"), false, "Public IP 1.1.1.1 must not be private");
  console.log("✓ SSRF IP classification accurately identifies private vs public addresses");
}

// 7. SSRF Webhook URL validation
{
  const loopback = await validateWebhookUrl("http://127.0.0.1:8000/webhook");
  assert.equal(loopback.isSafe, false);
  console.log("✓ Loopback URL rejected by SSRF validator");

  const metadata = await validateWebhookUrl("http://169.254.169.254/latest/meta-data/");
  assert.equal(metadata.isSafe, false);
  console.log("✓ Cloud metadata URL rejected by SSRF validator");

  const localHost = await validateWebhookUrl("http://localhost:3000/api/hook");
  assert.equal(localHost.isSafe, false);
  console.log("✓ localhost domain rejected by SSRF validator");

  const badScheme = await validateWebhookUrl("ftp://example.com/hook");
  assert.equal(badScheme.isSafe, false);
  console.log("✓ Non-HTTP(S) scheme rejected by SSRF validator");

  const userPass = await validateWebhookUrl("https://admin:pass@example.com/hook");
  assert.equal(userPass.isSafe, false);
  console.log("✓ Embedded credentials in URL rejected by SSRF validator");

  const badPort = await validateWebhookUrl("http://example.com:22/hook");
  assert.equal(badPort.isSafe, false);
  console.log("✓ Forbidden port (22) rejected by SSRF validator");
}

console.log("\nAll Admin Auth & Security checks PASSED successfully!");
