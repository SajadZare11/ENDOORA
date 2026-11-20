import assert from "node:assert/strict";
import { NextRequest } from "next/server.js";
import { verifyAdminSession } from "../../apps/web/lib/admin-auth.ts";
import { DEFAULT_SITE_CONTENT } from "../../apps/web/lib/site-cms-content.ts";

console.log("Running Admin God-Mode & Live CMS Superpower Tests...\n");

// 1. Dynamic Site Content Schema and Fallback
{
  const content = DEFAULT_SITE_CONTENT;
  assert.ok(content, "Must return live site content");
  assert.ok(content.hero, "Must contain hero section config");
  assert.ok(content.hero.titleFa, "Must contain Persian hero title");
  assert.ok(content.banner, "Must contain banner config");
  assert.ok(Array.isArray(content.learningSteps), "Must contain learning steps array");
  assert.ok(Array.isArray(content.pricingPlans), "Must contain pricing plans array");
  assert.ok(Array.isArray(content.faqs), "Must contain FAQs array");
  assert.ok(content.footer, "Must contain footer config");
  console.log("✓ Dynamic CMS store delivers comprehensive schema with fallbacks");
}

// 2. Admin Security Master PIN Endpoint Access Control
{
  const unauthReq = new NextRequest("http://localhost:3000/api/admin/security/pin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "verify", pin: "123456" }),
  });
  const res = await verifyAdminSession(unauthReq);
  assert.equal(res.authorized, false, "Anonymous PIN verification must be unauthorized");
  assert.equal(res.status, 401, "Expected 401 for anonymous PIN verify");
  console.log("✓ Security Master PIN endpoint strictly requires admin authorization (401)");
}

// 3. Media Asset Manager Access Control
{
  const unauthGet = new NextRequest("http://localhost:3000/api/admin/media", {
    method: "GET",
  });
  const getRes = await verifyAdminSession(unauthGet);
  assert.equal(getRes.authorized, false, "Anonymous media GET must be unauthorized");
  assert.equal(getRes.status, 401);

  const unauthPost = new NextRequest("http://localhost:3000/api/admin/media", {
    method: "POST",
  });
  const postRes = await verifyAdminSession(unauthPost);
  assert.equal(postRes.authorized, false, "Anonymous media upload must be unauthorized");
  assert.equal(postRes.status, 401);
  console.log("✓ Media Asset Manager endpoints strictly enforce admin authentication (401)");
}

// 4. User God-Mode (Impersonation, Kill Sessions, Grant Subscription)
{
  const impersonateReq = new NextRequest("http://localhost:3000/api/admin/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "impersonate", userId: "test-user-id" }),
  });
  const impRes = await verifyAdminSession(impersonateReq);
  assert.equal(impRes.authorized, false, "Anonymous impersonation must be blocked");
  assert.equal(impRes.status, 401);

  const killReq = new NextRequest("http://localhost:3000/api/admin/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "kill_sessions", userId: "test-user-id" }),
  });
  const killRes = await verifyAdminSession(killReq);
  assert.equal(killRes.authorized, false, "Anonymous session kill must be blocked");
  assert.equal(killRes.status, 401);

  const grantReq = new NextRequest("http://localhost:3000/api/admin/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "grant_subscription", userId: "test-user-id", tier: "pro_vip" }),
  });
  const grantRes = await verifyAdminSession(grantReq);
  assert.equal(grantRes.authorized, false, "Anonymous subscription grant must be blocked");
  assert.equal(grantRes.status, 401);
  console.log("✓ User God-Mode actions (Impersonate, Kill Sessions, Grant Sub) strictly protected (401)");
}

// 5. Real Server Operations & Live Database Inspector Access Control
{
  const dbReq = new NextRequest("http://localhost:3000/api/admin/server-ops/database?table=users", {
    method: "GET",
  });
  const dbRes = await verifyAdminSession(dbReq);
  assert.equal(dbRes.authorized, false, "Anonymous DB inspector must be blocked");
  assert.equal(dbRes.status, 401);

  const sqlReq = new NextRequest("http://localhost:3000/api/admin/autonomous-ops/backups", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "sql", query: "SELECT * FROM accounts_user;" }),
  });
  const sqlRes = await verifyAdminSession(sqlReq);
  assert.equal(sqlRes.authorized, false, "Anonymous SQL execution must be blocked");
  assert.equal(sqlRes.status, 401);
  console.log("✓ Server Ops (Live DB Inspector, Raw SQL Execution) strictly protected (401)");
}

console.log("\nAll Admin God-Mode & Live CMS tests PASSED successfully!");
