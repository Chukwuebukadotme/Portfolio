import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The design canvas shipped hash routes (#/work/budgetview). Those links
  // exist in the wild, so the client redirects them; these cover the server side.
  async redirects() {
    return [
      { source: "/work/index", destination: "/work", permanent: true },
    ];
  },
};

export default nextConfig;
