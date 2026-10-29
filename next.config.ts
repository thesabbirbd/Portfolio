import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev only: let phones/tablets on the local network (e.g. http://192.168.1.114:3000) use the
  // dev server, including hot reload. Has no effect on production builds.
  allowedDevOrigins: ["192.168.*.*"],
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  images: {
    // Only the default quality is used (Phase 1 removed quality={100}); fewer variants to optimise.
    qualities: [75],
  },
  // Type errors now fail the build (v4.0.1: the 9 test-file errors that needed
  // `ignoreBuildErrors` were fixed, and `tsc --noEmit` is clean).
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
