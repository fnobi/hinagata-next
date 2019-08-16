import React from "react";
import { useState } from "react";
import { connect } from "react-redux";
import Link from "next/link";
import { css } from "@emotion/core";
import DefaultLayout from "~/layouts/DefaultLayout";
import { State } from "~/reducers";
import { incrementCounter } from "~/reducers/sampleReducer";

type Props = {
  count: number;
  setCount(count: number): void;
};

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

const Index = (props: Props) => {
  const [mouse, setMouse] = useState<[number, number]>([0, 0]);
  const { count, setCount } = props;

  const updateMouse = (e: React.MouseEvent) => {
    setMouse([e.pageX, e.pageY]);
  };

  return (
    <DefaultLayout>
      <div css={wrapperStyle} onMouseMove={updateMouse}>
        <div css={titleStyle}>Welcome to Next.js!</div>
        <button type="button" onClick={() => setCount(count + 1)}>
          count up:{count}
        </button>
        <p>
          <Link href="/about">about</Link>
        </p>
        <p>{mouse.join(",")}</p>
      </div>
    </DefaultLayout>
  );
};

const mapState = (state: State) => {
  return {
    count: state.sampleReducer.count
  };
};

export default connect(
  mapState,
  {
    setCount: incrementCounter
  }
)(Index);
