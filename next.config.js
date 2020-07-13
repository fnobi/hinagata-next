const { basePath } = require("./buildConfig");

module.exports = {
  env: {
    SITE_ORIGIN: process.env.SITE_ORIGIN || "https://example.com"
  },
  basePath,
  exportTrailingSlash: true,
  webpack: config => {
    // lint on save
    config.module.rules.push({
      test: /\.(js|ts|tsx|$)/,
      loader: "eslint-loader",
      enforce: "pre",
      options: {
        fix: true
      }
    });

    // file loader
    config.module.rules.push({
      test: /\.(png|jpg|gif|ico)$/i,
      options: {
        publicPath: "/_next/static/assets",
        outputPath: "static/assets"
      },
      loader: "file-loader"
    });

    return config;
  }
};
