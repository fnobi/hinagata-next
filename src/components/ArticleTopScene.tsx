import { css } from "@emotion/react";
import { percent, px, em } from "~/lib/cssUtil";
import { FC } from "react";
import articleData from "~/local/articleData";
import { PAGE_ARTICLE_INDEX } from "~/local/pagePath";
import PageLink from "~/components/PageLink";

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

const textLinkStyle = css({
  color: "inherit"
});

const ArticleTopScene: FC = () => (
  <div css={wrapperStyle}>
    <div css={titleStyle}>Articles</div>
    <ul>
      {Object.entries(articleData).map(([id, item]) => (
        <li key={id}>
          <PageLink page={PAGE_ARTICLE_INDEX.child(id)} css={textLinkStyle}>
            {item.title}
          </PageLink>
        </li>
      ))}
    </ul>
  </div>
);

export default ArticleTopScene;
