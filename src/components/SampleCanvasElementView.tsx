import { useRef } from "react";
import { css } from "@emotion/react";
import { percent } from "~/lib/cssUtil";
import useCanvasAgent from "~/lib/useCanvasAgent";
import SampleCanvasElementPlayer from "~/local/SampleCanvasElementPlayer";

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

const SampleCanvasElementView = () => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  useCanvasAgent({
    initializer: () => new SampleCanvasElementPlayer(),
    wrapperRef
  });
  return <div css={canvasStyle} ref={wrapperRef} />;
};

export default SampleCanvasElementView;
