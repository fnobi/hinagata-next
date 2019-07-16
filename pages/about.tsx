import React from "react";
import Link from "next/link";
import { css } from "@emotion/core";
import DefaultLayout from "~/layouts/DefaultLayout";
import sampleStore from "~/store/sample";
import { connectToHooks } from "~/lib/typeRegiHelper";

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

export default () => {
  const sampleState = connectToHooks(sampleStore);
  const { count } = sampleState;

  return (
    <DefaultLayout>
      <div css={wrapperStyle}>
        <div css={titleStyle}>About</div>
        <button
          type="button"
          onClick={() => sampleStore.dispatch("incrementCounter", { value: 1 })}
        >
          count up:{count}
        </button>
        <p>
          <Link href="/">top</Link>
        </p>
      </div>
    </DefaultLayout>
  );
};
