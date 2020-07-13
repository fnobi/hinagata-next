import ASSETS_OGP from "~/assets/meta/ogp.png";
import ASSETS_FAVICON from "~/assets/meta/favicon.ico";

const { basePath } = require("../../buildConfig");

type Meta = {
  TITLE: string;
  DESCRIPTION: string;
  URL: string;
  KEYWORDS?: string[];
  SHARE_IMAGE_PATH: string;
  FAVICON_PATH?: string;
};

export default {
  TITLE: "hinagata-next",
  DESCRIPTION: "Awsome next.js project.",
  KEYWORDS: ["next", "javascript"],
  URL: `${process.env.SITE_ORIGIN}${basePath}`,
  SHARE_IMAGE_PATH: ASSETS_OGP,
  FAVICON_PATH: ASSETS_FAVICON
} as Meta;
