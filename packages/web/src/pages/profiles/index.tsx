import { makeSubPageMetadata } from "~/feature/defaultMetadata";
import { PAGE_PROFILES } from "~/feature/page-path";
import PageMeta from "~/component/PageMeta";
import ProfileScene from "~/component/ProfileScene";
import ASSETS_OGP from "~/asset/meta/ogp.png";

const metadata = makeSubPageMetadata({
  page: PAGE_PROFILES,
  subPageTitle: "プロフィール一覧",
  shareImageAsset: ASSETS_OGP
});

const PageProfiles = () => (
  <PageMeta metadata={metadata}>
    <ProfileScene />
  </PageMeta>
);

export default PageProfiles;
