module.exports = {
  exportTrailingSlash: true,
  webpack: config => {
    // load shader
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      loader: 'raw-loader',
      exclude: /node_modules/
    });

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
