import { makeSubPageMetadata } from "~/feature/defaultMetadata";
import { PAGE_ABOUT } from "~/feature/page-path";
import MockCenteringLayout from "~/component/MockCenteringLayout";
import PageMeta from "~/component/PageMeta";
import ASSETS_OGP_ABOUT from "~/asset/meta/ogp-about.png";

const metadata = makeSubPageMetadata({
  page: PAGE_ABOUT,
  subPageTitle: "About",
  shareImageAsset: ASSETS_OGP_ABOUT
});

const PageAbout = () => (
  <PageMeta metadata={metadata}>
    <MockCenteringLayout>About Page</MockCenteringLayout>
  </PageMeta>
);

export default PageAbout;
