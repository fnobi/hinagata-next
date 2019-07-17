const posts = require("./src/data/post");

module.exports = {
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
    return config;
  }
};
