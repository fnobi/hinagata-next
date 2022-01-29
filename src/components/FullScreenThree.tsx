import { useEffect, useState, useMemo, FC, useRef } from "react";
import { css } from "@emotion/react";
import { WebGLRenderer, Camera, Scene } from "three";
import { px, percent } from "~/lib/cssUtil";

export interface ThreeAgent {
  activeCamera: Camera;
  activeScene: Scene;
  setSize: (w: number, h: number) => void;
  update: (time: number) => void;
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

const FullScreenThree: FC<{ agent: ThreeAgent }> = ({ agent }) => {
  const [renderer, setRenderer] = useState<WebGLRenderer | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const startTime = useMemo(() => Date.now(), []);

  useEffect(() => {
    const { current: canvas } = canvasRef;
    setRenderer(canvas ? new WebGLRenderer({ canvas }) : null);
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
      const elapsedMilliseconds = Date.now() - startTime;
      const elapsedSeconds = elapsedMilliseconds / 1000;
      agent.update(60 * elapsedSeconds);

      if (renderer) {
        renderer.render(agent.activeScene, agent.activeCamera);
      }

      timer = window.requestAnimationFrame(animate);
    };
    animate();
    return () => {
      window.cancelAnimationFrame(timer);
      agent.dispose();
    };
  }, [renderer]);

  return <canvas css={canvasStyle} ref={canvasRef} />;
};

export default FullScreenThree;
