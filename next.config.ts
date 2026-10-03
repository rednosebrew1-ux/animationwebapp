import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remotion relies on some Node.js modules — exclude them from the client bundle
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },
};

export default nextConfig;
