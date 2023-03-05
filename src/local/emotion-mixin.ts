import { css } from "@emotion/react";
import { CSSInterpolation } from "@emotion/serialize";
import { CSSSizeKeyword, px, vw } from "~/lib/css-util";

// NOTE: デザインファイルのサイズに合わせる
const SP_VIEWPORT_SIZE = 1125;
const PC_VIEWPORT_SIZE = 2880;

const BREAKPOINT_MIN_PC = 800;

export const globalStyle = css({
  body: {
    fontFamily: "sans-serif",
    fontSize: 16,
    lineHeight: 1.5,
    textSizeAdjust: "100%"
  }
});

export const spStyle = (styles: CSSInterpolation) =>
  css({
    [`@media(max-width: ${px(BREAKPOINT_MIN_PC - 1)})`]: styles
  });

export const pcStyle = (styles: CSSInterpolation) =>
  css({
    [`@media(min-width: ${px(BREAKPOINT_MIN_PC)})`]: styles
  });

export const pcp = (...nums: CSSSizeKeyword[]) =>
  vw(
    ...nums.map(n => (typeof n === "string" ? n : (n / PC_VIEWPORT_SIZE) * 100))
  );

export const spp = (...nums: CSSSizeKeyword[]) =>
  vw(
    ...nums.map(n => (typeof n === "string" ? n : (n / SP_VIEWPORT_SIZE) * 100))
  );
