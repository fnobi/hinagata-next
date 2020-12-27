import { css } from "@emotion/core";

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
  textAlign: "inherit"
});
