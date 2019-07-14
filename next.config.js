module.exports = {
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
    return config;
  }
};
