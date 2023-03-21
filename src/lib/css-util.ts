import { CSSInterpolation } from "@emotion/serialize";

export type CSSSizeKeyword = number | "auto";

const appendPostfix = (nums: CSSSizeKeyword[], postfix: string) =>
  nums
    .map<string>(n => (typeof n === "string" ? n : `${n}${postfix}`))
    .join(" ");

export const px = (...nums: CSSSizeKeyword[]) => appendPostfix(nums, "px");

export const percent = (...nums: CSSSizeKeyword[]) => appendPostfix(nums, "%");

export const em = (...nums: CSSSizeKeyword[]) => appendPostfix(nums, "em");

export const vw = (...nums: CSSSizeKeyword[]) => appendPostfix(nums, "vw");

export const vh = (...nums: CSSSizeKeyword[]) => appendPostfix(nums, "vh");

export const deg = (...nums: CSSSizeKeyword[]) => appendPostfix(nums, "deg");

export const buildLinearGradient = (
  pairs: [string, number][],
  turn: number = 0
) =>
  `linear-gradient(${[
    ...(turn ? [deg(turn)] : []),
    pairs.map(([p1, p2]) => [p1, percent(p2)].join(" ")).join()
  ].join()})`;

export const linkReset: CSSInterpolation = {
  display: "inline-block",
  textDecoration: "none",
  color: "inherit"
};

export const buttonReset: CSSInterpolation = {
  padding: 0,
  margin: 0,
  appearance: "none",
  border: "none",
  background: "none",
  font: "inherit",
  textAlign: "inherit",
  color: "inherit",
  cursor: "pointer"
};
