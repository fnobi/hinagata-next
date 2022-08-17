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
  canvas: { display: "block" }
});

const EasingScene: FC = () => {
  const [name, setName] = useState("");
  const [factor, setFactor] = useState(2);
  const [animInterval] = useState(2000);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const { current: canvas } = canvasRef;
    if (!canvas) {
      return () => {};
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return () => {};
    }

    const fn = ELIST[name];
    if (!fn) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return () => {};
    }

    return takeLoop(t => {
      const progress = (t % animInterval) / animInterval;
      const value = fn(factor)(progress);
      const animX = progress * canvas.width;
      const animY = value * canvas.height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(0, canvas.height);
      ctx.scale(1, -1);

      ctx.strokeStyle = "#fff";
      ctx.beginPath();
      ctx.moveTo(animX, 0);
      ctx.lineTo(animX, canvas.height);
      ctx.moveTo(0, animY);
      ctx.lineTo(canvas.width, animY);
      ctx.stroke();

      ctx.strokeStyle = "#000";
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

      ctx.fillStyle = "#f00";
      ctx.beginPath();
      ctx.moveTo(animX, animY);
      ctx.arc(animX, animY, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });
  }, [name, factor]);

  return (
    <div css={wrapperStyle}>
      <div>
        <div css={meterRootStyle}>
          <canvas ref={canvasRef} width={500} height={500} />
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
