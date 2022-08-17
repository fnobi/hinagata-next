import { FC, useRef, useEffect, useState } from "react";
import { css } from "@emotion/react";
import { em, percent, px } from "~/lib/cssUtil";
import { easeIn, easeOut, easeInOut } from "~/lib/easing";
import takeLoop from "~/lib/takeLoop";

const ELIST = {
  easeIn,
  easeOut,
  easeInOut
};

const wrapperStyle = css({
  position: "fixed",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  top: percent(0),
  left: percent(0),
  width: percent(100),
  height: percent(100)
});

const meterRootStyle = css({
  position: "relative",
  border: `solid ${px(1)} #000`,
  backgroundColor: "#cccccc",
  overflow: "hidden",
  canvas: { display: "block", position: "relative" }
});

const meterItemStyle = css({
  position: "absolute",
  left: percent(200),
  top: percent(200),
  width: em(1),
  height: em(1),
  marginLeft: em(-0.5),
  marginTop: em(-0.5),
  backgroundColor: "red",
  borderRadius: percent(50)
});

const meterAxisStyle = css({
  position: "absolute",
  backgroundColor: "#fff"
});
const meterXAxisStyle = css(meterAxisStyle, {
  left: percent(200),
  top: percent(0),
  height: percent(100),
  width: px(1)
});
const meterYAxisStyle = css(meterAxisStyle, {
  left: percent(0),
  top: percent(200),
  height: px(1),
  width: percent(100)
});

const EasingScene: FC = () => {
  const [name, setName] = useState("");
  const [factor, setFactor] = useState(2);
  const [animInterval] = useState(2000);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const meterItemRef = useRef<HTMLDivElement | null>(null);
  const xAxisRef = useRef<HTMLDivElement | null>(null);
  const yAxisRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const { current: canvas } = canvasRef;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const fn = ELIST[name];
    if (!fn) {
      return;
    }

    ctx.save();
    ctx.translate(0, canvas.height);
    ctx.scale(1, -1);
    ctx.beginPath();
    for (let i = 0; i <= canvas.width; i += 1) {
      const y = fn(factor)(i / canvas.width) * canvas.height;
      if (i) {
        ctx.lineTo(i, y);
      } else {
        ctx.moveTo(i, y);
      }
    }
    ctx.stroke();
    ctx.restore();
  }, [name, factor]);

  useEffect(() => {
    const { current: meterItem } = meterItemRef;
    const { current: xAxis } = xAxisRef;
    const { current: yAxis } = yAxisRef;
    if (!meterItem || !xAxis || !yAxis) {
      return () => {};
    }
    const fn = ELIST[name];
    if (!fn) {
      meterItem.style.top = "";
      meterItem.style.left = "";
      xAxis.style.left = "";
      yAxis.style.top = "";
      return () => {};
    }
    return takeLoop(t => {
      const v = (t % animInterval) / animInterval;
      const y = fn(factor)(v);
      meterItem.style.left = percent(v * 100);
      xAxis.style.left = percent(v * 100);
      meterItem.style.top = percent((1 - y) * 100);
      yAxis.style.top = percent((1 - y) * 100);
    });
  }, [name, factor]);

  return (
    <div css={wrapperStyle}>
      <div>
        <div css={meterRootStyle}>
          <p ref={xAxisRef} css={meterXAxisStyle} />
          <p ref={yAxisRef} css={meterYAxisStyle} />
          <canvas ref={canvasRef} width={500} height={500} />
          <p ref={meterItemRef} css={meterItemStyle} />
        </div>
        <p>
          <select value={name} onChange={e => setName(e.target.value)}>
            <option value="">-</option>
            {Object.keys(ELIST).map(n => (
              <option value={n} key={n}>
                {n}
              </option>
            ))}
          </select>
          &nbsp;
          <input
            type="number"
            min="1"
            step="0.1"
            style={{ width: em(4) }}
            value={factor}
            onChange={e => setFactor(Number(e.target.value))}
          />
        </p>
      </div>
    </div>
  );
};

export default EasingScene;
