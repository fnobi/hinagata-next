import { makeSubPageMetadata } from "~/feature/defaultMetadata";
import { PAGE_IMAGE_SPLITTER } from "~/feature/page-path";
import ImageSplitterScene from "~/component/ImageSplitterScene";
import PageMeta from "~/component/PageMeta";

const metadata = makeSubPageMetadata({
  page: PAGE_IMAGE_SPLITTER,
  subPageTitle: "画像3分割ツール"
});

const PageImageSplitter = () => (
  <PageMeta metadata={metadata}>
    <ImageSplitterScene />
  </PageMeta>
);

export default PageImageSplitter;
