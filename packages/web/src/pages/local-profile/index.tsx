import { makeSubPageMetadata } from "~/feature/defaultMetadata";
import { PAGE_REMOTE_PROFILE } from "~/feature/page-path";
import PageMeta from "~/component/PageMeta";
import LocalProfileScene from "~/component/LocalProfileScene";
import ASSETS_OGP_ABOUT from "~/asset/meta/ogp-about.png";

const metadata = makeSubPageMetadata({
  page: PAGE_REMOTE_PROFILE,
  subPageTitle: "リストサンプル（メモリ保存）",
  shareImageAsset: ASSETS_OGP_ABOUT
});

const PageLocalProfile = () => (
  <PageMeta metadata={metadata}>
    <LocalProfileScene />
  </PageMeta>
);

export default PageLocalProfile;
