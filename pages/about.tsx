import React from "react";
import Link from "next/link";
import { css } from "@emotion/core";
import { percent, px, em } from "~/lib/cssUtil";
import { useTypeRegiReducer } from "~/lib/useTypeRegi";
import sampleStore, { SampleState } from "~/store/sample";
import DefaultLayout from "~/layouts/DefaultLayout";

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

export default () => {
  const count = useTypeRegiReducer(sampleStore, (s: SampleState) => s.count);

  return (
    <DefaultLayout title="about">
      <div css={wrapperStyle}>
        <div css={titleStyle}>About</div>
        <button
          type="button"
          onClick={() => sampleStore.dispatch("incrementCounter", { value: 1 })}
        >
          count up:{count}
        </button>
        <p>
          <Link href="/">
            <a href="/">top</a>
          </Link>
        </p>
      </div>
    </DefaultLayout>
  );
};
