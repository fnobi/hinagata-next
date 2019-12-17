import React, { useEffect, useCallback, useState } from "react";
import { css } from "@emotion/core";
import { WebGLRenderer, Camera, Scene } from "three";
import { px, percent } from "~/lib/cssUtil";

export interface ThreeAgent {
  activeCamera: Camera;
  activeScene: Scene;
  setSize: (w: number, h: number) => void;
  update: () => void;
  dispose: () => void;
}

const canvasStyle = css({
  position: "fixed",
  display: "block",
  left: px(0),
  top: px(0),
  width: percent(100),
  height: percent(100)
});

export default (props: { agent: ThreeAgent }) => {
  const { agent } = props;
  const [renderer, setRenderer] = useState<WebGLRenderer | null>(null);

  const canvasRef = useCallback(el => {
    if (!el) {
      return;
    }
    setRenderer(new WebGLRenderer({ canvas: el }));
  }, []);

  useEffect(() => {
    const handler = () => {
      const size: [number, number] = [window.innerWidth, window.innerHeight];
      agent.setSize(...size);
      if (renderer) {
        renderer.setSize(...size);
      }
    };
    window.addEventListener("resize", handler);
    handler();
    return () => window.removeEventListener("resize", handler);
  }, [renderer]);

  useEffect(() => {
    let timer: number;
    const animate = () => {
      timer = window.requestAnimationFrame(animate);
      agent.update();
      if (renderer) {
        renderer.render(agent.activeScene, agent.activeCamera);
      }
    };
    animate();
    return () => {
      window.cancelAnimationFrame(timer);
      agent.dispose();
    };
  }, [renderer]);

  return <canvas css={canvasStyle} ref={canvasRef} />;
};
