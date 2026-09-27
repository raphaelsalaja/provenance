import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: process.env.NODE_ENV === "production" ? "/provenance" : undefined,
  reactStrictMode: true,
};

export default nextConfig;
