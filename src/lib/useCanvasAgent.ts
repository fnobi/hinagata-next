import { MutableRefObject, useEffect } from "react";

export interface CanvasPlayer {
  dispose: () => void;
  resize: () => void;
  update: (delta: number) => void;
  canvas: HTMLCanvasElement;
}

const useCanvasAgent = (opts: {
  playerRef: MutableRefObject<CanvasPlayer | null>;
  wrapperRef: MutableRefObject<HTMLDivElement | null>;
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
}) => {
  const { playerRef, wrapperRef, canvasRef } = opts;

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
};

export default useCanvasAgent;
