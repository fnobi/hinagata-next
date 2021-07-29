import { useState, MouseEvent } from "react";
import Link from "next/link";
import { css } from "@emotion/react";
import { px, percent, em } from "~/lib/cssUtil";
import { useSampleCounter } from "~/store/sample";

const wrapperStyle = css({
  position: "fixed",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  top: px(0),
  left: px(0),
  width: percent(100),
  height: percent(100)
});

const titleStyle = css({
  fontWeight: "bold",
  marginBottom: em(0.5)
});

const PageIndex = () => {
  const [mouse, setMouse] = useState<[number, number]>([0, 0]);
  const [count, increment] = useSampleCounter();

  const updateMouse = (e: MouseEvent) => {
    setMouse([e.pageX, e.pageY]);
  };

  return (
    <div css={wrapperStyle} onMouseMove={updateMouse}>
      <div css={titleStyle}>Welcome to Next.js!</div>
      <button type="button" onClick={increment}>
        count up:{count}
      </button>
      <p>
        <Link href="/about">
          <a>about</a>
        </Link>
      </p>
      <p>{mouse.join(",")}</p>
    </div>
  );
};

export default PageIndex;
