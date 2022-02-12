import { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { css } from "@emotion/react";
import { percent, px, em } from "~/lib/cssUtil";
import { PAGE_ABOUT, PAGE_TOP } from "~/local/pagePath";
import useSampleCounter from "~/local/useSampleCounter";
import { pcp, spp } from "~/local/emotionMixin";
import { pcStyle, spStyle } from "~/local/emotionMixin";
import { PageMetaExtend } from "~/components/MetaSettings";
import ASSETS_OGP_ABOUT from "~/assets/meta/ogp-about.png";

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

const kvStyle = css(
  {
    backgroundImage: `url(${ASSETS_OGP_ABOUT.src})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
    backgroundPosition: "center"
  },
  spStyle({
    width: spp(ASSETS_OGP_ABOUT.width),
    height: spp(ASSETS_OGP_ABOUT.height)
  }),
  pcStyle({
    width: pcp(ASSETS_OGP_ABOUT.width),
    height: pcp(ASSETS_OGP_ABOUT.height)
  })
);

const PageAbout: NextPage = () => {
  const [count, increment] = useSampleCounter();

  return (
    <div css={wrapperStyle}>
      <div css={titleStyle}>About</div>
      <button type="button" onClick={increment}>
        count up:{count}
      </button>
      <div css={kvStyle} />
      <p>
        <Link href={PAGE_TOP}>
          <a href={PAGE_TOP}>top</a>
        </Link>
      </p>
    </div>
  );
};

export const getStaticProps: GetStaticProps<PageMetaExtend> = async () => ({
  props: {
    pageTitle: "About",
    pagePath: PAGE_ABOUT,
    pageShareImage: ASSETS_OGP_ABOUT
  }
});

export default PageAbout;
