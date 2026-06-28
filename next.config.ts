import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.prod.website-files.com",
        pathname: "/6870021f10cb5579739f03a5/**",
      },
    ],
  },
};

export default nextConfig;
