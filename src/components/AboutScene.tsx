import { css, keyframes } from "@emotion/react";
import { percent, px, em } from "~/lib/cssUtil";
import { createTweetIntent } from "~/lib/shareUtil";
import { buildTransform } from "css-transform-builder";
import { FC } from "react";
import useSampleCounter from "~/local/useSampleCounter";
import { pcp, spp } from "~/local/emotionMixin";
import { pcStyle, spStyle } from "~/local/emotionMixin";
import { PAGE_ABOUT, PAGE_TOP } from "~/local/pagePath";
import PageLink from "~/components/PageLink";
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

const mainStyle = css({
  margin: em(1, 0),
  textAlign: "center"
});

const shake = keyframes({
  "0%,100%": {
    transform: buildTransform(t => t.translateY(0, "%"))
  },
  "50%": {
    transform: buildTransform(t => t.translateY(-3, "%"))
  }
});

const kvStyle = css(
  {
    backgroundImage: `url(${ASSETS_OGP_ABOUT.src})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
    backgroundPosition: "center",
    animation: `${shake} 1s infinite`
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

const textLinkStyle = css({
  color: "inherit"
});

const AboutScene: FC = () => {
  const [count, increment] = useSampleCounter();

  return (
    <div css={wrapperStyle}>
      <div css={titleStyle}>About</div>
      <button type="button" onClick={increment}>
        count up:{count}
      </button>
      <div css={mainStyle}>
        <div css={kvStyle} />
        <p>
          <a
            href={createTweetIntent({
              url: PAGE_ABOUT.url,
              text: "hinagata-next"
            })}
            target="_blank"
            rel="noopener noreferrer"
            css={textLinkStyle}
          >
            share this page with twitter
          </a>
        </p>
      </div>
      <p>
        <PageLink page={PAGE_TOP} css={textLinkStyle}>
          top
        </PageLink>
      </p>
    </div>
  );
};

export default AboutScene;
