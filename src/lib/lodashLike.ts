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

export const padLeft = (num: number, count: number) => {
  return (new Array(count).join("0") + num.toString()).slice(-count);
};

export function filterMap<K, V>(
  src: Map<K, V>,
  handler: (value: V, key: K) => boolean
): Map<K, V> {
  const res = new Map<K, V>();
  [...src.entries()].forEach(([k, v]) => {
    if (handler(v, k)) {
      res.set(k, v);
    }
  });
  return res;
}

export function uniqBy<T, TT>(array: T[], fn: (item: T) => TT): T[] {
  return array.reduce(
    (prev, current) => {
      const factor: TT = fn(current);
      if (prev.map(fn).includes(factor)) {
        return prev;
      }
      return [...prev, current];
    },
    [] as T[]
  );
}

export function uniq<T>(array: T[]): T[] {
  return uniqBy(array, item => item);
}

export function sumBy<T>(array: T[], handler: (item: T) => number): number {
  return array.reduce((prev, current) => prev + handler(current), 0);
}

export function sum(array: number[]): number {
  return sumBy(array, item => item);
}

export function flatten<T>(matrix: T[][]): T[] {
  return matrix.reduce<T[]>((prev, curr) => [...prev, ...curr], []);
}

export function compact<T>(array: (T | null | undefined | false)[]): T[] {
  return array.reduce<T[]>((prev, curr) => (curr ? [...prev, curr] : prev), []);
}

export function compactMap<K, V>(m: Map<K | null, V>): Map<K, V> {
  const res = new Map<K, V>();
  [...m.entries()].forEach(([k, v]) => {
    if (k) {
      res.set(k, v);
    }
  });
  return res;
}

export function sortBy<T>(array: T[], fn: (item: T) => number) {
  return [...array].sort((a, b) => (fn(a) < fn(b) ? -1 : 1));
}

export function shuffle<T>(array: T[], length: number = array.length): T[] {
  if (length <= 0) {
    return [];
  }
  const index = Math.floor(array.length * Math.random());
  const target = array[index];
  const rest = [...array.slice(0, index), ...array.slice(index + 1)];
  return [target, ...shuffle(rest, length - 1)];
}

export function sample<T>(array: T[]): T {
  return array[Math.floor(array.length * Math.random())];
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

export function every<T>(arr: T[], fn: (item: T) => boolean) {
  return arr.reduce((prev, curr) => prev && fn(curr), true);
}

export function some<T>(arr: T[], fn: (item: T) => boolean) {
  return arr.reduce((prev, curr) => prev || fn(curr), false);
}

export function maxBy<T>(arr: T[], fn: (item: T) => number, base: number = 0) {
  return arr.reduce((prev, curr) => Math.max(fn(curr), prev), base);
}

export const trim = (str: string) => {
  // eslint-disable-next-line no-irregular-whitespace
  return str.replace(/^[ 　]+/g, "").replace(/[ 　]+$/g, "");
};

export function hasIntersection<T>(arr1: T[], arr2: T[]) {
  return !!arr1.find(item => arr2.includes(item));
}

export function gachaLogic<T>(arr: { rate: number; item: T }[]): T {
  const t = arr.reduce<number[]>((p, { rate }) => {
    const [l] = p;
    return [(l || 0) + rate, ...p];
  }, []);
  const [s] = t;
  const r = Math.floor(s * Math.random());
  const i = t.filter(n => n <= r).length;
  const e = arr[i];
  return e.item;
}

export function combination(arr: string[], count: number): string[][] {
  if (count <= 1) {
    return arr.map(n => [n]);
  }
  let copy = [...arr];
  const res = arr.map(n => {
    copy = copy.filter(nn => nn !== n);
    return combination(copy, count - 1).map(child => [n, ...child]);
  });
  return flatten(res);
}

export function promiseParallel<T, TT>(
  arr: T[],
  fn: (item: T) => Promise<TT>
): Promise<TT[]> {
  return Promise.all(arr.map(item => fn(item)));
}

export async function promiseSeries<T, TT>(
  arr: T[],
  fn: (item: T) => Promise<TT>,
  parallel: number = 1
): Promise<TT[]> {
  if (!arr.length) {
    return [];
  }
  const head = arr.slice(0, parallel);
  const rest = arr.slice(parallel);
  return [
    ...(await Promise.all(head.map(item => fn(item)))),
    ...(await promiseSeries(rest, fn, parallel))
  ];
}
