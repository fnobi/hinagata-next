import { type ReactNode, createElement } from "react";
import { SITE_ORIGIN } from "~/common/lib/constants";
import MetaSettings, { type MetaOptions } from "~/common/lib/MetaSettings";
import { PAGE_TOP } from "~/app/lib/page-path";
import ASSETS_OGP from "~/assets/meta/ogp.png";
import ASSETS_FAVICON from "~/assets/meta/favicon.ico";

const DEFAULT_TITLE = "hinagata-next";
const DEFAULT_DESCRIPTION = "Awsome next.js project.";
const DEFAULT_KEYWORDS = ["react", "typescript", "next.js"];

export const makePageMetaTitle = (...pageTitle: string[]) =>
  [...pageTitle, DEFAULT_TITLE].join(" | ");

const DefaultMetaSettings = ({ children }: { children?: ReactNode }) => {
  const options: MetaOptions = {
    page: PAGE_TOP,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    shareImageUrl: SITE_ORIGIN + ASSETS_OGP.src,
    keywords: DEFAULT_KEYWORDS,
    faviconUrl: ASSETS_FAVICON.src,
    viewport: "width=device-width"
  };
  return createElement(MetaSettings, options, children);
};

export default DefaultMetaSettings;
