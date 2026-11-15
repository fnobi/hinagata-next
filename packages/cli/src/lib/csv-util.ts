const escapeCsvCell = (cell: string): string =>
  /[",\n]/.test(cell) ? `"${cell.replace(/"/g, '""')}"` : cell;

export const toCsvRow = (cells: string[]): string =>
  cells.map(escapeCsvCell).join(",");

export const toCsv = (header: string[], rows: string[][]): string =>
  [header, ...rows].map(toCsvRow).join("\n");
