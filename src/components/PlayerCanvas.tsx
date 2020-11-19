import React, { useEffect, useRef } from "react";
import { css } from "@emotion/core";
import { percent } from "~/lib/cssUtil";

const canvasStyle = css({
  position: "fixed",
  top: percent(0),
  left: percent(0),
  width: percent(100),
  height: percent(100)
});

type PlayerInitializer = (
  canvas: HTMLCanvasElement
) => { dispose: () => void; resize: (size: { x: number; y: number }) => void };

const PlayerCanvas = (props: { initializer: PlayerInitializer }) => {
  const { initializer } = props;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const { current: canvas } = canvasRef;
    if (!canvas) {
      return () => {};
    }

    const { dispose, resize } = initializer(canvas);

    const handleResize = () => {
      const size = { x: window.innerWidth, y: window.innerHeight };
      resize(size);
    };
    window.addEventListener("resize", handleResize);
    window.setTimeout(handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      dispose();
    };
  }, []);

  return <canvas ref={canvasRef} css={canvasStyle} />;
};

export default PlayerCanvas;
