export const px = (...nums: number[]) => {
  return nums.map<string>(n => `${n}px`).join(" ");
};

export const percent = (...nums: number[]) => {
  return nums.map<string>(n => `${n}%`).join(" ");
};

export const em = (...nums: number[]) => {
  return nums.map<string>(n => `${n}em`).join(" ");
};
