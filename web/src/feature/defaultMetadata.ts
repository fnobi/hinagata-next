import { type Metadata } from "next";
import makeMetadata from "~/common/makeMetadata";
import { PAGE_TOP } from "~/feature/page-path";
import ASSETS_OGP from "~/asset/meta/ogp.png";
import ASSETS_FAVICON from "~/asset/meta/favicon.ico";

const DEFAULT_TITLE = "hinagata-next";
const DEFAULT_DESCRIPTION = "Awsome next.js project.";
const DEFAULT_KEYWORDS = ["react", "typescript", "next.js"];

const makePageMetaTitle = (...pageTitle: string[]) =>
  [...pageTitle, DEFAULT_TITLE].join(" | ");

export const defaultMetadata: Metadata = makeMetadata({
  page: PAGE_TOP,
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  shareImageAsset: ASSETS_OGP,
  keywords: DEFAULT_KEYWORDS,
  faviconUrl: ASSETS_FAVICON.src
});

export const makeSubPageMetadata = ({
  subPageTitle,
  title,
  ...rest
}: Parameters<typeof makeMetadata>[0] & {
  subPageTitle?: string;
}) => {
  return makeMetadata({
    ...rest,
    title: subPageTitle ? makePageMetaTitle(subPageTitle) : title
  });
};
