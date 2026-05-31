export const parseBoolean = (src: unknown): boolean => !!src;

export const parseNumber = (src: unknown, d: number = 0): number =>
  Number(src || d);

export const parseString = (src: unknown, d: string = ""): string =>
  String(src || d);

export const parseArray = <T>(src: unknown, fn: (item: unknown) => T): T[] =>
  Array.isArray(src) ? src.map(v => fn(v)) : [];

export const parseObject = <T>(
  src: unknown,
  fn: (s: Record<keyof T, unknown>) => T
): T =>
  fn((src && typeof src === "object" ? src : {}) as Record<keyof T, unknown>);

export const parseStringUnion = <T extends string>(
  src: unknown,
  validValues: readonly T[]
): T | null => {
  const c = src as T;
  return validValues.includes(c) ? c : null;
};

export const parseIndexer = <T>(
  src: unknown,
  parse: (s: unknown) => T
): { [k: string]: T } => {
  const res: { [k: string]: T } = {};
  if (src && typeof src === "object") {
    const o = src as Record<string, unknown>;
    Object.entries(o).forEach(([k, v]) => {
      res[k] = parse(v);
    });
  }
  return res;
};
