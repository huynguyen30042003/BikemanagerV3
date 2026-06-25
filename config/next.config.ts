import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          "https://localhost:5001/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;