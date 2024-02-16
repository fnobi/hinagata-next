export const clamp = (min: number, max: number, value: number) =>
  Math.max(min, Math.min(max, value));

export const clampPeriod = (min: number, max: number, value: number) => {
  const l = max - min;
  const p = (value - min) % l;
  const c = p < 0 ? p + l : p;
  return c + min;
};

export const lerp = (from: number, to: number, alpha: number) =>
  from + (to - from) * alpha;

export const randomInRange = (min: number, max: number) =>
  lerp(min, max, Math.random());

export const randomIntegerInRange = (min: number, max: number) =>
  Math.floor(randomInRange(min, max));

export const sample = <T>(arr: T[]) => arr[randomIntegerInRange(0, arr.length)];
