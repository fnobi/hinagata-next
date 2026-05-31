import { makeSubPageMetadata } from "~/feature/defaultMetadata";
import { PAGE_ABOUT } from "~/feature/page-path";
import MockCenteringLayout from "~/component/MockCenteringLayout";
import ASSETS_OGP_ABOUT from "~/asset/meta/ogp-about.png";

export const metadata = makeSubPageMetadata({
  page: PAGE_ABOUT,
  subPageTitle: "About",
  shareImageAsset: ASSETS_OGP_ABOUT
});

const PageAbout = () => <MockCenteringLayout>About Page</MockCenteringLayout>;

export default PageAbout;
