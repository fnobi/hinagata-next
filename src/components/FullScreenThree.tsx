import React, { useEffect, useRef } from "react";
import { css } from "@emotion/core";
import { px, percent } from "~/lib/cssUtil";

interface ThreeAgent {
  setRenderer: (el: HTMLCanvasElement) => void;
  setSize: (w: number, h: number) => void;
  update: () => void;
  render: () => void;
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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) {
      return;
    }
    agent.setRenderer(el);
  }, [canvasRef]);

  useEffect(() => {
    agent.setSize(window.innerWidth, window.innerHeight);
    const handler = () => {
      agent.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  useEffect(() => {
    let timer: number;
    const animate = () => {
      timer = window.requestAnimationFrame(animate);
      agent.update();
      agent.render();
    };
    animate();
    return () => {
      window.cancelAnimationFrame(timer);
      agent.dispose();
    };
  }, []);

  return <canvas css={canvasStyle} ref={canvasRef} />;
};
