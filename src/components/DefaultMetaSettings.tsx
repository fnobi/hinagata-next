import { FC } from "react";
import { PAGE_TOP } from "~/local/page-path";
import MetaSettings from "~/components/MetaSettings";
import ASSETS_OGP from "~/assets/meta/ogp.png";
import ASSETS_FAVICON from "~/assets/meta/favicon.ico";

const DEFAULT_TITLE = "hinagata-next";
const DEFAULT_DESCRIPTION = "Awsome next.js project.";
const DEFAULT_KEYWORDS = ["react", "typescript", "next.js"];

export const makePageMetaTitle = (...pageTitle: string[]) =>
  [...pageTitle, DEFAULT_TITLE].join(" | ");

const DefaultMetaSettings: FC = ({ children }) => (
  <MetaSettings
    page={PAGE_TOP}
    title={DEFAULT_TITLE}
    description={DEFAULT_DESCRIPTION}
    shareImage={ASSETS_OGP}
    keywords={DEFAULT_KEYWORDS}
    favicon={ASSETS_FAVICON}
  >
    {children}
  </MetaSettings>
);

export default DefaultMetaSettings;
