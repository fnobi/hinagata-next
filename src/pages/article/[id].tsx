import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { PageEntry } from "~/lib/Page-entry";
import { PAGE_ARTICLE_INDEX } from "~/local/page-path";
import articleData, { Article } from "~/local/articleData";
import { makePageMetaTitle } from "~/components/DefaultMetaSettings";
import MetaSettings from "~/components/MetaSettings";
import ArticleDetailScene from "~/components/ArticleDetailScene";

type Props = {
  id: string;
  article: Article;
};

const PageArticleDetail: NextPage<Props> = ({ id, article }) => (
  <MetaSettings
    title={makePageMetaTitle(article.title, "Article")}
    page={PAGE_ARTICLE_INDEX.child(id)}
  >
    <ArticleDetailScene article={article} />
  </MetaSettings>
);

export const getStaticProps: GetStaticProps<Props> = async ({
  params = {}
}) => {
  const { id: idParam } = params;
  const id = String(idParam);
  const article = articleData[id];
  return {
    props: {
      id,
      article
    }
  };
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: PageEntry.makeStaticPaths(
    PAGE_ARTICLE_INDEX,
    Object.keys(articleData)
  ),
  fallback: false
});

export default PageArticleDetail;
