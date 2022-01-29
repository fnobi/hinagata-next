module.exports = {
  basePath: "",
  env: {
    SITE_ORIGIN: process.env.SITE_ORIGIN || "https://example.com"
  },
  trailingSlash: true,
  webpack: config => {
    // load shader
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      loader: 'raw-loader',
      exclude: /node_modules/
    });

    return config;
  }
};
