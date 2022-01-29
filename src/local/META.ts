import { basePath } from "~/local/constants";
import { ImageMetaField } from "~/components/MetaSettings";
import ASSETS_OGP from "~/assets/meta/ogp.png";
import ASSETS_FAVICON from "~/assets/meta/favicon.ico";

const META: {
  TITLE: string;
  DESCRIPTION?: string;
  URL: string;
  KEYWORDS?: string[];
  DEFAULT_SHARE_IMAGE?: ImageMetaField;
  FAVICON_IMAGE?: ImageMetaField;
} = {
  TITLE: "hinagata-next",
  DESCRIPTION: "Awsome next.js project.",
  KEYWORDS: ["next", "javascript"],
  URL: `${process.env.SITE_ORIGIN}${basePath}`,
  DEFAULT_SHARE_IMAGE: ASSETS_OGP,
  FAVICON_IMAGE: ASSETS_FAVICON
};

export default META;
