import { GetStaticProps } from "next";
import Link from "next/link";
import { css } from "@emotion/react";
import { percent, px, em } from "~/lib/cssUtil";
import { useSampleCounter } from "~/store/sample";
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

const kvStyle = css({
  width: px(ASSETS_OGP_ABOUT.width / 2),
  height: px(ASSETS_OGP_ABOUT.height / 2),
  backgroundImage: `url(${ASSETS_OGP_ABOUT.src})`,
  backgroundRepeat: "no-repeat",
  backgroundSize: "contain",
  backgroundPosition: "center"
});

const PageAbout = () => {
  const [count, increment] = useSampleCounter();

  return (
    <div css={wrapperStyle}>
      <div css={titleStyle}>About</div>
      <button type="button" onClick={increment}>
        count up:{count}
      </button>
      <div css={kvStyle} />
      <p>
        <Link href="/">
          <a href="/">top</a>
        </Link>
      </p>
    </div>
  );
};

export const getStaticProps: GetStaticProps<PageMetaExtend> = async () => ({
  props: {
    pageTitle: "About",
    pagePath: "/about/",
    pageShareImage: ASSETS_OGP_ABOUT
  }
});

export default PageAbout;
