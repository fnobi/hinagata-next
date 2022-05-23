import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { css } from "@emotion/react";
import { percent, px, em } from "~/lib/cssUtil";
import { PAGE_ARTICLE_INDEX } from "~/local/pagePath";
import articleData, { Article } from "~/local/articleData";
import { makePageMetaTitle } from "~/components/DefaultMetaSettings";
import MetaSettings from "~/components/MetaSettings";

const wrapperStyle = css({
  position: "fixed",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  top: px(0),
  left: px(0),
  width: percent(100),
  height: percent(100)
});

const titleStyle = css({
  fontWeight: "bold",
  marginBottom: em(0.5)
});

type Props = {
  id: string;
  article: Article;
};

const PageArticleDetail: NextPage<Props> = ({ id, article }) => (
  <MetaSettings
    title={makePageMetaTitle(article.title, "Article")}
    page={PAGE_ARTICLE_INDEX.child(id)}
  >
    <div css={wrapperStyle}>
      <div css={titleStyle}>Articles: {article.title}</div>
    </div>
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
  paths: Object.keys(articleData).map(
    id => PAGE_ARTICLE_INDEX.child(id).basePath
  ),
  fallback: false
});

export default PageArticleDetail;
