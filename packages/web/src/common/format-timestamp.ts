const pad2 = (n: number) => String(n).padStart(2, "0");

// ファイル名に使える形式（コロンなどを含まない）で "YYYYMMDD-HHmmss" に整形する
export const formatTimestampForFilename = (date: Date): string => {
  const datePart = [
    date.getFullYear(),
    pad2(date.getMonth() + 1),
    pad2(date.getDate())
  ].join("");
  const timePart = [date.getHours(), date.getMinutes(), date.getSeconds()]
    .map(pad2)
    .join("");
  return `${datePart}-${timePart}`;
};
