const BASE_PATH = "";

module.exports = {
  basePath: BASE_PATH,
  env: {
    SITE_ORIGIN: process.env.SITE_ORIGIN || "https://example.com"
  },
  trailingSlash: true,
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
      test: /\.(png|jpg|gif|ico|mp4|mp3)$/i,
      options: {
        publicPath: `${BASE_PATH}/_next/static/assets`,
        outputPath: "static/assets"
      },
      loader: "file-loader"
    });

    return config;
  }
};
