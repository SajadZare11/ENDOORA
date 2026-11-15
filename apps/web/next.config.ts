import type { NextConfig } from "next";

const apiInternalUrl = (
  process.env.ENDOORA_API_INTERNAL_URL ?? "http://127.0.0.1:8000"
).replace(/\/+$/, "");

const nextConfig: NextConfig = {
  turbopack: {},
  output: "standalone",
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

  async redirects() {
    return [
      {
        source: "/downloads",
        destination: "/books",
        permanent: true,
      },
      {
        source: "/downloads/:path*",
        destination: "/books/:path*",
        permanent: true,
      },
      {
        source: "/learner/today",
        destination: "/today",
        permanent: false,
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(self), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; worker-src 'self' blob:; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' http://127.0.0.1:* http://localhost:* https://huggingface.co https://*.huggingface.co https://cdn-lfs.huggingface.co https://*.hf.co https://raw.githubusercontent.com https://cdn.jsdelivr.net; frame-ancestors 'none';",
          },
        ],
      },
    ];
  },

  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      sharp$: false,
      "onnxruntime-node$": false,
    };
    return config;
  },
};

export default nextConfig;
