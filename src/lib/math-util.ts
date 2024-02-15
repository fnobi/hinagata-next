export const clamp = (min: number, max: number, value: number) =>
  Math.max(min, Math.min(max, value));

export const clampPeriod = (min: number, max: number, value: number) => {
  let v = value;
  const unit = max - min;
  while (v >= max) {
    v -= unit;
  }
  while (v < min) {
    v += unit;
  }
  return v;
};

export const lerp = (from: number, to: number, alpha: number) =>
  from + (to - from) * alpha;

export const randomInRange = (min: number, max: number) =>
  lerp(min, max, Math.random());

export const randomIntegerInRange = (min: number, max: number) =>
  Math.floor(randomInRange(min, max));

export const sample = <T>(arr: T[]) => arr[randomIntegerInRange(0, arr.length)];
