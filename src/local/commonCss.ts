import { css } from "@emotion/react";
import { pcp, spp } from "~/lib/cssUtil";
import { MQ_DESKTOP, MQ_MOBILE } from "~/lib/MQ";

export const globalStyle = css({
  body: {
    fontFamily: "sans-serif",
    fontSize: 16,
    lineHeight: 1.5,
    textSizeAdjust: "100%"
  }
});

export const linkReset = css({
  display: "inline-block",
  textDecoration: "none",
  color: "inherit"
});

export const buttonReset = css({
  padding: 0,
  margin: 0,
  appearance: "none",
  border: "none",
  background: "none",
  font: "inherit",
  textAlign: "inherit",
  color: "inherit"
});

export const responsiveImageTile = (
  image: {
    src: string;
    width: number;
    height: number;
  },
  image2?: {
    src: string;
    width: number;
    height: number;
  }
) =>
  css({
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundImage: image2 ? undefined : `url(${image.src})`,
    [MQ_MOBILE]: {
      width: spp(image.width),
      height: spp(image.height),
      backgroundImage: image2 ? `url(${image.src})` : undefined
    },
    [MQ_DESKTOP]: {
      width: pcp(image2 ? image2.width : image.width),
      height: pcp(image2 ? image2.height : image.height),
      backgroundImage: image2 ? `url(${image2.src})` : undefined
    }
  });
