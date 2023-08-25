export function groupBy<T, P>(arr: T[], identifier: (val: T) => P) {
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
}

export function uniqBy<T, TT>(arr: T[], fn: (item: T) => TT): T[] {
  const head = arr.slice(0, 1);
  const tail = arr.slice(1);
  return tail.reduce<T[]>(
    (prev, curr) => (prev.map(fn).includes(fn(curr)) ? prev : [...prev, curr]),
    head
  );
}

export function uniq<T>(arr: T[]): T[] {
  return uniqBy(arr, item => item);
}

export function sumBy<T>(arr: T[], handler: (item: T) => number): number {
  return arr.reduce((prev, current) => prev + handler(current), 0);
}

export function sum(arr: number[]): number {
  return sumBy(arr, item => item);
}

export function flatten<T>(matrix: T[][]): T[] {
  return matrix.reduce<T[]>((prev, curr) => [...prev, ...curr], []);
}

export function compact<T>(arr: (T | null | undefined | false)[]): T[] {
  return arr.reduce<T[]>((prev, curr) => (curr ? [...prev, curr] : prev), []);
}

export function sortBy<T>(arr: T[], fn: (item: T) => number) {
  return [...arr].sort((a, b) => (fn(a) < fn(b) ? -1 : 1));
}

export function shuffle<T>(arr: T[], length: number = arr.length): T[] {
  if (length <= 0) {
    return [];
  }
  const index = Math.floor(arr.length * Math.random());
  const target = arr[index];
  const rest = [...arr.slice(0, index), ...arr.slice(index + 1)];
  return [target, ...shuffle(rest, length - 1)];
}

export function sample<T>(arr: T[]): T | null {
  return arr[Math.floor(arr.length * Math.random())] || null;
}

export const makeArray = (length: number) => new Array(length).fill(0);

export function traverseSquare<T>(
  cols: number,
  rows: number,
  handler: (c: number, r: number) => T
): T[] {
  return flatten(
    makeArray(cols).map((z, c) => makeArray(rows).map((zz, r) => handler(c, r)))
  );
}

export function difference<T>(arr1: T[], arr2: T[]) {
  return arr1.filter(item => !arr2.includes(item));
}

export function intersection<T>(arr1: T[], arr2: T[]) {
  return arr1.filter(item => arr2.includes(item));
}

export function hasIntersection<T>(arr1: T[], arr2: T[]) {
  return !!arr1.find(item => arr2.includes(item));
}

export function every<T>(arr: T[], fn: (item: T) => boolean) {
  return arr.length
    ? arr.reduce((prev, curr) => prev && fn(curr), true)
    : false;
}

export function some<T>(arr: T[], fn: (item: T) => boolean) {
  return arr.reduce((prev, curr) => prev || fn(curr), false);
}

export function maxBy<T>(arr: T[], fn: (item: T) => number, base: number = 0) {
  return arr.reduce((prev, curr) => Math.max(fn(curr), prev), base);
}

export function gachaLogic<T>(
  arr: { rate: number; item: T }[],
  seed: number = Math.random()
): T {
  const t = arr.reduce<number[]>((p, { rate }) => {
    const [l] = p;
    return [(l || 0) + rate, ...p];
  }, []);
  const [s] = t;
  const r = Math.floor(s * seed);
  const i = t.filter(n => n <= r).length;
  const e = arr[i];
  return e.item;
}

export function combination<T>(arr: T[], count: number): T[][] {
  if (count <= 0) {
    return [[]];
  }
  return arr.reduce<T[][]>((prev, curr, i) => {
    const children = combination(arr.slice(i + 1), count - 1);
    return [...prev, ...children.map(child => [curr, ...child])];
  }, []);
}

export function mapObject<T>(
  obj: { [k: string]: T },
  fn: (v: T, k: string) => T
) {
  return Object.entries(obj).reduce<{ [k: string]: T }>(
    (p, [k, v]) => ({
      ...p,
      [k]: fn(v, k)
    }),
    {}
  );
}

export function toggleArrayItem<T>(arr: T[], item: T, flag: boolean) {
  return flag ? uniq([...arr, item]) : arr.filter(i => i !== item);
}