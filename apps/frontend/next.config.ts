import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  transpilePackages: ["@challenge/dtos", "@challenge/api", "@challenge/utils"],
};

export default nextConfig;
