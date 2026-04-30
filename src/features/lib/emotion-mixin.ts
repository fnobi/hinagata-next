import { css } from "@emotion/react";
import { type CSSInterpolation } from "@emotion/serialize";
import {
  type CSSSizeKeyword,
  PRIMITIVE_COLOR,
  px,
  vw
} from "~/common/lib/css-util";

// NOTE: デザインファイルのサイズに合わせる
const SP_VIEWPORT_SIZE = 1125;
const PC_VIEWPORT_SIZE = 2880;

const BREAKPOINT_MIN_PC = 800;

const cssVarsStyle = css`
  :root {
    color-scheme: light dark;

    --c-bg: #f8fafc;
    --c-surface: #ffffff;
    --c-border: #e2e8f0;
    --c-text-main: #1e293b;
    --c-text-sub: #64748b;
    --c-accent: #6366f1;
    --c-accent-light: #e0e7ff;
    --c-accent-hover: #4f46e5;
    --c-accent-deep: #4338ca;
    --c-success: #10b981;
    --c-error: #ef4444;
    --c-error-bg: #fef2f2;
    --c-tag-accent-bg: #eef2ff;
    --c-tooltip-bg: #1e293b;
    --c-tooltip-text: #ffffff;
    --c-tooltip-value: rgba(255, 255, 255, 0.7);

    --c-shadow-sm: rgba(0, 0, 0, 0.2);
    --c-shadow-md: rgba(0, 0, 0, 0.25);
    --c-black-overlay: rgba(0, 0, 0, 0.45);
    --c-text-sub-50: rgba(100, 116, 139, 0.5);
    --c-text-sub-60: rgba(100, 116, 139, 0.6);
    --c-text-sub-80: rgba(100, 116, 139, 0.8);
    --c-overlay: rgba(30, 41, 59, 0.4);
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --c-bg: #0f172a;
      --c-surface: #1e293b;
      --c-border: #334155;
      --c-text-main: #f1f5f9;
      --c-text-sub: #94a3b8;
      --c-accent-light: #1e1b4b;
      --c-error-bg: #450a0a;
      --c-tag-accent-bg: #1e1b4b;
      --c-tooltip-bg: #f1f5f9;
      --c-tooltip-text: #1e293b;
      --c-tooltip-value: rgba(30, 41, 59, 0.7);

      --c-text-sub-50: rgba(148, 163, 184, 0.5);
      --c-text-sub-60: rgba(148, 163, 184, 0.6);
      --c-text-sub-80: rgba(148, 163, 184, 0.8);
      --c-overlay: rgba(0, 0, 0, 0.6);
    }
  }
`;

export const globalStyle = css(cssVarsStyle, {
  body: {
    fontFamily: "sans-serif",
    fontSize: 16,
    lineHeight: 1.5,
    textSizeAdjust: "100%",
    background: "var(--c-bg)",
    color: "var(--c-text-main)"
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

export const THEME_COLOR = {
  ...PRIMITIVE_COLOR,
  DARK: "#333333",
  BROWN: "#712636",
  BG_YELLOW: "#FFFABA",
  WAVE_YELLOW: "#ffeb3c",
  PINK: "#E4007F"
} satisfies Record<string, `#${string}`>;
