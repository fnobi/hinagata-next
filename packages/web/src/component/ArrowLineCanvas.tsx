import styled from "@emotion/styled";
import { useCallback, useEffect, useRef, useState } from "react";
import { percent, px } from "~/common/css-util";
import { type Point, drawArrowLine } from "~/feature/arrow-line-canvas";
import MockActionButton from "~/component/MockActionButton";

const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 540;
const DRAW_OPTIONS = {
  tileLength: 56,
  tileThickness: 28,
  pointRadius: 4,
  pointColor: "#333333"
};

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

  useEffect(() => {
    const image = new Image();
    image.onload = () => setIsImageLoaded(true);
    image.src = arrowImageSrc;
    imageRef.current = image;
    return () => setIsImageLoaded(false);
  }, [arrowImageSrc]);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !image || !ctx || !isImageLoaded) {
      return;
    }
    drawArrowLine(ctx, image, points, DRAW_OPTIONS);
  }, [points, isImageLoaded]);

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
