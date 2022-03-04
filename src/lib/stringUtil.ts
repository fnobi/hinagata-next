export const padLeft = (num: number, count: number) =>
  (new Array(count).join("0") + num.toString()).slice(-count);

export const trim = (str: string) =>
  // eslint-disable-next-line no-irregular-whitespace
  str.replace(/^[ 　]+/g, "").replace(/[ 　]+$/g, "");

export const formatTime = (time: number | Date) => {
  const d = typeof time === "number" ? new Date(time) : time;
  return [padLeft(d.getHours(), 2), padLeft(d.getMinutes(), 2)].join(":");
};

export const formatDateValue = (time: number | Date) => {
  const d = typeof time === "number" ? new Date(time) : time;
  return [
    d.getFullYear(),
    padLeft(d.getMonth() + 1, 2),
    padLeft(d.getDate(), 2)
  ].join("-");
};

export const formatDatetimeValue = (time: number | Date) =>
  [formatDateValue(time), formatTime(time)].join("T");
