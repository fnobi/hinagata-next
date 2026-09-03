export type Rect = { x: number; y: number; width: number; height: number };

export type Size = { width: number; height: number };

export type CropCorner = "nw" | "ne" | "sw" | "se";

const clampNum = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max);

export const MIN_SPLIT_COUNT = 2;
export const MAX_SPLIT_COUNT = 8;

export const clampSplitCount = (value: number): number =>
  clampNum(Math.round(value), MIN_SPLIT_COUNT, MAX_SPLIT_COUNT);

export const clampRect = (rect: Rect, bounds: Size): Rect => {
  const width = clampNum(rect.width, 1, bounds.width);
  const height = clampNum(rect.height, 1, bounds.height);
  const x = clampNum(rect.x, 0, bounds.width - width);
  const y = clampNum(rect.y, 0, bounds.height - height);
  return { x, y, width, height };
};

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

// 対角のコーナーを固定点として、指定した aspect（width / height）を保ったまま
// ドラッグ量が大きい方の軸を基準にリサイズする
export const resizeRectFromCornerLocked = (
  rect: Rect,
  corner: CropCorner,
  dx: number,
  dy: number,
  bounds: Size,
  aspect: number,
  minSize: number = 20
): Rect => {
  const isNorth = corner[0] === "n";
  const isWest = corner[1] === "w";
  const anchorX = isWest ? rect.x + rect.width : rect.x;
  const anchorY = isNorth ? rect.y + rect.height : rect.y;
  const spaceX = isWest ? anchorX : bounds.width - anchorX;
  const spaceY = isNorth ? anchorY : bounds.height - anchorY;
  const maxWidth = Math.min(spaceX, spaceY * aspect);

  const desiredWidth = isWest ? rect.width - dx : rect.width + dx;
  const desiredHeight = isNorth ? rect.height - dy : rect.height + dy;
  const driveByWidth =
    Math.abs(desiredWidth / rect.width - 1) >=
    Math.abs(desiredHeight / rect.height - 1);
  const candidateWidth = driveByWidth ? desiredWidth : desiredHeight * aspect;

  const width = clampNum(candidateWidth, Math.min(minSize, maxWidth), maxWidth);
  const height = width / aspect;
  return {
    x: isWest ? anchorX - width : anchorX,
    y: isNorth ? anchorY - height : anchorY,
    width,
    height
  };
};

// 現在の矩形の中心を保ったまま、その内側に収まる最大の aspect 矩形を返す
export const fitRectToAspect = (
  rect: Rect,
  aspect: number,
  bounds: Size
): Rect => {
  const isWiderThanAspect = rect.width / rect.height > aspect;
  const width = isWiderThanAspect ? rect.height * aspect : rect.width;
  const height = isWiderThanAspect ? rect.height : rect.width / aspect;
  return clampRect(
    {
      x: rect.x + (rect.width - width) / 2,
      y: rect.y + (rect.height - height) / 2,
      width,
      height
    },
    bounds
  );
};

// 矩形の四隅のうち、指定した点にもっとも近いものを返す。
// ハンドルの見た目のサイズに関わらず、タップした位置から一番近い角が
// 必ず操作対象になるようにするために使う
export const nearestCorner = (
  rect: Rect,
  point: { x: number; y: number }
): CropCorner => {
  const corners: { corner: CropCorner; x: number; y: number }[] = [
    { corner: "nw", x: rect.x, y: rect.y },
    { corner: "ne", x: rect.x + rect.width, y: rect.y },
    { corner: "sw", x: rect.x, y: rect.y + rect.height },
    { corner: "se", x: rect.x + rect.width, y: rect.y + rect.height }
  ];
  return corners.reduce((nearest, candidate) => {
    const distanceTo = (c: { x: number; y: number }) =>
      (c.x - point.x) ** 2 + (c.y - point.y) ** 2;
    return distanceTo(candidate) < distanceTo(nearest) ? candidate : nearest;
  }).corner;
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
