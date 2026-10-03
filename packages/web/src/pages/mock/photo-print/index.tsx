import { makeSubPageMetadata } from "~/feature/defaultMetadata";
import { PAGE_MOCK_PHOTO_PRINT } from "~/feature/page-path";
import PageMeta from "~/component/PageMeta";
import PhotoPrintMockScene from "~/component/PhotoPrintMockScene";
import ASSETS_OGP_ABOUT from "~/asset/meta/ogp-about.png";

const metadata = makeSubPageMetadata({
  page: PAGE_MOCK_PHOTO_PRINT,
  subPageTitle: "写真プリントサンプル",
  shareImageAsset: ASSETS_OGP_ABOUT
});

const PageMockPhotoPrint = () => (
  <PageMeta metadata={metadata}>
    <PhotoPrintMockScene />
  </PageMeta>
);

export default PageMockPhotoPrint;
