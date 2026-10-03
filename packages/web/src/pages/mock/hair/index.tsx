import { makeSubPageMetadata } from "~/feature/defaultMetadata";
import { PAGE_MOCK_HAIR } from "~/feature/page-path";
import PageMeta from "~/component/PageMeta";
import HairPatchScene from "~/component/HairPatchScene";
import ASSETS_OGP_ABOUT from "~/asset/meta/ogp-about.png";

const metadata = makeSubPageMetadata({
  page: PAGE_MOCK_HAIR,
  subPageTitle: "ヘアパッチ",
  shareImageAsset: ASSETS_OGP_ABOUT
});

const PageMockHair = () => (
  <PageMeta metadata={metadata}>
    <HairPatchScene />
  </PageMeta>
);

export default PageMockHair;
