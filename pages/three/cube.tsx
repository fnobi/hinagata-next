import React, { useEffect, useRef } from "react";
import { css } from "@emotion/core";
import Link from "next/link";
import DefaultLayout from "~/layouts/DefaultLayout";
import { px, percent } from "~/lib/cssUtil";
import ThreeCube from "~/lib/TheeCube";

const SWITCH_LINK = "/three/plane/";

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

    const threeCube = new ThreeCube(el);

    let timer: number;
    function animate() {
      timer = window.requestAnimationFrame(animate);
      threeCube.update();
      threeCube.render();
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
          <a href={SWITCH_LINK}>plane</a>
        </Link>
      </div>
    </DefaultLayout>
  );
};
