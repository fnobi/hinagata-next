const config = require("../../next.config");

const { basePath } = config;

export const { SITE_ORIGIN } = process.env;
export const BASE_PATH = basePath;
