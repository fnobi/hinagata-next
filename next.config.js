const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

module.exports = {
  basePath: BASE_PATH,
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
