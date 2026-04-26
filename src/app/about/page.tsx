import MockCenteringLayout from "~/common/components/MockCenteringLayout";
import { makeSubPageMetadata } from "~/features/lib/defaultMetadata";
import { PAGE_ABOUT } from "~/features/lib/page-path";
import ASSETS_OGP_ABOUT from "~/assets/meta/ogp-about.png";

export const metadata = makeSubPageMetadata({
  page: PAGE_ABOUT,
  subPageTitle: "About",
  shareImageAsset: ASSETS_OGP_ABOUT
});

const PageAbout = () => <MockCenteringLayout>About Page</MockCenteringLayout>;

export default PageAbout;
