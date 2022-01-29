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

    config.module.rules.push({
      loader: "raw-loader",
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/
    });

    return config;
  }
};
