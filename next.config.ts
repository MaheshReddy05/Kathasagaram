import type { NextConfig } from "next";

/**
 * Static export so the app can be hosted anywhere (GitHub Pages included).
 * NEXT_PUBLIC_BASE_PATH is set by the Pages workflow to the repo sub-path,
 * e.g. "/Kathasagaram"; it is empty for local development.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
