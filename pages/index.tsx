import { useState, MouseEvent } from "react";
import { NextPage } from "next";
import Link from "next/link";
import { css } from "@emotion/react";
import { percent, em } from "~/lib/cssUtil";
import { PAGE_ABOUT } from "~/local/pagePath";
import useSampleCounter from "~/local/useSampleCounter";

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

const titleStyle = css({
  fontWeight: "bold",
  marginBottom: em(0.5)
});

const PageIndex: NextPage = () => {
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
        <Link href={PAGE_ABOUT}>
          <a href={PAGE_ABOUT}>about</a>
        </Link>
      </p>
      <p>{mouse.join(",")}</p>
    </div>
  );
};

export default PageIndex;
