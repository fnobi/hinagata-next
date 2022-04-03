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

export const buildLinearGradient = (
  turn: number,
  ...pairs: [string, number][]
) =>
  `linear-gradient(${turn}deg, ${pairs
    .map(([p1, p2]) => `${p1} ${percent(p2)}`)
    .join(",")})`;
