import type { NextConfig } from "next";

const apiInternalUrl = (
  process.env.ENDOORA_API_INTERNAL_URL ?? "http://127.0.0.1:8000"
).replace(/\/+$/, "");

const nextConfig: NextConfig = {
  transpilePackages: ["@endoora/ui"],
  poweredByHeader: false,

  // Allow development access through 127.0.0.1.
  // This keeps the frontend host consistent with the local Django API/admin.
  allowedDevOrigins: ["127.0.0.1"],

  // Django API routes intentionally use trailing slashes.
  // Preserve them instead of letting Next normalize the URL.
  skipTrailingSlashRedirect: true,

  async rewrites() {
    return [
      {
        source: "/api/:path*/",
        destination: `${apiInternalUrl}/api/:path*/`,
      },
      {
        source: "/backend/api/:path*/",
        destination: `${apiInternalUrl}/api/:path*/`,
      },
    ];
  },
};

export default nextConfig;
