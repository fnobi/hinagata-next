import React, { useState } from "react";
import Link from "next/link";
import { css } from "@emotion/core";
import { px, percent, em } from "~/lib/cssUtil";
import useTypeRegi from "~/lib/useTypeRegi";
import sampleStore from "~/store/sample";
import DefaultLayout from "~/layouts/DefaultLayout";

const wrapperStyle = css({
  position: "fixed",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  top: px(20),
  left: px(0),
  width: percent(100),
  height: percent(100)
});

const titleStyle = css({
  fontWeight: "bold",
  marginBottom: em(0.5)
});

export default () => {
  const [mouse, setMouse] = useState<[number, number]>([0, 0]);
  const sample = useTypeRegi(sampleStore);
  const { count } = sample;

  const updateMouse = (e: React.MouseEvent) => {
    setMouse([e.pageX, e.pageY]);
  };

  return (
    <DefaultLayout>
      <div css={wrapperStyle} onMouseMove={updateMouse}>
        <div css={titleStyle}>Welcome to Next.js!</div>
        <button
          type="button"
          onClick={() => sampleStore.dispatch("incrementCounter", { value: 1 })}
        >
          count up:{count}
        </button>
        <p>
          <Link href="/about">
            <a href="/about">about</a>
          </Link>
        </p>
        <p>{mouse.join(",")}</p>
      </div>
    </DefaultLayout>
  );
};
