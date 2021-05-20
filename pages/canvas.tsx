import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { css } from "@emotion/core";
import { percent } from "~/lib/cssUtil";
import SamplePlayer from "~/local/SamplePlayer";

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

const CanvasAgent = dynamic(() => import("~/lib/CanvasAgent"), {
  ssr: false
});

const PageCanvas = () => {
  const playerRef = useRef<SamplePlayer | null>(null);

  useEffect(() => {
    const player = new SamplePlayer();
    playerRef.current = player;
    return () => {
      player.dispose();
    };
  }, []);

  return (
    <div css={canvasStyle}>
      <CanvasAgent playerRef={playerRef} />
    </div>
  );
};

export default PageCanvas;
