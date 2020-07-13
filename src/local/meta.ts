import ASSETS_OGP from "~/assets/meta/ogp.png";
import ASSETS_FAVICON from "~/assets/meta/favicon.ico";

const { basePath } = require("../../buildConfig");

export type Meta = {
  TITLE: string;
  DESCRIPTION: string;
  URL: string;
  KEYWORDS: string[];
  SHARE_IMAGE_URL: string;
  FAVICON_PATH: string;
};

const TITLE = "hinagata-next";
const DESCRIPTION = "Awsome next.js project.";
const KEYWORDS = ["next", "javascript"];
const URL = `${process.env.SITE_ORIGIN}${basePath}`;
const SHARE_IMAGE_URL = `${URL}${ASSETS_OGP}`;
const FAVICON_PATH = ASSETS_FAVICON;

export default {
  TITLE,
  DESCRIPTION,
  KEYWORDS,
  URL,
  SHARE_IMAGE_URL,
  FAVICON_PATH
} as Meta;
