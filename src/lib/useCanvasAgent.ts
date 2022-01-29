import { MutableRefObject, useEffect, useRef } from "react";

export interface CanvasPlayer {
  dispose: () => void;
  resize: () => void;
  update: (delta: number) => void;
  canvas: HTMLCanvasElement;
}

function useCanvasAgent<T extends CanvasPlayer>(opts: {
  initializer: () => T;
  wrapperRef: MutableRefObject<HTMLDivElement | null>;
}) {
  const { initializer, wrapperRef } = opts;

  const playerRef = useRef<T | null>(null);

  useEffect(() => {
    const { current: wrapper } = wrapperRef;
    if (!wrapper) {
      return () => {};
    }
    const player = initializer();
    playerRef.current = player;
    const { canvas } = player;
    wrapper.appendChild(canvas);
    return () => {
      wrapper.removeChild(canvas);
      player.dispose();
    };
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

  return { playerRef };
}

export default useCanvasAgent;
