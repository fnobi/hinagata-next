import { NextConfig } from "next";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  basePath: BASE_PATH,
  output: "export",
  trailingSlash: true,
  transpilePackages: ["@emotion/react", "@emotion/styled", "@emotion/cache"]
};

export default nextConfig;
