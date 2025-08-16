import { padLeft } from "~/common/lib/string-util";
import { parseNumber } from "~/common/lib/parser-helper";

export const formatDateLabel = (src: number | Date) => {
  const d = typeof src === "object" ? src : new Date(src);
  return [d.getMonth() + 1, d.getDate()].join("/");
};

export const formatTimeLabel = (src: number | Date) => {
  const d = typeof src === "object" ? src : new Date(src);
  return [d.getHours(), d.getMinutes()].map(n => padLeft(n, 2)).join(":");
};

export const formatDateTimeLabel = (src: number | Date) =>
  [formatDateLabel(src), formatTimeLabel(src)].join(" ");

export const formatTerm = (c: { startAt: number; endAt: number }) => {
  if (!c.startAt && !c.endAt) {
    return null;
  }
  return [
    c.startAt ? formatDateTimeLabel(c.startAt) : "",
    c.endAt ? formatDateTimeLabel(c.endAt) : ""
  ].join(" 〜 ");
};

export const calcClockIndex = (h: number, m: number) => h * 60 + m;

export const parseClock = (v: string) => {
  const matchData = v.match(/([0-9]+):([0-9]+)/);
  if (!matchData) {
    return -1;
  }
  const h = matchData[1];
  const m = matchData[2];
  return calcClockIndex(parseNumber(h), parseNumber(m));
};

export const formatClock = (d: Date) =>
  [d.getHours(), d.getMinutes()].map(n => padLeft(n, 2)).join(":");
