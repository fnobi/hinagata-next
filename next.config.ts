import { NextConfig } from "next";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  basePath: BASE_PATH,
  output: "export",
  trailingSlash: true,
  turbopack: {
    rules: {
      "*.mp4": {
        type: "asset"
      },
      "*.webm": {
        type: "asset"
      },
      "*.mp3": {
        type: "asset"
      }
    }
  }
};

export default nextConfig;
