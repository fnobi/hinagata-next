export const groupBy = <T, P>(arr: T[], identifier: (val: T) => P) => {
  const m = new Map<P, T[]>();
  arr.forEach(item => {
    const prop = identifier(item);
    const collection = m.get(prop);
    if (collection) {
      collection.push(item);
    } else {
      m.set(prop, [item]);
    }
  });
  return m;
};

export const uniqBy = <T, TT>(arr: T[], fn: (item: T) => TT) => {
  const head = arr.slice(0, 1);
  const tail = arr.slice(1);
  return tail.reduce<T[]>(
    (prev, curr) => (prev.map(fn).includes(fn(curr)) ? prev : [...prev, curr]),
    head
  );
};

export const uniq = <T>(arr: T[]) => uniqBy(arr, item => item);

export const sumBy = <T>(arr: T[], handler: (item: T) => number) =>
  arr.reduce((prev, current) => prev + handler(current), 0);

export const sum = (arr: number[]) => sumBy(arr, item => item);

export const flatten = <T>(matrix: T[][]) =>
  matrix.reduce<T[]>((prev, curr) => [...prev, ...curr], []);

export const compact = <T>(arr: (T | null | undefined | false)[]) =>
  arr.reduce<T[]>((prev, curr) => (curr ? [...prev, curr] : prev), []);

export const sortBy = <T>(arr: T[], fn: (item: T) => number) =>
  [...arr].sort((a, b) => (fn(a) < fn(b) ? -1 : 1));

export const shuffle = <T>(arr: T[], length: number = arr.length): T[] => {
  if (length <= 0) {
    return [];
  }
  const index = Math.floor(arr.length * Math.random());
  const target = arr[index];
  const rest = [...arr.slice(0, index), ...arr.slice(index + 1)];
  return [target, ...shuffle(rest, length - 1)];
};

export const sample = <T>(arr: T[]): T | null =>
  arr[Math.floor(arr.length * Math.random())] || null;

export const makeArray = (length: number) => new Array(length).fill(0);

export const traverseSquare = <T>(
  cols: number,
  rows: number,
  handler: (c: number, r: number) => T
): T[] =>
  flatten(
    makeArray(cols).map((z, c) => makeArray(rows).map((zz, r) => handler(c, r)))
  );

export const difference = <T>(arr1: T[], arr2: T[]) =>
  arr1.filter(item => !arr2.includes(item));

export const intersection = <T>(arr1: T[], arr2: T[]) =>
  arr1.filter(item => arr2.includes(item));

export const hasIntersection = <T>(arr1: T[], arr2: T[]) =>
  !!arr1.find(item => arr2.includes(item));

export const every = <T>(arr: T[], fn: (item: T) => boolean) =>
  arr.length ? arr.reduce((prev, curr) => prev && fn(curr), true) : false;

export const some = <T>(arr: T[], fn: (item: T) => boolean) =>
  arr.reduce((prev, curr) => prev || fn(curr), false);

export const maxBy = <T>(arr: T[], fn: (item: T) => number, base: number = 0) =>
  arr.reduce((prev, curr) => Math.max(fn(curr), prev), base);

export const gachaLogic = <T>(
  arr: { rate: number; item: T }[],
  seed: number = Math.random()
): T => {
  const t = arr.reduce<number[]>((p, { rate }) => {
    const [l] = p;
    return [(l || 0) + rate, ...p];
  }, []);
  const [s] = t;
  const r = Math.floor(s * seed);
  const i = t.filter(n => n <= r).length;
  const e = arr[i];
  return e.item;
};

export const combination = <T>(arr: T[], count: number): T[][] => {
  if (count <= 0) {
    return [[]];
  }
  return arr.reduce<T[][]>((prev, curr, i) => {
    const children = combination(arr.slice(i + 1), count - 1);
    return [...prev, ...children.map(child => [curr, ...child])];
  }, []);
};

export const mapObject = <T>(
  obj: { [k: string]: T },
  fn: (v: T, k: string) => T
) =>
  Object.entries(obj).reduce<{ [k: string]: T }>(
    (p, [k, v]) => ({
      ...p,
      [k]: fn(v, k)
    }),
    {}
  );

export const toggleArrayItem = <T>(arr: T[], item: T, flag: boolean) =>
  flag ? uniq([...arr, item]) : arr.filter(i => i !== item);
