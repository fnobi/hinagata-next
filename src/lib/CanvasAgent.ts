import { createElement, useEffect, useRef } from "react";

export interface CanvasPlayer {
  dispose: () => void;
  resize: () => void;
  update: (delta: number) => void;
  canvas: HTMLCanvasElement;
}

const CanvasAgent = (opts: { initializer: () => CanvasPlayer }) => {
  const { initializer } = opts;
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<CanvasPlayer | null>(null);

  useEffect(() => {
    const { current: wrapper } = wrapperRef;
    if (!wrapper) {
      return () => {};
    }
    const player = initializer();
    playerRef.current = player;
    wrapper.appendChild(player.canvas);
    return () => {
      player.dispose();
      wrapper.removeChild(player.canvas);
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

  return createElement("div", { ref: wrapperRef });
};

export default CanvasAgent;
