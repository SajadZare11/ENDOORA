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

console.log("\nAll Admin Auth Security checks PASSED successfully!");
