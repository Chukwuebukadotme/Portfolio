import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The design canvas shipped hash routes (#/work/budgetview). Those links
  // exist in the wild, so the client redirects them; these cover the server side.
  async redirects() {
    return [
      { source: "/work/index", destination: "/work", permanent: true },
      // Retired case studies; links to them still exist in CVs and messages.
      { source: "/work/budgetview", destination: "/work", permanent: true },
      { source: "/work/referralview", destination: "/work", permanent: true },
      // Held back until they have real media and evidence; temporary, so
      // they can return at the same address.
      { source: "/work/axon-ui", destination: "/work", permanent: false },
      { source: "/work/plantify", destination: "/work", permanent: false },
      { source: "/work/mankela", destination: "/work", permanent: false },
      { source: "/work/salary-benchmark", destination: "/work", permanent: false },
    ];
  },
};

export default nextConfig;
