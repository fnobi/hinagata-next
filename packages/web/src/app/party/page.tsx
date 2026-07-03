import { makeSubPageMetadata } from "~/feature/defaultMetadata";
import { PAGE_PARTY } from "~/feature/page-path";
import PartyBuilderScene from "~/component/PartyBuilderScene";
import ASSETS_OGP from "~/asset/meta/ogp.png";

export const metadata = makeSubPageMetadata({
  page: PAGE_PARTY,
  subPageTitle: "ポケモンSV パーティ編成ツール",
  shareImageAsset: ASSETS_OGP
});

const PageParty = () => <PartyBuilderScene />;

export default PageParty;
