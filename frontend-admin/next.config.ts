import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: process.env.NODE_ENV === 'production' ? '/admin' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/admin' : '',
  trailingSlash: true,
  output: 'standalone',
};

export default nextConfig;
