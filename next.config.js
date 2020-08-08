const posts = require("./src/data/post");

module.exports = {
  basePath: "",
  env: {
    SITE_ORIGIN: process.env.SITE_ORIGIN || "https://example.com"
  },
  trailingSlash: true,
  exportTrailingSlash: true,
  exportPathMap: () => {
    const base = {};
    Object.keys(posts).forEach(postId => {
      base[`/p/${postId}`] = { page: "/post", query: { postId } };
    });
    return base;
  },
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
