const BASE_PATH = "";

const ENV = {
  SITE_ORIGIN: process.env.SITE_ORIGIN || "https://example.com"
};

module.exports = {
  basePath: BASE_PATH,
  env: ENV,
  trailingSlash: true,
  webpack: config => {
    config.module.rules.push({
      loader: "file-loader",
      test: /\.(mp4|mp3)$/i,
      options: {
        publicPath: `${BASE_PATH}/_next/static/files`,
        outputPath: "static/files"
      },
    });
    return config;
  }
};
