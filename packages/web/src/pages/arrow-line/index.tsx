import { makeSubPageMetadata } from "~/feature/defaultMetadata";
import { PAGE_ARROW_LINE } from "~/feature/page-path";
import MockStaticLayout from "~/component/MockStaticLayout";
import PageMeta from "~/component/PageMeta";
import ArrowLineCanvas from "~/component/ArrowLineCanvas";
import ASSET_ARROW_TILE from "~/asset/arrow-line/arrow-tile.svg";

const metadata = makeSubPageMetadata({
  page: PAGE_ARROW_LINE,
  subPageTitle: "Arrow Line"
});

const PageArrowLine = () => (
  <PageMeta metadata={metadata}>
    <MockStaticLayout title="クリックした点を矢印でつなぐツール">
      <ArrowLineCanvas arrowImageSrc={ASSET_ARROW_TILE.src} />
    </MockStaticLayout>
  </PageMeta>
);

export default PageArrowLine;
