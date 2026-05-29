import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kream-phinf.pstatic.net",
      },
      {
        protocol: "https",
        hostname: "*.pstatic.net",
      },
      {
        protocol: "https",
        hostname: "*.nike.com",
      },
      {
        protocol: "https",
        hostname: "*.goat.com",
      },
      {
        protocol: "https",
        hostname: "*.stockx.com",
      },
    ],
  },
};

export default nextConfig;