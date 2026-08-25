import styled from "@emotion/styled";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { alphaColor, percent, px } from "~/common/css-util";
import { type Point, drawArrowLine } from "~/feature/arrow-line-canvas";
import MockActionButton from "~/component/MockActionButton";
import { MockRangeFormRow } from "~/component/mock-form-ui";

const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 540;
const ARROW_WIDTH = 56;
const ARROW_THICKNESS = 28;
const ARROW_COLOR = "#d1373b";
const BASE_FILL_COLOR = alphaColor(ARROW_COLOR, 0.5);
const SPACING_MIN = 1;
const SPACING_MAX = 5;
const SPACING_STEP = 0.1;
const SPACING_DEFAULT = 2;
const POINT_RADIUS = 4;
const POINT_COLOR = "#333333";

const Wrapper = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: px(8)
});

const Toolbar = styled.div({
  display: "flex",
  gap: px(8)
});

const StyledCanvas = styled.canvas({
  display: "block",
  width: percent(100),
  aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}`,
  border: "1px solid #cccccc",
  cursor: "crosshair",
  touchAction: "none"
});

const getCanvasPoint = (
  canvas: HTMLCanvasElement,
  event: { clientX: number; clientY: number }
): Point => {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * canvas.width,
    y: ((event.clientY - rect.top) / rect.height) * canvas.height
  };
};

const ArrowLineCanvas = ({ arrowImageSrc }: { arrowImageSrc: string }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [spacingLevel, setSpacingLevel] = useState(SPACING_DEFAULT);

  useEffect(() => {
    const image = new Image();
    image.onload = () => setIsImageLoaded(true);
    image.src = arrowImageSrc;
    imageRef.current = image;
    return () => setIsImageLoaded(false);
  }, [arrowImageSrc]);

  const drawOptions = useMemo(
    () => ({
      arrowWidth: ARROW_WIDTH,
      arrowStep: ARROW_WIDTH * spacingLevel,
      tileThickness: ARROW_THICKNESS,
      baseFillColor: BASE_FILL_COLOR,
      pointRadius: POINT_RADIUS,
      pointColor: POINT_COLOR
    }),
    [spacingLevel]
  );

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !image || !ctx || !isImageLoaded) {
      return;
    }
    drawArrowLine(ctx, image, points, drawOptions);
  }, [points, isImageLoaded, drawOptions]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  const handleClick = (event: { clientX: number; clientY: number }) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    setPoints(list => [...list, getCanvasPoint(canvas, event)]);
  };

  return (
    <Wrapper>
      <Toolbar>
        <MockActionButton
          action={
            points.length
              ? { type: "button", onClick: () => setPoints(list => list.slice(0, -1)) }
              : null
          }
        >
          ひとつ戻す
        </MockActionButton>
        <MockActionButton
          action={
            points.length ? { type: "button", onClick: () => setPoints([]) } : null
          }
        >
          クリア
        </MockActionButton>
      </Toolbar>
      <MockRangeFormRow
        label="矢印の間隔"
        value={spacingLevel}
        onChange={setSpacingLevel}
        min={SPACING_MIN}
        max={SPACING_MAX}
        step={SPACING_STEP}
        error={null}
      />
      <StyledCanvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        onClick={handleClick}
      />
    </Wrapper>
  );
};

export default ArrowLineCanvas;
