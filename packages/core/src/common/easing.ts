const multiEasing = (n: number, fns: ((nn: number) => number)[]) => {
  if (n >= 1) {
    return 1;
  }
  const s = fns.length;
  const i = Math.floor(n * s);
  const o = (1 / s) * i;
  return fns[i]((n - o) * s) / s + o;
};

export const easeIn = (f: number) => (n: number) => n ** f;

export const easeOut = (f: number) => (n: number) => 1 - (1 - n) ** f;

export const easeInOut = (f: number) => (n: number) =>
  multiEasing(n, [easeIn(f), easeOut(f)]);
