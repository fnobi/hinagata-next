import { css } from "@emotion/react";
import { FC } from "react";
import { percent, px, em } from "~/lib/cssUtil";
import { Article } from "~/local/articleData";

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

const ArticleDetailScene: FC<{ article: Article }> = ({ article }) => (
  <div css={wrapperStyle}>
    <div css={titleStyle}>Articles: {article.title}</div>
  </div>
);

export default ArticleDetailScene;
