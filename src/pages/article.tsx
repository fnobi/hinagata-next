import { NextPage } from "next";
import { PAGE_ARTICLE_INDEX } from "~/local/pagePath";
import ArticleTopScene from "~/components/ArticleTopScene";
import { makePageMetaTitle } from "~/components/DefaultMetaSettings";
import MetaSettings from "~/components/MetaSettings";

const PageArticleIndex: NextPage = () => (
  <MetaSettings title={makePageMetaTitle("Articles")} page={PAGE_ARTICLE_INDEX}>
    <ArticleTopScene />
  </MetaSettings>
);

export default PageArticleIndex;
