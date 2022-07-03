import { NextPage } from "next";
import { PAGE_ABOUT } from "~/local/pagePath";
import AboutScene from "~/components/AboutScene";
import { makePageMetaTitle } from "~/components/DefaultMetaSettings";
import MetaSettings from "~/components/MetaSettings";
import ASSETS_OGP_ABOUT from "~/assets/meta/ogp-about.png";

const PageAbout: NextPage = () => (
  <MetaSettings
    title={makePageMetaTitle("About")}
    page={PAGE_ABOUT}
    shareImage={ASSETS_OGP_ABOUT}
  >
    <AboutScene />
  </MetaSettings>
);

export default PageAbout;
