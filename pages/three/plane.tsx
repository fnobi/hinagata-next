import React, { useEffect, useRef, useMemo } from "react";
import { css } from "@emotion/core";
import Link from "next/link";
import DefaultLayout from "~/layouts/DefaultLayout";
import { px, percent } from "~/lib/cssUtil";
import ThreeFullScreen from "~/lib/ThreeFullScreen";

const SWITCH_LINK = "/three/cube/";

const canvasStyle = css({
  position: "fixed",
  display: "block",
  left: px(0),
  top: px(0),
  width: percent(100),
  height: percent(100)
});

const uiStyle = css({
  position: "fixed",
  padding: px(16),
  right: px(16),
  top: px(16),
  backgroundColor: `rgba(0,0,0,0.5)`
});

export default () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const threeFullScreen = useMemo(() => new ThreeFullScreen(), []);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) {
      return;
    }
    threeFullScreen.setRenderer(el);
  }, [canvasRef]);

  useEffect(() => {
    threeFullScreen.setSize(window.innerWidth, window.innerHeight);
    const handler = () => {
      threeFullScreen.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  useEffect(() => {
    let timer: number;
    const animate = () => {
      timer = window.requestAnimationFrame(animate);
      threeFullScreen.update();
      threeFullScreen.render();
    };
    animate();
    return () => {
      window.cancelAnimationFrame(timer);
      threeFullScreen.dispose();
    };
  }, []);

  return (
    <DefaultLayout>
      <canvas css={canvasStyle} ref={canvasRef} />
      <div css={uiStyle}>
        <Link href={SWITCH_LINK}>
          <a href={SWITCH_LINK}>cube</a>
        </Link>
      </div>
    </DefaultLayout>
  );
};
