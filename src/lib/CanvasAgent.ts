import { createElement, MutableRefObject, useEffect, useRef } from "react";

export interface CanvasPlayer {
  dispose: () => void;
  resize: () => void;
  update: (delta: number) => void;
  canvas: HTMLCanvasElement;
}

const CanvasAgent = (props: {
  playerRef: MutableRefObject<CanvasPlayer | null>;
}) => {
  const { playerRef } = props;
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const { current: player } = playerRef;
    const { current: wrapper } = wrapperRef;
    if (!player || !wrapper) {
      return () => {};
    }
    const { canvas } = player;
    wrapper.appendChild(canvas);
    canvasRef.current = canvas;
    return () => wrapper.removeChild(canvas);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const { current: player } = playerRef;
      if (player) {
        player.resize();
      }
    };
    window.addEventListener("resize", handleResize);
    window.setTimeout(handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let timer = -1;
    let prevTime = Date.now();
    const loop = () => {
      timer = window.requestAnimationFrame(loop);
      const now = Date.now();
      const { current: player } = playerRef;
      if (player) {
        player.update(now - prevTime);
      }
      prevTime = now;
    };
    timer = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(timer);
  }, []);

  return createElement("div", { ref: wrapperRef });
};

export default CanvasAgent;
