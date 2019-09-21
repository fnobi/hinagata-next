const appendPostfix = (nums: number[], postfix: string) => {
  return nums.map<string>(n => `${n}${postfix}`).join(" ");
}

export const px = (...nums: number[]) => {
  return appendPostfix(nums, 'px');
};

export const percent = (...nums: number[]) => {
  return appendPostfix(nums, '%');
};

export const em = (...nums: number[]) => {
  return appendPostfix(nums, 'em');
};
