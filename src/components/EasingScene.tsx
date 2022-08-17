import { FC, useRef, useEffect, useState } from "react";
import { css } from "@emotion/react";
import { em, percent } from "~/lib/cssUtil";

const easeIn = (f: number) => (n: number) => n ** f;
const easeOut = (f: number) => (n: number) => 1 - (1 - n) ** f;
const easeInOut = (f: number) => (n: number) =>
  n < 0.5 ? easeIn(f)(n * 2) * 0.5 : easeOut(f)((n - 0.5) * 2) * 0.5 + 0.5;

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
  height: percent(100),
  canvas: { backgroundColor: "#cccccc" }
});

const EasingScene: FC = () => {
  const [name, setName] = useState("");
  const [factor, setFactor] = useState(2);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
    for (let i = 0; i < canvas.width; i += 1) {
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

  return (
    <div css={wrapperStyle}>
      <div>
        <canvas ref={canvasRef} width={500} height={500} />
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
