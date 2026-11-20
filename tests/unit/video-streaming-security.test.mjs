import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import os from "os";
import { NextRequest } from "next/server.js";
import { GET, HEAD } from "../../apps/web/app/api/videos/stream/route.ts";
import nextConfig from "../../apps/web/next.config.ts";

console.log("Running Video Streaming Range & CSP Tests (F25)...");

// Setup isolated temporary video storage directory
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "endoora_video_test_"));
const testLevelFolder = path.join(tmpDir, "A1 level");
fs.mkdirSync(testLevelFolder, { recursive: true });

// Create a synthetic 1000-byte video file
const videoContent = Buffer.alloc(1000, 0x42);
const videoFileName = "AEF_Starter_Unit1.mp4";
fs.writeFileSync(path.join(testLevelFolder, videoFileName), videoContent);

process.env.ENDOORA_VIDEO_STORAGE_PATH = tmpDir;

try {
  // Test 1: Full content GET returns 200 with Accept-Ranges
  {
    const req = new NextRequest(
      `http://localhost:3000/api/videos/stream?series=aef&level=a1&file=${videoFileName}`,
      { method: "GET" }
    );
    const res = await GET(req);
    assert.equal(res.status, 200, "Full content request must return 200");
    assert.equal(res.headers.get("Accept-Ranges"), "bytes");
    assert.equal(res.headers.get("Content-Length"), "1000");
    assert.equal(res.headers.get("Content-Type"), "video/mp4");
    console.log("✓ Full video GET returns 200 OK with Accept-Ranges: bytes");
  }

  // Test 2: Standard Byte-Range request (HTTP 206 Partial Content)
  {
    const req = new NextRequest(
      `http://localhost:3000/api/videos/stream?series=aef&level=a1&file=${videoFileName}`,
      {
        method: "GET",
        headers: { Range: "bytes=0-99" },
      }
    );
    const res = await GET(req);
    assert.equal(res.status, 206, "Byte-range request must return 206 Partial Content");
    assert.equal(res.headers.get("Content-Range"), "bytes 0-99/1000");
    assert.equal(res.headers.get("Content-Length"), "100");
    assert.equal(res.headers.get("Accept-Ranges"), "bytes");
    assert.equal(res.headers.get("Content-Type"), "video/mp4");
    console.log("✓ Standard Range request (bytes=0-99) returns 206 Partial Content");
  }

  // Test 3: Open-ended Range request (e.g. seeking: bytes=500-)
  {
    const req = new NextRequest(
      `http://localhost:3000/api/videos/stream?series=aef&level=a1&file=${videoFileName}`,
      {
        method: "GET",
        headers: { Range: "bytes=500-" },
      }
    );
    const res = await GET(req);
    assert.equal(res.status, 206);
    assert.equal(res.headers.get("Content-Range"), "bytes 500-999/1000");
    assert.equal(res.headers.get("Content-Length"), "500");
    console.log("✓ Seeking Range request (bytes=500-) returns remaining 500 bytes");
  }

  // Test 4: Suffix Range request (e.g. mobile Safari tail probe: bytes=-200)
  {
    const req = new NextRequest(
      `http://localhost:3000/api/videos/stream?series=aef&level=a1&file=${videoFileName}`,
      {
        method: "GET",
        headers: { Range: "bytes=-200" },
      }
    );
    const res = await GET(req);
    assert.equal(res.status, 206);
    assert.equal(res.headers.get("Content-Range"), "bytes 800-999/1000");
    assert.equal(res.headers.get("Content-Length"), "200");
    console.log("✓ Suffix Range request (bytes=-200) returns last 200 bytes for mobile Safari");
  }

  // Test 5: Unsatisfiable Range returns 416
  {
    const req = new NextRequest(
      `http://localhost:3000/api/videos/stream?series=aef&level=a1&file=${videoFileName}`,
      {
        method: "GET",
        headers: { Range: "bytes=2000-3000" },
      }
    );
    const res = await GET(req);
    assert.equal(res.status, 416, "Out-of-bounds range must return 416");
    assert.equal(res.headers.get("Content-Range"), "bytes */1000");
    console.log("✓ Invalid Range returns 416 Range Not Satisfiable");
  }

  // Test 6: HEAD request returns metadata without payload
  {
    const req = new NextRequest(
      `http://localhost:3000/api/videos/stream?series=aef&level=a1&file=${videoFileName}`,
      { method: "HEAD" }
    );
    const res = await HEAD(req);
    assert.equal(res.status, 200);
    assert.equal(res.headers.get("Accept-Ranges"), "bytes");
    assert.equal(res.headers.get("Content-Length"), "1000");
    console.log("✓ HEAD request returns Accept-Ranges and Content-Length");
  }

  // Test 7: Configured domestic CDN / Object Storage fallback
  {
    process.env.ENDOORA_MEDIA_CDN_URL = "https://cdn.endoora.ir/media";
    const req = new NextRequest(
      `http://localhost:3000/api/videos/stream?series=speakout&level=b1&file=non_existent_video.mp4`,
      { method: "GET" }
    );
    const res = await GET(req);
    assert.equal(res.status, 307, "Non-local video must redirect to CDN URL");
    const location = res.headers.get("location");
    assert.ok(location?.startsWith("https://cdn.endoora.ir/media/media-so-b1/"), `Expected domestic CDN redirect, got: ${location}`);
    console.log("✓ Fallback uses configured domestic CDN (ArvanCloud / S3 / domestic media)");
  }

  // Test 8: Content Security Policy includes media-src allowing video origins
  {
    const headerConfigs = await nextConfig.headers();
    const globalHeaders = headerConfigs.find((h) => h.source === "/(.*)")?.headers;
    const csp = globalHeaders?.find((h) => h.key === "Content-Security-Policy")?.value;
    assert.ok(csp, "Content-Security-Policy header must be configured");
    assert.ok(csp.includes("media-src"), "CSP must include media-src directive");
    assert.ok(csp.includes("https://*.arvanstorage.ir"), "CSP must allow domestic ArvanCloud storage");
    assert.ok(csp.includes("https://*.endoora.ir"), "CSP must allow endoora domain CDN");
    console.log("✓ CSP permits configured video hosting origins and domestic storage");
  }

  console.log("ALL Video Streaming and CSP tests PASSED!");
} finally {
  fs.rmSync(tmpDir, { recursive: true, force: true });
}
