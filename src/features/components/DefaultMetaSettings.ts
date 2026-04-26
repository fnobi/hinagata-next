import { type Metadata } from "next";
import { SITE_ORIGIN } from "~/common/lib/constants";
import { makeMetadata } from "~/common/lib/MetaSettings";
import { PAGE_TOP } from "~/features/lib/page-path";
import ASSETS_OGP from "~/assets/meta/ogp.png";
import ASSETS_FAVICON from "~/assets/meta/favicon.ico";

const DEFAULT_TITLE = "hinagata-next";
const DEFAULT_DESCRIPTION = "Awsome next.js project.";
const DEFAULT_KEYWORDS = ["react", "typescript", "next.js"];

export const makePageMetaTitle = (...pageTitle: string[]) =>
  [...pageTitle, DEFAULT_TITLE].join(" | ");

export const defaultMetadata: Metadata = makeMetadata({
  page: PAGE_TOP,
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  shareImageUrl: SITE_ORIGIN + ASSETS_OGP.src,
  keywords: DEFAULT_KEYWORDS,
  faviconUrl: ASSETS_FAVICON.src
});
