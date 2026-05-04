import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn11.bigcommerce.com",
      },
      {
        protocol: "https",
        hostname: "api.tremendous.com",
      },
      {
        protocol: "https",
        hostname: "testflight.tremendous.com",
      },
    ],
  },
};

export default nextConfig;
