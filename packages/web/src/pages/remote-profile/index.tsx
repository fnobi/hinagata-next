import { makeSubPageMetadata } from "~/feature/defaultMetadata";
import { PAGE_REMOTE_PROFILE } from "~/feature/page-path";
import PageMeta from "~/component/PageMeta";
import RemoteProfileScene from "~/component/RemoteProfileScene";
import ASSETS_OGP_ABOUT from "~/asset/meta/ogp-about.png";

const metadata = makeSubPageMetadata({
  page: PAGE_REMOTE_PROFILE,
  subPageTitle: "リストサンプル（DB保存）",
  shareImageAsset: ASSETS_OGP_ABOUT
});

const PageRemoteProfile = () => (
  <PageMeta metadata={metadata}>
    <RemoteProfileScene />
  </PageMeta>
);

export default PageRemoteProfile;
