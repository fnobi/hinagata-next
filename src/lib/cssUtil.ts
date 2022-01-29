const SP_VIEWPORT_SIZE = 1125;
const PC_VIEWPORT_SIZE = 2880;

type SizeKeyword = number | "auto";

const appendPostfix = (nums: SizeKeyword[], postfix: string) =>
  nums
    .map<string>(n => (typeof n === "string" ? n : `${n}${postfix}`))
    .join(" ");

export const px = (...nums: SizeKeyword[]) => appendPostfix(nums, "px");

export const percent = (...nums: SizeKeyword[]) => appendPostfix(nums, "%");

export const em = (...nums: SizeKeyword[]) => appendPostfix(nums, "em");

export const vw = (...nums: SizeKeyword[]) => appendPostfix(nums, "vw");

export const pcp = (...nums: SizeKeyword[]) =>
  vw(
    ...nums.map(n => (typeof n === "string" ? n : (n / PC_VIEWPORT_SIZE) * 100))
  );

export const spp = (...nums: SizeKeyword[]) =>
  vw(
    ...nums.map(n => (typeof n === "string" ? n : (n / SP_VIEWPORT_SIZE) * 100))
  );
