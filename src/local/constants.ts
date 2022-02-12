const config = require("../../next.config");

const { basePath } = config;

export const BASE_PATH = basePath;
export const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://example.com";
export const BASE_URL = SITE_ORIGIN + BASE_PATH;
