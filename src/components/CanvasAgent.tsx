import React, { useEffect, useRef } from "react";
import { css } from "@emotion/core";
import { percent } from "~/lib/cssUtil";

const wrapperStyle = css({
  position: "absolute",
  top: percent(0),
  left: percent(0),
  width: percent(100),
  height: percent(100),
  canvas: {
    position: "absolute",
    top: percent(0),
    left: percent(0),
    width: percent(100),
    height: percent(100)
  }
});

export interface CanvasPlayer {
  dispose: () => void;
  resize: () => void;
  update: (delta: number) => void;
  canvas: HTMLCanvasElement;
}

const CanvasAgent = (props: { initializer: () => CanvasPlayer }) => {
  const { initializer } = props;
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

  return <div ref={wrapperRef} css={wrapperStyle} />;
};

export default CanvasAgent;
