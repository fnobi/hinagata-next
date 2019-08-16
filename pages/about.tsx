import React from "react";
import Link from "next/link";
import { connect } from "react-redux";
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
  top: 0,
  left: 0,
  width: "100%",
  height: "100%"
});

const titleStyle = css({
  fontWeight: "bold",
  marginBottom: "0.5em"
});

const About = (props: Props) => {
  const { count, setCount } = props;

  return (
    <DefaultLayout>
      <div css={wrapperStyle}>
        <div css={titleStyle}>About</div>
        <button type="button" onClick={() => setCount(count + 1)}>
          count up:{count}
        </button>
        <p>
          <Link href="/">top</Link>
        </p>
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
)(About);
