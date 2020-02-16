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

    // file loader
    config.module.rules.push({
      test: /\.(png|jpg|gif)$/i,
      options: {
        publicPath: "/_next/static/assets",
        outputPath: "static/assets"
      },
      loader: "file-loader"
    });

    return config;
  }
};
