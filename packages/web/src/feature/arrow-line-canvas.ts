export type Point = { x: number; y: number };

export type ArrowLineOptions = {
  arrowWidth: number;
  arrowStep: number;
  tileThickness: number;
  baseFillColor: string;
  pointRadius: number;
  pointColor: string;
};

const drawBaseLine = (
  ctx: CanvasRenderingContext2D,
  points: Point[],
  { tileThickness, baseFillColor }: ArrowLineOptions
) => {
  if (points.length < 2) {
    return;
  }
  ctx.save();
  ctx.beginPath();
  points.forEach((point, i) => {
    if (i === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });
  ctx.lineWidth = tileThickness;
  ctx.lineJoin = "round";
  ctx.strokeStyle = baseFillColor;
  ctx.stroke();
  ctx.restore();
};

const drawArrowSegment = (
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  from: Point,
  to: Point,
  { arrowWidth, arrowStep, tileThickness }: ArrowLineOptions
) => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy);
  if (!length) {
    return;
  }
  const angle = Math.atan2(dy, dx);
  const tileCount = Math.ceil(length / arrowStep);

  ctx.save();
  ctx.translate(from.x, from.y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.rect(0, -tileThickness / 2, length, tileThickness);
  ctx.clip();
  for (let i = 0; i < tileCount; i += 1) {
    ctx.drawImage(
      image,
      i * arrowStep,
      -tileThickness / 2,
      arrowWidth,
      tileThickness
    );
  }
  ctx.restore();
};

const drawPoint = (
  ctx: CanvasRenderingContext2D,
  point: Point,
  { pointRadius, pointColor }: ArrowLineOptions
) => {
  ctx.beginPath();
  ctx.arc(point.x, point.y, pointRadius, 0, Math.PI * 2);
  ctx.fillStyle = pointColor;
  ctx.fill();
};

export const drawArrowLine = (
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  points: Point[],
  options: ArrowLineOptions
) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  drawBaseLine(ctx, points, options);
  points.slice(1).forEach((to, i) => {
    drawArrowSegment(ctx, image, points[i], to, options);
  });
  points.forEach(point => drawPoint(ctx, point, options));
};
