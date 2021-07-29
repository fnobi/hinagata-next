const BASE_PATH = "";

module.exports = {
  basePath: BASE_PATH,
  env: {
    SITE_ORIGIN: process.env.SITE_ORIGIN || "https://example.com"
  },
  trailingSlash: true,
};
