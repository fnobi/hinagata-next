import { makeSubPageMetadata } from "~/feature/defaultMetadata";
import { PAGE_MOCK_PROFILE } from "~/feature/page-path";
import PageMeta from "~/component/PageMeta";
import MockProfileScene from "~/component/MockProfileScene";
import ASSETS_OGP_ABOUT from "~/asset/meta/ogp-about.png";

const metadata = makeSubPageMetadata({
  page: PAGE_MOCK_PROFILE,
  subPageTitle: "リストサンプル",
  shareImageAsset: ASSETS_OGP_ABOUT
});

const PageMockProfile = () => (
  <PageMeta metadata={metadata}>
    <MockProfileScene />
  </PageMeta>
);

export default PageMockProfile;
