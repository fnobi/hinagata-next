export type Rect = { x: number; y: number; width: number; height: number };

export type Size = { width: number; height: number };

export type CropCorner = "nw" | "ne" | "sw" | "se";

const clampNum = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max);

export const clampRect = (rect: Rect, bounds: Size): Rect => {
  const width = clampNum(rect.width, 1, bounds.width);
  const height = clampNum(rect.height, 1, bounds.height);
  const x = clampNum(rect.x, 0, bounds.width - width);
  const y = clampNum(rect.y, 0, bounds.height - height);
  return { x, y, width, height };
};

export const moveRect = (
  rect: Rect,
  dx: number,
  dy: number,
  bounds: Size
): Rect => clampRect({ ...rect, x: rect.x + dx, y: rect.y + dy }, bounds);

// ドラッグ中のハンドルと対角のコーナーを固定点として、動かした側のコーナーを
// bounds と最小サイズでクランプしてから矩形を再構築する
export const resizeRectFromCorner = (
  rect: Rect,
  corner: CropCorner,
  dx: number,
  dy: number,
  bounds: Size,
  minSize: number = 20
): Rect => {
  const isNorth = corner[0] === "n";
  const isWest = corner[1] === "w";
  const anchorX = isWest ? rect.x + rect.width : rect.x;
  const anchorY = isNorth ? rect.y + rect.height : rect.y;
  const draggedX = isWest ? rect.x : rect.x + rect.width;
  const draggedY = isNorth ? rect.y : rect.y + rect.height;
  const nextDraggedX = isWest
    ? clampNum(draggedX + dx, 0, anchorX - minSize)
    : clampNum(draggedX + dx, anchorX + minSize, bounds.width);
  const nextDraggedY = isNorth
    ? clampNum(draggedY + dy, 0, anchorY - minSize)
    : clampNum(draggedY + dy, anchorY + minSize, bounds.height);
  return {
    x: Math.min(anchorX, nextDraggedX),
    y: Math.min(anchorY, nextDraggedY),
    width: Math.abs(anchorX - nextDraggedX),
    height: Math.abs(anchorY - nextDraggedY)
  };
};

export const splitRectIntoColumns = (rect: Rect, columns: number): Rect[] => {
  const baseWidth = Math.floor(rect.width / columns);
  return Array.from({ length: columns }, (_, i) => ({
    x: rect.x + baseWidth * i,
    y: rect.y,
    width:
      i === columns - 1 ? rect.width - baseWidth * (columns - 1) : baseWidth,
    height: rect.height
  }));
};
