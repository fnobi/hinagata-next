export const delay = (ms: number = 0) =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });

export const promiseParallel = <T, TT>(
  arr: T[],
  fn: (item: T) => Promise<TT>
): Promise<TT[]> => Promise.all(arr.map(item => fn(item)));

export const promiseSeries = async <T, TT>(
  arr: T[],
  fn: (item: T) => Promise<TT>,
  parallel: number = 1
): Promise<TT[]> => {
  if (!arr.length) {
    return [];
  }
  const head = arr.slice(0, parallel);
  const rest = arr.slice(parallel);
  return [
    ...(await Promise.all(head.map(item => fn(item)))),
    ...(await promiseSeries(rest, fn, parallel))
  ];
};
