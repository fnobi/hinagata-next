import React, { useEffect, useRef } from "react";
import { css } from "@emotion/core";
import Link from "next/link";
import DefaultLayout from "~/layouts/DefaultLayout";
import { px, percent } from "~/lib/cssUtil";
import ThreeFullScreen from "~/lib/TheeFullScreen";

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

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) {
      return () => {};
    }

    const threePlane = new ThreeFullScreen(el);

    let timer: number;
    function animate() {
      timer = window.requestAnimationFrame(animate);
      // threeCube.update();
      threePlane.render();
    }
    animate();
    return () => {
      window.cancelAnimationFrame(timer);
      // TODO: dispose three
    };
  }, [canvasRef]);

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
