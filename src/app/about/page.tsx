import { type Metadata } from "next";
import MockCenteringLayout from "~/common/components/MockCenteringLayout";
import { makeMetadata } from "~/common/lib/MetaSettings";
import { makePageMetaTitle } from "~/features/components/DefaultMetaSettings";
import { SITE_ORIGIN } from "~/common/lib/constants";
import { PAGE_ABOUT } from "~/features/lib/page-path";
import ASSETS_OGP_ABOUT from "~/assets/meta/ogp-about.png";

export const metadata: Metadata = makeMetadata({
  page: PAGE_ABOUT,
  title: makePageMetaTitle("About"),
  shareImageUrl: SITE_ORIGIN + ASSETS_OGP_ABOUT.src
});

const PageAbout = () => <MockCenteringLayout>About Page</MockCenteringLayout>;

export default PageAbout;
