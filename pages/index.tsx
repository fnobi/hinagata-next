import React from "react";
import { useState } from "react";
import Link from "next/link";
import { css } from "@emotion/core";
import DefaultLayout from "~/layouts/DefaultLayout";
import sampleStore, { SampleState } from "~/store/sample";
import { connectStore } from "~/lib/typeRegiHelper";

type Props = SampleState;

const wrapperStyle = css({
  position: "fixed",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  top: 20,
  left: 0,
  width: "100%",
  height: "100%"
});

const titleStyle = css({
  fontWeight: "bold",
  marginBottom: "0.5em"
});

export default connectStore(sampleStore, (props: Props) => {
  const { count } = props;
  const [mouse, setMouse] = useState<[number, number]>([0, 0]);

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
          <Link href="/about">about</Link>
        </p>
        <p>{mouse.join(",")}</p>
      </div>
    </DefaultLayout>
  );
});
