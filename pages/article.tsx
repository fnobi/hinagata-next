import { NextPage } from "next";
import { css } from "@emotion/react";
import { percent, px, em } from "~/lib/cssUtil";
import Link from "next/link";
import { PAGE_ARTICLE_DETAIL, PAGE_ARTICLE_INDEX } from "~/local/pagePath";
import articleData from "~/local/articleData";
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

const PageArticleIndex: NextPage = () => {
  return (
    <MetaSettings
      title={makePageMetaTitle("Articles")}
      pagePath={PAGE_ARTICLE_INDEX}
    >
      <div css={wrapperStyle}>
        <div css={titleStyle}>Articles</div>
        <ul>
          {Object.entries(articleData).map(([id, item]) => (
            <li key={id}>
              <Link href={PAGE_ARTICLE_DETAIL(id)} passHref>
                <a href="passHref">{item.title}</a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </MetaSettings>
  );
};

export default PageArticleIndex;
