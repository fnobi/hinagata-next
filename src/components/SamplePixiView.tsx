import React, { useEffect, useRef } from "react";
import { css } from "@emotion/core";
import { percent } from "~/lib/cssUtil";
import useCanvasAgent from "~/lib/useCanvasAgent";
import SamplePixiPlayer from "~/local/SamplePixiPlayer";

const canvasStyle = css({
  position: "fixed",
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

const SamplePixiView = () => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const playerRef = useRef<SamplePixiPlayer | null>(null);

  useEffect(() => {
    const player = new SamplePixiPlayer();
    playerRef.current = player;
    return () => {
      player.dispose();
    };
  }, []);

  useCanvasAgent({ wrapperRef, canvasRef, playerRef });

  return <div css={canvasStyle} ref={wrapperRef} />;
};

export default SamplePixiView;
