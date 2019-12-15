import React, { useEffect, useRef } from "react";
import { css } from "@emotion/core";
import DefaultLayout from "~/layouts/DefaultLayout";
import { px, percent } from "~/lib/cssUtil";
import ThreeCube from "~/lib/TheeCube";

const canvasStyle = css({
  position: "fixed",
  display: "block",
  left: px(0),
  top: px(0),
  width: percent(100),
  height: percent(100)
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
    };
  }, [canvasRef]);

  return (
    <DefaultLayout>
      <canvas css={canvasStyle} ref={canvasRef} />
    </DefaultLayout>
  );
};
